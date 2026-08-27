/**
 * Sync large static assets with the R2 asset store, so they stay out of git.
 *
 * pull  Download every file listed in each prefix's manifest from the public
 *       ASSETS_BASE_URL into its (gitignored) static/ directory. Needs no
 *       credentials, works in CI and fork PRs, and is a fast no-op once local
 *       files match the manifest. Files no longer in the manifest are pruned.
 *
 * push  Upload local directories to R2 with rclone and regenerate the
 *       manifests (maintainers only; reads R2_* credentials from .env).
 *       Prefixes marked "readonly" in assets.config.json belong to another
 *       repo holding the canonical copy and are never pushed from here.
 *
 * Usage: node scripts/assets.mjs <pull|push> [prefix-filter...]
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'scripts/assets.config.json'), 'utf8'));
const MANIFEST = '.manifest.json';
const CONCURRENCY = 8;

/** Load KEY=VALUE pairs from .env without overriding the real environment. */
function loadDotEnv() {
	const file = path.join(root, '.env');
	if (!fs.existsSync(file)) return;
	for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
		const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
		if (match && !(match[1] in process.env)) process.env[match[1]] = match[2];
	}
}

/** Relative POSIX paths of all files under dir, skipping dot-entries. */
function walk(dir, prefix = '') {
	if (!fs.existsSync(dir)) return [];
	const files = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (entry.name.startsWith('.')) continue;
		const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
		if (entry.isDirectory()) files.push(...walk(path.join(dir, entry.name), rel));
		else files.push(rel);
	}
	return files.sort();
}

function sha256(file) {
	return createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function selectAssets(filters) {
	const assets = filters.length
		? config.assets.filter((a) => filters.some((f) => a.prefix.includes(f) || a.dir.includes(f)))
		: config.assets;
	if (!assets.length) throw new Error(`no assets match: ${filters.join(', ')}`);
	return assets;
}

async function mapConcurrent(items, fn) {
	const queue = [...items.entries()];
	const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
		for (let next = queue.shift(); next; next = queue.shift()) await fn(next[1], next[0]);
	});
	await Promise.all(workers);
}

async function pull(filters) {
	const base = process.env.ASSETS_BASE_URL ?? config.baseUrl;
	let failed = false;
	for (const asset of selectAssets(filters)) {
		const dir = path.join(root, asset.dir);
		const url = `${base}/${asset.prefix}`;
		let manifest;
		try {
			const res = await fetch(`${url}/${MANIFEST}`, { cache: 'no-store' });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			manifest = await res.json();
		} catch (err) {
			console.error(
				`${asset.prefix}: cannot fetch manifest from ${url}/${MANIFEST} (${err.message ?? err})\n` +
					`  Has this prefix been pushed, and is the bucket publicly reachable at ${base}?`
			);
			failed = true;
			continue;
		}

		fs.mkdirSync(dir, { recursive: true });
		const wanted = new Map(manifest.files.map((f) => [f.path, f]));
		const missing = manifest.files.filter((f) => {
			const local = path.join(dir, f.path);
			if (!fs.existsSync(local)) return true;
			return fs.statSync(local).size !== f.size || sha256(local) !== f.sha256;
		});

		await mapConcurrent(missing, async (f) => {
			const res = await fetch(`${url}/${f.path}`);
			if (!res.ok) throw new Error(`${asset.prefix}/${f.path}: HTTP ${res.status}`);
			const data = Buffer.from(await res.arrayBuffer());
			const digest = createHash('sha256').update(data).digest('hex');
			if (digest !== f.sha256)
				throw new Error(`${asset.prefix}/${f.path}: checksum mismatch after download`);
			const local = path.join(dir, f.path);
			fs.mkdirSync(path.dirname(local), { recursive: true });
			fs.writeFileSync(`${local}.tmp`, data);
			fs.renameSync(`${local}.tmp`, local);
		});

		const pruned = walk(dir).filter((rel) => !wanted.has(rel));
		for (const rel of pruned) fs.rmSync(path.join(dir, rel));

		console.log(
			`${asset.prefix} -> ${asset.dir}: ${wanted.size} files, ` +
				`${missing.length} downloaded, ${pruned.length} pruned`
		);
	}
	if (failed) process.exit(1);
}

function rclone(env, args) {
	const result = spawnSync('rclone', args, { env: { ...process.env, ...env }, stdio: 'inherit' });
	if (result.status !== 0) throw new Error(`rclone ${args[0]} failed (exit ${result.status})`);
}

async function push(filters) {
	loadDotEnv();
	for (const key of ['R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET'])
		if (!process.env[key]) throw new Error(`${key} is not set (put it in .env)`);
	const env = {
		RCLONE_S3_PROVIDER: 'Cloudflare',
		RCLONE_S3_ENDPOINT: process.env.R2_ENDPOINT,
		RCLONE_S3_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
		RCLONE_S3_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY
	};
	const bucket = process.env.R2_BUCKET;

	for (const asset of selectAssets(filters)) {
		if (asset.readonly) {
			console.log(
				`${asset.prefix}: readonly here (canonical copy lives in another repo), skipping`
			);
			continue;
		}
		const dir = path.join(root, asset.dir);
		const files = walk(dir);
		if (!files.length) throw new Error(`${asset.dir} is empty - refusing to push`);

		const manifest = {
			generated: new Date().toISOString(),
			files: files.map((rel) => {
				const file = path.join(dir, rel);
				return { path: rel, size: fs.statSync(file).size, sha256: sha256(file) };
			})
		};

		// Files first, manifest last, so a concurrent pull never sees a manifest
		// referencing objects that are not uploaded yet.
		const remote = `:s3:${bucket}/${asset.prefix}`;
		rclone(env, [
			'sync',
			dir,
			remote,
			'--exclude',
			'.*',
			'--exclude',
			'.*/**',
			'--header-upload',
			'Cache-Control: public, max-age=86400'
		]);
		const tmp = path.join(os.tmpdir(), `assets-manifest-${process.pid}.json`);
		fs.writeFileSync(tmp, JSON.stringify(manifest, null, '\t') + '\n');
		rclone(env, [
			'copyto',
			tmp,
			`${remote}/${MANIFEST}`,
			'--header-upload',
			'Cache-Control: no-cache'
		]);
		fs.rmSync(tmp);
		console.log(`${asset.dir} -> ${asset.prefix}: ${files.length} files pushed`);
	}
}

const [command, ...filters] = process.argv.slice(2);
try {
	if (command === 'pull') await pull(filters);
	else if (command === 'push') await push(filters);
	else {
		console.error('usage: node scripts/assets.mjs <pull|push> [prefix-filter...]');
		process.exit(1);
	}
} catch (err) {
	console.error(err.message ?? err);
	process.exit(1);
}

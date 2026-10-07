// Updates the shadcn-svelte components without losing the site's own edits.
//
// The CLI can only overwrite, so it runs in a scratch copy of the project and
// every file it produces is three-way merged: base = the previous upstream
// version kept in `shadcn-upstream/ui`, ours = the component in
// `src/lib/components/ui`, theirs = the new upstream version. Edits that touch
// lines upstream also changed end up as conflict markers to resolve by hand;
// everything else merges silently. The snapshot is replaced afterwards, so the
// next run has the right base.
import { execFileSync, spawnSync } from 'node:child_process';
import {
	cpSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	readdirSync,
	rmSync,
	symlinkSync,
	writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const UI = 'src/lib/components/ui';
const SNAPSHOT = 'shadcn-upstream/ui';
const run = (cmd, args, opts = {}) =>
	spawnSync(cmd, args, { cwd: root, encoding: 'utf8', ...opts });

const components = readdirSync(join(root, UI), { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name);

// 1. Fresh upstream output. The CLI runs `svelte-kit sync` in the project it
//    writes to, so the scratch copy needs the config, the sources and the
//    installed dependencies. Dependency changes land in the scratch
//    package.json and are copied over below. The CLI comes from
//    devDependencies: its `svelte` peer resolves from the project, which the
//    npx cache cannot provide under legacy peer resolution.
const scratch = mkdtempSync(join(tmpdir(), 'shadcn-update-'));
// The lockfile tells the CLI which package manager to use; without it, it asks.
for (const file of [
	'components.json',
	'package.json',
	'package-lock.json',
	'tsconfig.json',
	'vite.config.ts',
	'src'
]) {
	cpSync(join(root, file), join(scratch, file), { recursive: true });
}
symlinkSync(join(root, 'node_modules'), join(scratch, 'node_modules'));
execFileSync(
	'npx',
	['shadcn-svelte', 'add', '-y', '-o', '--no-deps-install', '--cwd', scratch, ...components],
	{ stdio: 'inherit', cwd: root }
);

// 2. Three-way merge, file by file. Base and theirs go through prettier first,
//    so formatting differences never show up as conflicts.
const prettier = (text, path) => {
	const result = run('npx', ['prettier', '--stdin-filepath', path], { input: text });
	return result.status === 0 ? result.stdout : text;
};
const walk = (dir) =>
	readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
		entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
	);
const conflicts = [];
const added = [];
const merged = [];
const work = mkdtempSync(join(tmpdir(), 'shadcn-merge-'));
for (const file of walk(join(scratch, UI))) {
	const rel = relative(join(scratch, UI), file);
	const target = join(root, UI, rel);
	const theirs = prettier(readFileSync(file, 'utf8'), target);
	if (!existsSync(target)) {
		mkdirSync(dirname(target), { recursive: true });
		writeFileSync(target, theirs);
		added.push(rel);
		continue;
	}
	const snapshot = join(root, SNAPSHOT, rel);
	const base = existsSync(snapshot) ? prettier(readFileSync(snapshot, 'utf8'), target) : null;
	const ours = readFileSync(target, 'utf8');
	// Nothing changed upstream, or the site already matches it
	if (ours === theirs || base === theirs) continue;
	if (base === null) {
		// No previous upstream version to merge against: keep ours, flag it
		conflicts.push(`${rel} (no snapshot, left unchanged; compare with the new upstream file)`);
		continue;
	}
	const paths = ['ours', 'base', 'theirs'].map((name) => join(work, name));
	writeFileSync(paths[0], ours);
	writeFileSync(paths[1], base);
	writeFileSync(paths[2], theirs);
	const result = run('git', [
		'merge-file',
		'-p',
		'--diff3',
		'-L',
		'ours (site)',
		'-L',
		'base (previous upstream)',
		'-L',
		'theirs (new upstream)',
		...paths
	]);
	writeFileSync(target, result.stdout);
	merged.push(rel);
	if (result.status > 0) {
		conflicts.push(`${rel} (${result.status} conflict${result.status > 1 ? 's' : ''})`);
	}
}
const clean = merged.filter((rel) => !conflicts.some((c) => c.startsWith(rel)));
if (clean.length) run('npx', ['prettier', '--write', ...clean.map((rel) => join(UI, rel))]);

// 3. Dependency bumps the CLI wanted
const before = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const after = JSON.parse(readFileSync(join(scratch, 'package.json'), 'utf8'));
const bumps = [];
for (const section of ['dependencies', 'devDependencies']) {
	for (const [name, version] of Object.entries(after[section] ?? {})) {
		if (before[section]?.[name] !== version) {
			before[section] = { ...before[section], [name]: version };
			bumps.push(`${name}@${version}`);
		}
	}
}
if (bumps.length)
	writeFileSync(join(root, 'package.json'), JSON.stringify(before, null, '\t') + '\n');

// 4. The new upstream output becomes the base for the next run
rmSync(join(root, SNAPSHOT), { recursive: true, force: true });
cpSync(join(scratch, UI), join(root, SNAPSHOT), { recursive: true });
rmSync(scratch, { recursive: true, force: true });
rmSync(work, { recursive: true, force: true });

console.log(`merged: ${merged.length}, added: ${added.length}, snapshot refreshed`);
if (bumps.length) console.log(`package.json bumped: ${bumps.join(', ')} (run npm install)`);
if (added.length) console.log('new upstream files:\n  ' + added.join('\n  '));
if (conflicts.length) {
	console.log('to resolve by hand:\n  ' + conflicts.join('\n  '));
	process.exitCode = 1;
}

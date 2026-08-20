/**
 * Generate responsive background variants from the high-resolution sources.
 *
 * Hero backgrounds are painted at 100vw, so a phone and a 4K desktop would
 * otherwise download the same file. For every source image this writes a
 * ladder of widths as `<name>-<width>.webp` into static/images/backgrounds/
 * (the R2-backed, gitignored directory) and regenerates the width table in
 * src/lib/assets/background-variants.ts, which is committed and drives the
 * srcset at build time - so the site builds even before `assets:pull` has run.
 *
 * Only genuine high-resolution sources are used: anything narrower than
 * --min-source-width is skipped, because re-encoding an already-compressed
 * 1200px web export into smaller webps stacks generation loss for very little
 * gain. Widths above the source width are skipped rather than upscaled. Each
 * variant is encoded at QUALITY; if that lands above MAX_BYTES the quality is
 * binary searched down until it fits, which in practice only ever binds on the
 * largest step of a detail-heavy image.
 *
 * The existing single-size `<name>.webp` files are left untouched, so the CSS
 * background usages and any background without a master keep working.
 *
 * Requires ImageMagick (`magick`). Run it as pull -> generate -> push:
 *
 *   npm run assets:pull backgrounds   # never after generating: pull prunes
 *   npm run backgrounds               # everything the manifest lacks
 *   npm run assets:push backgrounds
 *
 * The push has to land before a build that references the new variants, or
 * prerendering fails on the 404 from the hero's preload link.
 *
 * Usage: node scripts/backgrounds.mjs [--src <dir>] [--out <dir>]
 *                                     [--widths 640,960,...] [--quality 80]
 *                                     [--max-bytes 1100000]
 *                                     [--min-source-width 2560] [--force] [name...]
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const DEFAULTS = {
	src: '../Backgrounds/backgrounds',
	out: 'static/images/backgrounds',
	table: 'src/lib/assets/background-variants.ts',
	widths: [640, 960, 1280, 1920, 2560, 3840],
	// Sources below this are web exports, not camera originals - see the header.
	minSourceWidth: 2560,
	quality: 80,
	// Upper bound for a single variant. The largest step of a busy image
	// (rhine, fluelapass) needs ~q70 to fit; smooth skies stay at full quality.
	maxBytes: 1_100_000,
	minQuality: 55
};

const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp']);

function parseArgs(argv) {
	const options = { ...DEFAULTS, force: false, only: [] };
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === '--force') options.force = true;
		else if (arg === '--src') options.src = argv[++i];
		else if (arg === '--out') options.out = argv[++i];
		else if (arg === '--table') options.table = argv[++i];
		else if (arg === '--widths')
			options.widths = argv[++i]
				.split(',')
				.map((w) => Number(w.trim()))
				.sort((a, b) => a - b);
		else if (arg === '--min-source-width') options.minSourceWidth = Number(argv[++i]);
		else if (arg === '--quality') options.quality = Number(argv[++i]);
		else if (arg === '--max-bytes') options.maxBytes = Number(argv[++i]);
		else if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`);
		else options.only.push(arg.replace(/\.[^.]+$/, ''));
	}
	if (options.widths.some((w) => !Number.isFinite(w) || w <= 0))
		throw new Error('--widths must be a comma-separated list of positive numbers');
	return options;
}

function magick(args) {
	const result = spawnSync('magick', args, { encoding: 'utf8' });
	if (result.error?.code === 'ENOENT')
		throw new Error('ImageMagick not found - install it and make sure `magick` is on PATH');
	if (result.status !== 0)
		throw new Error(`magick ${args.join(' ')} failed:\n${result.stderr?.trim()}`);
	return result.stdout;
}

/** Intrinsic pixel size of an image, after any EXIF rotation. */
function dimensions(file) {
	const [width, height] = magick(['identify', '-format', '%[fx:w] %[fx:h]', `${file}[0]`])
		.trim()
		.split(' ')
		.map(Number);
	return { width, height };
}

function encode(source, target, width, quality) {
	magick([
		source,
		'-auto-orient',
		'-colorspace',
		'sRGB',
		'-filter',
		'Lanczos',
		'-resize',
		`${width}x`,
		'-quality',
		String(quality),
		'-define',
		'webp:method=6',
		'-define',
		'webp:use-sharp-yuv=true',
		'-strip',
		target
	]);
	return fs.statSync(target).size;
}

/**
 * Encode at `quality`, then binary search downwards if the result busts the
 * byte budget. Returns the encode that was left on disk.
 */
function encodeWithinBudget(source, target, width, { quality, maxBytes, minQuality }) {
	const size = encode(source, target, width, quality);
	if (size <= maxBytes) return { size, quality };

	let low = minQuality;
	let high = quality - 1;
	let best = null;
	let onDisk = quality;
	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		const midSize = encode(source, target, width, mid);
		onDisk = mid;
		if (midSize <= maxBytes) {
			best = { size: midSize, quality: mid };
			low = mid + 1;
		} else {
			high = mid - 1;
		}
	}

	// Nothing fit, so keep the smallest encode we can produce and say so.
	if (!best) {
		const size =
			onDisk === minQuality ? fs.statSync(target).size : encode(source, target, width, minQuality);
		return { size, quality: minQuality, over: true };
	}
	// The search does not necessarily end on the best quality that fit.
	if (onDisk !== best.quality) encode(source, target, width, best.quality);
	return best;
}

async function mapConcurrent(items, fn) {
	const queue = [...items];
	const limit = Math.max(1, Math.min(os.cpus().length - 1, 8));
	await Promise.all(
		Array.from({ length: Math.min(limit, queue.length) }, async () => {
			for (let next = queue.shift(); next; next = queue.shift()) await fn(next);
		})
	);
}

function sources(dir) {
	if (!fs.existsSync(dir)) throw new Error(`source directory not found: ${dir}`);
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.filter(
			(entry) => entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
		)
		.map((entry) => ({
			name: path.basename(entry.name, path.extname(entry.name)),
			file: path.join(dir, entry.name)
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

/** The committed width table, keyed by the background path used in page data. */
function writeTable(file, entries) {
	const body = entries
		.map(
			(entry) =>
				`\t'${entry.name}.webp': { width: ${entry.width}, height: ${entry.height}, ` +
				`widths: [${entry.widths.join(', ')}] }`
		)
		.join(',\n');
	fs.writeFileSync(
		file,
		`// Generated by scripts/backgrounds.mjs - do not edit by hand.
//
// Intrinsic size and the generated width ladder of every background that has a
// high-resolution source. Backgrounds missing here have no variants and are
// served as the plain single-size file.
export interface BackgroundVariants {
	/** Width of the largest variant, in pixels. */
	width: number;
	/** Height of the largest variant, in pixels. */
	height: number;
	/** Widths available as \`<name>-<width>.webp\`, ascending. */
	widths: number[];
}

export const BACKGROUND_VARIANTS: Record<string, BackgroundVariants> = {
${body}
};
`
	);
}

function main() {
	const options = parseArgs(process.argv.slice(2));
	const srcDir = path.resolve(root, options.src);
	const outDir = path.resolve(root, options.out);
	fs.mkdirSync(outDir, { recursive: true });

	// Every qualifying source is measured even when a name filter is given, so
	// the generated table always describes the full set - the filter only
	// narrows which variants are re-encoded.
	const found = sources(srcDir);
	if (!found.length) throw new Error(`no source images in ${srcDir}`);

	// A name can appear more than once (rhine.jpg is the master, rhine.webp the
	// deployed 1200/1920px export sitting in the same folder) - keep the widest.
	const widest = new Map();
	for (const source of found) {
		const size = dimensions(source.file);
		const previous = widest.get(source.name);
		if (!previous || size.width > previous.width) widest.set(source.name, { ...source, ...size });
	}

	const entries = [];
	const jobs = [];
	for (const source of widest.values()) {
		const { width, height } = source;
		if (width < options.minSourceWidth) {
			console.log(`${source.name}: only ${width}px wide, no high-resolution source - skipping`);
			continue;
		}
		const widths = options.widths.filter((w) => w <= width);
		const largest = widths[widths.length - 1];
		entries.push({
			name: source.name,
			width: largest,
			height: Math.round((height / width) * largest),
			widths
		});
		if (options.only.length && !options.only.includes(source.name)) continue;
		for (const w of widths) jobs.push({ source, width: w });
	}

	// Drop variants from an earlier run whose width or source is gone, so the
	// directory (and with it the R2 manifest) never accumulates orphans.
	const wanted = new Set(jobs.map((job) => `${job.source.name}-${job.width}.webp`));
	let pruned = 0;
	if (!options.only.length) {
		for (const file of fs.readdirSync(outDir)) {
			if (!/-\d+\.webp$/.test(file) || wanted.has(file)) continue;
			fs.rmSync(path.join(outDir, file));
			pruned++;
		}
	}

	const start = Date.now();
	let written = 0;
	let skipped = 0;
	return mapConcurrent(jobs, (job) => {
		const target = path.join(outDir, `${job.source.name}-${job.width}.webp`);
		if (!options.force && fs.existsSync(target)) {
			if (fs.statSync(target).mtimeMs >= fs.statSync(job.source.file).mtimeMs) {
				skipped++;
				return;
			}
		}
		const tmp = `${target}.tmp.webp`;
		const { size, quality, over } = encodeWithinBudget(job.source.file, tmp, job.width, options);
		fs.renameSync(tmp, target);
		written++;
		console.log(
			`${job.source.name}-${job.width}.webp  ${(size / 1024).toFixed(0)} KB  q${quality}` +
				(over ? `  (still over budget at minimum quality)` : '')
		);
	}).then(() => {
		writeTable(path.resolve(root, options.table), entries);
		console.log(
			`\n${entries.length} images, ${written} variants written, ${skipped} up to date, ` +
				`${pruned} pruned (${((Date.now() - start) / 1000).toFixed(1)}s)\n` +
				`Wrote ${options.table}. Upload with: npm run assets:push backgrounds`
		);
	});
}

try {
	await main();
} catch (err) {
	console.error(err.message ?? err);
	process.exit(1);
}

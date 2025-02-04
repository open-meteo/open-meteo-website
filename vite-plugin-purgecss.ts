/**
 * A custom Vite plugin for PurgeCSS. The official one and other community plugins
 * floating around seem to operate on only one CSS file at a time. When inspecting
 * where a CSS class is used, we may need to consider all the JS and HTML files in
 * the bundle.
 */
import { PurgeCSS, type UserDefinedOptions as PurgeCSSOptions } from 'purgecss';
import { type Plugin } from 'vite';

interface VitePurgeCSSOptions extends Omit<PurgeCSSOptions, 'content' | 'css'> {
	// Whether to enable in development mode
	enabled?: boolean | ((mode: string) => boolean);
	// Whether to log statistics
	verbose?: boolean;
}

export default function vitePluginPurgeCSS(options: VitePurgeCSSOptions = {}): Plugin {
	const {
		enabled = (mode) => mode === 'production',
		verbose = false,
		...purgeCSSOptions
	} = options;

	let isBuildEnabled: boolean;

	return {
		name: 'vite-purgecss',
		apply: 'build',
		enforce: 'post',

		configResolved(config) {
			isBuildEnabled = typeof enabled === 'function' ? enabled(config.mode) : enabled;
		},

		async generateBundle(_, bundle) {
			if (!isBuildEnabled) {
				return;
			}

			try {
				// Collect CSS and JS/HTML files from the bundle
				const cssFiles: { name: string; source: string }[] = [];
				const contentFiles: { name: string; source: string }[] = [];

				for (const fileName in bundle) {
					const chunk = bundle[fileName];

					// Skip source maps
					if (fileName.endsWith('.map')) continue;

					if (chunk.type === 'asset' && fileName.endsWith('.css')) {
						cssFiles.push({
							name: fileName,
							source: String(chunk.source)
						});
					} else if (
						(chunk.type === 'chunk' && fileName.endsWith('.js')) ||
						(chunk.type === 'asset' && fileName.endsWith('.html'))
					) {
						const source = chunk.type === 'chunk' ? chunk.code : String(chunk.source);

						contentFiles.push({
							name: fileName,
							source
						});
					}
				}

				if (cssFiles.length === 0) {
					if (verbose) {
						console.log('No CSS files found in bundle');
					}
					return;
				}

				// Track original sizes for reporting
				const originalSizes = cssFiles.map((file) => ({
					name: file.name,
					size: Buffer.byteLength(file.source, 'utf8')
				}));

				// Create PurgeCSS options
				const purgeOptions: PurgeCSSOptions = {
					...purgeCSSOptions,
					content: contentFiles.map((file) => ({
						raw: file.source,
						extension: file.name.split('.').pop() || 'html'
					})),
					css: cssFiles.map((file) => ({
						raw: file.source
					}))
				};

				// Run PurgeCSS
				const purge = new PurgeCSS();
				const results = await purge.purge(purgeOptions);

				// Update bundle with purged CSS
				results.forEach((result, index) => {
					const fileName = cssFiles[index].name;
					const chunkOrAsset = bundle[fileName];
					if (chunkOrAsset.type === 'asset') {
						chunkOrAsset.source = result.css;
					} else {
						chunkOrAsset.code = result.css;
					}
				});

				if (verbose) {
					// Calculate and log size reductions
					const newSizes = results.map((result, index) => ({
						name: cssFiles[index].name,
						size: Buffer.byteLength(result.css, 'utf8')
					}));

					console.log('\nPurgeCSS Summary:');

					// Per-file statistics
					originalSizes.forEach((original, i) => {
						const purged = newSizes[i];
						const reduction = (((original.size - purged.size) / original.size) * 100).toFixed(1);
						console.log(`\n${original.name}:`);
						console.log(`  Original: ${(original.size / 1024).toFixed(2)}kb`);
						console.log(`  Purged: ${(purged.size / 1024).toFixed(2)}kb`);
						console.log(`  Reduction: ${reduction}%`);
					});

					// Total statistics
					const originalTotal = originalSizes.reduce((sum, { size }) => sum + size, 0);
					const newTotal = newSizes.reduce((sum, { size }) => sum + size, 0);
					const totalReduction = (((originalTotal - newTotal) / originalTotal) * 100).toFixed(1);

					console.log('\nTotal:');
					console.log(`Original: ${(originalTotal / 1024).toFixed(2)}kb`);
					console.log(`Purged: ${(newTotal / 1024).toFixed(2)}kb`);
					console.log(`Reduction: ${totalReduction}%`);
				}
			} catch (error) {
				console.error('Error in vite-purgecss:', error);
			}
		}
	};
}

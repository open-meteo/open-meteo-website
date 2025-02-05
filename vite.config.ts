// import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';
import tailwindcssCleaner from 'vite-plugin-tailwindcss-cleaner';
// import purgeCSSPlugin from './vite-plugin-purgecss';

import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';

import rollupOptions from './rollup.config';

function replaceChunckNames() {
	return {
		name: 'replace-chunk-names-plugin',
		apply: 'build' as const,
		config(config) {
			config.build.rollupOptions.output.chunkFileNames =
				config.build.rollupOptions.output.chunkFileNames.replace('[hash]', `[name].[hash].chunk`);

			// config.build.rollupOptions.output.entryFileNames =
			// 	config.build.rollupOptions.output.entryFileNames.replace('[hash]', `[name]-[hash]`);

			console.log(config.build.rollupOptions.output);
			return config;
		}
	};
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		tailwindcssCleaner(),
		// purgeCSSPlugin({
		// 	verbose: true,
		// 	variables: true,
		// 	keyframes: true,
		// 	fontFace: true
		// }),
		sveltekit(),
		replaceChunckNames(),
		visualizer({
			filename: 'build-stats.json',
			template: 'raw-data'
			// gzipSize: true,
			// brotliSize: true,
			// title: 'Open-Meteo Buildsize'
		})
		// paraglide({
		// 	project: './project.inlang',
		// 	outdir: './src/lib/paraglide'
		// }),
	],

	css: {
		lightningcss: {
			targets: browserslistToTargets(browserslist('>= 0.25%'))
		}
	},

	build: {
		// assetsInlineLimit: Infinity, // 262kB
		// minify: 'terser',
		rollupOptions: rollupOptions
	}
});

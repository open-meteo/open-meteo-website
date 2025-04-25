import { defineConfig } from 'vite';

import { sveltekit } from '@sveltejs/kit/vite';
import { visualizer } from 'rollup-plugin-visualizer';

import tailwindcssCleaner from 'vite-plugin-tailwindcss-cleaner';
import tailwindcss from '@tailwindcss/vite';

import svg from '@poppanator/sveltekit-svg';

import rollupOptions from './rollup.config';

function replaceChunckNames() {
	return {
		name: 'replace-chunk-names-plugin',
		apply: 'build' as const,
		config(config) {
			config.build.rollupOptions.output.chunkFileNames =
				config.build.rollupOptions.output.chunkFileNames.replace('[hash]', `[name].[hash].chunk`);
			return config;
		}
	};
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		tailwindcssCleaner(),
		sveltekit(),
		svg(),
		replaceChunckNames(),
		visualizer({
			filename: 'build-stats.json',
			template: 'raw-data'
		})
	],

	build: {
		rollupOptions: rollupOptions
	}
});

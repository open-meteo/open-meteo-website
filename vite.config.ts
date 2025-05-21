import { defineConfig } from 'vite';

import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { visualizer } from 'rollup-plugin-visualizer';

import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

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
		enhancedImages(),
		sveltekit(),
		svg(),
		replaceChunckNames(),
		wasm(),
		topLevelAwait(),
		visualizer({
			filename: 'build-stats.json',
			template: 'raw-data'
		})
	],
	optimizeDeps: {
		exclude: ['@openmeteo/file-reader', '@openmeteo/file-format-wasm', '@aws-sdk']
	},
	build: {
		rollupOptions: rollupOptions
	}
});

import { defineConfig, type UserConfig } from 'vite';

import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { visualizer } from 'rollup-plugin-visualizer';

import tailwindcss from '@tailwindcss/vite';

import svg from '@poppanator/sveltekit-svg';

import rollupOptions from './rollup.config';

function replaceChunckNames() {
	return {
		name: 'replace-chunk-names-plugin',
		apply: 'build' as const,
		config(config: UserConfig) {
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
		visualizer({
			filename: 'build-stats.json',
			template: 'raw-data'
		})
	],
	build: {
		rollupOptions: rollupOptions
	}
});

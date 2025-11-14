import svg from '@poppanator/sveltekit-svg';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { type UserConfig, defineConfig } from 'vite';

import rollupOptions from './rollup.config';
import { fetchDomainData } from './scripts/fetch-domain-data';

const replaceChunckNames = () => {
	return {
		name: 'replace-chunk-names-plugin',
		apply: 'build' as const,
		config(config: UserConfig) {
			config.build.rollupOptions.output.chunkFileNames =
				config.build.rollupOptions.output.chunkFileNames.replace('[hash]', `[name].[hash].chunk`);
			return config;
		}
	};
};

export default defineConfig({
	plugins: [
		fetchDomainData(),
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

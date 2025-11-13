import svg from '@poppanator/sveltekit-svg';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import { visualizer } from 'rollup-plugin-visualizer';
import { type UserConfig, defineConfig } from 'vite';

import rollupOptions from './rollup.config';

const pullDomains = () => {
	return {
		name: 'pull-domain-data',
		transform(code, id, options) {
			if (id.includes('src/routes/en/docs') && id.endsWith('options.ts')) {
				if (options?.ssr) {
					if (id.includes('bom-api')) {
						console.log(id);
					}
				}

				// fs.appendFile(id, '//I should not be here', function (err) {
				// 	if (err) throw err;
				// 	console.log('Saved!');
				// });
			}
		}
	};
};

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
		pullDomains(),
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

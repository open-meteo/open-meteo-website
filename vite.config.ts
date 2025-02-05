import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

import { purgeCss } from './src/lib/purge/index';

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
		sveltekit(),
		purgeCss({
			safelist: {
				greedy: [/highcharts/, /svelte-ergyxs/, /sdt-/, /dropdown-/]
			}
		}),
		replaceChunckNames(),
		visualizer({
			filename: 'build-stats.json',
			template: 'raw-data'
			// gzipSize: true,
			// brotliSize: true,
			// title: 'Open-Meteo Buildsize'
		})
	],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "/src/variables.scss" as *;',
				quietDeps: true,
				silenceDeprecations: ['import']
			}
		}
	}
});

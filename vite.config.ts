import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		sveltekit(),
		visualizer({
			filename: 'build-stats.html',
			template: 'sunburst',
			gzipSize: true,
			brotliSize: true,
			title: 'Open-Meteo Buildsize'
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

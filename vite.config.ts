import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		sveltekit(),
		visualizer({filename: "build-stats.html"})
	],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "/src/variables.scss" as *;'
			}
		}
	},
});

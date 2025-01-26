// import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
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
		// })
	]
});

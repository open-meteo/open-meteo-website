import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		sveltekit(),
		visualizer({filename: "build-stats.html"}),
		paraglide({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	]
});

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import adapter from '@sveltejs/adapter-static';
import child_process from 'child_process';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: true
		}),
		paths: {
			relative: false
		},
		version: {
			name: child_process.exec('git rev-parse HEAD').toString().trim(),
			pollInterval: 2 * 60 * 1000 // 2 mins
		}
	},

	preprocess: [
		vitePreprocess({
			scss: {
				prependData: '@use "/src/variables.scss" as *;'
			}
		})
	]
};

export default config;

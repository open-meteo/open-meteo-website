import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';

console.log(process.env.GIT_HASH ?? new Date().getTime());

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
			name: process.env.CF_PAGES_COMMIT_SHA ?? String(new Date().getTime()),
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

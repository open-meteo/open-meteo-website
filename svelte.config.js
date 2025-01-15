import { mdsvex, escapeSvelte } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import { createHighlighter } from 'shiki';

const theme = 'one-dark-pro';

const highlighter = await createHighlighter({
	themes: [theme],
	langs: ['json', 'bash']
});

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }));
			return `{@html \`${html}\` }`;
		}
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: true
		}),
		paths: {
			relative: false
		}
		// version: {
		// 	name: child_process.execSync('git rev-parse HEAD').toString().trim()
		// }
	},

	extensions: ['.svelte', '.svx', '.md']
};

export default config;

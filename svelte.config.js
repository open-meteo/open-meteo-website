import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { escapeSvelte, mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';

import cityNames from './src/routes/en/weather/locations/city-names10.json' with { type: 'json' };

const themes = {
	dark: 'material-theme-darker',
	light: 'material-theme-lighter'
};

const highlighter = await createHighlighter({
	themes: Object.values(themes),
	langs: ['json', 'bash', 'python', 'typescript', 'swift', 'html']
});

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang: lang, themes: themes }));
			return `{@html \`${html}\` }`;
		}
	}
};

const weatherRoutes = cityNames.map((city) => '/en/weather/week/' + city);

if (process.env.BUILD_WEATHER_PAGES && process._eventsCount == 5) {
	console.log(`  Pregenerating ${weatherRoutes.length} weather pages`);
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	compilerOptions: {
		modernAst: true
	},
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: true
		}),
		prerender: process.env.BUILD_WEATHER_PAGES
			? {
					crawl: true,
					entries: [
						'/',
						'/404',
						'/en/docs/seasonal-forecast-api',
						'/en/weather/week',
						...weatherRoutes
					],
					handleUnseenRoutes: 'warn'
				}
			: {
					concurrency: 10 // usefull when making requests for domains
				},
		paths: {
			relative: false
		},
		version: {
			name: process.env.CF_PAGES_COMMIT_SHA ?? String(new Date().getTime()),
			pollInterval: 2 * 60 * 1000 // 2 mins
		},
		output: {
			preloadStrategy: 'modulepreload',
			bundleStrategy: 'split'
		}
	}
};

export default config;

import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import { mdsvex, escapeSvelte } from 'mdsvex';

import { createHighlighter } from 'shiki';
import { createCssVariablesTheme } from 'shiki/core';

import cityNames from './src/routes/en/weather/locations/city-names10.json' with { type: 'json' };

const cssVars = createCssVariablesTheme({
	name: 'css-variables',
	variablePrefix: '--code-preview-',
	variableDefaults: {},
	fontStyle: true
});

const highlighter = await createHighlighter({
	themes: [cssVars],
	langs: ['json', 'bash', 'python', 'typescript', 'swift', 'html']
});

const mdsvexOptions = {
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang: lang, theme: cssVars }));
			return `{@html \`${html}\` }`;
		}
	}
};

const weatherRoutes = cityNames.map((city) => '/en/weather/week/' + city);

if (process.env.BUILD_WEATHER_PAGES && process._eventsCount == 5) {
	console.log(`  Building ${weatherRoutes.length} weather pages`);
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
					]
				}
			: {},
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

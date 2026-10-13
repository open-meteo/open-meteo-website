import svg from '@poppanator/sveltekit-svg';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'child_process';
import { type MdsvexOptions, escapeSvelte, mdsvex } from 'mdsvex';
import { visualizer } from 'rollup-plugin-visualizer';
import { createHighlighter } from 'shiki';
import { type UserConfig, defineConfig } from 'vite';

function replaceChunkNames() {
	return {
		name: 'replace-chunk-names-plugin',
		apply: 'build' as const,
		config(config: UserConfig) {
			const output = config.build?.rollupOptions?.output;
			if (output && !Array.isArray(output) && typeof output.chunkFileNames === 'string') {
				output.chunkFileNames = output.chunkFileNames.replace('[hash]', `[name].[hash].chunk`);
			}
			return config;
		}
	};
}

// The version name MUST be deterministic: it is baked into both the
// prerendered HTML and the client bundle, and Vite evaluates this config more
// than once per build. A `Date.now()` fallback produces two different values,
// the `__sveltekit_*` globals stop matching, and hydration crashes on every
// page (breaking client-side routing and view transitions in production).
const buildVersion = () => {
	if (process.env.CF_PAGES_COMMIT_SHA) {
		return process.env.CF_PAGES_COMMIT_SHA;
	}

	try {
		return execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
	} catch {
		return 'dev';
	}
};

const themes = {
	dark: 'material-theme-darker',
	light: 'material-theme-lighter'
};

const highlighter = await createHighlighter({
	themes: Object.values(themes),
	langs: ['json', 'bash', 'python', 'typescript', 'swift', 'html']
});

const mdsvexOptions: MdsvexOptions = {
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang, themes }));

			return `{@html \`${html}\` }`;
		}
	}
};

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			extensions: ['.svelte', '.svx', '.md'],
			preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
			compilerOptions: { modernAst: true },
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				precompress: false,
				strict: true
			}),
			paths: { relative: false },
			version: {
				name: buildVersion(),
				pollInterval: 2 * 60 * 1000 /* 2 mins */
			},
			output: { bundleStrategy: 'split' }
		}),
		svg(),
		replaceChunkNames(),
		visualizer({
			filename: 'build-stats.json',
			template: 'raw-data'
		})
	]
});

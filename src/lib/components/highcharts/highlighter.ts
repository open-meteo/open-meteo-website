import { createHighlighterCore } from 'shiki/core';
import { createCssVariablesTheme } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';

import { mode } from 'mode-watcher';

const myTheme = createCssVariablesTheme({
	name: 'css-variables',
	variablePrefix: '--code-preview-',
	variableDefaults: {},
	fontStyle: true
});

const highlighterPromise = createHighlighterCore({
	langs: [
		import('@shikijs/langs/swift'),
		import('@shikijs/langs/python'),
		import('@shikijs/langs/typescript')
	],
	themes: [
		import('@shikijs/themes/material-theme-lighter'),
		import('@shikijs/themes/material-theme-darker'),
		myTheme
	],
	engine: createOnigurumaEngine(import('shiki/wasm'))
});

export async function highlightCode(code: string, lang: string) {
	const highlighter = await highlighterPromise;

	return highlighter.codeToHtml(code, {
		lang: lang,
		theme: mode.current === 'dark' ? 'material-theme-darker' : 'material-theme-lighter'
		//theme: myTheme
	});
}

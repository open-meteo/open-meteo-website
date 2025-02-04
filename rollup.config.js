import PluginCritical from './rollup-plugin-critical';
import postcss from 'rollup-plugin-postcss';
import { inlineCssVars } from 'postcss-inline-css-vars';

export default {
	treeshake: true,
	output: {
		//experimentalMinChunkSize: 1,
		//manualChuncks: ()=>{}
	},
	plugins: [
		PluginCritical({
			criticalUrl: 'https://362-shadcn-svelte.open-meteo-website.pages.dev',
			criticalBase: './',
			criticalPages: [
				{ uri: '', template: 'index' },
				{ uri: '/en/about', template: 'en/about/' }
			],
			criticalConfig: {}
		})
		// postcss({ plugins: [inlineCssVars()] })
	]
};

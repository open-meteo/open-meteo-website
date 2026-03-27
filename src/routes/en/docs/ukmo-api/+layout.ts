import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'UK Met Office API',
		heroDescription:
			"Weather forecasts from the United Kingdom's national weather and climate service UKMO",
		heroImage: 'scotland.webp',
		heroImagePosition: 'center 75%'
	};
}) satisfies LayoutLoad;

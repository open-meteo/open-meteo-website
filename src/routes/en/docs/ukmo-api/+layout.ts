import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'UK Met Office API',
		heroDescription:
			"Weather forecasts from the United Kingdom's national weather and climate service UKMO",
		heroImage: '/images/backgrounds/scotland.webp'
	};
}) satisfies LayoutLoad;

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'DWD ICON API',
		heroDescription: 'Open data weather forecasts from the German weather service DWD',
		heroImage: '/images/cloudy2.webp'
	};
}) satisfies LayoutLoad;

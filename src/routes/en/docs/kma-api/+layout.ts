import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'KMA Weather API',
		heroDescription: 'Weather forecasts from the Korea Meteorological Administration KMA',
		heroImage: '/images/scotland'
	};
}) satisfies LayoutLoad;

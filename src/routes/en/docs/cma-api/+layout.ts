import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'CMA Forecast API',
		heroDescription: 'Weather forecasts from the Chinese Meteorological Administration',
		heroImage: '/images/backgrounds/lake_cirrus.webp'
	};
}) satisfies LayoutLoad;

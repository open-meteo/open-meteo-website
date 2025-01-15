import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'CMA Forecast API',
		subtitle: 'Weather forecasts from the Chinese Meteorological Administration',
		hero: '/images/lake_cirrus.webp'
	};
}) satisfies LayoutLoad;

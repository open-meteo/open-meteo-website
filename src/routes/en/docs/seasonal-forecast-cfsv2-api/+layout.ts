import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Seasonal Forecast API',
		heroDescription: 'Up to 9 month forecasts from different ensembles',
		heroImage: '/images/backgrounds/rocky_coast.webp'
	};
}) satisfies LayoutLoad;

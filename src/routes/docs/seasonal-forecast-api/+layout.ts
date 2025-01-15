import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'Seasonal Forecast API',
		subtitle: 'Up to 9 month forecasts from different ensembles',
		hero: '/images/rocky_coast.webp'
	};
}) satisfies LayoutLoad;

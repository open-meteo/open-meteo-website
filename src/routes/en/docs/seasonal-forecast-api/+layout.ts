import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Seasonal Forecast API',
		heroDescription: 'Up to 7 month forecast based on ECMWF SEAS5',
		heroImage: '/images/backgrounds/rocky_coast.webp'
	};
}) satisfies LayoutLoad;

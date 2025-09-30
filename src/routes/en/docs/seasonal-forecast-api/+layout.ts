import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Seasonal Forecast API',
		heroDescription: 'ECMWF SEAS5 long range forecast for 7 month',
		heroImage: '/images/backgrounds/rocky_coast.webp'
	};
}) satisfies LayoutLoad;

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Seasonal Forecast API',
		heroDescription: 'Sub-Seasonal and Long Range Forecast for 7 Months',
		heroImage: '/images/backgrounds/kehlenalp.webp'
	};
}) satisfies LayoutLoad;

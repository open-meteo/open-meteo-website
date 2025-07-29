import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Historical Forecast API',
		heroDescription: 'Archived High-Resolution Weather Forecasts',
		heroImage: '/images/backgrounds/andermatt.webp'
	};
}) satisfies LayoutLoad;

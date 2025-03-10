import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Historical Forecast API',
		heroDescription: 'Archived High-Resolution Weather Forecasts',
		heroImage: '/images/andermatt.webp'
	};
}) satisfies LayoutLoad;

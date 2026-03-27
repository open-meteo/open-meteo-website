import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'KNMI Forecast API',
		heroDescription: 'Weather forecasts from the Royal Netherlands Meteorological Institute',
		heroImage: '/images/backgrounds/zeedijk.webp'
	};
}) satisfies LayoutLoad;

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'GFS & RRFS Forecast API',
		heroDescription: 'Global GFS model combined with 3-km RRFS forecasts for North America',
		heroImage: '/images/backgrounds/sunset.webp'
	};
}) satisfies LayoutLoad;

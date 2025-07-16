import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'BOM Forecast API',
		heroDescription: 'Weather forecasts from the Australian Bureau of Meteorology',
		heroImage: '/images/backgrounds/fog_mountain.webp'
	};
}) satisfies LayoutLoad;

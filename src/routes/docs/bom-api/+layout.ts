import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'BOM Forecast API',
		subtitle: 'Weather forecasts from the Australian Bureau of Meteorology',
		hero: '/images/fog_mountain.webp'
	};
}) satisfies LayoutLoad;

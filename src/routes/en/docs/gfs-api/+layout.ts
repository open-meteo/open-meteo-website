import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'GFS & HRRR Forecast API',
		heroDescription: 'Global GFS model combined with hourly HRRR updates at 3-km resolution',
		heroImage: '/images/sunset'
	};
}) satisfies LayoutLoad;

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'GFS & HRRR Forecast API',
		subtitle: 'Global GFS model combined with hourly HRRR updates at 3-km resolution',
		hero: '/images/sunset.webp'
	};
}) satisfies LayoutLoad;

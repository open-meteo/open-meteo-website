import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'KNMI Forecast API',
		subtitle: 'Weather forecasts from the Royal Netherlands Meteorological Institute',
		hero: '/images/iceland_mountain.webp'
	};
}) satisfies LayoutLoad;

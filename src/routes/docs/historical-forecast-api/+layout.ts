import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'Historical Forecast API',
		subtitle: 'Archived High-Resolution Weather Forecasts',
		hero: '/images/andermatt.webp'
	};
}) satisfies LayoutLoad;

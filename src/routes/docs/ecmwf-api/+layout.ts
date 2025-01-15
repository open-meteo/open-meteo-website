import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'ECMWF Weather Forecast API',
		subtitle: 'Global High Frequency Forecasts at 0.25° resolution',
		hero: '/images/mountains.webp'
	};
}) satisfies LayoutLoad;

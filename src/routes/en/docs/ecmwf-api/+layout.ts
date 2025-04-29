import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'ECMWF Weather Forecast API',
		heroDescription: 'Global High Frequency Forecasts at 0.25° resolution',
		heroImage: '/images/mountains'
	};
}) satisfies LayoutLoad;

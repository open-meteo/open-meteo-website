import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'ECMWF Weather Forecast API',
		heroDescription: 'Full Resolution 1-hourly IFS HRES at 9 km',
		heroImage: '/images/backgrounds/mountains.webp'
	};
}) satisfies LayoutLoad;

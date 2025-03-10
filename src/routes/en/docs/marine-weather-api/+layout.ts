import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Marine Weather API',
		heroDescription: 'Hourly wave forecasts at 5 km resolution',
		heroImage: '/images/beach.webp'
	};
}) satisfies LayoutLoad;

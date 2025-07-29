import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'MeteoSwiss ICON CH',
		heroDescription: 'Open data weather forecasts from MeteoSwiss',
		heroImage: '/images/backgrounds/niederbauen.webp'
	};
}) satisfies LayoutLoad;

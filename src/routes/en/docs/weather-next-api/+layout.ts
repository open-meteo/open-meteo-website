import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Google WeatherNext API',
		heroDescription: 'Weather forecasts from the Google WeatherNext API',
		heroImage: '/images/backgrounds/pizol.webp',
		heroImagePosition: 'center 65%'
	};
}) satisfies LayoutLoad;

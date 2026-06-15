import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Google WeatherNext 2 API',
		heroDescription: 'Weather forecasts from the Google WeatherNext 2 AI model',
		heroImage: '/images/backgrounds/pizol.webp',
		heroImagePosition: 'center 65%'
	};
}) satisfies LayoutLoad;

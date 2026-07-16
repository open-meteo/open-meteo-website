import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Google WeatherNext 2 API',
		heroDescription: 'Weather forecasts from the Google WeatherNext 2 AI model',
		heroImage: '/images/backgrounds/wallis_sunrise.webp',
		heroImagePosition: 'center 50%'
	};
}) satisfies LayoutLoad;

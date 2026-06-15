import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Google WeatherNext2 API',
		heroDescription: 'Weather forecasts from the Google WeatherNext2 AI model',
		heroImage: '/images/backgrounds/pizol.webp',
		heroImagePosition: 'center 65%'
	};
}) satisfies LayoutLoad;

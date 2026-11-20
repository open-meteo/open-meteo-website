import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Google WeatherNext 3 API',
		heroDescription: 'Hourly ensemble mean and percentile forecasts from Google WeatherNext 3',
		heroImage: '/images/backgrounds/weathernext3.webp',
		heroImagePosition: 'center 50%'
	};
}) satisfies LayoutLoad;

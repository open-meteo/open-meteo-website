import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'CHMI Forecast API',
		heroDescription: 'Weather forecasts from the Czech Hydrometeorological Institute',
		heroImage: '/images/backgrounds/wallis_dawn.webp',
		heroImagePosition: 'center 30%'
	};
}) satisfies LayoutLoad;

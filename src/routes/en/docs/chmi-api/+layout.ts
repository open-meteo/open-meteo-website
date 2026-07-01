import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'CHMI Forecast API',
		heroDescription: 'Weather forecasts from the Czech Hydrometeorological Institute',
		// heroImage: '/images/backgrounds/zeedijk.webp',
		heroImagePosition: 'center 45%'
	};
}) satisfies LayoutLoad;

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Ensemble Mean API',
		heroDescription: 'Mean Ensemble Weather Forecasts from Multiple Models',
		heroImage: '/images/backgrounds/forstberg.webp',
		heroImagePosition: 'center 65%'
	};
}) satisfies LayoutLoad;

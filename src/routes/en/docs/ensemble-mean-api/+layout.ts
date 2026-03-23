import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Ensemble Mean API',
		heroDescription: 'Mean Ensemble Weather Forecasts from Multiple Models',
		heroImage: 'originals/forstberg.jpg',
		heroHeight: 400
	};
}) satisfies LayoutLoad;

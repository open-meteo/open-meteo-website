import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Ensemble Mean API',
		heroDescription: 'Mean Ensemble Weather Forecasts from Multiple Models',
		heroImage: '/images/backgrounds/rocky_coast.webp'
	};
}) satisfies LayoutLoad;

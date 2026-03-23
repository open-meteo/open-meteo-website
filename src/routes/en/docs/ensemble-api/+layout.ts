import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Ensemble API',
		heroDescription: 'Perturbed Weather Forecasts from Hundreds of Members',
		heroImage: 'rocky_coast.webp'
	};
}) satisfies LayoutLoad;

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Ensemble API',
		heroDescription: 'Perturbed Weather Forecasts from Hundreds of Members',
		heroImage: 'cirrus2.jpg',
		heroImagePosition: 'center 90%'
	};
}) satisfies LayoutLoad;

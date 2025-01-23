import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Ensemble API',
		heroDescription: 'Hundreds Of Weather Forecasts, Every time, Everywhere, All at Once',
		heroImage: '/images/rocky_coast.webp'
	};
}) satisfies LayoutLoad;

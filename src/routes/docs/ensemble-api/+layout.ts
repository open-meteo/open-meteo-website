import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'Ensemble API',
		subtitle: 'Hundreds Of Weather Forecasts, Every time, Everywhere, All at Once',
		hero: '/images/rocky_coast.webp'
	};
}) satisfies LayoutLoad;

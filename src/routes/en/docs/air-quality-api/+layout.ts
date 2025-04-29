import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Air Quality API',
		heroDescription: 'Pollutants and pollen forecast in 11 km resolution',
		heroImage: '/images/kuala_lumpur'
	};
}) satisfies LayoutLoad;

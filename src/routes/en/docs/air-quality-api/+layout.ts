import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'Air Quality API',
		subtitle: 'Pollutants and pollen forecast in 11 km resolution',
		hero: '/images/kuala_lumpur.webp'
	};
}) satisfies LayoutLoad;

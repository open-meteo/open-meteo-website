import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'Global Flood API',
		subtitle: 'Simulated river discharge at 5 km resolution from 1984 up to 7 months forecast',
		hero: '/images/river.webp'
	};
}) satisfies LayoutLoad;

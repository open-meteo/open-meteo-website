import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Global Flood API',
		heroDescription:
			'Simulated river discharge at 5 km resolution from 1984 up to 7 months forecast',
		heroImage: 'river.webp'
	};
}) satisfies LayoutLoad;

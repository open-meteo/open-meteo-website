import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'Historical Weather API',
		subtitle: 'Discover how weather has shaped our world from 1940 until now',
		hero: '/images/mountains2.1.webp'
	};
}) satisfies LayoutLoad;

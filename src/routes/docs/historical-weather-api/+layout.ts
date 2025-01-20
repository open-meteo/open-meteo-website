import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Historical Weather API',
		heroDescription: 'Discover how weather has shaped our world from 1940 until now',
		heroImage: '/images/mountains2.webp'
	};
}) satisfies LayoutLoad;

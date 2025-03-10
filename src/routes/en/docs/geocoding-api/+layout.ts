import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Geocoding API',
		heroDescription: 'Search locations globally in any language',
		heroImage: '/images/beach_sunset.webp'
	};
}) satisfies LayoutLoad;

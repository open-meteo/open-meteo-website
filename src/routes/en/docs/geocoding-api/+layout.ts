import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Geocoding API',
		heroDescription: 'Search locations globally in any language',
		heroImage: '/images/backgrounds/beach_sunset.webp'
	};
}) satisfies LayoutLoad;

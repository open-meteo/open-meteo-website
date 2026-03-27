import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Geocoding API',
		heroDescription: 'Search locations globally in any language',
		heroImage: 'beach_sunset.webp',
		heroImagePosition: 'center 70%'
	};
}) satisfies LayoutLoad;

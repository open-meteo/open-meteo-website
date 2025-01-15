import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'Geocoding API',
		subtitle: 'Search locations globally in any language',
		hero: '/images/beach_sunset.webp'
	};
}) satisfies LayoutLoad;

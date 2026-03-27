import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'GEM API',
		heroDescription: '2.5 km high resolution forecasts for North America',
		heroImage: '/images/backgrounds/coastal.webp'
	};
}) satisfies LayoutLoad;

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'GEM API',
		subtitle: '2.5 km high resolution forecasts for North America',
		hero: '/images/coastal.webp'
	};
}) satisfies LayoutLoad;

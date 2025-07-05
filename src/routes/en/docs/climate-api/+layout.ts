import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Climate API',
		heroDescription: 'Explore Climate Change on a Local Level with High-Resolution Climate Data',
		heroImage: '/images/backgrounds/stoos.webp'
	};
}) satisfies LayoutLoad;

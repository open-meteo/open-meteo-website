import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Climate API',
		heroDescription: 'Explore Climate Change on a Local Level with High-Resolution Climate Data',
		heroImage: 'stoos.webp',
		heroImagePosition: 'center 60%'
	};
}) satisfies LayoutLoad;

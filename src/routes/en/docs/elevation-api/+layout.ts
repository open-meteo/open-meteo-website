import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Elevation API',
		heroDescription: '90 meter resolution digital elevation model',
		heroImage: '/images/backgrounds/mountains3.webp'
	};
}) satisfies LayoutLoad;

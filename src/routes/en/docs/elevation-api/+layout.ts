import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'Elevation API',
		subtitle: '90 meter resolution digital elevation model',
		hero: '/images/mountains3.webp'
	};
}) satisfies LayoutLoad;

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'OM Files',
		heroDescription: 'Leveraging OM files directly for data processing',
		heroImage: '/images/backgrounds/klausenpass.webp'
	};
}) satisfies LayoutLoad;

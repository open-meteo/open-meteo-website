import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Météo-France API',
		heroDescription: 'Global ARPEGE model combined with high resolution AROME model',
		heroImage: '/images/backgrounds/overcast_sunset.webp'
	};
}) satisfies LayoutLoad;

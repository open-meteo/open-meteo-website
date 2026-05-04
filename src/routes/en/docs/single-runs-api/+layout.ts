import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Single Runs API',
		heroDescription: 'Full forecast horizon of individual weather model runs from the past',
		heroImage: '/images/backgrounds/andermatt.webp'
	};
}) satisfies LayoutLoad;

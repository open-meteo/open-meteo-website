import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Single Runs API',
		heroDescription: 'Access individual weather model runs from the past',
		heroImage: 'andermatt.webp'
	};
}) satisfies LayoutLoad;

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Single Runs API',
		heroDescription:
			'Access any individual model run by initialisation time — ECMWF IFS from March 2024, all other models from April 2026.',
		heroImage: '/images/backgrounds/andermatt.webp'
	};
}) satisfies LayoutLoad;

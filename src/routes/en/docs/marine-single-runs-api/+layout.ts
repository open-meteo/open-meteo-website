import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Marine Single Runs API',
		heroDescription: 'Access any individual marine model run by initialisation time',
		heroImage: '/images/backgrounds/rhine.webp',
		heroImagePosition: 'center 60%'
	};
}) satisfies LayoutLoad;

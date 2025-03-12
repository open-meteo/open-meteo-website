export const prerender = true;
export const trailingSlash = 'never';
//export const ssr = true;

import type { LayoutLoad } from './$types';

import Sun from '$lib/assets/icons/sun.svg?raw&inline';

export const load: LayoutLoad = async (event) => {
	const { pathname } = event.url;

	return {
		pathname,
		Logo: Sun,
		heroImage: '/images/convective_clouds.webp',
		heroHeight: 600,
		heroTitle: 'Free Weather API',
		heroDescription:
			'Open-Meteo is an open-source weather API and offers free access for non-commercial use. No API key required. Start using it now!',
		heroPrimaryButtonPath: '/en/features',
		heroPrimaryButtonText: 'Features',
		heroSecondaryButtonPath: '/en/docs',
		heroSecondaryButtonText: 'Try the API here'
	};
};

import Sun from '$lib/assets/icons/sun.svelte';

import type { LayoutLoad } from './$types';

export const prerender = true;
export const trailingSlash = 'never';

export const load: LayoutLoad = async (event) => {
	const { pathname } = event.url;

	return {
		pathname,
		Logo: Sun,
		heroImage: '/images/backgrounds/convective_clouds.webp',
		heroHeight: 600,
		heroTitle: 'Free Weather API',
		heroDescription:
			'Free weather forecast and historical weather API — 30+ models, historical weather from 1940, no API key required.',
		heroPrimaryButtonPath: '/en/features',
		heroPrimaryButtonText: 'Features',
		heroSecondaryButtonPath: '/en/docs',
		heroSecondaryButtonText: 'Try the API here'
	};
};

//export const ssr = true;
import Sun from '$lib/assets/icons/sun.svelte';

import type { LayoutLoad } from './$types';

export const prerender = true;
export const trailingSlash = 'never';

export const load: LayoutLoad = async (event) => {
	const { pathname } = event.url;

	// TODO: Remove
	// simulate a delay for testing page transition
	await new Promise((resolve) => setTimeout(resolve, 2000));

	return {
		pathname,
		Logo: Sun,
		heroImage: '/images/backgrounds/convective_clouds.webp',
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

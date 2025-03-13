import type { LayoutLoad } from './$types';

import Sun from '$lib/assets/icons/sun.svelte';

export const load = (() => {
	return {
		Logo: Sun,
		heroImage: '/images/cirrus.webp',
		heroHeight: 300,
		heroTitle: 'API Calls Calculator',
		heroDescription: 'Tool to calculate the amount of API calls used',
		heroPrimaryButtonPath: null,
		heroPrimaryButtonText: null,
		heroSecondaryButtonPath: null,
		heroSecondaryButtonText: null
	};
}) satisfies LayoutLoad;

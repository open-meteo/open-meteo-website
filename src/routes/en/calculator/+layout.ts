import type { LayoutLoad } from './$types';

import Cog from '$lib/assets/icons/cog.svelte';

export const load = (() => {
	return {
		Logo: Cog,
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

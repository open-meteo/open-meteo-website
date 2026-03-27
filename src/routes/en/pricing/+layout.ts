import Snow from '$lib/assets/icons/snow.svelte';

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		Logo: Snow,
		heroImage: 'snowy.webp',
		heroHeight: 500,
		heroTitle: 'Pricing',
		heroImagePosition: 'center 60%',
		heroDescription: 'Commercial use licence, support and dedicated API capacity',
		heroPrimaryButtonPath: '#plans',
		heroPrimaryButtonText: 'API Plans',
		heroSecondaryButtonPath: '/en/docs',
		heroSecondaryButtonText: 'API Docs'
	};
}) satisfies LayoutLoad;

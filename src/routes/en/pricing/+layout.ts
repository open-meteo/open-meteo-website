import type { LayoutLoad } from './$types';

import Snow from '$lib/assets/icons/snow.svg?component';

export const load = (() => {
	return {
		Logo: Snow,
		heroImage: '/images/snowy.webp',
		heroHeight: 500,
		heroTitle: 'Pricing',
		heroDescription: 'Commercial use license, support and dedicated API capacity',
		heroPrimaryButtonPath: '#plans',
		heroPrimaryButtonText: 'API Plans',
		heroSecondaryButtonPath: '/en/docs',
		heroSecondaryButtonText: 'API Docs'
	};
}) satisfies LayoutLoad;

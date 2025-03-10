import type { LayoutLoad } from './$types';

import Rain from '$lib/assets/icons/rain.svelte';

export const load = (() => {
	return {
		Logo: Rain,
		heroImage: '/images/features_background.webp',
		heroHeight: 500,
		heroTitle: 'Features',
		heroDescription: 'Simple JSON APIs. Global coverage. Up to 1 km resolution. Get started today!',
		heroPrimaryButtonPath: '#available-apis',
		heroPrimaryButtonText: 'Available APIs',
		heroSecondaryButtonPath: '/en/pricing',
		heroSecondaryButtonText: 'Pricing'
	};
}) satisfies LayoutLoad;

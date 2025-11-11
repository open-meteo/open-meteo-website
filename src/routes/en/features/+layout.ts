import Rain from '$lib/assets/icons/rain.svelte';

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		Logo: Rain,
		heroImage: '/images/backgrounds/features_background.webp',
		heroHeight: 500,
		heroTitle: 'Features',
		heroDescription: 'Simple JSON APIs. Global coverage. Up to 1 km resolution. Get started today!',
		heroPrimaryButtonPath: '#available_apis',
		heroPrimaryButtonText: 'Available APIs',
		heroSecondaryButtonPath: '/en/pricing',
		heroSecondaryButtonText: 'Pricing'
	};
}) satisfies LayoutLoad;

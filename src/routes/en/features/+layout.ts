import Rain from '$lib/assets/icons/rain.svelte';

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		Logo: Rain,
		heroImage: '/images/backgrounds/features_background.webp',
		heroImagePosition: 'center 40%',
		heroHeight: 500,
		heroTitle: 'Features',
		heroDescription: 'Global weather data from forecast to archive — free, no sign-up, one JSON API.',
		heroPrimaryButtonPath: '#available_apis',
		heroPrimaryButtonText: 'Available APIs',
		heroSecondaryButtonPath: '/en/pricing',
		heroSecondaryButtonText: 'Pricing'
	};
}) satisfies LayoutLoad;

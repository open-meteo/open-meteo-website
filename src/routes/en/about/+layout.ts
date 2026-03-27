import Rain from '$lib/assets/icons/rain.svelte';

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		Logo: Rain,
		heroImage: '/images/backgrounds/features_background.webp',
		heroImagePosition: 'center 40%',
		heroHeight: 300,
		heroTitle: 'About',
		heroDescription: null,
		heroPrimaryButtonPath: null,
		heroPrimaryButtonText: null,
		heroSecondaryButtonPath: null,
		heroSecondaryButtonText: null
	};
}) satisfies LayoutLoad;

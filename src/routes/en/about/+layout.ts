import type { LayoutLoad } from './$types';

import Rain from '$lib/assets/icons/rain.svg?raw&inline';

export const load = (() => {
	return {
		Logo: Rain,
		heroImage: '/images/features_background.webp',
		heroHeight: 300,
		heroTitle: 'About',
		heroDescription: null,
		heroPrimaryButtonPath: null,
		heroPrimaryButtonText: null,
		heroSecondaryButtonPath: null,
		heroSecondaryButtonText: null
	};
}) satisfies LayoutLoad;

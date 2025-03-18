import type { LayoutLoad } from './$types';

import Rain from '$lib/assets/icons/rain.svg?component';

export const load = (() => {
	return {
		Logo: Rain,
		heroImage: '/images/features_background.webp',
		heroHeight: 300,
		heroTitle: 'License',
		heroDescription: null,
		heroPrimaryButtonPath: null,
		heroPrimaryButtonText: null,
		heroSecondaryButtonPath: null,
		heroSecondaryButtonText: null
	};
}) satisfies LayoutLoad;

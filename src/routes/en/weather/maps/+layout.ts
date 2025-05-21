import type { LayoutLoad } from './$types';

import { get } from 'svelte/store';

import { storedLocation } from '$lib/stores/settings';

export const load: LayoutLoad = async () => {
	return {
		heroTitle: `Weather Maps`,
		heroDescription: null,
		heroImage: '/images/partly_cloudy.webp',
		heroHeight: 300,
		heroPrimaryButtonPath: null,
		heroPrimaryButtonText: null,
		heroSecondaryButtonPath: null,
		heroSecondaryButtonText: null
	};
};

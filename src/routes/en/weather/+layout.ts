import { storedLocation } from '$lib/stores/settings';
import { get } from 'svelte/store';

import type { LayoutLoad } from './$types';

const location = get(storedLocation);

export const load: LayoutLoad = async () => {
	return {
		heroTitle: `Weather ${location.name}`,
		heroDescription: location.admin1 ?? '' + ' ' + location.country,
		heroImage: '/images/backgrounds/partly_cloudy.webp',
		heroHeight: 400,
		heroPrimaryButtonPath: null,
		heroPrimaryButtonText: null,
		heroSecondaryButtonPath: null,
		heroSecondaryButtonText: null
	};
};

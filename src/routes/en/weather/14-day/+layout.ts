import type { LayoutLoad } from './$types';

import { get } from 'svelte/store';

import { storedLocation } from '$lib/stores/settings';

const location = get(storedLocation);

export const load: LayoutLoad = async () => {
	return {
		heroTitle: `14 Day Weather ${location.name}`,
		heroDescription: location.admin1 ?? '' + ' ' + location.country
	};
};

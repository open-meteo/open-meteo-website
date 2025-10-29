import { get } from 'svelte/store';

import { storedLocation } from '$lib/stores/settings';

import type { LayoutLoad } from './$types';

const location = get(storedLocation);

export const load: LayoutLoad = async () => {
	return {
		heroTitle: `Weather Week ${location.name}`,
		heroDescription: location.admin1 ?? '' + ' ' + location.country
	};
};

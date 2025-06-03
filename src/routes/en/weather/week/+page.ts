export const prerender = true;

import { get } from 'svelte/store';

import { error, redirect } from '@sveltejs/kit';

import { storedLocation, type GeoLocation } from '$lib/stores/settings';

import type { PageLoad } from '$types';

export const load = (async (event) => {
	const location = get(storedLocation);
	throw redirect(
		303,
		'/en/weather/week/' +
			(location.population
				? location.population > 543000
					? location.name.toLowerCase()
					: location.name.toLowerCase() + '_' + location.id
				: location.name.toLowerCase() + '_' + location.id)
	);
}) satisfies PageLoad;

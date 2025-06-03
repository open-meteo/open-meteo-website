export const prerender = true;

import { get } from 'svelte/store';

import { error, redirect } from '@sveltejs/kit';

import { storedLocation, type GeoLocation } from '$lib/stores/settings';

import { geoLocationNameToRoute } from '$lib/utils/meteo';

import type { PageLoad } from '$types';

export const load = (async (event) => {
	const location = get(storedLocation);
	const locationRoute = geoLocationNameToRoute(location.name);
	throw redirect(
		303,
		'/en/weather/week/' +
			(location.population
				? location.population > 543000
					? locationRoute
					: locationRoute + '_' + location.id
				: locationRoute + '_' + location.id)
	);
}) satisfies PageLoad;

export const prerender = true;

import { error, redirect } from '@sveltejs/kit';

import { storedLocation } from '$lib/stores/settings';

import type { PageLoad } from '$types';

import cities from '../../locations/cities.json';
import cityNames from '../../locations/city-names.json';

export const load = (async (event) => {
	const urlLocation = event.params.location;
	const urlLocationSplit = urlLocation.split('_');
	const urlLocationName = urlLocationSplit[0];
	const urlLocationId = urlLocationSplit[1];

	let location;

	if (cityNames.includes(urlLocationName)) {
		location = cities.find(
			(city) => city['route'] === urlLocationName
		);

		// const res = await event.fetch(
		// 	`https://geocoding-api.open-meteo.com/v1/get?id=${cityFound?.geonameid}`
		// );
		// location = await res.json();
	} else {
		if (urlLocationId) {
			const res = await event.fetch(
				`https://geocoding-api.open-meteo.com/v1/get?id=${urlLocationId}`
			);
			location = await res.json();
		} else {
			const res = await event.fetch(
				`https://geocoding-api.open-meteo.com/v1/search?name=${urlLocationName}&count=1&language=en&format=json`
			);
			const geocodingResponse = await res.json();
			if (geocodingResponse.results) {
				location = geocodingResponse.results[0];
			} else {
				error(404, 'Location not found');
			}
		}

		if (
			event.url.pathname !== `/en/weather/week/${location.name.toLowerCase() + '_' + location.id}`
		) {
			throw redirect(303, `/en/weather/week/${location.name.toLowerCase() + '_' + location.id}`);
		}
	}

	storedLocation.set(location);
	return { location: location };
}) satisfies PageLoad;

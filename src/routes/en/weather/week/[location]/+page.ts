export const prerender = true;

import { error, redirect } from '@sveltejs/kit';

import { storedLocation, type GeoLocation } from '$lib/stores/settings';

import type { PageLoad } from '$types';

export const load = (async (event) => {
	const urlLocation = event.params.location;
	let urlLocationSplit, urlLocationName, urlLocationId;

	if (urlLocation.includes('_')) {
		urlLocationSplit = urlLocation.split('_');
		urlLocationName = urlLocationSplit[0];
		urlLocationId = urlLocationSplit[1];
	} else if (/^\d+$/.test(urlLocation)) {
		// only numbers in location, must be geonames id
		urlLocationName = '';
		urlLocationId = urlLocation;
	} else if (/^[a-zA-Z]/.test(urlLocation)) {
		// only letters in location, must be geonames query
		urlLocationName = urlLocation;
		urlLocationId = undefined;
	}

	let location: GeoLocation;

	// lat, long coordinates
	if (urlLocation.includes('N') && urlLocation.includes('E')) {
		urlLocationSplit = urlLocation.split(/N|E/);
		const latitude = urlLocationSplit[0];
		const longitude = urlLocationSplit[1];

		location = {
			//id: undefined,
			name: `${latitude}N° ${longitude}E°`,
			latitude: latitude,
			longitude: longitude
		};
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

		if (location.population && location.population > 543000) {
			// 1000 biggest cities
			if (event.url.pathname !== `/en/weather/week/${location.name.toLowerCase()}`) {
				throw redirect(303, `/en/weather/week/${location.name.toLowerCase()}`);
			}
		} else {
			if (
				event.url.pathname !== `/en/weather/week/${location.name.toLowerCase() + '_' + location.id}`
			) {
				throw redirect(303, `/en/weather/week/${location.name.toLowerCase() + '_' + location.id}`);
			}
		}
	}

	storedLocation.set(location);
	return { location: location };
}) satisfies PageLoad;

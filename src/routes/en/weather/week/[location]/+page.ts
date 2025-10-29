import { type GeoLocation, storedLocation } from '$lib/stores/settings';
import { geoLocationNameToRoute } from '$lib/utils/meteo';
import type { PageLoad } from '$types';
import { error, redirect } from '@sveltejs/kit';

export const prerender = true;

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

		const locationRoute = geoLocationNameToRoute(location.name);

		if (location.population && location.population > 543000) {
			// 1000 biggest cities
			if (event.url.pathname !== `/en/weather/week/${locationRoute}`) {
				throw redirect(303, `/en/weather/week/${locationRoute}`);
			}
		} else {
			if (event.url.pathname !== `/en/weather/week/${locationRoute + '_' + location.id}`) {
				throw redirect(303, `/en/weather/week/${locationRoute + '_' + location.id}`);
			}
		}
	}

	storedLocation.set(location);
	return { location: location };
}) satisfies PageLoad;

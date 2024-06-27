import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

export const api_key_preferences = persisted('api_key_preferences', {
	use: 'non_commercial',
	apikey: '',
	self_host_server: 'https://my-server.tld'
});

export const units = persisted('units', {
	windSpeed: 'kph',
	temperature: 'celsius',
	precipitation: 'mm'
});

export const theme = persisted('theme', 'auto');
export const themeIsDark = writable(true);

export interface GeoLocation {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	elevation: number;
	feature_code: string;
	country_code: string | undefined;
	admin1_id: number | undefined;
	admin3_id: number | undefined;
	admin4_id: number | undefined;
	timezone: string;
	population: number | undefined;
	postcodes: string[] | undefined;
	country_id: number | undefined;
	country: string | undefined;
	admin1: string | undefined;
	admin3: string | undefined;
	admin4: string | undefined;
}

export const defaultLocation: GeoLocation = {
	admin1: 'Lucerne',
	admin1_id: 2659810,
	admin3: 'Lucerne',
	admin3_id: 7286409,
	country: 'Switzerland',
	country_code: 'CH',
	country_id: 2658434,
	elevation: 437,
	feature_code: 'PPLA',
	id: 2659811,
	latitude: 47.05048,
	longitude: 8.30635,
	name: 'Lucerne',
	population: 81691,
	postcodes: ['6000', '6003', '6004'],
	admin4_id: 6547539,
	timezone: 'Europe/Zurich'
};

export const last_visited = persisted('last_visited_locations', [] as GeoLocation[]);
export const favorites = persisted('favorites', [] as GeoLocation[]);

//export const activeLocation = writable(defaultLocation);
// $favorites.length > 0 ? $favorites[0] : $last_visited.length > 0 ? $last_visited[0] : defaultLocation


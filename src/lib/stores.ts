import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

export const api_key_preferences = persisted('api_key_preferences', {
	use: 'non_commercial',
	apikey: '',
	self_host_server: 'https://my-server.tld'
});

export const units = persisted('units', {
	windSpeed: 'kmh',
	temperature: 'celsius',
	precipitation: 'mm'
});

export const model = persisted('model', 'best_match');
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
	id: 2950159,
	name: 'Berlin',
	latitude: 52.52437,
	longitude: 13.41053,
	elevation: 74,
	feature_code: 'PPLC',
	country_code: 'DE',
	admin1_id: 2950157,
	admin3_id: 6547383,
	admin4_id: 6547539,
	timezone: 'Europe/Berlin',
	population: 3426354,
	postcodes: ['10967', '13347'],
	country_id: 2921044,
	country: 'Germany',
	admin1: 'Land Berlin',
	admin3: 'Berlin, Stadt',
	admin4: 'Berlin'
};

export const storedLocation = persisted('stored-location', defaultLocation as GeoLocation);
export const last_visited = persisted('last_visited_locations', [] as GeoLocation[]);
export const favorites = persisted('favorites', [] as GeoLocation[]);

//export const activeLocation = writable(defaultLocation);
// $favorites.length > 0 ? $favorites[0] : $last_visited.length > 0 ? $last_visited[0] : defaultLocation

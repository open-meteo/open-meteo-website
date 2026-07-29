import { persisted } from 'svelte-persisted-store';

export const apiKeyPreferences = persisted('api_key_preferences', {
	use: 'non_commercial',
	apikey: '',
	self_host_server: 'https://my-server.tld'
});

export interface GeoLocation {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	elevation: number;
	feature_code: string;
	country_code: string | undefined;
	admin1_id: number | undefined;
	admin3_id?: number | undefined;
	admin4_id?: number | undefined;
	timezone: string;
	population: number | undefined;
	postcodes: string[] | undefined;
	country_id: number | undefined;
	country: string | undefined;
	admin1: string | undefined;
	admin3?: string | undefined;
	admin4?: string | undefined;
}

export const lastVisited = persisted('last_visited_locations', [] as GeoLocation[]);
export const favorites = persisted('favorites', [] as GeoLocation[]);

/** Disables all page and component animations (toggle in footer / mobile nav) */
export const animationsDisabled = persisted('animations_disabled', false);

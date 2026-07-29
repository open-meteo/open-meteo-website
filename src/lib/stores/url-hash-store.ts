import { type Writable, get, writable } from 'svelte/store';

import { browser } from '$app/environment';
import { afterNavigate, replaceState } from '$app/navigation';
import { page } from '$app/state';

import { debounce, isNumeric } from '$lib/utils';

import type { Parameters } from '$lib/docs';

export type UrlHashStore = Writable<Parameters>;

export const urlHashStore = (initialValues: Parameters): UrlHashStore => {
	const defaultValues: Parameters = JSON.parse(JSON.stringify(initialValues));

	// default values overridden by whatever the search string carries
	const parseSearch = (search: string): Parameters => {
		const values: Parameters = JSON.parse(JSON.stringify(defaultValues));
		for (const [key, value] of new URLSearchParams(search).entries()) {
			let defaultValue = defaultValues[key];

			if (defaultValue && defaultValue.constructor === Array) {
				values[key] = value.split(/,|%2C/).filter((e: string) => e !== '');
			} else {
				let val: number | string = value;
				if (isNumeric(defaultValue)) {
					defaultValue = Number(defaultValue);
				}
				if (isNumeric(value)) {
					val = Number(value);
				}
				if (defaultValue !== val) {
					values[key] = val;
				}
			}
		}
		return values;
	};

	// canonical search string for the given values, keeping unrelated params intact
	const serializeSearch = (values: Parameters, currentSearch: string): string => {
		const searchParams = new URLSearchParams(currentSearch);
		for (const [key, value] of Object.entries(values)) {
			let defaultValue = defaultValues[key];

			// params key is array
			if (defaultValue && defaultValue.constructor === Array) {
				if (JSON.stringify(value) === JSON.stringify(defaultValue)) {
					if (searchParams.has(key) && searchParams.get(key) !== value.join(',')) {
						searchParams.delete(key);
					}
				} else {
					let array = value;
					// remove empty string when array has more then 1 values
					if (array.length > 1 && array.includes('')) {
						array = value.filter((e: string) => e !== '');
					}
					searchParams.set(key, array.join(','));
				}
			} else {
				let val: number | string = value;
				if (isNumeric(defaultValue)) {
					defaultValue = Number(defaultValue);
				}
				if (isNumeric(value)) {
					val = Number(value);
				}

				if (val != defaultValue) {
					searchParams.set(key, String(val));
				} else if (searchParams.has(key) && searchParams.get(key) !== val) {
					searchParams.delete(key);
				}
			}
			if (searchParams.has(key) && searchParams.get(key) === '') {
				if (
					defaultValue === undefined ||
					(defaultValue && defaultValue.constructor === Array && defaultValue.length === 0) ||
					defaultValue === '0'
				) {
					searchParams.delete(key);
				}
			}
		}
		return searchParams.toString().replaceAll('%2C', ',');
	};

	const canonical = (search: string) => search.replace(/^\?/, '').replaceAll('%2C', ',');

	// the old url-params store kept its params in the hash ('#key=value');
	// still accept those links, but migrate them to a regular query string
	let legacyHash = browser && window.location.hash.includes('=');
	const initialSearch = browser
		? legacyHash
			? window.location.hash.slice(1)
			: window.location.search
		: '';

	const urlHashes: Writable<Parameters> = writable(
		browser ? parseSearch(initialSearch) : JSON.parse(JSON.stringify(defaultValues))
	);

	// the search string the store currently reflects, to tell our own URL
	// updates apart from external ones (back/forward, links)
	// NOTE: always read window.location, not page.url — shallow replaceState
	// updates the former but leaves the latter stale
	let syncedSearch = canonical(initialSearch);
	let routerReady = false;

	const writeURL = debounce(() => {
		if (!routerReady) {
			// still hydrating — replaceState would throw, try again shortly
			writeURL();
			return;
		}
		const search = serializeSearch(get(urlHashes), legacyHash ? '' : window.location.search);
		syncedSearch = search;
		if (legacyHash || search !== canonical(window.location.search)) {
			const hash = legacyHash ? '' : window.location.hash;
			legacyHash = false;
			replaceState(`${window.location.pathname}${search ? '?' + search : ''}${hash}`, page.state);
		}
	});

	afterNavigate((navigation) => {
		routerReady = true;
		if (navigation.type === 'enter') {
			// initial values already come from the URL; only legacy hash params
			// need to be rewritten to the new query string format
			if (legacyHash) {
				writeURL();
			}
			return;
		}
		const search = canonical(window.location.search);
		if (search !== syncedSearch) {
			syncedSearch = search;
			urlHashes.set(parseSearch(window.location.search));
		}
	});

	let initialized = false;
	urlHashes.subscribe(() => {
		// the first emission is the store's own initial value — nothing to write back
		if (!browser || !initialized) {
			initialized = true;
			return;
		}
		writeURL();
	});

	return urlHashes;
};

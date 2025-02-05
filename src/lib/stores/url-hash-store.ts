import { writable, type Writable } from 'svelte/store';

import { page } from '$app/state';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

import { isNumeric } from '$lib/utils/meteo';
import type { Parameters } from '$lib/docs';

export const urlHashes: Writable<Parameters> = writable({});

export const urlHashStore = (initialValues: Parameters) => {
	const { subscribe, set } = urlHashes;

	const defaultValues = JSON.parse(JSON.stringify(initialValues));

	urlHashes.set(JSON.parse(JSON.stringify(defaultValues)));

	const updateURLParams = (values) => {
		if (browser) {
			for (let [key, value] of Object.entries(values)) {
				let defaultValue = defaultValues[key];

				// params key is array
				if (Array === defaultValue.constructor) {
					if (JSON.stringify(value) === JSON.stringify(defaultValue)) {
						if (page.url.searchParams.has(key) && page.url.searchParams.get(key) !== value) {
							page.url.searchParams.delete(key);
						}
					} else {
						page.url.searchParams.set(key, value.join(','));
					}
				} else {
					if (isNumeric(defaultValue)) {
						defaultValue = Number(defaultValue);
					}
					if (isNumeric(value)) {
						value = Number(value);
					}
					if (value != defaultValue) {
						page.url.searchParams.set(key, value);
					} else {
						if (page.url.searchParams.has(key) && page.url.searchParams.get(key) !== value) {
							page.url.searchParams.delete(key);
						}
					}
				}
			}
			goto(`?${page.url.searchParams.toString().replaceAll('%2C', ',')}`, { noScroll: true });
		}
	};

	// check if urlParams overrides any default values OR stored values
	if (browser && page.url.search) {
		for (let [key, value] of page.url.searchParams.entries()) {
			let defaultValue = defaultValues[key];

			if (defaultValue.constructor === Array) {
				if (JSON.stringify(defaultValue) !== JSON.stringify(value)) {
					urlHashes.update((urlValues) => {
						urlValues[key] = value.split(/,|%2C/);
						return urlValues;
					});
				}
			} else {
				if (isNumeric(defaultValue)) {
					defaultValue = Number(defaultValue);
				}
				if (isNumeric(value)) {
					value = Number(value);
				}
				if (defaultValue !== value) {
					urlHashes.update((urlValues) => {
						urlValues[key] = value;
						return urlValues;
					});
				}
			}
		}
	}

	urlHashes.subscribe((values) => {
		updateURLParams(values);
	});

	return {
		set,
		reset: () => {
			urlHashes.set(JSON.parse(JSON.stringify(defaultValues)));
		},
		subscribe
	};
};

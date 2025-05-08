import { writable, type Writable } from 'svelte/store';

import { page } from '$app/state';

import { goto } from '$app/navigation';

import { browser } from '$app/environment';

import { debounce, isNumeric } from '$lib/utils/meteo';

import type { Parameters } from '$lib/docs';

export const urlHashStore = (initialValues: Parameters) => {
	const urlHashes: Writable<Parameters> = writable({});

	const { subscribe, set } = urlHashes;

	const defaultValues = JSON.parse(JSON.stringify(initialValues));
	urlHashes.set(JSON.parse(JSON.stringify(defaultValues)));

	function updateURL() {
		const searchParams = page.url.searchParams.toString().replaceAll('%2C', ',');
		const link = `?${searchParams}${page.url.hash ?? ''}`;
		if (page.url.search !== window.location.search) {
			goto(link, {
				noScroll: true,
				keepFocus: true
			});
		}
	}

	const processURLParamsUpdate = debounce(() => updateURL());

	const updateURLParams = (values: Parameters) => {
		if (browser) {
			let changedParams = false;

			for (const [key, value] of Object.entries(values)) {
				let defaultValue = defaultValues[key];

				// params key is array
				if (defaultValue && Array === defaultValue.constructor) {
					if (JSON.stringify(value) === JSON.stringify(defaultValue)) {
						if (page.url.searchParams.has(key) && page.url.searchParams.get(key) !== value) {
							page.url.searchParams.delete(key);
							changedParams = true;
						}
					} else {
						page.url.searchParams.set(key, value.join(','));
						changedParams = true;
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
						page.url.searchParams.set(key, String(val));
						changedParams = true;
					} else {
						if (page.url.searchParams.has(key) && page.url.searchParams.get(key) !== val) {
							page.url.searchParams.delete(key);
							changedParams = true;
						}
					}
				}
				if (page.url.searchParams.has(key) && page.url.searchParams.get(key) === '') {
					page.url.searchParams.delete(key);
					changedParams = true;
				}
			}

			if (changedParams) {
				processURLParamsUpdate();
			}
		}
	};

	// check if urlParams overrides any default values OR stored values
	if (browser && page.url.search) {
		for (const [key, value] of page.url.searchParams.entries()) {
			let defaultValue = defaultValues[key];

			if (defaultValue && defaultValue.constructor === Array) {
				if (JSON.stringify(defaultValue) !== JSON.stringify(value)) {
					urlHashes.update((urlValues) => {
						urlValues[key] = value.split(/,|%2C/);
						return urlValues;
					});
				}
			} else {
				let val: number | string = value;
				if (isNumeric(defaultValue)) {
					defaultValue = Number(defaultValue);
				}
				if (isNumeric(value)) {
					val = Number(value);
				}
				if (defaultValue !== val) {
					urlHashes.update((urlValues) => {
						urlValues[key] = val;
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
		subscribe
	};
};

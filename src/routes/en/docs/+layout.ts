import { browser } from '$app/environment';

import type { LayoutLoad } from './$types';

import { defaultParameters } from './options';

import Cog from '$lib/assets/icons/cog.svelte';

type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

export const load: LayoutLoad = (event) => {
	const urlParsed = {
		...defaultParameters
	};

	if (browser) {
		const urlParams = new URLSearchParams(event.url.searchParams);
		for (const [key, dP] of Object.entries(defaultParameters) as Entries<
			typeof defaultParameters
		>) {
			const urlParam = urlParams.get(key);
			if (urlParam && urlParam !== dP) {
				if (dP && Array === dP.constructor) {
					const urlParamSplit = urlParam.split(',');
					urlParsed[key] = urlParamSplit;
				} else {
					urlParsed[key] = urlParam;
				}
			}
		}
	}

	return {
		Logo: Cog,
		heroTitle: 'Weather Forecast API',
		heroDescription:
			'Seamless integration of high-resolution weather models with up 16 days forecast',
		heroImage: '/images/partly_cloudy.webp',
		heroHeight: 400,
		heroPrimaryButtonPath: null,
		heroPrimaryButtonText: null,
		heroSecondaryButtonPath: null,
		heroSecondaryButtonText: null,
		urlParsed: urlParsed
	};
};

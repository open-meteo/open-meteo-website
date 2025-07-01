import { expect, test, vi } from 'vitest';
import { get } from 'svelte/store';

import { urlHashStore } from './url-hash-store';

import { defaultParameters } from '../../routes/en/docs/options';

const paramsStore = urlHashStore({
	latitude: [52.52],
	longitude: [13.41],
	...defaultParameters,
	hourly: ['temperature_2m']
});

let params = get(paramsStore);

test('check urlHashStore with hourly variable', () => {
	if (params['hourly']) params['hourly'].push('wind_10m');
	paramsStore.set(params);

	let checkParams = get(paramsStore);
	expect(checkParams.hourly).toStrictEqual(['temperature_2m', 'wind_10m']);
});

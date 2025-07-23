import { expect, test } from 'vitest';
import { get } from 'svelte/store';

import { urlHashStore } from './url-hash-store';

import { defaultParameters } from '../../routes/en/docs/options';

const paramsStore = urlHashStore({
	latitude: [52.52],
	longitude: [13.41],
	...defaultParameters,
	hourly: ['temperature_2m']
});

const params = get(paramsStore);
let checkParams = get(paramsStore);

test('check urlHashStore with hourly variable', () => {
	if (params['hourly']) params['hourly'].push('wind_10m');
	paramsStore.set(params);

	checkParams = get(paramsStore);
	expect(checkParams.hourly).toStrictEqual(['temperature_2m', 'wind_10m']);
});

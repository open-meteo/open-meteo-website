import { expect, test } from 'vitest';

import { isAvailable } from '#lib/utils/index.js';

import { model } from '../google-weathernext3-api/options';
import { availableMeans, availableSpreads, hourlyGroupsForModels } from './options';

test.each(['wind_u_component_10m', 'wind_u_component_10m_spread'])(
	'keeps the wind component row visible until %s is removed after switching models',
	(selection) => {
		const field = { value: 'wind_u_component_10m' };
		const otherModel = ['dwd_icon_eps_ensemble_mean'];
		expect(hourlyGroupsForModels([model.value], []).flat()).toContainEqual(
			expect.objectContaining(field)
		);
		expect(hourlyGroupsForModels(otherModel, [selection]).flat()).toContainEqual(
			expect.objectContaining(field)
		);
		expect(hourlyGroupsForModels(otherModel, []).flat()).not.toContainEqual(
			expect.objectContaining(field)
		);
	}
);

test('checks WeatherNext 3 solar means and spreads separately, including mixed selections', () => {
	const solar = 'direct_radiation';
	expect(isAvailable(solar, [model.value], availableMeans)).toBe(true);
	expect(isAvailable(solar, [model.value], availableSpreads)).toBe(false);
	expect(isAvailable(solar, [model.value, 'ecmwf_ifs025_ensemble_mean'], availableSpreads)).toBe(
		true
	);
});

import { describe, expect, test } from 'vitest';

import { DOMAIN_GRIDS } from '#lib/assets/domain-grids.js';

import { boundingBoxAround, domainGrid, estimateGridCells } from './bounding-box';

describe('domainGrid', () => {
	test('resolves renamed, native and ensemble mean models to their grid', () => {
		expect(domainGrid('dwd_icon_d2')?.dx).toBe(0.02);
		expect(domainGrid('dwd_icon_global')?.dx).toBe(0.125);
		expect(domainGrid('dwd_icon_d2_native')?.dx).toBe(0.02);
		expect(domainGrid('dwd_icon_global_eps_native')?.dx).toBe(0.25);
		expect(domainGrid('ncep_gefs025_ensemble_mean')?.dx).toBe(0.25);
		expect(domainGrid('ecmwf_ifs025_ensemble_mean')?.dx).toBe(0.25);
		expect(domainGrid('ncep_hgefs025_ensemble_mean')?.dx).toBe(0.25);
		expect(domainGrid('kma_ldps')?.unit).toBe('km');
	});

	test('has no grid for seamless models', () => {
		expect(domainGrid('best_match')).toBeUndefined();
		expect(domainGrid('dwd_icon_seamless')).toBeUndefined();
	});
});

describe('boundingBoxAround', () => {
	test('spans two grid cells of a regular grid around the coordinate', () => {
		expect(boundingBoxAround(52.52, 13.41, ['dwd_icon_d2'])).toEqual({
			south: 52.5,
			west: 13.39,
			north: 52.54,
			east: 13.43
		});
	});

	test('converts kilometre grids at the latitude of the coordinate', () => {
		const box = boundingBoxAround(40, -100, ['ncep_hrrr_conus']);
		const km = DOMAIN_GRIDS.ncep_hrrr_conus.dx * (360 / (2 * Math.PI * 6371));
		expect(box?.north).toBeCloseTo(40 + km, 5);
		expect(box?.east).toBeCloseTo(-100 + km / Math.cos((40 * Math.PI) / 180), 5);
	});

	test('sizes the box by the coarsest selected model', () => {
		expect(boundingBoxAround(52.52, 13.41, ['dwd_icon_eu', 'dwd_icon_global'])?.east).toBe(13.535);
	});

	test('falls back to a quarter degree only when no model has a grid', () => {
		expect(boundingBoxAround(52.52, 13.41, [])?.east).toBe(13.66);
		expect(boundingBoxAround(52.52, 13.41, ['best_match'])?.east).toBe(13.66);
		expect(boundingBoxAround(52.52, 13.41, ['best_match', 'dwd_icon_d2'])?.east).toBe(13.43);
	});

	test('clamps to the valid range and skips missing coordinates', () => {
		expect(boundingBoxAround(89.9, 179.9, ['dwd_icon_global'])).toEqual({
			south: 89.775,
			west: 179.775,
			north: 90,
			east: 180
		});
		expect(boundingBoxAround(NaN, 13.41, ['dwd_icon_d2'])).toBeUndefined();
		expect(boundingBoxAround(Number(undefined), 13.41, [])).toBeUndefined();
	});
});

describe('estimateGridCells', () => {
	test('counts the cells of each model with a known grid', () => {
		const box = { south: 52.4, west: 13.3, north: 52.65, east: 13.55 };
		expect(estimateGridCells(box, ['dwd_icon_global', 'dwd_icon_eu', 'best_match'])).toEqual([
			{ model: 'dwd_icon_global', label: 'DWD ICON', columns: 2, rows: 2 },
			{ model: 'dwd_icon_eu', label: 'DWD ICON EU', columns: 4, rows: 4 }
		]);
	});

	test('is empty while a field is cleared', () => {
		expect(
			estimateGridCells({ south: NaN, west: 13.3, north: 52.65, east: 13.55 }, ['dwd_icon_eu'])
		).toEqual([]);
	});
});

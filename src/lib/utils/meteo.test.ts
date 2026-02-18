import { describe, expect, test } from 'vitest';

import {
	altitudeAboveSeaLevelMeters,
	countHeightVariables,
	countPressureVariables,
	countPreviousVariables,
	countVariables,
	geoLocationNameToRoute,
	getWeatherCode,
	membersPerModel
} from './meteo';

describe('altitudeAboveSeaLevelMeters', () => {
	test('returns meters for 1000 hPa', () => {
		expect(altitudeAboveSeaLevelMeters(1000)).toBe('110 m');
	});

	test('returns km for 750 hPa', () => {
		expect(altitudeAboveSeaLevelMeters(750)).toBe('2.5 km');
	});

	test('returns km for 500 hPa', () => {
		expect(altitudeAboveSeaLevelMeters(500)).toBe('5.6 km');
	});

	test('returns km for 250 hPa', () => {
		expect(altitudeAboveSeaLevelMeters(250)).toBe('10.4 km');
	});

	test('returns km for 0 hPa', () => {
		expect(altitudeAboveSeaLevelMeters(0)).toBe('44 km');
	});

	test('returns NaN for negative pressure', () => {
		expect(altitudeAboveSeaLevelMeters(-250)).toBe('NaN km');
	});

	test('returns negative meters for very high pressure (below sea level)', () => {
		expect(altitudeAboveSeaLevelMeters(25000)).toBe('-37250 m');
	});

	test('returns NaN for undefined', () => {
		expect(altitudeAboveSeaLevelMeters(undefined as unknown as number)).toBe('NaN km');
	});

	test('returns rounded meters between 500-2000m', () => {
		expect(altitudeAboveSeaLevelMeters(950)).toBe('500 m');
	});
});

describe('getWeatherCode', () => {
	test('returns description for code 0 (fair)', () => {
		expect(getWeatherCode(0)).toBe('fair');
	});

	test('returns description for code 1 (mainly clear)', () => {
		expect(getWeatherCode(1)).toBe('mainly clear');
	});

	test('returns description for code 82 (heavy rain showers)', () => {
		expect(getWeatherCode(82)).toBe('heavy rain showers');
	});

	test('returns description for code 95 (thunderstorm)', () => {
		expect(getWeatherCode(95)).toBe('slight to moderate thunderstorm');
	});

	test('returns "unknown code" for unrecognized code', () => {
		expect(getWeatherCode(117)).toBe('unknown code');
	});

	test('returns "-" for null', () => {
		expect(getWeatherCode(null)).toBe('-');
	});

	test('returns "-" for undefined', () => {
		expect(getWeatherCode(undefined as unknown as null)).toBe('-');
	});

	test('handles string code by converting to number', () => {
		expect(getWeatherCode('45')).toBe('fog');
	});
});

describe('geoLocationNameToRoute', () => {
	test('strips diacritics', () => {
		expect(geoLocationNameToRoute('são-paolo')).toBe('sao-paolo');
	});

	test('replaces apostrophes with hyphens', () => {
		expect(geoLocationNameToRoute("xi'an")).toBe('xi-an');
	});

	test('replaces spaces with hyphens', () => {
		expect(geoLocationNameToRoute('new taipei city')).toBe('new-taipei-city');
	});

	test('lowercases uppercase input', () => {
		expect(geoLocationNameToRoute('Berlin')).toBe('berlin');
	});

	test('handles multiple diacritics', () => {
		expect(geoLocationNameToRoute('Zürich')).toBe('zurich');
	});

	test('handles already clean input', () => {
		expect(geoLocationNameToRoute('london')).toBe('london');
	});
});

describe('countVariables', () => {
	const variables: { value: string; label: string }[][] = [
		[
			{ value: 'temperature_2m', label: 'Temperature' },
			{ value: 'humidity', label: 'Humidity' }
		],
		[{ value: 'wind_speed', label: 'Wind Speed' }]
	];

	test('counts total flattened variables', () => {
		const result = countVariables(variables, []);
		expect(result.total).toBe(3);
	});

	test('counts active variables from param array', () => {
		const result = countVariables(variables, ['temperature_2m', 'wind_speed']);
		expect(result.active).toBe(2);
	});

	test('returns 0 active when param is undefined', () => {
		const result = countVariables(variables, undefined);
		expect(result.active).toBe(0);
	});

	test('returns 0 active when param is a string (not array)', () => {
		const result = countVariables(variables, 'temperature_2m');
		expect(result.active).toBe(0);
	});

	test('ignores param values not in the variables list', () => {
		const result = countVariables(variables, ['temperature_2m', 'precipitation']);
		expect(result.active).toBe(1);
	});

	test('returns 0 active for empty param array', () => {
		const result = countVariables(variables, []);
		expect(result.active).toBe(0);
	});
});

describe('countPreviousVariables', () => {
	const variables: { value: string; label: string }[][] = [
		[
			{ value: 'temperature_2m', label: 'Temperature' },
			{ value: 'wind_speed', label: 'Wind Speed' }
		]
	];

	test('counts params that start with a variable value', () => {
		const result = countPreviousVariables(variables, [
			'temperature_2m_previous_day1',
			'temperature_2m_previous_day2',
			'wind_speed_previous_day1'
		]);
		expect(result.active).toBe(3);
	});

	test('returns total as variables * 8', () => {
		const result = countPreviousVariables(variables, []);
		expect(result.total).toBe(16);
	});

	test('returns 0 active when no params match', () => {
		const result = countPreviousVariables(variables, ['humidity_previous_day1']);
		expect(result.active).toBe(0);
	});

	test('returns 0 active for empty param list', () => {
		const result = countPreviousVariables(variables, []);
		expect(result.active).toBe(0);
	});
});

describe('countPressureVariables', () => {
	const variables = [
		{ value: 'temperature', label: 'Temperature' },
		{ value: 'geopotential_height', label: 'Geopotential Height' }
	];
	const levels = [850, 500];

	test('counts matching pressure variable-level combinations', () => {
		const result = countPressureVariables(variables, levels, [
			'temperature_850hPa',
			'temperature_500hPa'
		]);
		expect(result.active).toBe(2);
	});

	test('returns total as variables * levels', () => {
		const result = countPressureVariables(variables, levels, []);
		expect(result.total).toBe(4);
	});

	test('returns 0 active when no params match', () => {
		const result = countPressureVariables(variables, levels, ['wind_speed_850hPa']);
		expect(result.active).toBe(0);
	});

	test('returns 0 active for undefined param', () => {
		const result = countPressureVariables(variables, levels, undefined);
		expect(result.active).toBe(0);
	});

	test('handles all combinations selected', () => {
		const result = countPressureVariables(variables, levels, [
			'temperature_850hPa',
			'temperature_500hPa',
			'geopotential_height_850hPa',
			'geopotential_height_500hPa'
		]);
		expect(result.active).toBe(4);
	});
});

describe('countHeightVariables', () => {
	const variables = [
		{ value: 'wind_speed', label: 'Wind Speed' },
		{ value: 'wind_direction', label: 'Wind Direction' }
	];
	const levels = [10, 80, 120];

	test('counts matching height variable-level combinations', () => {
		const result = countHeightVariables(variables, levels, ['wind_speed_10m', 'wind_speed_80m']);
		expect(result.active).toBe(2);
	});

	test('returns total as variables * levels', () => {
		const result = countHeightVariables(variables, levels, []);
		expect(result.total).toBe(6);
	});

	test('returns 0 active when no params match', () => {
		const result = countHeightVariables(variables, levels, ['temperature_10m']);
		expect(result.active).toBe(0);
	});

	test('handles all combinations selected', () => {
		const result = countHeightVariables(variables, levels, [
			'wind_speed_10m',
			'wind_speed_80m',
			'wind_speed_120m',
			'wind_direction_10m',
			'wind_direction_80m',
			'wind_direction_120m'
		]);
		expect(result.active).toBe(6);
	});
});

describe('membersPerModel', () => {
	test('returns 40 for icon_seamless', () => {
		expect(membersPerModel('icon_seamless')).toBe(40);
	});

	test('returns 40 for icon_global', () => {
		expect(membersPerModel('icon_global')).toBe(40);
	});

	test('returns 20 for icon_d2', () => {
		expect(membersPerModel('icon_d2')).toBe(20);
	});

	test('returns 31 for gfs_seamless', () => {
		expect(membersPerModel('gfs_seamless')).toBe(31);
	});

	test('returns 51 for ecmwf_ifs025', () => {
		expect(membersPerModel('ecmwf_ifs025')).toBe(51);
	});

	test('returns 21 for gem_global', () => {
		expect(membersPerModel('gem_global')).toBe(21);
	});

	test('returns 1 for unknown model', () => {
		expect(membersPerModel('unknown_model')).toBe(1);
	});

	test('returns 1 for empty string', () => {
		expect(membersPerModel('')).toBe(1);
	});
});

import { describe, expect, test } from 'vitest';

import { parseApiUrl, serverType } from './api-url';

import type { Parameters } from '$lib/docs';

const defaults: Parameters = {
	daily: [],
	hourly: [],
	models: [],
	current: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: undefined,

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: '7',

	start_date: undefined,
	end_date: undefined,

	cell_selection: undefined,

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
};

const current: Parameters = {
	latitude: [52.52],
	longitude: [13.41],
	...defaults,
	hourly: ['temperature_2m']
};

const options = { current, defaults, type: 'forecast', action: 'forecast' };

const parse = (url: string, overrides = {}) =>
	parseApiUrl(url, { ...options, ...overrides }).params as Parameters;

describe('serverType', () => {
	test('maps the forecast api', () => {
		expect(serverType('api.open-meteo.com')).toBe('forecast');
	});

	test('maps commercial servers', () => {
		expect(serverType('customer-api.open-meteo.com')).toBe('forecast');
		expect(serverType('customer-archive-api.open-meteo.com')).toBe('archive');
	});

	test('maps other endpoints', () => {
		expect(serverType('air-quality-api.open-meteo.com')).toBe('air-quality');
		expect(serverType('historical-forecast-api.open-meteo.com')).toBe('historical-forecast');
		expect(serverType('single-runs-api.open-meteo.com')).toBe('single-runs');
	});

	test('returns undefined for self hosted servers', () => {
		expect(serverType('my-server.tld')).toBeUndefined();
		expect(serverType('open-meteo.com')).toBeUndefined();
	});
});

describe('parseApiUrl', () => {
	test('rejects invalid urls', () => {
		expect(parseApiUrl('not a url', options).error).toBeTruthy();
		expect(parseApiUrl('javascript:alert(1)', options).error).toBeTruthy();
	});

	test('rejects urls of another endpoint', () => {
		expect(
			parseApiUrl('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=52.52', options)
				.error
		).toBeTruthy();
		expect(
			parseApiUrl('https://api.open-meteo.com/v1/elevation?latitude=52.52', options).error
		).toBeTruthy();
	});

	test('accepts the endpoint of the page', () => {
		expect(
			parseApiUrl('https://air-quality-api.open-meteo.com/v1/air-quality?hourly=pm10', {
				...options,
				type: 'air-quality',
				action: 'air-quality'
			}).error
		).toBeUndefined();
	});

	test('accepts self hosted servers', () => {
		const params = parse('https://my-server.tld/v1/forecast?latitude=52.52&hourly=precipitation');
		expect(params.hourly).toEqual(['precipitation']);
	});

	test('splits array parameters', () => {
		const params = parse(
			'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,precipitation'
		);
		expect(params.hourly).toEqual(['temperature_2m', 'precipitation']);
		expect(params.latitude).toEqual(['52.52']);
	});

	test('resets parameters missing in the url to the defaults', () => {
		const params = parse(
			'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max'
		);
		expect(params.hourly).toEqual([]);
		expect(params.daily).toEqual(['temperature_2m_max']);
		expect(params.forecast_days).toBe('7');
		expect(params.temperature_unit).toBe('celsius');
	});

	test('keeps parameters without a page default', () => {
		const params = parse('https://api.open-meteo.com/v1/forecast?hourly=precipitation');
		expect(params.latitude).toEqual([52.52]);
	});

	test('does not share arrays with the defaults', () => {
		const params = parse('https://api.open-meteo.com/v1/forecast?latitude=52.52');
		expect(params.hourly).not.toBe(defaults.hourly);
	});

	test('drops the api key and format', () => {
		const params = parse(
			'https://customer-api.open-meteo.com/v1/forecast?latitude=52.52&apikey=secret&format=csv'
		);
		expect(params.apikey).toBeUndefined();
		expect(params.format).toBeUndefined();
	});

	test('takes the time interval from start and end date', () => {
		const params = parse(
			'https://api.open-meteo.com/v1/forecast?latitude=52.52&start_date=2025-01-01&end_date=2025-01-31'
		);
		expect(params.time_mode).toBe('time_interval');
		expect(params.start_date).toBe('2025-01-01');
		expect(params.end_date).toBe('2025-01-31');
	});

	test('falls back to forecast days', () => {
		const params = parse(
			'https://api.open-meteo.com/v1/forecast?latitude=52.52&forecast_days=3&past_days=2'
		);
		expect(params.time_mode).toBe('forecast_days');
		expect(params.forecast_days).toBe('3');
		expect(params.past_days).toBe('2');
	});

	test('detects the bounding box mode', () => {
		const params = parse(
			'https://api.open-meteo.com/v1/forecast?bounding_box=47,-85,47.5,-84.5&hourly=temperature_2m'
		);
		expect(params.location_mode).toBe('bounding_box');
		expect(params.bounding_box).toBe('47,-85,47.5,-84.5');
	});

	test('detects multiple locations and builds the coordinates list', () => {
		const params = parse(
			'https://api.open-meteo.com/v1/forecast?latitude=52.52,50.12&longitude=13.41,8.68'
		);
		expect(params.location_mode).toBe('csv_coordinates');
		expect(params.csv_coordinates).toBe('52.52,13.41\n50.12,8.68');
	});

	test('puts per location values into the coordinates list', () => {
		const params = parse(
			'https://api.open-meteo.com/v1/forecast?latitude=52.52,50.12&longitude=13.41,8.68&elevation=2500,100&timezone=Europe/Berlin,Europe/Berlin'
		);
		expect(params.csv_coordinates).toBe(
			'52.52,13.41,2500,Europe/Berlin\n50.12,8.68,100,Europe/Berlin'
		);
		expect(params.timezone).toBe('UTC');
	});

	test('keeps a single timezone as a regular parameter', () => {
		const params = parse(
			'https://api.open-meteo.com/v1/forecast?latitude=52.52,50.12&longitude=13.41,8.68&timezone=auto'
		);
		expect(params.csv_coordinates).toBe('52.52,13.41\n50.12,8.68');
		expect(params.timezone).toBe('auto');
	});

	test('takes the api mode from the server', () => {
		const withApiMode = { current: { ...current, api_mode: 'forecast', run: '' } };
		expect(
			parse(
				'https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=52.52&start_date=2024-01-01&end_date=2024-01-31',
				withApiMode
			)
		).toMatchObject({ api_mode: 'historical_forecast', time_mode: 'time_interval', run: '' });
		expect(
			parse(
				'https://single-runs-api.open-meteo.com/v1/forecast?latitude=52.52&run=2026-08-19T00:00',
				withApiMode
			)
		).toMatchObject({
			api_mode: 'single_run',
			time_mode: 'time_interval',
			run: '2026-08-19T00:00'
		});
		expect(
			parse('https://api.open-meteo.com/v1/forecast?latitude=52.52', withApiMode)
		).toMatchObject({ api_mode: 'forecast', time_mode: 'forecast_days', run: '' });
	});

	test('rejects api mode servers on pages without api mode', () => {
		expect(
			parseApiUrl('https://single-runs-api.open-meteo.com/v1/forecast?latitude=52.52', options)
				.error
		).toBeTruthy();
	});

	test('keeps an implicit default model implicit', () => {
		const params = parse('https://api.open-meteo.com/v1/forecast?latitude=52.52&models=ecmwf_ifs', {
			model_default: 'ecmwf_ifs'
		});
		expect(params.models).toEqual([]);
	});

	test('keeps other models', () => {
		const params = parse(
			'https://api.open-meteo.com/v1/forecast?latitude=52.52&models=ecmwf_aifs',
			{
				model_default: 'ecmwf_ifs'
			}
		);
		expect(params.models).toEqual(['ecmwf_aifs']);
	});
});

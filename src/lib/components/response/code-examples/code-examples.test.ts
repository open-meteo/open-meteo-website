import { describe, expect, it } from 'vitest';

import { pythonCodeExample } from './python-code-example';
import { swiftCodeExample } from './swift-code-example';
import { typescriptCodeExample } from './typescript-code-example';

import type { Parameters } from '$lib/docs';

/** Strip highlighting markup so the generated program can be inspected as plain text */
const plainText = (html: string): string =>
	html
		.replace(/<[^>]+>/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&gt;/g, '>')
		.replace(/&lt;/g, '<')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");

const ensembleParams: Parameters = {
	latitude: [52.52],
	longitude: [13.41],
	hourly: ['temperature_2m', 'soil_moisture_0_to_10cm']
} as unknown as Parameters;

// results-preview collapses single-element arrays to scalars, so generators
// must handle a plain string section identically to an array section
const singleVariableParams: Parameters = {
	latitude: [52.52],
	longitude: [13.41],
	hourly: 'precipitation'
} as unknown as Parameters;

const SERVER = 'https://ensemble-api.open-meteo.com/v1/ensemble';

// Days without a moonrise or moonset return Int64.max instead of a timestamp
const int64Params: Parameters = {
	latitude: [52.52],
	longitude: [13.41],
	daily: ['sunrise', 'moonrise', 'temperature_2m_max']
} as unknown as Parameters;

describe('typescript ensemble example', () => {
	const code = plainText(
		typescriptCodeExample(ensembleParams, false, 1, 0, SERVER, 'ensemble_api')
	);

	it('emits a valid Array.from callback', () => {
		expect(code).toContain('=> hourly.variables(i),');
		expect(code).not.toContain('variables(i)},');
	});

	it('parses depth ranges into depth/depthTo filters', () => {
		expect(code).toContain('v?.variable() === Variable.soil_moisture');
		expect(code).toContain('v?.depth() === 0');
		expect(code).toContain('v?.depthTo() === 10');
		expect(code).not.toContain('soil_moisture_0_to ');
		expect(code).not.toContain('undefined');
	});
});

describe('typescript int64 example', () => {
	const code = plainText(typescriptCodeExample(int64Params, false, 1, 0, SERVER, 'weather_api'));

	it('guards the missing sentinel for moonrise only', () => {
		expect(code).toContain('const missingInt64 = 9223372036854775807n;');
		expect(code).toContain('return value === missingInt64 ? null : new Date(');
		expect(code).toContain(
			'(_ , i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)'
		);
	});

	it('declares int64 variables for single string sections', () => {
		const single = plainText(
			typescriptCodeExample(
				{ latitude: [52.52], longitude: [13.41], daily: 'moonrise' } as unknown as Parameters,
				false,
				1,
				0,
				SERVER,
				'weather_api'
			)
		);
		expect(single).toContain('const moonrise = daily.variables(0)!;');
	});
});

describe('python int64 example', () => {
	const code = plainText(pythonCodeExample(int64Params, false, 1, 0, SERVER, 'weather_api', 3600));

	it('masks the missing sentinel for moonrise only', () => {
		expect(code).toContain('missing_int64 = 9223372036854775807');
		expect(code).toContain(
			'daily_moonrise = pd.Series(daily_moonrise).mask(daily_moonrise == missing_int64)'
		);
		expect(code).not.toContain('daily_sunrise = pd.Series(');
	});

	it('converts Int64 timestamps to datetimes', () => {
		expect(code).toContain(
			'daily_data["sunrise"] = pd.to_datetime(daily_sunrise, unit = "s", utc = True)'
		);
		expect(code).toContain(
			'daily_data["moonrise"] = pd.to_datetime(daily_moonrise, unit = "s", utc = True)'
		);
		expect(code).toContain('daily_data["temperature_2m_max"] = daily_temperature_2m_max');
	});

	it("localizes datetimes with '.dt' only for masked series", () => {
		const localized = plainText(
			pythonCodeExample(
				{ ...int64Params, timezone: 'Europe/Berlin' } as unknown as Parameters,
				false,
				1,
				0,
				SERVER,
				'weather_api',
				3600
			)
		);
		expect(localized).toContain(
			'pd.to_datetime(daily_sunrise, unit = "s", utc = True).tz_convert(response.Timezone().decode())'
		);
		expect(localized).toContain(
			'pd.to_datetime(daily_moonrise, unit = "s", utc = True).dt.tz_convert(response.Timezone().decode())'
		);
	});
});

describe('swift int64 example', () => {
	const code = plainText(swiftCodeExample(int64Params, false, 1, 0, SERVER));

	it('maps Int64 timestamps to dates, optional where values can be missing', () => {
		expect(code).toContain('let sunrise: [Date]');
		expect(code).toContain('let moonrise: [Date?]');
		expect(code).toContain(
			'sunrise: daily.variables(at: 0)!.valuesInt64.map {\n\t\t\tDate(timeIntervalSince1970: TimeInterval($0 + Int64(utcOffsetSeconds)))'
		);
		expect(code).toContain('$0 == Int64.max ? nil : Date(timeIntervalSince1970:');
	});

	it('prints dates through the date formatter', () => {
		expect(code).toContain('print(dateFormatter.string(from: data.daily.sunrise[i]))');
		expect(code).toContain('print(data.daily.moonrise[i].map { dateFormatter.string(from: $0) }');
	});
});

describe('python ensemble example', () => {
	const code = plainText(
		pythonCodeExample(ensembleParams, false, 1, 0, SERVER, 'ensemble_api', 3600)
	);

	it('emits a valid lambda for the variables list', () => {
		expect(code).toContain('lambda i: hourly.Variables(i)');
	});

	it('parses depth ranges into Depth/DepthTo filters', () => {
		expect(code).toContain('x.Variable() == Variable.soil_moisture');
		expect(code).toContain('x.Depth() == 0');
		expect(code).toContain('x.DepthTo() == 10');
	});

	it('filters on the selected variable when a single variable is requested', () => {
		const single = plainText(
			pythonCodeExample(singleVariableParams, false, 1, 0, SERVER, 'ensemble_api', 3600)
		);
		expect(single).toContain('lambda x: x.Variable() == Variable.precipitation');
		expect(single).not.toContain('Variable.temperature');
	});
});

describe('swift example', () => {
	const params: Parameters = {
		latitude: [52.52],
		longitude: [13.41],
		current: ['temperature_2m'],
		hourly: ['temperature_2m', 'wind_speed_10m']
	} as unknown as Parameters;
	const code = plainText(swiftCodeExample(params, false, 1, 0, SERVER));

	it('uses camelCase consistently between struct fields and usages', () => {
		expect(code).toContain('let temperature2m: [Float]');
		expect(code).toContain('temperature2m: hourly.variables(at: 0)!.values');
		expect(code).toContain('temperature2m: current.variables(at: 0)!.value');
		expect(code).toContain('data.hourly.temperature2m[i]');
		expect(code).not.toMatch(/\t\ttemperature_2m/);
	});

	it('does not emit trailing commas in call arguments', () => {
		expect(code).not.toMatch(/,\s*\)/);
	});

	it('references the correct section for single string variables', () => {
		const single = plainText(swiftCodeExample(singleVariableParams, false, 1, 0, SERVER));
		expect(single).toContain('precipitation: hourly.variables(at: 0)!.values');
		expect(single).not.toContain('current.variables');
	});
});

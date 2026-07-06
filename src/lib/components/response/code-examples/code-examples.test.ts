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

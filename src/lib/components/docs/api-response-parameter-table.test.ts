import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';

import { describe, expect, test } from 'vitest';

import ApiResponseParameterTable from './api-response-parameter-table.svelte';
import { apiResponseParameters } from './api-response-parameters.svelte';

const withoutComments = (html: string) => html.replace(/<!--[\s\S]*?-->/g, '');

describe('API response parameter table', () => {
	test('renders only the selected response fields and three response columns', () => {
		const { body } = render(ApiResponseParameterTable, {
			props: {
				parameters: [apiResponseParameters.coordinates, apiResponseParameters.utc_offset_seconds]
			}
		});
		expect(body.match(/scope="col"/g)).toHaveLength(3);
		expect(body.match(/scope="row"/g)).toHaveLength(2);
		expect(body).toContain('latitude, longitude');
		expect(body).toContain('utc_offset_seconds');
		expect(body).not.toContain('generationtime_ms');
		expect(body).not.toContain('Required');
		expect(body).not.toContain('Default');
	});

	test('preserves rich descriptions and multi-line parameter names', () => {
		const { body } = render(ApiResponseParameterTable, {
			props: { parameters: [apiResponseParameters.timezone, apiResponseParameters.elevation] }
		});
		const html = withoutComments(body);
		expect(html).toMatch(/timezone\s*<br\s*\/>\s*timezone_abbreviation/);
		expect(html).toContain('<mark>Europe/Berlin</mark>');
		expect(html).toContain('<mark>&amp;elevation=nan</mark>');
	});

	test('supports API-specific overrides and custom snippets without changing shared definitions', () => {
		const description = createRawSnippet(() => ({
			render: () => '<p>See the <a href="#locations">location details</a>.</p>'
		}));
		const { body } = render(ApiResponseParameterTable, {
			props: {
				parameters: [
					{ ...apiResponseParameters.timezone, name: 'timezone', description },
					{ name: 'id', format: 'Integer', description: 'Unique location ID' }
				]
			}
		});
		expect(body).toContain('<a href="#locations">location details</a>');
		expect(body).toContain('Unique location ID');
		expect(body).not.toContain('timezone_abbreviation');
		expect(apiResponseParameters.timezone.name).toEqual(['timezone', 'timezone_abbreviation']);
	});

	test('escapes plain text descriptions', () => {
		const { body } = render(ApiResponseParameterTable, {
			props: {
				parameters: [{ name: 'example', format: 'String', description: '<em>plain text</em>' }]
			}
		});
		expect(body).toContain('&lt;em>plain text&lt;/em>');
		expect(body).not.toContain('<em>plain text</em>');
	});
});

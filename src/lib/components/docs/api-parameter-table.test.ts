import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';

import { describe, expect, test } from 'vitest';

import ApiParameterTable from './api-parameter-table.svelte';
import { apiParameters } from './api-parameters.svelte';

const withoutComments = (html: string) => html.replace(/<!--[\s\S]*?-->/g, '');

describe('API parameter table', () => {
	test('renders shared rows with per-API overrides without changing shared defaults', () => {
		const { body } = render(ApiParameterTable, {
			props: {
				parameters: [
					{
						...apiParameters.models,
						required: true,
						defaultValue: '',
						description: 'Select ensemble models.'
					},
					{ ...apiParameters.cell_selection, defaultValue: 'sea' }
				]
			}
		});
		const html = withoutComments(body);
		expect(html).toContain('<td>Yes</td>');
		expect(html).toContain('Select ensemble models.');
		expect(html).toContain('<mark>sea</mark>');
		expect(html).not.toContain('<mark>auto</mark>');
		expect(apiParameters.models.required).toBe(false);
		expect(apiParameters.models.defaultValue).toBe('auto');
		expect(apiParameters.cell_selection.defaultValue).toBe('land');
	});

	test('renders multi-line names and rich shared descriptions', () => {
		const { body } = render(ApiParameterTable, {
			props: { parameters: [apiParameters.start_date, apiParameters.timeformat] }
		});
		const html = withoutComments(body);
		expect(html).toMatch(/start_date\s*<br\s*\/>\s*end_date/);
		expect(html).toContain('<mark>unixtime</mark>');
		expect(html).toContain('<mark>utc_offset_seconds</mark>');
		expect(html).not.toContain('<caption>');
	});

	test('supports custom description and caption snippets', () => {
		const description = createRawSnippet(() => ({
			render: () => '<p>Read the <a href="#details">matching rules</a>.</p>'
		}));
		const caption = createRawSnippet(() => ({
			render: () => '<span>See <a href="#updates">update times</a>.</span>'
		}));
		const { body } = render(ApiParameterTable, {
			props: {
				parameters: [{ name: 'name', format: 'String', description }],
				caption,
				minWidth: 'min-w-250'
			}
		});
		expect(body).toContain('<a href="#details">matching rules</a>');
		expect(body).toContain('<a href="#updates">update times</a>');
		expect(body).toContain('<caption>');
		expect(body).toContain('min-w-250');
	});

	test('escapes plain text descriptions and captions', () => {
		const { body } = render(ApiParameterTable, {
			props: {
				parameters: [{ name: 'example', format: 'String', description: '<em>plain text</em>' }],
				caption: '<strong>caption</strong>'
			}
		});
		expect(body).toContain('&lt;em>plain text&lt;/em>');
		expect(body).toContain('&lt;strong>caption&lt;/strong>');
		expect(body).not.toContain('<em>plain text</em>');
	});
});

import type { Parameters } from '$lib/docs';
import { isNumeric, titleCase, camelCase } from '$lib/utils';

import { INT_64_VARIABLES } from '$lib/constants';

export const typescriptCodeExample = (
	params: Parameters,
	multipleLocationsOrModels: boolean,
	numberOfLocations: number | string,
	numberOfModels: number,
	server: string,
	sdk_type: string,
	sdk_cache: number
) => {
	const p = multipleLocationsOrModels;

	let c = `<div class=""><pre class="javascript" style="background-color:var(--code-preview-background);color:var(--code-preview-foreground)"><code><span class="line"><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">import</span><span style="color:var(--code-preview-foreground)"> <span style="color:var(--code-preview-token-bracket)">{</span> fetchWeatherApi <span style="color:var(--code-preview-token-bracket)">}</span> </span><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">from</span><span style="color:var(--code-preview-token-string-expression)"> 'openmeteo'</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
<span class="line"></span>`;
	if (sdk_type === 'ensemble_api') {
		c += `
<span class="line"><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">import</span><span style="color:var(--code-preview-foreground)"> <span style="color:var(--code-preview-token-bracket)">{</span> Variable <span style="color:var(--code-preview-token-bracket)">}</span> </span><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">from</span><span style="color:var(--code-preview-token-string-expression)"> '@openmeteo/sdk/variable'</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">import</span><span style="color:var(--code-preview-foreground)"> <span style="color:var(--code-preview-token-bracket)">{</span> Aggregation <span style="color:var(--code-preview-token-bracket)">}</span> </span><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">from</span><span style="color:var(--code-preview-token-string-expression)"> '@openmeteo/sdk/aggregation'</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
		`;
	}

	c += `
<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> params</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-foreground)"> <span style="color:var(--code-preview-token-bracket)">{</span></span></span>`;
	for (const [key, param] of Object.entries(params)) {
		if (param.constructor === Array) {
			if (typeof param[0] === 'string' && !isNumeric(param[0])) {
				c += `
<span class="line"><span style="color:var(--code-preview-token-string-key)">	<span style="color:var(--code-preview-token-punctuation-mark)">"</span>${key}<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">:</span> ${'<span style="color:var(--code-preview-token-bracket)">[<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-string-expression)">' + param.join('</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-punctuation-mark)">, <span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-string-expression)">') + '</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-bracket)">]</span>'}<span style="color:var(--code-preview-token-punctuation-mark)">,</span>`;
			} else {
				c += `
<span class="line"><span style="color:var(--code-preview-token-string-key)">	<span style="color:var(--code-preview-token-punctuation-mark)">"</span>${key}<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> ${'<span style="color:var(--code-preview-token-bracket)">[</span>' + param.join('<span style="color:var(--code-preview-token-punctuation-mark)">, </span>') + '<span style="color:var(--code-preview-token-bracket)">]</span>'}</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
			}
		} else if (typeof param === 'object') {
			// ???
		} else if (typeof param === 'string' && !isNumeric(param)) {
			c += `
<span class="line"><span style="color:var(--code-preview-token-string-key)">	<span style="color:var(--code-preview-token-punctuation-mark)">"</span>${key}<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> ${'<span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">' + param + '</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span>'}</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
		} else {
			c += `
<span class="line"><span style="color:var(--code-preview-token-string-key)">	<span style="color:var(--code-preview-token-punctuation-mark)">"</span>${key}<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> ${param}</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
		}
	}
	c += `
<span class="line"><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-bracket)">}</span><span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> url</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-string-expression)"> "${server}"</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> responses</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-keyword-special);font-style:italic;"> await</span><span style="color:var(--code-preview-token-function)"> fetchWeatherApi</span><span style="color:var(--code-preview-foreground)">(url</span><span style="color:var(--code-preview-token-punctuation)">,</span><span style="color:var(--code-preview-foreground)"> params)<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
<span class="line"></span>`;
	if (multipleLocationsOrModels) {
		c +=
			`
<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic">// Process ` +
			(numberOfLocations ? `${numberOfLocations} locations` : '1 location') +
			(numberOfModels ? ` and ${numberOfModels} models` : '') +
			`</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">for</span><span style="color:var(--code-preview-foreground)"> (</span><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-keyword-special);font-style:italic;"> of</span><span style="color:var(--code-preview-foreground)"> responses) {</span></span>`;
	} else {
		c += `
<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">// Process first location. Add a for-loop for multiple locations or weather models</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-foreground)"> responses[</span><span style="color:var(--code-preview-token-constant)">0</span><span style="color:var(--code-preview-foreground)">]<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
<span class="line"></span>`;
	}

	c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">// Attributes for timezone and location</span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> utcOffsetSeconds</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>utcOffsetSeconds</span><span style="color:var(--code-preview-foreground)">()<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> timezone</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>timezone</span><span style="color:var(--code-preview-foreground)">()<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> timezoneAbbreviation</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>timezoneAbbreviation</span><span style="color:var(--code-preview-foreground)">()<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> latitude</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>latitude</span><span style="color:var(--code-preview-foreground)">()<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> longitude</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>longitude</span><span style="color:var(--code-preview-foreground)">()<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
${p ? '\t' : ''}<span class="line"></span>`;
	let int64Found = false;
	for (const section of ['current', 'minutely_15', 'hourly', 'daily', 'six_hourly']) {
		const sect = params[section];
		if (sect) {
			c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> ${section}</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${section}</span><span style="color:var(--code-preview-foreground)">()</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>`;
		}
		if (sect && sect.constructor === Array) {
			for (const [_, variable] of sect.entries()) {
				if (INT_64_VARIABLES.includes(variable)) {
					int64Found = true;
				}
			}
		}
	}
	c += `
${p ? '\t' : ''}<span class="line"></span>`;

	if (int64Found) {
		c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">// Define Int64 variables so they can be processed accordingly</span></span>`;
		for (const section of ['current', 'minutely_15', 'hourly', 'daily', 'six_hourly']) {
			const sect = params[section];
			if (sect && sect.constructor === Array) {
				for (const [ind, variable] of sect.entries()) {
					if (INT_64_VARIABLES.includes(variable)) {
						c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> ${variable}</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> ${section}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>variables</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-constant)">${ind}</span><span style="color:var(--code-preview-foreground)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>`;
					}
				}
			}
		}
		c += `
${p ? '\t' : ''}<span class="line"></span>`;
	}

	c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">// Note: The order of weather variables in the URL query and the indices below need to match!</span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> weatherData</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-foreground)"> <span style="color:var(--code-preview-token-bracket)">{</span></span></span>`;
	for (const section of ['current', 'minutely_15', 'hourly', 'daily', 'six_hourly']) {
		const sect = params[section];
		if (sect) {
			c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">	${section}</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-foreground)"> <span style="color:var(--code-preview-token-bracket)">{</span></span></span>`;
			if (section === 'current') {
				c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">		time</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-keyword-special)"> new</span><span style="color:var(--code-preview-token-function)"> Date</span><span style="color:var(--code-preview-foreground)">((</span><span style="color:var(--code-preview-token-function)">Number</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">current</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>time</span><span style="color:var(--code-preview-foreground)">()) </span><span style="color:var(--code-preview-token-punctuation-mark)">+</span><span style="color:var(--code-preview-foreground)"> utcOffsetSeconds) </span><span style="color:var(--code-preview-token-punctuation-mark)">*</span><span style="color:var(--code-preview-token-constant)"> 1000</span><span style="color:var(--code-preview-foreground)">)</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>`;
			} else {
				c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">		time</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-foreground)"> [</span><span style="color:var(--code-preview-token-punctuation-mark)">...</span><span style="color:var(--code-preview-token-function)">Array</span><span style="color:var(--code-preview-foreground)">((</span><span style="color:var(--code-preview-token-function)">Number</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${section}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>timeEnd</span><span style="color:var(--code-preview-foreground)">()) </span><span style="color:var(--code-preview-token-punctuation-mark)">-</span><span style="color:var(--code-preview-token-function)"> Number</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${section}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>time</span><span style="color:var(--code-preview-foreground)">())) </span><span style="color:var(--code-preview-token-punctuation-mark)">/</span><span style="color:var(--code-preview-token-variable)"> ${section}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>interval</span><span style="color:var(--code-preview-foreground)">())]</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>map</span><span style="color:var(--code-preview-foreground)">(</span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">			<span style="color:var(--code-preview-token-punctuation-mark)">(</span>_</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span><span style="color:var(--code-preview-foreground);font-style:italic;"> i<span style="color:var(--code-preview-token-punctuation-mark)">)</span> </span><span style="color:var(--code-preview-token-keyword)">=&gt</span><span style="color:var(--code-preview-token-keyword-special)"> new</span><span style="color:var(--code-preview-token-function)"> Date</span><span style="color:var(--code-preview-foreground)">((</span><span style="color:var(--code-preview-token-function)">Number</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${section}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>time</span><span style="color:var(--code-preview-foreground)">()) </span><span style="color:var(--code-preview-token-punctuation-mark)">+</span><span style="color:var(--code-preview-foreground)"> i </span><span style="color:var(--code-preview-token-punctuation-mark)">*</span><span style="color:var(--code-preview-token-variable)"> hourly</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>interval</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">+</span><span style="color:var(--code-preview-foreground)"> utcOffsetSeconds) </span><span style="color:var(--code-preview-token-punctuation-mark)">*</span><span style="color:var(--code-preview-token-constant)"> 1000</span><span style="color:var(--code-preview-foreground)">)</span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">		)</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
			}
			if (sect.constructor === Array) {
				for (const [ind, variable] of sect.entries()) {
					if (INT_64_VARIABLES.includes(variable)) {
						c += `
${p ? '\t' : ''}${p ? '\t' : ''}${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">// Map Int64 values to according structure</span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">		${variable}</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-foreground)"> [</span><span style="color:var(--code-preview-token-punctuation-mark)">...</span><span style="color:var(--code-preview-token-function)">Array</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${variable}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>valuesInt64Length</span><span style="color:var(--code-preview-foreground)">())]</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>map</span><span style="color:var(--code-preview-foreground)">(</span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">			<span style="color:var(--code-preview-token-punctuation-mark)">(</span>_</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span><span style="color:var(--code-preview-foreground);font-style:italic;"> i<span style="color:var(--code-preview-token-punctuation-mark)">)</span> </span><span style="color:var(--code-preview-token-keyword)">=&gt;</span></span><span style="color:var(--code-preview-token-keyword-special)"> new</span><span style="color:var(--code-preview-token-function)"> Date</span><span style="color:var(--code-preview-foreground)">((</span><span style="color:var(--code-preview-token-function)">Number</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${variable}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>valuesInt64</span><span style="color:var(--code-preview-foreground)">(i)) </span><span style="color:var(--code-preview-token-punctuation-mark)">+</span><span style="color:var(--code-preview-foreground)"> utcOffsetSeconds) </span><span style="color:var(--code-preview-token-punctuation-mark)">*</span><span style="color:var(--code-preview-token-constant)"> 1000</span><span style="color:var(--code-preview-foreground)">)</span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">		)</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
					} else {
						c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">		${variable}</span><span style="color:var(--code-preview-token-keyword)">:</span><span style="color:var(--code-preview-token-variable)"> ${section}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>variables</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-constant)">${ind}</span><span style="color:var(--code-preview-foreground)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${section === 'current' ? 'value' : 'valuesArray'}</span><span style="color:var(--code-preview-foreground)">()</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>`;
					}
				}
			} else if (typeof sect === 'string') {
				if (INT_64_VARIABLES.includes(sect)) {
					c += `
${p ? '\t' : ''}${p ? '\t' : ''}${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">// Map Int64 values to according structure</span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">		${sect}</span><span style="color:var(--code-preview-token-keyword)">:</span><span style="color:var(--code-preview-foreground)"> [</span><span style="color:var(--code-preview-token-keyword)">...</span><span style="color:var(--code-preview-token-function)">Array</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${sect}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>valuesInt64Length</span><span style="color:var(--code-preview-foreground)">())]</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>map</span><span style="color:var(--code-preview-foreground)">(</span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">			<span style="color:var(--code-preview-token-punctuation-mark)">(</span>_</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span><span style="color:var(--code-preview-foreground);font-style:italic;"> i<span style="color:var(--code-preview-token-punctuation-mark)">)</span> </span><span style="color:var(--code-preview-token-keyword)">=&gt;</span><span style="color:var(--code-preview-token-keyword-special)"> new</span><span style="color:var(--code-preview-token-function)"> Date</span><span style="color:var(--code-preview-foreground)">((</span><span style="color:var(--code-preview-token-function)">Number</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${sect}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>valuesInt64</span><span style="color:var(--code-preview-foreground)">(i)) </span><span style="color:var(--code-preview-token-punctuation-mark)">+</span><span style="color:var(--code-preview-foreground)"> utcOffsetSeconds) </span><span style="color:var(--code-preview-token-punctuation-mark)">*</span><span style="color:var(--code-preview-token-constant)"> 1000</span><span style="color:var(--code-preview-foreground)">)</span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">		<span style="color:var(--code-preview-token-punctuation-mark)">)</span></span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
				} else {
					c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">		${sect}</span><span style="color:var(--code-preview-token-keyword)">:</span><span style="color:var(--code-preview-token-variable)"> ${section}</span><span style="color:var(--code-preview-token-function)">.variables</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-constant)">0</span><span style="color:var(--code-preview-foreground)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${section === 'current' ? 'value' : 'valuesArray'}</span><span style="color:var(--code-preview-foreground)">()</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>`;
				}
			}

			c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">	<span style="color:var(--code-preview-token-bracket)">}</span></span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
		}
	}
	c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)"><span style="color:var(--code-preview-token-bracket)">}</span><span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>`;

	c += `
${p ? '\t' : ''}<span class="line"></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">// 'weatherData' now contains a simple structure with arrays with datetime and weather data</span></span>`;

	// generic info, maybe unnecessary
	c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">console</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>log</span><span style="color:var(--code-preview-foreground)">(</span></span>
${p ? '\t' : ''}<span class="line">	<span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">\`</span>\\nCoordinates: \${latitude}°N \${longitude}°E<span style="color:var(--code-preview-token-punctuation-mark)">\`</span></span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">)<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>`;

	for (const section of ['current', 'minutely_15', 'hourly', 'daily', 'six_hourly']) {
		const sect = params[section];
		if (sect) {
			if (section === 'current') {
				c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">console</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>log</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">\\n${titleCase(section)} data</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-foreground)">)</span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">console</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>log</span><span style="color:var(--code-preview-foreground)">(</span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">	weatherData</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span></span><span style="color:var(--code-preview-token-variable)">${section}</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>time</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>toISOString</span><span style="color:var(--code-preview-foreground)">()</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
				if (sect.constructor === Array) {
					for (const variable of sect) {
						c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">	weatherData</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span></span><span style="color:var(--code-preview-token-variable)">${section}</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${variable}</span>${INT_64_VARIABLES.includes(variable) ? '<span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>toISOString</span><span style="color:var(--code-preview-foreground)">()</span>' : ''}<span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
					}
				} else if (typeof sect === 'string') {
					c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">	weatherData</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span></span><span style="color:var(--code-preview-token-variable)">${section}</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${sect}</span>${INT_64_VARIABLES.includes(sect) ? '<span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>toISOString</span><span style="color:var(--code-preview-foreground)">()</span>' : ''}<span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
				}
				c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">)<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>`;
			} else {
				c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">console</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>log</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">\\n${titleCase(section)} data</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-foreground)">)</span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">for</span><span style="color:var(--code-preview-foreground)"> (</span><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> i </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-token-constant)"> 0</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">;</span> i </span><span style="color:var(--code-preview-token-punctuation-mark)">&lt;</span><span style="color:var(--code-preview-token-variable)"> weatherData</span><span style="color:var(--code-preview-foreground)">.</span><span style="color:var(--code-preview-token-variable)">${section}</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span></span><span style="color:var(--code-preview-token-variable)">time</span><span style="color:var(--code-preview-foreground)">.</span><span style="color:var(--code-preview-token-variable)">length</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">;</span> i</span><span style="color:var(--code-preview-token-punctuation-mark)">++</span><span style="color:var(--code-preview-foreground)">) <span style="color:var(--code-preview-token-bracket)">{</span></span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">	console</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>log</span><span style="color:var(--code-preview-foreground)">(</span></span>`;
				c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">		weatherData</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span></span><span style="color:var(--code-preview-token-variable)">${section}</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>time[i]</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>toISOString</span><span style="color:var(--code-preview-foreground)">()</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
				if (sect.constructor === Array) {
					for (const variable of sect) {
						c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">		weatherData</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span></span><span style="color:var(--code-preview-token-variable)">${section}</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${variable}[i]</span>${INT_64_VARIABLES.includes(variable) ? '<span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>toISOString</span><span style="color:var(--code-preview-foreground)">()</span>' : ''}<span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
					}
				} else if (typeof sect === 'string') {
					c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">		weatherData</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span></span><span style="color:var(--code-preview-token-variable)">${section}</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${sect}[i]</span>${INT_64_VARIABLES.includes(sect) ? '<span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>toISOString</span><span style="color:var(--code-preview-foreground)">()</span>' : ''}<span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
				}
				c += `
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">	)<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
${p ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-bracket)">}</span></span></span>`;
			}
		}
	}

	c += `
${multipleLocationsOrModels ? '<span class="line"><span style="color:var(--code-preview-token-bracket)">}</span></span>' : ''}</code></pre></div>`;
	return c;
};

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
	const t = multipleLocationsOrModels;

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
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">// Attributes for timezone and location</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> latitude</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>latitude</span><span style="color:var(--code-preview-foreground)">()<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> longitude</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>longitude</span><span style="color:var(--code-preview-foreground)">()<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> elevation</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>elevation</span><span style="color:var(--code-preview-foreground)">()<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>`;

	if (params.timezone) {
		c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> timezone</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>timezone</span><span style="color:var(--code-preview-foreground)">()<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> timezoneAbbreviation</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>timezoneAbbreviation</span><span style="color:var(--code-preview-foreground)">()<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>`;
	}
	c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> utcOffsetSeconds</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>utcOffsetSeconds</span><span style="color:var(--code-preview-foreground)">()<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
${t ? '\t' : ''}<span class="line"></span>`;

	c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">console</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>log</span><span style="color:var(--code-preview-foreground)">(</span></span>
${t ? '\t' : ''}<span class="line">	<span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">\`</span><span style="color:var(--code-preview-foreground)">\\n</span>Coordinates: <span style="color:var(--code-preview-token-punctuation-mark)">\${</span><span style="color:var(--code-preview-foreground)">latitude</span><span style="color:var(--code-preview-token-punctuation-mark)">}</span>°N <span style="color:var(--code-preview-token-punctuation-mark)">\${</span><span style="color:var(--code-preview-foreground)">longitude</span><span style="color:var(--code-preview-token-punctuation-mark)">}</span>°E<span style="color:var(--code-preview-token-punctuation-mark)">\`</span></span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>
${t ? '\t' : ''}<span class="line">	<span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">\`</span><span style="color:var(--code-preview-foreground)">\\n</span>Elevation: <span style="color:var(--code-preview-token-punctuation-mark)">\${</span><span style="color:var(--code-preview-foreground)">elevation</span><span style="color:var(--code-preview-token-punctuation-mark)">}</span>m asl<span style="color:var(--code-preview-token-punctuation-mark)">\`</span></span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
	if (params.timezone) {
		c += `
${t ? '\t' : ''}<span class="line">	<span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">\`</span><span style="color:var(--code-preview-foreground)">\\n</span>Timezone: <span style="color:var(--code-preview-token-punctuation-mark)">\${</span><span style="color:var(--code-preview-foreground)">timezone</span><span style="color:var(--code-preview-token-punctuation-mark)">}</span> <span style="color:var(--code-preview-token-punctuation-mark)">\${</span><span style="color:var(--code-preview-foreground)">timezoneAbbreviation</span><span style="color:var(--code-preview-token-punctuation-mark)">}</span><span style="color:var(--code-preview-token-punctuation-mark)">\`</span></span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
	}
	c += `
${t ? '\t' : ''}<span class="line">	<span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">\`</span><span style="color:var(--code-preview-foreground)">\\n</span>Timezone difference to GMT+0: <span style="color:var(--code-preview-token-punctuation-mark)">\${</span><span style="color:var(--code-preview-foreground)">utcOffsetSeconds</span><span style="color:var(--code-preview-token-punctuation-mark)">}</span>s<span style="color:var(--code-preview-token-punctuation-mark)">\`</span></span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
	if (numberOfModels) {
		c += `
${t ? '\t' : ''}<span class="line">	<span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">\`</span><span style="color:var(--code-preview-foreground)">\\n</span>Model Nº: <span style="color:var(--code-preview-token-punctuation-mark)">\${</span><span style="color:var(--code-preview-foreground)">response<span style="color:var(--code-preview-token-punctuation-mark)">.</span>model<span style="color:var(--code-preview-token-punctuation-mark)">()</span></span><span style="color:var(--code-preview-token-punctuation-mark)">}</span><span style="color:var(--code-preview-token-punctuation-mark)">\`</span></span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
	}
	c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">)<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
${t ? '\t' : ''}<span class="line"></span>`;

	let int64Found = false;
	for (const section of ['current', 'minutely_15', 'hourly', 'daily', 'six_hourly']) {
		const sect = params[section];
		if (sect) {
			c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> ${camelCase(section)}</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${camelCase(section)}</span><span style="color:var(--code-preview-foreground)">()</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>`;
			if (sdk_type === 'ensemble_api' && section !== 'current') {
				c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> ${camelCase(section)}Variables</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-foreground)"> [</span><span style="color:var(--code-preview-token-punctuation-mark)">...</span><span style="color:var(--code-preview-token-function)">Array</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${camelCase(section)}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>variablesLength</span><span style="color:var(--code-preview-foreground)">())]</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>map</span><span style="color:var(--code-preview-foreground)">(<span style="color:var(--code-preview-token-punctuation-mark)">(</span>_</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span><span style="color:var(--code-preview-foreground);font-style:italic;"> i<span style="color:var(--code-preview-token-punctuation-mark)">)</span> </span><span style="color:var(--code-preview-token-punctuation-mark)">=&gt;</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">	${camelCase(section)}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>variables</span><span style="color:var(--code-preview-foreground)">(i)</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">);</span></span>`;
				if (sect.constructor === Array) {
					for (const [ind, variable] of sect.entries()) {
						c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> ${camelCase(section + '_' + variable)}</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> ${camelCase(section)}Variables</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>filter</span><span style="color:var(--code-preview-foreground)">(</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">	<span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="font-style:italic">v</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span> </span><span style="color:var(--code-preview-token-keyword)">=&gt; </span>`;
						const regex =
							/(?<variable>[a-z_]+)_(((?<altitude>[0-9]+)m)|((?<pressure>[0-9]+)hPa)|((?<depth>[0-9]+)cm)|((?<depth_from>[0-9]+)_to_(?<depth_to>[0-9]+)cm))_?(?<aggregation>max|min|mean|p[0-9]{2}|dominant)?/;
						const matches = regex.exec(variable);
						if (matches == null || matches.groups == null) {
							c += `<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>variable</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-variable)"> Variable</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${variable}</span>`;
						} else {
							const groups = matches.groups;
							const results = [
								`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>variable</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-variable)"> Variable</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${groups.variable}</span>`
							];
							if (groups.altitude) {
								results.push(
									`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>altitude</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-constant)"> ${groups.altitude}</span>`
								);
							}
							if (groups.pressure) {
								results.push(
									`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>pressureLevel</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-constant)"> ${groups.pressure}</span>`
								);
							}
							if (groups.depth) {
								results.push(
									`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>depth</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-constant)"> ${groups.depth}</span>`
								);
							}
							if (groups.depth_from) {
								results.push(
									`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>depth</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-constant)"> ${groups.depth}</span>`
								);
								results.push(
									`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>depthTo</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-constant)"> ${groups.depth_to}</span>`
								);
							}
							if (groups.aggregation) {
								let aggregation = groups.aggregation;
								if (aggregation == 'max') {
									aggregation = 'maximum';
								}
								if (aggregation == 'min') {
									aggregation = 'minimum';
								}
								results.push(
									`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>aggregation</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-variable)"> Aggregation<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${aggregation}</span>`
								);
							}
							c += results.join(
								` <span style="color:var(--code-preview-token-punctuation-mark)">&amp;&amp;</span> `
							);
						}

						c += `<span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
						c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">)<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>`;
					}
				} else if (typeof sect === 'string') {
					c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> ${camelCase(section + '_' + sect)}</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> ${camelCase(section)}Variables</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>filter</span><span style="color:var(--code-preview-foreground)">(</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">	<span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="font-style:italic">v</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span> </span><span style="color:var(--code-preview-token-keyword)">=&gt; </span>`;
					const regex =
						/(?<variable>[a-z_]+)_(((?<altitude>[0-9]+)m)|((?<pressure>[0-9]+)hPa)|((?<depth>[0-9]+)cm)|((?<depth_from>[0-9]+)_to_(?<depth_to>[0-9]+)cm))_?(?<aggregation>max|min|mean|p[0-9]{2}|dominant)?/;
					const matches = regex.exec(sect);
					if (matches == null || matches.groups == null) {
						c += `<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>variable</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-variable)"> Variable</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${sect}</span>`;
					} else {
						const groups = matches.groups;
						const results = [
							`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>variable</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-variable)"> Variable</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${groups.variable}</span>`
						];
						if (groups.altitude) {
							results.push(
								`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>altitude</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-constant)"> ${groups.altitude}</span>`
							);
						}
						if (groups.pressure) {
							results.push(
								`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>pressureLevel</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-constant)"> ${groups.pressure}</span>`
							);
						}
						if (groups.depth) {
							results.push(
								`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>depth</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-constant)"> ${groups.depth}</span>`
							);
						}
						if (groups.depth_from) {
							results.push(
								`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>depth</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-constant)"> ${groups.depth}</span>`
							);
							results.push(
								`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>depthTo</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-constant)"> ${groups.depth_to}</span>`
							);
						}
						if (groups.aggregation) {
							let aggregation = groups.aggregation;
							if (aggregation == 'max') {
								aggregation = 'maximum';
							}
							if (aggregation == 'min') {
								aggregation = 'minimum';
							}
							results.push(
								`<span style="color:var(--code-preview-token-variable)">v</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>aggregation</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">===</span><span style="color:var(--code-preview-token-variable)"> Aggregation<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${aggregation}</span>`
							);
						}
						c += results.join(
							` <span style="color:var(--code-preview-token-punctuation-mark)">&amp;&amp;</span> `
						);
					}
					c += `<span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">)<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>`;
				}
				c += `
${t ? '\t' : ''}<span class="line"></span>`;
			}
		}

		if (sect && sect.constructor === Array) {
			for (const variable of sect) {
				if (INT_64_VARIABLES.includes(variable)) {
					int64Found = true;
				}
			}
		}
	}
	if (sdk_type !== 'ensemble_api') {
		c += `
${t ? '\t' : ''}<span class="line"></span>`;
	}
	if (int64Found) {
		c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">// Define Int64 variables so they can be processed accordingly</span></span>`;
		for (const section of ['current', 'minutely_15', 'hourly', 'daily', 'six_hourly']) {
			const sect = params[section];
			if (sect && sect.constructor === Array) {
				for (const [ind, variable] of sect.entries()) {
					if (INT_64_VARIABLES.includes(variable)) {
						c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> ${variable}</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-token-variable)"> ${camelCase(section)}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>variables</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-constant)">${ind}</span><span style="color:var(--code-preview-foreground)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>`;
					}
				}
			}
		}
		c += `
${t ? '\t' : ''}<span class="line"></span>`;
	}

	c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">// Note: The order of weather variables in the URL query and the indices below need to match!</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> weatherData</span><span style="color:var(--code-preview-token-punctuation-mark)"> =</span><span style="color:var(--code-preview-foreground)"> <span style="color:var(--code-preview-token-bracket)">{</span></span></span>`;
	for (const section of ['current', 'minutely_15', 'hourly', 'daily', 'six_hourly']) {
		const sect = params[section];
		if (sect) {
			c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">	${camelCase(section)}</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-foreground)"> <span style="color:var(--code-preview-token-bracket)">{</span></span></span>`;
			if (section === 'current') {
				c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">		time</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-keyword-special)"> new</span><span style="color:var(--code-preview-token-function)"> Date</span><span style="color:var(--code-preview-foreground)">((</span><span style="color:var(--code-preview-token-function)">Number</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">current</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>time</span><span style="color:var(--code-preview-foreground)">()) </span><span style="color:var(--code-preview-token-punctuation-mark)">+</span><span style="color:var(--code-preview-foreground)"> utcOffsetSeconds) </span><span style="color:var(--code-preview-token-punctuation-mark)">*</span><span style="color:var(--code-preview-token-constant)"> 1000</span><span style="color:var(--code-preview-foreground)">)</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>`;
			} else {
				c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">		time</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-foreground)"> [</span><span style="color:var(--code-preview-token-punctuation-mark)">...</span><span style="color:var(--code-preview-token-function)">Array</span><span style="color:var(--code-preview-foreground)">((</span><span style="color:var(--code-preview-token-function)">Number</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${camelCase(section)}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>timeEnd</span><span style="color:var(--code-preview-foreground)">()) </span><span style="color:var(--code-preview-token-punctuation-mark)">-</span><span style="color:var(--code-preview-token-function)"> Number</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${camelCase(section)}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>time</span><span style="color:var(--code-preview-foreground)">())) </span><span style="color:var(--code-preview-token-punctuation-mark)">/</span><span style="color:var(--code-preview-token-variable)"> ${camelCase(section)}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>interval</span><span style="color:var(--code-preview-foreground)">())]</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>map</span><span style="color:var(--code-preview-foreground)">(</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">			<span style="color:var(--code-preview-token-punctuation-mark)">(</span>_</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span><span style="color:var(--code-preview-foreground);font-style:italic;"> i<span style="color:var(--code-preview-token-punctuation-mark)">)</span> </span><span style="color:var(--code-preview-token-keyword)">=&gt</span><span style="color:var(--code-preview-token-keyword-special)"> new</span><span style="color:var(--code-preview-token-function)"> Date</span><span style="color:var(--code-preview-foreground)">((</span><span style="color:var(--code-preview-token-function)">Number</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${camelCase(section)}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>time</span><span style="color:var(--code-preview-foreground)">()) </span><span style="color:var(--code-preview-token-punctuation-mark)">+</span><span style="color:var(--code-preview-foreground)"> i </span><span style="color:var(--code-preview-token-punctuation-mark)">*</span><span style="color:var(--code-preview-token-variable)"> ${camelCase(section)}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>interval</span><span style="color:var(--code-preview-foreground)">() </span><span style="color:var(--code-preview-token-punctuation-mark)">+</span><span style="color:var(--code-preview-foreground)"> utcOffsetSeconds) </span><span style="color:var(--code-preview-token-punctuation-mark)">*</span><span style="color:var(--code-preview-token-constant)"> 1000</span><span style="color:var(--code-preview-foreground)">)</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">		)</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
			}
			if (sdk_type !== 'ensemble_api') {
				if (sect.constructor === Array) {
					for (const [ind, variable] of sect.entries()) {
						if (INT_64_VARIABLES.includes(variable)) {
							c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">		// Map Int64 values to according structure</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">		${variable}</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-foreground)"> [</span><span style="color:var(--code-preview-token-punctuation-mark)">...</span><span style="color:var(--code-preview-token-function)">Array</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${variable}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>valuesInt64Length</span><span style="color:var(--code-preview-foreground)">())]</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>map</span><span style="color:var(--code-preview-foreground)">(</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">			<span style="color:var(--code-preview-token-punctuation-mark)">(</span>_</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span><span style="color:var(--code-preview-foreground);font-style:italic;"> i<span style="color:var(--code-preview-token-punctuation-mark)">)</span> </span><span style="color:var(--code-preview-token-keyword)">=&gt;</span></span><span style="color:var(--code-preview-token-keyword-special)"> new</span><span style="color:var(--code-preview-token-function)"> Date</span><span style="color:var(--code-preview-foreground)">((</span><span style="color:var(--code-preview-token-function)">Number</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${variable}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>valuesInt64</span><span style="color:var(--code-preview-foreground)">(i)) </span><span style="color:var(--code-preview-token-punctuation-mark)">+</span><span style="color:var(--code-preview-foreground)"> utcOffsetSeconds) </span><span style="color:var(--code-preview-token-punctuation-mark)">*</span><span style="color:var(--code-preview-token-constant)"> 1000</span><span style="color:var(--code-preview-foreground)">)</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">		)</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
						} else {
							c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">		${variable}</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-variable)"> ${camelCase(section)}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>variables</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-constant)">${ind}</span><span style="color:var(--code-preview-foreground)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${section === 'current' ? 'value' : 'valuesArray'}</span><span style="color:var(--code-preview-foreground)">()</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>`;
						}
					}
				} else if (typeof sect === 'string') {
					if (INT_64_VARIABLES.includes(sect)) {
						c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">		// Map Int64 values to according structure</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">		${sect}</span><span style="color:var(--code-preview-token-keyword)">:</span><span style="color:var(--code-preview-foreground)"> [</span><span style="color:var(--code-preview-token-keyword)">...</span><span style="color:var(--code-preview-token-function)">Array</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${sect}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>valuesInt64Length</span><span style="color:var(--code-preview-foreground)">())]</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>map</span><span style="color:var(--code-preview-foreground)">(</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">			<span style="color:var(--code-preview-token-punctuation-mark)">(</span>_</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span><span style="color:var(--code-preview-foreground);font-style:italic;"> i<span style="color:var(--code-preview-token-punctuation-mark)">)</span> </span><span style="color:var(--code-preview-token-keyword)">=&gt;</span><span style="color:var(--code-preview-token-keyword-special)"> new</span><span style="color:var(--code-preview-token-function)"> Date</span><span style="color:var(--code-preview-foreground)">((</span><span style="color:var(--code-preview-token-function)">Number</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-variable)">${sect}</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>valuesInt64</span><span style="color:var(--code-preview-foreground)">(i)) </span><span style="color:var(--code-preview-token-punctuation-mark)">+</span><span style="color:var(--code-preview-foreground)"> utcOffsetSeconds) </span><span style="color:var(--code-preview-token-punctuation-mark)">*</span><span style="color:var(--code-preview-token-constant)"> 1000</span><span style="color:var(--code-preview-foreground)">)</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">		<span style="color:var(--code-preview-token-punctuation-mark)">)</span></span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
					} else {
						c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">		${sect}</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-variable)"> ${camelCase(section)}</span><span style="color:var(--code-preview-token-function)">.variables</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-constant)">0</span><span style="color:var(--code-preview-foreground)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${section === 'current' ? 'value' : 'valuesArray'}</span><span style="color:var(--code-preview-foreground)">()</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>`;
					}
				}
			}

			c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)">	<span style="color:var(--code-preview-token-bracket)">}</span></span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
		}
	}
	c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-string-key)"><span style="color:var(--code-preview-token-bracket)">}</span><span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>`;

	if (sdk_type === 'ensemble_api') {
		c += `
${t ? '\t' : ''}<span class="line"></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic">// Process all members</span></span>`;

		for (const section of ['current', 'minutely_15', 'hourly', 'daily', 'six_hourly']) {
			const sect = params[section];
			if (sect) {
				if (sect.constructor === Array) {
					for (const [ind, variable] of sect.entries()) {
						c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">for</span><span style="color:var(--code-preview-foreground)"> (</span><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> variable</span><span style="color:var(--code-preview-token-keyword-special)"> of</span><span style="color:var(--code-preview-token-variable)"> ${camelCase(section + '_' + variable)}) <span style="color:var(--code-preview-token-punctuation-mark)">{</span></span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">	const</span><span style="color:var(--code-preview-token-variable)"> member</span><span style="color:var(--code-preview-token-keyword)"> <span style="color:var(--code-preview-token-punctuation-mark)">=</span></span><span style="color:var(--code-preview-token-variable)"> variable</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>ensembleMember</span><span style="color:var(--code-preview-foreground)">()<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">	weatherData</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${camelCase(section)}[</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">\`</span>${variable}_member<span style="color:var(--code-preview-token-punctuation-mark)">\${</span><span style="color:var(--code-preview-foreground)">member</span><span style="color:var(--code-preview-token-punctuation-mark)">}\`</span></span><span style="color:var(--code-preview-foreground)">] </span><span style="color:var(--code-preview-token-punctuation-mark)">= </span><span style="color:var(--code-preview-foreground)">variable</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${INT_64_VARIABLES.includes(variable) ? 'valuesInt64Array' : 'valuesArray'}</span><span style="color:var(--code-preview-foreground)">()</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-punctuation-mark)">;</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-punctuation-mark)">}</span></span>`;
					}
				} else if (typeof sect === 'string') {
					c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">for</span><span style="color:var(--code-preview-foreground)"> (</span><span style="color:var(--code-preview-token-keyword)">const</span><span style="color:var(--code-preview-token-variable)"> variable</span><span style="color:var(--code-preview-token-keyword-special)"> of</span><span style="color:var(--code-preview-token-variable)"> ${camelCase(section + '_' + sect)}) <span style="color:var(--code-preview-token-punctuation-mark)">{</span></span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">	const</span><span style="color:var(--code-preview-token-variable)"> member</span><span style="color:var(--code-preview-token-keyword)"> <span style="color:var(--code-preview-token-punctuation-mark)">=</span></span><span style="color:var(--code-preview-token-variable)"> variable</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">?.</span>ensembleMember</span><span style="color:var(--code-preview-foreground)">()<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">	weatherData</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${camelCase(section)}[</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">\`</span>${sect}_member<span style="color:var(--code-preview-token-punctuation-mark)">\${</span><span style="color:var(--code-preview-foreground)">member</span><span style="color:var(--code-preview-token-punctuation-mark)">}\`</span></span><span style="color:var(--code-preview-foreground)">] </span><span style="color:var(--code-preview-token-punctuation-mark)">= </span><span style="color:var(--code-preview-foreground)">variable</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${INT_64_VARIABLES.includes(sect) ? 'valuesInt64Array' : 'valuesArray'}</span><span style="color:var(--code-preview-foreground)">()</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-punctuation-mark)">;</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-punctuation-mark)">}</span></span>`;
				}
			}
		}
	}

	c += `
${t ? '\t' : ''}<span class="line"></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">// 'weatherData' now contains a simple structure with arrays with datetime and weather data</span></span>`;

	for (const section of ['current', 'minutely_15', 'hourly', 'daily', 'six_hourly']) {
		const sect = params[section];
		if (sect) {
			if (section === 'current') {
				c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">console</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>log</span><span style="color:var(--code-preview-foreground)">(</span></span>
${t ? '\t' : ''}<span class="line">	<span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">\`</span><span style="color:var(--code-preview-foreground)">\\n</span>Current time: <span style="color:var(--code-preview-token-punctuation-mark)">\${</span><span style="color:var(--code-preview-foreground)">weatherData<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${camelCase(section)}<span style="color:var(--code-preview-token-punctuation-mark)">.</span>time</span><span style="color:var(--code-preview-token-punctuation-mark)">}\`</span></span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
				if (sect.constructor === Array) {
					for (const variable of sect) {
						c += `
${t ? '\t' : ''}<span class="line">	<span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">\`</span><span style="color:var(--code-preview-foreground)">\\n</span>Current ${variable}: <span style="color:var(--code-preview-token-punctuation-mark)">\${</span><span style="color:var(--code-preview-foreground)">weatherData<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${camelCase(section)}<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${variable}</span><span style="color:var(--code-preview-token-punctuation-mark)">}\`</span></span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
					}
				} else if (typeof sect === 'string') {
					c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">	weatherData</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span></span><span style="color:var(--code-preview-token-variable)">${camelCase(section)}</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>${sect}</span>${INT_64_VARIABLES.includes(sect) ? '<span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>toISOString</span><span style="color:var(--code-preview-foreground)">()</span>' : ''}<span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
				}
				c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">)<span style="color:var(--code-preview-token-punctuation-mark)">;</span></span></span>`;
			} else {
				c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-variable)">console</span><span style="color:var(--code-preview-token-function)"><span style="color:var(--code-preview-token-punctuation-mark)">.</span>log</span><span style="color:var(--code-preview-foreground)">(</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-foreground)">\\n</span>${titleCase(section)} data</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-punctuation-mark)">,</span> <span>weatherData<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${camelCase(section)}</span>)</span></span>`;
			}
		}
	}

	c += `
${multipleLocationsOrModels ? '<span class="line"><span style="color:var(--code-preview-token-bracket)">}</span></span>' : ''}</code></pre></div>`;
	return c;
};

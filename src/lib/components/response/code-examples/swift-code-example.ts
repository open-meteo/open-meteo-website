import { camelCase, titleCase } from '$lib/utils';

import { INT_64_VARIABLES, SECTIONS } from '$lib/constants';

import type { Parameters } from '$lib/docs';

export const swiftCodeExample = (
	params: Parameters,
	multipleLocationsOrModels: boolean,
	numberOfLocations: number | string,
	numberOfModels: number,
	server: string,
	sdk_type: string,
	previewUrl: string
) => {
	const t = multipleLocationsOrModels;

	let c = `<div><pre class="swift" style="background-color:var(--code-preview-background);color:var(--code-preview-foreground)" tabindex="0"><code><span class="line"></span><span class="line"><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">import</span><span style="color:var(--code-preview-token-constant)"> OpenMeteoSdk</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">/// Make sure the URL contains '&amp;format=flatbuffers'</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> url </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-token-function)"> URL</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">string</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-string-expression)"> "${previewUrl + '&format=flatbuffers'}"</span><span style="color:var(--code-preview-token-punctuation)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> responses </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-token-keyword-special);font-style:italic;"> try</span><span style="color:var(--code-preview-token-keyword-special);font-style:italic;"> await</span><span style="color:var(--code-preview-foreground)"> WeatherApiResponse<span style="color:var(--code-preview-token-punctuation-mark)">.</span></span><span style="color:var(--code-preview-token-function)">fetch</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">url</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> url</span><span style="color:var(--code-preview-token-punctuation)">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--code-preview-token-accent)">struct</span><span style="color:var(--code-preview-token-constant)"> WeatherData</span><span style="color:var(--code-preview-foreground)"> {</span></span>`;
	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			c += `
<span class="line"><span style="color:var(--code-preview-token-keyword)">	let</span><span style="color:var(--code-preview-foreground)"> ${camelCase(section)}<span style="color:var(--code-preview-token-punctuation-mark)">:</span> ${titleCase(section)}</span></span>`;
		}
	}
	c += `
<span class="line"></span>`;
	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			c += `
<span class="line"><span style="color:var(--code-preview-token-accent)">	struct</span><span style="color:var(--code-preview-token-constant)"> ${titleCase(section)}</span><span style="color:var(--code-preview-foreground)"> {</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">		let</span><span style="color:var(--code-preview-foreground)"> time<span style="color:var(--code-preview-token-punctuation-mark)">:</span> ${section !== 'current' ? '<span style="color:var(--code-preview-token-punctuation-mark">[</span>' : ''}Date${section !== 'current' ? '<span style="color:var(--code-preview-token-punctuation-mark)">]</span>' : ''}</span></span>`;
			if (sect.constructor === Array) {
				for (const variable of sect) {
					c += `
<span class="line"><span style="color:var(--code-preview-token-keyword)">		let</span><span style="color:var(--code-preview-foreground)"> ${camelCase(variable)}<span style="color:var(--code-preview-token-punctuation-mark)">:</span> </span><span style="color:var(--code-preview-token-constant)">${section !== 'current' ? '<span style="color:var(--code-preview-token-punctuation-mark">[</span>' : ''}${INT_64_VARIABLES.includes(variable) ? 'Int64' : 'Float'}${section !== 'current' ? '<span style="color:var(--code-preview-token-punctuation-mark)">]</span>' : ''}</span></span>`;
				}
			} else if (typeof sect === 'string') {
				c += `
<span class="line"><span style="color:var(--code-preview-token-keyword)">		let</span><span style="color:var(--code-preview-foreground)"> ${camelCase(sect)}<span style="color:var(--code-preview-token-punctuation-mark)">:</span> </span><span style="color:var(--code-preview-token-constant)">${section !== 'current' ? '<span style="color:var(--code-preview-token-punctuation-mark">[</span>' : ''}${INT_64_VARIABLES.includes(sect) ? 'Int64' : 'Float'}${section !== 'current' ? '<span style="color:var(--code-preview-token-punctuation-mark)">]</span>' : ''}</span></span>`;
			}
			c += `
<span class="line"><span style="color:var(--code-preview-foreground)">	}</span></span>`;
		}
	}
	c += `
<span class="line"><span style="color:var(--code-preview-foreground)">}</span></span>
<span class="line"></span>`;

	if (multipleLocationsOrModels) {
		c +=
			`
<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic">// Process ` +
			(numberOfLocations ? `${numberOfLocations} locations` : '1 location') +
			(numberOfModels ? ` and ${numberOfModels} models` : '') +
			`</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">for</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-keyword-special);font-style:italic;"> in</span><span style="color:var(--code-preview-foreground)"> responses <span style="color:var(--code-preview-token-punctuation-mark)">{</span></span></span>`;
	} else {
		c += `
<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">/// Process first location. Add a for-loop for multiple locations or weather models</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> response </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> responses</span><span style="color:var(--code-preview-token-punctuation-mark)">[</span><span style="color:var(--code-preview-token-constant)">0</span><span style="color:var(--code-preview-token-punctuation-mark)">]</span></span>
<span class="line"></span>`;
	}
	c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">/// Attributes for timezone and location</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> latitude </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> response<span style="color:var(--code-preview-token-punctuation-mark)">.</span>latitude</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> longitude </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> response<span style="color:var(--code-preview-token-punctuation-mark)">.</span>longitude</span></span>`;
	if (params.timezone) {
		c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> timezone </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> response<span style="color:var(--code-preview-token-punctuation-mark)">.</span>timezone</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> timezoneAbbreviation </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> response<span style="color:var(--code-preview-token-punctuation-mark)">.</span>timezoneAbbreviation</span></span>`;
	}
	c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> utcOffsetSeconds </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> response<span style="color:var(--code-preview-token-punctuation-mark)">.</span>utcOffsetSeconds</span></span>
${t ? '\t' : ''}<span class="line"></span>`;

	c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-foreground)">\\n</span>Coordinates: <span style="color:var(--code-preview-token-punctuation-mark)">\\(</span><span style="color:var(--code-preview-foreground)">latitude</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span>°N <span style="color:var(--code-preview-token-punctuation-mark)">\\(</span><span style="color:var(--code-preview-foreground)">longitude</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span>°E<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">)</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">"</span>Elevation: <span style="color:var(--code-preview-token-punctuation-mark)">\\(</span><span style="color:var(--code-preview-foreground)">elevation</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span>m asl<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">)</span></span>`;
	if (params.timezone) {
		c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">"</span>Timezone: <span style="color:var(--code-preview-token-punctuation-mark)">\\(</span><span style="color:var(--code-preview-foreground)">timezone</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span> <span style="color:var(--code-preview-token-punctuation-mark)">\\(</span><span style="color:var(--code-preview-foreground)">timezoneAbbreviation</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">)</span></span>`;
	}
	c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">"</span>Timezone difference to GMT+0: <span style="color:var(--code-preview-token-punctuation-mark)">\\(</span><span style="color:var(--code-preview-foreground)">utcOffsetSeconds</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span>s<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">)</span></span>`;
	if (numberOfModels) {
		c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">"</span>Model Nº: <span style="color:var(--code-preview-token-punctuation-mark)">\\(</span><span style="color:var(--code-preview-foreground)">response<span style="color:var(--code-preview-token-punctuation-mark)">.</span>model</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">)</span></span>`;
	}
	c += `
${t ? '\t' : ''}<span class="line"></span>`;

	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> ${camelCase(section)} </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> response<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${camelCase(section)}</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span></span>`;
		}
	}
	c += `
${t ? '\t' : ''}<span class="line"></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">/// Note: The order of weather variables in the URL query and the 'at' indices below need to match!</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> data </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-token-function)"> WeatherData</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span></span>`;
	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">	${camelCase(section)}</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-punctuation-mark)"> .</span><span style="color:var(--code-preview-token-accent)">init</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">		time</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span>${section === 'current' ? '<span style="color:var(--code-preview-token-function)"> Date</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-function)">timeIntervalSince1970</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> TimeInterval</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-variable)">current<span style="color:var(--code-preview-token-punctuation-mark)">.</span>time </span><span style="color:var(--code-preview-token-punctuation-mark)">+</span><span style="color:var(--code-preview-token-constant)"> Int64</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-variable)">utcOffsetSeconds</span><span style="color:var(--code-preview-token-punctuation-mark)">)))</span>' : ' ' + camelCase(section) + '<span style="color:var(--code-preview-token-punctuation-mark)">.</span><span style="color:var(--code-preview-token-function)">getDateTime</span></span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-function)">offset</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-variable)"> utcOffsetSeconds</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span>'}<span style="color:var(--code-preview-token-variable)">,</span></span>`;

			if (sect.constructor === Array) {
				for (const [ind, variable] of sect.entries()) {
					c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">		${variable}</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> <span style="color:var(--code-preview-token-variable)">${camelCase(section)}</span><span style="color:var(--code-preview-token-punctuation-mark)">.</span>variables</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-function)">at</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> ${ind}</span><span style="color:var(--code-preview-token-punctuation)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-punctuation-mark)">.</span><span style="color:var(--code-preview-token-variable)">${INT_64_VARIABLES.includes(variable) ? 'valuesInt64' : section === 'current' ? 'value' : 'values'}</span><span style="color:var(--code-preview-token-variable)">,</span></span>`;
				}
			} else if (typeof sect === 'string') {
				c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">		${sect}</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> current.variables</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">at</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> 0</span><span style="color:var(--code-preview-token-punctuation)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-function)">.</span><span style="color:var(--code-preview-token-constant)">value</span></span>`;
			}

			c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-punctuation-mark)">	)</span><span style="color:var(--code-preview-token-variable)">,</span></span>`;
		}
	}

	c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-punctuation-mark)">)</span></span>
${t ? '\t' : ''}<span class="line"></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">/// Timezone '.gmt' is deliberately used.</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">/// By adding 'utcOffsetSeconds' before, local-time is inferred</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> dateFormatter </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-token-function)"> DateFormatter</span><span style="color:var(--code-preview-token-punctuation-mark)">()</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">dateFormatter<span style="color:var(--code-preview-token-punctuation-mark)">.</span>timeZone </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> .gmt</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">dateFormatter<span style="color:var(--code-preview-token-punctuation-mark)">.</span>dateFormat </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-token-string-expression)"> <span style="color:var(--code-preview-token-punctuation-mark)">"</span>yyyy-MM-dd HH:mm<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span></span>
${t ? '\t' : ''}<span class="line"></span>`;

	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			if (section === 'current') {
				c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">"</span>Current time: <span style="color:var(--code-preview-token-punctuation-mark)">\\(</span><span style="color:var(--code-preview-foreground)">data<span style="color:var(--code-preview-token-punctuation-mark)">.</span>current<span style="color:var(--code-preview-token-punctuation-mark)">.</span>time</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">)</span></span>`;
				if (sect.constructor === Array) {
					for (const [ind, variable] of sect.entries()) {
						c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">"</span>Current ${variable}: <span style="color:var(--code-preview-token-punctuation-mark)">\\(</span><span style="color:var(--code-preview-foreground)">data<span style="color:var(--code-preview-token-punctuation-mark)">.</span>current<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${variable}</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">)</span></span>`;
					}
				} else if (typeof sect === 'string') {
					c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">"</span>Current ${sect}: <span style="color:var(--code-preview-token-punctuation-mark)">\\(</span><span style="color:var(--code-preview-foreground)">data<span style="color:var(--code-preview-token-punctuation-mark)">.</span>current<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${sect}</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">)</span></span>`;
				}
			} else {
				c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">for</span><span style="color:var(--code-preview-token-punctuation-mark)"> (</span><span style="color:var(--code-preview-token-variable)">i, date</span><span style="color:var(--code-preview-token-punctuation-mark)">)</span><span style="color:var(--code-preview-token-keyword-special);font-style:italic;"> in</span><span style="color:var(--code-preview-foreground)"> data<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${camelCase(section)}<span style="color:var(--code-preview-token-punctuation-mark)">.</span>time<span style="color:var(--code-preview-token-punctuation-mark)">.</span></span><span style="color:var(--code-preview-token-function)">enumerated</span><span style="color:var(--code-preview-token-punctuation-mark)">()</span><span style="color:var(--code-preview-token-punctuation-mark)"> {</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">	print</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-variable)">dateFormatter<span style="color:var(--code-preview-token-punctuation-mark)">.</span><span style="color:var(--code-preview-token-function)">string</span></span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-function)">from</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-variable)"> date</span><span style="color:var(--code-preview-token-punctuation-mark)">))</span></span>`;
				if (sect.constructor === Array) {
					for (const [ind, variable] of sect.entries()) {
						c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">	print</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-variable)">data<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${camelCase(section)}<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${variable}</span><span style="color:var(--code-preview-token-punctuation-mark)">[</span><span style="color:var(--code-preview-token-variable)">i</span><span style="color:var(--code-preview-token-punctuation-mark)">])</span></span>`;
					}
				} else if (typeof sect === 'string') {
					c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">	print</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-variable)">data<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${camelCase(section)}<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${sect}</span><span style="color:var(--code-preview-token-punctuation-mark)">[</span><span style="color:var(--code-preview-token-variable)">i</span><span style="color:var(--code-preview-token-punctuation-mark)">])</span></span>`;
				}

				c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-punctuation-mark)">}</span></span>`;
			}
		}
	}

	c += `
${t ? '<span class="line"><span style="color:var(--code-preview-token-punctuation-mark)">}</span></span>' : ''}</code></pre></div>`;
	return c;
};

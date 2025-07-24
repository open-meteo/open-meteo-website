import type { Parameters } from '$lib/docs';
import { camelCase, titleCase } from '$lib/utils';

import { INT_64_VARIABLES } from '$lib/constants';

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
<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> responses </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-token-keyword-special);font-style:italic;"> try</span><span style="color:var(--code-preview-token-keyword-special);font-style:italic;"> await</span><span style="color:var(--code-preview-foreground)"> WeatherApiResponse.</span><span style="color:var(--code-preview-token-function)">fetch</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">url</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> url</span><span style="color:var(--code-preview-token-punctuation)">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--code-preview-token-accent)">struct</span><span style="color:var(--code-preview-token-constant)"> WeatherData</span><span style="color:var(--code-preview-foreground)"> {</span></span>`;
	for (const section of ['current', 'minutely_15', 'hourly', 'daily', 'six_hourly']) {
		const sect = params[section];
		if (sect) {
			c += `
<span class="line"><span style="color:var(--code-preview-token-keyword)">	let</span><span style="color:var(--code-preview-foreground)"> ${section}<span style="color:var(--code-preview-token-punctuation-mark)">:</span> ${titleCase(section)}</span></span>`;
		}
	}
	c += `
<span class="line"></span>`;
	for (const section of ['current', 'minutely_15', 'hourly', 'daily', 'six_hourly']) {
		const sect = params[section];
		if (sect) {
			c += `
<span class="line"><span style="color:var(--code-preview-token-accent)">	struct</span><span style="color:var(--code-preview-token-constant)"> ${titleCase(section)}</span><span style="color:var(--code-preview-foreground)"> {</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">		let</span><span style="color:var(--code-preview-foreground)"> time: ${section !== 'current' ? '<span style="color:var(--code-preview-token-punctuation-mark">[</span>' : ''}Date${section !== 'current' ? '<span style="color:var(--code-preview-token-punctuation-mark)">]</span>' : ''}</span></span>`;
			if (sect.constructor === Array) {
				for (const variable of sect) {
					c += `
<span class="line"><span style="color:var(--code-preview-token-keyword)">		let</span><span style="color:var(--code-preview-foreground)"> ${camelCase(variable)}: </span><span style="color:var(--code-preview-token-constant)">${section !== 'current' ? '<span style="color:var(--code-preview-token-punctuation-mark">[</span>' : ''}${INT_64_VARIABLES.includes(variable) ? 'Int64' : 'Float'}${section !== 'current' ? '<span style="color:var(--code-preview-token-punctuation-mark)">]</span>' : ''}</span></span>`;
				}
			} else if (typeof sect === 'string') {
				c += `
<span class="line"><span style="color:var(--code-preview-token-keyword)">		let</span><span style="color:var(--code-preview-foreground)"> ${camelCase(sect)}: </span><span style="color:var(--code-preview-token-constant)">${section !== 'current' ? '<span style="color:var(--code-preview-token-punctuation-mark">[</span>' : ''}${INT_64_VARIABLES.includes(sect) ? 'Int64' : 'Float'}${section !== 'current' ? '<span style="color:var(--code-preview-token-punctuation-mark)">]</span>' : ''}</span></span>`;
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
<span class="line"><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">for</span><span style="color:var(--code-preview-token-variable)"> response</span><span style="color:var(--code-preview-token-keyword-special);font-style:italic;"> in</span><span style="color:var(--code-preview-foreground)"> responses {</span></span>`;
	} else {
		c += `
<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">/// Process first location. Add a for-loop for multiple locations or weather models</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> response </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> responses</span><span style="color:var(--code-preview-token-punctuation-mark)">[</span><span style="color:var(--code-preview-token-constant)">0</span><span style="color:var(--code-preview-token-punctuation-mark)">]</span></span>
<span class="line"></span>`;
	}
	c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">/// Attributes for timezone and location</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> latitude </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> response.latitude</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> longitude </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> response.longitude</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> timezone </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> response.timezone</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> timezoneAbbreviation </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> response.timezoneAbbreviation</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> utcOffsetSeconds </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> response.utcOffsetSeconds</span></span>
${t ? '\t' : ''}<span class="line"></span>`;

	for (const section of ['current', 'minutely_15', 'hourly', 'daily', 'six_hourly']) {
		const sect = params[section];
		if (sect) {
			c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> ${section} </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> response<span style="color:var(--code-preview-token-punctuation-mark)">.</span>${section}</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span></span>`;
		}
	}
	c += `
${t ? '\t' : ''}<span class="line"></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">/// Note: The order of weather variables in the URL query and the 'at' indices below need to match!</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> data </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-token-function)"> WeatherData</span><span style="color:var(--code-preview-token-punctuation)">(</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">	current</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> .</span><span style="color:var(--code-preview-token-accent)">init</span><span style="color:var(--code-preview-token-punctuation)">(</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">		time</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> Date</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">timeIntervalSince1970</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> TimeInterval</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">current.time </span><span style="color:var(--code-preview-token-keyword)">+</span><span style="color:var(--code-preview-token-constant)"> Int64</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">utcOffsetSeconds</span><span style="color:var(--code-preview-token-punctuation)">)))</span><span style="color:var(--code-preview-token-function)">,</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">		temperature2m</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> current.variables</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">at</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> 0</span><span style="color:var(--code-preview-token-punctuation)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-function)">.</span><span style="color:var(--code-preview-token-constant)">value</span><span style="color:var(--code-preview-token-function)">,</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">		precipitation</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> current.variables</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">at</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> 1</span><span style="color:var(--code-preview-token-punctuation)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-function)">.</span><span style="color:var(--code-preview-token-constant)">value</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-punctuation)">	)</span><span style="color:var(--code-preview-token-function)">,</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">	hourly</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> .</span><span style="color:var(--code-preview-token-accent)">init</span><span style="color:var(--code-preview-token-punctuation)">(</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">		time</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> hourly.getDateTime</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">offset</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> utcOffsetSeconds</span><span style="color:var(--code-preview-token-punctuation)">)</span><span style="color:var(--code-preview-token-function)">,</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">		temperature2m</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> hourly.variables</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">at</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> 0</span><span style="color:var(--code-preview-token-punctuation)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-function)">.</span><span style="color:var(--code-preview-token-constant)">values</span><span style="color:var(--code-preview-token-function)">,</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">		weatherCode</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> hourly.variables</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">at</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> 1</span><span style="color:var(--code-preview-token-punctuation)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-function)">.</span><span style="color:var(--code-preview-token-constant)">values</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-punctuation)">	)</span><span style="color:var(--code-preview-token-function)">,</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">	daily</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> .</span><span style="color:var(--code-preview-token-accent)">init</span><span style="color:var(--code-preview-token-punctuation)">(</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">		time</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> daily.getDateTime</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">offset</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> utcOffsetSeconds</span><span style="color:var(--code-preview-token-punctuation)">)</span><span style="color:var(--code-preview-token-function)">,</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">		weatherCode</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> daily.variables</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">at</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> 0</span><span style="color:var(--code-preview-token-punctuation)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-function)">.</span><span style="color:var(--code-preview-token-constant)">values</span><span style="color:var(--code-preview-token-function)">,</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">		sunrise</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> daily.variables</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">at</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> 1</span><span style="color:var(--code-preview-token-punctuation)">)</span><span style="color:var(--code-preview-token-punctuation-mark)">!</span><span style="color:var(--code-preview-token-function)">.valuesInt64</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-punctuation)">	)</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-punctuation)">)</span></span>
${t ? '\t' : ''}<span class="line"></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">/// Timezone '.gmt' is deliberately used.</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic;">/// By adding 'utcOffsetSeconds' before, local-time is inferred</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">let</span><span style="color:var(--code-preview-foreground)"> dateFormatter </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-token-function)"> DateFormatter</span><span style="color:var(--code-preview-token-punctuation)">()</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">dateFormatter.timeZone </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-foreground)"> .gmt</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">dateFormatter.dateFormat </span><span style="color:var(--code-preview-token-punctuation-mark)">=</span><span style="color:var(--code-preview-token-string-expression)"> "yyyy-MM-dd HH:mm"</span></span>
${t ? '\t' : ''}<span class="line"></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">for</span><span style="color:var(--code-preview-token-punctuation)"> (</span><span style="color:var(--code-preview-token-function)">i, date</span><span style="color:var(--code-preview-token-punctuation)">)</span><span style="color:var(--code-preview-token-keyword)"> in</span><span style="color:var(--code-preview-foreground)"> data.hourly.time.</span><span style="color:var(--code-preview-token-function)">enumerated</span><span style="color:var(--code-preview-token-punctuation)">()</span><span style="color:var(--code-preview-foreground)"> {</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">	print</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">dateFormatter.string</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">from</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> date</span><span style="color:var(--code-preview-token-punctuation)">))</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">	print</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">data.hourly.temperature2m</span><span style="color:var(--code-preview-token-punctuation-mark)">[</span><span style="color:var(--code-preview-token-function)">i</span><span style="color:var(--code-preview-token-punctuation)">])</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">	print</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">data.hourly.weatherCode</span><span style="color:var(--code-preview-token-punctuation-mark)">[</span><span style="color:var(--code-preview-token-function)">i</span><span style="color:var(--code-preview-token-punctuation)">])</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">}</span></span>
${t ? '\t' : ''}<span class="line"></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword)">for</span><span style="color:var(--code-preview-token-punctuation)"> (</span><span style="color:var(--code-preview-token-function)">i, date</span><span style="color:var(--code-preview-token-punctuation)">)</span><span style="color:var(--code-preview-token-keyword)"> in</span><span style="color:var(--code-preview-foreground)"> data.daily.time.</span><span style="color:var(--code-preview-token-function)">enumerated</span><span style="color:var(--code-preview-token-punctuation)">()</span><span style="color:var(--code-preview-foreground)"> {</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">	print</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">dateFormatter.string</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">from</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-function)"> date</span><span style="color:var(--code-preview-token-punctuation)">))</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">	print</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">data.daily.weatherCode</span><span style="color:var(--code-preview-token-punctuation-mark)">[</span><span style="color:var(--code-preview-token-function)">i</span><span style="color:var(--code-preview-token-punctuation)">])</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">	print</span><span style="color:var(--code-preview-token-punctuation)">(</span><span style="color:var(--code-preview-token-function)">data.daily.sunrise</span><span style="color:var(--code-preview-token-punctuation-mark)">[</span><span style="color:var(--code-preview-token-function)">i</span><span style="color:var(--code-preview-token-punctuation)">])</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">}</span></span>
${t ? '<span class="line"><span style="color:var(--code-preview-foreground)">}</span></span>' : ''}</code></pre></div>`;
	return c;
};

import type { Parameters } from '$lib/docs';
import { isNumeric, titleCase } from '$lib/utils';

import { INT_64_VARIABLES, SECTIONS, VARIABLE_REGEX } from '$lib/constants';

export const pythonCodeExample = (
	params: Parameters,
	multipleLocationsOrModels: boolean,
	numberOfLocations: number | string,
	numberOfModels: number,
	server: string,
	sdk_type: string,
	sdk_cache: number
) => {
	const t = multipleLocationsOrModels;

	let c = `<div class=""><pre class="" style="background-color:var(--code-preview-background);color:var(--code-preview-foreground)" tabindex="0"><code><span class="line"><span style="color:var(--code-preview-token-keyword);font-style:italic">import</span><span style="color:var(--code-preview-foreground)"> openmeteo_requests</span></span>`;
	if (sdk_type === 'ensemble_api') {
		c += `
<span class="line"></span>
<span class="line"><span style="color:var(--code-preview-token-keyword);font-style:italic">from</span><span style="color:var(--code-preview-foreground)"> openmeteo_sdk.Variable </span><span style="color:var(--code-preview-token-keyword);font-style:italic">import</span><span style="color:var(--code-preview-foreground)"> Variable</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword);font-style:italic">from</span><span style="color:var(--code-preview-foreground)"> openmeteo_sdk.Aggregation </span><span style="color:var(--code-preview-token-keyword);font-style:italic">import</span><span style="color:var(--code-preview-foreground)"> Aggregation</span></span>`;
	}
	c += `
<span class="line"></span>
<span class="line"><span style="color:var(--code-preview-token-keyword);font-style:italic">import</span><span style="color:var(--code-preview-foreground)"> pandas </span><span style="color:var(--code-preview-token-keyword);font-style:italic">as</span><span style="color:var(--code-preview-foreground)"> pd</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword);font-style:italic">import</span><span style="color:var(--code-preview-foreground)"> requests_cache</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword);font-style:italic">from</span><span style="color:var(--code-preview-foreground)"> retry_requests </span><span style="color:var(--code-preview-token-keyword);font-style:italic">import</span><span style="color:var(--code-preview-foreground)"> retry</span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic"># Setup the Open-Meteo API client with cache and retry on error</span></span>
<span class="line"><span style="color:var(--code-preview-foreground)">cache_session </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-foreground)"> requests_cache</span><span style="color:var(--code-preview-token-punctuation-mark)">.</span><span style="color:var(--code-preview-token-function)">CachedSession</span><span style="color:var(--code-preview-token-bracket)">(</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)">'</span>.cache<span style="color:var(--code-preview-token-punctuation-mark)">'</span></span><span style="color:var(--code-preview-token-punctuation-mark)">, </span><span style="font-style:italic">expire_after</span> </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-constant)"> ${sdk_cache}</span><span style="color:var(--code-preview-token-bracket)">)</span></span>
<span class="line"><span style="color:var(--code-preview-foreground)">retry_session </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-function)"> retry</span><span style="color:var(--code-preview-token-bracket)">(<span style="color:var(--code-preview-token-function)">cache_session</span>, </span><span style="font-style:italic">retries </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-constant)"> 5</span><span style="font-style:italic">, backoff_factor </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-constant)"> 0.2</span><span style="color:var(--code-preview-token-bracket)">)</span></span>
<span class="line"><span style="color:var(--code-preview-foreground)">openmeteo </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-foreground)"> openmeteo_requests</span><span style="color:var(--code-preview-token-punctuation-mark)">.</span><span style="color:var(--code-preview-token-function)">Client</span><span style="color:var(--code-preview-token-bracket)">(</span><span style="font-style:italic">session</span> </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-punctuation)"> retry_session<span style="color:var(--code-preview-token-bracket)">)</span></span></span>
<span class="line"></span>
<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic"># Make sure all required weather variables are listed here</span></span>
<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic"># The order of variables in hourly or daily is important to assign them correctly below</span></span>
<span class="line"><span style="color:var(--code-preview-foreground)">url </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-punctuation-mark)"> "</span>${server}<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span>
<span class="line"><span style="color:var(--code-preview-foreground)">params </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-punctuation-mark)"> {</span></span>`;
	for (const [key, param] of Object.entries(params)) {
		if (param.constructor === Array) {
			if (typeof param[0] === 'string' && !isNumeric(param[0])) {
				c += `
<span class="line"><span style="color:var(--code-preview-token-string-expression)">	<span style="color:var(--code-preview-token-punctuation-mark)">"</span>${key}<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">:</span> ${'<span style="color:var(--code-preview-token-bracket)">[<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-string-expression)">' + param.join('</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-punctuation-mark)">, <span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-string-expression)">') + '</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-bracket)">]</span>'}<span style="color:var(--code-preview-token-punctuation-mark)">,</span>`;
			} else {
				c += `
<span class="line"><span style="color:var(--code-preview-token-string-expression)">	<span style="color:var(--code-preview-token-punctuation-mark)">"</span>${key}<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> ${'<span style="color:var(--code-preview-token-bracket)">[</span>' + param.join('<span style="color:var(--code-preview-token-punctuation-mark)">, </span>') + '<span style="color:var(--code-preview-token-bracket)">]</span>'}</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
			}
		} else if (typeof param === 'object') {
			// ???
		} else if (typeof param === 'string' && !isNumeric(param)) {
			c += `
<span class="line"><span style="color:var(--code-preview-token-string-expression)">	<span style="color:var(--code-preview-token-punctuation-mark)">"</span>${key}<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> ${'<span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">' + param + '</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span>'}</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
		} else {
			c += `
<span class="line"><span style="color:var(--code-preview-token-string-expression)">	<span style="color:var(--code-preview-token-punctuation-mark)">"</span>${key}<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-token-constant)"> ${param}</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>`;
		}
	}
	c += `
<span class="line"><span style="color:var(--code-preview-token-punctuation-mark)">}</span></span>
<span class="line"><span style="color:var(--code-preview-foreground)">responses </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-foreground)"> openmeteo</span><span style="color:var(--code-preview-token-punctuation-mark)">.</span><span style="color:var(--code-preview-token-function)">weather_api</span><span style="color:var(--code-preview-token-bracket)">(<span style="color:var(--code-preview-token-function)">url</span>, <span style="color:var(--code-preview-foreground);font-style:italic">params</span></span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-punctuation)">params<span style="color:var(--code-preview-token-bracket)">)</span></span></span>
<span class="line"></span>`;
	if (multipleLocationsOrModels) {
		c +=
			`
<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic"># Process ` +
			(numberOfLocations ? `${numberOfLocations} locations` : '1 location') +
			(numberOfModels ? ` and ${numberOfModels} models` : '') +
			`</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword);font-style:italic">for </span><span style="color:var(--code-preview-foreground)">response </span><span style="color:var(--code-preview-token-keyword);font-style:italic">in</span><span style="color:var(--code-preview-foreground)"> responses</span><span style="color:var(--code-preview-token-punctuation-mark)">:</span></span>`;
	} else {
		c += `
<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic"># Process first location. Add a for-loop for multiple locations or weather models</span></span>
<span class="line"><span style="color:var(--code-preview-foreground)">response </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-foreground)"> responses</span><span style="color:var(--code-preview-token-punctuation-mark)">[</span><span style="color:var(--code-preview-token-constant)">0</span><span style="color:var(--code-preview-token-punctuation-mark)">]</span></span>`;
	}

	c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-bracket)">(</span><span style="color:var(--code-preview-token-accent)">f</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">${t ? '\\n' : ''}Coordinates: </span><span style="color:var(--code-preview-token-constant)">{</span><span style="color:var(--code-preview-token-punctuation)">response.</span><span style="color:var(--code-preview-token-function)">Latitude</span><span style="color:var(--code-preview-token-bracket)">()</span><span style="color:var(--code-preview-token-constant)">}</span><span style="color:var(--code-preview-token-string-expression)">°N </span><span style="color:var(--code-preview-token-constant)">{</span><span style="color:var(--code-preview-token-punctuation)">response.</span><span style="color:var(--code-preview-token-function)">Longitude</span><span style="color:var(--code-preview-token-bracket)">()</span><span style="color:var(--code-preview-token-constant)">}</span><span style="color:var(--code-preview-token-string-expression)">°E<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-bracket)">)</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-bracket)">(</span><span style="color:var(--code-preview-token-accent)">f</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">Elevation: </span><span style="color:var(--code-preview-token-constant)">{</span><span style="color:var(--code-preview-token-punctuation)">response.</span><span style="color:var(--code-preview-token-function)">Elevation</span><span style="color:var(--code-preview-token-bracket)">()</span><span style="color:var(--code-preview-token-constant)">}</span><span style="color:var(--code-preview-token-string-expression)"> m asl<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-bracket)">)</span></span>`;
	if (params.timezone) {
		c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-bracket)">(</span><span style="color:var(--code-preview-token-accent)">f</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">Timezone: </span><span style="color:var(--code-preview-token-constant)">{</span><span style="color:var(--code-preview-token-punctuation)">response.</span><span style="color:var(--code-preview-token-function)">Timezone</span><span style="color:var(--code-preview-token-bracket)">()</span><span style="color:var(--code-preview-token-constant)">}{</span><span style="color:var(--code-preview-token-punctuation)">response.</span><span style="color:var(--code-preview-token-function)">TimezoneAbbreviation</span><span style="color:var(--code-preview-token-bracket)">()</span><span style="color:var(--code-preview-token-constant)">}</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)"></span><span style="color:var(--code-preview-token-bracket)">)</span></span>`;
	}
	c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-bracket)">(</span><span style="color:var(--code-preview-token-accent)">f</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">Timezone difference to GMT+0: </span><span style="color:var(--code-preview-token-constant)">{</span><span style="color:var(--code-preview-token-punctuation)">response.</span><span style="color:var(--code-preview-token-function)">UtcOffsetSeconds</span><span style="color:var(--code-preview-token-bracket)">()</span><span style="color:var(--code-preview-token-constant)">}</span><span style="color:var(--code-preview-token-string-expression)">s<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-bracket)">)</span></span>`;
	if (numberOfModels) {
		c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-bracket)">(</span><span style="color:var(--code-preview-token-accent)">f</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">Model Nº: </span><span style="color:var(--code-preview-token-constant)">{</span><span style="color:var(--code-preview-token-punctuation)">response.</span><span style="color:var(--code-preview-token-function)">Model</span><span style="color:var(--code-preview-token-bracket)">()</span><span style="color:var(--code-preview-token-constant)">}</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-bracket)">)</span></span>`;
	}

	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			c += `
${t ? '\t' : ''}<span class="line"></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic"># Process ${section} data. The order of variables needs to be the same as requested.</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">${section} </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-foreground)"> response</span><span style="color:var(--code-preview-token-punctuation-mark)">.</span><span style="color:var(--code-preview-token-function)">${titleCase(section)}</span><span style="color:var(--code-preview-token-bracket)">()</span></span>`;
			if (sdk_type == 'ensemble_api') {
				c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">${section}_variables </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-constant)"> list</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-function)">map</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-accent)">lambda</span><span style="color:var(--code-preview-token-parameter);font-style:italic"> i</span><span style="color:var(--code-preview-token-punctuation)">: ${section}.</span><span style="color:var(--code-preview-token-function)">Variables</span><span style="color:var(--code-preview-token-punctuation-mark)">(<span style="color:var(--code-preview-foreground)">i</span>), </span><span style="color:var(--code-preview-token-function)">range</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-constant)">0</span><span style="color:var(--code-preview-token-punctuation)">, ${section}.</span><span style="color:var(--code-preview-token-function)">VariablesLength</span><span style="color:var(--code-preview-token-punctuation-mark)">())))</span></span>`;
				if (sect.constructor === Array) {
					for (const variable of sect) {
						c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">${section}_${variable} </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-function)"> filter</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-accent)">lambda</span><span style="color:var(--code-preview-token-parameter);font-style:italic"> x</span><span style="color:var(--code-preview-token-punctuation)">: `;
						const matches = VARIABLE_REGEX.exec(variable);
						if (matches == null || matches.groups == null) {
							c += `x.</span><span style="color:var(--code-preview-token-function)">Variable</span><span style="color:var(--code-preview-token-punctuation-mark)">() </span><span style="color:var(--code-preview-token-keyword)">==</span><span style="color:var(--code-preview-token-punctuation)"> Variable.${variable}</span>`;
						} else {
							const groups = matches.groups;
							const results = [
								`x.</span><span style="color:var(--code-preview-token-function)">Variable</span><span style="color:var(--code-preview-token-punctuation-mark)">() </span><span style="color:var(--code-preview-token-keyword)">==</span><span style="color:var(--code-preview-token-punctuation)"> Variable.${groups.variable}</span>`
							];
							if (groups.altitude) {
								results.push(
									`<span style="color:var(--code-preview-token-punctuation)">x.</span><span style="color:var(--code-preview-token-function)">Altitude</span><span style="color:var(--code-preview-token-punctuation-mark)">() </span><span style="color:var(--code-preview-token-keyword)">==</span><span style="color:var(--code-preview-token-constant)"> ${groups.altitude}</span>`
								);
							}
							if (groups.pressure) {
								results.push(
									`<span style="color:var(--code-preview-token-punctuation)">x.</span><span style="color:var(--code-preview-token-function)">PressureLevel</span><span style="color:var(--code-preview-token-punctuation-mark)">() </span><span style="color:var(--code-preview-token-keyword)">==</span><span style="color:var(--code-preview-token-constant)"> ${groups.pressure}</span>`
								);
							}
							if (groups.depth) {
								results.push(
									`<span style="color:var(--code-preview-token-punctuation)">x.</span><span style="color:var(--code-preview-token-function)">Depth</span><span style="color:var(--code-preview-token-punctuation-mark)">() </span><span style="color:var(--code-preview-token-keyword)">==</span><span style="color:var(--code-preview-token-constant)"> ${groups.depth}</span>`
								);
							}
							if (groups.depth_from) {
								results.push(
									`<span style="color:var(--code-preview-token-punctuation)">x.</span><span style="color:var(--code-preview-token-function)">Depth</span><span style="color:var(--code-preview-token-punctuation-mark)">() </span><span style="color:var(--code-preview-token-keyword)">==</span><span style="color:var(--code-preview-token-constant)"> ${groups.depth_from}</span>`
								);
								results.push(
									`<span style="color:var(--code-preview-token-punctuation)">x.</span><span style="color:var(--code-preview-token-function)">DepthTo</span><span style="color:var(--code-preview-token-punctuation-mark)">() </span><span style="color:var(--code-preview-token-keyword)">==</span><span style="color:var(--code-preview-token-constant)"> ${groups.depth_to}</span>`
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
									`<span style="color:var(--code-preview-token-punctuation)">x.</span><span style="color:var(--code-preview-token-function)">Aggregation</span><span style="color:var(--code-preview-token-punctuation-mark)">() </span><span style="color:var(--code-preview-token-keyword)">==</span><span style="color:var(--code-preview-token-constant)"> Aggregation<span style="color:var(--code-preview-token-punctuation)">.</span>${aggregation}</span>`
								);
							}
							c += results.join(
								` <span style="color:var(--code-preview-token-keyword);font-style:italic">and</span> `
							);
						}

						c += `<span style="color:var(--code-preview-token-punctuation)">, ${section}_variables)</span></span>`;
					}
				} else if (typeof sect === 'string') {
					c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">${section}_${sect} </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-function)"> filter</span><span style="color:var(--code-preview-token-punctuation-mark)">(</span><span style="color:var(--code-preview-token-accent)">lambda</span><span style="color:var(--code-preview-token-parameter);font-style:italic"> x</span><span style="color:var(--code-preview-token-punctuation)">: x.</span><span style="color:var(--code-preview-token-function)">Variable</span><span style="color:var(--code-preview-token-punctuation-mark)">() </span><span style="color:var(--code-preview-token-keyword)">==</span><span style="color:var(--code-preview-token-punctuation)"> Variable.temperature </span><span style="color:var(--code-preview-token-keyword);font-style:italic">and</span><span style="color:var(--code-preview-token-punctuation)"> x.</span><span style="color:var(--code-preview-token-function)">Altitude</span><span style="color:var(--code-preview-token-punctuation-mark)">() </span><span style="color:var(--code-preview-token-keyword)">==</span><span style="color:var(--code-preview-token-constant)"> 2</span><span style="color:var(--code-preview-token-punctuation)">, ${section}_variables)</span></span>	`;
				}
			} else {
				if (sect.constructor === Array) {
					for (const [ind, variable] of sect.entries()) {
						c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">${section}_${variable} </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-foreground)"> ${section}</span><span style="color:var(--code-preview-token-punctuation-mark)">.</span><span style="color:var(--code-preview-token-function)">Variables</span><span style="color:var(--code-preview-token-bracket)">(</span><span style="color:var(--code-preview-token-constant)">${ind}</span><span style="color:var(--code-preview-token-bracket)">).</span><span style="color:var(--code-preview-token-function)">${section === 'current' ? 'Value' : INT_64_VARIABLES.includes(variable) ? 'ValuesInt64AsNumpy' : 'ValuesAsNumpy'}</span><span style="color:var(--code-preview-token-bracket)">()</span></span>`;
					}
				} else if (typeof sect === 'string') {
					c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">${section}_${sect} </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-foreground)"> ${section}</span><span style="color:var(--code-preview-token-punctuation-mark)">.</span><span style="color:var(--code-preview-token-function)">Variables</span><span style="color:var(--code-preview-token-bracket)">(</span><span style="color:var(--code-preview-token-constant)">0</span><span style="color:var(--code-preview-token-bracket)">).</span><span style="color:var(--code-preview-token-function)">${section === 'current' ? 'Value' : INT_64_VARIABLES.includes(sect) ? 'ValuesInt64AsNumpy' : 'ValuesAsNumpy'}</span><span style="color:var(--code-preview-token-bracket)">()</span></span>`;
				}
			}
			if (section !== 'current') {
				c += `
${t ? '\t' : ''}<span class="line"></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">${section}_data </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-punctuation-mark)"> {</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">date<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">:</span><span style="color:var(--code-preview-foreground)"> pd</span><span style="color:var(--code-preview-token-punctuation-mark)">.</span><span style="color:var(--code-preview-token-function)">date_range</span><span style="color:var(--code-preview-token-bracket)">(</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground);font-style:italic">	start </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-punctuation)"> ${section === 'monthly' ? '<span style="color:var(--code-preview-foreground)"><span style="color:var(--code-preview-token-accent)">f</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)"><span style="color:var(--code-preview-token-constant)">{</span><span style="color:var(--code-preview-token-punctuation)">monthly.</span><span style="color:var(--code-preview-token-function)">Year</span><span style="color:var(--code-preview-token-bracket)">()</span><span style="color:var(--code-preview-token-constant)">}</span>-<span style="color:var(--code-preview-token-constant)">{</span><span style="color:var(--code-preview-token-punctuation)">monthly.</span><span style="color:var(--code-preview-token-function)">Month</span><span style="color:var(--code-preview-token-bracket)">()</span><span style="color:var(--code-preview-token-constant)">}</span>-01<span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">,</span></span>' : 'pd.</span><span style="color:var(--code-preview-token-function)">to_datetime</span><span style="color:var(--code-preview-token-bracket)">(<span style="color:var(--code-preview-token-function)">' + section + '</span>.</span><span style="color:var(--code-preview-token-function)">Time</span><span style="color:var(--code-preview-token-bracket)">(), <span style="color:var(--code-preview-foreground);font-style:italic">unit</span> </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-punctuation-mark)"> "</span><span style="color:var(--code-preview-token-string-expression)">s</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">, <span style="color:var(--code-preview-foreground);font-style:italic">utc</span> </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-constant)"> True</span><span style="color:var(--code-preview-token-bracket)">),</span>'}</span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground);font-style:italic">	${section === 'monthly' ? 'periods </span><span style="color:var(--code-preview-token-keyword)">=</span> <span style="color:var(--code-preview-token-punctuation)">monthly.</span><span style="color:var(--code-preview-token-function)">Count</span><span style="color:var(--code-preview-token-bracket)">()</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span>' : 'end </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-punctuation)">  pd.</span><span style="color:var(--code-preview-token-function)">to_datetime</span><span style="color:var(--code-preview-token-bracket)">(<span style="color:var(--code-preview-token-function)">' + section + '</span>.</span><span style="color:var(--code-preview-token-function)">TimeEnd</span><span style="color:var(--code-preview-token-bracket)">(), <span style="color:var(--code-preview-foreground);font-style:italic">unit</span> </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-punctuation-mark)"> "</span><span style="color:var(--code-preview-token-string-expression)">s</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span></span><span style="color:var(--code-preview-token-punctuation-mark)">, <span style="color:var(--code-preview-foreground);font-style:italic">utc</span> </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-constant)"> True</span><span style="color:var(--code-preview-token-bracket)">),</span>'}</span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground);font-style:italic">	freq </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-punctuation)"> ${section === 'monthly' ? '<span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">MS</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-punctuation-mark)">,</span>' : 'pd.</span><span style="color:var(--code-preview-token-function)">Timedelta</span><span style="color:var(--code-preview-token-bracket)">(<span style="color:var(--code-preview-foreground);font-style:italic">seconds</span> </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-punctuation)"> ' + section + '</span><span style="color:var(--code-preview-token-function)">Interval</span><span style="color:var(--code-preview-token-bracket)">()),</span></span>'}
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground);font-style:italic">	inclusive </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-punctuation-mark)"> "</span><span style="color:var(--code-preview-token-string-expression)">left</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span></span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-bracket)">)}</span></span>
${t ? '\t' : ''}<span class="line"></span>`;
			}

			if (section !== 'current') {
				if (sdk_type == 'ensemble_api') {
					c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-comment);font-style:italic"># Process all ${section} members</span></span>`;
					if (sect.constructor === Array) {
						for (const variable of sect) {
							c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword);font-style:italic">for</span><span style="color:var(--code-preview-foreground)"> variable </span><span style="color:var(--code-preview-token-keyword);font-style:italic">in</span><span style="color:var(--code-preview-foreground)"> ${section}_${variable}</span><span style="color:var(--code-preview-token-punctuation)">:</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">	member </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-foreground)"> variable</span><span style="color:var(--code-preview-token-punctuation)">.</span><span style="color:var(--code-preview-token-function)">EnsembleMember</span><span style="color:var(--code-preview-token-punctuation-mark)">()</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">	${section}_data</span><span style="color:var(--code-preview-token-punctuation)">[</span><span style="color:var(--code-preview-token-accent)">f</span><span style="color:var(--code-preview-token-string-expression)">"${variable}_member</span><span style="color:var(--code-preview-token-constant)">{</span><span style="color:var(--code-preview-foreground)">member</span><span style="color:var(--code-preview-token-constant)">}</span><span style="color:var(--code-preview-token-string-expression)">"</span><span style="color:var(--code-preview-token-punctuation)">]</span><span style="color:var(--code-preview-token-keyword)"> =</span><span style="color:var(--code-preview-foreground)"> variable</span><span style="color:var(--code-preview-token-punctuation)">.</span><span style="color:var(--code-preview-token-function)">${INT_64_VARIABLES.includes(variable) ? 'ValuesInt64AsNumpy' : 'ValuesAsNumpy'}</span><span style="color:var(--code-preview-token-punctuation-mark)">()</span></span>`;
						}
					} else if (typeof sect === 'string') {
						c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-keyword);font-style:italic">for</span><span style="color:var(--code-preview-foreground)"> variable </span><span style="color:var(--code-preview-token-keyword);font-style:italic">in</span><span style="color:var(--code-preview-foreground)"> ${section}_${sect}</span><span style="color:var(--code-preview-token-punctuation)">:</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">	member </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-foreground)"> variable</span><span style="color:var(--code-preview-token-punctuation)">.</span><span style="color:var(--code-preview-token-function)">EnsembleMember</span><span style="color:var(--code-preview-token-punctuation-mark)">()</span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">	${section}_data</span><span style="color:var(--code-preview-token-punctuation)">[</span><span style="color:var(--code-preview-token-accent)">f</span><span style="color:var(--code-preview-token-string-expression)">"${sect}_member</span><span style="color:var(--code-preview-token-constant)">{</span><span style="color:var(--code-preview-foreground)">member</span><span style="color:var(--code-preview-token-constant)">}</span><span style="color:var(--code-preview-token-string-expression)">"</span><span style="color:var(--code-preview-token-punctuation)">]</span><span style="color:var(--code-preview-token-keyword)"> =</span><span style="color:var(--code-preview-foreground)"> variable</span><span style="color:var(--code-preview-token-punctuation)">.</span><span style="color:var(--code-preview-token-function)">${INT_64_VARIABLES.includes(sect) ? 'ValuesInt64AsNumpy' : 'ValuesAsNumpy'}</span><span style="color:var(--code-preview-token-punctuation-mark)">()</span></span>`;
					}
				} else {
					if (sect.constructor === Array) {
						for (const variable of sect) {
							c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">${section}_data</span><span style="color:var(--code-preview-token-punctuation-mark)">[</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">${variable}"</span><span style="color:var(--code-preview-token-punctuation-mark)">]</span><span style="color:var(--code-preview-token-keyword)"> =</span><span style="color:var(--code-preview-foreground)"> ${section}_${variable}</span></span>`;
						}
					} else {
						c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">${section}_data</span><span style="color:var(--code-preview-token-punctuation-mark)">[</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">${sect}"</span><span style="color:var(--code-preview-token-punctuation-mark)">]</span><span style="color:var(--code-preview-token-keyword)"> =</span><span style="color:var(--code-preview-foreground)"> ${section}_${sect}</span></span>`;
					}
				}
			}
			if (section === 'current') {
				// no dataframe
				c += `
${t ? '\t' : ''}<span class="line"></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-bracket)">(</span><span style="color:var(--code-preview-token-accent)">f</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">\\nCurrent time: </span><span style="color:var(--code-preview-token-constant)">{</span><span style="color:var(--code-preview-token-punctuation)">current.</span><span style="color:var(--code-preview-token-function)">Time</span><span style="color:var(--code-preview-token-bracket)">()</span><span style="color:var(--code-preview-token-constant)">}</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)"></span><span style="color:var(--code-preview-token-bracket)">)</span></span>`;
				if (sect.constructor === Array) {
					for (const variable of sect) {
						c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-bracket)">(</span><span style="color:var(--code-preview-token-accent)">f</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">Current ${variable}: </span><span style="color:var(--code-preview-token-constant)">{</span><span style="color:var(--code-preview-token-punctuation)">current_${variable}</span><span style="color:var(--code-preview-token-constant)">}</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)"></span><span style="color:var(--code-preview-token-bracket)">)</span></span>`;
					}
				} else {
					c += `
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-bracket)">(</span><span style="color:var(--code-preview-token-accent)">f</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)">Current ${sect}: </span><span style="color:var(--code-preview-token-constant)">{</span><span style="color:var(--code-preview-token-punctuation)">current_${sect}</span><span style="color:var(--code-preview-token-constant)">}</span><span style="color:var(--code-preview-token-punctuation-mark)">"</span><span style="color:var(--code-preview-token-string-expression)"></span><span style="color:var(--code-preview-token-bracket)">)</span></span>`;
				}
			} else {
				c += `
${t ? '\t' : ''}<span class="line"></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-foreground)">${section}_dataframe </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-foreground)"> pd</span><span style="color:var(--code-preview-token-punctuation-mark)">.</span><span style="color:var(--code-preview-token-function)">DataFrame</span><span style="color:var(--code-preview-token-bracket)">(<span style="color:var(--code-preview-foreground);font-style:italic">data</span> </span><span style="color:var(--code-preview-token-keyword)">=</span><span style="color:var(--code-preview-token-punctuation)"> ${section}_data<span style="color:var(--code-preview-token-bracket)">)</span></span></span>
${t ? '\t' : ''}<span class="line"><span style="color:var(--code-preview-token-function)">print</span><span style="color:var(--code-preview-token-bracket)">("<span style="color:var(--code-preview-token-string-expression)">\\n${titleCase(section)} data\\n</span>", <span style="color:var(--code-preview-token-function)">${section}_dataframe</span>)</span></span>`;
			}
		}
	}

	c += `
${t ? '\t' : ''}<span class="line"></span></pre></div>
`;
	return c;
};

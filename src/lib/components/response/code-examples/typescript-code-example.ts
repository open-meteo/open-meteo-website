import { camelCase, isNumeric, titleCase } from '$lib/utils';

import { INT_64_VARIABLES, SECTIONS, VARIABLE_REGEX } from '$lib/constants';

import {
	br,
	cmt,
	empty,
	fg,
	fgi,
	fn,
	it,
	kw,
	kwsp,
	kwspi,
	line,
	normalizeAggregation,
	num,
	numericArrayTokens,
	p,
	pm,
	quotedStr,
	str,
	stringArrayTokens,
	strk,
	vr
} from './highlight-helpers';

import type { Parameters } from '$lib/docs';

export const typescriptCodeExample = (
	params: Parameters,
	multipleLocationsOrModels: boolean,
	numberOfLocations: number | string,
	numberOfModels: number,
	server: string,
	sdk_type: string
) => {
	const indent = multipleLocationsOrModels;
	const tab = indent ? '\t' : '';

	// Template literal syntax tokens (for the generated JS code output)
	const tick = pm('`');
	const exprO = pm('${');
	const exprC = pm('}');
	const nlEsc = fg('\\n');

	const responseAttr = (name: string) =>
		line(
			kw('const') +
				vr(` ${name}`) +
				pm(' =') +
				vr(' response') +
				fn(`${pm('.')}${name}`) +
				fg(`()${pm(';')}`),
			indent
		);

	/** Build ensemble filter condition from a variable name using VARIABLE_REGEX */
	const buildFilterCondition = (variable: string): string => {
		const matches = VARIABLE_REGEX.exec(variable);
		if (matches == null || matches.groups == null) {
			return (
				vr('v') +
				fn(`${pm('?.')}variable`) +
				fg('() ') +
				pm('===') +
				vr(' Variable') +
				fg(`${pm('.')}${variable}`)
			);
		}
		const groups = matches.groups;
		const conditions = [
			vr('v') +
				fn(`${pm('?.')}variable`) +
				fg('() ') +
				pm('===') +
				vr(' Variable') +
				fg(`${pm('.')}${groups.variable}`)
		];
		if (groups.altitude) {
			conditions.push(
				vr('v') + fn(`${pm('?.')}altitude`) + fg('() ') + pm('===') + num(` ${groups.altitude}`)
			);
		}
		if (groups.pressure) {
			conditions.push(
				vr('v') +
					fn(`${pm('?.')}pressureLevel`) +
					fg('() ') +
					pm('===') +
					num(` ${groups.pressure}`)
			);
		}
		if (groups.depth) {
			conditions.push(
				vr('v') + fn(`${pm('?.')}depth`) + fg('() ') + pm('===') + num(` ${groups.depth}`)
			);
		}
		if (groups.depth_from) {
			conditions.push(
				vr('v') + fn(`${pm('?.')}depth`) + fg('() ') + pm('===') + num(` ${groups.depth}`)
			);
			conditions.push(
				vr('v') + fn(`${pm('?.')}depthTo`) + fg('() ') + pm('===') + num(` ${groups.depth_to}`)
			);
		}
		if (groups.aggregation) {
			const agg = normalizeAggregation(groups.aggregation);
			conditions.push(
				vr('v') +
					fn(`${pm('?.')}aggregation`) +
					fg('() ') +
					pm('===') +
					vr(` Aggregation${pm('.')}${agg}`)
			);
		}
		return conditions.join(` ${pm('&amp;&amp;')} `);
	};

	// --- Opening: import fetchWeatherApi ---
	let c =
		`<div class=""><pre class="javascript" style="background-color:var(--code-preview-background);color:var(--code-preview-foreground)"><code>` +
		line(
			kwspi('import') +
				fg(` ${br('{')} fetchWeatherApi ${br('}')} `) +
				kwspi('from') +
				str(' "openmeteo"') +
				fg(pm(';'))
		) +
		`\n${empty()}`;

	// --- Ensemble API imports ---
	if (sdk_type === 'ensemble_api') {
		c += `
${line(kwspi('import') + fg(` ${br('{')} Variable ${br('}')} `) + kwspi('from') + str(" '@openmeteo/sdk/variable'") + fg(pm(';')))}
${line(kwspi('import') + fg(` ${br('{')} Aggregation ${br('}')} `) + kwspi('from') + str(" '@openmeteo/sdk/aggregation'") + fg(pm(';')))}
		`;
	}

	// --- Params object ---
	c += `
${line(kw('const') + vr(' params') + pm(' =') + fg(` ${br('{')}`))}`;
	for (const [key, param] of Object.entries(params)) {
		if (param.constructor === Array) {
			if (typeof param[0] === 'string' && !isNumeric(param[0])) {
				c += `
${line(`${strk(`\t${key}`)}${pm(':')} ${stringArrayTokens(param as string[])}${pm(',')}`)}`;
			} else {
				c += `
${line(`${strk(`\t${key}`)}${pm(':')}${num(` ${numericArrayTokens(param as (string | number)[])}`)}${pm(',')}`)}`;
			}
		} else if (typeof param === 'object') {
			// Skip non-plain-object params
		} else if (typeof param === 'string' && !isNumeric(param)) {
			c += `
${line(`${strk(`\t${key}`)}${pm(':')}${num(` ${quotedStr(param)}`)}${pm(',')}`)}`;
		} else {
			c += `
${line(`${strk(`\t${key}`)}${pm(':')}${num(` ${param}`)}${pm(',')}`)}`;
		}
	}

	// --- URL and fetch ---
	c += `
${line(fg(`${br('}')}${pm(';')}`))}
${line(kw('const') + vr(' url') + pm(' =') + str(` "${server}"`) + fg(pm(';')))}
${line(kw('const') + vr(' responses') + pm(' =') + kwspi(' await') + fn(' fetchWeatherApi') + fg('(url') + p(',') + fg(` params)${pm(';')}`))}
${empty()}`;

	// --- Multiple locations/models loop ---
	if (multipleLocationsOrModels) {
		c += `
${line(cmt('// Process ' + (numberOfLocations ? `${numberOfLocations} locations` : '1 location') + (numberOfModels ? ` and ${numberOfModels} models` : '')))}
${line(kwspi('for') + fg(' (') + kw('const') + vr(' response') + kwspi(' of') + fg(' responses) {'))}`;
	} else {
		c += `
${line(cmt('// Process first location. Add a for-loop for multiple locations or weather models'))}
${line(kw('const') + vr(' response') + pm(' =') + fg(' responses[') + num('0') + fg(`]${pm(';')}`))}
${empty()}`;
	}

	// --- Location attributes ---
	c += `
${line(cmt('// Attributes for timezone and location'), indent)}
${responseAttr('latitude')}
${responseAttr('longitude')}
${responseAttr('elevation')}`;
	if (params.timezone) {
		c += `
${responseAttr('timezone')}
${responseAttr('timezoneAbbreviation')}`;
	}
	c += `
${responseAttr('utcOffsetSeconds')}
${empty(indent)}`;

	// --- Console.log location info ---
	c += `
${line(vr('console') + fn(`${pm('.')}log`) + fg('('), indent)}
${line(`\t${str(`${tick}${nlEsc}Coordinates: ${exprO}${fg('latitude')}${exprC}°N ${exprO}${fg('longitude')}${exprC}°E${tick}`)}${pm(',')}`, indent)}
${line(`\t${str(`${tick}${nlEsc}Elevation: ${exprO}${fg('elevation')}${exprC}m asl${tick}`)}${pm(',')}`, indent)}`;
	if (params.timezone) {
		c += `
${line(`\t${str(`${tick}${nlEsc}Timezone: ${exprO}${fg('timezone')}${exprC} ${exprO}${fg('timezoneAbbreviation')}${exprC}${tick}`)}${pm(',')}`, indent)}`;
	}
	c += `
${line(`\t${str(`${tick}${nlEsc}Timezone difference to GMT+0: ${exprO}${fg('utcOffsetSeconds')}${exprC}s${tick}`)}${pm(',')}`, indent)}`;
	if (numberOfModels) {
		c += `
${line(`\t${str(`${tick}${nlEsc}Model Nº: ${exprO}${fg(`response${pm('.')}model${pm('()')}`)}${exprC}${tick}`)}${pm(',')}`, indent)}`;
	}
	c += `
${line(fg(`)${pm(';')}`), indent)}
${empty(indent)}`;

	// --- Section variables (hourly, daily, etc.) ---
	let int64Found = false;
	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			c += `
${line(kw('const') + vr(` ${camelCase(section)}`) + pm(' =') + vr(' response') + fn(`${pm('.')}${camelCase(section)}`) + fg('()') + pm('!') + fg(pm(';')), indent)}`;

			if (
				sdk_type === 'ensemble_api' &&
				section !== 'current' &&
				section !== 'monthly' &&
				section !== 'weekly'
			) {
				// Ensemble: build variables array via Array.from (multi-line, unclosed line span)
				c += `
${tab}<span class="line">${kw('const')}${vr(` ${camelCase(section)}Variables`)}${pm(' =')}${fg(` ${fn('Array')}${pm('.')}from(`)}
${tab}\t${pm('{')} ${strk('length')}${pm(':')} ${vr(camelCase(section))}${fn(`${pm('.')}variablesLength`)}${fg('() }, ')}
${tab}\t${fn(`${fg(`${pm('(')}_ `)}${pm(',')}${fgi(` i${pm(')')} `)}${pm('=&gt;')}`)}${vr(` ${camelCase(section)}`)}${fn(`${pm('.')}variables`)}${fg(`(${fgi('i')})`)}}${p(',')}
${line(fg(');'), indent)}`;

				if (sect.constructor === Array) {
					for (const variable of sect) {
						c += `
${line(kw('const') + vr(` ${camelCase(section + '_' + variable)}`) + pm(' =') + vr(` ${camelCase(section)}Variables`) + fn(`${pm('.')}filter`) + fg('('), indent)}
${line(fg(`\t${pm('(')}${it('v')}${pm(')')} `) + kw('=&gt; ') + buildFilterCondition(variable) + pm(','), indent)}`;
						c += `
${line(fg(`)${pm(';')}`), indent)}`;
					}
				} else if (typeof sect === 'string') {
					c += `
${line(kw('const') + vr(` ${camelCase(section + '_' + sect)}`) + pm(' =') + vr(` ${camelCase(section)}Variables`) + fn(`${pm('.')}filter`) + fg('('), indent)}
${line(fg(`\t${pm('(')}${it('v')}${pm(')')} `) + kw('=&gt; ') + buildFilterCondition(sect) + pm(','), indent)}
${line(fg(`)${pm(';')}`), indent)}`;
				}
				c += `
${empty(indent)}`;
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
${empty(indent)}`;
	}

	// --- Int64 variable declarations ---
	if (int64Found) {
		c += `
${line(cmt('// Define Int64 variables so they can be processed accordingly'), indent)}`;
		for (const section of SECTIONS) {
			const sect = params[section];
			if (sect && sect.constructor === Array) {
				for (const [ind, variable] of sect.entries()) {
					if (INT_64_VARIABLES.includes(variable)) {
						c += `
${line(kw('const') + vr(` ${variable}`) + pm(' =') + vr(` ${camelCase(section)}`) + fn(`${pm('.')}variables`) + fg('(') + num(`${ind}`) + fg(')') + pm('!') + fg(pm(';')), indent)}`;
					}
				}
			}
		}
		c += `
${empty(indent)}`;
	}

	// --- weatherData object ---
	c += `
${line(cmt('// Note: The order of weather variables in the URL query and the indices below need to match!'), indent)}
${line(kw('const') + vr(' weatherData') + pm(' =') + fg(` ${br('{')}`), indent)}`;

	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			c += `
${line(strk(`\t${camelCase(section)}`) + pm(':') + fg(` ${br('{')}`), indent)}`;

			// Time array
			if (section === 'current') {
				c += `
${line(strk('\t\ttime') + pm(':') + kwsp(' new') + fn(' Date') + fg('((') + fn('Number') + fg('(') + vr('current') + fn(`${pm('.')}time`) + fg('()) ') + pm('+') + fg(' utcOffsetSeconds) ') + pm('*') + num(' 1000') + fg(')') + p(','), indent)}`;
			} else {
				const sectionVar = camelCase(section);
				if (section === 'monthly') {
					c += `
${line(strk('\t\ttime') + pm(':') + fg(` ${fn('Array')}${pm('.')}from(`), indent)}
${line(`\t\t\t${pm('{')} ${strk('length')}${pm(':')} ${sectionVar}${pm('.')}${fn('count')}()`, indent)}`;
				} else {
					c += `
${line(strk('\t\ttime') + pm(':') + fg(` ${fn('Array')}${pm('.')}from(`), indent)}
${line(`\t\t\t${pm('{')} ${strk('length')}${pm(':')} ${fn(`${fg('(')}Number`)}${fg('(')}${vr(sectionVar)}${fn(`${pm('.')}timeEnd`)}${fg('()) ')}${pm('-')}${fn(' Number')}${fg('(')}${vr(sectionVar)}${fn(`${pm('.')}time`)}${fg('())) ')}${pm('/')}${vr(` ${sectionVar}`)}${fn(`${pm('.')}interval`)}${fg('()')} }, `, indent)}`;
				}
				if (section === 'monthly') {
					c += `
${line(`\t\t\t${pm('(')}_ ${pm(',')}${fgi(` i${pm(')')} `)}${kw('=&gt')}${kwsp(' new')}${fn(' Date')}${fg('(')}${fn('Date')}${pm('.')}UTC(monthly${pm('.')}${fn('year')}(), monthly${pm('.')}${fn('month')}() ${pm('-')} ${num('1')} ${pm('+')} ${fgi('i')}${pm(',')} ${num('1')}))`, indent)}`;
				} else {
					c += `
${line(`\t\t\t${pm('(')}_ ${pm(',')}${fgi(` i${pm(')')} `)}${kw('=&gt')}${kwsp(' new')}${fn(' Date')}${fg('((')}${fn('Number')}${fg('(')}${vr(sectionVar)}${fn(`${pm('.')}time`)}${fg('()) ')}${pm('+')}${fg(` i `)}${pm('*')}${vr(` ${sectionVar}`)}${fn(`${pm('.')}interval`)}${fg('() ')}${pm('+')}${fg(' utcOffsetSeconds) ')}${pm('*')}${num(' 1000')}${fg(')')}`, indent)}`;
				}
				c += `
${line(fg('\t\t)') + pm(','), indent)}`;
			}

			// Variable values
			if (sdk_type !== 'ensemble_api' || section === 'monthly' || section === 'weekly') {
				if (sect.constructor === Array) {
					for (const [ind, variable] of sect.entries()) {
						if (INT_64_VARIABLES.includes(variable)) {
							c += `
${line(cmt('\t\t// Map Int64 values to according structure'), indent)}
${line(strk(`\t\t${variable}`) + pm(':') + fg(' [') + pm('...') + fn('Array') + fg('(') + vr(variable) + fn(`${pm('.')}valuesInt64Length`) + fg('())]') + fn(`${pm('.')}map`) + fg('('), indent)}
${line(`\t\t\t${pm('(')}_ ${pm(',')}${fgi(` i${pm(')')} `)}${kw('=&gt;')}${kwsp(' new')}${fn(' Date')}${fg('((')}${fn('Number')}${fg('(')}${vr(variable)}${fn(`${pm('.')}valuesInt64`)}${fg('(i)) ')}${pm('+')}${fg(' utcOffsetSeconds) ')}${pm('*')}${num(' 1000')}${fg(')')}`, indent)}
${line(fg('\t\t)') + pm(','), indent)}`;
						} else {
							c += `
${line(strk(`\t\t${variable}`) + pm(':') + vr(` ${camelCase(section)}`) + fn(`${pm('.')}variables`) + fg('(') + num(`${ind}`) + fg(')') + pm('!') + fn(`${pm('.')}${section === 'current' ? 'value' : 'valuesArray'}`) + fg('()') + p(','), indent)}`;
						}
					}
				} else if (typeof sect === 'string') {
					if (INT_64_VARIABLES.includes(sect)) {
						c += `
${line(cmt('\t\t// Map Int64 values to according structure'), indent)}
${line(strk(`\t\t${sect}`) + kw(':') + fg(' [') + kw('...') + fn('Array') + fg('(') + vr(sect) + fn(`${pm('.')}valuesInt64Length`) + fg('())]') + fn(`${pm('.')}map`) + fg('('), indent)}
${line(`\t\t\t${pm('(')}_ ${pm(',')}${fgi(` i${pm(')')} `)}${kw('=&gt;')}${kwsp(' new')}${fn(' Date')}${fg('((')}${fn('Number')}${fg('(')}${vr(sect)}${fn(`${pm('.')}valuesInt64`)}${fg('(i)) ')}${pm('+')}${fg(' utcOffsetSeconds) ')}${pm('*')}${num(' 1000')}${fg(')')}`, indent)}
${line(fg(`\t\t${pm(')')}`) + pm(','), indent)}`;
					} else {
						c += `
${line(strk(`\t\t${sect}`) + pm(':') + vr(` ${camelCase(section)}`) + pm('.') + fn('variables') + fg('(') + num('0') + fg(')') + pm('!') + fn(`${pm('.')}${section === 'current' ? 'value' : 'valuesArray'}`) + fg('()') + p(','), indent)}`;
					}
				}
			}

			c += `
${line(strk(`\t${br('}')}`) + pm(','), indent)}`;
		}
	}
	c += `
${line(strk(`${br('}')}${pm(';')}`), indent)}`;

	// --- Ensemble member processing ---
	if (sdk_type === 'ensemble_api') {
		c += `
${empty(indent)}
${line(cmt('// Process all members'), indent)}`;

		for (const section of SECTIONS) {
			const sect = params[section];
			if (sect && section !== 'monthly' && section !== 'weekly') {
				if (sect.constructor === Array) {
					for (const variable of sect) {
						c += `
${line(kwspi('for') + fg(' (') + kw('const') + vr(' variable') + kwsp(' of') + vr(` ${camelCase(section + '_' + variable)}) ${pm('{')}`), indent)}
${line(kw('\tconst') + vr(' member') + kw(` ${pm('=')}`) + vr(' variable') + fn(`${pm('?.')}ensembleMember`) + fg(`()${pm(';')}`), indent)}
${line(vr('\tweatherData') + fg(`${pm('.')}${camelCase(section)}[`) + str(`${pm('\\`')}${variable}_member${pm('\\${')}${fg('member')}${pm('}\\`')}`) + fg('] ') + pm('= ') + fg('variable') + pm('!') + fn(`${pm('.')}${INT_64_VARIABLES.includes(variable) ? 'valuesInt64Array' : 'valuesArray'}`) + fg('()') + pm('!') + pm(';'), indent)}
${line(pm('}'), indent)}`;
					}
				} else if (typeof sect === 'string') {
					c += `
${line(kwspi('for') + fg(' (') + kw('const') + vr(' variable') + kwsp(' of') + vr(` ${camelCase(section + '_' + sect)}) ${pm('{')}`), indent)}
${line(kw('\tconst') + vr(' member') + kw(` ${pm('=')}`) + vr(' variable') + fn(`${pm('?.')}ensembleMember`) + fg(`()${pm(';')}`), indent)}
${line(vr('\tweatherData') + fg(`${pm('.')}${camelCase(section)}[`) + str(`${pm('\\`')}${sect}_member${pm('\\${')}${fg('member')}${pm('}\\`')}`) + fg('] ') + pm('= ') + fg('variable') + pm('!') + fn(`${pm('.')}${INT_64_VARIABLES.includes(sect) ? 'valuesInt64Array' : 'valuesArray'}`) + fg('()') + pm('!') + pm(';'), indent)}
${line(pm('}'), indent)}`;
				}
			}
		}
	}

	// --- Console output for weather data ---
	c += `
${empty(indent)}
${line(cmt("// The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information"), indent)}`;

	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			if (section === 'current') {
				c += `
${line(vr('console') + fn(`${pm('.')}log`) + fg('('), indent)}
${line(`\t${str(`${tick}${nlEsc}Current time: ${exprO}${fg(`weatherData${pm('.')}${camelCase(section)}${pm('.')}time`)}${exprC}${fg('\\n')}${tick}`)}${pm(',')}`, indent)}`;
				if (sect.constructor === Array) {
					for (const variable of sect) {
						c += `
${line(`\t${str(`${tick}${nlEsc}Current ${variable}: ${exprO}${fg(`weatherData${pm('.')}${camelCase(section)}${pm('.')}${variable}`)}${exprC}${tick}`)}${pm(',')}`, indent)}`;
					}
				} else if (typeof sect === 'string') {
					c += `
${line(vr('\tweatherData') + fg(`${pm('.')}`) + vr(camelCase(section)) + fg(`${pm('.')}${sect}`) + (INT_64_VARIABLES.includes(sect) ? fn(`${pm('.')}toISOString`) + fg('()') : '') + pm(','), indent)}`;
				}
				c += `
${line(fg(`)${pm(';')}`), indent)}`;
			} else {
				c += `
${line(vr('console') + fn(`${pm('.')}log`) + fg('(') + pm('"') + str(`${fg('\\n')}${titleCase(section)} data:${fg('\\n')}`) + pm('"') + fg(`${pm(',')} `) + fg(`weatherData${pm('.')}${camelCase(section)}`) + fg(')'), indent)}`;
			}
		}
	}

	// --- Closing ---
	c += `
${multipleLocationsOrModels ? line(br('}')) : ''}</code></pre></div>`;
	return c;
};

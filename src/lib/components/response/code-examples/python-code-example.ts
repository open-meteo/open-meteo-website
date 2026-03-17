import { isNumeric, titleCase } from '$lib/utils';

import { INT_64_VARIABLES, SECTIONS, VARIABLE_REGEX } from '$lib/constants';

import {
	acc,
	br,
	cmt,
	empty,
	fg,
	fgi,
	fn,
	it,
	kw,
	kwi,
	line,
	normalizeAggregation,
	num,
	numericArrayTokens,
	p,
	par,
	pm,
	quotedStr,
	str,
	stringArrayTokens
} from './highlight-helpers';

import type { Parameters } from '$lib/docs';

export const pythonCodeExample = (
	params: Parameters,
	multipleLocationsOrModels: boolean,
	numberOfLocations: number | string,
	numberOfModels: number,
	server: string,
	sdk_type: string,
	sdk_cache: number
) => {
	const indent = multipleLocationsOrModels;
	const timezone = params.timezone && params.timezone !== 'GMT';

	/** Build ensemble filter condition for a Python variable using VARIABLE_REGEX */
	const buildFilterCondition = (variable: string): string => {
		const matches = VARIABLE_REGEX.exec(variable);
		if (matches == null || matches.groups == null) {
			return p(`x.`) + fn('Variable') + pm('() ') + kw('==') + p(` Variable.${variable}`);
		}
		const groups = matches.groups;
		const conditions = [
			p(`x.`) + fn('Variable') + pm('() ') + kw('==') + p(` Variable.${groups.variable}`)
		];
		if (groups.altitude) {
			conditions.push(p(`x.`) + fn('Altitude') + pm('() ') + kw('==') + num(` ${groups.altitude}`));
		}
		if (groups.pressure) {
			conditions.push(
				p(`x.`) + fn('PressureLevel') + pm('() ') + kw('==') + num(` ${groups.pressure}`)
			);
		}
		if (groups.depth) {
			conditions.push(p(`x.`) + fn('Depth') + pm('() ') + kw('==') + num(` ${groups.depth}`));
		}
		if (groups.depth_from) {
			conditions.push(p(`x.`) + fn('Depth') + pm('() ') + kw('==') + num(` ${groups.depth_from}`));
			conditions.push(p(`x.`) + fn('DepthTo') + pm('() ') + kw('==') + num(` ${groups.depth_to}`));
		}
		if (groups.aggregation) {
			const agg = normalizeAggregation(groups.aggregation);
			conditions.push(
				p(`x.`) + fn('Aggregation') + pm('() ') + kw('==') + num(`Aggregation${pm('.')}${agg}`)
			);
		}
		return conditions.join(` ${kwi('and')} `);
	};

	// --- Opening: imports ---
	let c =
		`<div class=""><pre class="" style="background-color:var(--code-preview-background);color:var(--code-preview-foreground)" tabindex="0"><code>` +
		line(kwi('import') + fg(' openmeteo_requests'));

	if (sdk_type === 'ensemble_api') {
		c += `
${empty()}
${line(kwi('from') + fg(' openmeteo_sdk.Variable ') + kwi('import') + fg(' Variable'))}
${line(kwi('from') + fg(' openmeteo_sdk.Aggregation ') + kwi('import') + fg(' Aggregation'))}`;
	}

	c += `
${empty()}
${line(kwi('import') + fg(' pandas ') + kwi('as') + fg(' pd'))}
${line(kwi('import') + fg(' requests_cache'))}
${line(kwi('from') + fg(' retry_requests ') + kwi('import') + fg(' retry'))}
${empty()}
${line(cmt('# Setup the Open-Meteo API client with cache and retry on error'))}
${line(fg('cache_session ') + kw('=') + fg(' requests_cache') + pm('.') + fn('CachedSession') + br('(') + str(`${pm("'")}` + '.cache' + `${pm("'")}`) + pm(', ') + `${it('expire_after')} `) + kw('=') + num(` ${sdk_cache}`) + br(')')}
${line(fg('retry_session ') + kw('=') + fn(' retry') + br('(') + fn('cache_session') + ', ') + `${it('retries ')}` + kw('=') + num(' 5') + pm(',') + it(' backoff_factor ') + kw('=') + num(' 0.2') + br(')')}
${line(fg('openmeteo ') + kw('=') + fg(' openmeteo_requests') + pm('.') + fn('Client') + br('(') + `${it('session')} ` + kw('=') + p(` retry_session${br(')')}`))}
${empty()}
${line(cmt('# Make sure all required weather variables are listed here'))}
${line(cmt('# The order of variables in hourly or daily is important to assign them correctly below'))}
${line(fg('url ') + kw('=') + str(`${pm(' "')}${server}${pm('"')}`))}
${line(fg('params ') + kw('=') + pm(' {'))}`;

	// --- Params key-value pairs ---
	for (const [key, param] of Object.entries(params)) {
		if (param.constructor === Array) {
			if (typeof param[0] === 'string' && !isNumeric(param[0])) {
				c += `
${line(str(`\t${pm('"')}${key}${pm('"')}`) + pm(':') + ` ${stringArrayTokens(param as string[])}${pm(',')}`)}`;
			} else {
				c += `
${line(str(`\t${pm('"')}${key}${pm('"')}`) + pm(':') + num(` ${numericArrayTokens(param as (string | number)[])}`) + pm(','))}`;
			}
		} else if (typeof param === 'object') {
			// Skip non-plain-object params
		} else if (typeof param === 'string' && !isNumeric(param)) {
			c += `
${line(str(`\t${pm('"')}${key}${pm('"')}`) + pm(':') + num(` ${quotedStr(param)}`) + pm(','))}`;
		} else {
			c += `
${line(str(`\t${pm('"')}${key}${pm('"')}`) + pm(':') + num(` ${param}`) + pm(','))}`;
		}
	}

	// --- URL and fetch ---
	c += `
${line(pm('}'))}
${line(fg('responses ') + kw('=') + fg(' openmeteo') + pm('.') + fn('weather_api') + br('(') + fn('url') + ', ' + fg(it('params'))) + kw(' = ') + p('params' + br(')'))}
${empty()}`;

	// --- Multiple locations/models loop ---
	if (multipleLocationsOrModels) {
		c += `
${line(cmt('# Process ' + (numberOfLocations ? `${numberOfLocations} locations` : '1 location') + (numberOfModels ? ` and ${numberOfModels} models` : '')))}
${line(kwi('for ') + fg('response ') + kwi('in') + fg(' responses') + pm(':'))}`;
	} else {
		c += `
${line(cmt('# Process first location. Add a for-loop for multiple locations or weather models'))}
${line(fg('response ') + kw('=') + fg(' responses') + pm('[') + num('0') + pm(']'))}`;
	}

	// --- Location attributes (print statements) ---
	c += `
${line(fn('print') + br('(') + acc('f') + pm('"') + str(`${indent ? '\\n' : ''}Coordinates: ` + num('{') + p('response.') + fn('Latitude') + br('()') + num('}') + '°N ' + num('{') + p('response.') + fn('Longitude') + br('()') + num('}') + '°E') + pm('"') + br(')'), indent)}
${line(fn('print') + br('(') + acc('f') + pm('"') + str('Elevation: ' + num('{') + p('response.') + fn('Elevation') + br('()') + num('}') + ' m asl') + pm('"') + br(')'), indent)}`;
	if (params.timezone) {
		c += `
${line(fn('print') + br('(') + acc('f') + pm('"') + str('Timezone: ' + num('{') + p('response.') + fn('Timezone') + br('()') + num('}{') + p('response.') + fn('TimezoneAbbreviation') + br('()') + num('}')) + pm('"') + str('') + br(')'), indent)}`;
	}
	c += `
${line(fn('print') + br('(') + acc('f') + pm('"') + str('Timezone difference to GMT+0: ' + num('{') + p('response.') + fn('UtcOffsetSeconds') + br('()') + num('}') + 's') + pm('"') + br(')'), indent)}`;
	if (numberOfModels) {
		c += `
${line(fn('print') + br('(') + acc('f') + pm('"') + str('Model Nº: ' + num('{') + p('response.') + fn('Model') + br('()') + num('}')) + pm('"') + br(')'), indent)}`;
	}

	// --- Section processing (hourly, daily, etc.) ---
	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			c += `
${empty(indent)}
${line(cmt(`# Process ${section} data. The order of variables needs to be the same as requested.`), indent)}
${line(fg(`${section} `) + kw('=') + fg(' response') + pm('.') + fn(titleCase(section)) + br('()'), indent)}`;

			if (sdk_type === 'ensemble_api' && section !== 'monthly' && section !== 'weekly') {
				// Ensemble: get variables list via map/lambda
				c += `
${line(fg(`${section}_variables `) + kw('=') + num(' list') + pm('(') + fn('map') + pm('(') + acc('lambda') + par(' i') + p(`${section}.`) + fn('Variables') + pm(`(${fg('i')}), `) + fn('range') + pm('(') + num('0') + p(`, ${section}.`) + fn('VariablesLength') + pm('())))'), indent)}`;

				if (sect.constructor === Array) {
					for (const variable of sect) {
						c += `
${line(fg(`${section}_${variable} `) + kw('=') + fn(' filter') + pm('(') + acc('lambda') + par(' x') + p(': ') + buildFilterCondition(variable) + p(`, ${section}_variables)`), indent)}`;
					}
				} else if (typeof sect === 'string') {
					c += `
${line(fg(`${section}_${sect} `) + kw('=') + fn(' filter') + pm('(') + acc('lambda') + par(' x') + p(': x.') + fn('Variable') + pm('() ') + kw('==') + p(' Variable.temperature ') + kwi('and') + p(' x.') + fn('Altitude') + pm('() ') + kw('==') + num(' 2') + p(`, ${section}_variables)`), indent)}\t`;
				}
			} else {
				if (sect.constructor === Array) {
					for (const [ind, variable] of sect.entries()) {
						c += `
${line(fg(`${section}_${variable} `) + kw('=') + fg(` ${section}`) + pm('.') + fn('Variables') + br('(') + num(`${ind}`) + br(').') + fn(`${section === 'current' ? 'Value' : INT_64_VARIABLES.includes(variable) ? 'ValuesInt64AsNumpy' : 'ValuesAsNumpy'}`) + br('()'), indent)}`;
					}
				} else if (typeof sect === 'string') {
					c += `
${line(fg(`${section}_${sect} `) + kw('=') + fg(` ${section}`) + pm('.') + fn('Variables') + br('(') + num('0') + br(').') + fn(`${section === 'current' ? 'Value' : INT_64_VARIABLES.includes(sect) ? 'ValuesInt64AsNumpy' : 'ValuesAsNumpy'}`) + br('()'), indent)}`;
				}
			}

			// --- DataFrame construction (for non-current sections) ---
			if (section !== 'current') {
				const dateRangeStart =
					section === 'monthly'
						? fg(
								`${acc('f')}${pm('"')}${str(`${num('{')}${p(`monthly.`)}${fn('Year')}${br('()')}${num('}')}` + '-' + `${num('{')}${p(`monthly.`)}${fn('Month')}${br('()')}${num('}')}` + `-01${pm('"')}`)}${pm(',')}`
							)
						: `pd.` +
							fn('to_datetime') +
							br(`(${fn(section)}.`) +
							fn('Time') +
							br('()') +
							(timezone
								? fg(` ${pm('+')} response`) + pm('.') + fn(`UtcOffsetSeconds${br('()')}`)
								: '') +
							', ' +
							`${fgi('unit')} ` +
							kw('=') +
							pm(' "') +
							str('s') +
							pm('"') +
							pm(', ' + `${fgi('utc')} `) +
							kw('=') +
							num(' True') +
							br('),');

				const dateRangeEnd =
					section === 'monthly'
						? `${it('periods ')}` + kw('=') + ` ${p(`monthly.`)}${fn('Count')}${br('()')}${pm(',')}`
						: `${it('end ')}` +
							kw('=') +
							p(`  pd`) +
							pm('.') +
							fn('to_datetime') +
							br(`(${fn(section)}.`) +
							fn('TimeEnd') +
							br('()') +
							(timezone
								? fg(` ${pm('+')} response`) + pm('.') + fn(`UtcOffsetSeconds${br('()')}`)
								: '') +
							pm(',') +
							` ${fgi('unit')} ` +
							kw('=') +
							pm(' "') +
							str('s') +
							pm('"') +
							pm(', ' + `${fgi('utc')} `) +
							kw('=') +
							num(' True') +
							br('),');

				const dateRangeFreq =
					section === 'monthly'
						? `${it('freq ')}` + kw('=') + p(` ${pm('"')}${str('MS')}${pm('"')}${pm(',')}`)
						: `${it('freq ')}` +
							kw('=') +
							p(` pd`) +
							pm('.') +
							fn('Timedelta') +
							br(`(${fgi('seconds')} `) +
							kw('=') +
							p(` ${section}`) +
							pm('.') +
							fn('Interval') +
							pm('()') +
							br('),');

				c += `
${empty(indent)}
${line(fg(`${section}_data `) + kw('=') + pm(' {') + pm('"') + str(`date${pm('"')}`) + pm(':') + fg(' pd') + pm('.') + fn('date_range') + br('('), indent)}
${line(fgi('\tstart ') + kw('=') + p(' ') + dateRangeStart, indent)}
${line(fgi(`\t${dateRangeEnd}`), indent)}
${line(fgi(`\t${dateRangeFreq}`), indent)}
${line(fgi('\tinclusive ') + kw('=') + pm(' "') + str('left') + pm('"'), indent)}
${line(br(')}'), indent)}
${empty(indent)}`;
			}

			// --- Populate data dict / print current values ---
			if (section !== 'current') {
				if (sdk_type === 'ensemble_api' && section !== 'monthly' && section !== 'weekly') {
					c += `
${line(cmt(`# Process all ${section} members`), indent)}`;
					if (sect.constructor === Array) {
						for (const variable of sect) {
							c += `
${line(kwi('for') + fg(' variable ') + kwi('in') + fg(` ${section}_${variable}`) + p(':'), indent)}
${line(fg('\tmember ') + kw('=') + fg(' variable') + pm('.') + fn('EnsembleMember') + pm('()'), indent)}
${line(fg(`\t${section}_data`) + p('[') + acc('f') + str(`"${variable}_member` + num('{') + fg('member') + num('}') + '"') + p(']') + kw(' =') + fg(' variable') + p('.') + fn(`${INT_64_VARIABLES.includes(variable) ? 'ValuesInt64AsNumpy' : 'ValuesAsNumpy'}`) + pm('()'), indent)}`;
						}
					} else if (typeof sect === 'string') {
						c += `
${line(kwi('for') + fg(' variable ') + kwi('in') + fg(` ${section}_${sect}`) + p(':'), indent)}
${line(fg('\tmember ') + kw('=') + fg(' variable') + pm('.') + fn('EnsembleMember') + pm('()'), indent)}
${line(fg(`\t${section}_data`) + p('[') + acc('f') + str(`"${sect}_member` + num('{') + fg('member') + num('}') + '"') + p(']') + kw(' =') + fg(' variable') + p('.') + fn(`${INT_64_VARIABLES.includes(sect) ? 'ValuesInt64AsNumpy' : 'ValuesAsNumpy'}`) + pm('()'), indent)}`;
					}
				} else {
					if (sect.constructor === Array) {
						for (const variable of sect) {
							c += `
${line(fg(`${section}_data`) + pm('[') + pm('"') + str(`${variable}"`) + pm(']') + kw(' =') + fg(` ${section}_${variable}`), indent)}`;
						}
					} else {
						c += `
${line(fg(`${section}_data`) + pm('[') + pm('"') + str(`${sect}"`) + pm(']') + kw(' =') + fg(` ${section}_${sect}`), indent)}`;
					}
				}
			}

			if (section === 'current') {
				// Print current values
				c += `
${empty(indent)}
${line(fn('print') + br('(') + acc('f') + pm('"') + str('\\nCurrent time: ' + num('{') + p('current.') + fn('Time') + br('()') + num('}')) + pm('"') + str('') + br(')'), indent)}`;
				if (sect.constructor === Array) {
					for (const variable of sect) {
						c += `
${line(fn('print') + br('(') + acc('f') + pm('"') + str(`Current ${variable}: ` + num('{') + p(`current_${variable}`) + num('}')) + pm('"') + str('') + br(')'), indent)}`;
					}
				} else {
					c += `
${line(fn('print') + br('(') + acc('f') + pm('"') + str(`Current ${sect}: ` + num('{') + p(`current_${sect}`) + num('}')) + pm('"') + str('') + br(')'), indent)}`;
				}
			} else {
				// Print DataFrame
				c += `
${empty(indent)}
${line(fg(`${section}_dataframe `) + kw('=') + fg(' pd') + pm('.') + fn('DataFrame') + br(`(${fgi('data')} `) + kw('=') + p(` ${section}_data${br(')')}`), indent)}
${line(fn('print') + br(`("${str(`\\n${titleCase(section)} data\\n`)}",` + ` ${fn(`${section}_dataframe`)})`), indent)}`;
			}
		}
	}

	c += `
${empty(indent)}</pre></div>
`;
	return c;
};

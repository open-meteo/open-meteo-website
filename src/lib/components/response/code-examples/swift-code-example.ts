import { camelCase, titleCase } from '$lib/utils';

import { INT_64_VARIABLES, SECTIONS } from '$lib/constants';

import {
	acc,
	br,
	cmt,
	empty,
	fg,
	fn,
	kw,
	kwspi,
	line,
	num,
	p,
	pm,
	str,
	vr
} from './highlight-helpers';

import type { Parameters } from '$lib/docs';

export const swiftCodeExample = (
	params: Parameters,
	multipleLocationsOrModels: boolean,
	numberOfLocations: number | string,
	numberOfModels: number,
	previewUrl: string
) => {
	const indent = multipleLocationsOrModels;

	const swiftAttr = (name: string) =>
		line(kw('let') + fg(` ${name} `) + pm('=') + fg(` response${pm('.')}${name}`), indent);

	// --- Opening: import + URL + fetch ---
	let c =
		`<div><pre class="swift" style="background-color:var(--code-preview-background);color:var(--code-preview-foreground)" tabindex="0"><code>` +
		empty() +
		`\n${line(kwspi('import') + num(' OpenMeteoSdk'))}
${empty()}
${line(cmt("/// Make sure the URL contains '&amp;format=flatbuffers'"))}
${line(kw('let') + fg(' url ') + pm('=') + fn(' URL') + p('(') + fn('string') + pm(':') + str(` "${previewUrl + '&format=flatbuffers'}"`) + p(')') + pm('!'))}
${line(kw('let') + fg(' responses ') + pm('=') + kwspi(' try') + kwspi(' await') + fg(` WeatherApiResponse${pm('.')}`) + fn('fetch') + p('(') + fn('url') + pm(':') + fn(' url') + p(')'))}
${empty()}`;

	// --- WeatherData struct definition ---
	c += `
${line(acc('struct') + num(' WeatherData') + fg(' {'))}`;
	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			c += `
${line(kw('\tlet') + fg(` ${camelCase(section)}${pm(':')} ${titleCase(section)}`))}`;
		}
	}
	c += `
${empty()}`;

	// --- Inner struct definitions for each section ---
	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			const isArray = section !== 'current';
			const arrayOpen = isArray
				? '<span style="color:var(--code-preview-token-punctuation-mark">[</span>'
				: '';
			const arrayClose = isArray
				? '<span style="color:var(--code-preview-token-punctuation-mark)">]</span>'
				: '';

			c += `
${line(acc('\tstruct') + num(` ${titleCase(section)}`) + fg(' {'))}
${line(kw('\t\tlet') + fg(`time${pm(':')} ${arrayOpen}Date${arrayClose}`))}`;
			if (sect.constructor === Array) {
				for (const variable of sect) {
					const typeName = INT_64_VARIABLES.includes(variable) ? 'Int64' : 'Float';
					c += `
${line(kw('\t\tlet') + fg(` ${camelCase(variable)}${pm(':')} `) + num(`${arrayOpen}${typeName}${arrayClose}`))}`;
				}
			} else if (typeof sect === 'string') {
				const typeName = INT_64_VARIABLES.includes(sect) ? 'Int64' : 'Float';
				c += `
${line(kw('\t\tlet') + fg(` ${camelCase(sect)}${pm(':')} `) + num(`${arrayOpen}${typeName}${arrayClose}`))}`;
			}
			c += `
${line(fg('\t}'))}`;
		}
	}
	c += `
${line(fg('}'))}
${empty()}`;

	// --- Multiple locations/models loop ---
	if (multipleLocationsOrModels) {
		c += `
${line(cmt('// Process ' + (numberOfLocations ? `${numberOfLocations} locations` : '1 location') + (numberOfModels ? ` and ${numberOfModels} models` : '')))}
${line(kwspi('for') + vr(' response') + kwspi(' in') + fg(` responses ${pm('{')}`))}`;
	} else {
		c += `
${line(cmt('/// Process first location. Add a for-loop for multiple locations or weather models'))}
${line(kw('let') + fg(' response ') + pm('=') + fg(' responses') + pm('[') + num('0') + pm(']'))}
${empty()}`;
	}

	// --- Location attributes ---
	c += `
${line(cmt('/// Attributes for timezone and location'), indent)}
${swiftAttr('latitude')}
${swiftAttr('longitude')}
${swiftAttr('elevation')}`;
	if (params.timezone) {
		c += `
${swiftAttr('timezone')}
${swiftAttr('timezoneAbbreviation')}`;
	}
	c += `
${swiftAttr('utcOffsetSeconds')}
${empty(indent)}`;

	// --- Print location info ---
	c += `
${line(fn('print') + pm('(') + str(pm('"') + fg('\\n') + 'Coordinates: ' + pm('\\(') + fg('latitude') + pm(')') + '°N ' + pm('\\(') + fg('longitude') + pm(')') + '°E' + pm('"')) + pm(')'), indent)}
${line(fn('print') + pm('(') + str(pm('"') + 'Elevation: ' + pm('\\(') + fg('elevation') + pm(')') + 'm asl' + pm('"')) + pm(')'), indent)}`;
	if (params.timezone) {
		c += `
${line(fn('print') + pm('(') + str(pm('"') + 'Timezone: ' + pm('\\(') + fg('timezone') + pm(')') + ' ' + pm('\\(') + fg('timezoneAbbreviation') + pm(')') + pm('"')) + pm(')'), indent)}`;
	}
	c += `
${line(fn('print') + pm('(') + str(pm('"') + 'Timezone difference to GMT+0: ' + pm('\\(') + fg('utcOffsetSeconds') + pm(')') + 's' + pm('"')) + pm(')'), indent)}`;
	if (numberOfModels) {
		c += `
${line(fn('print') + pm('(') + str(pm('"') + 'Model Nº: ' + pm('\\(') + fg(`response${pm('.')}model`) + pm(')') + pm('"')) + pm(')'), indent)}`;
	}
	c += `
${empty(indent)}`;

	// --- Section variable extraction ---
	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			c += `
${line(kw('let') + fg(` ${camelCase(section)} `) + pm('=') + fg(` response${pm('.')}${camelCase(section)}`) + pm('!'), indent)}`;
		}
	}
	c += `
${empty(indent)}
${line(cmt("/// Note: The order of weather variables in the URL query and the 'at' indices below need to match!"), indent)}
${line(kw('let') + fg(' data ') + pm('=') + fn(' WeatherData') + pm('('), indent)}`;

	// --- WeatherData initialization ---
	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			// Section member with .init(
			c += `
${line(fn(`\t${camelCase(section)}`) + pm(':') + pm(' .') + acc('init') + pm('('), indent)}`;

			// Time assignment
			if (section === 'current') {
				c += `
${line(fn('\t\ttime') + pm(':') + fn(' Date') + pm('(') + fn('timeIntervalSince1970') + pm(':') + fn(' TimeInterval') + pm('(') + vr(`current${pm('.')}time `) + pm('+') + num(' Int64') + pm('(') + vr('utcOffsetSeconds') + pm(')))'), indent)}`;
			} else {
				c += `
${line(fn('\t\ttime') + pm(':') + ` ${camelCase(section)}${pm('.')}` + fn('getDateTime') + pm('(') + fn('offset') + pm(':') + vr(' utcOffsetSeconds') + pm(')'), indent)}`;
			}
			c += vr(',');

			// Variable assignments
			if (sect.constructor === Array) {
				for (const [ind, variable] of sect.entries()) {
					const valueAccessor = INT_64_VARIABLES.includes(variable)
						? 'valuesInt64'
						: section === 'current'
							? 'value'
							: 'values';
					c += `
${line(fn(`\t\t${variable}`) + pm(':') + fn(` ${vr(`${camelCase(section)}`)}${pm('.')}variables`) + pm('(') + fn('at') + pm(':') + num(` ${ind}`) + p(')') + pm('!') + pm('.') + vr(valueAccessor) + vr(','), indent)}`;
				}
			} else if (typeof sect === 'string') {
				c += `
${line(fn(`\t\t${sect}`) + pm(':') + fn(' current.variables') + p('(') + fn('at') + pm(':') + num(' 0') + p(')') + pm('!') + fn('.') + num('value'), indent)}`;
			}

			c += `
${line(pm('\t)') + vr(','), indent)}`;
		}
	}

	c += `
${line(pm(')'), indent)}
${empty(indent)}
${line(cmt("/// Timezone '.gmt' is deliberately used."), indent)}
${line(cmt("/// By adding 'utcOffsetSeconds' before, local-time is inferred"), indent)}
${line(kw('let') + fg(' dateFormatter ') + pm('=') + fn(' DateFormatter') + pm('()'), indent)}
${line(fg(`dateFormatter${pm('.')}timeZone `) + pm('=') + fg(' .gmt'), indent)}
${line(fg(`dateFormatter${pm('.')}dateFormat `) + pm('=') + str(` ${pm('"')}yyyy-MM-dd HH:mm${pm('"')}`), indent)}
${empty(indent)}`;

	// --- Print weather data ---
	for (const section of SECTIONS) {
		const sect = params[section];
		if (sect) {
			if (section === 'current') {
				c += `
${line(fn('print') + pm('(') + str(pm('"') + 'Current time: ' + pm('\\(') + fg(`data${pm('.')}current${pm('.')}time`) + pm(')') + pm('"')) + pm(')'), indent)}`;
				if (sect.constructor === Array) {
					for (const variable of sect) {
						c += `
${line(fn('print') + pm('(') + str(pm('"') + `Current ${variable}: ` + pm('\\(') + fg(`data${pm('.')}current${pm('.')}${variable}`) + pm(')') + pm('"')) + pm(')'), indent)}`;
					}
				} else if (typeof sect === 'string') {
					c += `
${line(fn('print') + pm('(') + str(pm('"') + `Current ${sect}: ` + pm('\\(') + fg(`data${pm('.')}current${pm('.')}${sect}`) + pm(')') + pm('"')) + pm(')'), indent)}`;
				}
			} else {
				c += `
${line(kwspi('for') + pm(' (') + vr('i, date') + pm(')') + kwspi(' in') + fg(` data${pm('.')}${camelCase(section)}${pm('.')}time${pm('.')}`) + fn('enumerated') + pm('()') + pm(' {'), indent)}
${line(fn('\tprint') + p('(') + vr(`dateFormatter${pm('.')}${fn('string')}`) + pm('(') + fn('from') + pm(':') + vr(' date') + pm('))'), indent)}`;
				if (sect.constructor === Array) {
					for (const variable of sect) {
						c += `
${line(fn('\tprint') + pm('(') + vr(`data${pm('.')}${camelCase(section)}${pm('.')}${variable}`) + pm('[') + vr('i') + pm('])'), indent)}`;
					}
				} else if (typeof sect === 'string') {
					c += `
${line(fn('\tprint') + pm('(') + vr(`data${pm('.')}${camelCase(section)}${pm('.')}${sect}`) + pm('[') + vr('i') + pm('])'), indent)}`;
				}

				c += `
${line(pm('}'), indent)}`;
			}
		}
	}

	// --- Closing ---
	c += `
${indent ? line(pm('}')) : ''}</code></pre></div>`;
	return c;
};

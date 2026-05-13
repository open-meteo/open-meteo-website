import {
	acc,
	br,
	cmt,
	empty,
	fg,
	fn,
	it,
	kw,
	kwi,
	line,
	num,
	p,
	pm,
	str
} from '$lib/components/response/code-examples/highlight-helpers';

/** f-string interpolation: {expr} */
const fv = (v: string) => num('{') + fg(v) + num('}');

/** f-string interpolation with format spec: {expr:fmt} */
const fvf = (v: string, fmt: string) => num('{') + fg(v) + pm(':') + str(fmt) + num('}');

/** params dict key in f-string: {params['key']} */
const pfv = (key: string) =>
	num('{') + fg('params') + br('[') + pm("'") + str(key) + pm("'") + br(']') + num('}');

/** params dict key as expression: params["key"] */
const pk = (key: string) => fg('params') + br('[') + pm('"') + str(key) + pm('"') + br(']');

export const pythonPreviewCodeExample = (rawParams: {
	domain?: unknown;
	variables?: unknown;
	latitude?: unknown;
	longitude?: unknown;
	run?: unknown;
	timezone?: unknown;
	use_aws_endpoint?: unknown;
	[key: string]: unknown;
}): string => {
	// Coerce from urlHashStore types (e.g. latitude is number[], variables is string[])
	const domain = String(rawParams.domain ?? 'ecmwf_ifs');

	const rawVars = rawParams.variables;
	const variables: string[] = Array.isArray(rawVars)
		? rawVars.map(String)
		: rawVars != null
			? [String(rawVars)]
			: ['temperature_2m'];
	const multiVar = variables.length > 1;

	const rawLats = Array.isArray(rawParams.latitude) ? rawParams.latitude : [rawParams.latitude];
	const rawLons = Array.isArray(rawParams.longitude) ? rawParams.longitude : [rawParams.longitude];
	const lats: number[] = rawLats.map((v) => Number(v ?? 52.52));
	const lons: number[] = rawLons.map((v) => Number(v ?? 13.41));
	const multiLoc = lats.length > 1;

	const runStr = rawParams.run != null ? String(rawParams.run) : null;
	const runValue = runStr ?? '...';
	const runComment =
		runStr != null
			? (() => {
					const ts = parseInt(runStr, 10);
					if (isNaN(ts)) return '';
					const dt = new Date(ts * 1000);
					const yyyy = dt.getUTCFullYear();
					const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
					const dd = String(dt.getUTCDate()).padStart(2, '0');
					const hh = String(dt.getUTCHours()).padStart(2, '0');
					const min = String(dt.getUTCMinutes()).padStart(2, '0');
					return `# ${yyyy}-${mm}-${dd} ${hh}:${min} UTC`;
				})()
			: '';

	const tz = rawParams.timezone;
	const timezone = typeof tz === 'string' && tz !== 'UTC' && tz !== 'GMT' && tz !== 'auto';

	const useAws = rawParams.use_aws_endpoint !== false && rawParams.use_aws_endpoint !== 'false';
	const s3UriPrefix = useAws
		? 's3://openmeteo/data_run/'
		: 'https://s3.open-meteo.com/openmeteo/data_run/';

	// Helper: render a Python list literal of numbers
	const numList = (vals: number[]) =>
		br('[') + vals.map((v) => num(String(v))).join(pm(', ')) + br(']');
	// Helper: render a Python list literal of strings
	const strList = (vals: string[]) =>
		br('[') + vals.map((v) => pm('"') + str(v) + pm('"')).join(pm(', ')) + br(']');

	// Indentation helpers:
	//   varBodyInd = indent level for var-loop body (s3_uri … grid): 1 when multiVar, else 0
	//   locBodyInd = indent level for loc-loop body (coordinate_index … print): varBodyInd + (multiLoc ? 1 : 0)
	const ind = (n: number) => '    '.repeat(n);
	const varBodyInd = multiVar ? 1 : 0;
	const locBodyInd = varBodyInd + (multiLoc ? 1 : 0);

	const s3KwargLine = useAws
		? '\n' +
			line(
				ind(varBodyInd) +
					'    ' +
					it('s3') +
					kw('=') +
					br('{') +
					pm('"') +
					str('anon') +
					pm('"') +
					p(': ') +
					num('True') +
					pm(', ') +
					pm('"') +
					str('default_block_size') +
					pm('"') +
					p(': ') +
					num('65536') +
					br('}') +
					pm(',')
			)
		: '';

	// --- params dict ---
	const latValue = multiLoc ? numList(lats) : num(String(lats[0]));
	const lonValue = multiLoc ? numList(lons) : num(String(lons[0]));
	const varValue = multiVar ? strList(variables) : pm('"') + str(variables[0]) + pm('"');

	// Loop headers (include trailing \n so they don't concatenate with the next line() call)
	const varLoop = multiVar
		? line(kwi('for') + ' ' + fg('variable') + kwi(' in ') + pk('variables') + p(':')) + '\n'
		: '';
	const locLoop = multiLoc
		? line(
				ind(varBodyInd) +
					kwi('for') +
					' ' +
					fg('lat') +
					pm(', ') +
					fg('lon') +
					kwi(' in ') +
					fn('zip') +
					br('(') +
					pk('latitude') +
					pm(', ') +
					pk('longitude') +
					br(')') +
					p(':')
			) + '\n'
		: '';

	// f-string variable reference in s3_uri
	const s3VarRef = multiVar ? fv('variable') : pfv('variables');
	// coordinate lookup args
	const latArg = multiLoc ? fg('lat') : pk('latitude');
	const lonArg = multiLoc ? fg('lon') : pk('longitude');
	// error f-string lat/lon refs
	const errLatRef = multiLoc ? fv('lat') : pfv('latitude');
	const errLonRef = multiLoc ? fv('lon') : pfv('longitude');

	return (
		`<div class=""><pre class="" style="background-color:var(--code-preview-background);color:var(--code-preview-foreground)" tabindex="0"><code>` +
		`${line(kwi('import') + fg(' datetime ') + kwi('as') + fg(' dt'))}
${empty()}
${line(kwi('import') + fg(' fsspec'))}
${line(kwi('import') + fg(' pandas ') + kwi('as') + fg(' pd'))}
${line(kwi('import') + fg(' xarray ') + kwi('as') + fg(' xr'))}
${line(kwi('from') + fg(' omfiles.grids ') + kwi('import') + fg(' OmGrid'))}
${empty()}
${line(fg('params ') + kw('=') + ' ' + br('{'))}
${line('    ' + pm('"') + str('domain') + pm('"') + p(':  ') + pm('"') + str(domain) + pm('"') + pm(','))}
${line('    ' + pm('"') + str('latitude') + pm('"') + p(': ') + latValue + pm(','))}
${line('    ' + pm('"') + str('longitude') + pm('"') + p(': ') + lonValue + pm(','))}
${line('    ' + pm('"') + str('variables') + pm('"') + p(': ') + varValue + pm(','))}
${line('    ' + pm('"') + str('run') + pm('"') + p(': ') + pm('"') + str(runValue) + pm('"') + pm(',') + (runComment ? '  ' + cmt(runComment) : ''))}${timezone ? '\n' + line('    ' + pm('"') + str('timezone') + pm('"') + p(': ') + pm('"') + str(typeof tz === 'string' ? tz : '') + pm('"') + pm(',')) : ''}
${line(br('}'))}
${empty()}
${line(fg('run ') + kw('=') + fg(' dt') + p('.') + fg('datetime') + p('.') + fn('fromtimestamp') + br('(') + fn('int') + br('(') + pk('run') + br(')') + ', ' + fg('tz') + '=' + fg('dt') + p('.') + fg('timezone') + p('.') + fg('utc') + br(')'))}
${varLoop}${line(ind(varBodyInd) + fg('s3_uri ') + kw('=') + ' ' + br('('))}
${line(ind(varBodyInd) + '    ' + acc('f') + pm('"') + str(s3UriPrefix) + pfv('domain') + str('/') + fv('run.year') + str('/') + fvf('run.month', '02') + str('/') + fvf('run.day', '02') + str('/') + fvf('run.hour', '02') + fvf('run.minute', '02') + str('Z/') + s3VarRef + str('.om') + pm('"'))}
${line(ind(varBodyInd) + br(')'))}
${line(ind(varBodyInd) + cmt('# Use blockcache so repeated remote reads do not have to fetch the same bytes again.'))}
${line(ind(varBodyInd) + fg('backend ') + kw('=') + fg(' fsspec') + p('.') + fn('open') + br('('))}
${line(ind(varBodyInd) + '    ' + acc('f') + pm('"') + str('blockcache::') + fv('s3_uri') + pm('"') + pm(','))}
${line(ind(varBodyInd) + '    ' + it('mode') + kw('=') + pm('"') + str('rb') + pm('"') + pm(','))}${s3KwargLine}
${line(ind(varBodyInd) + '    ' + it('blockcache') + kw('=') + br('{'))}
${line(ind(varBodyInd) + '        ' + pm('"') + str('cache_storage') + pm('"') + p(': ') + pm('"') + str('cache') + pm('"') + pm(','))}
${line(ind(varBodyInd) + '        ' + cmt('# Data run files do not change, so checking on every access is unnecessary.'))}
${line(ind(varBodyInd) + '        ' + pm('"') + str('check_files') + pm('"') + p(': ') + num('False') + pm(','))}
${line(ind(varBodyInd) + '    ' + br('}') + pm(','))}
${line(ind(varBodyInd) + br(')'))}
${empty()}
${line(ind(varBodyInd) + fg('ds ') + kw('=') + fg(' xr') + p('.') + fn('open_dataset') + br('(') + fg('backend') + pm(', ') + it('engine') + kw('=') + pm('"') + str('om') + pm('"') + br(')'))}
${line(ind(varBodyInd) + fg('data ') + kw('=') + fg(' ds') + br('[') + pm('"') + pm('"') + br(']'))}
${empty()}
${line(ind(varBodyInd) + kwi('if') + fg(' data') + p('.') + fg('ndim') + kw(' != ') + num('3') + p(':'))}
${line(ind(varBodyInd) + '    ' + kwi('raise') + ' ' + fn('ValueError') + br('(') + acc('f') + pm('"') + str('Expected a 3D variable with shape (lat, lon, time), got ') + fv('data.shape') + pm('"') + br(')'))}
${empty()}
${line(ind(varBodyInd) + cmt('# Reconstruct the latitude/longitude grid from the projection metadata.'))}
${line(ind(varBodyInd) + fg('grid ') + kw('=') + ' ' + fn('OmGrid') + br('(') + fg('ds') + p('.') + fg('attrs') + br('[') + pm('"') + str('crs_wkt') + pm('"') + br(']') + pm(', ') + fg('data') + p('.') + fg('shape') + br('[') + p(':') + num('2') + br(']') + br(')'))}
${locLoop}${line(ind(locBodyInd) + fg('coordinate_index ') + kw('=') + fg(' grid') + p('.') + fn('find_point_xy') + br('(') + latArg + pm(', ') + lonArg + br(')'))}
${line(ind(locBodyInd) + kwi('if') + ' ' + br('(') + fg('coordinate_index') + kw(' is ') + num('None') + br(')') + p(':'))}
${line(ind(locBodyInd) + '    ' + kwi('raise') + ' ' + fn('ValueError') + br('(') + acc('f') + pm('"') + str('Coordinates ') + errLatRef + str('\u00b0N ') + errLonRef + str('\u00b0E are outside the grid domain.') + pm('"') + br(')'))}
${line(ind(locBodyInd) + fg('x') + pm(', ') + fg('y ') + kw('=') + fg(' coordinate_index'))}
${empty()}
${line(ind(locBodyInd) + cmt('# The data array is indexed as (lat, lon, time), so we need to swap x and y.'))}
${line(ind(locBodyInd) + fg('series ') + kw('=') + fg(' data') + br('[') + fg('y') + pm(', ') + fg('x') + pm(', ') + p(':') + br(']'))}
${empty()}
${line(ind(locBodyInd) + fg('hourly_data ') + kw('=') + ' ' + br('{'))}
${line(ind(locBodyInd) + '    ' + pm('"') + str('date') + pm('"') + p(': ') + fg('pd') + p('.') + fn('to_datetime') + br('(') + fg('ds') + br('[') + pm('"') + str('time') + pm('"') + br(']') + p('.') + fg('values') + pm(', ') + it('unit') + kw('=') + pm('"') + str('s') + pm('"') + pm(', ') + it('utc') + kw('=') + num('True') + br(')') + (timezone ? pm('.') + fn('tz_convert') + br('(') + pm('"') + tz + pm('"') + br(')') : '') + pm(','))}
${line(ind(locBodyInd) + '    ' + (multiVar ? fg('variable') : pk('variables')) + p(': ') + fg('series') + p('.') + fn('to_pandas') + br('(') + br(')') + p('.') + fg('values') + pm(','))}
${line(ind(locBodyInd) + br('}'))}
${empty()}
${line(ind(locBodyInd) + fg('df ') + kw('=') + fg(' pd') + p('.') + fn('DataFrame') + br('(') + it('data') + kw(' = ') + fg('hourly_data') + br(')'))}
${line(ind(locBodyInd) + fn('print') + br('(') + (multiLoc ? acc('f') + pm('"') + str('\\nLocation ') + fv('lat') + str(', ') + fv('lon') + (multiVar ? str(' — ') + fv('variable') : '') + str('\\n') + pm('"') : pm('"') + str('\\nHourly data\\n') + pm('"')) + pm(', ') + fg('df') + br(')'))}
</code></pre></div>`
	);
};

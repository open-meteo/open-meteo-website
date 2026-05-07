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
	[key: string]: unknown;
}): string => {
	// Coerce from urlHashStore types (e.g. latitude is number[], variables is string[])
	const domain = String(rawParams.domain ?? 'ecmwf_ifs');
	const rawVars = rawParams.variables;
	const variable = String(
		Array.isArray(rawVars) ? (rawVars[0] ?? 'temperature_2m') : (rawVars ?? 'temperature_2m')
	);
	const latitude = Array.isArray(rawParams.latitude)
		? (rawParams.latitude[0] ?? 52.52)
		: Number(rawParams.latitude ?? 52.52);
	const longitude = Array.isArray(rawParams.longitude)
		? (rawParams.longitude[0] ?? 13.41)
		: Number(rawParams.longitude ?? 13.41);
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
	const timezone = typeof tz === 'string' && tz !== 'UTC' && tz !== 'GMT';

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
${line('    ' + pm('"') + str('latitude') + pm('"') + p(': ') + num(String(latitude)) + pm(','))}
${line('    ' + pm('"') + str('longitude') + pm('"') + p(': ') + num(String(longitude)) + pm(','))}
${line('    ' + pm('"') + str('variables') + pm('"') + p(': ') + pm('"') + str(variable) + pm('"') + pm(','))}
${line('    ' + pm('"') + str('run') + pm('"') + p(': ') + pm('"') + str(runValue) + pm('"') + pm(',') + (runComment ? '  ' + cmt(runComment) : ''))}${timezone ? line('\n    ' + pm('"') + str('timezone') + pm('"') + p(': ') + pm('"') + str(typeof tz === 'string' ? tz : '') + pm('"') + pm(',')) : ''}
${line(br('}'))}
${empty()}
${line(fg('run ') + kw('=') + fg(' dt') + p('.') + fg('datetime') + p('.') + fn('fromtimestamp') + br('(') + fn('int') + br('(') + pk('run') + br(')') + ', ' + fg('tz') + '=' + fg('dt') + p('.') + fg('timezone') + p('.') + fg('utc') + br(')'))}
${line(fg('s3_uri ') + kw('=') + ' ' + br('('))}
${line('    ' + acc('f') + pm('"') + str('s3://openmeteo/data_run/') + pfv('domain') + str('/') + fv('run.year') + str('/') + fvf('run.month', '02') + str('/') + fvf('run.day', '02') + str('/') + fvf('run.hour', '02') + fvf('run.minute', '02') + str('Z/') + pfv('variables') + str('.om') + pm('"'))}
${line(br(')'))}
${line(fn('print') + br('(') + acc('f') + pm('"') + str('Using OM file: ') + fv('s3_uri') + pm('"') + br(')'))}
${empty()}
${line(cmt('# Use blockcache so repeated remote reads do not have to fetch the same bytes again.'))}
${line(fg('backend ') + kw('=') + fg(' fsspec') + p('.') + fn('open') + br('('))}
${line('    ' + acc('f') + pm('"') + str('blockcache::') + fv('s3_uri') + pm('"') + pm(','))}
${line('    ' + it('mode') + kw('=') + pm('"') + str('rb') + pm('"') + pm(','))}
${line('    ' + it('s3') + kw('=') + br('{') + pm('"') + str('anon') + pm('"') + p(': ') + num('True') + pm(', ') + pm('"') + str('default_block_size') + pm('"') + p(': ') + num('65536') + br('}') + pm(','))}
${line('    ' + it('blockcache') + kw('=') + br('{'))}
${line('        ' + pm('"') + str('cache_storage') + pm('"') + p(': ') + pm('"') + str('cache') + pm('"') + pm(','))}
${line('        ' + cmt('# Data run files do not change, so checking on every access is unnecessary.'))}
${line('        ' + pm('"') + str('check_files') + pm('"') + p(': ') + num('False') + pm(','))}
${line('    ' + br('}') + pm(','))}
${line(br(')'))}
${empty()}
	${line(fg('ds ') + kw('=') + fg(' xr') + p('.') + fn('open_dataset') + br('(') + fg('backend') + pm(', ') + it('engine') + kw('=') + pm('"') + str('om') + pm('"') + br(')'))}
	${line(cmt('# print(ds.data_vars)'))}
${line(cmt('# print(ds.attrs)'))}
${empty()}
${line(cmt('# In data_run the variable is encoded in the file_name.'))}
${line(cmt('# The variable itself is not named.'))}
${line(fg('data ') + kw('=') + fg(' ds') + br('[') + pm('"') + pm('"') + br(']'))}
${empty()}
${line(kwi('if') + fg(' data') + p('.') + fg('ndim') + kw(' != ') + num('3') + p(':'))}
${line('    ' + kwi('raise') + ' ' + fn('ValueError') + br('(') + acc('f') + pm('"') + str('Expected a 3D variable with shape (lat, lon, time), got ') + fv('data.shape') + pm('"') + br(')'))}
${empty()}
${line(cmt('# Reconstruct the latitude/longitude grid from the projection metadata.'))}
${line(fg('grid ') + kw('=') + ' ' + fn('OmGrid') + br('(') + fg('ds') + p('.') + fg('attrs') + br('[') + pm('"') + str('crs_wkt') + pm('"') + br(']') + pm(', ') + fg('data') + p('.') + fg('shape') + br('[') + p(':') + num('2') + br(']') + br(')'))}
${line(fg('coordinate_index ') + kw('=') + fg(' grid') + p('.') + fn('find_point_xy') + br('(') + pk('latitude') + pm(', ') + pk('longitude') + br(')'))}
${line(kwi('if') + ' ' + br('(') + fg('coordinate_index') + kw(' is ') + num('None') + br(')') + p(':'))}
${line('    ' + kwi('raise') + ' ' + fn('ValueError') + br('(') + acc('f') + pm('"') + str('Target coordinates ') + pfv('latitude') + str('\u00b0N ') + pfv('longitude') + str('\u00b0E are outside the grid domain.') + pm('"') + br(')'))}
${line(fg('x') + pm(', ') + fg('y ') + kw('=') + fg(' coordinate_index'))}
${empty()}
${line(cmt('# The data array is indexed as (lat, lon, time), so we need to swap x and y.'))}
${line(fg('series ') + kw('=') + fg(' data') + br('[') + fg('y') + pm(', ') + fg('x') + pm(', ') + p(':') + br(']'))}
${empty()}
${line(fg('hourly_data ') + kw('=') + ' ' + br('{'))}
${line('    ' + pm('"') + str('date') + pm('"') + p(': ') + fg('pd') + p('.') + fn('to_datetime') + br('(') + fg('ds') + br('[') + pm('"') + str('time') + pm('"') + br(']') + p('.') + fg('values') + pm(', ') + it('unit') + kw('=') + pm('"') + str('s') + pm('"') + pm(', ') + it('utc') + kw('=') + num('True') + br(')') + pm(','))}
${line('    ' + pk('variables') + p(': ') + fg('series') + p('.') + fn('to_pandas') + br('(') + br(')') + p('.') + fg('values') + pm(','))}
${line(br('}'))}
${empty()}
${line(fg('df ') + kw('=') + fg(' pd') + p('.') + fn('DataFrame') + br('(') + it('data') + kw(' = ') + fg('hourly_data') + br(')'))}
${line(fn('print') + br('(') + pm('"') + str('\\nHourly data\\n') + pm('"') + pm(', ') + fg('df') + br(')'))}
</code></pre></div>`
	);
};

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

/** Interpolated f-string variable: {varName} */
const fv = (v: string) => num('{') + fg(v) + num('}');

/** Interpolated f-string variable with format spec: {varName:fmt} */
const fvf = (v: string, fmt: string) => num('{') + fg(v) + pm(':') + str(fmt) + num('}');

export const pythonPreviewCodeExample = (
	domain: string,
	variable: string,
	latitude: number,
	longitude: number
): string =>
	`<div class=""><pre class="" style="background-color:var(--code-preview-background);color:var(--code-preview-foreground)" tabindex="0"><code>` +
	line(str('"""Plot forecast time series for a 3x3 neighbourhood of grid cells."""')) +
	`
${empty()}
${line(kwi('import') + fg(' datetime ') + kwi('as') + fg(' dt'))}
${empty()}
${line(kwi('import') + fg(' fsspec'))}
${line(kwi('import') + fg(' matplotlib.dates ') + kwi('as') + fg(' mdates'))}
${line(kwi('import') + fg(' matplotlib.pyplot ') + kwi('as') + fg(' plt'))}
${line(kwi('import') + fg(' numpy ') + kwi('as') + fg(' np'))}
${line(kwi('import') + fg(' xarray ') + kwi('as') + fg(' xr'))}
${line(kwi('from') + fg(' omfiles.grids ') + kwi('import') + fg(' OmGrid'))}
${empty()}
${line(fg('MODEL_DOMAIN ') + kw('=') + ' ' + pm('"') + str(domain) + pm('"'))}
${line(fg('VARIABLE ') + kw('=') + ' ' + pm('"') + str(variable) + pm('"'))}
${line(fg('TARGET_LAT ') + kw('=') + num(' ' + String(latitude)))}
${line(fg('TARGET_LON ') + kw('=') + num(' ' + String(longitude)))}
${line(fg('GRID_RADIUS ') + kw('=') + num(' 1') + '  ' + cmt('# 1 cell in each direction -> 3x3 neighbourhood'))}
${line(fg('OUTPUT_PATH ') + kw('=') + ' ' + pm('"') + str('xarray_data_run_timeseries.png') + pm('"'))}
${empty()}
${line(cmt('# Example URI for a data_run file in the `data_run` S3 bucket.'))}
${line(cmt('# See data organization details: https://github.com/open-meteo/open-data?tab=readme-ov-file#data-organization'))}
${line(cmt('# Note: data_run is retained ~ 3 months. The script uses one file within this period.'))}
${line(fg('run_time ') + kw('=') + fg(' dt') + p('.') + fn('datetime') + p('.') + fn('now') + br('(') + fg('dt') + p('.') + fg('timezone') + p('.') + fg('utc') + br(')') + kw(' - ') + fg('dt') + p('.') + fn('timedelta') + br('(') + it('days') + kw('=') + num('2') + br(')'))}
${line(fg('s3_uri ') + kw('=') + ' ' + br('('))}
${line('    ' + acc('f') + pm('"') + str('s3://openmeteo/data_run/') + fv('MODEL_DOMAIN') + str('/') + fv('run_time.year') + str('/') + fvf('run_time.month', '02') + str('/') + fvf('run_time.day', '02') + str('/0000Z/') + fv('VARIABLE') + str('.om') + pm('"'))}
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
${line(fg('ds ') + kw('=') + fg(' xr') + p('.') + fn('open_dataset') + br('(') + fg('backend') + pm(', ') + it('engine') + kw('=') + pm('"') + str('om') + pm('"') + br(')') + '  ' + cmt('# type: ignore'))}
${line(fn('print') + br('(') + fg('ds') + p('.') + fg('data_vars') + br(')'))}
${line(fn('print') + br('(') + fg('ds') + p('.') + fg('attrs') + br(')'))}
${empty()}
${line(cmt('# time is a coordinate stored in the data_run files as unix timestamp'))}
${line(fn('print') + br('(') + fg('ds') + br('[') + pm('"') + str('time') + pm('"') + br(']') + br(')'))}
${empty()}
${line(cmt('# In data_run the variable is encoded in the file_name.'))}
${line(cmt('# The variable itself is not named.'))}
${line(fg('variable_name ') + kw('=') + ' ' + pm('"') + pm('"'))}
${line(fg('data ') + kw('=') + fg(' ds') + br('[') + fg('variable_name') + br(']'))}
${empty()}
${line(kwi('if') + fg(' data') + p('.') + fg('ndim') + kw(' != ') + num('3') + p(':'))}
${line('    ' + kwi('raise') + ' ' + fn('ValueError') + br('(') + acc('f') + pm('"') + str('Expected a 3D variable with shape (lat, lon, time), got ') + fv('data.shape') + pm('"') + br(')'))}
${empty()}
${line(cmt('# Reconstruct the latitude/longitude grid from the projection metadata.'))}
${line(fg('grid ') + kw('=') + ' ' + fn('OmGrid') + br('(') + fg('ds') + p('.') + fg('attrs') + br('[') + pm('"') + str('crs_wkt') + pm('"') + br(']') + pm(', ') + fg('data') + p('.') + fg('shape') + br('[') + p(':') + num('2') + br(']') + br(')'))}
${line(fg('lon2d') + pm(', ') + fg('lat2d ') + kw('=') + fg(' grid') + p('.') + fn('get_meshgrid') + br('()'))}
${empty()}
${line(cmt('# Find the nearest grid cell to the chosen target location and use the'))}
${line(cmt('# surrounding 3x3 neighbourhood for plotting.'))}
${line(fg('distance2 ') + kw('=') + ' ' + br('(') + fg('lat2d ') + kw('-') + fg(' TARGET_LAT') + br(')') + kw(' ** ') + num('2') + kw(' + ') + br('(') + fg('lon2d ') + kw('-') + fg(' TARGET_LON') + br(')') + kw(' ** ') + num('2'))}
${line(fg('center_y') + pm(', ') + fg('center_x ') + kw('=') + fg(' np') + p('.') + fn('unravel_index') + br('(') + fg('np') + p('.') + fn('argmin') + br('(') + fg('distance2') + br(')') + pm(', ') + fg('distance2') + p('.') + fg('shape') + br(')') + br(')'))}
${empty()}
${line(kwi('if') + ' ' + br('('))}
${line('    ' + fg('center_y ') + kw('-') + fg(' GRID_RADIUS ') + kw('&lt; ') + num('0'))}
${line('    ' + kwi('or') + fg(' center_y ') + kw('+') + fg(' GRID_RADIUS ') + kw('&gt;= ') + fg('data') + p('.') + fg('shape') + br('[') + num('0') + br(']'))}
${line('    ' + kwi('or') + fg(' center_x ') + kw('-') + fg(' GRID_RADIUS ') + kw('&lt; ') + num('0'))}
${line('    ' + kwi('or') + fg(' center_x ') + kw('+') + fg(' GRID_RADIUS ') + kw('&gt;= ') + fg('data') + p('.') + fg('shape') + br('[') + num('1') + br(']'))}
${line(br(')') + p(':'))}
${line('    ' + kwi('raise') + ' ' + fn('ValueError') + br('(') + pm('"') + str('Target location is too close to the domain boundary for a 3x3 neighbourhood') + pm('"') + br(')'))}
${empty()}
${line(cmt('# Forecast coordinates may be stored as Unix timestamps. Convert numeric values'))}
${line(cmt('# to UTC datetimes so matplotlib renders readable date labels.'))}
${line(fg('forecast_dim ') + kw('=') + fg(' data') + p('.') + fg('dims') + br('[') + num('2') + br(']'))}
${line(fg('forecast_coord ') + kw('=') + fg(' data') + p('.') + fg('coords') + br('[') + fg('forecast_dim') + br(']'))}
${empty()}
${line(fg('raw_forecast_times ') + kw('=') + fg(' np') + p('.') + fn('asarray') + br('(') + fg('forecast_coord') + p('.') + fg('values') + br(')'))}
${line(fg('forecast_times ') + kw('=') + fg(' raw_forecast_times') + p('.') + fn('astype') + br('(') + pm('"') + str('datetime64[s]') + pm('"') + br(')'))}
${line(fg('x_label ') + kw('=') + ' ' + pm('"') + str('Forecast time (UTC)') + pm('"'))}
${empty()}
${line(fg('fig') + pm(', ') + fg('axes ') + kw('=') + fg(' plt') + p('.') + fn('subplots') + br('(') + num('3') + pm(', ') + num('3') + pm(', ') + it('figsize') + kw('=') + br('(') + num('14') + pm(', ') + num('10') + br(')') + pm(', ') + it('sharex') + kw('=') + num('True') + pm(', ') + it('sharey') + kw('=') + num('True') + br(')'))}
${line(fg('axes ') + kw('=') + fg(' np') + p('.') + fn('asarray') + br('(') + fg('axes') + br(')'))}
${empty()}
${line(cmt('# Plot one time series for each cell in the 3x3 neighbourhood around the target point.'))}
${line(kwi('for') + fg(' row_offset') + pm(', ') + fg('y_index ') + kwi('in') + ' ' + fn('enumerate') + br('(') + fn('range') + br('(') + fg('center_y ') + kw('-') + fg(' GRID_RADIUS') + pm(', ') + fg('center_y ') + kw('+') + fg(' GRID_RADIUS ') + kw('+') + num(' 1') + br(')') + br(')') + p(':'))}
${line('    ' + kwi('for') + fg(' col_offset') + pm(', ') + fg('x_index ') + kwi('in') + ' ' + fn('enumerate') + br('(') + fn('range') + br('(') + fg('center_x ') + kw('-') + fg(' GRID_RADIUS') + pm(', ') + fg('center_x ') + kw('+') + fg(' GRID_RADIUS ') + kw('+') + num(' 1') + br(')') + br(')') + p(':'))}
${line('        ' + fg('ax ') + kw('=') + fg(' axes') + br('[') + fg('row_offset') + pm(', ') + fg('col_offset') + br(']'))}
${line('        ' + fg('series ') + kw('=') + fg(' data') + p('.') + fn('isel') + br('(') + br('{') + fg('data') + p('.') + fg('dims') + br('[') + num('0') + br(']') + p(': ') + fg('y_index') + pm(', ') + fg('data') + p('.') + fg('dims') + br('[') + num('1') + br(']') + p(': ') + fg('x_index') + br('}') + br(')') + p('.') + fg('values'))}
${line('        ' + fg('cell_lat ') + kw('=') + fg(' lat2d') + br('[') + fg('y_index') + pm(', ') + fg('x_index') + br(']'))}
${line('        ' + fg('cell_lon ') + kw('=') + fg(' lon2d') + br('[') + fg('y_index') + pm(', ') + fg('x_index') + br(']'))}
${empty()}
${line('        ' + fg('ax') + p('.') + fn('plot') + br('(') + fg('forecast_times') + pm(', ') + fg('series') + pm(', ') + it('linewidth') + kw('=') + num('1.8') + br(')'))}
${line('        ' + fg('ax') + p('.') + fn('grid') + br('(') + num('True') + pm(', ') + it('alpha') + kw('=') + num('0.3') + br(')'))}
${line('        ' + fg('ax') + p('.') + fn('set_title') + br('(') + acc('f') + pm('"') + str('lat=') + fvf('cell_lat', '.3f') + str(', lon=') + fvf('cell_lon', '.3f') + pm('"') + pm(', ') + it('fontsize') + kw('=') + num('10') + br(')'))}
${empty()}
${line('        ' + kwi('if') + fg(' np') + p('.') + fn('issubdtype') + br('(') + fg('np') + p('.') + fn('asarray') + br('(') + fg('forecast_times') + br(')') + p('.') + fg('dtype') + pm(', ') + fg('np') + p('.') + fg('datetime64') + br(')') + p(':'))}
${line('            ' + fg('ax') + p('.') + fg('xaxis') + p('.') + fn('set_major_locator') + br('(') + fg('mdates') + p('.') + fn('AutoDateLocator') + br('(') + it('maxticks') + kw('=') + num('8') + br(')') + br(')'))}
${line('            ' + fg('ax') + p('.') + fg('xaxis') + p('.') + fn('set_major_formatter') + br('(') + fg('mdates') + p('.') + fn('DateFormatter') + br('(') + pm('"') + str('%Y-%m-%d\\n%H:%M') + pm('"') + br(')') + br(')'))}
${empty()}
${line('        ' + kwi('if') + fg(' row_offset ') + kw('==') + num(' 2') + p(':'))}
${line('            ' + fg('ax') + p('.') + fn('set_xlabel') + br('(') + fg('x_label') + br(')'))}
${line('        ' + kwi('if') + fg(' col_offset ') + kw('==') + num(' 0') + p(':'))}
${line('            ' + fg('ax') + p('.') + fn('set_ylabel') + br('(') + fg('variable_name') + br(')'))}
${empty()}
${line(fg('fig') + p('.') + fn('suptitle') + br('('))}
${line('    ' + acc('f') + pm('"') + fv('MODEL_DOMAIN') + str(' ') + fv('variable_name') + str(' time series for a 3x3 grid neighbourhood\\n') + pm('"'))}
${line('    ' + acc('f') + pm('"') + str('centered near lat=') + fv('TARGET_LAT') + str(', lon=') + fv('TARGET_LON') + pm('"') + pm(','))}
${line('    ' + it('fontsize') + kw('=') + num('13') + pm(','))}
${line('    ' + it('fontweight') + kw('=') + pm('"') + str('bold') + pm('"') + pm(','))}
${line(br(')'))}
${line(fg('fig') + p('.') + fn('autofmt_xdate') + br('()'))}
${line(fg('plt') + p('.') + fn('tight_layout') + br('()'))}
${line(fg('plt') + p('.') + fn('savefig') + br('(') + fg('OUTPUT_PATH') + pm(', ') + it('dpi') + kw('=') + num('300') + pm(', ') + it('bbox_inches') + kw('=') + pm('"') + str('tight') + pm('"') + br(')'))}
${line(fn('print') + br('(') + acc('f') + pm('"') + str('Saved plot to ') + fv('OUTPUT_PATH') + pm('"') + br(')'))}
</code></pre></div>`;

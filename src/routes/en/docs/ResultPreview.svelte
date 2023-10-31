<script lang="ts">
	import { api_key_preferences } from '$lib/stores';
	import type { Writable } from 'svelte/store';
	import HighchartContainer from '$lib/Elements/HighchartContainer.svelte';
	import { onMount } from 'svelte';
	import { InfoCircle, SkipEnd } from 'svelte-bootstrap-icons';
	import { ExclamationTriangle } from 'svelte-bootstrap-icons';
	import { ArrowClockwise } from 'svelte-bootstrap-icons';
	import { fade } from 'svelte/transition';

	export let params: Writable<any>;
	export let type: String = 'forecast';
	export let action: String = 'forecast';
	export let sdk_type: String = 'weather_api';
	export let sdk_cache: Number = 3600;
	export let defaultParameter: any;
	export let useStockChart = false;

	// Only considers keys of the first object. Ignores nulls and empty strings
	function objectDifference<T extends Record<string, any>>(a: T, b: T): Partial<T> {
		const diff: Partial<T> = {};
		for (const key in a) {
			if (a[key] && a[key] != '' && a[key] !== b[key]) {
				diff[key] = a[key];
			}
		}
		return diff;
	}

	/// `temperature_2m` to `Temperature2m`
	const titleCase = (s: string) =>
  		s.replace (/^[-_]*(.)/, (_, c) => c.toUpperCase())
   		.replace (/[-_]+(.)/g, (_, c) =>  c.toUpperCase())

	/// Parsed params that resolved CSV fields
	$: parsedParams = ((p: any, api_key_preferences: any) => {
		const params = { ...p };
		if ('time_mode' in params) {
			if (params.time_mode == 'forecast_days') {
				delete params['start_date'];
				delete params['end_date'];
			}
			if (params.time_mode == 'time_interval') {
				delete params['forecast_days'];
				delete params['past_days'];
			}
			delete params['csv_time_intervals'];
			delete params['time_mode'];
		}
		if ('location_mode' in params) {
			if (params.location_mode == 'csv_coordinates' && params['csv_coordinates']) {
				let lats: number[] = [];
				let lons: number[] = [];
				let elevation: number[] = [];
				let timezone: string[] = [];
				let start_date: string[] = [];
				let end_date: string[] = [];
				let csv: string = params['csv_coordinates'];
				csv.split(/\r?\n/).forEach((row) => {
					if (row.length < 4) {
						return;
					}
					let parts = row.split(/[;,\t]/);
					if (parts.length < 2) {
						return;
					}
					lats.push(parseFloat(parts[0]));
					lons.push(parseFloat(parts[1]));
					if (parts.length > 2 && parts[2].length > 0) {
						elevation.push(parseFloat(parts[2]));
					}
					if (parts.length > 3 && parts[3].length > 0) {
						timezone.push(parts[3]);
					}
					if (parts.length > 5 && parts[4].length > 0 && parts[5].length > 0) {
						start_date.push(parts[4]);
						end_date.push(parts[4]);
					}
				});
				params['latitude'] = lats;
				params['longitude'] = lons;
				if (elevation.length > 0) {
					params['elevation'] = elevation;
				}
				if (timezone.length > 0) {
					params['timezone'] = timezone;
				}
				if (start_date.length > 0) {
					params['start_date'] = start_date;
					params['end_date'] = end_date;
					delete params['forecast_days'];
					delete params['past_days'];
				}
			}
			delete params['location_mode'];
			delete params['csv_coordinates'];
		}
		// Cast 1-element arrays to a scalar value
		for (const key in params) {
			if (Array.isArray(params[key]) && params[key].length == 1) {
				params[key] = params[key][0];
			}
		}

		if (api_key_preferences.use == 'commercial') {
			params['apikey'] = api_key_preferences.apikey
		}

		return objectDifference(params, defaultParameter);
	})($params, $api_key_preferences);

	$: server = ((api_key_preferences: any) => {
		let serverPrefix = type == 'forecast' ? 'api' : `${type}-api`;
		switch (api_key_preferences.use) {
			case 'commercial':
				return `https://customer-${serverPrefix}.open-meteo.com/v1/${action}`;
			case 'self_hosted':
				return `${api_key_preferences.self_host_server}/v1/${action}`;
			default:
				return `https://${serverPrefix}.open-meteo.com/v1/${action}`;
		}
	})($api_key_preferences)

	function getUrl(server: string, params: any) {
		return `${server}?${new URLSearchParams({ ...params, ...params })}`.replaceAll('%2C', ',');
	}

	$: previewUrl = getUrl(server, parsedParams);
	$: xlsxUrl = getUrl(server, { ...parsedParams, format: 'xlsx' });
	$: csvUrl = getUrl(server, { ...parsedParams, format: 'csv' });

	/// Adjusted call weight
	$: callWeight = ((params) => {
		function membersPerModel(model: string): number {
			switch (model) {
				case "icon_seamless": return 40
				case "icon_global": return 40
				case "icon_eu": return 40
				case "icon_d2": return 20
				case "gfs_seamless": return 31
				case "gfs025": return 31
				case "gfs025": return 31
				case "ecmwf_ifs04": return 51
				case "gem_global": return 21
			}
			return 1
		}
		let nDays = 1
		if (params.time_mode == 'forecast_days') {
			const forecast_days = params['forecast_days'] ?? 7
			const past_days = params['past_days'] ?? 0
			nDays = Number(forecast_days) + Number(past_days)
		}
		if (params.time_mode == 'time_interval') {
			const start = new Date(params['start_date']).getTime()
			const end = new Date(params['end_date']).getTime()
			nDays = (end - start) / 1000 / 86400
		}
		/// Number or models (including number of ensemble members)
		const nModels = sdk_type == 'ensemble_api' ? (params.models ?? []).reduce(
			(previous: number, model: string) => { return previous + (membersPerModel(model) ?? 1) }
			,0) : (params.models ?? []).length
		
		/// Number of weather variables for hourly, daily, current or minutely_15
		const nVariables = params['hourly']?.length ?? 0 + params['daily']?.length ?? 0 + params['current']?.length ?? 0 + params['minutely_15']?.length ?? 0

		/// Number of locations
		const nLocations = params['lat']?.length ?? 1.0

		/// Calculate adjusted weight
		const nVariablesModels = nVariables * Math.max(nModels, 1.0)
		const timeWeight = nDays / 14.0
        const variablesWeight = nVariablesModels / 10.0
		const variableTimeWeight = Math.max(variablesWeight, timeWeight * variablesWeight)
		return Math.max(1.0, variableTimeWeight) * nLocations
	})($params)

	function jsonToChart(data: any, downloadTime: number) {
		//console.log(data);
		let yAxis: any = [];
		const codes = {
			0: 'fair',
			1: 'mainly clear',
			2: 'partly cloudy',
			3: 'overcast',
			45: 'fog',
			48: 'depositing rime fog',
			51: 'light drizzle',
			53: 'moderate drizzle',
			55: 'dense drizzle',
			56: 'light freezing drizzle',
			57: 'dense freezing drizzle',
			61: 'slight rain',
			63: 'moderate rain',
			65: 'heavy rain',
			66: 'light freezing rain',
			67: 'heavy freezing rain',
			71: 'slight snow fall',
			73: 'moderate snow fall',
			75: 'heavy snow fall',
			77: 'snow grains',
			80: 'slight rain showers',
			81: 'moderate rain showers',
			82: 'heavy rain showers',
			85: 'slight snow showers',
			86: 'heavy snow showers',
			95: 'slight to moderate thunderstorm',
			96: 'thunderstorm with slight hail',
			99: 'thunderstorm with heavy hail'
		};

		let series: any = [];
		['hourly', 'six_hourly', 'three_hourly', 'daily', 'minutely_15'].forEach(
			function (section, index) {
				if (!(section in data)) {
					return;
				}
				Object.entries(data[section] || []).forEach(function (k) {
					if (k[0] == 'time' || k[0] == 'sunrise' || k[0] == 'sunset') {
						return;
					}
					let hourly_starttime = (data[section].time[0] + data.utc_offset_seconds) * 1000;
					let pointInterval = (data[section].time[1] - data[section].time[0]) * 1000;
					let unit = data[`${section}_units`][k[0]];
					let axisId = null;
					for (let i = 0; i < yAxis.length; i++) {
						if (yAxis[i].title.text == unit) {
							axisId = i;
						}
					}
					if (axisId == null) {
						yAxis.push({ title: { text: unit } });
						axisId = yAxis.length - 1;
					}
					let ser = {
						name: k[0],
						data: k[1],
						yAxis: axisId,
						pointStart: hourly_starttime,
						pointInterval: pointInterval,
						type:
							unit == 'mm' || unit == 'cm' || unit == 'inch' || unit == 'MJ/m²' ? 'column' : 'line',
						tooltip: {
							valueSuffix: ' ' + unit
						},
						dataGrouping: { groupPixelWidth: 12 }
						/*dataGrouping: {
                    enabled: true,
                    forced: true,
                    units: [['year',[1]]]
                }*/
					};

					if (k[0] == 'weather_code') {
						// @ts-ignore
						ser.tooltip.pointFormatter = function () {
							// @ts-ignore
							let condition = codes[this.y];
							// @ts-ignore
							return (
								'<span style="color:' +
								/* @ts-ignore */
								this.series.color +
								'">\u25CF</span> ' +
								/* @ts-ignore */
								this.series.name +
								': <b>' +
								condition +
								'</b> (' +
								/* @ts-ignore */
								this.y +
								' wmo)<br/>'
							);
						};
					}

					series.push(ser);
				});
			}
		);

		let plotBands: any = [];
		if ('daily' in data && 'sunrise' in data.daily && 'sunset' in data.daily) {
			let rise = data.daily.sunrise;
			let set = data.daily.sunset;
			// @ts-ignore
			let plotBands = rise.map(function (r, i) {
				return {
					color: 'rgb(255, 255, 194)',
					from: (r + data.utc_offset_seconds) * 1000,
					to: (set[i] + data.utc_offset_seconds) * 1000
				};
			});
		}

		let latitude = data.latitude.toFixed(2);
		let longitude = data.longitude.toFixed(2);
		let title = `${latitude}°N ${longitude}°E`;

		if ('elevation' in data) {
			let elevation = data.elevation.toFixed(0);
			title = `${title} ${elevation}m above sea level`;
		}
		let generationtime_ms = data.generationtime_ms.toFixed(2);

		let utc_offset_sign = data.utc_offset_seconds < 0 ? '' : '+';

		let json = {
			title: {
				text: title
			},

			subtitle: {
				text: `Generated in ${generationtime_ms}ms, downloaded in ${downloadTime.toFixed(
					0
				)}ms, time in GMT${utc_offset_sign}${data.utc_offset_seconds / 3600}`
			},

			chart: {
				zoomType: 'x',
				zooming: {
					mouseWheel: {
						enabled: false
					}
				}
			},

			yAxis: yAxis,

			xAxis: {
				type: 'datetime',
				plotLines: [
					{
						value: Date.now() + data.utc_offset_seconds * 1000,
						color: 'red',
						width: 2
					}
				],
				plotBands: plotBands
			},

			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle'
			},

			plotOptions: {
				series: {
					label: {
						connectorAllowed: false
					}
				}
			},

			series: series,

			responsive: {
				rules: [
					{
						condition: {
							maxWidth: 800
						},
						chartOptions: {
							legend: {
								layout: 'horizontal',
								align: 'center',
								verticalAlign: 'bottom'
							}
						}
					}
				]
			},
			tooltip: {
				shared: series.length <= 5,
				animation: false
			}
		};
		//console.log(json);
		return json;
	}

	let results: Promise<any> = Promise.resolve(null);

	function reset() {
		results = Promise.resolve(null);
	}

	params.subscribe(reset);
	api_key_preferences.subscribe(reset);

	async function preview() {
		if ('latitude' in parsedParams && parsedParams.latitude.length > 5) {
			throw new Error('Can not preview more than 5 locations');
		}

		// Always set format=json to fetch data
		const fetchUrl = getUrl(server, {
			...parsedParams,
			format: 'json',
			timeformat: 'unixtime'
		});
		const t0 = performance.now();
		const result = await fetch(fetchUrl);

		if (!result.ok) {
			throw new Error(await result.text());
		}
		const json = await result.json();
		let tEnd = performance.now() - t0;
		if (Array.isArray(json)) {
			return json.map((x) => jsonToChart(x, tEnd));
		}

		return [jsonToChart(json, tEnd)];
	}

	function formatPrismVariableSelector(variable: string) {
		const regex = /(?<variable>[a-z_]+)_(((?<altitude>[0-9]+)m)|((?<pressure>[0-9]+)hPa)|((?<depth>[0-9]+)cm)|((?<depth_from>[0-9]+)_to_(?<depth_to>[0-9]+)cm))_?(?<aggregation>max|min|mean|p[0-9]{2}|dominant)?/;
        const matches = regex.exec(variable)
		if (matches == null || matches.groups == null) {
			return `x<span class="token punctuation">.</span>Variable<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> Variable<span class="token punctuation">.</span>${variable}`
		}
		const groups = matches.groups
		console.log(groups)
		let results = [`x<span class="token punctuation">.</span>Variable<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> Variable<span class="token punctuation">.</span>${groups.variable}`]
		if (groups.altitude) {
			results.push(`x<span class="token punctuation">.</span>Altitude<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">${groups.altitude}</span>`)
		}
		if (groups.depth) {
			results.push(`x<span class="token punctuation">.</span>Depth<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">${groups.depth}</span>`)
		}
		if (groups.depth_from) {
			results.push(`x<span class="token punctuation">.</span>Depth<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">${groups.depth_from}</span>`)
			results.push(`x<span class="token punctuation">.</span>DepthTo<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">${groups.depth_to}</span>`)
		}
		if (groups.aggregation) {
			let aggregation = groups.aggregation
			if (aggregation == 'max') {
				aggregation = "maximum"
			}
			if (aggregation == 'min') {
				aggregation = "minimum"
			}
			results.push(`x<span class="token punctuation">.</span>Aggregation<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> Aggregation<span class="token punctuation">.</span><span class="token number">${aggregation}</span>`)
		}
		return results.join(` <span class="token keyword">and</span> `)
	}

	function reload() {
		results = preview();
	}

	onMount(() => {
		reload();
	});

	/// Convert a given variable to syntax highlighted prism JS HTML
	function formatPrism(v: any): String {
		if (Array.isArray(v)) {
			const e = v.map(formatPrism).join(`<span class="token punctuation">,</span> `)
			return `<span class="token punctuation">[</span>${e}<span class="token punctuation">]</span>`
		}
		if (typeof v == "object") {
			const e = Object.entries(v).map(([k,v]) => `\n\t<span class="token string">"${k}"</span><span class="token punctuation">:</span> ${formatPrism(v)}`).join(`<span class="token punctuation">,</span>`)
			return `<span class="token punctuation">&lbrace;</span>${e}\n<span class="token punctuation">&rbrace;</span>`
		}
		if (!isNaN(v)) {
			return `<span class="token number">${v}</span>`
		}
		return `<span class="token string">"${v}"</span>`
	}

	let mode = 'chart';
</script>

<h2 id="api-response">API Response</h2>

<div class="row py-3 px-0">
	<div>
		<ul class="nav nav-underline" role="tablist">
			<li class="nav-item" role="presentation">
				<span class="nav-link disabled" aria-disabled="true">Preview:</span>
			</li>
			<li class="nav-item" role="presentation">
				<button
					class="nav-link"
					class:active={mode == 'chart'}
					id="pills-chart-tab"
					type="button"
					role="tab"
					aria-controls="pills-chart"
					aria-selected="true"
					on:click={() => (mode = 'chart')}>Chart And URL</button
				>
			</li>
			<li class="nav-item" role="presentation">
				<button
					class="nav-link"
					class:active={mode == 'python'}
					id="pills-python-tab"
					type="button"
					role="tab"
					aria-controls="pills-python"
					on:click={() => (mode = 'python')}
					aria-selected="true">Python</button
				>
			</li>
		</ul>
	</div>

	<div class="tab-content py-3">
		{#if mode == 'chart'}
			<div
				class="tab-pane active"
				in:fade
				id="pills-chart"
				role="tabpanel"
				aria-labelledby="pills-chart-tab"
				tabindex="0"
			>
				<div id="container w-100">
					{#await results}
						<div
							class="d-flex justify-content-center align-items-center bg-secondary-subtle rounded-3"
							style={useStockChart ? 'height: 500px' : 'height: 400px'}
						>
							<div class="spinner-border" role="status">
								<span class="visually-hidden">Loading...</span>
							</div>
						</div>
					{:then results}
						{#if results}
							{#each results.slice(0, 10) as chart}
								<HighchartContainer
									options={chart}
									{useStockChart}
									style={useStockChart ? 'height: 500px' : 'height: 400px'}
								/>
							{/each}
						{:else}
							<div
								class="d-flex justify-content-center align-items-center bg-secondary-subtle rounded-3"
								style={useStockChart ? 'height: 500px' : 'height: 400px'}
							>
								<div class="alert alert-primary d-flex align-items-center" role="alert">
									<InfoCircle class="me-2" />
									<div>
										Parameters have changed.
										<button type="submit" class="btn btn-primary ms-2" on:click={reload}
											><ArrowClockwise class="me-2" />Reload Chart
										</button>
									</div>
								</div>
							</div>
						{/if}
					{:catch error}
						<div
							class="d-flex justify-content-center align-items-center bg-secondary-subtle rounded-3"
							style={useStockChart ? 'height: 500px' : 'height: 400px'}
						>
							<div class="alert alert-danger d-flex align-items-center" role="alert">
								<ExclamationTriangle class="me-2" />
								<div>{error.message}</div>
								<button type="submit" class="btn btn-danger ms-2" on:click={reload}
									><ArrowClockwise class="me-2" />Reload Chart
								</button>
							</div>
						</div>
					{/await}
				</div>
				<div class="col-12">
					<a href={xlsxUrl} class="btn btn-outline-primary">Download XLSX</a>
					<a href={csvUrl} class="btn btn-outline-primary">Download CSV</a>
				</div>

				<div class="col-12 my-4">
					<label for="api_url" class="form-label">API URL</label>
					<small class="text-muted"
						>(<a id="api_url_link" target="_blank" href={previewUrl}>Open in new tab</a> or copy this
						URL into your application)</small
					>.
					{#if callWeight > 1}<p>Note: API call is equivalent to <strong>{callWeight.toFixed(1)}</strong> calls because of factors like long time intervals, the number of locations, variables, or models involved.</p>{/if} 
					<input type="text" class="form-control" id="api_url" readonly bind:value={previewUrl} />
				</div>
			</div>
		{/if}
		{#if mode == 'python'}
			<div
				class="tab-pane active"
				in:fade
				id="pills-python"
				role="tabpanel"
				aria-labelledby="pills-python-tab"
				tabindex="0"
			>
				<div class="row">
					<p>
						The preview code applies all parameters from above automatically, includes a cache and conversion to Pandas DataFrames. Use of DataFrames is of course optional.
					</p>
					<p>
						More information and examples are available in the <a href="https://pypi.org/project/openmeteo-requests/">Python API client</a> documentation.
					</p>
					<div class="alert alert-warning" role="alert">The Python API client is not yet declared stable. There could be breaking changes!</div>
					<pre class="dark rounded-3 py-2"><code ><span class="token comment"># pip install openmeteo-requests</span>
<span class="token comment"># pip install requests-cache retry-requests numpy pandas</span>

<span class="token keyword">import</span> openmeteo_requests
{#if sdk_type == 'ensemble_api'}
<span class="token keyword">from</span> openmeteo_sdk.Variable <span class="token keyword">import</span> Variable
<span class="token keyword">from</span> openmeteo_sdk.Aggregation <span class="token keyword">import</span> Aggregation
{/if}
<span class="token keyword">import</span> requests_cache
<span class="token keyword">import</span> pandas <span class="token keyword">as</span> pd
<span class="token keyword">from</span> retry_requests <span class="token keyword">import</span> retry

<span class="token comment"># Setup the Open-Meteo API client with cache and retry on error</span>
cache_session <span class="token operator">=</span> requests_cache<span class="token punctuation">.</span>CachedSession<span class="token punctuation">(</span><span class="token string">'.cache'</span><span class="token punctuation">,</span> expire_after <span class="token operator">=</span> <span class="token number">{sdk_cache}</span><span class="token punctuation">)</span>
retry_session <span class="token operator">=</span> retry<span class="token punctuation">(</span>cache_session<span class="token punctuation">,</span> retries <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">,</span> backoff_factor <span class="token operator">=</span> <span class="token number">0.2</span><span class="token punctuation">)</span>
openmeteo <span class="token operator">=</span> openmeteo_requests<span class="token punctuation">.</span>Client<span class="token punctuation">(</span>session <span class="token operator">=</span> retry_session<span class="token punctuation">)</span>

<span class="token comment"># Make sure all required weather variables are listed here</span>
<span class="token comment"># The order of variables in hourly or daily is important to assign them correctly below</span>
url <span class="token operator">=</span> <span class="token string">"{server}"</span>
params <span class="token operator">=</span> {@html formatPrism(parsedParams)}
responses <span class="token operator">=</span> openmeteo<span class="token punctuation">.</span>weather_api<span class="token punctuation">(</span>url<span class="token punctuation">,</span> params<span class="token operator">=</span>params<span class="token punctuation">)</span>

<span class="token comment"># Process first location. Add a for-loop for multiple locations or weather models</span>
response <span class="token operator">=</span> responses<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Coordinates </span><span class="token interpolation"><span class="token punctuation">&lbrace;</span>response<span class="token punctuation">.</span>Latitude<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">&rbrace;</span></span><span class="token string">°E </span><span class="token interpolation"><span class="token punctuation">&lbrace;</span>response<span class="token punctuation">.</span>Longitude<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">&rbrace;</span></span><span class="token string">°N"</span></span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Elevation </span><span class="token interpolation"><span class="token punctuation">&lbrace;</span>response<span class="token punctuation">.</span>Elevation<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">&rbrace;</span></span><span class="token string"> m asl"</span></span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Timezone </span><span class="token interpolation"><span class="token punctuation">&lbrace;</span>response<span class="token punctuation">.</span>Timezone<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">&rbrace;</span></span><span class="token string"> </span><span class="token interpolation"><span class="token punctuation">&lbrace;</span>response<span class="token punctuation">.</span>TimezoneAbbreviation<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">&rbrace;</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Timezone difference to GMT+0 </span><span class="token interpolation"><span class="token punctuation">&lbrace;</span>response<span class="token punctuation">.</span>UtcOffsetSeconds<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">&rbrace;</span></span><span class="token string"> s"</span></span><span class="token punctuation">)</span>
{#if 'current' in $params && $params.current.length > 0}
{`\n`}<span class="token comment"># Current values. The order of variables needs to be the same as requested.</span>
current <span class="token operator">=</span> response<span class="token punctuation">.</span>Current<span class="token punctuation">(</span><span class="token punctuation">)</span>
{#each $params['current'] as variable, index }
current_{variable} <span class="token operator">=</span> current<span class="token punctuation">.</span>Variables<span class="token punctuation">(</span><span class="token number">{index}</span><span class="token punctuation">)</span><span class="token punctuation">.</span>Value<span class="token punctuation">(</span><span class="token punctuation">)</span>{'\n'}
{/each}
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Current time </span><span class="token interpolation"><span class="token punctuation">&lbrace;</span>current<span class="token punctuation">.</span>Time<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">&rbrace;</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>
{#each $params.current as current}
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Current {current} </span><span class="token interpolation"><span class="token punctuation">&lbrace;</span>current_{current}<span class="token punctuation">&rbrace;</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>
{/each}{/if}
{#each ['minutely_15', 'hourly', 'daily', 'six_hourly'] as section}
{#if section in $params && $params[section].length > 0}
{#if sdk_type == 'ensemble_api'}
<span class="token comment"># Process {section} data</span>
{section} <span class="token operator">=</span> response<span class="token punctuation">.</span>{titleCase(section)}<span class="token punctuation">(</span><span class="token punctuation">)</span>
{section}_variables <span class="token operator">=</span> <span class="token builtin">list</span><span class="token punctuation">(</span><span class="token builtin">map</span><span class="token punctuation">(</span><span class="token keyword">lambda</span> i<span class="token punctuation">:</span> {section}<span class="token punctuation">.</span>Series<span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> {section}<span class="token punctuation">.</span>SeriesLength<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
{#each $params[section] as variable }
{section}_{variable} <span class="token operator">=</span> <span class="token builtin">filter</span><span class="token punctuation">(</span><span class="token keyword">lambda</span> x<span class="token punctuation">:</span> {@html formatPrismVariableSelector(variable)}<span class="token punctuation">,</span> {section}_variables<span class="token punctuation">)</span>{'\n'}
{/each}
{:else}
<span class="token comment"># Process {section} data. The order of variables needs to be the same as requested.</span>
{section} <span class="token operator">=</span> response<span class="token punctuation">.</span>{titleCase(section)}<span class="token punctuation">(</span><span class="token punctuation">)</span>
{#each $params[section] as variable, index}
{section}_{variable} <span class="token operator">=</span> {section}<span class="token punctuation">.</span>Variables<span class="token punctuation">(</span><span class="token number">{index}</span><span class="token punctuation"></span><span class="token punctuation">)</span><span class="token punctuation">.</span>ValuesAsNumpy<span class="token punctuation">(</span><span class="token punctuation">)</span>{'\n'}
{/each}
{/if}
{section}_data <span class="token operator">=</span> <span class="token punctuation">&lbrace;</span><span class="token string">"date"</span><span class="token punctuation">:</span> pd<span class="token punctuation">.</span>date_range<span class="token punctuation">(</span>
{'\t'}start <span class="token operator">=</span> pd<span class="token punctuation">.</span>to_datetime<span class="token punctuation">(</span>{section}<span class="token punctuation">.</span>Time<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> unit <span class="token operator">=</span> <span class="token string">"s"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
{'\t'}end <span class="token operator">=</span> pd<span class="token punctuation">.</span>to_datetime<span class="token punctuation">(</span>{section}<span class="token punctuation">.</span>TimeEnd<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> unit <span class="token operator">=</span> <span class="token string">"s"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
{'\t'}freq <span class="token operator">=</span> pd<span class="token punctuation">.</span>Timedelta<span class="token punctuation">(</span>seconds <span class="token operator">=</span> {section}<span class="token punctuation">.</span>Interval<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
{'\t'}inclusive <span class="token operator">=</span> <span class="token string">"left"</span>
<span class="token punctuation">)</span><span class="token punctuation">&rbrace;</span>
{#if sdk_type == 'ensemble_api'}
<span class="token comment"># Process all members</span>
{#each $params[section] as variable}

<span class="token keyword">for</span> variable <span class="token keyword">in</span> {section}_{variable}<span class="token punctuation">:</span>
{'\t'}member <span class="token operator">=</span> variable<span class="token punctuation">.</span>EnsembleMember<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation"></span>
{'\t'}{section}_data<span class="token punctuation">[</span><span class="token string-interpolation"><span class="token string">f"{variable}_member</span><span class="token interpolation"><span class="token punctuation">&lbrace;</span>member<span class="token punctuation">&rbrace;</span></span><span class="token string">"</span></span><span class="token punctuation">]</span> <span class="token operator">=</span> variable<span class="token punctuation">.</span>ValuesAsNumpy<span class="token punctuation">(</span><span class="token punctuation">)</span>{'\n'}
{/each}
{:else}
{#each $params[section] as hourly}
{section}_data<span class="token punctuation">[</span><span class="token string-interpolation"><span class="token string">"{hourly}"</span></span><span class="token punctuation">]</span> <span class="token operator">=</span> {section}_{hourly}{'\n'}
{/each}
{/if}
{section}_dataframe <span class="token operator">=</span> pd<span class="token punctuation">.</span>DataFrame<span class="token punctuation">(</span>data <span class="token operator">=</span> {section}_data<span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>{section}_dataframe<span class="token punctuation">)</span>
{`\n`}
{/if}
{/each}
</code></pre>
				</div>
			</div>
		{/if}
	</div>
</div>

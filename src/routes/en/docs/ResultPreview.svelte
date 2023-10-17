<script lang="ts">
	import { api_key_preferences } from '$lib/stores';
	import type { Writable } from 'svelte/store';
	import HighchartContainer from '$lib/Elements/HighchartContainer.svelte';
	import { onMount } from 'svelte';
	import { InfoCircle } from 'svelte-bootstrap-icons';
	import { ExclamationTriangle } from 'svelte-bootstrap-icons';
	import { ArrowClockwise } from 'svelte-bootstrap-icons';
	import { fade } from 'svelte/transition';

	export let params: Writable<any>;
	export let type: String = 'forecast';
	export let action: String = 'forecast';
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
	$: parsedParams = ((p: any) => {
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
		return objectDifference(params, defaultParameter);
	})($params);

	function getUrl(api_key_preferences: any, params: any) {
		let serverPrefix = type == 'forecast' ? 'api' : `${type}-api`;
		let server: string;
		let actionParams = {};
		switch (api_key_preferences.use) {
			case 'python':
				server = `https://customer-${serverPrefix}.open-meteo.com/v1/${action}?`;
				actionParams = { apikey: api_key_preferences.apikey };
				break;
			case 'self_hosted':
				server = `${api_key_preferences.self_host_server}/v1/${action}?`;
				break;
			default:
				server = `https://${serverPrefix}.open-meteo.com/v1/${action}?`;
		}
		return `${server}${new URLSearchParams({ ...params, ...actionParams })}`.replaceAll('%2C', ',');
	}

	$: previewUrl = getUrl($api_key_preferences, parsedParams);
	$: xlsxUrl = getUrl($api_key_preferences, { ...parsedParams, format: 'xlsx' });
	$: csvUrl = getUrl($api_key_preferences, { ...parsedParams, format: 'csv' });

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

					if (k[0] == 'weathercode') {
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
		const fetchUrl = getUrl($api_key_preferences, {
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

	function reload() {
		results = preview();
	}

	onMount(() => {
		reload();
	});

	let mode = 'chart';
</script>

<h2>Preview and API URL</h2>

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
					>
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
						The following Python code automatically applies all the selected parameters above and
						generates a dummy Python code to access data. More information and examples are available
						in the <a href="https://pypi.org/project/openmeteo-requests/">Python client</a> documentation.
					</p>
					<pre><code>
# pip install openmeteo-requests
# pip install requests-cache retry-requests

import openmeteo_requests
import requests_cache
from retry_requests import retry
import pandas as pd

# Setup the Open-Meteo API client with cache and retry mechanisms
cache_session = requests_cache.CachedSession('.cache', expire_after=-1)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
om = openmeteo_requests.Client(session=retry_session)

params = {JSON.stringify(parsedParams, null, 2)}

results = om.weather_api("https://api.open-meteo.com/v1/forecast", params=params)
result = results[0]

print(f"Coordinates &lbrace;result.Latitude()&rbrace;°E &lbrace;result.Longitude()&rbrace;°N &lbrace;result.Elevation()&rbrace; m asl")
print(f"Timezone &lbrace;result.Timezone()&rbrace; &lbrace;result.TimezoneAbbreviation()&rbrace; Offset=&lbrace;result.UtcOffsetSeconds()&rbrace;s")
print(f"Current temperature is &lbrace;result.Current().Temperature2m().Value()&rbrace; °C")

hourly = result.Hourly()
time = hourly.Time()

date = pd.date_range(
    start=pd.to_datetime(time.Start(), unit="s"),
    end=pd.to_datetime(time.End(), unit="s"),
    freq=pd.Timedelta(seconds=time.Interval()),
    inclusive="left"
)
hourly_df = pd.DataFrame(
    data = &lbrace;
        "date": date,
{#each $params.hourly as hourly}{'        '}"{hourly}": hourly.{titleCase(hourly)}().ValuesAsNumpy(),{'\n'}{/each}{'    '}&rbrace;
)
print(hourly_df)
</code></pre>
				</div>
			</div>
		{/if}
	</div>
</div>

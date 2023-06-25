<script lang="ts">
	import { api_key_preferences } from '$lib/stores';
	import type { Writable } from 'svelte/store';
	import HighchartContainer from '$lib/HighchartContainer.svelte';
	import { onMount } from 'svelte';

	export let params: Writable<any>;
	export let type: String | undefined;
	export let defaultParameter: any;

	// Only considers keys of the first object
	function objectDifference<T extends Record<string, any>>(a: T, b: T): Partial<T> {
		const diff: Partial<T> = {};
		for (const key in a) {
			if (a[key] !== b[key]) {
				diff[key] = a[key];
			}
		}
		return diff;
	}

	let action = `https://api.open-meteo.com/v1/forecast?`;
	let actionParams = {};
	$: switch ($api_key_preferences.use) {
		case 'commercial':
			action = `https://customer-api.open-meteo.com/v1/search?`;
			actionParams = { apikey: $api_key_preferences.apikey };
			break;
		case 'self_hosted':
			action = `${$api_key_preferences.self_host_server}/v1/forecast?`;
			break;
		default:
			action = 'https://api.open-meteo.com/v1/forecast?';
	}
	$: nonDefaultParameter = objectDifference({ ...$params, ...actionParams }, defaultParameter);
	$: previewUrl = `${action}${new URLSearchParams(nonDefaultParameter)}`;
	$: xlsxUrl = `${action}${new URLSearchParams({ ...nonDefaultParameter, format: 'xlsx' })}`;
	$: csvUrl = `${action}${new URLSearchParams({ ...nonDefaultParameter, format: 'csv' })}`;

	/*let debounceTimeout: number | undefined;

	onDestroy(() => {
		clearInterval(debounceTimeout);
	});*/

	onMount(() => {
		results = preview()
	})

	function jsonToChart(data, downloadTime) {
		//console.log(data);
		let yAxis = [];
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

		let series = [];
		['hourly', 'six_hourly', 'three_hourly', 'daily', 'minutely_15'].forEach(function (
			section,
			index
		) {
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
					ser.tooltip.pointFormatter = function () {
						let condition = codes[this.y];
						return (
							'<span style="color:' +
							this.series.color +
							'">\u25CF</span> ' +
							this.series.name +
							': <b>' +
							condition +
							'</b> (' +
							this.y +
							' wmo)<br/>'
						);
					};
				}

				series.push(ser);
			});
		});

		let plotBands = [];
		if ('daily' in data && 'sunrise' in data.daily && 'sunset' in data.daily) {
			let rise = data.daily.sunrise;
			let set = data.daily.sunset;
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
			//boost: {
			//useGPUTranslations: true,
			// Chart-level boost when there are more than 5 series in the chart
			//seriesThreshold: 1
			//},

			title: {
				text: title
			},

			subtitle: {
				text: `Generated in ${generationtime_ms}ms, downloaded in ${downloadTime.toFixed(
					0
				)}ms, time in GMT${utc_offset_sign}${data.utc_offset_seconds / 3600}`
			},

			chart: {
				zoomType: 'x'
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

	// Fetch is automatically called after `params` changes due to reactive assignment
	$: results = (async (): Promise<any> => {
		if (nonDefaultParameter) {
			return null;
		}
		return null;
	})();

	async function preview() {
		/*if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		await new Promise((resolve) => {
			debounceTimeout = setTimeout(resolve, 300);
		});*/

		// Always set format=json to fetch data
		const fetchUrl = `${action}${new URLSearchParams({
			...nonDefaultParameter,
			format: 'json',
			timeformat: 'unixtime'
		})}`;
		const t0 = performance.now();
		const result = await fetch(fetchUrl);

		if (!result.ok) {
			throw new Error(await result.text());
		}

		return jsonToChart(await result.json(), performance.now() - t0);
	}
</script>

<div class="col-12 my-4">
	<h2>Preview and API URL</h2>

	<div id="container" style="height: 400px; width: 100%">
		{#await results}
			<div class="h-100 d-flex justify-content-center align-items-center">
				<div class="spinner-border" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		{:then results}
			{#if results}
				<HighchartContainer options={results} />
			{:else}
				<div class="h-100 d-flex justify-content-center align-items-center bg-light">
					<div class="text-center">
						<p><span class="lead">Parameters have changed</span></p>
						<p>
							<button type="submit" class="btn btn-primary" on:click={() => (results = preview())}
								>Reload Chart</button
							>
						</p>
					</div>
				</div>
			{/if}
		{:catch error}
			<div class="alert alert-danger" role="alert">
				{error.message}
			</div>
		{/await}
	</div>
</div>
<div class="col-12">
	<a href={xlsxUrl} class="btn btn-outline-primary">Download XLSX</a>
	<a href={csvUrl} class="btn btn-outline-primary">Download CSV</a>
</div>

<div class="col-12 my-4">
	<label for="api_url" class="form-label">API URL</label>
	<small class="text-muted"
		>(<a id="api_url_link" target="_blank" href={previewUrl}>Open in new tab</a> or copy this URL into
		your application)</small
	>
	<input type="text" class="form-control" id="api_url" readonly bind:value={previewUrl} />
</div>

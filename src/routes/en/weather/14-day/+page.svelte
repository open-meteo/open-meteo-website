<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	import { mode } from 'mode-watcher';

	import { dev } from '$app/environment';

	import { storedLocation } from '$lib/stores/settings';
	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';

	import LocationSearch from '$lib/components/location/location-search.svelte';
	import Settings from '$lib/components/settings/settings.svelte';

	import { hourly, models } from '../../docs/options';
	import '../compare/highcharts.css';
	import { defaultParameters } from './options';

	let useStockChart = false;
	let options: any;

	let node: HTMLElement;
	let chart: any;
	let Highcharts = $state(null);

	let showLegend = $state(false);
	let averageOnly = $state(false);

	const location = get(storedLocation);

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['temperature_2m'],
		models: ['gfs_seamless']
	});

	let count = $state(0);
	onMount(async () => {
		/// Highcharts needs to be loaded in `onMount` to work with prerendered SSG
		Highcharts = (await import('highcharts')).default;
		const more = (await import('highcharts/highcharts-more')).default;
		// more(Highcharts);

		if (dev) {
			// const HighchartsDebugger = await import('highcharts/modules/debugger');
			// HighchartsDebugger.default(Highcharts);
			const Debugger = (await import('highcharts/es-modules/Extensions/Debugger/Debugger.js'))
				.default;
			const ErrorMessages = (
				await import('highcharts/es-modules/Extensions/Debugger/ErrorMessages.js')
			).default;
			Highcharts.errorMessages = ErrorMessages;
			Debugger.compose(Highcharts.Chart);
		}
	});

	$effect(async () => {
		count = 0;
		if (Highcharts) {
			node.replaceChildren([]);

			const dataDaily = await fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&timeformat=unixtime&daily=sunset,sunrise&forecast_days=14`
			);
			const wd = await dataDaily.json();

			const dataReq = await fetch(
				`https://ensemble-api.open-meteo.com/v1/ensemble?latitude=${location.latitude}&longitude=${location.longitude}&hourly=${$params.hourly.join(',')}&models=${$params.models.join(',')}&timeformat=unixtime&forecast_days=14`
			);
			const data = await dataReq.json();

			let plotBands: any = [];
			if ('daily' in wd && 'sunrise' in wd.daily && 'sunset' in wd.daily) {
				let rise = wd.daily.sunrise;
				let set = wd.daily.sunset;
				plotBands = rise.map(function (r, i) {
					return {
						color: 'rgba(255, 255, 194, 0.5)',
						from: (r + data.utc_offset_seconds) * 1000,
						to: (set[i] + data.utc_offset_seconds) * 1000
					};
				});
			}

			let minValues = new Array(data.hourly.time.length).fill(undefined);
			let maxValues = new Array(data.hourly.time.length).fill(undefined);

			for (let variable of $params.hourly) {
				const chartDiv = document.createElement('div');

				let unit;

				let hourly_starttime = (data.hourly.time[0] + data.utc_offset_seconds) * 1000;
				let pointInterval = (data.hourly.time[1] - data.hourly.time[0]) * 1000;

				const series = [];
				let average = new Array(data.hourly.time.length).fill(0);
				let averageCount = new Array(data.hourly.time.length).fill(0);

				let variableCount = 0;
				for (let [model, values] of Object.entries(data.hourly)) {
					if (model === 'time') {
						continue;
					}
					if (model.startsWith(variable)) {
						for (let [index, val] of values.entries()) {
							if (!!val) {
								let avVal = average[index];
								average[index] = avVal + val;
								averageCount[index]++;

								if (minValues[index] > val || minValues[index] === undefined) {
									minValues[index] = val;
								}
								if (maxValues[index] < val || maxValues[index] === undefined) {
									maxValues[index] = val;
								}
							}
						}

						unit = data.hourly_units[model];

						variableCount++;
					}
				}

				for (let [index, val] of average.entries()) {
					average[index] = Math.round((val / averageCount[index]) * 10) / 10;
				}

				const minMax = [];
				for (let [index, min] of minValues.entries()) {
					minMax.push([min, maxValues[index]]);
				}

				series.push({
					name: 'temperature_2m_spread',
					data: minMax,
					type: 'arearange',
					tooltip: {
						valueSuffix: ' ' + unit
					},
					pointStart: hourly_starttime,
					pointInterval: pointInterval,
					className: 'highcharts-spread-series'
				});

				series.push({
					name: variable + '_average',
					data: average,
					dashStyle: 'ShortDashDot',
					color: '#5e5e5e',
					type:
						unit == 'mm' || unit == 'cm' || unit == 'inch' || unit == 'MJ/m²' ? 'column' : 'spline',
					tooltip: {
						valueSuffix: ' ' + unit
					},
					lineWidth: 4,
					states: {
						hover: {
							lineWidth: 6
						}
					},
					pointStart: hourly_starttime,
					pointInterval: pointInterval,
					className: 'highcharts-average-series'
				});

				new Highcharts.Chart(chartDiv, {
					credits: {
						text: count === $params.hourly.length - 1 ? 'Open-Meteo.com' : '',
						href: 'http://open-meteo.com'
					},

					chart: {
						height: showLegend ? '400px' : '300px',
						styledMode: true,
						marginLeft: '50',
						marginRight: 0
					},

					lang: {
						locale: 'en-GB'
					},

					title: {
						text: count === 0 ? 'Model Spread' : '',
						align: 'left'
					},

					subtitle: {
						text:
							count === 0
								? `Compare <span class="font-bold">${$params.hourly.join(', ')}</span> in models: <span class="font-bold">` +
									$params.models.join(', ') +
									'</span>'
								: '',
						align: 'left'
					},

					yAxis: {
						title: {
							text: unit
						}
					},

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

					plotOptions: {
						spline: {
							lineWidth: 2,
							states: {
								hover: {
									lineWidth: 3
								}
							},
							marker: {
								enabled: false
							}
						},
						column: {
							pointWidth: 5
						}
					},

					legend: {
						enabled: showLegend,
						layout: 'horizontal',
						align: 'center',
						verticalAlign: 'bottom'
					},

					series: series,

					responsive: {
						rules: [
							{
								condition: {
									maxWidth: 800
								}
							}
						]
					},

					tooltip: {
						shared: true,
						animation: false
					}
				});

				count++;
				node.appendChild(chartDiv);
			}
		}
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<!-- min-h-[302px] min-h-[602px]  min-h-[902px] min-h-[1202px]  -->
<div class="container-wrapper relative -mx-6 md:mx-0 min-h-[{300 * $params.hourly.length + 2}px]">
	<div
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 300 }}
		bind:this={node}
		class:highcharts-dark={mode.current === 'dark'}
		class:highcharts-light={mode.current !== 'dark'}
	></div>
	<div
		class="{count > 0
			? 'pointer-events-none opacity-0'
			: 'opacity-100'} bg-accent/100 absolute top-0 z-30 flex h-full w-full items-center justify-center rounded-lg"
	>
		<svg
			class="lucide lucide-loader-circle animate-spin"
			xmlns="http://www.w3.org/2000/svg"
			width="40"
			height="40"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</svg>
		<span class="hidden">Loading...</span>
	</div>
</div>

<div class="">
	<div class="mt-6 flex flex-col items-center gap-6 md:mt-12 md:flex-row">
		<div class="relative w-1/4">
			<LocationSearch
				style="height: 40px"
				on:location={(event) => {
					storedLocation.set(event.detail);
					window.location.reload();
				}}
				label="Search Location"
			/>
		</div>
		<div class="flex gap-2">
			<Switch
				id="show_legend"
				name="Show legend"
				bind:checked={showLegend}
				onCheckedChange={() => {
					$params.hourly = $params.hourly;
				}}
			/>
			<Label for="show_legend" class="mb-[2px]  cursor-pointer text-lg">Show legend</Label>
		</div>
		<div class="flex gap-2">
			<Switch
				id="average_only"
				name="Average only"
				bind:checked={averageOnly}
				onCheckedChange={() => {
					$params.hourly = $params.hourly;
				}}
			/>
			<Label for="average_only" class="mb-[2px]  cursor-pointer text-lg">Average only</Label>
		</div>
	</div>
</div>

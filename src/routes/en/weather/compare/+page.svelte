<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { get, writable } from 'svelte/store';

	import { fade } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { dev } from '$app/environment';

	import { mode } from 'mode-watcher';

	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import Settings from '$lib/components/settings/settings.svelte';
	import LocationSearch from '$lib/components/location/location-search.svelte';

	import { defaultParameters } from './options';

	import { hourly, models } from '../../docs/options';

	import { storedLocation } from '$lib/stores/settings';

	import './highcharts.css';

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
		hourly: ['temperature_2m', 'rain', 'relative_humidity_2m'],
		models: [
			'ecmwf_ifs025',
			'meteofrance_seamless',
			'ukmo_seamless',
			'icon_seamless',
			'gem_seamless'
		]
	});

	let count = $state(0);
	onMount(async () => {
		/// Highcharts needs to be loaded in `onMount` to work with prerendered SSG
		Highcharts = (await import('highcharts')).default;

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

			const dataReq = await fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&hourly=${$params.hourly.join(',')}&models=${$params.models.join(',')}&timeformat=unixtime&daily=sunset,sunrise`
			);
			const data = await dataReq.json();

			let dailyFirstModelKey = Object.keys(data.daily)[1].split('_');
			dailyFirstModelKey.shift();
			dailyFirstModelKey = dailyFirstModelKey.join('_');

			let plotBands: any = [];
			if (
				'daily' in data &&
				'sunrise_' + dailyFirstModelKey in data.daily &&
				'sunset_' + dailyFirstModelKey in data.daily
			) {
				let rise = data.daily['sunrise_' + dailyFirstModelKey];
				let set = data.daily['sunset_' + dailyFirstModelKey];
				plotBands = rise.map(function (r, i) {
					return {
						color: 'rgba(255, 255, 194, 0.5)',
						from: (r + data.utc_offset_seconds) * 1000,
						to: (set[i] + data.utc_offset_seconds) * 1000
					};
				});
			}

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
							}
						}

						unit = data.hourly_units[model];

						if (!averageOnly) {
							series.push({
								name: model,
								data: values,
								type:
									unit == 'mm' || unit == 'cm' || unit == 'inch' || unit == 'MJ/m²'
										? 'column'
										: 'spline',
								tooltip: {
									valueSuffix: ' ' + unit
								},
								pointStart: hourly_starttime,
								pointInterval: pointInterval
							});
						}
						variableCount++;
					}
				}

				for (let [index, val] of average.entries()) {
					average[index] = Math.round((val / averageCount[index]) * 10) / 10;
				}

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
						text: count === 0 ? 'Model Compare' : '',
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

<div class="mt-4 md:mt-8">
	<div class="flex">
		<a href="#models"><h2 id="models" class="text-2xl md:text-3xl">Models</h2></a>
		{#if $params.models.length > 0}
			<div transition:fade={{ duration: 200 }} class="relative mt-[5px]">
				<div
					class="bg-secondary border-foreground/25 absolute -top-1 ml-2 rounded-full border-2 px-3 py-1 text-sm no-underline"
				>
					{$params.models.length}&nbsp;/&nbsp;{models.flat().length}
				</div>
			</div>
		{/if}
	</div>

	<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
		{#each models as group, i (i)}
			<div class="mb-3">
				{#each group as { value, label } (value)}
					<div class="group flex items-center" title={label}>
						<Checkbox
							id="{value}_model"
							class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
							{value}
							checked={$params.models?.includes(value)}
							aria-labelledby="{value}_label"
							onCheckedChange={() => {
								if ($params.models?.includes(value)) {
									$params.models = $params.models.filter((item) => {
										return item !== e.value;
									});
								} else {
									$params.models.push(value);
									$params.models = $params.models;
								}
							}}
						/>
						<Label
							id="{value}_model_label"
							for="{value}_model"
							class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
						>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<!-- HOURLY -->
	<div class="mt-6 md:mt-12">
		<div class="flex">
			<a href="#hourly_weather_variables"
				><h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">
					Hourly Weather Variables
				</h2></a
			>
			{#if $params.hourly.length > 0}
				<div transition:fade={{ duration: 200 }} class="relative mt-[5px]">
					<div
						class="bg-secondary border-foreground/25 absolute -top-1 ml-2 rounded-full border-2 px-3 py-1 text-sm no-underline"
					>
						{$params.hourly.length}&nbsp;/&nbsp;{hourly.flat().length}
					</div>
				</div>
			{/if}
		</div>

		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each hourly as group, i (i)}
				<div>
					{#each group as { value, label } (value)}
						<div class="group flex items-center" title={label}>
							<Checkbox
								id="{value}_hourly"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								{value}
								checked={$params.hourly?.includes(value)}
								aria-labelledby="{value}_label"
								onCheckedChange={() => {
									if ($params.hourly?.includes(value)) {
										$params.hourly = $params.hourly.filter((item) => {
											return item !== value;
										});
									} else {
										$params.hourly.push(value);
										$params.hourly = $params.hourly;
									}
								}}
							/>
							<Label
								id="{value}_label"
								for="{value}_hourly"
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

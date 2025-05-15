<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { get, writable } from 'svelte/store';

	import { fade } from 'svelte/transition';

	import { dev } from '$app/environment';

	import { mode } from 'mode-watcher';

	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import Settings from '$lib/components/settings/settings.svelte';
	import LocationSearch from '$lib/components/location/location-search.svelte';

	import { hourly, models } from '../../docs/options';

	import { storedLocation } from '$lib/stores/settings';

	let useStockChart = false;
	let options: any;

	let node: HTMLElement;
	let chart: any;
	let Highcharts = $state(null);

	const location = get(storedLocation);

	let variablesSelected = $state(['temperature_2m', 'rain']);
	let modelsSelected = $state([
		'meteofrance_seamless',
		'ukmo_seamless',
		'icon_seamless',
		'gem_seamless'
	]);
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
				`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&hourly=${variablesSelected.join(',')}&models=${modelsSelected.join(',')}&timeformat=unixtime&daily=sunset,sunrise`
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

			for (let variable of variablesSelected) {
				const chartDiv = document.createElement('div');

				let unit;

				let hourly_starttime = (data.hourly.time[0] + data.utc_offset_seconds) * 1000;
				let pointInterval = (data.hourly.time[1] - data.hourly.time[0]) * 1000;

				const series = [];
				let average = [];
				let averageCount = [];

				let variableCount = 0;
				for (let [model, values] of Object.entries(data.hourly)) {
					if (model === 'time') {
						continue;
					}
					if (model.startsWith(variable)) {
						if (average && average.length === 0) {
							average = [...values];
						} else {
							for (let [index, val] of values.entries()) {
								let avVal = average[index];
								average[index] = avVal + val;
							}
						}

						unit = data.hourly_units[model];

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
						variableCount++;
					}
				}

				for (let [index, val] of average.entries()) {
					average[index] = Math.round((val / variableCount) * 10) / 10;
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
					pointInterval: pointInterval
				});

				new Highcharts.Chart(chartDiv, {
					credits: {
						text: 'Open-Meteo.com',
						href: 'http://open-meteo.com'
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
								? `Compare <span class="font-bold">${variablesSelected.join(', ')}</span> in models: <span class="font-bold">` +
									modelsSelected.join(', ') +
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
						shared: series.length <= 5,
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

<!-- min-h-[402px] min-h-[802px] min-h-[1202px]  -->
<div
	class="border border-border container-wrapper relative min-h-[{400 * variablesSelected.length +
		2}px]"
>
	<div
		class="w-full"
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 300 }}
		bind:this={node}
	></div>
	<div
		class="{count > 0
			? 'opacity-0 pointer-events-none'
			: 'opacity-100'} rounded-lg bg-accent/100 absolute top-0 z-30 flex h-full w-full items-center justify-center"
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

<div>
	<div class="mt-6 md:mt-12 flex gap-6">
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
	</div>
</div>

<div class="mt-4 md:mt-8">
	<div class="flex">
		<a href="#models"><h2 id="models" class="text-2xl md:text-3xl">Models</h2></a>
		{#if modelsSelected.length > 0}
			<div transition:fade={{ duration: 200 }} class="relative mt-[5px]">
				<div
					class="bg-secondary border-foreground/25 absolute -top-1 ml-2 rounded-full border-2 px-3 py-1 text-sm no-underline"
				>
					{modelsSelected.length}&nbsp;/&nbsp;{models.flat().length}
				</div>
			</div>
		{/if}
	</div>

	<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
		{#each models as group}
			<div class="mb-3">
				{#each group as e}
					<div class="group flex items-center" title={e.label}>
						<Checkbox
							id="{e.value}_model"
							class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
							value={e.value}
							checked={modelsSelected?.includes(e.value)}
							aria-labelledby="{e.value}_label"
							onCheckedChange={() => {
								if (modelsSelected?.includes(e.value)) {
									modelsSelected = modelsSelected.filter((item) => {
										return item !== e.value;
									});
								} else {
									modelsSelected.push(e.value);
									modelsSelected = modelsSelected;
								}
							}}
						/>
						<Label
							id="{e.value}_model_label"
							for="{e.value}_model"
							class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
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
			{#if modelsSelected.length > 0}
				<div transition:fade={{ duration: 200 }} class="relative mt-[5px]">
					<div
						class="bg-secondary border-foreground/25 absolute -top-1 ml-2 rounded-full border-2 px-3 py-1 text-sm no-underline"
					>
						{variablesSelected.length}&nbsp;/&nbsp;{hourly.flat().length}
					</div>
				</div>
			{/if}
		</div>

		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each hourly as group}
				<div>
					{#each group as e}
						<div class="group flex items-center" title={e.label}>
							<Checkbox
								id="{e.value}_hourly"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								value={e.value}
								checked={variablesSelected?.includes(e.value)}
								aria-labelledby="{e.value}_label"
								onCheckedChange={() => {
									if (variablesSelected?.includes(e.value)) {
										variablesSelected = variablesSelected.filter((item) => {
											return item !== e.value;
										});
									} else {
										variablesSelected.push(e.value);
										variablesSelected = variablesSelected;
									}
								}}
							/>
							<Label
								id="{e.value}_label"
								for="{e.value}_hourly"
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { fade } from 'svelte/transition';

	import { dev } from '$app/environment';

	import { mode } from 'mode-watcher';

	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';

	// import '$lib/components/highcharts/highcharts.css';

	import { models } from '../../docs/options';

	let useStockChart = false;
	let options: any;

	let node: HTMLElement;
	let chart: any;
	let Highcharts = $state(null);

	let variablesSelected = $state(['temperature', 'rain']);
	let modelsSelected = $state(['ecmwf_ifs025', 'icon_eu', 'gem_global']);
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

			let plotBands: any = [];
			const dataReq = await fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=${variablesSelected.join(',')}&models=${modelsSelected.join(',')}&timeformat=unixtime`
			);
			const data = await dataReq.json();

			for (let variable of variablesSelected) {
				const chartDiv = document.createElement('div');
				let unit;

				const series = [];
				for (let [model, values] of Object.entries(data.hourly)) {
					if (model === 'time') {
						continue;
					}
					if (model.startsWith(variable)) {
						let hourly_starttime = (data.hourly.time[0] + data.utc_offset_seconds) * 1000;
						let pointInterval = (data.hourly.time[1] - data.hourly.time[0]) * 1000;

						unit = data.hourly_units[model];

						series.push({
							name: model,
							data: values,
							type:
								unit == 'mm' || unit == 'cm' || unit == 'inch' || unit == 'MJ/m²'
									? 'column'
									: 'line',
							tooltip: {
								valueSuffix: ' ' + unit
							},
							pointStart: hourly_starttime,
							pointInterval: pointInterval
						});
					}
				}

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
							`Compare <span class="font-bold">${variable}</span> in models: <span class="font-bold">` +
							modelsSelected.join(', ') +
							'</span>',
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
	<div in:fade={{ duration: 300 }} out:fade={{ duration: 300 }} bind:this={node}></div>
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
</div>

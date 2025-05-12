<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { dev } from '$app/environment';

	import { mode } from 'mode-watcher';

	import '$lib/components/highcharts/highcharts.css';

	export let useStockChart = false;
	export let options: any;
	export let style = 'height: 400px';

	let node: HTMLElement;
	let chart: any;

	let variable = 'temperature';
	let models = ['ecmwf_ifs025', 'icon_eu', 'gem_global'];

	onMount(async () => {
		/// Highcharts needs to be loaded in `onMount` to work with prerendered SSG
		const Highcharts = (await import('highcharts')).default;

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

		let plotBands: any = [];
		const dataReq = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&models=${models.join(',')}&timeformat=unixtime`
		);
		const data = await dataReq.json();

		const series = [];
		for (let [model, values] of Object.entries(data.hourly)) {
			let hourly_starttime = (data.hourly.time[0] + data.utc_offset_seconds) * 1000;
			let pointInterval = (data.hourly.time[1] - data.hourly.time[0]) * 1000;

			if (model === 'time') {
				continue;
			}
			console.log(hourly_starttime, pointInterval);
			series.push({
				name: model,
				data: values,
				pointStart: hourly_starttime,
				pointInterval: pointInterval
			});
		}

		chart = new Highcharts.Chart(node, {
			credits: {
				text: 'Open-Meteo.com',
				href: 'http://open-meteo.com'
			},

			lang: {
				locale: 'en-GB'
			},

			title: {
				text: 'Model Compare',
				align: 'left'
			},

			subtitle: {
				text:
					`Compare <span class="font-bold">${variable}</span> in models: <span class="font-bold">` +
					models.join(', ') +
					'</span>',
				align: 'left'
			},

			yAxis: {
				title: {
					text: 'C'
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
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<div
	bind:this={node}
	{style}
	class:highcharts-dark={mode.current === 'dark'}
	class:highcharts-light={mode.current !== 'dark'}
></div>

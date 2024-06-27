<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	//import Highcharts from 'highcharts/highcharts';
	import Highcharts from '$lib/HighchartsCustom';

	import { onDestroy, onMount } from 'svelte';
	//import HighchartsAccessibility from 'highcharts/modules/accessibility';
	//import HighchartsStock from 'highcharts/modules/stock';
	import { dev } from '$app/environment';
	//import HighchartsBoost from "highcharts/modules/boost";
	import { themeIsDark } from '$lib/stores';
	//import HighchartsDark from 'highcharts/themes/avocado';

	export let useStockChart = false;
	export let options: Highcharts.Options;
	export let style = 'height: 400px';
	export let className: string;

	let node: HTMLElement;
	let chart: any;

	/*themeIsDark.subscribe((val) => {
		if (val === true) {
			//HighchartsDark(Highcharts);
		} else {
			//HighchartsLight(Highcharts);
		}
	});*/

	export const updateChart = (update: any, updateProp: any) => {
		console.log(update, chart);
		chart.xAxis[0].update(update);
	};

	onMount(async () => {
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
		//HighchartsAccessibility(Highcharts);
		options.chart = options.chart || {};
		options.chart.styledMode = true;
		options.accessibility = {
			enabled: false
		};
		options.credits = {
			text: 'Open-Meteo.com',
			href: 'http://open-meteo.com'
		};
		if (useStockChart) {
			// const HighchartsStock = await import('highcharts/modules/stock');
			// HighchartsStock.default(Highcharts);
			// chart = new Highcharts.StockChart(node, options);
			chart = new Highcharts.StockChart(node, options);
		} else {
			chart = new Highcharts.Chart(node, options);
		}
		console.log(chart);
	});

	onDestroy(() => {
		chart.destroy();
	});
</script>

<div
	bind:this={node}
	class={className}
	class:highcharts-dark={$themeIsDark}
	class:highcharts-light={!$themeIsDark}
/>

<style>
	@import './highcharts.css';
</style>

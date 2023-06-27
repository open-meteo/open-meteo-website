<script lang="ts">
	import Highcharts, { Chart, StockChart, type Options } from 'highcharts/highstock';
	import { onDestroy, onMount } from 'svelte';
	import HighchartsAccessibility from 'highcharts/modules/accessibility';
	import { dev } from '$app/environment';
	//import HighchartsBoost from "highcharts/modules/boost";
	import { themeIsDark } from '$lib/stores';
	//import HighchartsDark from 'highcharts/themes/avocado';

	export let useStockChart = false;
	export let options: Options;
	export let style = 'height: 400px';
	let clazz = 'w-100';
	export { clazz as class };

	let node: HTMLElement;
	let chart: Chart;

	/*themeIsDark.subscribe((val) => {
		if (val === true) {
			//HighchartsDark(Highcharts);
		} else {
			//HighchartsLight(Highcharts);
		}
	});*/

	onMount(async () => {
		if (dev) {
			const HighchartsDebugger = await import('highcharts/modules/debugger');
			HighchartsDebugger.default(Highcharts);
		}
		HighchartsAccessibility(Highcharts);
		options.chart = options.chart || {};
		options.chart.styledMode = true;
		options.credits = {
			text: 'Open-Meteo.com',
			href: 'http://open-meteo.com'
		};
		chart = useStockChart ? new StockChart(node, options) : new Chart(node, options);
	});

	onDestroy(() => {
		chart.destroy();
	});
</script>

<div
	bind:this={node}
	{style}
	class={clazz}
	class:highcharts-dark={$themeIsDark}
	class:highcharts-light={!$themeIsDark}
/>

<style>
	@import './highcharts.css';
</style>

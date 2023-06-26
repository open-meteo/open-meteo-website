<script lang="ts">
	import Highcharts, { Chart, StockChart, type Options } from 'highcharts/highstock';
	import { onDestroy, onMount } from 'svelte';
	import HighchartsAccessibility from 'highcharts/modules/accessibility';
	import { dev } from '$app/environment';
	//import HighchartsBoost from "highcharts/modules/boost";
	//import { themeIsDark } from '$lib/stores';

	export let useStockChart = false;
	export let options: Options
	export let style = "height: 400px"
	let clazz = "w-100";
	export { clazz as class };

	let node: HTMLElement;
	let chart: Chart;

	onMount(async () => {
		if (dev) {
			const HighchartsDebugger = await import('highcharts/modules/debugger');
			HighchartsDebugger.default(Highcharts);
		}
		HighchartsAccessibility(Highcharts);
		chart = useStockChart
			? new StockChart(node, options)
			: new Chart(node, options);
	});

	onDestroy(() => {
		chart.destroy()
	})
</script>

<div bind:this={node} style={style} class={clazz} />

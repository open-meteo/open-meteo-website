<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { themeIsDark } from '$lib/stores';

	interface Props {
		useStockChart?: boolean;
		options: any;
		style?: string;
		class?: string;
	}

	let {
		useStockChart = false,
		options = $bindable(),
		style = 'height: 400px',
		class: clazz = 'w-100'
	}: Props = $props();
	

	let node: HTMLElement = $state();
	let chart: any;

	onMount(async () => {
		/// Highcharts needs to be loaded in `onMount` to work with prerendered SSG
		const Highcharts = (await import('$lib/HighchartsCustom')).default;

		if (dev) {
			// const HighchartsDebugger = await import('highcharts/modules/debugger');
			// HighchartsDebugger.default(Highcharts);
			const Debugger = (await import('highcharts/es-modules/Extensions/Debugger/Debugger.js')).default;
			const ErrorMessages = (await import('highcharts/es-modules/Extensions/Debugger/ErrorMessages.js')).default;
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
></div>

<style>
	@import './highcharts.css';
</style>

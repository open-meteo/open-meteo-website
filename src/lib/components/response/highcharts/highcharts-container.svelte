<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { mode } from 'mode-watcher';

	import { dev } from '$app/environment';

	import './highcharts.css';

	interface Props {
		useStockChart?: boolean;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		options: Record<string, any>;
		style?: string;
		class?: string;
	}

	let { useStockChart = false, options, style = 'height: 400px', class: clazz = 'w-full' }: Props = $props();

	let node: HTMLElement;
	let chart: Highcharts.Chart | undefined;

	onMount(async () => {
		/// Highcharts needs to be loaded in `onMount` to work with prerendered SSG
		const Highcharts = (await import('./highcharts-custom')).default;

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
		options.lang = {
			locale: 'en-GB'
		};
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
		if (chart) {
			chart.destroy();
		}
	});
</script>

<div
	bind:this={node}
	{style}
	class={clazz}
	class:highcharts-dark={mode.current === 'dark'}
	class:highcharts-light={mode.current !== 'dark'}
></div>

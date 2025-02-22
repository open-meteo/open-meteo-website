<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { dev } from '$app/environment';

	import { themeIsDark } from '$lib/stores/settings';

	import './highcharts.css';

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
			const Debugger = (await import('highcharts/es-modules/Extensions/Debugger/Debugger.js'))
				.default;
			const ErrorMessages = (
				await import('highcharts/es-modules/Extensions/Debugger/ErrorMessages.js')
			).default;
			Highcharts.errorMessages = ErrorMessages;
			Debugger.compose(Highcharts.Chart);
		}
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

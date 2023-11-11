<script lang="ts">
	//import Highcharts, { Chart, type Options } from 'highcharts/highcharts';

	//import Globals from 'highcharts/es-modules/Core/Globals.js';
	// import Chart from 'highcharts/es-modules/Core/Chart/Chart';
	// import PlotLineOrBand from 'highcharts/es-modules/Core/Axis/PlotLineOrBand/PlotLineOrBand';
	// import 'highcharts/es-modules/Series/Line/LineSeries';
	// import Axis from 'highcharts/es-modules/Core/Axis/Axis';
	// import DateTimeAxis from 'highcharts/es-modules/Core/Axis/DateTimeAxis';
	// import Time from 'highcharts/es-modules/Core/Time.js';

	// DateTimeAxis.compose(Axis);
	// PlotLineOrBand.compose(Axis);

	import Highcharts from '$lib/HighchartsCustom';
	

	import { onDestroy, onMount } from 'svelte';
	//import HighchartsAccessibility from 'highcharts/modules/accessibility';
	//import HighchartsStock from 'highcharts/modules/stock';
	import { dev } from '$app/environment';
	//import HighchartsBoost from "highcharts/modules/boost";
	import { themeIsDark } from '$lib/stores';
	//import HighchartsDark from 'highcharts/themes/avocado';

	export let useStockChart = false;
	export let options: any;
	export let style = 'height: 400px';
	let clazz = 'w-100';
	export { clazz as class };

	let node: HTMLElement;
	let chart: Highcharts.Chart;

	/*themeIsDark.subscribe((val) => {
		if (val === true) {
			//HighchartsDark(Highcharts);
		} else {
			//HighchartsLight(Highcharts);
		}
	});*/

	onMount(async () => {
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
			
			/*const BrokenAxis = (await import('highcharts/es-modules/Core/Axis/BrokenAxis.js')).default;
			// Compositions
			BrokenAxis.compose(Highcharts.Axis, Highcharts.Series);

			const ApproximationDefaults = (await import('highcharts/es-modules/Extensions/DataGrouping/ApproximationDefaults.js')).default;
			const ApproximationRegistry = (await import('highcharts/es-modules/Extensions/DataGrouping/ApproximationRegistry.js')).default;
			const DataGrouping = (await import('highcharts/es-modules/Extensions/DataGrouping/DataGrouping.js')).default;
			Highcharts.dataGrouping = {
				approximationDefaults: ApproximationDefaults,
				approximations: ApproximationRegistry
			};
			DataGrouping.compose(Highcharts.Axis, Highcharts.Series, Highcharts.Tooltip);

			//import './mouse-wheel-zoom.src.js';
			const DataModifyComposition = (await import('highcharts/es-modules/Series/DataModifyComposition.js')).default;
			const Navigator = (await import('highcharts/es-modules/Stock/Navigator/Navigator.js')).default;
			const RangeSelector = (await import('highcharts/es-modules/Stock/RangeSelector/RangeSelector.js')).default;
			const Scrollbar = (await import('highcharts/es-modules/Stock/Scrollbar/Scrollbar.js')).default;
			const OrdinalAxis = (await import('highcharts/es-modules/Core/Axis/OrdinalAxis.js')).default;
			await import('highcharts/es-modules/Series/HLC/HLCSeries.js');
			const OHLCSeries = (await import('highcharts/es-modules/Series/OHLC/OHLCSeries.js')).default;
			await import('highcharts/es-modules/Series/Candlestick/CandlestickSeries.js');
			const FlagsSeries = (await import('highcharts/es-modules/Series/Flags/FlagsSeries.js')).default;
			const StockChart = (await import('highcharts/es-modules/Core/Chart/StockChart.js')).default;

			// Classes
			Highcharts.Navigator = Navigator;
			Highcharts.RangeSelector = RangeSelector;
			Highcharts.Scrollbar = Scrollbar;
			Highcharts.StockChart = Highcharts.stockChart = StockChart.stockChart;
			// Compositions
			DataModifyComposition.compose(Highcharts.Series, Highcharts.Axis, Highcharts.Point);
			FlagsSeries.compose(Highcharts.Renderer);
			Navigator.compose(Highcharts.Axis, Highcharts.Chart, Highcharts.Series);
			OHLCSeries.compose(Highcharts.Series);
			OrdinalAxis.compose(Highcharts.Axis, Highcharts.Series, Highcharts.Chart);
			RangeSelector.compose(Highcharts.Axis, Highcharts.Chart);
			Scrollbar.compose(Highcharts.Axis);
			StockChart.compose(Highcharts.Axis, Highcharts.Series, Highcharts.SVGRenderer);*/

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
/>

<style>
	@import './highcharts.css';
</style>

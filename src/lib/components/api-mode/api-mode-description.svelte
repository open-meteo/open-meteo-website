<script lang="ts">
	import { fade, fadeOutAbsolute } from '$lib/utils/transitions';

	import { Button } from '$lib/components/ui/button';

	import AnimateHeight from '$lib/components/animate-height/animate-height.svelte';

	import { type Parameters } from '$lib/docs';

	import { historicalDateRange } from './utils';

	interface Props {
		params: Parameters;
		forecastDaysOptions: { value: string; label: string }[];
		singleRunArchiveNote?: string;
	}

	let {
		params = $bindable(),
		forecastDaysOptions,
		singleRunArchiveNote = 'Most models are archived from 2nd of April 2026.'
	}: Props = $props();

	let defaultForecastDays = $derived(
		forecastDaysOptions.find((o) => o.label.includes('default')) ?? forecastDaysOptions[0]
	);
	let maxForecastDays = $derived(forecastDaysOptions.at(-1));

	const plainLabel = (label: string | undefined): string =>
		label ? label.replace(/\s*\(.*\)/, '') : '';

	// Same defaults as switching modes via the API mode selector
	const switchToHistoricalForecast = () => {
		params.api_mode = 'historical_forecast';
		params.time_mode = 'time_interval';
		params.run = '';
		const { start_date, end_date } = historicalDateRange(params.start_date, params.end_date);
		params.start_date = start_date;
		params.end_date = end_date;
	};
</script>

<AnimateHeight>
	{#if params.api_mode === 'historical_forecast'}
		<div in:fade={{ duration: 250, delay: 50 }} out:fadeOutAbsolute={{ duration: 200 }}>
			<p>
				<strong
					><mark>Historical Forecast</mark> returns archived forecasts from this weather forecast API.</strong
				>
				Same models, same parameters and the same response format. Coverage starts around 2022, depending
				on the model. Each run's first few hours are stitched into a continuous hourly timeseries. Full
				details are available in the
				<a class="text-link underline" href="/en/docs/historical-forecast-api"
					>Historical Forecast API documentation</a
				>.
			</p>
		</div>
	{:else if params.api_mode === 'single_run'}
		<div in:fade={{ duration: 250, delay: 50 }} out:fadeOutAbsolute={{ duration: 200 }}>
			<p>
				<strong
					><mark>Single Run</mark> retrieves the full forecast horizon of any individual model run.</strong
				>
				Select a run with the <mark>&run=</mark> parameter using the UTC initialisation time (e.g.
				<mark>&run=2026-07-16T00:00</mark>). Runs are typically available 1 to 6 hours after
				initialisation, see the
				<a href="#data_sources">Data Sources</a> or the
				<a href="/en/docs/model-updates">model updates documentation</a>
				for exact timings.
				{singleRunArchiveNote} Full details are available in the
				<a class="text-link underline" href="/en/docs/single-runs-api"
					>Single Runs API documentation</a
				>.
			</p>
		</div>
	{:else}
		<div in:fade={{ duration: 250, delay: 50 }} out:fadeOutAbsolute={{ duration: 200 }}>
			{#if params.time_mode === 'time_interval'}
				<p>
					<strong
						><mark>Forecast</mark> provides the latest, continuously updated weather forecast.</strong
					>
					The <mark>Start Date</mark> and <mark>End Date</mark> options help you choose a range of
					dates more easily. In <mark>Forecast</mark> mode, the last 3 months are available.
				</p>
			{:else}
				<p>
					<strong
						><mark>Forecast</mark> provides the latest, continuously updated weather forecast.</strong
					>
					By default, we provide forecasts for {plainLabel(defaultForecastDays?.label)}, but you can
					access forecasts for up to {plainLabel(maxForecastDays?.label)}. Use
					<mark>Past Days</mark> to include recently archived forecasts.
				</p>
			{/if}
			<div class="mt-3 flex flex-wrap items-center gap-2">
				For older archived forecasts, switch to
				<Button variant="outline" onclick={switchToHistoricalForecast}>Historical Forecast</Button>
				mode.
			</div>
			<p class="mt-3">
				You can also check out our
				<a href="/en/docs/historical-weather-api">Historical Weather API</a>, which provides data
				going all the way back to 1940.
			</p>
		</div>
	{/if}
</AnimateHeight>

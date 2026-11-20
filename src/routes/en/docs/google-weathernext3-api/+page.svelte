<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';

	import { urlHashStore } from '#lib/stores/url-hash-store.js';

	import { Checkbox } from '#lib/components/ui/checkbox/index.js';

	import LicenceSelector from '#lib/components/licence/licence-selector.svelte';
	import LocationSelection from '#lib/components/location/location-selection.svelte';
	import ResultsPreview from '#lib/components/response/results-preview.svelte';
	import Settings from '#lib/components/settings/settings.svelte';
	import TimeSelector from '#lib/components/time/time-selector.svelte';

	import { defaultParameters } from '../ensemble-options';
	import { pastDaysOptions } from '../options';
	import { forecastDaysOptions, hourly, model, statisticLabels } from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['temperature_2m', 'temperature_2m_p10', 'temperature_2m_p90'],
		models: [model.value]
	});

	const beginDate = new SvelteDate();
	beginDate.setDate(beginDate.getDate() - 92);

	const lastDate = new SvelteDate();
	lastDate.setDate(lastDate.getDate() + 14);
</script>

<svelte:head>
	<title>Google WeatherNext 3 API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/google-weathernext3-api" />
	<meta
		name="description"
		content="Hourly Google WeatherNext 3 ensemble mean, spread and percentile forecasts up to 15 days through the Open-Meteo Ensemble API."
	/>
</svelte:head>

<form method="get" action="https://ensemble-api.open-meteo.com/v1/ensemble">
	<LocationSelection bind:params={$params} />

	<TimeSelector
		bind:params={$params}
		{forecastDaysOptions}
		{pastDaysOptions}
		{beginDate}
		{lastDate}
	/>

	<div class="mt-6 md:mt-12">
		<a href="#hourly_weather_variables">
			<h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">Hourly Weather Variables</h2>
		</a>
		<p class="text-muted-foreground mt-2 text-sm">
			Select temperature P10 and P90 to see the central 80% of ensemble temperatures at each
			forecast hour. Wind speed offers all five percentiles. Eastward and northward wind offer mean
			and spread.
		</p>
		<table aria-labelledby="hourly_weather_variables" class="mt-2 block w-full lg:table">
			<thead class="hidden lg:table-header-group">
				<tr class="border-border border-b">
					<th scope="col" class="py-2 text-left">Variable</th>
					{#each statisticLabels as statistic (statistic)}
						<th scope="col" class="w-[8%] text-center">{statistic}</th>
					{/each}
				</tr>
			</thead>
			<tbody class="block lg:table-row-group">
				{#each hourly as { value, label, statistics } (value)}
					<tr class="border-border flex flex-wrap gap-x-3 gap-y-1 py-2 lg:table-row lg:border-b">
						<th scope="row" class="w-full text-left font-normal lg:w-auto lg:py-2">{label}</th>
						{#each statistics as variable, i (statisticLabels[i])}
							<td
								class={variable
									? 'lg:text-center'
									: 'text-muted-foreground hidden text-center lg:table-cell'}
							>
								{#if variable}
									<div class="inline-flex items-center gap-1.5 align-middle">
										<Checkbox
											id="{variable}_hourly"
											value={variable}
											aria-label="{label}, {statisticLabels[i]}"
											class="bg-muted/50 border-border-dark cursor-pointer"
											checked={$params.hourly?.includes(variable)}
											onCheckedChange={(checked) => {
												const selected = $params.hourly ?? [];
												$params.hourly = checked
													? [...selected, variable]
													: selected.filter((item) => item !== variable);
											}}
										/>
										<label class="cursor-pointer text-sm lg:hidden" for="{variable}_hourly"
											>{statisticLabels[i]}</label
										>
									</div>
								{:else}
									<span aria-hidden="true">—</span><span class="sr-only">Unavailable</span>
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<div class="mt-3 md:mt-6"><LicenceSelector requires_professional_plan={true} /></div>
</form>

<div class="mt-6 md:mt-12">
	<ResultsPreview
		{params}
		{defaultParameters}
		type="ensemble"
		action="ensemble"
		model_default={model.value}
		sdk_type="ensemble_api"
	/>
</div>

<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Documentation</h2></a>
	<div class="mt-2 md:mt-4">
		<p>
			WeatherNext 3 provides global hourly forecasts up to 15 days ahead, initialized every six
			hours. Temperature and dewpoint at 2 m use a 0.05° grid. All other fields shown here use a
			0.1° grid.
		</p>
		<p>
			Use <mark>models={model.value}</mark> with the
			<a href="/en/docs/ensemble-mean-api" class="text-link underline">Ensemble Mean API</a>.
			Request the mean using the variable name, such as <mark>temperature_2m</mark>. Append
			<mark>_p10</mark>, <mark>_p25</mark>, <mark>_p50</mark>, <mark>_p75</mark> or
			<mark>_p90</mark> to request a percentile for fields with those options. P50 is the median, and
			P10 to P90 spans the central 80% of the ensemble distribution.
		</p>
		<p>
			For variables with a Spread option, append <mark>_spread</mark> to request a
			Gaussian-equivalent standard deviation estimated as <mark>(P90 − P10) / 2.5631</mark>.
		</p>
	</div>
</div>

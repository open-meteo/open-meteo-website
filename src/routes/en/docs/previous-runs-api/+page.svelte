<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { countPreviousVariables, countVariables } from '$lib/utils/meteo';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
	import TimeSelector from '$lib/components/time/time-selector.svelte';

	import { gridCellSelectionOptions, models, temporalResolutionOptions } from '../options';
	import {
		defaultParameters,
		forecastDaysOptions,
		pastDaysOptions,
		previousDay,
		solarVariables,
		windVariables
	} from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],

		...defaultParameters,

		hourly: [
			'temperature_2m',
			'temperature_2m_previous_day1',
			'temperature_2m_previous_day2',
			'temperature_2m_previous_day3',
			'temperature_2m_previous_day4',
			'temperature_2m_previous_day5'
		]
	});

	function formatVariableName(variable: string, previous_day: number) {
		if (previous_day == 0) {
			return variable;
		}
		return `${variable}_previous_day${previous_day}`;
	}

	// Additional variable settings
	let cellSelection = $derived(
		gridCellSelectionOptions.find((gcso) => String(gcso.value) == $params.cell_selection)
	);
	let temporalResolution = $derived(
		temporalResolutionOptions.find((tro) => String(tro.value) == $params.temporal_resolution)
	);

	let accordionValues: string[] = $state([]);
	onMount(() => {
		if (
			((temporalResolution ? temporalResolution.value : false) ||
				(cellSelection ? cellSelection.value : false)) &&
			!accordionValues.includes('additional-variables')
		) {
			accordionValues.push('additional-variables');
		}

		if (
			(countPreviousVariables([solarVariables], $params.hourly).active ||
				($params.tilt ? Number($params.tilt) > 0 : false) ||
				($params.azimuth ? Number($params.azimuth) > 0 : false)) &&
			!accordionValues.includes('solar-variables')
		) {
			accordionValues.push('solar-variables');
		}

		if (
			countPreviousVariables([windVariables], $params.hourly).active &&
			!accordionValues.includes('wind-variables')
		) {
			accordionValues.push('wind-variables');
		}

		if (countVariables(models, $params.models).active && !accordionValues.includes('models')) {
			accordionValues.push('models');
		}
	});

	let beginDate = new Date('2021-04-01');

	let lastDate = new SvelteDate();
	lastDate.setDate(lastDate.getDate() + 16);
</script>

<svelte:head>
	<title>Previous Runs API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/previous-runs-api" />
</svelte:head>

<Alert.Root variant="info" class="mb-4"
	><svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-info-icon lucide-info"
		><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
	>
	<Alert.Description>
		Data from past model runs is aligned to fixed lead-time offsets of 1–7 days. Requesting
		<mark>temperature_2m_previous_day1</mark> returns the value predicted 24 hours before valid
		time; <mark>_previous_day2</mark> returns 48 hours before, and so on up to day 7. Comparing
		these offsets against observations or reanalysis makes it straightforward to measure how
		forecast skill degrades with lead time and to train bias-correction models. Most models are
		archived from <strong>January 2024</strong>. GFS 2 m temperature extends back to
		<strong>March 2021</strong>.
	</Alert.Description>
</Alert.Root>

<form method="get" action="https://historical-forecast-api.open-meteo.com/v1/forecast">
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<TimeSelector
		bind:params={$params}
		{forecastDaysOptions}
		{pastDaysOptions}
		{beginDate}
		{lastDate}
	/>

	<!-- HOURLY -->
	<div class="mt-6 md:mt-12">
		<a href="#hourly_weather_variables"
			><h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">
				Hourly Weather Variables
			</h2></a
		>
		<div class="mt-2 overflow-auto md:mt-4">
			<table class="w-full">
				<tbody>
					{#each previousDay as pd, j (j)}
						<tr class="border-border border-b">
							<td class="text-nowrap">{pd.label}</td>
							{#each { length: 8 } as _, i (i)}
								<td class="py-1"
									><div class="flex items-center justify-center px-2">
										<Checkbox
											id="{pd.value}_hourly_previous_day{i}"
											class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
											value={formatVariableName(pd.value, i)}
											checked={$params.hourly?.includes(formatVariableName(pd.value, i))}
											aria-labelledby="{pd.value}_hourly_previous_day_label{i}"
											onCheckedChange={() => {
												if ($params.hourly?.includes(formatVariableName(pd.value, i))) {
													$params.hourly = $params.hourly.filter((item: string) => {
														return item !== formatVariableName(pd.value, i);
													});
												} else if ($params.hourly) {
													$params.hourly.push(formatVariableName(pd.value, i));
													$params.hourly = $params.hourly;
												}
											}}
										/>
										<Label
											id="{pd.value}_hourly_previous_day_label{i}"
											for="{pd.value}_hourly_previous_day{i}"
											class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">Day {i}</Label
										>
									</div></td
								>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- ADDITIONAL VARIABLES -->
	<div class="mt-6">
		<Accordion.Root
			type="multiple"
			class="border-border rounded-lg border"
			bind:value={accordionValues}
		>
			<AccordionItem id="additional-variables" title="Additional Options">
				<div class=" mt-2 grid grid-cols-1 gap-3 md:mt-4 md:grid-cols-4 md:gap-6">
					<div class="relative md:col-span-2">
						<Select.Root
							name="temporal_resolution"
							type="single"
							bind:value={$params.temporal_resolution}
						>
							<Select.Trigger class="data-placeholder:text-foreground h-12 cursor-pointer pt-6"
								>{temporalResolution?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each temporalResolutionOptions as { value, label } (value)}
									<Select.Item {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
								>Temporal Resolution For Hourly Data</Label
							>
						</Select.Root>
					</div>
					<div class="relative md:col-span-2">
						<Select.Root name="cell_selection" type="single" bind:value={$params.cell_selection}>
							<Select.Trigger class="data-placeholder:text-foreground h-12 cursor-pointer pt-6"
								>{cellSelection?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each gridCellSelectionOptions as { value, label } (value)}
									<Select.Item {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
								>Grid Cell Selection</Label
							>
						</Select.Root>
					</div>
				</div>
			</AccordionItem>
			<AccordionItem
				id="solar-variables"
				title="Solar Radiation Variables"
				count={countPreviousVariables([solarVariables], $params.hourly)}
			>
				<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
					<table class="mx-6 mt-2 w-full min-w-[1020px] md:ml-0 lg:mx-0">
						<tbody>
							{#each solarVariables as sv, j (j)}
								<tr class="border-border border-b">
									<td>{sv.label}</td>
									{#each { length: 8 } as _, i (i)}
										<td class="py-1"
											><div class="flex items-center justify-center px-2">
												<Checkbox
													id="{sv.value}_hourly_previous_day{i}"
													class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
													value={formatVariableName(sv.value, i)}
													checked={$params.hourly?.includes(formatVariableName(sv.value, i))}
													aria-labelledby="{sv.value}_hourly_previous_day_label{i}"
													onCheckedChange={() => {
														if ($params.hourly?.includes(formatVariableName(sv.value, i))) {
															$params.hourly = $params.hourly.filter((item: string) => {
																return item !== formatVariableName(sv.value, i);
															});
														} else if ($params.hourly) {
															$params.hourly.push(formatVariableName(sv.value, i));
															$params.hourly = $params.hourly;
														}
													}}
												/>
												<Label
													id="{sv.value}_hourly_previous_day_label{i}"
													for="{sv.value}_hourly_previous_day{i}"
													class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">Day {i}</Label
												>
											</div></td
										>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div class="mb-3">
					<small class="text-muted-foreground"
						>Note: Solar radiation is averaged over the past hour. Use
						<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI
						please specify Tilt and Azimuth below.</small
					>
				</div>
				<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-2 md:gap-6">
					<div class="relative">
						<Input
							id="tilt"
							type="number"
							class="h-12 cursor-pointer pt-6 {Number($params.tilt) < 0 || Number($params.tilt) > 90
								? 'text-red'
								: ''}"
							name="tilt"
							step="1"
							min="0"
							max="90"
							bind:value={$params.tilt}
						/>
						<Label
							class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
							for="tilt">Panel Tilt (0° horizontal)</Label
						>
						{#if Number($params.tilt) < 0 || Number($params.tilt) > 90}
							<div class="invalid-tooltip" transition:slide>Tilt must be between 0° and 90°</div>
						{/if}
					</div>

					<div class="relative">
						<Input
							type="number"
							class="h-12 cursor-pointer pt-6 {Number($params.azimuth) < -180 ||
							Number($params.azimuth) > 180
								? 'text-red'
								: ''}"
							name="azimuth"
							id="azimuth"
							step="1"
							min="-180"
							max="180"
							bind:value={$params.azimuth}
						/>
						<Label
							class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
							for="azimuth">Panel Azimuth (0° S, -90° E, 90° W, ±180° N)</Label
						>
						{#if Number($params.azimuth) < -180 || Number($params.azimuth) > 180}
							<div class="invalid-tooltip" transition:slide>
								Azimuth must be between -180° (north) and 180° (north)
							</div>
						{/if}
					</div>
				</div>
			</AccordionItem>
			<AccordionItem
				id="wind-variables"
				title="Wind on 80, 120 and 180 meter"
				count={countPreviousVariables([windVariables], $params.hourly)}
			>
				<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
					<table class="mx-6 mt-2 w-full min-w-[1020px] md:ml-0 lg:mx-0">
						<tbody>
							{#each windVariables as wv, j (j)}
								<tr class="border-border border-b">
									<td>{wv.label}</td>
									{#each { length: 8 } as _, i (i)}
										<td class="py-1"
											><div class="flex items-center justify-center px-2">
												<Checkbox
													id="{wv.value}_hourly_previous_day{i}"
													class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
													value={formatVariableName(wv.value, i)}
													checked={$params.hourly?.includes(formatVariableName(wv.value, i))}
													aria-labelledby="{wv.value}_hourly_previous_day_label{i}"
													onCheckedChange={() => {
														if ($params.hourly?.includes(formatVariableName(wv.value, i))) {
															$params.hourly = $params.hourly.filter((item: string) => {
																return item !== formatVariableName(wv.value, i);
															});
														} else if ($params.hourly) {
															$params.hourly.push(formatVariableName(wv.value, i));
															$params.hourly = $params.hourly;
														}
													}}
												/>
												<Label
													id="{wv.value}_hourly_previous_day_label{i}"
													for="{wv.value}_hourly_previous_day{i}"
													class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">Day {i}</Label
												>
											</div></td
										>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</AccordionItem>
			<AccordionItem
				id="models"
				title="Weather models"
				count={countVariables(models, $params.models)}
			>
				<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
					{#each models as group, i (i)}
						<div class="mb-3">
							{#each group as { value, label } (value)}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{value}_model"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										{value}
										checked={$params.models?.includes(value)}
										aria-labelledby="{value}_label"
										onCheckedChange={() => {
											if ($params.models?.includes(value)) {
												$params.models = $params.models.filter((item: string) => {
													return item !== value;
												});
											} else if ($params.models) {
												$params.models.push(value);
												$params.models = $params.models;
											}
										}}
									/>
									<Label
										id="{value}_model_label"
										for="{value}_model"
										class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>
				<div>
					<small class="text-muted-foreground"
						>Note: The default <mark>Best Match</mark> provides the best forecast for any given
						location worldwide. <mark>Seamless</mark> combines all models from a given provider into a
						seamless prediction.</small
					>
				</div>
			</AccordionItem>
		</Accordion.Root>
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<!-- LISENCE -->
	<div class="mt-3 md:mt-6">
		<LicenceSelector requires_professional_plan={true} />
	</div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultsPreview
		{params}
		{defaultParameters}
		type="previous-runs"
		useStockChart={true}
		defaultTimeParameters={false}
	/>
</div>

<div class="mt-6 md:mt-12">
	<a href="#data_availability">
		<h2 id="data_availability" class="text-2xl md:text-3xl">Data Availability</h2>
	</a>
	<div class="mt-2 md:mt-4">
		<p>
			Most models are archived from <strong>January 2024</strong>. Some models were added to the
			archive later in 2024 or 2025 and have correspondingly shorter coverage. Exceptions with
			longer history:
		</p>
		<ul class="mt-2 list-disc pl-6">
			<li>
				<strong>GFS 2 m temperature</strong> — available from <strong>March 2021</strong>
			</li>
			<li>
				<strong>JMA GSM and MSM</strong> — available from <strong>2018</strong>
			</li>
		</ul>
		<p class="mt-3">
			Additional historical coverage can be reconstructed on request, subject to upstream
			availability from the originating weather service.
		</p>
	</div>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<a href="#api_documentation"
		><h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			The Previous Runs API exposes forecast data at fixed lead-time offsets rather than as a
			seamless time-series. <mark>_previous_day0</mark> is the current model run (equivalent to
			the live Forecast API). <mark>_previous_day1</mark> is the value that was predicted 24 hours
			before valid time, <mark>_previous_day2</mark> 48 hours before, and so on up to day 7. For
			local models with shorter forecast horizons (2–5 days), only offsets within that horizon are
			populated.
		</p>
		<p>
			This structure is suited to aggregated skill analysis — for example, computing the mean
			absolute error of all <mark>_previous_day3</mark> forecasts against ERA5 over a calendar
			year. For workflows that need the <em>complete</em> output of a specific model run
			(initialisation datetime, all forecast hours, multiple variables), use the
			<a class="text-link underline" href="/en/docs/single-runs-api">Single Runs API</a> instead,
			which stores each run independently and is queryable by its UTC initialisation time via the
			<mark>&run=</mark> parameter.
		</p>
		<p>
			<strong>Models:</strong> The Previous Runs API supports the same models as the
			<a class="text-link underline" href="/en/docs">Weather Forecast API</a>. See the Forecast
			API documentation for the full model and variable list.
		</p>
		<p>
			<strong>Update cadence:</strong> Global models update every 6 hours; regional models (e.g.
			ICON-D2, HRRR, AROME) update every 1–3 hours. The available lead-time window for each model
			is limited to its forecast horizon, so a model with a 3-day horizon will have at most
			<mark>_previous_day3</mark> populated.
		</p>
	</div>
</div>

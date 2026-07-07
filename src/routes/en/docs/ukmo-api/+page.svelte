<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { sliceIntoChunks } from '$lib/utils';
	import {
		altitudeAboveSeaLevelMeters,
		countHeightVariables,
		countPressureVariables,
		countVariables
	} from '$lib/utils/meteo';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import ZoomableImage from '$lib/components/media/zoomable-image.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
	import TimeSelector from '$lib/components/time/time-selector.svelte';
	import VariableCheckboxGroups from '$lib/components/variables/variable-checkbox-groups.svelte';

	import {
		current,
		forecastHoursOptions,
		gridCellSelectionOptions,
		pastDaysOptions,
		pastHoursOptions,
		solarVariables,
		temporalResolutionOptions
	} from '../options';
	import {
		additionalVariables,
		daily,
		defaultParameters,
		forecastDaysOptions,
		heightVariables,
		heights,
		hourly,
		levels,
		models,
		pressureVariables
	} from './options';

	const params = urlHashStore({
		latitude: [51.5085],
		longitude: [-0.1257],
		...defaultParameters,
		hourly: ['temperature_2m']
	});

	let timezoneInvalid = $derived(
		$params.timezone == 'UTC' && ($params.daily ? $params.daily.length > 0 : false)
	);

	// Additional variable settings
	let pastHours = $derived(pastHoursOptions.find((pho) => String(pho.value) == $params.past_hours));
	let forecastHours = $derived(
		forecastHoursOptions.find((fho) => String(fho.value) == $params.forecast_hours)
	);
	let cellSelection = $derived(
		gridCellSelectionOptions.find((gcso) => String(gcso.value) == $params.cell_selection)
	);
	let temporalResolution = $derived(
		temporalResolutionOptions.find((tro) => String(tro.value) == $params.temporal_resolution)
	);
	let heightVariablesTab = $state('temperature');
	let pressureVariablesTab = $state('temperature');

	let accordionValues: string[] = $state([]);
	onMount(() => {
		if (
			(countVariables(additionalVariables, $params.hourly).active ||
				(pastHours ? pastHours.value : false) ||
				(cellSelection ? cellSelection.value : false) ||
				(forecastHours ? forecastHours.value : false) ||
				(temporalResolution ? temporalResolution.value : false)) &&
			!accordionValues.includes('additional-variables')
		) {
			accordionValues.push('additional-variables');
		}

		if (
			(countVariables(solarVariables, $params.hourly).active ||
				($params.tilt ? Number($params.tilt) > 0 : false) ||
				($params.azimuth ? Number($params.azimuth) > 0 : false)) &&
			!accordionValues.includes('solar-variables')
		) {
			accordionValues.push('solar-variables');
		}

		if (
			countPressureVariables(heightVariables, heights, $params.hourly).active &&
			!accordionValues.includes('height-variables')
		) {
			accordionValues.push('height-variables');
		}

		if (
			countPressureVariables(pressureVariables, levels, $params.hourly).active &&
			!accordionValues.includes('pressure-variables')
		) {
			accordionValues.push('pressure-variables');
		}

		if (countVariables(models, $params.models).active && !accordionValues.includes('models')) {
			accordionValues.push('models');
		}
	});

	let beginDate = new SvelteDate();
	beginDate.setMonth(beginDate.getMonth() - 3);

	let lastDate = new SvelteDate();
	lastDate.setDate(lastDate.getDate() + 14);
</script>

<svelte:head>
	<title>UK Met Office API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/ukmo-api" />
	<meta
		name="description"
		content="UK Met Office UKV 2 km and global 10 km weather forecasts for the United Kingdom and worldwide. Free weather API for non-commercial use, no key required."
	/>
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
		UK Met Office data is provided under the <a
			class="text-link underline"
			href="https://creativecommons.org/licences/by-sa/4.0/deed.en">CC BY-SA 4.0</a
		>
		licence. Therefore, any derived products from this data should also be redistributed under the same
		or a compatible licence. Typically, Open-Meteo provides data under
		<a class="text-link underline" href="https://creativecommons.org/licences/by/4.0/deed.en"
			>CC BY 4.0</a
		>.
	</Alert.Description>
</Alert.Root>

<form method="get" action="https://api.open-meteo.com/v1/forecast">
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<TimeSelector
		bind:params={$params}
		{beginDate}
		{lastDate}
		{pastDaysOptions}
		{forecastDaysOptions}
	/>

	<!-- HOURLY -->
	<div class="mt-6 md:mt-12">
		<a href="#hourly_weather_variables"
			><h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">
				Hourly Weather Variables
			</h2></a
		>
		<VariableCheckboxGroups
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
			groups={hourly}
			bind:values={$params.hourly}
			idSuffix="hourly"
		/>
	</div>

	<!-- ADDITIONAL VARIABLES -->
	<div class="mt-6">
		<Accordion.Root
			type="multiple"
			class="border-border rounded-lg border"
			bind:value={accordionValues}
		>
			<AccordionItem
				id="additional-variables"
				title="Additional Variables And Options"
				count={countVariables(additionalVariables, $params.hourly)}
			>
				<VariableCheckboxGroups
					class="grid md:grid-cols-2"
					groups={additionalVariables}
					bind:values={$params.hourly}
					idSuffix="hourly"
				/>

				<small class="text-muted-foreground mt-1">
					Note: You can further adjust the forecast time range for hourly weather variables using <mark
						>&forecast_hours=</mark
					>
					and <mark>&past_hours=</mark> as shown below.
				</small>
				<div class=" mt-2 grid grid-cols-1 gap-3 md:mt-4 md:grid-cols-4 md:gap-6">
					<div class="relative">
						<Select.Root name="forecast_hours" type="single" bind:value={$params.forecast_hours}>
							<Select.Trigger class="data-placeholder:text-foreground h-12 cursor-pointer pt-6"
								>{forecastHours?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each forecastHoursOptions as { value, label } (value)}
									<Select.Item {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
								>Forecast Hours</Label
							>
						</Select.Root>
					</div>
					<div class="relative">
						<Select.Root name="past_hours" type="single" bind:value={$params.past_hours}>
							<Select.Trigger class="data-placeholder:text-foreground h-12 cursor-pointer pt-6"
								>{pastHours?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each pastHoursOptions as { value, label } (value)}
									<Select.Item {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
								>Past Hours</Label
							>
						</Select.Root>
					</div>

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
				count={countVariables(solarVariables, $params.hourly)}
			>
				<VariableCheckboxGroups
					class="grid md:grid-cols-2"
					groups={solarVariables}
					bind:values={$params.hourly}
					idSuffix="hourly"
				/>

				<small class="text-muted-foreground mt-1">
					Note: Solar radiation is averaged over the past hour. Use
					<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI please
					specify Tilt and Azimuth below.
				</small>

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
				id="height-levels"
				title="Height Level Variables"
				count={countHeightVariables(heightVariables, heights, $params.hourly)}
			>
				<div class="flex gap-3 md:gap-6">
					<div class="md:min-w-[150px]">
						<ToggleGroup.Root
							type="single"
							bind:value={heightVariablesTab}
							class="justify-start gap-0"
						>
							<div class="border-border flex flex-col rounded-lg border">
								{#each heightVariables as variable, i (i)}
									<ToggleGroup.Item
										value={variable.value}
										class="min-h-12 w-56.25 cursor-pointer rounded-none opacity-100! lg:min-h-[unset] {i ===
										0
											? 'rounded-t-md'
											: ''} {i === heightVariables.length - 1 ? 'rounded-b-md' : ''}"
										disabled={heightVariablesTab === variable.value}
										onclick={() => (heightVariablesTab = variable.value)}
										><div class="flex w-full items-center justify-between gap-2 text-left">
											{variable.label}
											<span class="text-xs">
												{heights.filter((height) =>
													$params.hourly?.includes(`${variable.value}_${height}m`)
												).length
													? '(' +
														heights.filter((height) =>
															$params.hourly?.includes(`${variable.value}_${height}m`)
														).length +
														'/' +
														heights.length +
														')'
													: ''}
											</span>
										</div>
									</ToggleGroup.Item>
								{/each}
							</div>
						</ToggleGroup.Root>
					</div>
					<div>
						{#each heightVariables as variable (variable.value)}
							{#if heightVariablesTab === variable.value}
								<div class="mb-3">{variable.label}</div>
								<div>
									<div class="grid grid-cols-1 lg:grid-cols-3">
										{#each sliceIntoChunks(heights, heights.length / 3 + 1) as chunk, ci (ci)}
											<div>
												{#each chunk as level, k (k)}
													<div class="group flex items-center" title={String(level)}>
														<Checkbox
															id="{variable.value}_{level}m"
															class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
															value="{variable.value}_{level}m"
															checked={$params.hourly?.includes(`${variable.value}_${level}m`)}
															aria-labelledby="{variable.value}_{level}m"
															onCheckedChange={() => {
																if ($params.hourly?.includes(`${variable.value}_${level}m`)) {
																	$params.hourly = $params.hourly.filter((item: string) => {
																		return item !== `${variable.value}_${level}m`;
																	});
																} else {
																	$params.hourly?.push(`${variable.value}_${level}m`);
																	$params.hourly = $params.hourly;
																}
															}}
														/>
														<Label
															for="{variable.value}_{level}m"
															class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]"
															>{level} m
														</Label>
													</div>
												{/each}
											</div>
										{/each}
									</div>
								</div>
							{/if}
						{/each}
						<div class="mt-3">
							<small class="text-muted-foreground"
								>Note: Altitudes are approximate and in meters <strong> above sea level</strong>
								(not above ground). Use <mark>geopotential_height</mark> to get precise altitudes above
								sea level.</small
							>
						</div>
					</div>
				</div>
			</AccordionItem>
			<AccordionItem
				id="pressure-levels"
				title="Pressure Level Variables"
				count={countPressureVariables(pressureVariables, levels, $params.hourly)}
			>
				<div class="flex flex-col gap-3 md:flex-row md:gap-6">
					<div class="w-full md:w-56.75">
						<ToggleGroup.Root
							type="single"
							bind:value={pressureVariablesTab}
							class="justify-start gap-0"
						>
							<div class="border-border flex flex-col rounded-lg border">
								{#each pressureVariables as variable, i (i)}
									<ToggleGroup.Item
										value={variable.value}
										class="min-h-12 w-56.25 cursor-pointer rounded-none py-1.5 opacity-100! lg:min-h-[unset] {i ===
										0
											? 'rounded-t-md rounded-b-none!'
											: ''} {i === pressureVariables.length - 1
											? 'rounded-t-none! rounded-b-md'
											: ''}"
										disabled={pressureVariablesTab === variable.value}
										onclick={() => (pressureVariablesTab = variable.value)}
										><div class="flex w-full items-center justify-between gap-2 text-left">
											{variable.label}
											<span class="text-xs">
												{levels.filter((level) =>
													$params.hourly?.includes(`${variable.value}_${level}hPa`)
												).length
													? '(' +
														levels.filter((level) =>
															$params.hourly?.includes(`${variable.value}_${level}hPa`)
														).length +
														'/' +
														levels.length +
														')'
													: ''}
											</span>
										</div>
									</ToggleGroup.Item>
								{/each}
							</div>
						</ToggleGroup.Root>
					</div>
					<div class="w-full">
						{#each pressureVariables as variable, i (i)}
							{#if pressureVariablesTab === variable.value}
								<div class="mb-3">{variable.label}</div>
								<div>
									<div class="grid grid-cols-1 lg:grid-cols-3">
										{#each sliceIntoChunks(levels, levels.length / 3 + 1) as chunk, j (j)}
											<div>
												{#each chunk as level, k (k)}
													<div class="group flex items-center" title={String(level)}>
														<Checkbox
															id="{variable.value}_{level}hPa"
															class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
															value="{variable.value}_{level}hPa"
															checked={$params.hourly?.includes(`${variable.value}_${level}hPa`)}
															aria-labelledby="{variable.value}_{level}hPa"
															onCheckedChange={() => {
																if ($params.hourly?.includes(`${variable.value}_${level}hPa`)) {
																	$params.hourly = $params.hourly.filter((item: string) => {
																		return item !== `${variable.value}_${level}hPa`;
																	});
																} else if ($params.hourly) {
																	$params.hourly?.push(`${variable.value}_${level}hPa`);
																	$params.hourly = $params.hourly;
																}
															}}
														/>
														<Label
															for="{variable.value}_{level}hPa"
															class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]"
															>{level} hPa
															<small class="text-muted-foreground"
																>({altitudeAboveSeaLevelMeters(level)})</small
															></Label
														>
													</div>
												{/each}
											</div>
										{/each}
									</div>
								</div>
							{/if}
						{/each}
					</div>
				</div>
				<div class="mt-3 lg:ml-62.25">
					<small class="text-muted-foreground"
						>Note: Altitudes are approximate and in meters <strong> above sea level</strong>
						(not above ground). Use <mark>geopotential_height</mark> to get precise altitudes above sea
						level.</small
					>
				</div>
			</AccordionItem>
			<AccordionItem
				id="models"
				title="Weather models"
				count={countVariables(models, $params.models)}
			>
				<VariableCheckboxGroups
					class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
					groupClass="mb-3"
					groups={models}
					bind:values={$params.models}
					idSuffix="model"
				/>
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

	<!-- DAILY -->
	<div class="mt-6 md:mt-12">
		<a href="#daily_weather_variables"
			><h2 id="daily_weather_variables" class="text-2xl md:text-3xl">Daily Weather Variables</h2></a
		>
		<VariableCheckboxGroups
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
			groups={daily}
			bind:values={$params.daily}
			idSuffix="daily"
		/>
		{#if timezoneInvalid}
			<div transition:slide>
				<Alert.Root variant="warning" class="mt-2 md:mt-4">
					<Alert.Description>
						It is recommended to select a timezone for daily data. Per default the API will use
						GMT+0.
					</Alert.Description>
				</Alert.Root>
			</div>
		{/if}
	</div>

	<!-- CURRENT -->
	<div class="mt-6 md:mt-12">
		<a href="#current_weather"
			><h2 id="current_weather" class="text-2xl md:text-3xl">Current Weather</h2></a
		>
		<VariableCheckboxGroups
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
			groups={current}
			bind:values={$params.current}
			idSuffix="current"
		/>
		<div class="text-muted-foreground mt-1">
			Note: Current conditions are based on 15-minutely weather model data. Every weather variable
			available in hourly data, is available as current condition as well.
		</div>
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6"><LicenceSelector /></div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultsPreview {params} {defaultParameters} model_default="ukmo_seamless" />
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<p>
			This API uses global UKMO Global 10 km weather forecasts and combines them with
			high-resolution UKV 2 km model for the United Kingdom and Ireland. Information about UKMO
			weather models is available <a
				href="https://www.metoffice.gov.uk/services/data/external-data-channels"
				target="_blank">here</a
			>. For UKMO Global, values are interpolated from 3-hourly to 1-hourly after 54 hours and from
			6-hourly data after 144 hours.
		</p>
		<p>
			Note: UKMO open-data has an additional delay of 4 hours. The forecast is therefore not as
			accurate as it could be.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 mt-2 w-full min-w-[1025px] caption-bottom text-left md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<caption class="text-muted-foreground mt-2 table-caption text-left"
					>You can find the update timings in the <a
						class="text-link undeline"
						href="/en/docs/model-updates">model updates documentation</a
					>.</caption
				>
				<thead>
					<tr>
						<th scope="col">Weather Model</th>
						<th scope="col">Region</th>
						<th scope="col">Spatial Resolution</th>
						<th scope="col">Temporal Resolution</th>
						<th scope="col">Forecast Length</th>
						<th scope="col">Update frequency</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">UKMO Global</th>
						<td>Global</td>
						<td>0.09° (~10 km)</td>
						<td
							>Hourly<small class="text-muted-foreground"
								>, 3-hourly after 54 hours, 6-hourly after 144 hours</small
							></td
						>
						<td>7 days</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row">UKMO UKV</th>
						<td>UK and Ireland</td>
						<td>2 km</td>
						<td>Hourly</td>
						<td>2 days</td>
						<td>Every hour</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<ZoomableImage
		figureClass="mt-6"
		src="/images/models/ukmo_uk_deterministic_2km.webp"
		alt="UKMO UKV 2km model area covering UK and Ireland"
	>
		{#snippet caption()}
			UKMO UKV 2km model covering UK and Ireland. Source: UK Met Office.
		{/snippet}
	</ZoomableImage>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<a href="#api_documentation"
		><h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			For a detailed list of all available weather variables please refer to the general <a
				href="/en/docs">Weather Forecast API</a
			>. Only notable remarks are listed below
		</p>
		<ul class="ml-6 list-disc">
			<li>
				<strong>Solar radiation:</strong>UKMO supplies shortwave radiation as instantaneous values.
				Open-Meteo transforms these into backward-averaged radiation to align with the definition
				used by other weather models. However, in the global domain, data shifts to 6-hour
				intervals, rendering instantaneous values useless at that temporal resolution. As a result,
				solar radiation forecasts are only offered for a 2-day forecast horizon, where 1-hourly data
				remains available.
			</li>
			<li>
				<strong>Direct Solar Radiation:</strong> UKMO provides direct solar radiation. Many other weather
				models only provide global solar radiation and direct solar radiation must be calculated user
				separation models.
			</li>
			<li>
				<strong>Wind, temperature and cloud forecasts on height levels 100m and above:</strong> Forecasts
				at different levels above ground are only available for the 2 km UKV model.
			</li>
			<li>
				<strong>Cloud Cover (2m):</strong> UKMO UKV 2 km provides cloud cover at 2 metre above ground
				which can be interpreted as fog. This is remarkable, because only very weather models are capable
				of modeling low level cloud cover and fog with a good degree of accuracy.
			</li>
		</ul>
	</div>
</div>

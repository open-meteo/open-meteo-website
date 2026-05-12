<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { sliceIntoChunks } from '$lib/utils';
	import {
		altitudeAboveSeaLevelMeters,
		countPressureVariables,
		countVariables
	} from '$lib/utils/meteo';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import DatePicker from '$lib/components/date/date-picker.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import Settings from '$lib/components/settings/settings.svelte';

	import {
		forecastHoursOptions,
		forecastMinutely15Options,
		gridCellSelectionOptions,
		models,
		pastHoursOptions,
		pastMinutely15Options,
		temporalResolutionOptions
	} from '../options';
	import {
		additionalDaily,
		additionalVariables,
		daily,
		defaultParameters,
		hourly,
		levels,
		minutely_15,
		pressureVariables,
		solarVariables
	} from './options';

	let d = new SvelteDate();
	d.setDate(d.getDate() - 2);
	let endDateDefault = d.toISOString().split('T')[0];
	d.setDate(d.getDate() - 14);
	let startDateDefault = d.toISOString().split('T')[0];

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		start_date: startDateDefault,
		end_date: endDateDefault,
		...defaultParameters,
		hourly: ['temperature_2m']
	});

	let pressureVariablesTab = $state('temperature');

	let timezoneInvalid = $derived($params.timezone == 'UTC' && ($params.daily?.length ?? 0) > 0);

	let beginDate = new Date('2016-01-01');
	let lastDate = new SvelteDate();
	lastDate.setDate(lastDate.getDate());

	// Additional variable settings
	let forecastHours = $derived(
		forecastHoursOptions.find((fho) => String(fho.value) == $params.forecast_hours)
	);
	let pastHours = $derived(pastHoursOptions.find((pho) => String(pho.value) == $params.past_hours));
	let temporalResolution = $derived(
		temporalResolutionOptions.find((tro) => String(tro.value) == $params.temporal_resolution)
	);
	let cellSelection = $derived(
		gridCellSelectionOptions.find((gcso) => String(gcso.value) == $params.cell_selection)
	);
	let forecastMinutely15 = $derived(
		forecastMinutely15Options.find((fmo) => String(fmo.value) == $params.forecast_minutely_15)
	);
	let pastMinutely15 = $derived(
		pastMinutely15Options.find((pmo) => String(pmo.value) == $params.past_minutely_15)
	);

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
			countPressureVariables(pressureVariables, levels, $params.hourly).active &&
			!accordionValues.includes('pressure-variables')
		) {
			accordionValues.push('pressure-variables');
		}

		if (countVariables(models, $params.models).active && !accordionValues.includes('models')) {
			accordionValues.push('models');
		}

		if (
			(countVariables(minutely_15, $params.minutely_15).active +
				countVariables(solarVariables, $params.minutely_15).active >
				0 ||
				(pastMinutely15 ? pastMinutely15.value : false) ||
				(forecastMinutely15 ? forecastMinutely15.value : false)) &&
			!accordionValues.includes('minutely_15')
		) {
			accordionValues.push('minutely_15');
		}
	});
</script>

<svelte:head>
	<title>Historical Forecast API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/historical-forecast-api" />
	<meta
		name="description"
		content="Access accurate and comprehensive historical weather data with Open-Meteo's API. Explore global weather trends, analyze climate change, and optimize forecasts using reanalysis models and high-resolution weather data. Visit our documentation for detailed variables and parameters."
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
		Historical forecasts archived from the <a class="text-link underline" href="/en/docs"
			>Weather Forecast API</a
		> — same models, same parameters, same response format. Coverage starts around 2022. Each run's
		first few hours are stitched into a continuous hourly timeseries. To access the full forecast
		horizon of individual runs, use the
		<a class="text-link underline" href="/en/docs/single-runs-api">Single Runs API</a>.
	</Alert.Description>
</Alert.Root>

<form method="get" action="https://historical-forecast-api.open-meteo.com/v1/forecast">
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<div class="mt-6 flex flex-col gap-4 lg:flex-row">
		<div class="mb-3 lg:w-1/2">
			<DatePicker
				bind:start_date={$params.start_date}
				bind:end_date={$params.end_date}
				{beginDate}
				{lastDate}
			/>
		</div>
		<div class="lg:w-1/2">
			<p>Past weather forecasts from 2022 onwards are available.</p>
			<div class="flex flex-wrap items-center gap-2">
				Quick:
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={() => {
						$params.start_date = '2022-01-01';
						$params.end_date = '2022-12-31';
					}}>2022</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={() => {
						$params.start_date = '2023-01-01';
						$params.end_date = '2023-12-31';
					}}>2023</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={() => {
						$params.start_date = '2024-01-01';
						$params.end_date = '2024-12-31';
					}}>2024</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={() => {
						$params.start_date = '2025-01-01';
						$params.end_date = endDateDefault;
					}}>2025</Button
				>
			</div>
		</div>
	</div>

	<!-- HOURLY -->
	<div class="mt-6 md:mt-12">
		<a href="#hourly_weather_variables"
			><h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">
				Hourly Weather Variables
			</h2></a
		>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each hourly as group, i (i)}
				<div>
					{#each group as { value, label } (value)}
						<div class="group flex items-center" title={label}>
							<Checkbox
								id="{value}_hourly"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								{value}
								checked={$params.hourly?.includes(value)}
								aria-labelledby="{value}_label"
								onCheckedChange={() => {
									if ($params.hourly?.includes(value)) {
										$params.hourly = $params.hourly.filter((item: string) => {
											return item !== value;
										});
									} else if ($params.hourly) {
										$params.hourly.push(value);
										$params.hourly = $params.hourly;
									}
								}}
							/>
							<Label
								id="{value}_label"
								for="{value}_hourly"
								class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
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
				<div class="grid md:grid-cols-2">
					{#each additionalVariables as group, i (i)}
						<div>
							{#each group as { value, label } (value)}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{value}_hourly"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										{value}
										checked={$params.hourly?.includes(value)}
										aria-labelledby="{value}_label"
										onCheckedChange={() => {
											if ($params.hourly?.includes(value)) {
												$params.hourly = $params.hourly.filter((item: string) => {
													return item !== value;
												});
											} else if ($params.hourly) {
												$params.hourly.push(value);
												$params.hourly = $params.hourly;
											}
										}}
									/>
									<Label
										id="{value}_label"
										for="{value}_hourly"
										class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>

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
				<div class="grid md:grid-cols-2">
					{#each solarVariables as group, i (i)}
						<div>
							{#each group as { value, label } (value)}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{value}_hourly"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										{value}
										checked={$params.hourly?.includes(value)}
										aria-labelledby="{value}_hourly_label"
										onCheckedChange={() => {
											if ($params.hourly?.includes(value)) {
												$params.hourly = $params.hourly.filter((item: string) => {
													return item !== value;
												});
											} else if ($params.hourly) {
												$params.hourly.push(value);
												$params.hourly = $params.hourly;
											}
										}}
									/>
									<Label
										id="{value}_hourly_label"
										for="{value}_hourly"
										class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>

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
																	$params.hourly.push(`${variable.value}_${level}hPa`);
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
			<AccordionItem
				id="minutely_15"
				title="15-Minutely Weather Variables"
				count={{
					active:
						countVariables(solarVariables, $params.minutely_15).active +
						countVariables(minutely_15, $params.minutely_15).active,
					total:
						countVariables(solarVariables, $params.minutely_15).total +
						countVariables(minutely_15, $params.minutely_15).total
				}}
			>
				<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
					{#each minutely_15 as group, i (i)}
						<div>
							{#each group as { value, label } (value)}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{value}_minutely_15"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										value="{value}_minutely_15"
										checked={$params.minutely_15?.includes(value)}
										aria-labelledby="{value}_minutely_15_label"
										onCheckedChange={() => {
											if ($params.minutely_15?.includes(value)) {
												$params.minutely_15 = $params.minutely_15.filter((item: string) => {
													return item !== value;
												});
											} else if ($params.minutely_15) {
												$params.minutely_15.push(value);
												$params.minutely_15 = $params.minutely_15;
											}
										}}
									/>
									<Label
										id="{value}_minutely_15_label"
										for="{value}_minutely_15"
										class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>

				<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
					{#each solarVariables as group, i (i)}
						<div>
							{#each group as { value, label } (value)}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{value}_minutely_15"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										value="{value}_minutely_15"
										checked={$params.minutely_15?.includes(value)}
										aria-labelledby="{value}_minutely_15_label"
										onCheckedChange={() => {
											if ($params.minutely_15?.includes(value)) {
												$params.minutely_15 = $params.minutely_15.filter((item: string) => {
													return item !== value;
												});
											} else if ($params.minutely_15) {
												$params.minutely_15.push(value);
												$params.minutely_15 = $params.minutely_15;
											}
										}}
									/>
									<Label
										id="{value}_minutely_15_label"
										for="{value}_minutely_15"
										class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>

				<div>
					<small class="text-muted-foreground"
						>Note: Only available in Central Europe and North America. Other regions use
						interpolated hourly data. Solar radiation is averaged over the 15 minutes. Use
						<mark>instant</mark> for radiation at the indicated time.</small
					>
				</div>
				<div>
					<small class="text-muted-foreground"
						>Note: You can further adjust the forecast time range for 15-minutely weather variables
						using <mark>&forecast_minutely_15=</mark> and <mark>&past_minutely_15=</mark> as shown below.
					</small>
				</div>
				<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-2 md:gap-6">
					<div class="relative">
						<Select.Root
							name="cell_selection"
							type="single"
							bind:value={$params.forecast_minutely_15}
						>
							<Select.Trigger class="data-placeholder:text-foreground h-12 cursor-pointer pt-6"
								>{forecastMinutely15?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each forecastMinutely15Options as { value, label } (value)}
									<Select.Item {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
								>Forecast Minutely 15</Label
							>
						</Select.Root>
					</div>
					<div class="relative">
						<Select.Root name="cell_selection" type="single" bind:value={$params.past_minutely_15}>
							<Select.Trigger class="data-placeholder:text-foreground h-12 cursor-pointer pt-6"
								>{pastMinutely15?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each pastMinutely15Options as { value, label } (value)}
									<Select.Item {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
								>Past Minutely 15</Label
							>
						</Select.Root>
					</div>
				</div>
			</AccordionItem>
		</Accordion.Root>
	</div>

	<!-- DAILY -->
	<div class="mt-6 md:mt-12">
		<a href="#daily_weather_variables"
			><h2 id="daily_weather_variables" class="text-2xl md:text-3xl">Daily Weather Variables</h2></a
		>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each daily as group, i (i)}
				<div>
					{#each group as { value, label } (value)}
						<div class="group flex items-center" title={label}>
							<Checkbox
								id="{value}_daily"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								{value}
								checked={$params.daily?.includes(value)}
								aria-labelledby="{value}_daily_label"
								onCheckedChange={() => {
									if ($params.daily?.includes(value)) {
										$params.daily = $params.daily.filter((item: string) => {
											return item !== value;
										});
									} else if ($params.daily) {
										$params.daily.push(value);
										$params.daily = $params.daily;
									}
								}}
							/>
							<Label
								id="{value}_daily_label"
								for="{value}_daily"
								class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
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

		<Accordion.Root type="single" class="border-border mt-3 rounded-lg border md:mt-6">
			<AccordionItem
				id="additional-daily-variables"
				title="Additional Daily Variables"
				count={countVariables(additionalDaily, $params.daily)}
			>
				<div
					class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
				>
					{#each additionalDaily as group, i (i)}
						<div>
							{#each group as { value, label } (value)}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{value}_daily"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										{value}
										checked={$params.daily?.includes(value)}
										aria-labelledby="{value}_daily_label"
										onCheckedChange={() => {
											if ($params.daily?.includes(value)) {
												$params.daily = $params.daily.filter((item: string) => {
													return item !== value;
												});
											} else if ($params.daily) {
												$params.daily.push(value);
												$params.daily = $params.daily;
											}
										}}
									/>
									<Label
										id="{value}_daily_label"
										for="{value}_daily"
										class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</AccordionItem>
		</Accordion.Root>
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6"><LicenceSelector /></div>
</form>

<!-- RESULTS -->
<div class="mt-6 md:mt-12">
	<ResultsPreview {params} {defaultParameters} type="historical-forecast" useStockChart={true} />
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<p>
			The weather data precisely aligns with the weather forecast API, created by continuously
			integrating weather forecast model data. Each update from the weather models' initial hours is
			compiled into a seamless time series. This extensive dataset is ideal for training machine
			learning models and combining them with forecast data to generate optimised predictions.
		</p>
		<p>
			Weather models are initialized using data from weather stations, satellites, radar, airplanes,
			soundings, and buoys. With high update frequencies of 1, 3, or 6 hours, the resulting time
			series is nearly as accurate as direct measurements and offers global coverage. In regions
			like North America and Central Europe, the difference from local weather stations is minimal.
			However, for precise values such as precipitation, local measurements are preferable when
			available.
		</p>
		<p>
			The Historical Forecast API archives comprehensive data, including atmospheric pressure
			levels, from all accessible weather forecast models. Depending on the model and public archive
			availability, data is available starting from 2021 or 2022.
		</p>
		<p>
			The default <mark>Best Match</mark> option selects the most suitable high-resolution weather models
			for any global location, though users can also manually specify the weather model. Open-Meteo utilises
			the following weather forecast models:
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 mt-2 w-full min-w-[1280px] caption-bottom text-left md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<thead>
					<tr>
						<th scope="col">National Weather Provider</th>
						<th scope="col">Weather Model</th>
						<th scope="col">Region</th>
						<th scope="col">Spatial Resolution</th>
						<th scope="col">Temporal Resolution</th>
						<th scope="col">Update Frequency</th>
						<th scope="col">Available Since</th>
					</tr>
				</thead>
				<tbody class="[&_a]:text-link [&_a]:underline [&_a]:underline-offset-3">
					<tr>
						<th scope="row" rowspan="3">Deutscher Wetterdienst (DWD)</th>
						<td>ICON</td>
						<td>Global</td>
						<td>0.1° (~11 km)</td>
						<td>Hourly</td>
						<td>Every 6 hours</td>
						<td>2022-11-24</td>
					</tr>
					<tr>
						<td>ICON-EU</td>
						<td>Europe</td>
						<td>0.0625° (~7 km)</td>
						<td>Hourly</td>
						<td>Every 3 hours</td>
						<td>2022-11-24</td>
					</tr>
					<tr>
						<td>ICON-D2</td>
						<td>Central Europe</td>
						<td>0.02° (~2 km)</td>
						<td>Hourly</td>
						<td>Every 3 hours</td>
						<td>2022-11-24</td>
					</tr>
					<tr>
						<th scope="row" rowspan="8">NOAA NCEP</th>
						<td>GFS</td>
						<td>Global</td>
						<td>0.11° (~13 km)</td>
						<td>Hourly</td>
						<td>Every 6 hours</td>
						<td>2021-03-23</td>
					</tr>
					<tr>
						<td>GFS Pressure Variables</td>
						<td>Global</td>
						<td>0.25° (~25 km)</td>
						<td>Hourly</td>
						<td>Every 6 hours</td>
						<td>2021-03-23</td>
					</tr>
					<tr>
						<td>HRRR</td>
						<td>U.S. Conus</td>
						<td>3 km</td>
						<td>Hourly</td>
						<td>Every hour</td>
						<td>2018-01-01</td>
					</tr>
					<tr>
						<td>NAM</td>
						<td>U.S. Conus</td>
						<td>3 km</td>
						<td>Hourly</td>
						<td>Every 6 hours</td>
						<td>2025-09-01</td>
					</tr>
					<tr>
						<td>NBM</td>
						<td>U.S. Conus</td>
						<td>3 km</td>
						<td>Hourly</td>
						<td>Every hour</td>
						<td>2024-10-08</td>
					</tr>
					<tr>
						<td>GFS GraphCast</td>
						<td>Global</td>
						<td>0.25° (~25 km)</td>
						<td>6-Hourly</td>
						<td>Every 6 hours</td>
						<td>2024-02-05</td>
					</tr>
					<tr>
						<td>AIGFS</td>
						<td>Global</td>
						<td>0.25° (~25 km)</td>
						<td>6-Hourly</td>
						<td>Every 6 hours</td>
						<td>2026-01-07</td>
					</tr>
					<tr>
						<td>HGEFS</td>
						<td>Global</td>
						<td>0.25° (~25 km)</td>
						<td>6-Hourly</td>
						<td>Every 6 hours</td>
						<td>2026-01-07</td>
					</tr>
					<tr>
						<th scope="row" rowspan="4">Météo-France</th>
						<td>ARPEGE World</td>
						<td>Global</td>
						<td>0.25° (~25 km)</td>
						<td>Hourly</td>
						<td>Every 6 hours</td>
						<td>2024-01-02</td>
					</tr>
					<tr>
						<td>ARPEGE Europe</td>
						<td>Europe</td>
						<td>0.1° (~11 km)</td>
						<td>Hourly</td>
						<td>Every 6 hours</td>
						<td>2022-11-13</td>
					</tr>
					<tr>
						<td>AROME France</td>
						<td>France</td>
						<td>0.025° (~2.5 km)</td>
						<td>Hourly</td>
						<td>Every 3 hours</td>
						<td>2024-01-02</td>
					</tr>
					<tr>
						<td>AROME France HD</td>
						<td>France</td>
						<td>0.01° (~1.5 km)</td>
						<td>Hourly</td>
						<td>Every 3 hours</td>
						<td>2022-11-13</td>
					</tr>
					<tr>
						<th scope="row" rowspan="4">ECMWF</th>
						<td>IFS 0.4°</td>
						<td>Global</td>
						<td>0.4° (~44 km)</td>
						<td>3-Hourly</td>
						<td>Every 6 hours</td>
						<td>2022-11-07</td>
					</tr>
					<tr>
						<td>IFS 0.25°</td>
						<td>Global</td>
						<td>0.25° (~25 km)</td>
						<td>3-Hourly</td>
						<td>Every 6 hours</td>
						<td>2024-02-03</td>
					</tr>
					<tr>
						<td>AIFS 0.25° Single</td>
						<td>Global</td>
						<td>0.25° (~25 km)</td>
						<td>6-Hourly</td>
						<td>Every 6 hours</td>
						<td>2025-02-20</td>
					</tr>
					<tr>
						<td>IFS HRES</td>
						<td>Global</td>
						<td>9 km (O1280 grid)</td>
						<td>Hourly</td>
						<td>Every 6 hours</td>
						<td>2017-01-01</td>
					</tr>
					<tr>
						<th scope="row" rowspan="2">UK Met Office</th>
						<td>UKMO Global</td>
						<td>Global</td>
						<td>0.09° (~10 km)</td>
						<td>Hourly</td>
						<td>Every 6 hours</td>
						<td>2022-03-01</td>
					</tr>
					<tr>
						<td>UKMO UKV</td>
						<td>UK and Ireland</td>
						<td>2 km</td>
						<td>Hourly</td>
						<td>Every hour</td>
						<td>2022-03-01</td>
					</tr>
					<tr>
						<th scope="row" rowspan="2">JMA</th>
						<td>GSM</td>
						<td>Global</td>
						<td>0.5° (~55 km)</td>
						<td>6-Hourly</td>
						<td>Every 6 hours</td>
						<td>2016-01-01</td>
					</tr>
					<tr>
						<td>MSM</td>
						<td>Japan</td>
						<td>0.05° (~5 km)</td>
						<td>Hourly</td>
						<td>Every 3 hours</td>
						<td>2016-01-01</td>
					</tr>
					<tr>
						<th scope="row">MET Norway</th>
						<td>MET Nordic</td>
						<td>Norway, Denmark, Sweden, Finland</td>
						<td>1 km</td>
						<td>Hourly</td>
						<td>Every hour</td>
						<td>2022-11-15</td>
					</tr>
					<tr>
						<th scope="row" rowspan="3">Canadian Weather Service</th>
						<td>GEM Global</td>
						<td>Global</td>
						<td>0.15° (~15 km)</td>
						<td>3-Hourly</td>
						<td>Every 12 hours</td>
						<td>2022-11-23</td>
					</tr>
					<tr>
						<td>GEM Regional</td>
						<td>North America, North Pole</td>
						<td>10 km</td>
						<td>Hourly</td>
						<td>Every 6 hours</td>
						<td>2022-11-23</td>
					</tr>
					<tr>
						<td>HRDPS Continental</td>
						<td>Canada, Nothern US</td>
						<td>2.5 km</td>
						<td>Hourly</td>
						<td>Every 6 hours</td>
						<td>2023-03-03</td>
					</tr>
					<tr>
						<th scope="row">China Meteorological Administration (CMA)</th>
						<td>GFS GRAPES</td>
						<td>Global</td>
						<td>0.125° (~15 km)</td>
						<td>3-hourly</td>
						<td>Every 6 hours</td>
						<td>2023-12-31</td>
					</tr>
					<tr>
						<th scope="row">Australian Bureau of Meteorology (BOM)</th>
						<td>ACCESS-G</td>
						<td>Global</td>
						<td>0.15° (~15 km)</td>
						<td>Hourly</td>
						<td>Every 6 hours</td>
						<td>2024-01-18</td>
					</tr>
					<tr>
						<th scope="row">ItaliaMeteo ItaliaMeteo-ARPAE</th>
						<td>ICON 2I</td>
						<td>Southern Europe</td>
						<td>2 km</td>
						<td>Hourly</td>
						<td>Every 12 hours</td>
						<td>2025-04-13</td>
					</tr>
					<tr>
						<th scope="row">DMI</th>
						<td>HARMONIE AROME DINI</td>
						<td>Central & Northern Europe</td>
						<td>2 km</td>
						<td>Hourly</td>
						<td>Every 3 hours</td>
						<td>2024-07-01</td>
					</tr>
					<tr>
						<th scope="row" rowspan="2">KNMI</th>
						<td>HARMONIE AROME Netherlands</td>
						<td>Netherlands, Belgium</td>
						<td>2 km</td>
						<td>Hourly</td>
						<td>Every hour</td>
						<td>2024-07-01</td>
					</tr>
					<tr>
						<td>HARMONIE AROME Europe</td>
						<td>Central & Northern Europe up to Iceland</td>
						<td>5.5 km</td>
						<td>Hourly</td>
						<td>Every hour</td>
						<td>2024-07-01</td>
					</tr>
					<tr>
						<th scope="row" rowspan="2">MeteoSwiss</th>
						<td>ICON CH1</td>
						<td>Central Europe</td>
						<td>1 km</td>
						<td>Hourly</td>
						<td>Every 3 hours</td>
						<td>2025-07-29</td>
					</tr>
					<tr>
						<td>ICON CH2</td>
						<td>Central Europe</td>
						<td>2 km</td>
						<td>Hourly</td>
						<td>Every 6 hours</td>
						<td>2025-07-29</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<div class="mt-6 md:mt-12">
	<a href="#which_historical_weather_data_to_use">
		<h2 id="which_historical_weather_data_to_use" class="text-2xl md:text-3xl">
			Which Historical Weather Data to Use?
		</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			Open-Meteo offers four distinct historical weather datasets, each suited to different use
			cases. Only a small fraction of the Earth's surface has reliable, continuous weather station
			coverage; all four datasets use numerical weather models to fill that gap globally.
		</p>
		<ul class="ml-6 list-disc">
			<li>
				<strong
					><a class="text-link underline" href="/en/docs/historical-weather-api"
						>Historical Weather API:</a
					></strong
				> ERA5 reanalysis at 0.25° (~25 km) from 1940, ERA5-Land at 0.1° (~9 km) from 1950, and ECMWF
				IFS analysis at 9 km from 2017. Optimised for long-term consistency rather than day-to-day
				accuracy — the right choice for climate trend analysis.
			</li>
			<li>
				<strong
					><a class="text-link underline" href="/en/docs/historical-forecast-api"
						>Historical Forecast API:</a
					></strong
				> A continuous hourly timeseries built by stitching the first hours of each successive model
				run. Closely tracks actual conditions because each run is initialised from real measurements.
				Coverage starts around 2021. Not suitable for long time series due to model version changes
				over time.
			</li>
			<li>
				<strong
					><a class="text-link underline" href="/en/docs/previous-runs-api">Previous Runs API:</a
					></strong
				> Archives the same high-resolution models as the Historical Forecast API, but provides each
				variable at a fixed lead-time offset: 1, 2, 3, up to 7 days ahead. Useful for evaluating
				forecast skill at specific lead times. Data starts from January 2024 (GFS from March 2021,
				JMA from 2018).
			</li>
			<li>
				<strong
					><a class="text-link underline" href="/en/docs/single-runs-api">Single Runs API:</a
					></strong
				> Retrieves the complete forecast horizon of any individual model run, selected by
				initialisation time using the <mark>run=</mark> parameter (e.g.
				<mark>run=2025-09-01T00:00</mark>). Unlike the Historical Forecast API — which stitches
				runs into a continuous timeseries — the Single Runs API preserves the original run
				structure. ECMWF IFS HRES at 9 km is archived from March 2024; all other models from
				September 2025.
			</li>
		</ul>
		<h4 class="my-2 text-lg md:my-4 md:text-xl">Choosing the Right Dataset:</h4>
		<ul class="ml-6 list-disc">
			<li>
				For multi-decade climate analysis, use the <strong>Historical Weather API</strong> (ERA5 from
				1940).
			</li>
			<li>
				For the most accurate representation of past conditions over the last few years, use the
				<strong>Historical Forecast API</strong>.
			</li>
			<li>
				To assess how forecast accuracy degrades at longer lead times, use the <strong
					>Previous Runs API</strong
				>.
			</li>
			<li>
				To retrieve the full output of a specific model run — for example to reproduce a forecast
				issued on a given date — use the <strong>Single Runs API</strong>.
			</li>
			<li>
				For training machine learning models on consistent NWP output, the <strong
					>Historical Forecast API</strong
				> and <strong>Single Runs API</strong> both provide data directly from the operational model
				runs.
			</li>
		</ul>
	</div>
</div>

<div class="mt-6 md:mt-12">
	<a href="#api_endpoint">
		<h2 id="api_endpoint" class="text-2xl md:text-3xl">API Endpoint</h2>
	</a>
	<div class="mt-2 md:mt-4">
		<p>
			As the API is identical to the Forecast API, please refer to the Weather Forecast API
			documentation for all available variables and parameters. The only notable difference is the
			API host "historical-forecast-api.open-meteo.com" as historical data is moved to a different
			set of servers with access to a large storage system.
		</p>
	</div>
</div>

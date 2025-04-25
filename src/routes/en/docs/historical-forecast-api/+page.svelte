<script lang="ts">
	import { onMount } from 'svelte';

	import { slide } from 'svelte/transition';

	import {
		countVariables,
		sliceIntoChunks,
		countPressureVariables,
		altitudeAboveSeaLevelMeters
	} from '$lib/utils/meteo';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	import Settings from '$lib/components/settings/settings.svelte';
	import DatePicker from '$lib/components/date/date-picker.svelte';
	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import ResultPreview from '$lib/components/highcharts/result-preview.svelte';
	import LicenseSelector from '$lib/components/license/license-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';

	import {
		daily,
		hourly,
		levels,
		minutely_15,
		solarVariables,
		additionalDaily,
		defaultParameters,
		pressureVariables,
		additionalVariables
	} from './options';

	import {
		pastHoursOptions,
		forecastHoursOptions,
		pastMinutely15Options,
		gridCellSelectionOptions,
		temporalResolutionOptions,
		forecastMinutely15Options,
		models
	} from '../options';

	let d = new Date();
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

	let timezoneInvalid = $derived($params.timezone == 'UTC' && $params.daily.length > 0);

	let begin_date = new Date('2016-01-01');
	let last_date = new Date();
	last_date.setDate(last_date.getDate() - 2);

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
				($params.tilt ? $params.tilt > 0 : false) ||
				($params.azimuth ? $params.azimuth > 0 : false)) &&
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

<Alert.Root class="border-border mb-4">
	<Alert.Description>
		This API provides access to archived high-resolution weather model data from the <a
			class="text-link underline"
			href={'/en/docs'}>Weather Forecast API</a
		>. The data is continuously archived and updated daily. For more information read the
		<a
			class="text-link underline"
			href="https://openmeteo.substack.com/p/introducing-the-historical-forecast"
			title="Introducing the Historical Forecast API">announcement blog article</a
		>.
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
				{begin_date}
				{last_date}
			/>
		</div>
		<div class="lg:w-1/2">
			<p>Past weather forecasts from 2022 onwards are available.</p>
			<div class="flex flex-wrap items-center gap-2">
				Quick:
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={(e) => {
						$params.start_date = '2022-01-01';
						$params.end_date = '2022-12-31';
					}}>2022</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={(e) => {
						$params.start_date = '2023-01-01';
						$params.end_date = '2023-12-31';
					}}>2023</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={(e) => {
						$params.start_date = '2024-01-01';
						$params.end_date = '2024-12-31';
					}}>2024</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={(e) => {
						$params.start_date = '2025-01-01';
						$params.end_date = endDateDefault;
					}}>2025</Button
				>
			</div>
		</div>
	</div>

	<!-- HOURLY -->
	<div class="mt-6 md:mt-12">
		<h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">Hourly Weather Variables</h2>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each hourly as group}
				<div>
					{#each group as e}
						<div class="group flex items-center" title={e.label}>
							<Checkbox
								id="{e.value}_hourly"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								value={e.value}
								checked={$params.hourly?.includes(e.value)}
								aria-labelledby="{e.value}_label"
								onCheckedChange={() => {
									if ($params.hourly?.includes(e.value)) {
										$params.hourly = $params.hourly.filter((item) => {
											return item !== e.value;
										});
									} else {
										$params.hourly.push(e.value);
										$params.hourly = $params.hourly;
									}
								}}
							/>
							<Label
								id="{e.value}_label"
								for="{e.value}_hourly"
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- ADDITIONAL VARIABLES -->
	<div class="mt-6">
		<Accordion.Root class="border-border rounded-lg border" bind:value={accordionValues}>
			<AccordionItem
				id="additional-variables"
				title="Additional Variables And Options"
				count={countVariables(additionalVariables, $params.hourly)}
			>
				<div class="grid md:grid-cols-2">
					{#each additionalVariables as group}
						<div>
							{#each group as e}
								<div class="group flex items-center" title={e.label}>
									<Checkbox
										id="{e.value}_hourly"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										value={e.value}
										checked={$params.hourly?.includes(e.value)}
										aria-labelledby="{e.value}_label"
										onCheckedChange={() => {
											if ($params.hourly?.includes(e.value)) {
												$params.hourly = $params.hourly.filter((item) => {
													return item !== e.value;
												});
											} else {
												$params.hourly.push(e.value);
												$params.hourly = $params.hourly;
											}
										}}
									/>
									<Label
										id="{e.value}_label"
										for="{e.value}_hourly"
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
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
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
								>{forecastHours?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each forecastHoursOptions as fho}
									<Select.Item value={fho.value}>{fho.label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
								>Forecast Hours</Label
							>
						</Select.Root>
					</div>
					<div class="relative">
						<Select.Root name="past_hours" type="single" bind:value={$params.past_hours}>
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
								>{pastHours?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each pastHoursOptions as pho}
									<Select.Item value={pho.value}>{pho.label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
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
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
								>{temporalResolution?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each temporalResolutionOptions as tro}
									<Select.Item value={tro.value}>{tro.label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
								>Temporal Resolution For Hourly Data</Label
							>
						</Select.Root>
					</div>
					<div class="relative md:col-span-2">
						<Select.Root name="cell_selection" type="single" bind:value={$params.cell_selection}>
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
								>{cellSelection?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each gridCellSelectionOptions as gcso}
									<Select.Item value={gcso.value}>{gcso.label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
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
					{#each solarVariables as group}
						<div>
							{#each group as e}
								<div class="group flex items-center" title={e.label}>
									<Checkbox
										id="{e.value}_hourly"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										value={e.value}
										checked={$params.hourly?.includes(e.value)}
										aria-labelledby="{e.value}_hourly_label"
										onCheckedChange={() => {
											if ($params.hourly?.includes(e.value)) {
												$params.hourly = $params.hourly.filter((item) => {
													return item !== e.value;
												});
											} else {
												$params.hourly.push(e.value);
												$params.hourly = $params.hourly;
											}
										}}
									/>
									<Label
										id="{e.value}_hourly_label"
										for="{e.value}_hourly"
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>

				<small class="text-muted-foreground mt-1">
					Note: Solar radiation is averaged over the past hour. Use
					<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI
					please specify Tilt and Azimuth below.
				</small>

				<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-2 md:gap-6">
					<div class="relative">
						<Input
							id="tilt"
							type="number"
							class="h-12 cursor-pointer pt-6 {$params.tilt < 0 || $params.tilt > 90
								? 'text-red'
								: ''}"
							name="tilt"
							step="1"
							min="0"
							max="90"
							bind:value={$params.tilt}
						/>
						<Label
							class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
							for="tilt">Panel Tilt (0° horizontal)</Label
						>
						{#if $params.tilt < 0 || $params.tilt > 90}
							<div class="invalid-tooltip" transition:slide>Tilt must be between 0° and 90°</div>
						{/if}
					</div>

					<div class="relative">
						<Input
							type="number"
							class="h-12 cursor-pointer pt-6 {$params.azimuth < -180 || $params.azimuth > 180
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
							class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
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
				<div class="flex gap-3 md:gap-6">
					<div class="md:min-w-[150px]">
						<ToggleGroup.Root
							type="single"
							bind:value={pressureVariablesTab}
							class="justify-start gap-0"
						>
							<div class="border-border flex flex-col rounded-lg border">
								{#each pressureVariables as variable, i}
									<ToggleGroup.Item
										value={variable.value}
										class="min-h-12 cursor-pointer rounded-none !opacity-100 lg:min-h-[unset] {i ===
										0
											? 'rounded-t-md'
											: ''} {i === pressureVariables.length - 1 ? 'rounded-b-md' : ''}"
										disabled={pressureVariablesTab === variable.value}
										onclick={() => (pressureVariablesTab = variable.value)}
										>{variable.label}
									</ToggleGroup.Item>
								{/each}
							</div>
						</ToggleGroup.Root>
					</div>
					<div>
						{#each pressureVariables as variable}
							{#if pressureVariablesTab === variable.value}
								<div class="mb-3">{variable.label}</div>
								<div>
									<div class="grid grid-cols-1 md:grid-cols-3">
										{#each sliceIntoChunks(levels, levels.length / 3 + 1) as chunk}
											{#each chunk as level}
												<div class="group flex items-center" title={level.label}>
													<Checkbox
														id="{variable.value}_{level}hPa"
														class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
														value="{variable.value}_{level}hPa"
														checked={$params.hourly?.includes(`${variable.value}_${level}hPa`)}
														aria-labelledby="{variable.value}_{level}hPa"
														onCheckedChange={() => {
															if ($params.hourly?.includes(`${variable.value}_${level}hPa`)) {
																$params.hourly = $params.hourly.filter((item) => {
																	return item !== `${variable.value}_${level}hPa`;
																});
															} else {
																$params.hourly.push(`${variable.value}_${level}hPa`);
																$params.hourly = $params.hourly;
															}
														}}
													/>
													<Label
														for="{variable.value}_{level}hPa"
														class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]"
														>{level} hPa
														<small class="text-muted-foreground"
															>({altitudeAboveSeaLevelMeters(level)})</small
														></Label
													>
												</div>
											{/each}
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
				id="models"
				title="Weather models"
				count={countVariables(models, $params.models)}
			>
				<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
					{#each models as group}
						<div class="mb-3">
							{#each group as e}
								<div class="group flex items-center" title={e.label}>
									<Checkbox
										id="{e.value}_model"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										value={e.value}
										checked={$params.models?.includes(e.value)}
										aria-labelledby="{e.value}_label"
										onCheckedChange={() => {
											if ($params.models?.includes(e.value)) {
												$params.models = $params.models.filter((item) => {
													return item !== e.value;
												});
											} else {
												$params.models.push(e.value);
												$params.models = $params.models;
											}
										}}
									/>
									<Label
										id="{e.value}_model_label"
										for="{e.value}_model"
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>
				<div>
					<small class="text-muted-foreground"
						>Note: The default <mark>Best Match</mark> provides the best forecast for any given
						location worldwide. <mark>Seamless</mark> combines all models from a given provider into
						a seamless prediction.</small
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
					{#each minutely_15 as group}
						<div>
							{#each group as e}
								<div class="group flex items-center" title={e.label}>
									<Checkbox
										id="{e.value}_minutely_15"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										value="{e.value}_minutely_15"
										checked={$params.minutely_15?.includes(e.value)}
										aria-labelledby="{e.value}_minutely_15_label"
										onCheckedChange={() => {
											if ($params.minutely_15?.includes(e.value)) {
												$params.minutely_15 = $params.minutely_15.filter((item) => {
													return item !== e.value;
												});
											} else {
												$params.minutely_15.push(e.value);
												$params.minutely_15 = $params.minutely_15;
											}
										}}
									/>
									<Label
										id="{e.value}_minutely_15_label"
										for="{e.value}_minutely_15"
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>

				<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
					{#each solarVariables as group}
						<div>
							{#each group as e}
								<div class="group flex items-center" title={e.label}>
									<Checkbox
										id="{e.value}_minutely_15"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										value="{e.value}_minutely_15"
										checked={$params.minutely_15?.includes(e.value)}
										aria-labelledby="{e.value}_minutely_15_label"
										onCheckedChange={() => {
											if ($params.minutely_15?.includes(e.value)) {
												$params.minutely_15 = $params.minutely_15.filter((item) => {
													return item !== e.value;
												});
											} else {
												$params.minutely_15.push(e.value);
												$params.minutely_15 = $params.minutely_15;
											}
										}}
									/>
									<Label
										id="{e.value}_minutely_15_label"
										for="{e.value}_minutely_15"
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
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
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
								>{forecastMinutely15?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each forecastMinutely15Options as fmo}
									<Select.Item value={fmo.value}>{fmo.label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
								>Forecast Minutely 15</Label
							>
						</Select.Root>
					</div>
					<div class="relative">
						<Select.Root name="cell_selection" type="single" bind:value={$params.past_minutely_15}>
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
								>{pastMinutely15?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each pastMinutely15Options as pmo}
									<Select.Item value={pmo.value}>{pmo.label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
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
		<h2 id="daily_weather_variables" class="text-2xl md:text-3xl">Daily Weather Variables</h2>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each daily as group}
				<div>
					{#each group as e}
						<div class="group flex items-center" title={e.label}>
							<Checkbox
								id="{e.value}_daily"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								value={e.value}
								checked={$params.daily?.includes(e.value)}
								aria-labelledby="{e.value}_daily_label"
								onCheckedChange={() => {
									if ($params.daily?.includes(e.value)) {
										$params.daily = $params.daily.filter((item) => {
											return item !== e.value;
										});
									} else {
										$params.daily.push(e.value);
										$params.daily = $params.daily;
									}
								}}
							/>
							<Label
								id="{e.value}_daily_label"
								for="{e.value}_daily"
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
		{#if timezoneInvalid}
			<div transition:slide>
				<Alert.Root class="bg-warning text-warning-dark border-warning-foreground mt-2 md:mt-4">
					<Alert.Description>
						It is recommended to select a timezone for daily data. Per default the API will use
						GMT+0.
					</Alert.Description>
				</Alert.Root>
			</div>
		{/if}

		<Accordion.Root class="mt-3 md:mt-6 border-border rounded-lg border">
			<AccordionItem
				id="additional-daily-variables"
				title="Additional Daily Variables"
				count={countVariables(additionalDaily, $params.daily)}
			>
				<div
					class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
				>
					{#each additionalDaily as group}
						<div>
							{#each group as e}
								<div class="group flex items-center" title={e.label}>
									<Checkbox
										id="{e.value}_daily"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										value={e.value}
										checked={$params.daily?.includes(e.value)}
										aria-labelledby="{e.value}_daily_label"
										onCheckedChange={() => {
											if ($params.daily?.includes(e.value)) {
												$params.daily = $params.daily.filter((item) => {
													return item !== e.value;
												});
											} else {
												$params.daily.push(e.value);
												$params.daily = $params.daily;
											}
										}}
									/>
									<Label
										id="{e.value}_daily_label"
										for="{e.value}_daily"
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
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
	<div class="mt-3 md:mt-6"><LicenseSelector /></div>
</form>

<!-- RESULTS -->
<div class="mt-6 md:mt-12">
	<ResultPreview {params} {defaultParameters} type="historical-forecast" useStockChart={true} />
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2>
	<div class="mt-2 md:mt-4">
		<p>
			The weather data precisely aligns with the weather forecast API, created by continuously
			integrating weather forecast model data. Each update from the weather models' initial hours is
			compiled into a seamless time series. This extensive dataset is ideal for training machine
			learning models and combining them with forecast data to generate optimized predictions.
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
			for any global location, though users can also manually specify the weather model. Open-Meteo utilizes
			the following weather forecast models:
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 w-full min-w-[1280px] caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
				<tbody class="[&_a]:text-link [&_a]:underline-offset-3 [&_a]:underline">
					<tr>
						<th scope="row" rowspan="3">Deutscher Wetterdienst (DWD)</th>
						<td>ICON</td>
						<td>Global</td>
						<td>0.1° (~11 km)</td>
						<td>1-Hourly</td>
						<td>Every 6 hours</td>
						<td>2022-11-24</td>
					</tr>
					<tr>
						<td>ICON-EU</td>
						<td>Europe</td>
						<td>0.0625° (~7 km)</td>
						<td>1-Hourly</td>
						<td>Every 3 hours</td>
						<td>2022-11-24</td>
					</tr>
					<tr>
						<td>ICON-D2</td>
						<td>Central Europe</td>
						<td>0.02° (~2 km)</td>
						<td>1-Hourly</td>
						<td>Every 3 hours</td>
						<td>2022-11-24</td>
					</tr>
					<tr>
						<th scope="row" rowspan="5">NOAA NCEP</th>
						<td>GFS</td>
						<td>Global</td>
						<td>0.11° (~13 km)</td>
						<td>1-Hourly</td>
						<td>Every 6 hours</td>
						<td>2021-03-23</td>
					</tr>
					<tr>
						<td>GFS Pressure Variables</td>
						<td>Global</td>
						<td>0.25° (~25 km)</td>
						<td>1-Hourly</td>
						<td>Every 6 hours</td>
						<td>2021-03-23</td>
					</tr>
					<tr>
						<td>HRRR</td>
						<td>U.S. Conus</td>
						<td>3 km</td>
						<td>1-Hourly</td>
						<td>Every hour</td>
						<td>2018-01-01</td>
					</tr>
					<tr>
						<td>NBM</td>
						<td>U.S. Conus</td>
						<td>3 km</td>
						<td>1-Hourly</td>
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
						<th scope="row" rowspan="4">Météo-France</th>
						<td>ARPEGE World</td>
						<td>Global</td>
						<td>0.25° (~25 km)</td>
						<td>1-Hourly</td>
						<td>Every 6 hours</td>
						<td>2024-01-02</td>
					</tr>
					<tr>
						<td>ARPEGE Europe</td>
						<td>Europe</td>
						<td>0.1° (~11 km)</td>
						<td>1-Hourly</td>
						<td>Every 6 hours</td>
						<td>2022-11-13</td>
					</tr>
					<tr>
						<td>AROME France</td>
						<td>Global</td>
						<td>0.025° (~2.5 km)</td>
						<td>1-Hourly</td>
						<td>Every 3 hours</td>
						<td>2024-01-02</td>
					</tr>
					<tr>
						<td>AROME France HD</td>
						<td>Global</td>
						<td>0.01° (~1.5 km)</td>
						<td>1-Hourly</td>
						<td>Every 3 hours</td>
						<td>2022-11-13</td>
					</tr>
					<tr>
						<th scope="row" rowspan="3">ECMWF</th>
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
						<td>1-Hourly</td>
						<td>Every 3 hours</td>
						<td>2016-01-01</td>
					</tr>
					<tr>
						<th scope="row">MET Norway</th>
						<td>MET Nordic</td>
						<td>Norway, Denmark, Sweden, Finland</td>
						<td>1 km</td>
						<td>1-Hourly</td>
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
						<td>1-Hourly</td>
						<td>Every 6 hours</td>
						<td>2022-11-23</td>
					</tr>
					<tr>
						<td>HRDPS Continental</td>
						<td>Canada, Nothern US</td>
						<td>2.5 km</td>
						<td>1-Hourly</td>
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
						<td>1-Hourly</td>
						<td>Every 6 hours</td>
						<td>2024-01-18</td>
					</tr>
					<tr>
						<th scope="row">ItaliaMeteo ItaliaMeteo-ARPAE</th>
						<td>ICON 2I</td>
						<td>Southern Europe</td>
						<td>2 km</td>
						<td>1-Hourly</td>
						<td>Every 12 hours</td>
						<td>2025-04-13</td>
					</tr>
					<tr>
						<th scope="row">DMI</th>
						<td>HARMONIE AROME DINI</td>
						<td>Central & Northern Europe</td>
						<td>2 km</td>
						<td>1-Hourly</td>
						<td>Every 3 hours</td>
						<td>2024-07-01</td>
					</tr>
					<tr>
						<th scope="row" rowspan="2">KNMI</th>
						<td>HARMONIE AROME Netherlands</td>
						<td>Netherlands, Belgium</td>
						<td>2 km</td>
						<td>1-Hourly</td>
						<td>Every hour</td>
						<td>2024-07-01</td>
					</tr>
					<tr>
						<td>HARMONIE AROME Europe</td>
						<td>Central & Northern Europe up to Iceland</td>
						<td>5.5 km</td>
						<td>1-Hourly</td>
						<td>Every hour</td>
						<td>2024-07-01</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<div class="mt-6 md:mt-12">
	<h2 class="text-2xl md:text-3xl">Which Historical Weather Data to Use?</h2>
	<div class="mt-2 md:mt-4">
		<p>
			Open-Meteo provides various datasets for historical weather data: the Historical Weather API
			and the Historical Forecast API. For novice users expecting a single, definitive source of
			weather data, this can be confusing. In reality, only a small fraction of the Earth's surface
			is covered by weather stations with accurate and consistent measurements. To address this gap,
			numerical weather models are used to approximate past global weather.
		</p>
		<ul class="ml-6 list-disc">
			<li>
				<strong
					><a class="text-link underline" href={'/en/docs/historical-weather-api'}
						>Historical Weather API:</a
					></strong
				> This dataset is based on reanalysis weather models, particularly ERA5. It offers data from
				1940 onwards with reasonable consistency throughout the time series, making it ideal for analyzing
				weather trends and climate change. The focus here is on consistency rather than pinpoint accuracy,
				with a spatial resolution ranging from 9 to 25 kilometers.
			</li>
			<li>
				<strong
					><a class="text-link underline" href={'/en/docs/historical-forecast-api'}
						>Historical Forecast API:</a
					></strong
				> This dataset is constructed by continuously assembling weather forecasts, concatenating the
				first hours of each model update. Initialized with actual measurements, it closely mirrors local
				measurements but provides global coverage. However, it only includes data from the past 2-5 years
				and lacks long-term consistency due to evolving weather models and better initialization data
				over time.
			</li>
			<li>
				<strong
					><a class="text-link underline" href={'/en/docs/previous-runs-api'}>Previous Runs API</a
					></strong
				>: Similar to the Historical Forecast API, this dataset archives high-resolution weather
				models but includes data with a lead time offset of 1, 2, 3, 4, or more days. This makes it
				ideal for analyzing forecast performance several days into the future. Due to the vast
				amount of data, only common weather variables are stored, with data processing beginning in
				early 2024.
			</li>
		</ul>
		<h4 class="my-2 text-lg md:my-4 md:text-xl">Choosing the Right Dataset:</h4>
		<ul class="ml-6 list-disc">
			<li>
				For analyzing weather trends or climate change over decades, use the Historical Weather API
				with reanalysis data from 1940 onwards.
			</li>
			<li>
				For higher accuracy over the past few years, the Historical Forecast API with
				high-resolution forecasts is more suitable.
			</li>
			<li>
				To optimize weather forecasts using machine learning, it's essential to use data from the
				same high-resolution weather models, available through both the Historical Forecast API and
				the Previous Runs API.
			</li>
		</ul>
	</div>
</div>

<div class="mt-6 md:mt-12">
	<h2 class="text-2xl md:text-3xl">API Parameter</h2>
	<div class="mt-2 md:mt-4">
		<p>
			As the API is identical to the Forecast API, please refer to the Weather Forecast API
			documentation for all available variables and parameters. The only notable difference is the
			API host "historical-forecast-api.open-meteo.com" as historical data is moved to a different
			set of servers with access to a large storage system.
		</p>
	</div>
</div>

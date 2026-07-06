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
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import Settings from '$lib/components/settings/settings.svelte';

	import {
		forecastDaysOptions,
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
	d.setUTCDate(d.getUTCDate() - 1);
	d.setUTCHours(0);
	d.setUTCMinutes(0);
	d.setUTCSeconds(0);
	d.setUTCMilliseconds(0);

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		run: d.toISOString().replace(':00.000Z', ''),
		...defaultParameters,
		models: ['ecmwf_ifs'],
		hourly: ['temperature_2m']
	});

	let forecastDays = $derived(
		forecastDaysOptions.find((fco) => fco.value == $params.forecast_days)
	);

	let pressureVariablesTab = $state('temperature');

	let timezoneInvalid = $derived(
		$params.timezone == 'UTC' && ($params.daily ? $params.daily.length > 0 : false)
	);

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
			$params.hourly &&
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
			$params.hourly &&
			(countVariables(solarVariables, $params.hourly).active ||
				($params.tilt ? Number($params.tilt) > 0 : false) ||
				($params.azimuth ? Number($params.azimuth) > 0 : false)) &&
			!accordionValues.includes('solar-variables')
		) {
			accordionValues.push('solar-variables');
		}

		if (
			$params.hourly &&
			countPressureVariables(pressureVariables, levels, $params.hourly).active &&
			!accordionValues.includes('pressure-variables')
		) {
			accordionValues.push('pressure-variables');
		}

		if (
			$params.models &&
			countVariables(models, $params.models).active &&
			!accordionValues.includes('models')
		) {
			accordionValues.push('models');
		}

		if (
			$params.minutely_15 &&
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
	<title>Single Runs API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/single-runs-api" />
	<meta
		name="description"
		content="Retrieve the full forecast horizon of any individual model run by initialisation time. ECMWF IFS 9 km from March 2024, all other models from 2nd of April 2026."
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
		Retrieve the full forecast horizon of any individual model run using the <mark>&run=</mark>
		parameter (e.g. <mark>&run=2025-09-01T00:00</mark>). Most models are archived from 2nd of April
		2026. ECMWF IFS HRES at 9 km is available from March 2024.
	</Alert.Description>
</Alert.Root>

<form method="get" action="https://single-runs-api.open-meteo.com/v1/forecast">
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<div class="mt-3 md:mt-6">
		<div class="grid gap-3 md:gap-6 lg:grid-cols-2">
			<div class="grid gap-3 sm:grid-cols-2 md:gap-6">
				<div class="relative">
					<Input
						id="run"
						type="text"
						class="h-12 cursor-pointer pt-6"
						name="run"
						bind:value={$params.run}
					/>
					<Label
						class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
						for="run">Run (yyyy-mm-ddThh:mm)</Label
					>
				</div>
				<div class="relative">
					<Select.Root name="forecast_days" type="single" bind:value={$params.forecast_days}>
						<Select.Trigger
							aria-label="Forecast days input"
							class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{forecastDays?.label}</Select.Trigger
						>
						<Select.Content preventScroll={false} class="border-border">
							{#each forecastDaysOptions as { value, label } (value)}
								<Select.Item class="cursor-pointer" {value}>{label}</Select.Item>
							{/each}
						</Select.Content>
						<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
							>Forecast days</Label
						>
					</Select.Root>
				</div>
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
										class="min-h-12 w-56.25 cursor-pointer rounded-none opacity-100! lg:min-h-[unset] {i ===
										0
											? 'rounded-t-md'
											: ''} {i === pressureVariables.length - 1 ? 'rounded-b-md' : ''}"
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
							name="forecast_minutely_15"
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
						<Select.Root
							name="past_minutely_15"
							type="single"
							bind:value={$params.past_minutely_15}
						>
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
	<div class="mt-3 md:mt-6"><LicenceSelector requires_professional_plan={true} /></div>
</form>

<!-- RESULTS -->
<div class="mt-6 md:mt-12">
	<ResultsPreview {params} {defaultParameters} type="single-runs" useStockChart={true} />
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<div class="grid gap-4 md:gap-6 lg:grid-cols-2">
			<p>
				Weather models are initialised and computed multiple times per day. Each run ingests the
				latest observations — radiosondes, weather stations, aircraft, satellites, and ocean buoys —
				and produces a complete forecast out to the model's full horizon (typically 7–16 days). The
				operational Open-Meteo Forecast API stitches the most recent run of each model into a
				seamless, continuously updated time-series. That approach is ideal for end-user applications
				but discards the individual run structure required for research, post-processing, and
				backtesting workflows.
			</p>
			<p>
				The Single Runs API preserves this structure. Each run is stored and retrievable
				independently, so you can request the exact forecast issued at a specific initialisation
				time. The <mark>&run=</mark> parameter identifies the run by its UTC initialisation
				datetime, e.g. <mark>&run=2025-09-01T00:00</mark>.
			</p>
			<p>
				The <mark>&run=</mark> parameter specifies the model's <strong>initialisation time</strong>
				— the UTC reference time at which the observations are taken — not the time at which the forecast
				output becomes publicly available. After initialisation, the model requires additional computation
				time before results are distributed: typically 4–6 hours for global models (e.g. ECMWF IFS, GFS)
				and 1–3 hours for regional models. This means a run initialised at 00 UTC is generally accessible
				from approximately 04–06 UTC onwards. The exact availability times for each model are listed on
				the
				<a class="text-link underline" href="/en/docs/model-updates">model updates page</a>.
			</p>
			<p>
				Archival runs are available from <strong>2nd of April 2026</strong> for most models.
				<strong>ECMWF IFS HRES at native 9 km resolution</strong>
				is available from
				<strong>March 14, 2024</strong> (IFS Cycle 49R1 hindcasts). From May 12, 2026 06 UTC, runs
				use the updated <strong>IFS Cycle 50R1</strong>. ECMWF IFS HRES is the highest-quality
				global weather model and the backbone of the
				<a class="text-link underline" href="/en/docs/historical-weather-api"
					>Open-Meteo Historical Weather API</a
				>. Access to individual ECMWF runs is particularly valuable for renewable energy
				forecasting, where the full forecast horizon from a single run drives production scheduling
				and trading decisions.
			</p>
		</div>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 mt-4 w-full min-w-[1100px] caption-bottom text-left md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<thead>
					<tr>
						<th scope="col">Weather Provider</th>
						<th scope="col">Model</th>
						<th scope="col">Region</th>
						<th scope="col">Resolution</th>
						<th scope="col">Temporal Resolution</th>
						<th scope="col">Forecast Horizon</th>
						<th scope="col">Run Frequency</th>
						<th scope="col">Available From</th>
					</tr>
				</thead>
				<tbody class="[&_a]:text-link [&_a]:underline [&_a]:underline-offset-3">
					<tr>
						<th scope="row">ECMWF</th>
						<td><a href="/en/docs/ecmwf-api">IFS HRES 9 km</a></td>
						<td>Global</td>
						<td>9 km (O1280 grid)</td>
						<td>Hourly</td>
						<td>10 days</td>
						<td>4× daily (00, 06, 12, 18 UTC)</td>
						<td>2024-03-14</td>
					</tr>
					<tr>
						<th scope="row">Others</th>
						<td>-</td>
						<td>Global & Regional</td>
						<td>up to 1 km</td>
						<td>up to 15 minutely</td>
						<td>up to 16 days</td>
						<td>-</td>
						<td>2026-04-02</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- API ENDPOINT -->
<div class="mt-6 md:mt-12">
	<a href="#api_endpoint">
		<h2 id="api_endpoint" class="text-2xl md:text-3xl">API Endpoint</h2>
	</a>
	<div class="mt-2 md:mt-4">
		<p>
			The API endpoint <mark>https://single-runs-api.open-meteo.com/v1/forecast</mark> accepts the
			same parameters as the
			<a class="text-link underline" href="/en/docs">Weather Forecast API</a>, with one additional
			required parameter: <mark>run</mark>. All weather variables, units, and output formats
			available in the Forecast API are supported. Data is served from a dedicated archive storage
			system, so response times may be higher than the real-time forecast API.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 mt-2 w-full min-w-[800px] caption-bottom text-left md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<thead>
					<tr>
						<th scope="col">Parameter</th>
						<th scope="col">Format</th>
						<th scope="col">Required</th>
						<th scope="col">Default</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">run</th>
						<td>ISO 8601 datetime</td>
						<td>Yes</td>
						<td></td>
						<td
							>The initialisation date and time of the model run to retrieve. Must be provided in
							ISO 8601 format without seconds, e.g. <mark>&run=2024-06-01T00:00</mark>. The time
							must correspond to a valid run cycle for the selected model (e.g. 00, 06, 12, 18 UTC
							for most global models). Runs that are not available will return an error.</td
						>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="mt-3 md:mt-6">
			All other parameters from the Forecast API — including <mark>latitude</mark>,
			<mark>longitude</mark>, <mark>hourly</mark>, <mark>daily</mark>, and others — are also
			accepted unchanged. Please refer to the
			<a class="text-link underline" href="/en/docs">Weather Forecast API documentation</a> for a complete
			parameter reference.
		</p>
	</div>
</div>

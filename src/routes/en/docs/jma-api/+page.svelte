<script lang="ts">
	import { onMount } from 'svelte';

	import { fade, slide } from 'svelte/transition';

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
	import PressureLevelsHelpTable from '$lib/components/pressure/pressure-levels-help-table.svelte';

	import WeatherForecastError from '$lib/components/code/docs/weather-forecast-error.svx';
	import WeatherForecastObject from '$lib/components/code/docs/weather-forecast-object.svx';

	import {
		daily,
		hourly,
		levels,
		models,
		current,
		solarVariables,
		defaultParameters,
		pressureVariables,
		additionalVariables,
		forecastDaysOptions
	} from './options';

	import {
		pastDaysOptions,
		pastHoursOptions,
		forecastHoursOptions,
		gridCellSelectionOptions,
		temporalResolutionOptions
	} from '../options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['temperature_2m']
	});

	let timezoneInvalid = $derived(
		$params.timezone == 'UTC' && ($params.daily ? $params.daily.length > 0 : false)
	);

	let forecastDays = $derived(
		forecastDaysOptions.find((fco) => fco.value == $params.forecast_days)
	);
	let pastDays = $derived(pastDaysOptions.find((pdo) => pdo.value == $params.past_days));

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
	});

	let begin_date = new Date();
	begin_date.setMonth(begin_date.getMonth() - 3);

	let last_date = new Date();
	last_date.setDate(last_date.getDate() + 14);
</script>

<svelte:head>
	<title>JMA API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/jma-api" />
</svelte:head>

<Alert.Root class="border-border mb-4">
	<Alert.Description>
		The API is optimized for Japan, utilizing JMA global GSM and local MSM models. However, for most
		use-cases, we recommend the <a class="text-link underline" href={'/en/docs'}
			>generic Weather Forecast API</a
		>.
	</Alert.Description>
</Alert.Root>

<form method="get" action="https://api.open-meteo.com/v1/jma">
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<div class="mt-6">
		<div class="mt-3 flex items-center gap-2">
			<div class="text-muted-foreground">Time:</div>

			<div class="border-border flex rounded-md border">
				<Button
					variant="ghost"
					class="rounded-e-none !opacity-100 gap-1 duration-300 {$params.time_mode ===
					'forecast_days'
						? 'bg-accent cursor-not-allowed'
						: ''}"
					disabled={$params.time_mode === 'forecast_days'}
					onclick={() => {
						$params.time_mode = 'forecast_days';
						$params.start_date = '';
						$params.end_date = '';
					}}
				>
					<svg
						class="lucide lucide-clock mr-[2px]"
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>Forecast Length
				</Button>
				<Button
					variant="ghost"
					class="rounded-s-none !opacity-100 gap-1 duration-300  {$params.time_mode ===
					'time_interval'
						? 'bg-accent'
						: ''}"
					disabled={$params.time_mode === 'time_interval'}
					onclick={() => {
						$params.time_mode = 'time_interval';
					}}
				>
					<svg
						class="lucide lucide-calendar-cog mr-[2px]"
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="m15.2 16.9-.9-.4" />
						<path d="m15.2 19.1-.9.4" />
						<path d="M16 2v4" />
						<path d="m16.9 15.2-.4-.9" />
						<path d="m16.9 20.8-.4.9" />
						<path d="m19.5 14.3-.4.9" />
						<path d="m19.5 21.7-.4-.9" />
						<path d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
						<path d="m21.7 16.5-.9.4" />
						<path d="m21.7 19.5-.9-.4" />
						<path d="M3 10h18" />
						<path d="M8 2v4" />
						<circle cx="18" cy="18" r="3" />
					</svg>Time Interval
				</Button>
			</div>
		</div>

		<div class="mt-3 md:mt-4">
			{#if $params.time_mode === 'forecast_days'}
				<div in:fade class="grid gap-3 md:gap-6 lg:grid-cols-2">
					<div class="grid gap-3 sm:grid-cols-2 md:gap-6">
						<div class="relative">
							<Select.Root name="forecast_days" type="single" bind:value={$params.forecast_days}>
								<Select.Trigger
									aria-label="Forecast days input"
									class="h-12 cursor-pointer pt-6 [&_svg]:mb-3"
									>{forecastDays?.label}</Select.Trigger
								>
								<Select.Content preventScroll={false} class="border-border">
									{#each forecastDaysOptions as fdo}
										<Select.Item class="cursor-pointer" value={fdo.value}>{fdo.label}</Select.Item>
									{/each}
								</Select.Content>
								<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
									>Forecast days</Label
								>
							</Select.Root>
						</div>
						<div class="relative">
							<Select.Root name="past_days" type="single" bind:value={$params.past_days}>
								<Select.Trigger
									aria-label="Past days input"
									class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{pastDays?.label}</Select.Trigger
								>
								<Select.Content preventScroll={false} class="border-border">
									{#each pastDaysOptions as pdo}
										<Select.Item class="cursor-pointer" value={pdo.value}>{pdo.label}</Select.Item>
									{/each}
								</Select.Content>
								<Label
									class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
								>
									Past days</Label
								>
							</Select.Root>
						</div>
					</div>

					<div>
						<p>
							By default, we provide forecasts for 7 days, but you can access forecasts for up to 16
							days. If you're interested in past weather data, you can use the <mark>Past Days</mark
							>
							feature to access archived forecasts.
						</p>
					</div>
				</div>
			{/if}
			{#if $params.time_mode === 'time_interval'}
				<div in:fade class="flex flex-col gap-x-6 gap-y-4 lg:flex-row">
					<div class="mb-3 lg:w-1/2">
						<DatePicker
							bind:start_date={$params.start_date}
							bind:end_date={$params.end_date}
							{begin_date}
							{last_date}
						/>
					</div>
					<div class="mb-3 lg:w-1/2">
						<p>
							The <mark>Start Date</mark> and <mark>End Date</mark> options help you choose a range
							of dates more easily. Archived forecasts come from a series of weather model runs over
							time. You can access forecasts for up to 3 months and continuously archived in the
							<a href={'/en/docs/historical-forecast-api'}>Historical Forecast API</a>. You can also
							check out our
							<a href={'/en/docs/historical-weather-api'}>Historical Weather API</a>, which provides
							data going all the way back to 1940.
						</p>
					</div>
				</div>
			{/if}
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
											if (e.value && $params.hourly?.includes(e.value)) {
												$params.hourly = $params.hourly.filter((item) => {
													return item !== e.value;
												});
											} else if (e.value && $params.hourly) {
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
	</div>

	<!-- CURRENT -->
	<div class="mt-6 md:mt-12">
		<h2 id="current_weather" class="text-2xl md:text-3xl">Current Weather</h2>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each current as group}
				<div>
					{#each group as e}
						<div class="group flex items-center" title={e.label}>
							<Checkbox
								id="{e.value}_current"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								value={e.value}
								checked={$params.current?.includes(e.value)}
								aria-labelledby="{e.value}_current_label"
								onCheckedChange={() => {
									if ($params.current?.includes(e.value)) {
										$params.current = $params.current.filter((item) => {
											return item !== e.value;
										});
									} else {
										$params.current.push(e.value);
										$params.current = $params.current;
									}
								}}
							/>
							<Label
								id="{e.value}_current_label"
								for="{e.value}_current"
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
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
	<div class="mt-3 md:mt-6"><LicenseSelector /></div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultPreview {params} {defaultParameters} model_default="jma_seamless" />
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2>
	<div class="mt-2 md:mt-4">
		<p>
			This API uses global and local weather models from the Japan Meteorological Agency JMA. Due to
			data license restrictions only a limited version of data is available. A list of official JMA
			data is available on the <a
				target="_blank"
				href="https://www.jma.go.jp/jma/en/Activities/nwp.html">JMA website</a
			>. For GSM, values are interpolated from 6-hourly to 1-hourly values.
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[840px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<caption class="text-muted-foreground mt-2 table-caption text-left"
					>You can find the update timings in the <a
						class="text-link underline"
						href={'/en/docs/model-updates'}>model updates documentation</a
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
						<th scope="row">GSM</th>
						<td>Global</td>
						<td>0.5° (~55 km)</td>
						<td>6-Hourly</td>
						<td>11 days</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row">MSM</th>
						<td>Japan, Korea</td>
						<td>0.05° (~5 km)</td>
						<td>Hourly</td>
						<td>4 days</td>
						<td>Every 3 hours</td>
					</tr>
				</tbody>
			</table>
		</div>

		<small class="text-muted-foreground">JMA models like RSM are not available.</small>
	</div>

	<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:gap-6">
		<figure>
			<img src="/images/models/jma_msm.webp" class="rounded-lg" alt="..." />
			<figcaption class="text-muted-foreground">JMA MSM model area. Source: Open-Meteo.</figcaption>
		</figure>
	</div>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2>
	<div class="mt-2 md:mt-4">
		<p>
			The API endpoint <mark>/v1/jma</mark> accepts a geographical coordinate, a list of weather variables
			and responds with a JSON hourly weather forecast for 4 days. Time always starts at 0:00 today and
			contains 168 hours. All URL parameters are listed below:
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1240px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<caption class="text-muted-foreground mt-2 table-caption text-left"
					>You can find the update timings in the <a
						class="text-link underline"
						href={'/en/docs/model-updates'}>model updates documentation</a
					>.</caption
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
						<th scope="row">latitude, longitude</th>
						<td>Floating point</td>
						<td>Yes</td>
						<td></td>
						<td
							>Geographical WGS84 coordinates of the location. Multiple coordinates can be comma
							separated. E.g. <mark>&latitude=52.52,48.85&longitude=13.41,2.35</mark>. To return
							data for multiple locations the JSON output changes to a list of structures. CSV and
							XLSX formats add a column <mark>location_id</mark>.</td
						>
					</tr>
					<tr>
						<th scope="row">elevation</th>
						<td>Floating point</td>
						<td>No</td>
						<td></td>
						<td
							>The elevation used for statistical downscaling. Per default, a <a
								href="https://openmeteo.substack.com/p/improving-weather-forecasts-with"
								title="Elevation based grid-cell selection explained"
								>90 meter digital elevation model is used</a
							>. You can manually set the elevation to correctly match mountain peaks. If
							<mark>&elevation=nan</mark> is specified, downscaling will be disabled and the API uses
							the average grid-cell height. For multiple locations, elevation can also be comma separated.</td
						>
					</tr>
					<tr>
						<th scope="row">hourly</th>
						<td>String array</td>
						<td>No</td>
						<td></td>
						<td
							>A list of weather variables which should be returned. Values can be comma separated,
							or multiple
							<mark>&hourly=</mark> parameter in the URL can be used.
						</td>
					</tr>
					<tr>
						<th scope="row">daily</th>
						<td>String array</td>
						<td>No</td>
						<td></td>
						<td
							>A list of daily weather variable aggregations which should be returned. Values can be
							comma separated, or multiple <mark>&daily=</mark> parameter in the URL can be used. If
							daily weather variables are specified, parameter <mark>timezone</mark> is required.</td
						>
					</tr>
					<tr>
						<th scope="row">current</th>
						<td>String array</td>
						<td>No</td>
						<td></td>
						<td>A list of weather variables to get current conditions.</td>
					</tr>
					<tr>
						<th scope="row">temperature_unit</th>
						<td>String</td>
						<td>No</td>
						<td><mark>celsius</mark></td>
						<td
							>If <mark>fahrenheit</mark> is set, all temperature values are converted to Fahrenheit.</td
						>
					</tr>
					<tr>
						<th scope="row">wind_speed_unit</th>
						<td>String</td>
						<td>No</td>
						<td><mark>kmh</mark></td>
						<td
							>Other wind speed speed units: <mark>ms</mark>, <mark>mph</mark> and
							<mark>kn</mark></td
						>
					</tr>
					<tr>
						<th scope="row">precipitation_unit</th>
						<td>String</td>
						<td>No</td>
						<td><mark>mm</mark></td>
						<td>Other precipitation amount units: <mark>inch</mark></td>
					</tr>
					<tr>
						<th scope="row">timeformat</th>
						<td>String</td>
						<td>No</td>
						<td><mark>iso8601</mark></td>
						<td
							>If format <mark>unixtime</mark> is selected, all time values are returned in UNIX
							epoch time in seconds. Please note that all timestamp are in GMT+0! For daily values
							with unix timestamps, please apply
							<mark>utc_offset_seconds</mark> again to get the correct date.
						</td>
					</tr>
					<tr>
						<th scope="row">timezone</th>
						<td>String</td>
						<td>No</td>
						<td><mark>GMT</mark></td>
						<td
							>If <mark>timezone</mark> is set, all timestamps are returned as local-time and data
							is returned starting at 00:00 local-time. Any time zone name from the
							<a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" target="_blank"
								>time zone database</a
							>
							is supported. If <mark>auto</mark> is set as a time zone, the coordinates will be automatically
							resolved to the local time zone. For multiple coordinates, a comma separated list of timezones
							can be specified.</td
						>
					</tr>
					<tr>
						<th scope="row">past_days</th>
						<td>Integer</td>
						<td>No</td>
						<td><mark>0</mark></td>
						<td>If <mark>past_days</mark> is set, past weather data can be returned.</td>
					</tr>
					<tr>
						<th scope="row">forecast_days</th>
						<td>Integer (0-11)</td>
						<td>No</td>
						<td><mark>7</mark></td>
						<td>Per default, 7 days are returned. Up to 11 days of forecast are possible.</td>
					</tr>
					<tr>
						<th scope="row">forecast_hours<br />past_hours</th>
						<td>Integer (&gt;0)</td>
						<td>No</td>
						<td></td>
						<td
							>Similar to forecast_days, the number of timesteps of hourly data can controlled.
							Instead of using the current day as a reference, the current hour is used.
						</td>
					</tr>
					<tr>
						<th scope="row">start_date<br />end_date</th>
						<td>String (yyyy-mm-dd)</td>
						<td>No</td>
						<td></td>
						<td
							>The time interval to get weather data. A day must be specified as an ISO8601 date
							(e.g.
							<mark>2022-06-30</mark>).
						</td>
					</tr>
					<tr>
						<th scope="row">start_hour<br />end_hour</th>
						<td>String (yyyy-mm-ddThh:mm)</td>
						<td>No</td>
						<td></td>
						<td
							>The time interval to get weather data for hourly data. Time must be specified as an
							ISO8601 date (e.g.
							<mark>2022-06-30T12:00</mark>).
						</td>
					</tr>
					<tr>
						<th scope="row">cell_selection</th>
						<td>String</td>
						<td>No</td>
						<td><mark>land</mark></td>
						<td
							>Set a preference how grid-cells are selected. The default <mark>land</mark> finds a
							suitable grid-cell on land with
							<a
								href="https://openmeteo.substack.com/p/improving-weather-forecasts-with"
								title="Elevation based grid-cell selection explained"
								>similar elevation to the requested coordinates using a 90-meter digital elevation
								model</a
							>.
							<mark>sea</mark> prefers grid-cells on sea. <mark>nearest</mark> selects the nearest possible
							grid-cell.
						</td>
					</tr>
					<tr>
						<th scope="row">apikey</th>
						<td>String</td>
						<td>No</td>
						<td></td>
						<td
							>Only required to commercial use to access reserved API resources for customers. The
							server URL requires the prefix <mark>customer-</mark>. See
							<a
								href={'/en/pricing'}
								title="Pricing information to use the weather API commercially">pricing</a
							> for more information.</td
						>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<p class="text-muted-foreground mt-2">
		Additional optional URL parameters will be added. For API stability, no required parameters will
		be added in the future!
	</p>
</div>

<!-- API DOCS - HOURLY -->
<div class="mt-6 md:mt-12">
	<h3 id="hourly_parameter_definition" class="text-xl md:text-2xl">Hourly Parameter Definition</h3>
	<div class="mt-2 md:mt-4">
		<p>
			The parameter <mark>&hourly=</mark> accepts the following values. Most weather variables are given
			as an instantaneous value for the indicated hour. Some variables like precipitation are calculated
			from the preceding hour as an average or sum.
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1240px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<thead>
					<tr>
						<th scope="col">Variable</th>
						<th scope="col">Valid time</th>
						<th scope="col">Unit</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">temperature_2m</th>
						<td>Instant</td>
						<td>°C (°F)</td>
						<td>Air temperature at 2 meters above ground</td>
					</tr>
					<tr>
						<th scope="row">relative_humidity_2m</th>
						<td>Instant</td>
						<td>%</td>
						<td>Relative humidity at 2 meters above ground</td>
					</tr>
					<tr>
						<th scope="row">dew_point_2m</th>
						<td>Instant</td>
						<td>°C (°F)</td>
						<td>Dew point temperature at 2 meters above ground</td>
					</tr>
					<tr>
						<th scope="row">apparent_temperature</th>
						<td>Instant</td>
						<td>°C (°F)</td>
						<td
							>Apparent temperature is the perceived feels-like temperature combining wind chill
							factor, relative humidity and solar radiation</td
						>
					</tr>
					<tr>
						<th scope="row">pressure_msl<br />surface_pressure</th>
						<td>Instant</td>
						<td>hPa</td>
						<td
							>Atmospheric air pressure reduced to mean sea level (msl) or pressure at surface.
							Typically pressure on mean sea level is used in meteorology. Surface pressure gets
							lower with increasing elevation.</td
						>
					</tr>
					<tr>
						<th scope="row">cloud_cover</th>
						<td>Instant</td>
						<td>%</td>
						<td>Total cloud cover as an area fraction</td>
					</tr>
					<tr>
						<th scope="row">cloud_cover_low</th>
						<td>Instant</td>
						<td>%</td>
						<td>Low level clouds and fog up to 3 km altitude</td>
					</tr>
					<tr>
						<th scope="row">cloud_cover_mid</th>
						<td>Instant</td>
						<td>%</td>
						<td>Mid level clouds from 3 to 8 km altitude</td>
					</tr>
					<tr>
						<th scope="row">cloud_cover_high</th>
						<td>Instant</td>
						<td>%</td>
						<td>High level clouds from 8 km altitude</td>
					</tr>
					<tr>
						<th scope="row">wind_speed_10m</th>
						<td>Instant</td>
						<td>km/h (mph, m/s, knots)</td>
						<td
							>Wind speed at 10 meters above ground. Wind speed on 10 meters is the standard level.</td
						>
					</tr>
					<tr>
						<th scope="row">wind_direction_10m</th>
						<td>Instant</td>
						<td>°</td>
						<td>Wind direction at 10 meters above ground</td>
					</tr>
					<tr>
						<th scope="row">shortwave_radiation</th>
						<td>Preceding hour mean</td>
						<td>W/m²</td>
						<td
							>Shortwave solar radiation as average of the preceding hour. This is equal to the
							total global horizontal irradiation
						</td>
					</tr>
					<tr>
						<th scope="row">direct_radiation<br />direct_normal_irradiance</th>
						<td>Preceding hour mean</td>
						<td>W/m²</td>
						<td
							>Direct solar radiation as average of the preceding hour on the horizontal plane and
							the normal plane (perpendicular to the sun). JMA does not offers diffuse and direct
							radiation directly. It is approximated based on <a
								href="https://www.ise.fraunhofer.de/content/dam/ise/de/documents/publications/conference-paper/36-eupvsec-2019/Guzman_5CV31.pdf"
								target="_blank">Razo, Müller Witwer</a
							></td
						>
					</tr>
					<tr>
						<th scope="row">diffuse_radiation</th>
						<td>Preceding hour mean</td>
						<td>W/m²</td>
						<td
							>Diffuse solar radiation as average of the preceding hour. MA does not offers diffuse
							and direct radiation directly. It is approximated based on <a
								href="https://www.ise.fraunhofer.de/content/dam/ise/de/documents/publications/conference-paper/36-eupvsec-2019/Guzman_5CV31.pdf"
								target="_blank">Razo, Müller Witwer</a
							></td
						>
					</tr>
					<tr>
						<th scope="row">global_tilted_irradiance</th>
						<td>Preceding hour mean</td>
						<td>W/m²</td>
						<td
							>Total radiation received on a tilted pane as average of the preceding hour. The
							calculation is assuming a fixed albedo of 20% and in isotropic sky. Please specify
							tilt and azimuth parameter. Tilt ranges from 0° to 90° and is typically around 45°.
							Azimuth should be close to 0° (0° south, -90° east, 90° west, ±180 north). If azimuth
							is set to "nan", the calculation assumes a horizontal tracker. If tilt is set to
							"nan", it is assumed that the panel has a vertical tracker. If both are set to "nan",
							a bi-axial tracker is assumed.</td
						>
					</tr>
					<tr>
						<th scope="row">sunshine_duration</th>
						<td>Preceding hour sum</td>
						<td>Seconds</td>
						<td
							>Number of seconds of sunshine of the preceding hour per hour calculated by direct
							normalized irradiance exceeding 120 W/m², following the WMO definition.</td
						>
					</tr>
					<tr>
						<th scope="row">vapour_pressure_deficit</th>
						<td>Instant</td>
						<td>kPa</td>
						<td
							>Vapor Pressure Deificit (VPD) in kilopascal (kPa). For high VPD (&gt;1.6), water
							transpiration of plants increases. For low VPD (&lt;0.4), transpiration decreases</td
						>
					</tr>
					<tr>
						<th scope="row">et0_fao_evapotranspiration</th>
						<td>Preceding hour sum</td>
						<td>mm (inch)</td>
						<td
							>ET₀ Reference Evapotranspiration of a well watered grass field. Based on <a
								href="https://www.fao.org/3/x0490e/x0490e04.htm"
								target="_blank">FAO-56 Penman-Monteith equations</a
							> ET₀ is calculated from temperature, wind speed, humidity and solar radiation. Unlimited
							soil water is assumed. ET₀ is commonly used to estimate the required irrigation for plants.</td
						>
					</tr>
					<tr>
						<th scope="row">weather_code</th>
						<td>Instant</td>
						<td>WMO code</td>
						<td
							>Weather condition as a numeric code. Follow WMO weather interpretation codes. See
							table below for details. Weather code is calculated from cloud cover analysis,
							precipitation and snowfall. As JMA has barely no information about atmospheric
							stability, estimation about thunderstorms is not possible.</td
						>
					</tr>
					<tr>
						<th scope="row">precipitation</th>
						<td>Preceding hour sum</td>
						<td>mm (inch)</td>
						<td>Total precipitation (rain, showers, snow) sum of the preceding hour</td>
					</tr>
					<tr>
						<th scope="row">snowfall</th>
						<td>Preceding hour sum</td>
						<td>cm (inch)</td>
						<td
							>Snowfall amount of the preceding hour in centimeters. For the water equivalent in
							millimeter, divide by 7. E.g. 7 cm snow = 10 mm precipitation water equivalent.
							Snowfall amount is not provided by JMA directly, instead it is approximated based on
							total precipitation and temperature</td
						>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- API DOCS - PRESSURE -->
<div class="mt-6 md:mt-12">
	<h3 id="pressure_level_variables" class="text-xl md:text-2xl">Pressure Level Variables</h3>
	<div class="mt-2 md:mt-4">
		<p>
			Pressure level variables do not have fixed altitudes. Altitude varies with atmospheric
			pressure. 1000 hPa is roughly between 60 and 160 meters above sea level. Estimated altitudes
			are given below. Altitudes are in meters above sea level (not above ground). For precise
			altitudes, <mark>geopotential_height</mark> can be used.
		</p>

		<PressureLevelsHelpTable {levels} />
		<p class="text-muted-foreground mt-2">
			All pressure levels have valid times of the indicated hour (instant).
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1040px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<thead>
					<tr>
						<th scope="col">Variable</th>
						<th scope="col">Unit</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">temperature_1000hPa<br />temperature_975hPa, ...</th>
						<td>°C (°F)</td>
						<td
							>Air temperature at the specified pressure level. Air temperatures decrease linearly
							with pressure.</td
						>
					</tr>
					<tr>
						<th scope="row">relative_humidity_1000hPa<br />relative_humidity_975hPa, ...</th>
						<td>%</td>
						<td>Relative humidity at the specified pressure level.</td>
					</tr>
					<tr>
						<th scope="row">dew_point_1000hPa<br />dew_point_975hPa, ...</th>
						<td>°C (°F)</td>
						<td>Dew point temperature at the specified pressure level.</td>
					</tr>
					<tr>
						<th scope="row">cloud_cover_1000hPa<br />cloud_cover_975hPa, ...</th>
						<td>%</td>
						<td
							>Cloud cover at the specified pressure level. JMA models do not inlude parameterised
							cloud cover directly. It is approximated based on relative humidity using <a
								href="https://www.ecmwf.int/sites/default/files/elibrary/2005/16958-parametrization-cloud-cover.pdf"
								target="_blank">Sundqvist et al. (1989)</a
							>. It may not match perfectly with low, mid and high cloud cover variables.</td
						>
					</tr>
					<tr>
						<th scope="row">wind_speed_1000hPa<br />wind_speed_975hPa, ...</th>
						<td>km/h (mph, m/s, knots)</td>
						<td>Wind speed at the specified pressure level.</td>
					</tr>
					<tr>
						<th scope="row">wind_direction_1000hPa<br />wind_direction_975hPa, ...</th>
						<td>°</td>
						<td>Wind direction at the specified pressure level.</td>
					</tr>
					<tr>
						<th scope="row">geopotential_height_1000hPa<br />geopotential_height_975hPa, ...</th>
						<td>meter</td>
						<td
							>Geopotential height at the specified pressure level. This can be used to get the
							correct altitude in meter above sea level of each pressure level. Be carefull not to
							mistake it with altitude above ground.
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- API DOCS - DAILY -->
<div class="mt-6 md:mt-12">
	<h3 id="daily_parameter_definition" class="text-xl md:text-2xl">Daily Parameter Definition</h3>
	<div class="mt-2 md:mt-4">
		<p>
			Aggregations are a simple 24 hour aggregation from hourly values. The parameter <mark
				>&daily=</mark
			> accepts the following values:
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1040px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<thead>
					<tr>
						<th scope="col">Variable</th>
						<th scope="col">Unit</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">weather_code</th>
						<td>WMO code</td>
						<td>The most severe weather condition on a given day</td>
					</tr>
					<tr>
						<th scope="row">temperature_2m_max<br />temperature_2m_min</th>
						<td>°C (°F)</td>
						<td>Maximum and minimum daily air temperature at 2 meters above ground</td>
					</tr>
					<tr>
						<th scope="row">apparent_temperature_max<br />apparent_temperature_min</th>
						<td>°C (°F)</td>
						<td>Maximum and minimum daily apparent temperature</td>
					</tr>
					<tr>
						<th scope="row">precipitation_sum</th>
						<td>mm</td>
						<td>Sum of daily precipitation (including rain, showers and snowfall)</td>
					</tr>
					<tr>
						<th scope="row">precipitation_hours</th>
						<td>hours</td>
						<td>The number of hours with rain</td>
					</tr>
					<tr>
						<th scope="row">snowfall_sum</th>
						<td>cm</td>
						<td>Sum of daily snowfall</td>
					</tr>
					<tr>
						<th scope="row">sunrise<br />sunset</th>
						<td>iso8601</td>
						<td>Sun rise and set times</td>
					</tr>
					<tr>
						<th scope="row">sunshine_duration</th>
						<td>seconds</td>
						<td
							>The number of seconds of sunshine per day is determined by calculating direct
							normalized irradiance exceeding 120 W/m², following the WMO definition. Sunshine
							duration will consistently be less than daylight duration due to dawn and dusk.</td
						>
					</tr>
					<tr>
						<th scope="row">daylight_duration</th>
						<td>seconds</td>
						<td>Number of seconds of daylight per day</td>
					</tr>
					<tr>
						<th scope="row">wind_direction_10m_dominant</th>
						<td>°</td>
						<td>Dominant wind direction</td>
					</tr>
					<tr>
						<th scope="row">shortwave_radiation_sum</th>
						<td>MJ/m²</td>
						<td>The sum of solar radiation on a given day in Megajoules</td>
					</tr>
					<tr>
						<th scope="row">et0_fao_evapotranspiration</th>
						<td>mm</td>
						<td>Daily sum of ET₀ Reference Evapotranspiration of a well watered grass field</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- API DOCS - JSON -->
<div class="mt-6 md:mt-12">
	<h3 id="json_return_object" class="text-xl md:text-2xl">JSON Return Object</h3>
	<div class="mt-2 md:mt-4">
		<p class="">On success a JSON object will be returned.</p>
		<div
			class="code-numbered overflow-auto bg-[#FAFAFA] rounded-lg dark:bg-[#212121] -mx-6 md:ml-0 lg:mx-0 mt-2 md:mt-4"
		>
			<WeatherForecastObject />
		</div>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[940px] w-full caption-bottom text-left md:mt-4 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<thead>
					<tr>
						<th scope="col">Parameter</th>
						<th scope="col">Format</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">latitude, longitude</th>
						<td>Floating point</td>
						<td
							>WGS84 of the center of the weather grid-cell which was used to generate this
							forecast. This coordinate might be a few kilometers away from the requested
							coordinate.</td
						>
					</tr>
					<tr>
						<th scope="row">elevation</th>
						<td>Floating point</td>
						<td
							>The elevation from a 90 meter digital elevation model. This effects which grid-cell
							is selected (see parameter <mark>cell_selection</mark>). Statistical downscaling is
							used to adapt weather conditions for this elevation. This elevation can also be
							controlled with the query parameter <mark>elevation</mark>. If
							<mark>&elevation=nan</mark> is specified, all downscaling is disabled and the averge grid-cell
							elevation is used.</td
						>
					</tr>
					<tr>
						<th scope="row">generationtime_ms</th>
						<td>Floating point</td>
						<td
							>Generation time of the weather forecast in milliseconds. This is mainly used for
							performance monitoring and improvements.</td
						>
					</tr>
					<tr>
						<th scope="row">utc_offset_seconds</th>
						<td>Integer</td>
						<td>Applied timezone offset from the <mark>&timezone=</mark> parameter.</td>
					</tr>
					<tr>
						<th scope="row">timezone<br />timezone_abbreviation</th>
						<td>String</td>
						<td
							>Timezone identifier (e.g. <mark>Europe/Berlin</mark>) and abbreviation (e.g.
							<mark>CEST</mark>)</td
						>
					</tr>
					<tr>
						<th scope="row">hourly</th>
						<td>Object</td>
						<td
							>For each selected weather variable, data will be returned as a floating point array.
							Additionally a
							<mark>time</mark> array will be returned with ISO8601 timestamps.
						</td>
					</tr>
					<tr>
						<th scope="row">hourly_units</th>
						<td>Object</td>
						<td>For each selected weather variable, the unit will be listed here.</td>
					</tr>
					<tr>
						<th scope="row">daily</th>
						<td>Object</td>
						<td
							>For each selected daily weather variable, data will be returned as a floating point
							array. Additionally a <mark>time</mark> array will be returned with ISO8601 timestamps.</td
						>
					</tr>
					<tr>
						<th scope="row">daily_units</th>
						<td>Object</td>
						<td>For each selected daily weather variable, the unit will be listed here.</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- API DOCS - ERRORS -->
<div class="mt-6 md:mt-12">
	<h3 id="errors" class="text-xl md:text-2xl">Errors</h3>
	<div class="mt-2 md:mt-4">
		<p>
			In case an error occurs, for example a URL parameter is not correctly specified, a JSON error
			object is returned with a HTTP 400 status code.
		</p>
		<div
			class="mt-2 md:mt-4 bg-[#FAFAFA] rounded-lg dark:bg-[#212121] overflow-auto -mx-6 md:ml-0 lg:mx-0"
		>
			<WeatherForecastError />
		</div>
	</div>
</div>

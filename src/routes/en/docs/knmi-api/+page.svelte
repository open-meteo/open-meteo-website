<script lang="ts">
	import { onMount } from 'svelte';

	import { fade, slide } from 'svelte/transition';

	import { sliceIntoChunks } from '$lib/utils';
	import {
		countVariables,
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
	import ResultPreview from '$lib/components/response/results-preview.svelte';
	import LicenseSelector from '$lib/components/license/license-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';

	import {
		daily,
		hourly,
		levels,
		models,
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
		pastMinutely15Options,
		gridCellSelectionOptions,
		temporalResolutionOptions,
		forecastMinutely15Options
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
	let forecastMinutely15 = $derived(
		forecastMinutely15Options.find((fmo) => String(fmo.value) == $params.forecast_minutely_15)
	);
	let pastMinutely15 = $derived(
		pastMinutely15Options.find((pmo) => String(pmo.value) == $params.past_minutely_15)
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
			(countVariables(solarVariables, $params.minutely_15).active ||
				(pastMinutely15 ? pastMinutely15.value : false) ||
				(forecastMinutely15 ? forecastMinutely15.value : false)) &&
			!accordionValues.includes('minutely_15')
		) {
			accordionValues.push('minutely_15');
		}
	});

	let begin_date = new Date();
	begin_date.setMonth(begin_date.getMonth() - 3);

	let last_date = new Date();
	last_date.setDate(last_date.getDate() + 10);
</script>

<svelte:head>
	<title>KNMI Weather Model API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/knmi-api" />
</svelte:head>

<form method="get" action="https://api.open-meteo.com/v1/knmi">
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<div class="mt-6">
		<div class="mt-3 flex items-center gap-2">
			<div class="text-muted-foreground">Time:</div>

			<div class="border-border flex rounded-md border">
				<Button
					variant="ghost"
					class="gap-1 rounded-e-none !opacity-100 duration-300 {$params.time_mode ===
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
					class="gap-1 rounded-s-none !opacity-100 duration-300  {$params.time_mode ===
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
									{#each forecastDaysOptions as { value, label } (value)}
										<Select.Item class="cursor-pointer" {value}>{label}</Select.Item>
									{/each}
								</Select.Content>
								<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
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
									{#each pastDaysOptions as { value, label } (value)}
										<Select.Item class="cursor-pointer" {value}>{label}</Select.Item>
									{/each}
								</Select.Content>
								<Label
									class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
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
							<a href="/en/docs/historical-forecast-api">Historical Forecast API</a>. You can also
							check out our
							<a href="/en/docs/historical-weather-api">Historical Weather API</a>, which provides
							data going all the way back to 1940.
						</p>
					</div>
				</div>
			{/if}
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
										$params.hourly = $params.hourly.filter((item) => {
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
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
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
											if (value && $params.hourly?.includes(value)) {
												$params.hourly = $params.hourly.filter((item) => {
													return item !== value;
												});
											} else if (value && $params.hourly) {
												$params.hourly.push(value);
												$params.hourly = $params.hourly;
											}
										}}
									/>
									<Label
										id="{value}_label"
										for="{value}_hourly"
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
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
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
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
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
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
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
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
												$params.hourly = $params.hourly.filter((item) => {
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
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
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
					<div class="w-full md:w-[227px]">
						<ToggleGroup.Root
							type="single"
							bind:value={pressureVariablesTab}
							class="justify-start gap-0"
						>
							<div class="border-border flex flex-col rounded-lg border">
								{#each pressureVariables as variable, i}
									<ToggleGroup.Item
										value={variable.value}
										class="min-h-12 w-[225px] cursor-pointer rounded-none !opacity-100 lg:min-h-[unset] {i ===
										0
											? 'rounded-t-md'
											: ''} {i === pressureVariables.length - 1 ? 'rounded-b-md' : ''}"
										disabled={pressureVariablesTab === variable.value}
										onclick={() => (pressureVariablesTab = variable.value)}
										><div class="flex w-full items-center justify-between gap-2 text-left">
											{variable.label}
											<span class="text-xs">
												{levels.filter((level) =>
													$params.hourly.includes(`${variable.value}_${level}hPa`)
												).length
													? '(' +
														levels.filter((level) =>
															$params.hourly.includes(`${variable.value}_${level}hPa`)
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
								<div class="grid grid-cols-1">
									{#each levels as level}
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
								</div>
							{/if}
						{/each}
					</div>
				</div>
				<div class="mt-3 lg:ml-[249px]">
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
												$params.models = $params.models.filter((item) => {
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
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
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
										$params.daily = $params.daily.filter((item) => {
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
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
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
	<ResultPreview {params} {defaultParameters} model_default="knmi_seamless" />
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<p>
			KNMI provides weather forecasts from the HARMONIE AROME model with ECMWF IFS initialization.
			This is a collaboration of multiple European national weather services under the name "United
			Weather Centres-West" (UWC-West). Two model configuration one for Europe (5.5 km resolution)
			and an inset for the Netherlands (2 km resolution) are available. All data is updated hourly
			and provides forecast for up to 2.5 days. After 2.5 days, Open-Meteo combines forecasts with
			the <a href={'/en/docs/ecmwf-api'}>ECMWF IFS 0.25° model</a> to provide up to 10 days of forecast.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 mt-2 w-full min-w-[1240px] caption-bottom text-left md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
						<th scope="row"
							><a
								href="https://dataplatform.knmi.nl/dataset/harmonie-arome-cy43-p1-1-0"
								target="_blank">KNMI HARMONIE AROME Netherlands</a
							></th
						>
						<td>Netherlands, Belgium</td>
						<td>2 km</td>
						<td>1-hourly</td>
						<td>2.5 days</td>
						<td>Every hour</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://dataplatform.knmi.nl/dataset/harmonie-arome-cy43-p3-1-0"
								target="_blank">KNMI HARMONIE AROME Europe</a
							></th
						>
						<td>Central & Northern Europe up to Iceland</td>
						<td>5.5 km</td>
						<td>1-hourly</td>
						<td>2.5 days</td>
						<td>Every hour</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:gap-6 lg:grid-cols-2">
		<figure>
			<enhanced:img src="/static/images/models/knmi_harmonie.jpg" class="rounded-lg" alt="..." />
			<figcaption class="text-muted-foreground">
				KNMI HARMONIE AROME model area Europe (blue/red) and Netherlands nest (green). Source: <a
					href="https://english.knmidata.nl/latest/newsletters/open-data-newsletter/2024/open-data-march-2024"
					>KMNI Blog</a
				>.
			</figcaption>
		</figure>
	</div>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<a href="#api_documentation"
		><h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			For a detailed list of all available weather variables please refer to the general <a
				href={'/en/docs'}>Weather Forecast API</a
			>. Only notable remarks are listed below
		</p>
		<ul class="ml-6 list-disc">
			<li>
				<strong>Solar Radiation:</strong> KNMI supplies only global solar radiation data and does
				not offer direct or diffuse solar radiation. Open-Meteo applies the separation model from
				<a
					href="https://www.ise.fraunhofer.de/content/dam/ise/de/documents/publications/conference-paper/36-eupvsec-2019/Guzman_5CV31.pdf"
					>Razo, Müller Witwer</a
				> to calculate direct radiation from shortwave solar radiation.
			</li>
			<li>
				<strong>Wind Direction Correction:</strong> Wind direction has been calculated from U/V wind
				component vectors. Special care has been taken to correct for the
				<mark>Rotated Lat Long</mark> projection. Without this correction, wind directions have an error
				of up to 15°.
			</li>
			<li>
				<strong>Wind on 50, 100, 200, 300m:</strong> Wind forecasts for higher altitudes are only available
				for the Netherlands area.
			</li>
			<li>
				<strong>Pressure Level Data:</strong> Forecasts on pressure level are only available for the
				European model.
			</li>
		</ul>
	</div>
</div>

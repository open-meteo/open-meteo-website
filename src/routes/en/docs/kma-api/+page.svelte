<script lang="ts">
	import { onMount } from 'svelte';

	import { fade, slide } from 'svelte/transition';

	import { countVariables } from '$lib/utils/meteo';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select';
	import * as Accordion from '$lib/components/ui/accordion';

	import Settings from '$lib/components/settings/settings.svelte';
	import DatePicker from '$lib/components/date/date-picker.svelte';
	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import ResultPreview from '$lib/components/highcharts/result-preview.svelte';
	import LicenseSelector from '$lib/components/license/license-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';

	import {
		daily,
		hourly,
		models,
		current,
		solarVariables,
		defaultParameters,
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
		latitude: [51.5085],
		longitude: [-0.1257],
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
	<title>UK Met Office API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/kma-api" />
</svelte:head>

<div class="alert alert-warning" role="alert"></div>

<form method="get" action="https://api.open-meteo.com/v1/forecast">
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
			Note: Current conditions are based on 1 or 3-hourly weather model data. Every weather variable
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
	<ResultPreview {params} {defaultParameters} model_default="kma_seamless" />
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2>
	<div class="mt-2 md:mt-4">
		<p>
			This API uses global KMA GDPS 10 km weather forecasts and combines them with high-resolution
			LDPS 1.5 km model for the North and South Korea. Information about KMA weather models is
			available <a href="https://www.kma.go.kr/eng/biz/forecast_02.jsp" target="_blank">here</a>.
			For GDPS Global, values are interpolated from 3-hourly to 1-hourly time-steps.
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1025px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<caption class="text-muted-foreground mt-2 table-caption text-left"
					>You can find the update timings in the <a
						class="text-link undeline"
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
						<th scope="row">KMA GDPS</th>
						<td>Global</td>
						<td>0.13° (~12 km)</td>
						<td>3-Hourly</td>
						<td>12 days</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row">KMA LDPS</th>
						<td>South And North Korea</td>
						<td>1.5 km</td>
						<td>Hourly</td>
						<td>2 days</td>
						<td>Every 6 hours</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<figure class="mt-6">
		<img src="/images/models/kma_ldps.webp" class="rounded-lg" alt="..." />
		<figcaption class="text-muted-foreground">
			KMA LDPS domain area at 1.5 km resolution. Source: Open-Meteo.
		</figcaption>
	</figure>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2>
	<div class="mt-2 md:mt-4">
		<p>
			For a detailed list of all available weather variables please refer to the general <a
				href={'/en/docs'}>Weather Forecast API</a
			>. Only notable remarks are listed below
		</p>
		<ul class="ml-6 list-disc">
			<li>
				<strong>Direct Solar Radiation:</strong> KMA provides direct solar radiation. Many other weather
				models only provide global solar radiation and direct solar radiation must be calculated user
				separation models.
			</li>
			<li>
				<strong>Cloud Cover (2m):</strong> KMA provides cloud cover at 2 metre above ground which can
				be interpreted as fog. This is remarkable, because only very weather models are capable of modeling
				low level cloud cover and fog with a good degree of accuracy.
			</li>
			<li>
				<strong>Showers:</strong>Showers are only computed in the global GDPS model. Since LDPS is a
				convection-resolving model, it incorporates showers within the regular rain parameter,
				resulting in a constant value of 0 for the showers variable in LDPS.
			</li>
		</ul>
	</div>
</div>

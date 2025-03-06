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

	import Clock from 'lucide-svelte/icons/clock';
	import Calendar from 'lucide-svelte/icons/calendar-cog';

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
	import AccordionItem from '$lib/components/AccordionItem.svelte';
	import ResultPreview from '$lib/components/highcharts/result-preview.svelte';
	import LicenseSelector from '$lib/components/license/license-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import PressureLevelsHelpTable from '$lib/components/PressureLevelsHelpTable.svelte';

	import { daily, hourly, models, defaultParameters, additionalVariables } from './options';

	import {
		pastDaysOptions,
		pastHoursOptions,
		forecastDaysOptions,
		forecastHoursOptions,
		pastMinutely15Options,
		gridCellSelectionOptions,
		temporalResolutionOptions,
		forecastMinutely15Options
	} from '../options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters
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

		if (countVariables(models, $params.models).active && !accordionValues.includes('models')) {
			accordionValues.push('models');
		}
	});
</script>

{'' +
	/* 
TODO:
- consider switch between archive and realtime endpoints -> Archive data requires large amounts of storage (>4TB)
- future option for satellite corrected weather forecasts? Data needs to be on the same node
- api endpoint URL... regular API server? dedicated satellite only server that pulls in weather model SW rad (+ens, +prev days)?
- proper solar variables documentation
- better time switch for hourly/10 and 15min
- better model selection
- add GEOS data
- add image with satellite area cover
*/ ''}

<svelte:head>
	<title>Satellite Radiation API 🛰️☀️ | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/satellite-radiation-api" />
</svelte:head>

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
					class="rounded-e-none !opacity-100 {$params.time_mode === 'forecast_days'
						? 'bg-accent cursor-not-allowed'
						: ''}"
					disabled={$params.time_mode === 'forecast_days'}
					onclick={() => {
						$params.time_mode = 'forecast_days';
						$params.start_date = '';
						$params.end_date = '';
					}}
				>
					<Clock size={20} />Forecast Length
				</Button>
				<Button
					variant="ghost"
					class="rounded-md rounded-s-none !opacity-100 duration-300 {$params.time_mode ===
					'time_interval'
						? 'bg-accent'
						: ''}"
					disabled={$params.time_mode === 'time_interval'}
					onclick={() => {
						$params.time_mode = 'time_interval';
					}}
				>
					<Calendar size={20} />Time Interval
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

					<div class="">
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
				<div in:fade class="flex flex-col gap-4 md:flex-row">
					<div class="mb-3 md:w-1/2">
						<DatePicker
							bind:start_date={$params.start_date}
							bind:end_date={$params.end_date}
							{begin_date}
							{last_date}
						/>
					</div>
					<div class="mb-3 md:w-1/2">
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
		<h2 id="variables" class="text-2xl md:text-3xl">Variables</h2>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each hourly as group}
				<div class="">
					{#each group as e}
						<div class="group flex items-center">
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
		<small class="text-muted-foreground"
			>Note: Solar radiation is averaged over the past hour. Use
			<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI please
			specify Tilt and Azimuth below.</small
		>

		<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-2 md:gap-6">
			<div class="relative">
				<Input
					id="tilt"
					type="number"
					class="h-12 cursor-pointer pt-6 {$params.tilt < 0 || $params.tilt > 90 ? 'text-red' : ''}"
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
					class="h-12 cursor-pointer pt-6 {$params.azimuth < -90 || $params.azimuth > 90
						? 'text-red'
						: ''}"
					name="azimuth"
					id="azimuth"
					step="1"
					min="-90"
					max="90"
					bind:value={$params.azimuth}
				/>
				<Label
					class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
					for="azimuth">Panel Azimuth (0° S, -90° E, 90° W)</Label
				>
				{#if Number($params.azimuth) < -90 || Number($params.azimuth) > 90}
					<div class="invalid-tooltip" transition:slide>
						Azimuth must be between -90° (east) and 90° (west)
					</div>
				{/if}
			</div>
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
								<div class="group flex items-center">
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

				<div class="text-muted-foreground mt-1 text-sm">
					Note: You can further adjust the forecast time range for hourly weather variables using <mark
						>&forecast_hours=</mark
					>
					and <mark>&past_hours=</mark> as shown below.
				</div>
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

					<div class="relative col-span-2">
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
					<div class="relative col-span-2">
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
				id="models"
				title="Weather models"
				count={countVariables(models, $params.models)}
			>
				<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
					{#each models as group}
						<div class="mb-3">
							{#each group as e}
								<div class="group flex items-center">
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
		<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
			{#each daily as group}
				{#each group as e}
					<div class="group flex items-center">
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

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6"><LicenseSelector /></div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultPreview {params} {defaultParameters} model_default="eumetsat_lsa_saf_msg" />
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2>
	<div class="mt-2 md:mt-4">
		<p>TODO docs</p>
		<table class="table">
			<thead>
				<tr>
					<th scope="col">Provider</th>
					<th scope="col">Satellite</th>
					<th scope="col">Region</th>
					<th scope="col">Spatial Resolution</th>
					<th scope="col">Temporal Resolution</th>
					<th scope="col">Update frequency</th>
					<th scope="col">Delay</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th rowspan="2" scope="row"
						><a href="https://lsa-saf.eumetsat.int/en/data/products/radiation/" target="_blank"
							>EUMETSAT LSA SAF</a
						></th
					>
					<td>MSG</td>
					<td>Europe, Africa, South America (only land)</td>
					<td>0.05° (~ 5km)</td>
					<td>15 minutely</td>
					<td>Every Hour</td>
					<td>1 Hour</td>
				</tr>
				<tr>
					<td>IODC</td>
					<td>Europe, Africa, India (only land)</td>
					<td>0.05° (~ 5km)</td>
					<td>15 minutely</td>
					<td>Every Hour</td>
					<td>2 Hours</td>
				</tr>
				<tr>
					<th scope="row"
						><a
							href="https://wui.cmsaf.eu/safira/action/viewDoiDetails?acronym=SARAH_V003"
							target="_blank">EUMETSAT CM SAF SARAH3</a
						></th
					>
					<td>MSG</td>
					<td>Europe, Africa, South America</td>
					<td>0.05° (~ 5km)</td>
					<td>30 minutely</td>
					<td>Every Hour</td>
					<td>2 Days</td>
				</tr>
				<tr>
					<th scope="row"
						><a href="https://www.eorc.jaxa.jp/ptree/userguide.html" target="_blank">JMA JAXA</a
						></th
					>
					<td>Himawari-9</td>
					<td>India, Asia, Australia, New Zealand</td>
					<td>0.05° (~ 5km)</td>
					<td>10 minutely</td>
					<td>Every 10 minutes</td>
					<td>20 Minutes</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2>
	<div class="mt-2 md:mt-4">
		<p>
			For a detailed list of all available weather variables please refer to the general <a
				href="/en/docs">Weather Forecast API</a
			>. Only notable remarks are listed below
		</p>
		<ul>
			<li>
				<strong>Himawari direct and diffuse radiation</strong> JMA JAXA provides only shortwave
				radiation data and does not offer direct or diffuse solar radiation. Open-Meteo applies the
				separation model from
				<a
					href="https://www.ise.fraunhofer.de/content/dam/ise/de/documents/publications/conference-paper/36-eupvsec-2019/Guzman_5CV31.pdf"
					>Razo, Müller Witwer</a
				> to calculate direct radiation from shortwave solar radiation.
			</li>
			<li>
				<strong>Instantaneous Values Correction</strong>: All satellites provide data as
				instantaneous values. However, a full Earth scan takes approximately 10–15 minutes. As a
				result, the top and bottom of each scan have a significant time difference. To ensure
				comparability with data sources like weather models, OpenMeteo corrects for these scan time
				differences and derives backward-averaged values.
			</li>
		</ul>
	</div>
</div>

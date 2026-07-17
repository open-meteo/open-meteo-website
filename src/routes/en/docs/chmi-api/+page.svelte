<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { countVariables } from '$lib/utils/meteo';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import ZoomableImageGallery from '$lib/components/media/zoomable-image-gallery.svelte';
	import ZoomableImage from '$lib/components/media/zoomable-image.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
	import TimeSelector from '$lib/components/time/time-selector.svelte';

	import {
		forecastHoursOptions,
		forecastMinutely15Options,
		gridCellSelectionOptions,
		pastDaysOptions,
		pastHoursOptions,
		pastMinutely15Options,
		temporalResolutionOptions
	} from '../options';
	import {
		additionalVariables,
		daily,
		defaultParameters,
		forecastDaysOptions,
		hourly,
		models,
		solarVariables
	} from './options';

	const params = urlHashStore({
		latitude: [50.088],
		longitude: [14.4208],
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

	let beginDate = new SvelteDate();
	beginDate.setMonth(beginDate.getMonth() - 3);

	let lastDate = new SvelteDate();
	lastDate.setDate(lastDate.getDate() + 10);
</script>

<svelte:head>
	<title>CHMI Aladin Weather Model API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/chmi-api" />
	<meta
		name="description"
		content="Weather forecasts from the Czech CHMI ALADIN model at up to 1 km resolution for the Czech Republic and Central Europe. Free weather API for non-commercial use, no key required."
	/>
</svelte:head>

<form method="get" action="https://api.open-meteo.com/v1/forecast">
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
										$params.hourly?.push(value);
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
											if (value && $params.hourly?.includes(value)) {
												$params.hourly = $params.hourly.filter((item: string) => {
													return item !== value;
												});
											} else if (value && $params.hourly) {
												$params.hourly?.push(value);
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
												$params.hourly?.push(value);
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
	<ResultsPreview
		{params}
		{defaultParameters}
		model_default="chmi_aladin_seamless"
		defaultTimeParameters={false}
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<p>
			The Czech Hydrometeorological Institute (CHMI) runs the ALADIN limited-area weather model and
			publishes forecasts as <a
				class="text-link underline"
				href="https://opendata.chmi.cz/meteorology/weather/nwp_aladin/"
				target="_blank">open data</a
			>. Both domains provide hourly forecasts for 3 days and are updated every 6 hours. The Central
			Europe domain additionally includes atmospheric data on 17 pressure levels. The
			<mark>CHMI Aladin Seamless</mark> model automatically uses the 1 km Czech Republic domain where
			available and falls back to the Central Europe domain otherwise.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-250">
				<caption
					>You can find the update timings in the <a
						class="text-link underline"
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
						<th scope="row">CHMI Aladin Central Europe 2km</th>
						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[32px] shrink-0 items-center gap-2">
									<img
										height="26"
										width="26"
										src="/images/country-flags/european_union.svg"
										alt="European Union"
										title="European Union"
									/>
								</div>
								Central Europe
							</div>
						</td>
						<td>2.3 km</td>
						<td>Hourly</td>
						<td>3 days</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row">CHMI Aladin CZ 1km</th>

						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[32px] shrink-0 items-center gap-2">
									<img
										height="26"
										width="26"
										src="/images/country-flags/cz.svg"
										alt="Czech Republic"
										title="Czech Republic"
									/>
								</div>
								Czech Republic
							</div>
						</td>
						<td>1 km</td>
						<td>Hourly</td>
						<td>3 days</td>
						<td>Every 6 hours</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<ZoomableImageGallery class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:gap-6 lg:grid-cols-2">
		<ZoomableImage
			figureClass="w-full"
			class="w-full"
			src="/images/models/chmi_aladin_central_europe_2km.webp"
			alt="CHMI Aladin Central Europe Model Area"
		>
			{#snippet caption()}
				CHMI Aladin Central Europe Model Area. Source:
				<a href="https://maps.open-meteo.com/?domain=chmi_aladin_central_europe_2km#4.5/47.67/15.7"
					>Open-Meteo</a
				>.
			{/snippet}
		</ZoomableImage>

		<ZoomableImage
			figureClass="w-full"
			class="w-full"
			src="/images/models/chmi_aladin_cz_1km.webp"
			alt="CHMI Aladin CZ Model Area"
		>
			{#snippet caption()}
				CHMI Aladin CZ Model Area. Source:
				<a href="https://maps.open-meteo.com/?domain=chmi_aladin_cz_1km#7.05/49.569/15.71"
					>Open-Meteo</a
				>.
			{/snippet}
		</ZoomableImage>
	</ZoomableImageGallery>
</div>

<!-- DERIVED VARIABLES -->
<div class="mt-6 md:mt-12">
	<a href="#derived_variables"
		><h2 id="derived_variables" class="text-2xl md:text-3xl">Derived Variables</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			ALADIN natively provides temperature, humidity, wind, pressure, cloud cover, precipitation,
			radiation, CAPE, visibility and sunshine duration. Several convenient API variables are not
			predicted directly by the model. Open-Meteo derives them from the native fields for every
			forecast step.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<thead>
					<tr>
						<th scope="col">Derived Variable</th>
						<th scope="col">How it is derived?</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">Weather code</th>
						<td>
							Computed from cloud cover, precipitation, snowfall, wind gusts, CAPE and visibility.
							ALADIN does not publish a usable WMO weather symbol.
						</td>
					</tr>
					<tr>
						<th scope="row">Snowfall</th>
						<td>
							Converted from the native snowfall water equivalent, assuming 1 mm of water equals 0.7
							cm of snow.
						</td>
					</tr>
					<tr>
						<th scope="row">Surface pressure</th>
						<td>Calculated from mean sea-level pressure, 2 m temperature and terrain elevation.</td>
					</tr>
					<tr>
						<th scope="row">Apparent temperature</th>
						<td>
							Combines 2 m temperature, relative humidity, wind speed and shortwave radiation.
						</td>
					</tr>
					<tr>
						<th scope="row">Diffuse solar radiation</th>
						<td>
							Difference between the native shortwave (global) and native direct solar radiation. No
							radiation separation model is required.
						</td>
					</tr>
					<tr>
						<th scope="row">Direct normal irradiance DNI and global tilted irradiance GTI</th>
						<td>
							Calculated from direct and diffuse radiation using solar geometry and, for GTI, the
							selected panel tilt and azimuth.
						</td>
					</tr>
					<tr>
						<th scope="row">Reference evapotranspiration ET₀</th>
						<td>
							FAO-56 Penman-Monteith equation using temperature, humidity, wind speed and solar
							radiation.
						</td>
					</tr>
					<tr>
						<th scope="row">Vapour pressure deficit and wet bulb temperature</th>
						<td>Calculated from 2 m temperature, relative humidity and dew point.</td>
					</tr>
					<tr>
						<th scope="row">Terrestrial radiation and day-or-night flag</th>
						<td>Astronomical calculations for every grid cell and timestamp.</td>
					</tr>
					<tr>
						<th scope="row">Pressure-level wind speed and direction</th>
						<td>
							Calculated from the native U and V wind components (Central Europe domain only).
						</td>
					</tr>
					<tr>
						<th scope="row">Pressure-level dew point and cloud cover</th>
						<td>
							Calculated from pressure-level temperature and relative humidity (Central Europe
							domain only).
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="text-muted-foreground mt-2">
			Unlike most regional weather models, ALADIN natively provides direct solar radiation and
			sunshine duration, so these are not estimated by Open-Meteo.
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
			For a detailed list of all available weather variables please refer to the general <a
				href="/en/docs">Weather Forecast API</a
			>. Only notable remarks are listed below
		</p>
		<ul class="ml-6 list-disc">
			<li>
				<strong>Pressure Level Data:</strong> Forecasts on pressure levels are only available for
				the Central Europe 2km domain on 17 levels (1000, 950, 925, 850, 800, 700, 600, 500, 450,
				400, 350, 300, 275, 250, 200, 150 and 100 hPa), e.g. <mark>temperature_850hPa</mark> or
				<mark>wind_speed_500hPa</mark>.
			</li>
			<li>
				<strong>Snow Depth:</strong> ALADIN provides the snow cover as water equivalent (<mark
					>snow_depth_water_equivalent</mark
				>). A snow depth in metres is not available.
			</li>
			<li>
				<strong>Forecast Length:</strong> Forecasts cover 3 days. Selecting more forecast days will return
				empty values for the additional days.
			</li>
		</ul>
	</div>
</div>

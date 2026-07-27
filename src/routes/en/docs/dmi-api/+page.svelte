<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { countVariables } from '$lib/utils/meteo';
	import { slide } from '$lib/utils/transitions';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import ZoomableImage from '$lib/components/media/zoomable-image.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
	import TimeSelector from '$lib/components/time/time-selector.svelte';
	import VariableCheckboxGroups from '$lib/components/variables/variable-checkbox-groups.svelte';

	import {
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
		hourly,
		models
	} from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
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
	});

	let beginDate = new SvelteDate();
	beginDate.setMonth(beginDate.getMonth() - 3);

	let lastDate = new SvelteDate();
	lastDate.setDate(lastDate.getDate() + 10);
</script>

<svelte:head>
	<title>DMI Weather Model API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/dmi-api" />
	<meta
		name="description"
		content="Weather forecasts from the Danish Meteorological Institute HARMONIE AROME model at 2 km resolution for Central and Northern Europe. Free for non-commercial use."
	/>
</svelte:head>

<form method="get" action="https://api.open-meteo.com/v1/dmi">
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
		model_default="dmi_seamless"
		defaultTimeParameters={false}
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<p>
			DMI provides weather forecasts from the HARMONIE AROME model with ECMWF IFS initialization.
			This is a collaboration of multiple European national weather services under the name "United
			Weather Centres-West" (UWC-West). Forecasts for Europe use 2 km resolution and provide a large
			range of weather variables. All data is updated every 3 hours and provides forecast for up to
			2.5 days. After 2.5 days, Open-Meteo combines forecasts with the <a href="/en/docs/ecmwf-api"
				>ECMWF IFS HRES 9 km model</a
			> to provide up to 15 days of forecast.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
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
						<th scope="row"
							><a
								href="https://opendatadocs.dmi.govcloud.dk/Data/Forecast_Data_Weather_Model_HARMONIE_DINI_IG"
								target="_blank">DMI HARMONIE AROME DINI</a
							></th
						>
						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[26px] shrink-0 items-center gap-2">
									<img
										height="26"
										width="26"
										src="/images/country-flags/european_union.svg"
										alt="European Union"
										title="European Union"
									/>
								</div>
								Central & Northern Europe up to Iceland (green area below)
							</div>
						</td>
						<td>2 km</td>
						<td>Hourly</td>
						<td>2.5 days</td>
						<td>Every 3 hours</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:gap-6 lg:grid-cols-2">
		<ZoomableImage
			src="/images/models/dmi_harmonie_arome_europe.webp"
			alt="DMI HARMONIE AROME DINI Model Area"
		>
			{#snippet caption()}
				DMI HARMONIE AROME DINI Model Area. Source:
				<a href="https://maps.open-meteo.com/?domain=dmi_harmonie_arome_europe#3.38/57.06/4.85"
					>Open-Meteo</a
				>.
			{/snippet}
		</ZoomableImage>
	</div>
</div>

<!-- NATIVE VARIABLES -->
<div class="mt-6 md:mt-12">
	<a href="#native_model_variables"
		><h2 id="native_model_variables" class="text-2xl md:text-3xl">Native Model Variables</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			HARMONIE AROME DINI directly predicts the fields listed below. Open-Meteo retains these fields
			or uses them to calculate more convenient API variables. Notably, DMI provides direct solar
			radiation, 10 m wind speed and direction, and a 2 m cloud cover (fog) field natively.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<thead>
					<tr>
						<th scope="col">Native DMI field</th>
						<th scope="col">Level</th>
						<th scope="col">Use in the Open-Meteo API</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">Temperature</th>
						<td>2 m, 50/100/150/250 m, surface</td>
						<td><mark>temperature_2m</mark> and upper-level temperature</td>
					</tr>
					<tr>
						<th scope="row">Relative humidity</th>
						<td>2 m</td>
						<td>Relative humidity and dew point</td>
					</tr>
					<tr>
						<th scope="row">Wind speed and direction (10 m), U/V components (aloft)</th>
						<td>10 m to 450 m</td>
						<td><mark>wind_speed_10m</mark> and upper-level wind</td>
					</tr>
					<tr>
						<th scope="row">Wind gusts</th>
						<td>10 m</td>
						<td><mark>wind_gusts_10m</mark></td>
					</tr>
					<tr>
						<th scope="row">Mean sea-level pressure</th>
						<td>Mean sea level</td>
						<td><mark>pressure_msl</mark> and derived surface pressure</td>
					</tr>
					<tr>
						<th scope="row">Precipitation and snowfall water equivalent</th>
						<td>Surface</td>
						<td><mark>precipitation</mark>, <mark>rain</mark>, snowfall</td>
					</tr>
					<tr>
						<th scope="row">Direct solar radiation</th>
						<td>Surface</td>
						<td>Global, direct, diffuse radiation, DNI and GTI</td>
					</tr>
					<tr>
						<th scope="row">Cloud cover total, low, mid, high and fog fraction</th>
						<td>Surface</td>
						<td><mark>cloud_cover</mark>, layers and <mark>cloud_cover_2m</mark></td>
					</tr>
					<tr>
						<th scope="row"
							>CAPE, convective inhibition, visibility, cloud base and top, freezing level</th
						>
						<td>Surface</td>
						<td>Corresponding API variables and weather-code inputs</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="mt-2">Pressure-level data is not available for this model.</p>
	</div>
</div>

<!-- DERIVED VARIABLES -->
<div class="mt-6 md:mt-12">
	<a href="#derived_variables"
		><h2 id="derived_variables" class="text-2xl md:text-3xl">Derived Variables</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			HARMONIE AROME DINI publishes an unusually complete set of native fields, including direct
			solar radiation, 10 m wind speed and direction, CAPE, convective inhibition and a 2 m cloud
			cover (fog) field. The remaining API variables are derived by Open-Meteo.
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
						<th scope="row">Wind speed and direction at height</th>
						<td>
							Calculated from the native U and V wind components at 50 m to 450 m, corrected for the
							Lambert projection. The 10 m wind is native and needs no correction.
						</td>
					</tr>
					<tr>
						<th scope="row">Diffuse radiation and DNI</th>
						<td>
							Diffuse radiation is global minus native direct radiation. DNI follows from native
							direct radiation and solar geometry, together with GTI and instant values.
						</td>
					</tr>
					<tr>
						<th scope="row">Weather code</th>
						<td>
							Computed from cloud cover, precipitation, snowfall, wind gusts, CAPE, convective
							inhibition and visibility, so thunderstorm codes are possible.
						</td>
					</tr>
					<tr>
						<th scope="row">Snowfall and rain</th>
						<td>
							Snowfall converts the native snowfall water equivalent with 0.7 cm per mm. Rain is
							total precipitation minus the snowfall water equivalent.
						</td>
					</tr>
					<tr>
						<th scope="row">Dew point, vapour pressure deficit and wet bulb temperature</th>
						<td>Calculated from native 2 m temperature and relative humidity.</td>
					</tr>
					<tr>
						<th scope="row">Surface pressure</th>
						<td>Calculated from mean sea-level pressure, 2 m temperature and terrain elevation.</td>
					</tr>
					<tr>
						<th scope="row">Sunshine duration</th>
						<td>
							Seconds per hour with native direct normal irradiance above the WMO threshold of 120
							W/m².
						</td>
					</tr>
					<tr>
						<th scope="row">Apparent temperature and reference evapotranspiration ET₀</th>
						<td>
							Combine temperature, humidity, wind speed and solar radiation. ET₀ follows the FAO-56
							Penman-Monteith equation.
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="text-muted-foreground mt-2">
			Sunrise, sunset, daylight duration and the day-or-night flag are astronomical calculations.
			Daily values are aggregated from hourly data.
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
				<strong>Direct Solar Radiation:</strong> DMI provides direct solar radiation. Many other weather
				models only provide global solar radiation and direct solar radiation must be calculated user
				separation models.
			</li>
			<li>
				<strong>Direct Normalized Irradiance (DNI):</strong> Although DNI is available, it has not been
				integrated. Open-Meteo uses solar position algorithms which calculate DNI from direct radiation
				with (almost) the same results.
			</li>
			<li>
				<strong>Wind Direction Correction:</strong> Wind direction has been calculated from U/V wind
				component vectors. Special care has been taken to correct for the
				<mark>Lambert Conformal Conic</mark> projection. Without this correction, wind directions have
				an error of up to 15°.
			</li>
			<li>
				<strong>Cloud Cover (2m):</strong> DMI provides cloud cover at 2 metre abouve ground which can
				be interpreted as fog. This is remarkable, because only very weather models are capable of modeling
				low level cloud cover and fog with a good degree of accuracy.
			</li>
		</ul>
	</div>
</div>

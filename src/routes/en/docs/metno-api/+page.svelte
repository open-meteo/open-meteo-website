<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';

	import InfoIcon from '@lucide/svelte/icons/info';

	import { urlHashStore } from '#lib/stores/url-hash-store.js';

	import { countVariables } from '#lib/utils/meteo.js';

	import WeatherForecastError from '#lib/components/code/docs/weather-forecast-error.svx';
	import WeatherForecastObject from '#lib/components/code/docs/weather-forecast-object.svx';

	import * as Accordion from '#lib/components/ui/accordion/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';

	import AccordionItem from '#lib/components/accordion/accordion-item.svelte';
	import ApiModeDescription from '#lib/components/api-mode/api-mode-description.svelte';
	import ApiModeSelector from '#lib/components/api-mode/api-mode-selector.svelte';
	import ApiModeTimeSelector from '#lib/components/api-mode/api-mode-time-selector.svelte';
	import { apiModeFormAction } from '#lib/components/api-mode/utils.js';
	import ApiParameterTable from '#lib/components/docs/api-parameter-table.svelte';
	import {
		apiParameters,
		recentPastDaysDescription
	} from '#lib/components/docs/api-parameters.svelte';
	import ApiResponseParameterTable from '#lib/components/docs/api-response-parameter-table.svelte';
	import { apiResponseParameters } from '#lib/components/docs/api-response-parameters.svelte';
	import LicenceSelector from '#lib/components/licence/licence-selector.svelte';
	import LocationSelection from '#lib/components/location/location-selection.svelte';
	import ZoomableImage from '#lib/components/media/zoomable-image.svelte';
	import ResultsPreview from '#lib/components/response/results-preview.svelte';
	import AdditionalOptionsSelects from '#lib/components/select/additional-options-selects.svelte';
	import Settings from '#lib/components/settings/settings.svelte';
	import TiltAzimuthInputs from '#lib/components/variables/tilt-azimuth-inputs.svelte';
	import VariableCheckboxGroups from '#lib/components/variables/variable-checkbox-groups.svelte';
	import WmoCodesTable from '#lib/components/variables/wmo-codes-table.svelte';

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
		defaultParameters,
		forecastDaysOptions,
		hourly,
		models
	} from './options';

	const params = urlHashStore({
		latitude: [59.91],
		longitude: [10.75],
		...defaultParameters,
		api_mode: 'forecast',
		run: '',
		hourly: ['temperature_2m']
	});

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
	lastDate.setDate(lastDate.getDate() + 14);
</script>

<svelte:head>
	<title>MET Norway API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/metno-api" />
	<meta
		name="description"
		content="MET Norway Nordic weather forecasts at 1 km resolution with hourly updates for Scandinavia. Free weather API for non-commercial use, no key required."
	/>
</svelte:head>

<Alert.Root variant="info" class="mb-4"
	><InfoIcon />
	<Alert.Description>
		The API makes use of MET Nordic weather models exclusively for North Europe, offering
		exceptional short-term weather forecasts with hourly updates and 1 km resolution. However, for
		longer forecasts of up to 16 days, the <a class="text-link underline" href="/en/docs"
			>generic Weather Forecast API</a
		> transparently combines MET Nordic with other weather models to take advantage of hourly updates.
	</Alert.Description>
</Alert.Root>

<form
	method="get"
	action={apiModeFormAction($params.api_mode, 'https://api.open-meteo.com/v1/forecast')}
>
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- API MODE & TIME -->
	<div class="mt-6 grid items-start gap-x-6 gap-y-4 lg:grid-cols-2">
		<div>
			<ApiModeSelector bind:params={$params} />
			<ApiModeTimeSelector
				bind:params={$params}
				{beginDate}
				{lastDate}
				{pastDaysOptions}
				{forecastDaysOptions}
			/>
		</div>
		<ApiModeDescription bind:params={$params} {forecastDaysOptions} />
	</div>

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
				<AdditionalOptionsSelects
					bind:params={$params}
					{forecastHoursOptions}
					{pastHoursOptions}
					{temporalResolutionOptions}
					{gridCellSelectionOptions}
				/>
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

				<TiltAzimuthInputs bind:params={$params} />
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
	<div class="mt-3 md:mt-6">
		<LicenceSelector requires_professional_plan={$params.api_mode !== 'forecast'} />
	</div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultsPreview
		{params}
		{defaultParameters}
		model_default="metno_seamless"
		defaultTimeParameters={false}
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<p>
			This API uses local weather models from the Norwegian Meteorological Institute. The <a
				href="https://github.com/metno/NWPdocs/wiki/MET-Nordic-dataset"
				target="_blank">MET Nordic</a
			> dataset is derived from the 2.5 km MetCoOp ensemble model with ECMWF initialization. With post-processing
			based on measurement & radar and with updates every hour, the short-term forecast performance skill
			should be high.
		</p>
		<p>
			Unfortunately, only 2.5 days of forecast are available. After 2.5 days, Open-Meteo combines
			forecasts with the <a href="/en/docs/ecmwf-api">ECMWF IFS HRES 9 km model</a> to provide up to 15
			days of forecast.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-200">
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
							><a href="https://github.com/metno/NWPdocs/wiki/MET-Nordic-dataset" target="_blank"
								>MET Nordic</a
							></th
						>
						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[94px] shrink-0 items-center gap-2">
									<img
										height="26"
										width="26"
										src="/images/country-flags/no.svg"
										alt="Norway"
										title="Norway"
									/>
									<img
										height="26"
										width="26"
										src="/images/country-flags/se.svg"
										alt="Sweden"
										title="Sweden"
									/>
									<img
										height="26"
										width="26"
										src="/images/country-flags/dk.svg"
										alt="Denmark"
										title="Denmark"
									/>
								</div>
								Norway, Denmark, Sweden, Finland
							</div>
						</td>
						<td>1 km</td>
						<td>Hourly</td>
						<td>2.5 days</td>
						<td>Every hour</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:gap-6">
		<ZoomableImage src="/images/models/metno_nordic_pp.webp" alt="MET Nordic model area">
			{#snippet caption()}
				MET Nordic model area (marked in red). Source:
				<a href="https://github.com/metno/NWPdocs/wiki/MEPS-dataset">Met Norway GitHub</a>.
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
			MET Nordic is a post-processed 1 km dataset with a small set of native fields. Open-Meteo
			retains these fields or uses them to calculate more convenient API variables. Wind is provided
			directly as speed and direction and only global solar radiation is available.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<thead>
					<tr>
						<th scope="col">Native MET Nordic field</th>
						<th scope="col">Level</th>
						<th scope="col">Use in the Open-Meteo API</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">Temperature</th>
						<td>2 m</td>
						<td><mark>temperature_2m</mark></td>
					</tr>
					<tr>
						<th scope="row">Relative humidity</th>
						<td>2 m</td>
						<td>Relative humidity and dew point</td>
					</tr>
					<tr>
						<th scope="row">Wind speed and direction</th>
						<td>10 m</td>
						<td><mark>wind_speed_10m</mark>, <mark>wind_direction_10m</mark></td>
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
						<th scope="row">Total precipitation</th>
						<td>Surface</td>
						<td><mark>precipitation</mark>, <mark>rain</mark>, snowfall</td>
					</tr>
					<tr>
						<th scope="row">Global solar radiation</th>
						<td>Surface</td>
						<td>Global, direct, diffuse radiation, DNI and GTI</td>
					</tr>
					<tr>
						<th scope="row">Total cloud cover</th>
						<td>Surface</td>
						<td><mark>cloud_cover</mark></td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="mt-2">
			MET Nordic provides only total cloud cover — no cloud layers — and no CAPE, so weather codes
			cannot include thunderstorms.
		</p>
	</div>
</div>

<!-- DERIVED VARIABLES -->
<div class="mt-6 md:mt-12">
	<a href="#derived_variables"
		><h2 id="derived_variables" class="text-2xl md:text-3xl">Derived Variables</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			MET Nordic is a post-processed dataset with a small set of native fields: temperature,
			relative humidity, total cloud cover, mean sea-level pressure, wind speed and direction, wind
			gusts, global solar radiation and precipitation. Everything else in the API is derived from
			these fields.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<thead>
					<tr>
						<th scope="col">Derived Variable</th>
						<th scope="col">How is it derived?</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">Snowfall and rain</th>
						<td>
							MET Nordic has no native snow field: precipitation counts as snow below 0°C, converted
							with 0.7 cm per mm. Rain is the remainder.
						</td>
					</tr>
					<tr>
						<th scope="row">Weather code</th>
						<td>
							Computed from cloud cover, temperature, precipitation, snowfall and wind gusts.
							Without CAPE or visibility, thunderstorm and fog codes are not produced.
						</td>
					</tr>
					<tr>
						<th scope="row">Direct and diffuse solar radiation</th>
						<td>
							Only global horizontal irradiance GHI is native. Diffuse radiation is separated using
							the Razo, Müller Witwer model; direct radiation is the remainder. DNI, GTI and instant
							values follow from solar geometry.
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
							Seconds per hour with derived direct normal irradiance above the WMO threshold of 120
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
			Wind speed and direction are native model fields and are not derived. Sunrise, sunset,
			daylight duration and the day-or-night flag are astronomical calculations. Daily values are
			aggregated from hourly data.
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
			The API endpoint <mark>/v1/metno</mark> accepts a geographical coordinate, a list of weather variables
			and responds with a JSON hourly weather forecast for 2.5 days. Time always starts at 0:00 today.
			Data is only available in the Scandinavian region. All URL parameters are listed below:
		</p>
		<ApiParameterTable
			parameters={[
				apiParameters.coordinates,
				apiParameters.elevation,
				apiParameters.hourly,
				apiParameters.current,
				apiParameters.temperature_unit,
				apiParameters.wind_speed_unit,
				apiParameters.precipitation_unit,
				apiParameters.timeformat,
				apiParameters.timezone,
				{
					...apiParameters.past_days,
					format: 'Integer (0-92)',
					description: recentPastDaysDescription
				},
				{
					...apiParameters.forecast_days,
					format: 'Integer (0-3)',
					defaultValue: '3',
					description: 'Per default, 3 days are returned. Up to 3 days of forecast are possible.'
				},
				apiParameters.forecast_hours,
				apiParameters.start_date,
				apiParameters.start_hour,
				apiParameters.cell_selection,
				apiParameters.apikey
			]}
		/>
	</div>
	<p class="text-muted-foreground mt-2">
		Additional optional URL parameters will be added. For API stability, no required parameters will
		be added in the future!
	</p>
</div>

<!-- API DOCS - HOURLY -->
<div class="mt-6 md:mt-12">
	<a href="#hourly_parameter_definition"
		><h3 id="hourly_parameter_definition" class="text-xl md:text-2xl">
			Hourly Parameter Definition
		</h3></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			The parameter <mark>&hourly=</mark> accepts the following values. Most weather variables are given
			as an instantaneous value for the indicated hour. Some variables like precipitation are calculated
			from the preceding hour as and average or sum.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
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
						<th scope="row">precipitation</th>
						<td>Preceding hour sum</td>
						<td>mm (inch)</td>
						<td>Total precipitation (rain, showers, snow) sum of the preceding hour</td>
					</tr>
					<tr>
						<th scope="row">pressure_msl<br />surface_pressure</th>
						<td>Instant</td>
						<td>hPa</td>
						<td
							>Atmospheric air pressure reduced to sea level (Mean sea level) and actual pressure at
							surface level</td
						>
					</tr>
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
						<th scope="row">cloud_cover</th>
						<td>Instant</td>
						<td>%</td>
						<td>Total cloud cover as an area fraction</td>
					</tr>

					<tr>
						<th scope="row">wind_speed_10m</th>
						<td>Instant</td>
						<td>km/h (mph, m/s, knots)</td>
						<td
							>Wind speed at 10 meters above ground. Wind speed on 10 meters is the standard level..</td
						>
					</tr>
					<tr>
						<th scope="row">wind_direction_10m</th>
						<td>Instant</td>
						<td>°</td>
						<td>Wind direction at 10 meters above ground.</td>
					</tr>
					<tr>
						<th scope="row">wind_gusts_10m</th>
						<td>Preceding hour max</td>
						<td>km/h (mph, m/s, knots)</td>
						<td>Gusts at 10 meters above ground as a maximum of the preceding hour</td>
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
							the normal plane (perpendicular to the sun)</td
						>
					</tr>
					<tr>
						<th scope="row">diffuse_radiation</th>
						<td>Preceding hour mean</td>
						<td>W/m²</td>
						<td
							>Diffuse solar radiation as average of the preceding hour. MET Nordic does not offers
							diffuse and direct radiation directly. It is approximated based on <a
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
							is set to "nan", the calculation assumes a vertical tracker (east-west). If tilt is
							set to "nan", it is assumed that the panel has a horizontal tracker (up-down). If both
							are set to "nan", a bi-axial tracker is assumed.</td
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
							>Vapor Pressure Deficit (VPD) in kilopascal (kPa). For high VPD (&gt;1.6), water
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
							precipitation, snowfall and gusts. As MET Nordic has barely no information about
							atmospheric stability, estimation about thunderstorms is not possible.</td
						>
					</tr>
					<tr>
						<th scope="row">snowfall</th>
						<td>Preceding hour sum</td>
						<td>cm (inch)</td>
						<td
							>Snowfall amount of the preceding hour in centimeters. For the water equivalent in
							millimeter, divide by 7. E.g. 7 cm snow = 10 mm precipitation water equivalent.
							Snowfall amount is not provided by MET Nordic directly, instead it is approximated
							based on total precipitation and temperature</td
						>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- API DOCS - JSON -->
<div class="mt-6 md:mt-12">
	<a href="#json_return_object"
		><h3 id="json_return_object" class="text-xl md:text-2xl">JSON Return Object</h3></a
	>
	<div class="mt-2 md:mt-4">
		<p class="">On success a JSON object will be returned.</p>
		<div
			class="pregenerated-code code-numbered -mx-6 mt-2 overflow-auto rounded-lg bg-[#FAFAFA] md:mt-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
		>
			<WeatherForecastObject />
		</div>
		<ApiResponseParameterTable
			parameters={[
				apiResponseParameters.coordinates,
				apiResponseParameters.elevation,
				apiResponseParameters.generationtime_ms,
				apiResponseParameters.utc_offset_seconds,
				apiResponseParameters.timezone,
				apiResponseParameters.hourly,
				apiResponseParameters.hourly_units,
				apiResponseParameters.daily,
				apiResponseParameters.daily_units
			]}
		/>
	</div>
</div>

<!-- API DOCS - ERRORS -->
<div class="mt-6 md:mt-12">
	<a href="#errors"><h3 id="errors" class="text-xl md:text-2xl">Errors</h3></a>
	<div class="mt-2 md:mt-4">
		<p>
			In case an error occurs, for example a URL parameter is not correctly specified, a JSON error
			object is returned with a HTTP 400 status code.
		</p>
		<div
			class="pregenerated-code -mx-6 mt-2 overflow-auto rounded-lg bg-[#FAFAFA] md:mt-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
		>
			<WeatherForecastError />
		</div>
	</div>
</div>

<!-- WEATHER VARIABLES -->
<div class="mt-6 md:mt-12">
	<a href="#weather_variable_documentation"
		><h2 id="weather_variable_documentation" class="text-2xl md:text-3xl">
			Weather variable documentation
		</h2></a
	>
	<WmoCodesTable />
</div>

<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { countPressureVariables, countVariables } from '$lib/utils/meteo';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import ApiModeDescription from '$lib/components/api-mode/api-mode-description.svelte';
	import ApiModeSelector from '$lib/components/api-mode/api-mode-selector.svelte';
	import ApiModeTimeSelector from '$lib/components/api-mode/api-mode-time-selector.svelte';
	import { apiModeFormAction } from '$lib/components/api-mode/utils';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import PressureVariablesSelector from '$lib/components/pressure/pressure-variables-selector.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import AdditionalOptionsSelects from '$lib/components/select/additional-options-selects.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
	import VariableCheckboxGroups from '$lib/components/variables/variable-checkbox-groups.svelte';

	import {
		forecastHoursOptions,
		gridCellSelectionOptions,
		pastDaysOptions,
		pastHoursOptions,
		temporalResolutionOptions
	} from '../options';
	import {
		additionalVariables,
		daily,
		defaultParameters,
		ensembleSpreadVariables,
		forecastDaysOptions,
		hourly,
		levels,
		models,
		pressureVariables
	} from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		api_mode: 'forecast',
		run: '',
		hourly: ['temperature_2m']
	});

	let timezoneInvalid = $derived(
		$params.timezone == 'UTC' && ($params.daily ? $params.daily.length > 0 : false)
	);

	let spreadWithoutMeanModel = $derived(
		($params.hourly?.some((v: string) => v.endsWith('_spread')) ?? false) &&
			!$params.models?.includes('google_weathernext2_ensemble_mean')
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
			$params.hourly &&
			countPressureVariables(pressureVariables, levels, $params.hourly).active &&
			!accordionValues.includes('pressure-levels')
		) {
			accordionValues.push('pressure-levels');
		}

		if (
			countVariables(ensembleSpreadVariables, $params.hourly).active &&
			!accordionValues.includes('ensemble-spread-variables')
		) {
			accordionValues.push('ensemble-spread-variables');
		}

		if (countVariables(models, $params.models).active > 1 && !accordionValues.includes('models')) {
			accordionValues.push('models');
		}
	});

	let beginDate = new SvelteDate();
	beginDate.setMonth(beginDate.getMonth() - 3);

	let lastDate = new SvelteDate();
	lastDate.setDate(lastDate.getDate() + 15);
</script>

<svelte:head>
	<title>Google WeatherNext API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/google-weathernext-api" />
	<meta
		name="description"
		content="Google WeatherNext 2 ensemble forecasts with 64 members, pressure-level data and derived cloud cover through the Open-Meteo API."
	/>
</svelte:head>

<form
	method="get"
	action={apiModeFormAction($params.api_mode, 'https://ensemble-api.open-meteo.com/v1/ensemble')}
>
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- API MODE & TIME -->
	<div class="mt-6 grid items-start gap-x-6 gap-y-4 lg:grid-cols-2">
		<div>
			<ApiModeSelector bind:params={$params} modes={['forecast', 'historical_forecast']} />
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
				id="pressure-levels"
				title="Pressure Level Variables"
				count={countPressureVariables(pressureVariables, levels, $params.hourly)}
			>
				<PressureVariablesSelector
					{pressureVariables}
					{levels}
					bind:values={$params.hourly}
					note={false}
				/>
			</AccordionItem>
			<AccordionItem
				id="ensemble-spread-variables"
				title="Ensemble Spread Variables"
				count={countVariables(ensembleSpreadVariables, $params.hourly)}
			>
				<VariableCheckboxGroups
					class="mt-2 grid sm:grid-cols-2"
					groups={ensembleSpreadVariables}
					bind:values={$params.hourly}
					idSuffix="hourly"
				/>
				{#if spreadWithoutMeanModel}
					<div transition:slide>
						<Alert.Root variant="warning" class="mt-2 md:mt-4 mb-2">
							<Alert.Description>
								Ensemble spread variables are only available from the "Google WeatherNext 2 Ensemble
								Mean" model. Please also select it in the weather models section below.
							</Alert.Description>
						</Alert.Root>
					</div>
				{/if}
				<div>
					<small class="text-muted-foreground"
						>Note: Ensemble spread variables are calculated by Open-Meteo.
					</small>
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
						>Note: Mean values are calculated by Open-Meteo.
					</small>
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
	<div class="mt-3 md:mt-6"><LicenceSelector requires_professional_plan={true} /></div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultsPreview
		{params}
		{defaultParameters}
		type="ensemble"
		action="ensemble"
		sdk_type="ensemble_api"
		model_default="google_weathernext2_ensemble"
		defaultTimeParameters={false}
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<p>
			<a href="https://developers.google.com/weathernext/guides/models" target="_blank"
				>Google DeepMind WeatherNext 2</a
			>
			is a global AI ensemble weather model with 64 members on a regular 0.25° latitude-longitude grid.
			The ensemble describes a range of possible weather developments and can be used to estimate forecast
			uncertainty and the risk of less likely events.
		</p>
		<p class="mt-2">
			The source dataset contains 60 forecast steps at 6-hour intervals. It does not include
			forecast hour zero: the first value is valid 6 hours after model initialization and the last
			value is valid at 360 hours, or 15 days. Google produces runs initialized at 00, 06, 12 and 18
			UTC. At present, Open-Meteo processes the 00 and 12 UTC runs because the 06 and 18 UTC data do
			not arrive in time for the current update schedule. See Google's
			<a href="https://developers.google.com/weathernext/guides/dissemination" target="_blank"
				>dissemination schedule</a
			>
			for upstream release times.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<caption>
					You can find Open-Meteo's current update timings in the <a
						class="text-link underline"
						href="/en/docs/model-updates">model updates documentation</a
					>.
				</caption>
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
						<th scope="row">Google WeatherNext 2</th>
						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[26px] shrink-0 items-center gap-2">
									<div class="flex h-[26px] w-[26px] items-center justify-center text-[23px]">
										🌍
									</div>
								</div>
								Global
							</div>
						</td>
						<td>0.25°</td>
						<td>6-hourly</td>
						<td>15 days</td>
						<td>Every 12 hours</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- NATIVE VARIABLES -->
<div class="mt-6 md:mt-12">
	<a href="#native_model_variables"
		><h2 id="native_model_variables" class="text-2xl md:text-3xl">Native Model Variables</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			WeatherNext directly predicts the atmospheric fields listed below. Open-Meteo retains these
			fields or uses them to calculate more convenient API variables. In particular, the source
			model provides specific humidity and wind components rather than relative humidity, wind speed
			or wind direction.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<thead>
					<tr>
						<th scope="col">Native WeatherNext field</th>
						<th scope="col">Level</th>
						<th scope="col">Use in the Open-Meteo API</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">2 m temperature</th>
						<td>2 m above ground</td>
						<td><mark>temperature_2m</mark></td>
					</tr>
					<tr>
						<th scope="row">Sea-surface temperature</th>
						<td>Surface</td>
						<td><mark>sea_surface_temperature</mark></td>
					</tr>
					<tr>
						<th scope="row">Mean sea-level pressure</th>
						<td>Mean sea level</td>
						<td><mark>pressure_msl</mark> and derived surface pressure</td>
					</tr>
					<tr>
						<th scope="row">Total precipitation</th>
						<td>Surface</td>
						<td><mark>precipitation</mark>, accumulated over the preceding 6 hours</td>
					</tr>
					<tr>
						<th scope="row">U and V wind components</th>
						<td>10 m and 100 m above ground</td>
						<td>Wind speed and direction at 10 and 100 m height above ground</td>
					</tr>
					<tr>
						<th scope="row">Temperature</th>
						<td>13 pressure levels</td>
						<td>Temperature and humidity-related pressure-level variables</td>
					</tr>
					<tr>
						<th scope="row">Specific humidity</th>
						<td>13 pressure levels</td>
						<td>Input for derived relative humidity</td>
					</tr>
					<tr>
						<th scope="row">Geopotential</th>
						<td>13 pressure levels</td>
						<td>Geopotential height</td>
					</tr>
					<tr>
						<th scope="row">U and V wind components</th>
						<td>13 pressure levels</td>
						<td>Pressure-level wind speed and direction</td>
					</tr>
					<tr>
						<th scope="row">Vertical velocity</th>
						<td>13 pressure levels</td>
						<td>Geometric vertical velocity</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="mt-2">
			The pressure levels are 1000, 925, 850, 700, 600, 500, 400, 300, 250, 200, 150, 100 and 50
			hPa. See Google's
			<a href="https://developers.google.com/weathernext/guides/model-specs-vmg" target="_blank"
				>model specification and data schema</a
			>
			for the original dataset layout.
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
			Several convenient API variables are not predicted directly by WeatherNext. Open-Meteo derives
			them from the native fields for every ensemble member and forecast step.
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
						<th scope="row">Relative humidity</th>
						<td>
							Calculated at every pressure level from WeatherNext specific humidity, temperature and
							pressure. Native specific humidity is not exposed as a selectable API variable.
						</td>
					</tr>
					<tr>
						<th scope="row">Low cloud cover</th>
						<td>Derived from relative humidity at 1000, 925 and 850 hPa.</td>
					</tr>
					<tr>
						<th scope="row">Mid cloud cover</th>
						<td>Derived from relative humidity at 700, 600, 500 and 400 hPa.</td>
					</tr>
					<tr>
						<th scope="row">High cloud cover</th>
						<td>Derived from relative humidity at 300, 250, 200, 150, 100 and 50 hPa.</td>
					</tr>
					<tr>
						<th scope="row">Total cloud cover</th>
						<td>Calculated by combining the derived low, mid and high cloud layers.</td>
					</tr>
					<tr>
						<th scope="row">Wind speed and direction</th>
						<td>Calculated from the native U and V wind components.</td>
					</tr>
					<tr>
						<th scope="row">Dew point and pressure-level cloud cover</th>
						<td>Calculated by the API from pressure-level temperature and relative humidity.</td>
					</tr>
					<tr>
						<th scope="row">Rain, snowfall and weather code</th>
						<td>
							Estimated from total precipitation, temperature and the derived cloud information.
							WeatherNext does not predict these fields directly.
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="text-muted-foreground mt-2">
			Cloud cover is an estimate based on the vertical humidity profile. It is not a native cloud
			fraction forecast from WeatherNext.
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
			Use the endpoint <mark>/v1/ensemble</mark> with
			<mark>models=google_weathernext2_ensemble</mark>. The tables below describe the variables
			specific to this model. Refer to the general
			<a href="/en/docs/ensemble-api">Ensemble API documentation</a>
			for URL parameters, response formats and the naming of individual ensemble members.
		</p>

		<a href="#hourly_parameter_definition"
			><h3 id="hourly_parameter_definition" class="mt-6 text-xl md:text-2xl">
				Hourly Parameter Definition
			</h3></a
		>
		<p class="mt-2">
			The API uses the common <mark>&hourly=</mark> parameter name. The table describes the default
			hourly output. WeatherNext provides native values every 6 hours, which the API interpolates to
			hourly time steps. Set <mark>temporal_resolution=native</mark> to return only the original 6-hour
			model intervals. At native resolution, precipitation is the accumulated sum of the preceding 6 hours;
			for hourly output, this total is distributed over the six corresponding hourly intervals while preserving
			the sum.
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
						<th scope="row">temperature_2m<br />sea_surface_temperature</th>
						<td>Indicated hour</td>
						<td>°C (°F)</td>
						<td
							>Air temperature 2 m above ground and water temperature at the sea surface,
							interpolated from the 6-hourly model values.</td
						>
					</tr>
					<tr>
						<th scope="row">pressure_msl<br />surface_pressure</th>
						<td>Indicated hour</td>
						<td>hPa</td>
						<td
							>Pressure at mean sea level and estimated pressure at the selected surface elevation,
							based on interpolated 6-hourly model values.</td
						>
					</tr>
					<tr>
						<th scope="row">precipitation</th>
						<td>Preceding hour sum</td>
						<td>mm (inch)</td>
						<td
							>Total liquid and frozen precipitation. Each native 6-hour accumulation is distributed
							over six hourly intervals.</td
						>
					</tr>
					<tr>
						<th scope="row">rain<br />snowfall<br />snowfall_water_equivalent</th>
						<td>Preceding hour sum</td>
						<td>mm or cm (inch)</td>
						<td
							>Rain and snowfall components derived from the hourly precipitation and temperature
							values.</td
						>
					</tr>
					<tr>
						<th scope="row"
							>cloud_cover<br />cloud_cover_low<br />cloud_cover_mid<br />cloud_cover_high</th
						>
						<td>Indicated hour</td>
						<td>%</td>
						<td
							>Cloud cover is derived from relative humidity at the native 6-hour timestamps and
							then interpolated for hourly output.</td
						>
					</tr>
					<tr>
						<th scope="row">wind_speed_10m<br />wind_speed_100m</th>
						<td>Indicated hour</td>
						<td>km/h (m/s, mph, knots)</td>
						<td>Wind speed derived after interpolating the native U and V components.</td>
					</tr>
					<tr>
						<th scope="row">wind_direction_10m<br />wind_direction_100m</th>
						<td>Indicated hour</td>
						<td>°</td>
						<td>Wind direction derived after interpolating the native U and V components.</td>
					</tr>
					<tr>
						<th scope="row">weather_code<br />is_day</th>
						<td>Indicated hour</td>
						<td>WMO code / boolean</td>
						<td
							>Weather code is derived from the hourly weather fields. Day-or-night status is
							calculated directly for every requested timestamp.</td
						>
					</tr>
				</tbody>
			</table>
		</div>

		<a href="#pressure_level_parameter_definition"
			><h3 id="pressure_level_parameter_definition" class="mt-6 text-xl md:text-2xl">
				Pressure-Level Parameter Definition
			</h3></a
		>
		<p class="mt-2">
			Append a supported pressure level to the variable name, for example
			<mark>temperature_500hPa</mark> or <mark>relative_humidity_850hPa</mark>. Native
			pressure-level fields are available at 6-hour intervals and are interpolated for the default
			hourly output.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<thead>
					<tr>
						<th scope="col">Variable pattern</th>
						<th scope="col">Unit</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">temperature_*hPa</th>
						<td>°C (°F)</td>
						<td>Air temperature interpolated from native 6-hourly pressure-level values.</td>
					</tr>
					<tr>
						<th scope="row">relative_humidity_*hPa<br />dew_point_*hPa</th>
						<td>% / °C (°F)</td>
						<td
							>Relative humidity is interpolated from the 6-hourly derived values. Dew point is
							calculated from hourly temperature and relative humidity.</td
						>
					</tr>
					<tr>
						<th scope="row">cloud_cover_*hPa</th>
						<td>%</td>
						<td>Estimated for each hour from the interpolated relative humidity.</td>
					</tr>
					<tr>
						<th scope="row">wind_speed_*hPa<br />wind_direction_*hPa</th>
						<td>km/h (m/s, mph, knots) / °</td>
						<td>Wind speed and direction derived after interpolating native U and V components.</td>
					</tr>
					<tr>
						<th scope="row">vertical_velocity_*hPa</th>
						<td>km/h (m/s, mph, knots)</td>
						<td>Geometric vertical velocity interpolated from 6-hourly values.</td>
					</tr>
					<tr>
						<th scope="row">geopotential_height_*hPa</th>
						<td>m</td>
						<td>
							Height of the selected pressure surface above mean sea level, interpolated from
							6-hourly values.</td
						>
					</tr>
				</tbody>
			</table>
		</div>

		<a href="#daily_parameter_definition"
			><h3 id="daily_parameter_definition" class="mt-6 text-xl md:text-2xl">
				Daily Parameter Definition
			</h3></a
		>
		<p class="mt-2">
			Daily values are calculated from the 6-hourly forecast steps within the selected timezone. The
			available parameters include mean, minimum and maximum 2 m temperature; precipitation, rain
			and snowfall sums; precipitation hours; mean, minimum and maximum wind speed at 10 m and 100
			m; dominant wind direction; mean, minimum and maximum cloud cover; and mean, minimum and
			maximum mean-sea-level and surface pressure. Select a timezone when requesting daily data so
			that the aggregation matches the intended local calendar day.
		</p>
	</div>
</div>

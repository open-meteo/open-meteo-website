<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select';

	import Settings from '$lib/components/settings/settings.svelte';
	import DatePicker from '$lib/components/date/date-picker.svelte';
	import ResultPreview from '$lib/components/highcharts/result-preview.svelte';
	import LicenseSelector from '$lib/components/license/license-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';

	import WeatherForecastError from '$lib/components/code/docs/weather-forecast-error.svx';
	import WeatherForecastObject from '$lib/components/code/docs/weather-forecast-object.svx';

	import { daily, six_hourly, defaultParameters, forecastDaysOptions } from './options';

	import { pastDaysOptions } from '../options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		daily: ['temperature_2m_max']
	});

	let forecastDays = $derived(
		forecastDaysOptions.find((fco) => fco.value == $params.forecast_days)
	);
	let pastDays = $derived(pastDaysOptions.find((pdo) => pdo.value == $params.past_days));

	let begin_date = new Date('2022-06-08');

	let last_date = new Date();
	last_date.setDate(last_date.getDate() + 274);
</script>

<svelte:head>
	<title>Seasonal Weather Forecast API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/seasonal-forecast-api" />
</svelte:head>

<Alert.Root class="border-border mb-4">
	<Alert.Description>Work in progress!</Alert.Description>
</Alert.Root>

<form method="get" action="https://seasonal-api.open-meteo.com/v1/seasonal">
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

	<!-- 6 HOURLY -->
	<div class="mt-6 md:mt-12">
		<h2 id="6_hourly_weather_variables" class="text-2xl md:text-3xl">6-Hourly Weather Variables</h2>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each six_hourly as group}
				<div>
					{#each group as e}
						<div class="group flex items-center" title={e.label}>
							<Checkbox
								id="{e.value}_six_hourly"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								value={e.value}
								checked={$params.six_hourly?.includes(e.value)}
								aria-labelledby="{e.value}_six_hourly_label"
								onCheckedChange={() => {
									if ($params.six_hourly?.includes(e.value)) {
										$params.six_hourly = $params.six_hourly.filter((item) => {
											return item !== e.value;
										});
									} else {
										$params.six_hourly.push(e.value);
										$params.six_hourly = $params.six_hourly;
									}
								}}
							/>
							<Label
								id="{e.value}_six_hourly_label"
								for="{e.value}_six_hourly"
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
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
	<ResultPreview
		{params}
		{defaultParameters}
		type="seasonal"
		action="seasonal"
		sdk_type="ensemble_api"
	/>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2>
	<div class="mt-2 md:mt-4">
		<p>
			The API endpoint <mark>/v1/ecmwf</mark> accepts a geographical coordinate, a list of weather variables
			and responds with a JSON hourly weather forecast for 7 days. Time always starts at 0:00 today and
			contains 168 hours. All URL parameters are listed below:
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1140px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
							epoch time in seconds. Please note that all time is then in GMT+0! For daily values
							with unix timestamp, please apply
							<mark>utc_offset_seconds</mark> again to get the correct date.
						</td>
					</tr>
					<tr>
						<th scope="row">past_days</th>
						<td>Integer (0-92)</td>
						<td>No</td>
						<td><mark>0</mark></td>
						<td
							>If <mark>past_days</mark> is set, yesterday or the day before yesterday data are also
							returned.</td
						>
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
						<th scope="row">cell_selection</th>
						<td>String</td>
						<td>No</td>
						<td><mark>nearest</mark></td>
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

<!-- API DOCS - 6 HOURLY -->
<div class="mt-6 md:mt-12">
	<h3 id="6_hourly_parameter_definition" class="text-xl md:text-2xl">
		6-Hourly Parameter Definition
	</h3>
	<div class="mt-2 md:mt-4">
		<p>
			The parameter <mark>&hourly=</mark> accepts the following values. Most weather variables are given
			as an instantaneous value for the indicated hour. Some variables like precipitation are calculated
			from the preceding hour as and average or sum.
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1140px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
						<th scope="row">pressure_msl<br />surface_pressure</th>
						<td>Instant</td>
						<td>hPa</td>
						<td
							>Atmospheric air pressure reduced to sea level (Mean sea level) and actual pressure at
							surface level</td
						>
					</tr>
					<tr>
						<th scope="row">surface_temperature</th>
						<td>Instant</td>
						<td>°C (°F)</td>
						<td
							>Temperature of the the surface. Depending on the type of surface (e.g. concrete) this
							temperature can be significantly higher then the 2 meter air temperature</td
						>
					</tr>
					<tr>
						<th scope="row">soil_temperature_0_7cm</th>
						<td>Instant</td>
						<td>°C (°F)</td>
						<td>Average temperature of the first soil level 0-7 cm below ground.</td>
					</tr>
					<tr>
						<th scope="row">total_column_integrated_water_vapour</th>
						<td>Instant</td>
						<td>kg/m²</td>
						<td>Total amount of water in the atmosphere.</td>
					</tr>
					<tr>
						<th scope="row">temperature_2m<br />temperature_1000hPa, ...</th>
						<td>Instant</td>
						<td>°C (°F)</td>
						<td
							>Air temperature 2 meter above ground. Additional temperature in the atmopshere are
							given on different pressure levels.
						</td>
					</tr>
					<tr>
						<th scope="row">geopotential_height_1000hPa</th>
						<td>Instant</td>
						<td>gpm</td>
						<td>Geopotential height on different atmospheric pressure levels</td>
					</tr>
					<tr>
						<th scope="row">wind_speed_10m</th>
						<td>Instant</td>
						<td>gpm</td>
						<td>Geopotential height on different atmospheric pressure levels</td>
					</tr>
					<tr>
						<th scope="row">wind_speed_10m<br />wind_speed_1000hPa, ...</th>
						<td>Instant</td>
						<td>km/h (mph, m/s, knots)</td>
						<td
							>Wind speed at 10 meters above ground. Wind speed on 10 meters is the standard level.
							Additional wind speeds are given on atmospheric pressure levels.</td
						>
					</tr>
					<tr>
						<th scope="row">wind_direction_10m<br />wind_direction_1000hPa, ...</th>
						<td>Instant</td>
						<td>°</td>
						<td>Wind direction at 10 meters above ground and different pressure levels.</td>
					</tr>
					<tr>
						<th scope="row">relative_humidity_2m<br />relative_humidity_1000hPa, ...</th>
						<td>Instant</td>
						<td>%</td>
						<td>Relative humidity at 2 meters above ground and atmospheric pressure levels</td>
					</tr>
					<tr>
						<th scope="row">specific_humidity_1000hPa, ...</th>
						<td>Instant</td>
						<td>g/kg</td>
						<td>Specific humidity at different atmospheric pressure levels</td>
					</tr>
					<tr>
						<th scope="row">atmosphere_relative_vorticity_1000hPa, ...</th>
						<td>Instant</td>
						<td>s⁻¹</td>
						<td>Relative vorticity at different atmospheric pressure levels</td>
					</tr>
					<tr>
						<th scope="row">divergence_of_wind, ...</th>
						<td>Instant</td>
						<td>s⁻¹</td>
						<td>Differgence of wind at different atmospheric pressure levels</td>
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

<div class="mt-6">
	<p>
		This service is based on data and products of the European Centre for Medium-Range Weather
		Forecasts (ECMWF). Source <a href="https://www.ecmwf.int">www.ecmwf.int</a>. ECMWF does not
		accept any liability whatsoever for any error or omission in the data, their availability, or
		for any loss or damage arising from their use.
	</p>
</div>

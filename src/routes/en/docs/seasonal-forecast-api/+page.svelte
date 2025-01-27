<script lang="ts">
	import { fade } from 'svelte/transition';

	import { urlHashStore } from '$lib/utils/url-hash-store';

	import DatePicker from '$lib/components/date/date-picker.svelte';
	import ResultPreview from '$lib/components/highcharts/result-preview.svelte';
	import LicenseSelector from '$lib/components/license/license-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';

	import Clock from 'lucide-svelte/icons/clock';
	import Calendar from 'lucide-svelte/icons/calendar-cog';

	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select/index';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

	import { daily, six_hourly, defaultParameters } from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		daily: ['temperature_2m_max']
	});
</script>

<svelte:head>
	<title>Seasonal Weather Forecast API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/seasonal-forecast-api" />
</svelte:head>

<Alert.Root variant="informative">
	<Alert.Description>Work in progress!</Alert.Description>
</Alert.Root>

<form method="get" action="https://seasonal-api.open-meteo.com/v1/seasonal">
	<LocationSelection bind:params={$params} />

	<div>
		<div>
			<ul class="nav nav-underline">
				<li style="width: 70px;">
					<span class="nav-link disabled" aria-disabled="true">Time:</span>
				</li>
				<li>
					<button
						class="nav-link"
						class:active={$params.time_mode == 'forecast_days'}
						id="pills-forecast_days-tab"
						type="button"
						aria-controls="pills-forecast_days"
						onclick={() => ($params.time_mode = 'forecast_days')}
						><Clock class="mb-1 me-1" /> Forecast Length</button
					>
				</li>
				<li>
					<button
						class="nav-link"
						class:active={$params.time_mode == 'time_interval'}
						id="pills-time_interval-tab"
						type="button"
						aria-controls="pills-time_interval"
						onclick={() => ($params.time_mode = 'time_interval')}
						><Calendar class="mb-1 me-1" /> Time Interval</button
					>
				</li>
			</ul>
		</div>
		<div class="  py-3">
			{#if $params.time_mode == 'forecast_days'}
				<div
					class="tab-pane active"
					in:fade
					id="pills-forecast_days"
					aria-labelledby="pills-forecast_days-tab"
				>
					<div>
						<div>
							<div class="  mb-3">
								<select
									name="forecast_days"
									id="forecast_days"
									aria-label="Forecast days"
									bind:value={$params.forecast_days}
								>
									<option value="45">45 days</option>
									<option value="92">3 months (default)</option>
									<option value="183">6 months</option>
									<option value="274">9 months</option>
								</select>
								<label for="forecast_days">Forecast days</label>
							</div>
						</div>
						<div>
							<div class="  mb-3">
								<select
									name="past_days"
									id="past_days"
									aria-label="Past days"
									bind:value={$params.past_days}
								>
									<option value="0">0 (default)</option>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="5">5</option>
									<option value="7">1 week</option>
									<option value="14">2 weeks</option>
									<option value="31">1 month</option>
									<option value="61">2 months</option>
									<option value="92">3 months</option>
								</select>
								<label for="past_days">Past days</label>
							</div>
						</div>
					</div>
				</div>
			{/if}
			{#if $params.time_mode == 'time_interval'}
				<div
					class="tab-pane active"
					in:fade
					id="pills-time_interval"
					aria-labelledby="pills-time_interval-tab"
				>
					<div>
						<div class="  mb-3">
							<DatePicker bind:start_date={$params.start_date} bind:end_date={$params.end_date} />
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div>
		<h2>6-Hourly Weather Variables</h2>
		{#each six_hourly as group}
			<div>
				{#each group as e}
					<div class="">
						<input
							class=""
							type="checkbox"
							value={e.name}
							id="{e.name}_six_hourly"
							name="six_hourly"
							bind:group={$params.six_hourly}
						/>
						<label for="{e.name}_six_hourly">{e.label}</label>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div>
		<h2>Daily Weather Variables</h2>
		{#each daily as group}
			<div>
				{#each group as e}
					<div class="">
						<input
							class=""
							type="checkbox"
							value={e.name}
							id="{e.name}_daily"
							name="daily"
							bind:group={$params.daily}
						/>
						<label for="{e.name}_daily">{e.label}</label>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div>
		<h2 class="mb-2 mt-6 text-2xl">Settings</h2>
		<div>
			<div class="  mb-3">
				<select
					name="temperature_unit"
					id="temperature_unit"
					aria-label="Temperature Unit"
					bind:value={$params.temperature_unit}
				>
					<option value="celsius">Celsius °C</option>
					<option value="fahrenheit">Fahrenheit °F</option>
				</select>
				<label for="temperature_unit">Temperature Unit</label>
			</div>
		</div>
		<div>
			<div class="  mb-3">
				<select
					name="wind_speed_unit"
					id="wind_speed_unit"
					aria-label="Windspeed Unit"
					bind:value={$params.wind_speed_unit}
				>
					<option value="kmh">Km/h</option>
					<option value="ms">m/s</option>
					<option value="mph">Mph</option>
					<option value="kn">Knots</option>
				</select>
				<label for="wind_speed_unit">Wind Speed Unit</label>
			</div>
		</div>
		<div>
			<div class="  mb-3">
				<select
					name="precipitation_unit"
					id="precipitation_unit"
					aria-label="Precipitation Unit"
					bind:value={$params.precipitation_unit}
				>
					<option value="mm">Millimeter</option>
					<option value="inch">Inch</option>
				</select>
				<label for="precipitation_unit">Precipitation Unit</label>
			</div>
		</div>
		<div>
			<div class="  mb-3">
				<select
					name="timeformat"
					id="timeformat"
					aria-label="Timeformat"
					bind:value={$params.timeformat}
				>
					<option value="iso8601">ISO 8601 (e.g. 2022-12-31)</option>
					<option value="unixtime">Unix timestamp</option>
				</select>
				<label for="timeformat">Timeformat</label>
			</div>
		</div>
	</div>

	<LicenseSelector />
</form>

<ResultPreview
	{params}
	{defaultParameters}
	type="seasonal"
	action="seasonal"
	sdk_type="ensemble_api"
/>

<div>
	<h2 id="api-documentation">API Documentation</h2>
	<p>
		The API endpoint <mark>/v1/ecmwf</mark> accepts a geographical coordinate, a list of weather variables
		and responds with a JSON hourly weather forecast for 7 days. Time always starts at 0:00 today and
		contains 168 hours. All URL parameters are listed below:
	</p>
	<div class="table-responsive">
		<table
			class="mt-6 w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_tr]:border-b"
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
						separated. E.g. <mark>&latitude=52.52,48.85&longitude=13.41,2.35</mark>. To return data
						for multiple locations the JSON output changes to a list of structures. CSV and XLSX
						formats add a column <mark>location_id</mark>.</td
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
						<mark>&elevation=nan</mark> is specified, downscaling will be disabled and the API uses the
						average grid-cell height. For multiple locations, elevation can also be comma separated.</td
					>
				</tr>
				<tr>
					<th scope="row">hourly</th>
					<td>String array</td>
					<td>No</td>
					<td></td>
					<td
						>A list of weather variables which should be returned. Values can be comma separated, or
						multiple
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
						>Other wind speed speed units: <mark>ms</mark>, <mark>mph</mark> and <mark>kn</mark></td
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
						>If format <mark>unixtime</mark> is selected, all time values are returned in UNIX epoch
						time in seconds. Please note that all time is then in GMT+0! For daily values with unix
						timestamp, please apply
						<mark>utc_offset_seconds</mark> again to get the correct date.
					</td>
				</tr>
				<tr>
					<th scope="row">past_days</th>
					<td>Integer (0-92)</td>
					<td>No</td>
					<td><mark>0</mark></td>
					<td
						>If <mark>past_days</mark> is set, yesterday or the day before yesterday data are also returned.</td
					>
				</tr>
				<tr>
					<th scope="row">start_date<br />end_date</th>
					<td>String (yyyy-mm-dd)</td>
					<td>No</td>
					<td></td>
					<td
						>The time interval to get weather data. A day must be specified as an ISO8601 date (e.g.
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
						<a href={'/en/pricing'} title="Pricing information to use the weather API commercially"
							>pricing</a
						> for more information.</td
					>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		Additional optional URL parameters will be added. For API stability, no required parameters will
		be added in the future!
	</p>

	<h3 class="mt-5">Hourly Parameter Definition</h3>
	<p>
		The parameter <mark>&hourly=</mark> accepts the following values. Most weather variables are given
		as an instantaneous value for the indicated hour. Some variables like precipitation are calculated
		from the preceding hour as and average or sum.
	</p>
	<div class="table-responsive">
		<table
			class="mt-6 w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_tr]:border-b"
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

	<h3 class="mt-5">JSON Return Object</h3>
	<p>On success a JSON object will be returned.</p>
	<pre>
      <code>
{`
  "latitude": 52.52,
  "longitude": 13.419,
  "generationtime_ms": 2.2119,
  "timezone": "Europe/Berlin",
  "timezone_abbreviation": "CEST",
  "hourly": {
    "time": ["2022-07-01T00:00", "2022-07-01T01:00", "2022-07-01T02:00", ...],
    "temperature_2m": [13, 12.7, 12.7, 12.5, 12.5, 12.8, 13, 12.9, 13.3, ...]
  },
  "hourly_units": {
    "temperature_2m": "°C"
  },
`}
      </code>
    </pre>
	<div class="table-responsive">
		<table
			class="mt-6 w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_tr]:border-b"
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
						>WGS84 of the center of the weather grid-cell which was used to generate this forecast.
						This coordinate might be a few kilometers away from the requested coordinate.</td
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
			</tbody>
		</table>
	</div>
	<h3 class="mb-3 mt-5 text-2xl">Errors</h3>
	<p>
		In case an error occurs, for example a URL parameter is not correctly specified, a JSON error
		object is returned with a HTTP 400 status code.
	</p>
	<pre>
      <code>
{`
  "error": true,
  "reason": "Cannot initialize WeatherVariable from invalid String value tempeture_2m for key hourly"
`}
      </code>
    </pre>
</div>

This service is based on data and products of the European Centre for Medium-Range Weather Forecasts
(ECMWF). Source www.ecmwf.int. ECMWF does not accept any liability whatsoever for any error or
omission in the data, their availability, or for any loss or damage arising from their use.

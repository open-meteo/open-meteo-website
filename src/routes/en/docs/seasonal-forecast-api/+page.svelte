<script lang="ts">
	import LicenseSelector from '../LicenseSelector.svelte';
	import LocationSearch from '../LocationSearch.svelte';
	import type { GeoLocation } from '$lib/stores';
	import ResultPreview from '../ResultPreview.svelte';
	import { urlHashStore } from '$lib/url-hash-store';
	import SveltyPicker from 'svelty-picker';
	import { slide } from 'svelte/transition';

	const defaultParameter = {
		six_hourly: [],
		daily: [],
		temperature_unit: 'celsius',
		windspeed_unit: 'kmh',
		precipitation_unit: 'mm',
		timeformat: 'iso8601',
		timezone: 'UTC',
		past_days: '0',
		forecast_days: '92',
		start_date: null,
		end_date: null
		//models: []
	};

	const params = urlHashStore({
		latitude: 52.52,
		longitude: 13.41,
		...defaultParameter,
    daily: ['temperature_2m_max']
	});

	$: endDateInvalid = $params.start_date != null && $params.end_date == null;
	$: startDateInvalid = $params.start_date == null && $params.end_date != null;
	$: pastDaysInvalid =
		$params.past_days != defaultParameter.past_days && $params.start_date != null;
	$: forecastDaysInvalid =
		$params.forecast_days != defaultParameter.forecast_days && $params.start_date != null;

	const six_hourly = [
		[
			{ name: 'pressure_msl', label: 'Sealevel Pressure' },
			{ name: 'temperature_2m', label: 'Temperature (2 m)' },
			{ name: 'temperature_2m_max', label: 'Temperature (2 m) 6h max' },
			{ name: 'temperature_2m_min', label: 'Temperature (2 m) 6h min' },
			{ name: 'shortwave_radiation', label: 'Shortwave Solar Radiation' },
			{ name: 'cloudcover', label: 'Total Cloud Cover' },
			{ name: 'precipitation', label: 'Total Precipitation' },
			{ name: 'showers', label: 'Showers' }
		],
		[
			{ name: 'windspeed_10m', label: 'Wind Speed (10 m)' },
			{ name: 'winddirection_10m', label: 'Wind Direction (10 m)' }
		],
		[{ name: 'relativehumidity_2m', label: 'Relative Humidity (2 m)' }],
		[
			{ name: 'soil_temperature_0_to_10cm', label: 'Soil Temperature (0-10 cm)' },
			{ name: 'soil_moisture_0_to_10cm', label: 'Soil Moisture (0-10 cm)' },
			{ name: 'soil_moisture_10_to_40cm', label: 'Soil Moisture (10-40 cm)' },
			{ name: 'soil_moisture_40_to_100cm', label: 'Soil Moisture (40-100 cm)' },
			{ name: 'soil_moisture_100_to_200cm', label: 'Soil Moisture (100-200 cm)' }
		]
	];

	const daily = [
		[
			{ name: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
			{ name: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
			{ name: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' }
		],
		[
			{ name: 'precipitation_sum', label: 'Precipitation Sum' },
			{ name: 'rain_sum', label: 'Rain Sum' },
			{ name: 'precipitation_hours', label: 'Precipitation Hours' },
			{ name: 'windspeed_10m_max', label: 'Maximum Wind Speed (10 m)' },
			{ name: 'winddirection_10m_dominant', label: 'Dominant Wind Direction (10 m)' }
		]
	];

	function locationCallback(event: CustomEvent<GeoLocation>) {
		$params.latitude = Number(event.detail.latitude.toFixed(4));
		$params.longitude = Number(event.detail.longitude.toFixed(4));
	}
</script>

<svelte:head>
	<title>Seasonal Weather Forecast API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/seasonal-forecast-api" />
</svelte:head>

<div class="alert alert-primary" role="alert">Work in progress!</div>

<form method="get" action="https://seasonal-api.open-meteo.com/v1/seasonal">
	<div class="row">
		<h2>Select Coordinates or City</h2>
		<div class="col-md-3">
			<div class="form-floating mb-3">
				<input
					type="number"
					class="form-control"
					name="latitude"
					id="latitude"
					step="0.000001"
					min="-90"
					max="90"
					bind:value={$params.latitude}
				/>
				<label for="latitude">Latitude</label>
			</div>
		</div>
		<div class="col-md-3">
			<div class="form-floating mb-3">
				<input
					type="number"
					class="form-control"
					name="longitude"
					id="longitude"
					step="0.000001"
					min="-180"
					max="180"
					bind:value={$params.longitude}
				/>
				<label for="longitude">Longitude</label>
			</div>
		</div>
		<div class="col-md-6">
			<LocationSearch on:location={locationCallback} />
		</div>
	</div>
	<div class="row py-3 px-0">
		<h2>6-Hourly Weather Variables</h2>
		{#each six_hourly as group}
			<div class="col-md-3">
				{#each group as e}
					<div class="form-check">
						<input
							class="form-check-input"
							type="checkbox"
							value={e.name}
							id="{e.name}_six_hourly"
							name="six_hourly"
							bind:group={$params.six_hourly}
						/>
						<label class="form-check-label" for="{e.name}_six_hourly">{e.label}</label>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="row py-3 px-0">
		<h2>Daily Weather Variables</h2>
		{#each daily as group}
			<div class="col-md-6">
				{#each group as e}
					<div class="form-check">
						<input
							class="form-check-input"
							type="checkbox"
							value={e.name}
							id="{e.name}_daily"
							name="daily"
							bind:group={$params.daily}
						/>
						<label class="form-check-label" for="{e.name}_daily">{e.label}</label>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="row py-3 px-0">
		<h2>Settings</h2>
		<div class="col-md-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
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
		<div class="col-md-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
					name="windspeed_unit"
					id="windspeed_unit"
					aria-label="Windspeed Unit"
					bind:value={$params.windspeed_unit}
				>
					<option value="kmh">Km/h</option>
					<option value="ms">m/s</option>
					<option value="mph">Mph</option>
					<option value="kn">Knots</option>
				</select>
				<label for="windspeed_unit">Wind Speed Unit</label>
			</div>
		</div>
		<div class="col-md-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
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
		<div class="col-md-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
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
		<div class="col-md-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
					class:is-invalid={pastDaysInvalid}
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
				{#if pastDaysInvalid}
					<div class="invalid-tooltip" transition:slide>
						Past days conflicts with start and end date
					</div>
				{/if}
			</div>
		</div>
		<div class="col-md-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
					class:is-invalid={forecastDaysInvalid}
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
				{#if forecastDaysInvalid}
					<div class="invalid-tooltip" transition:slide>
						Forecast days conflicts with start and end date
					</div>
				{/if}
			</div>
		</div>

		<div class="col-md-3">
			<div class="form-floating mb-3">
				<SveltyPicker
					inputClasses="form-control {startDateInvalid ? 'is-invalid' : ''}"
					format="yyyy-mm-dd"
					name="start_date"
					bind:value={$params.start_date}
				/>
				<label for="start_date">Start date</label>
				{#if startDateInvalid}
					<div class="invalid-tooltip" transition:slide>Start and end date must be set</div>
				{/if}
			</div>
		</div>
		<div class="col-md-3">
			<div class="form-floating mb-3">
				<SveltyPicker
					inputClasses="form-control {endDateInvalid ? 'is-invalid' : ''}"
					format="yyyy-mm-dd"
					name="end_date"
					bind:value={$params.end_date}
				/>
				<label for="end_date">End date</label>
				{#if endDateInvalid}
					<div class="invalid-tooltip" transition:slide>Start and end date must be set</div>
				{/if}
			</div>
		</div>
		<div class="col-12 pb-3 debug-hidden">
			<div class="form-check form-switch">
				<input
					class="form-check-input"
					type="checkbox"
					id="localhost"
					name="localhost"
					value="true"
				/>
				<label class="form-check-label" for="localhost">Use localhost server</label>
			</div>
		</div>
	</div>

	<LicenseSelector />
</form>

<ResultPreview {params} {defaultParameter} type="seasonal" action="seasonal" />

<div class="col-12 py-5">
	<h2 id="api-documentation">API Documentation</h2>
	<p>
		The API endpoint <mark>/v1/ecmwf</mark> accepts a geographical coordinate, a list of weather variables
		and responds with a JSON hourly weather forecast for 7 days. Time always starts at 0:00 today and
		contains 168 hours. All URL parameters are listed below:
	</p>
	<div class="table-responsive">
		<table class="table">
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
					<td />
					<td>Geographical WGS84 coordinate of the location</td>
				</tr>
				<tr>
					<th scope="row">elevation</th>
					<td>Floating point</td>
					<td>No</td>
					<td />
					<td
						>The elevation used for statistical downscaling. Per default, a <a
							href="https://openmeteo.substack.com/p/improving-weather-forecasts-with"
							title="Elevation based grid-cell selection explained"
							>90 meter digital elevation model is used</a
						>. You can manually set the elevation to correctly match mountain peaks. If
						<mark>&elevation=nan</mark> is specified, downscaling will be disabled and the API uses the
						average grid-cell height.</td
					>
				</tr>
				<tr>
					<th scope="row">hourly</th>
					<td>String array</td>
					<td>No</td>
					<td />
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
					<th scope="row">windspeed_unit</th>
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
					<td>Integer (0-2)</td>
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
					<td />
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
					<td />
					<td
						>Only required to commercial use to access reserved API resources for customers. The
						server URL requires the prefix <mark>customer-</mark>. See
						<a href="/en/pricing" title="Pricing information to use the weather API commercially"
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
		<table class="table">
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
					<th scope="row">pressure_msl<br />surface_air_pressure</th>
					<td>Instant</td>
					<td>hPa</td>
					<td
						>Atmospheric air pressure reduced to sea level (Mean sea level) and actual pressure at
						surface level</td
					>
				</tr>
				<tr>
					<th scope="row">skin_temperature</th>
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
					<th scope="row">windspeed_10m</th>
					<td>Instant</td>
					<td>gpm</td>
					<td>Geopotential height on different atmospheric pressure levels</td>
				</tr>
				<tr>
					<th scope="row">windspeed_10m<br />windspeed_1000hPa, ...</th>
					<td>Instant</td>
					<td>km/h (mph, m/s, knots)</td>
					<td
						>Wind speed at 10 meters above ground. Wind speed on 10 meters is the standard level.
						Additional wind speeds are given on atmospheric pressure levels.</td
					>
				</tr>
				<tr>
					<th scope="row">winddirection_10m<br />winddirection_1000hPa, ...</th>
					<td>Instant</td>
					<td>°</td>
					<td>Wind direction at 10 meters above ground and different pressure levels.</td>
				</tr>
				<tr>
					<th scope="row">relativehumidity_2m<br />relative_humidity_1000hPa, ...</th>
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
		<table class="table">
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
	<h3 class="mt-5">Errors</h3>
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

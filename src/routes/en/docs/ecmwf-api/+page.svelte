<script lang="ts">
	import LicenseSelector from '../LicenseSelector.svelte';
	import ResultPreview from '../ResultPreview.svelte';
	import { urlHashStore } from '$lib/url-hash-store';
	import {
		altitudeAboveSeaLevelMeters,
		countPressureVariables,
		countVariables,
		sliceIntoChunks
	} from '$lib/meteo';
	import AccordionItem from '$lib/Elements/AccordionItem.svelte';
	import { fade } from 'svelte/transition';
	import CalendarEvent from 'svelte-bootstrap-icons/lib/CalendarEvent.svelte';
	import Clock from 'svelte-bootstrap-icons/lib/Clock.svelte';
	import StartEndDate from '../StartEndDate.svelte';
	import LocationSelection from '../LocationSelection.svelte';

	const defaultParameter = {
		hourly: [],
		location_mode: 'location_search',
		csv_coordinates: '',
		temperature_unit: 'celsius',
		wind_speed_unit: 'kmh',
		precipitation_unit: 'mm',
		timeformat: 'iso8601',
		past_days: '0',
		forecast_days: '10',
		start_date: '',
		end_date: '',
		time_mode: 'forecast_days',
		models: []
	};

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameter,
		hourly: ['temperature_2m']
	});

	const pressureVariables = [
		{ name: 'temperature', label: 'Temperature' },
		{ name: 'relative_humidity', label: 'Relative Humidity' }, 
		//{ name: 'specific_humidity', label: 'Specific Humidity' },
		{ name: 'cloud_cover', label: 'Cloud cover' },
		{ name: 'windspeed', label: 'Wind Speed' },
		{ name: 'winddirection', label: 'Wind Direction' },
		{ name: 'geopotential_height', label: 'Geopotential Height' },
		//{ name: 'atmosphere_relative_vorticity', label: 'Relative Vorticity' },
		//{ name: 'divergence_of_wind', label: 'Divergence of Wind' }
	];
	const levels = [50, 200, 250, 300, 500, 700, 850, 925, 1000].reverse();

	let pressureVariablesTab = 'temperature';

	const hourly = [
		[
			{ name: 'temperature_2m', label: 'Temperature (2 m)' },
			{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
			{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
			{ name: 'apparent_temperature', label: 'Apparent Temperature' },
			{ name: 'precipitation', label: 'Precipitation (rain + snow)' },
			{ name: 'rain', label: 'Rain' },
			{ name: 'snowfall', label: 'Snowfall' }
		],
		[
			{ name: 'weather_code', label: 'Weather code' },
			{ name: 'pressure_msl', label: 'Sealevel Pressure' },
			{ name: 'surface_pressure', label: 'Surface Pressure' },
			{ name: 'cloud_cover', label: 'Cloud cover Total' },
			{ name: 'cloud_cover_low', label: 'Cloud cover Low' },
			{ name: 'cloud_cover_mid', label: 'Cloud cover Mid' },
			{ name: 'cloud_cover_high', label: 'Cloud cover High' },
			{ name: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
		],
		[
			{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
			{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
			{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
		],
		[
			{ name: 'surface_temperature', label: 'Surface temperature' },
			{ name: 'soil_temperature_0_to_7cm', label: 'Soil Temperature (0-7 cm)' },
			{ name: 'runoff', label: 'Surface Water Runoff' },
			{
				name: 'total_column_integrated_water_vapour',
				label: 'Total Column Integrated Water Vapour'
			}
		]
	];

	const models = [
		[
			{ name: 'ecmwf_ifs04', label: 'ECMWF IFS 0.4°' },
			{ name: 'ecmwf_ifs025', label: 'ECMWF IFS 0.25°' },
			{ name: 'ecmwf_aifs025', label: 'ECMWF AIFS 0.25°' },
		],
	];
</script>

<svelte:head>
	<title>ECMWF Forecast API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/ecmwf-api" />
</svelte:head>

<div class="alert alert-primary" role="alert">
	The API utilizes open-data ECMWF weather forecasts from the IFS weather model, which has a
	resolution of 9 km. However, the open-data access is restricted to a resolution of 25 km and
	3-hourly values, although the model still boasts excellent accuracy for large scale weather
	patterns. For more detailed local forecasts, we recommend utilizing the <a href="/en/docs"
		>generic weather forecast API</a
	>, which combines weather models up to 1 km resolution seamlessly.
</div>

<form method="get" action="https://api.open-meteo.com/v1/ecmwf">
	<LocationSelection
		bind:latitude={$params.latitude}
		bind:longitude={$params.longitude}
		bind:location_mode={$params.location_mode}
		bind:csv_coordinates={$params.csv_coordinates}
	/>

	<div class="row py-3 px-0">
		<div>
			<ul class="nav nav-underline" id="pills-tab" role="tablist">
				<li class="nav-item" role="presentation" style="width: 70px;">
					<span class="nav-link disabled" aria-disabled="true">Time:</span>
				</li>
				<li class="nav-item" role="presentation">
					<button
						class="nav-link"
						class:active={$params.time_mode == 'forecast_days'}
						id="pills-forecast_days-tab"
						type="button"
						role="tab"
						aria-controls="pills-forecast_days"
						aria-selected="true"
						on:click={() => ($params.time_mode = 'forecast_days')}><Clock/> Forecast Length</button
					>
				</li>
				<li class="nav-item" role="presentation">
					<button
						class="nav-link"
						class:active={$params.time_mode == 'time_interval'}
						id="pills-time_interval-tab"
						type="button"
						role="tab"
						aria-controls="pills-time_interval"
						on:click={() => ($params.time_mode = 'time_interval')}
						aria-selected="true"><CalendarEvent/> Time Interval</button
					>
				</li>
			</ul>
		</div>
		<div class="tab-content py-3" id="pills-tabContent">
			{#if $params.time_mode == 'forecast_days'}
				<div
					class="tab-pane active"
					in:fade
					id="pills-forecast_days"
					role="tabpanel"
					aria-labelledby="pills-forecast_days-tab"
					tabindex="0"
				>
					<div class="row">
						<div class="col-md-3">
							<div class="form-floating mb-3">
								<select
									class="form-select"
									name="forecast_days"
									id="forecast_days"
									aria-label="Forecast days"
									bind:value={$params.forecast_days}
								>
									<option value="1">1 day</option>
									<option value="3">3 days</option>
									<option value="5">5 days</option>
									<option value="7">7 days</option>
									<option value="10">10 days (default)</option>
									<option value="15">15 days</option>
								</select>
								<label for="forecast_days">Forecast days</label>
							</div>
						</div>
						<div class="col-md-3">
							<div class="form-floating mb-3">
								<select
									class="form-select"
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
					role="tabpanel"
					aria-labelledby="pills-time_interval-tab"
					tabindex="0"
				>
					<div class="row">
						<div class="col-md-6 mb-3">
							<StartEndDate bind:start_date={$params.start_date} bind:end_date={$params.end_date}/>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="row py-3 px-0">
		<h2>3-Hourly Weather Variables</h2>
		{#each hourly as group}
			<div class="col-md-3">
				{#each group as e}
					<div class="form-check">
						<input
							class="form-check-input"
							type="checkbox"
							value={e.name}
							id="{e.name}_hourly"
							name="hourly"
							bind:group={$params.hourly}
						/>
						<label class="form-check-label" for="{e.name}_hourly">{e.label}</label>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="row py-3 px-0">
		<div class="accordion" id="accordionVariables">
			<AccordionItem
				id="pressure-levels"
				title="Pressure Level Variables"
				count={countPressureVariables(pressureVariables, levels, $params.hourly)}
			>
				<div class="d-flex align-items-start">
					<div
						class="nav flex-column nav-pills me-3"
						id="v-pills-tab"
						role="tablist"
						aria-orientation="vertical"
					>
						{#each pressureVariables as variable, i}
							<button
								class="nav-link text-start text-nowrap"
								class:active={pressureVariablesTab == variable.name}
								id="v-pills-{variable.name}-tab"
								type="button"
								role="tab"
								aria-controls="v-pills-{variable.name}"
								aria-selected={pressureVariablesTab == variable.name}
								on:click={() => (pressureVariablesTab = variable.name)}>{variable.label}</button
							>
						{/each}
					</div>
					<div class="tab-content" id="v-pills-tabContent">
						{#each pressureVariables as variable}
							<div
								class="tab-pane fade"
								class:active={pressureVariablesTab == variable.name}
								class:show={pressureVariablesTab == variable.name}
								id="v-pills-{variable.name}"
								role="tabpanel"
								aria-labelledby="v-pills-{variable.name}-tab"
							>
								<div class="row">
									{#each sliceIntoChunks(levels, levels.length / 3 + 1) as chunk}
										<div class="col-lg-4">
											{#each chunk as level}
												<div class="form-check">
													<input
														class="form-check-input"
														type="checkbox"
														value="{variable.name}_{level}hPa"
														id="{variable.name}_{level}hPa"
														name="hourly"
														bind:group={$params.hourly}
													/>
													<label class="form-check-label" for="{variable.name}_{level}hPa">
														{level} hPa
														<small class="text-muted">({altitudeAboveSeaLevelMeters(level)})</small>
													</label>
												</div>
											{/each}
										</div>
									{/each}
								</div>
							</div>
						{/each}
						<div class="mt-3">
							<small class="text-muted"
								>Note: Altitudes are approximate and in meters <strong> above sea level</strong>
								(not above ground). Use <mark>geopotential_height</mark> to get precise altitudes above
								sea level.</small
							>
						</div>
					</div>
				</div>
			</AccordionItem>
			<AccordionItem
				id="models"
				title="Weather models"
				count={countVariables(models, $params.models)}
			>
				{#each models as group}
					<div class="col-md-4 mb-3">
						{#each group as e}
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value={e.name}
									id="{e.name}_model"
									name="models"
									bind:group={$params.models}
								/>
								<label class="form-check-label" for="{e.name}_model">{e.label}</label>
							</div>
						{/each}
					</div>
				{/each}
				<div class="col-md-12">
					<small class="text-muted"
						>Note: The default <mark>Best Match</mark> provides the best forecast for any given
						location worldwide. <mark>Seamless</mark> combines all models from a given provider into
						a seamless prediction.</small
					>
				</div>
			</AccordionItem>
		</div>
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
	</div>

	<LicenseSelector />
</form>

<ResultPreview {params} {defaultParameter} action="ecmwf" />

<div class="col-12 py-5">
	<h2 id="data-sources">Data Source</h2>
	<p>
		This API uses <a href="https://www.ecmwf.int/en/forecasts/datasets/open-data"
			>open-data ECMWF Integrated Forecast System IFS</a
		>. ECMWF IFS models run every 6 hours at 9 km resolution, but only 0.25° grid spacing (~25 km) is
		available as open data with a limited number of weather variables at 3-hourly intervals. As soon
		as ECWMF includes additional data, they will be made available in this API.
	</p>
	<p>
		For hourly and high-resolution data (up to 1 km) try our <a href="/en/docs">forecast API</a> which
		combines multiple models.
	</p>
	<div class="table-responsive">
		<table class="table">
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
						><a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" target="_blank">IFS</a
						></th
					>
					<td>Global</td>
					<td>0.4° (~44 km)</td>
					<td>3-Hourly</td>
					<td>10 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row"
						><a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" target="_blank">IFS</a
						></th
					>
					<td>Global</td>
					<td>0.25° (~25 km)</td>
					<td>3-Hourly</td>
					<td>10 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row"
						><a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" target="_blank">AIFS</a
						></th
					>
					<td>Global</td>
					<td>0.25° (~25 km)</td>
					<td>6-Hourly</td>
					<td>15 days</td>
					<td>Every 6 hours</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2 id="api-documentation" class="mt-5">API Documentation</h2>
	<p>
		The API endpoint <mark>/v1/ecmwf</mark> accepts a geographical coordinate, a list of weather variables
		and responds with a JSON 3-hourly weather forecast for 10 days. Time always starts at 0:00 today.
		All URL parameters are listed below:
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
					<td />
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
					<td><mark>land</mark></td>
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
					<th scope="row">precipitation</th>
					<td>Preceding hour sum</td>
					<td>mm (inch)</td>
					<td>Total precipitation (rain, showers, snow) sum of the preceding hour</td>
				</tr>
				<tr>
					<th scope="row">snowfall</th>
					<td>Preceding hour sum</td>
					<td>cm (inch)</td>
					<td
						>Snowfall amount of the preceding hour in centimeters. For the water equivalent in
						millimeter, divide by 7. E.g. 7 cm snow = 10 mm precipitation water equivalent. Snowfall
						amount is not provided by ECMWF directly, instead it is approximated based on total
						precipitation and temperature</td
					>
				</tr>
				<tr>
					<th scope="row">runoff</th>
					<td>Preceding hour sum</td>
					<td>mm (inch)</td>
					<td>Execess rain that is not absorbed by the soil</td>
				</tr>
				<tr>
					<th scope="row">weather_code</th>
					<td>Instant</td>
					<td>WMO code</td>
					<td
						>Weather condition as a numeric code. Follow WMO weather interpretation codes. See table
						below for details. Weather code is calculated from cloud cover analysis, precipitation
						and snowfall. As ECMWF IFS has barely no information about atmospheric stability,
						estimation about thunderstorms is not possible.</td
					>
				</tr>
				<tr>
					<th scope="row">cloud_cover</th>
					<td>Instant</td>
					<td>%</td>
					<td
						>Total cloud cover as an area fraction. Calculated as a weighted function from low, mid
						and high level clouds.</td
					>
				</tr>
				<tr>
					<th scope="row">cloud_cover_low</th>
					<td>Instant</td>
					<td>%</td>
					<td
						>Low level clouds and fog up to 3 km altitude. In case of ECMWF IFS it is based on
						relative humidity on pressure levels 1000, 925 and 850 hPa.</td
					>
				</tr>
				<tr>
					<th scope="row">cloud_cover_mid</th>
					<td>Instant</td>
					<td>%</td>
					<td
						>Mid level clouds from 3 to 8 km altitude. In case of ECMWF IFS it is based on relative
						humidity on pressure levels 700 and 500 hPa.</td
					>
				</tr>
				<tr>
					<th scope="row">cloud_cover_high</th>
					<td>Instant</td>
					<td>%</td>
					<td
						>High level clouds from 8 km altitude. In case of ECMWF IFS it is based on relative
						humidity on pressure levels 300, 250 and 200 hPa.</td
					>
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
					<td>meter</td>
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
					<th scope="row">relative_humidity_1000hPa, ...</th>
					<td>Instant</td>
					<td>%</td>
					<td
						>Relative humidity at atmospheric pressure levels. Unfortunately, 2 meter relative
						humidity is unavailable.</td
					>
				</tr>
				<tr>
					<th scope="row">cloud_cover_1000hPa, ...</th>
					<td>Instant</td>
					<td>%</td>
					<td
						>Cloud cover at the specified pressure level. Cloud cover is approximated based on
						relative humidity using <a
							href="https://www.ecmwf.int/sites/default/files/elibrary/2005/16958-parametrization-cloud-cover.pdf"
							target="_blank">Sundqvist et al. (1989)</a
						></td
					>
				</tr>
				<!--<tr>
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
				</tr>-->
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

<div class="col-12 py-5">
	<h2 id="weathervariables">Weather variable documentation</h2>
</div>

<div class="col-6">
	<h3>WMO Weather interpretation codes (WW)</h3>
	<div class="table-responsive">
		<table class="table">
			<thead>
				<tr>
					<th scope="col">Code</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">0</th>
					<td>Clear sky</td>
				</tr>
				<tr>
					<th scope="row">1, 2, 3</th>
					<td>Mainly clear, partly cloudy, and overcast</td>
				</tr>
				<tr>
					<th scope="row">45, 48</th>
					<td>Fog and depositing rime fog</td>
				</tr>
				<tr>
					<th scope="row">51, 53, 55</th>
					<td>Drizzle: Light, moderate, and dense intensity</td>
				</tr>
				<tr>
					<th scope="row">56, 57</th>
					<td>Freezing Drizzle: Light and dense intensity</td>
				</tr>
				<tr>
					<th scope="row">61, 63, 65</th>
					<td>Rain: Slight, moderate and heavy intensity</td>
				</tr>
				<tr>
					<th scope="row">66, 67</th>
					<td>Freezing Rain: Light and heavy intensity</td>
				</tr>
				<tr>
					<th scope="row">71, 73, 75</th>
					<td>Snow fall: Slight, moderate, and heavy intensity</td>
				</tr>
				<tr>
					<th scope="row">77 *</th>
					<td>Snow grains</td>
				</tr>
				<tr>
					<th scope="row">80, 81, 82 *</th>
					<td>Rain showers: Slight, moderate, and violent</td>
				</tr>
				<tr>
					<th scope="row">85, 86 *</th>
					<td>Snow showers slight and heavy</td>
				</tr>
				<tr>
					<th scope="row">95 *</th>
					<td>Thunderstorm: Slight or moderate</td>
				</tr>
				<tr>
					<th scope="row">96, 99 *</th>
					<td>Thunderstorm with slight and heavy hail</td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>(*) Showers and thunderstorm forecast not available with ECMWF IFS</p>

	<p>
		This service is based on data and products of the European Centre for Medium-Range Weather
		Forecasts (ECMWF). Source www.ecmwf.int. ECMWF does not accept any liability whatsoever for any
		error or omission in the data, their availability, or for any loss or damage arising from their
		use.
	</p>
</div>

<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/utils/url-hash-store';
	import { countVariables } from '$lib/utils/meteo';

	import StartEndDate from '$lib/components/date-selector/StartEndDate.svelte';
	import AccordionItem from '$lib/components/accordion/AccordionItem.svelte';
	import ResultPreview from '$lib/components/highcharts/ResultPreview.svelte';
	import LicenseSelector from '$lib/components/license/LicenseSelector.svelte';
	import LocationSelection from '$lib/components/location/LocationSelection.svelte';

	import CalendarEvent from 'svelte-bootstrap-icons/lib/CalendarEvent.svelte';
	import Clock from 'svelte-bootstrap-icons/lib/Clock.svelte';

	import {
		hourly,
		models,
		current,
		solarVariables,
		defaultParameters,
		additionalVariables
	} from './options';

	const params = urlHashStore({
		latitude: [59.91],
		longitude: [10.75],
		...defaultParameters,
		hourly: ['temperature_2m']
	});
</script>

<svelte:head>
	<title>MET Norway API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/metno-api" />
</svelte:head>

<div class="alert alert-primary" role="alert">
	The API makes use of MET Nordic weather models exclusively for North Europe, offering exceptional
	short-term weather forecasts with hourly updates and 1 km resolution. However, for longer
	forecasts of up to 16 days, the <a href="/en/docs">generic Weather Forecast API</a> transparently combines
	MET Nordic with other weather models to take advantage of hourly updates.
</div>

<form method="get" action="https://api.open-meteo.com/v1/metno">
	<LocationSelection bind:params={$params} />

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
						onclick={() => ($params.time_mode = 'forecast_days')}
						><Clock class="mb-1 me-1" /> Forecast Length</button
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
						onclick={() => ($params.time_mode = 'time_interval')}
						aria-selected="true"><CalendarEvent class="mb-1 me-1" /> Time Interval</button
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
									<option value="2">2 days</option>
									<option value="3">3 days (default)</option>
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
							<StartEndDate bind:start_date={$params.start_date} bind:end_date={$params.end_date} />
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="row py-3 px-0">
		<h2>Hourly Weather Variables</h2>
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
				id="additional-variables"
				title="Additional Variables And Options"
				count={countVariables(additionalVariables, $params.hourly)}
			>
				{#each additionalVariables as group}
					<div class="col-md-6">
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
				<div class="col-md-12 mb-3">
					<small class="text-muted"
						>Note: You can further adjust the forecast time range for hourly weather variables using <mark
							>&forecast_hours=</mark
						>
						and <mark>&past_hours=</mark> as shown below.
					</small>
				</div>
				<div class="col-md-3">
					<div class="form-floating mb-3">
						<select
							class="form-select"
							name="forecast_hours"
							id="forecast_hours"
							aria-label="Forecast Hours"
							bind:value={$params.forecast_hours}
						>
							<option value="">- (default)</option>
							<option value="1">1 hour</option>
							<option value="6">6 hours</option>
							<option value="12">12 hours</option>
							<option value="24">24 hours</option>
						</select>
						<label for="forecast_hours">Forecast Hours</label>
					</div>
				</div>
				<div class="col-md-3">
					<div class="form-floating mb-3">
						<select
							class="form-select"
							name="past_hours"
							id="past_hours"
							aria-label="Past Hours"
							bind:value={$params.past_hours}
						>
							<option value="">- (default)</option>
							<option value="1">1 hour</option>
							<option value="6">6 hours</option>
							<option value="12">12 hours</option>
							<option value="24">24 hours</option>
						</select>
						<label for="past_hours">Past Hours</label>
					</div>
				</div>
				<div class="col-md-6">
					<div class="form-floating mb-6">
						<select
							class="form-select"
							name="temporal_resolution"
							id="temporal_resolution"
							aria-label="Temporal Resolution For Hourly Data"
							bind:value={$params.temporal_resolution}
						>
							<option value="">1 Hourly</option>
							<option value="hourly_3">3 Hourly</option>
							<option value="hourly_6">6 Hourly</option>
							<option value="native">Native Model Resolution</option>
						</select>
						<label for="temporal_resolution">Temporal Resolution For Hourly Data</label>
					</div>
				</div>
				<div class="col-md-6">
					<div class="form-floating mb-6">
						<select
							class="form-select"
							name="cell_selection"
							id="cell_selection"
							aria-label="Grid Cell Selection"
							bind:value={$params.cell_selection}
						>
							<option value="">Terrain Optimized, Prefers Land</option>
							<option value="sea">Prefer Sea</option>
							<option value="nearest">Nearest</option>
						</select>
						<label for="cell_selection">Grid Cell Selection</label>
					</div>
				</div>
			</AccordionItem>
			<AccordionItem
				id="solar-variables"
				title="Solar Radiation Variables"
				count={countVariables(solarVariables, $params.hourly)}
			>
				{#each solarVariables as group}
					<div class="col-md-6">
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
				<div class="col-md-12 mb-3">
					<small class="text-muted"
						>Note: Solar radiation is averaged over the past hour. Use
						<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI
						please specify Tilt and Azimuth below.</small
					>
				</div>
				<div class="col-md-3">
					<div class="form-floating">
						<input
							type="number"
							class="form-control"
							class:is-invalid={$params.tilt < 0 || $params.tilt > 90}
							name="tilt"
							id="tilt"
							step="1"
							min="0"
							max="90"
							bind:value={$params.tilt}
						/>
						<label for="tilt">Panel Tilt (0° horizontal)</label>
						{#if $params.tilt < 0 || $params.tilt > 90}
							<div class="invalid-tooltip" transition:slide>Tilt must be between 0° and 90°</div>
						{/if}
					</div>
				</div>
				<div class="col-md-3">
					<div class="form-floating">
						<input
							type="number"
							class="form-control"
							class:is-invalid={$params.azimuth < -180 || $params.azimuth > 180}
							name="azimuth"
							id="azimuth"
							step="1"
							min="-90"
							max="90"
							bind:value={$params.azimuth}
						/>
						<label for="azimuth">Panel Azimuth (0° S, -90° E, 90° W)</label>
						{#if Number($params.azimuth) < -180 || Number($params.azimuth) > 180}
							<div class="invalid-tooltip" transition:slide>
								Azimuth must be between -90° (east) and 90° (west)
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
			</AccordionItem>
		</div>
	</div>

	<div class="row py-3 px-0">
		<h2>Current Weather</h2>
		{#each current as group}
			<div class="col-md-3 mb-2">
				{#each group as e}
					<div class="form-check">
						<input
							class="form-check-input"
							type="checkbox"
							value={e.name}
							id="{e.name}_current"
							name="current"
							bind:group={$params.current}
						/>
						<label class="form-check-label" for="{e.name}_current">{e.label}</label>
					</div>
				{/each}
			</div>
		{/each}
		<div class="col-md-12">
			<small class="text-muted"
				>Note: Current conditions are based on 15-minutely weather model data. Every weather
				variable available in hourly data, is available as current condition as well.</small
			>
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

<ResultPreview {params} {defaultParameters} model_default="metno_seamless" />

<div class="col-12 py-5">
	<h2 id="data-sources">Data Source</h2>
	<p>
		This API uses local weather models from the Norwegian Meteorological Institute. The <a
			href="https://github.com/metno/NWPdocs/wiki/MET-Nordic-dataset"
			target="_blank">MET Nordic</a
		> dataset is derived from the 2.5 km MetCoOp ensemble model with ECMWF initialization. With post-processing
		based on measurement & radar and with updates every hour, the short-term forecast performance skill
		should be high.
	</p>
	<p>
		Unfortunately, only 2.5 days of forecast are available. The Open-Meteo <a href="/en/docs"
			>weather forecast API</a
		> automatically uses MET Nordic in combination with larger scale models to offer a 7 days forecast.
	</p>
	<div class="table-responsive">
		<table class="table">
			<caption
				>You can find the update timings in the <a href="/en/docs/model-updates"
					>model updates documentation</a
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
					<td>Norway, Denmark, Sweden, Finland</td>
					<td>1 km</td>
					<td>Hourly</td>
					<td>2.5 days</td>
					<td>Every hour</td>
				</tr>
			</tbody>
		</table>
	</div>

	<figure class="figure">
		<img src="/images/models/metno_nordic.webp" class="figure-img img-fluid rounded" alt="..." />
		<figcaption class="figure-caption">
			MET Nordic model area (black). Source: <a
				href="https://github.com/metno/NWPdocs/wiki/MEPS-dataset">Met Norway GitHub</a
			>.
		</figcaption>
	</figure>

	<h2 id="api-documentation" class="mt-5">API Documentation</h2>
	<p>
		The API endpoint <mark>/v1/metno</mark> accepts a geographical coordinate, a list of weather variables
		and responds with a JSON hourly weather forecast for 2.5 days. Time always starts at 0:00 today.
		Data is only available in the Scandinavian region. All URL parameters are listed below:
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
					<th scope="row">current</th>
					<td>String array</td>
					<td>No</td>
					<td></td>
					<td>A list of weather variables to get current conditions.</td>
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
					<th scope="row">timezone</th>
					<td>String</td>
					<td>No</td>
					<td><mark>GMT</mark></td>
					<td
						>If <mark>timezone</mark> is set, all timestamps are returned as local-time and data is
						returned starting at 00:00 local-time. Any time zone name from the
						<a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" target="_blank"
							>time zone database</a
						>
						is supported. If <mark>auto</mark> is set as a time zone, the coordinates will be automatically
						resolved to the local time zone. For multiple coordinates, a comma separated list of timezones
						can be specified.</td
					>
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
					<th scope="row">forecast_days</th>
					<td>Integer (0-3)</td>
					<td>No</td>
					<td><mark>3</mark></td>
					<td>Per default, 3 days are returned. Up to 3 days of forecast are possible.</td>
				</tr>
				<tr>
					<th scope="row">forecast_hours<br />past_hours</th>
					<td>Integer (&gt;0)</td>
					<td>No</td>
					<td></td>
					<td
						>Similar to forecast_days, the number of timesteps of hourly data can controlled.
						Instead of using the current day as a reference, the current hour is used.
					</td>
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
					<th scope="row">start_hour<br />end_hour</th>
					<td>String (yyyy-mm-ddThh:mm)</td>
					<td>No</td>
					<td></td>
					<td
						>The time interval to get weather data for hourly data. Time must be specified as an
						ISO8601 date (e.g.
						<mark>2022-06-30T12:00</mark>).
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
					<td></td>
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
						>Shortwave solar radiation as average of the preceding hour. This is equal to the total
						global horizontal irradiation
					</td>
				</tr>
				<tr>
					<th scope="row">direct_radiation<br />direct_normal_irradiance</th>
					<td>Preceding hour mean</td>
					<td>W/m²</td>
					<td
						>Direct solar radiation as average of the preceding hour on the horizontal plane and the
						normal plane (perpendicular to the sun)</td
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
						calculation is assuming a fixed albedo of 20% and in isotropic sky. Please specify tilt
						and azimuth parameter. Tilt ranges from 0° to 90° and is typically around 45°. Azimuth
						should be close to 0° (0° south, -90° east, 90° west). If azimuth is set to "nan", the
						calculation assumes a horizontal tracker. If tilt is set to "nan", it is assumed that
						the panel has a vertical tracker. If both are set to "nan", a bi-axial tracker is
						assumed.</td
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
						>Vapor Pressure Deificit (VPD) in kilopascal (kPa). For high VPD (&gt;1.6), water
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
						>Weather condition as a numeric code. Follow WMO weather interpretation codes. See table
						below for details. Weather code is calculated from cloud cover analysis, precipitation,
						snowfall and gusts. As MET Nordic has barely no information about atmospheric stability,
						estimation about thunderstorms is not possible.</td
					>
				</tr>
				<tr>
					<th scope="row">snowfall</th>
					<td>Preceding hour sum</td>
					<td>cm (inch)</td>
					<td
						>Snowfall amount of the preceding hour in centimeters. For the water equivalent in
						millimeter, divide by 7. E.g. 7 cm snow = 10 mm precipitation water equivalent. Snowfall
						amount is not provided by MET Nordic directly, instead it is approximated based on total
						precipitation and temperature</td
					>
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

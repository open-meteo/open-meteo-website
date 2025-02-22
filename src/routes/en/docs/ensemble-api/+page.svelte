<script lang="ts">
	import LicenseSelector from '$lib/components/license/LicenseSelector.svelte';
	import ResultPreview from '$lib/components/highcharts/ResultPreview.svelte';
	import { urlHashStore } from '$lib/utils/url-hash-store';
	import { countVariables } from '$lib/utils/meteo';
	import AccordionItem from '$lib/components/accordion/AccordionItem.svelte';
	import { fade, slide } from 'svelte/transition';
	import CalendarEvent from 'svelte-bootstrap-icons/lib/CalendarEvent.svelte';
	import Clock from 'svelte-bootstrap-icons/lib/Clock.svelte';
	import StartEndDate from '$lib/components/date-selector/StartEndDate.svelte';
	import LocationSelection from '$lib/components/location/LocationSelection.svelte';

	import {
		hourly,
		models,
		solarVariables,
		defaultParameters,
		available_variables,
		additionalVariables
	} from './options';

	function isAvailable(variable: String, models: String[]): Boolean {
		if (models.length == 0) {
			return true;
		}
		for (const model of models) {
			if (!Object.hasOwn(available_variables, model)) {
				continue;
			}
			if (available_variables[model].includes(variable)) {
				return true;
			}
		}
		return false;
	}

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['temperature_2m'],
		models: ['icon_seamless']
	});
</script>

<svelte:head>
	<title>Ensemble API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/ensemble-api" />
</svelte:head>

<div class="alert alert-primary" role="alert">
	The initial version of ensemble weather models has been integrated. You can learn more about these
	models in the <a
		href="https://openmeteo.substack.com/p/ensemble-weather-forecast-api"
		target="_blank">blog article</a
	>.
</div>

<form method="get" action="https://ensemble-api.open-meteo.com/v1/ensemble">
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
						on:click={() => ($params.time_mode = 'forecast_days')}
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
						on:click={() => ($params.time_mode = 'time_interval')}
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
									<option value="3">3 days</option>
									<option value="7">7 days (default)</option>
									<option value="14">14 days</option>
									<option value="16">16 days</option>
									<option value="30">30 days</option>
									<option value="36">35 days</option>
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
		<h2>Ensemble Models</h2>
		{#each models as group}
			<div class="col-md-3 mb-3">
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
							disabled={!isAvailable(e.name, $params.models)}
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
									disabled={!isAvailable(e.name, $params.models)}
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
									disabled={!isAvailable('shortwave_radiation', $params.models)}
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

	<LicenseSelector requires_professional_plan={true} />
</form>

<ResultPreview
	{params}
	{defaultParameters}
	type="ensemble"
	action="ensemble"
	sdk_type="ensemble_api"
/>

<div class="col-12 py-5">
	<h2 id="data-sources">Data Source</h2>
	<p>
		Ensemble models are a type of weather forecasting technique that use multiple members or
		versions of a model to produce a range of possible outcomes for a given forecast. Each member is
		initialized with slightly different initial conditions and/or model parameters to account for
		uncertainties and variations in the atmosphere, resulting in a set of perturbed forecasts.
	</p>
	<p>
		By combining the perturbed forecasts, the ensemble model generates a probability distribution of
		possible outcomes, indicating not only the most likely forecast but also the range of possible
		outcomes and their likelihoods. This probabilistic approach provides more comprehensive and
		accurate forecast guidance, especially for high-impact weather events where uncertainties are
		high.
	</p>
	<p>
		Different national weather services calculate ensemble models, each with varying resolutions of
		weather variables and forecast time-range. For instance, the German weather service DWD's ICON
		model provides exceptionally high resolution for Europe but only forecasts up to 7 days.
		Meanwhile, the GFS model can forecast up to 35 days, albeit at a lower resolution of 50 km. The
		appropriate ensemble model to use would depend on the forecast horizon and region of interest.
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
					<th scope="col">National Weather Service</th>
					<th scope="col">Weather Model</th>
					<th scope="col">Region</th>
					<th scope="col">Resolution</th>
					<th scope="col">Members</th>
					<th scope="col">Forecast Length</th>
					<th scope="col">Update frequency</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row" rowspan="3">Deutscher Wetterdienst (DWD)</th>
					<td>ICON-D2-EPS</td>
					<td>Central Europe</td>
					<td>2 km, hourly</td>
					<td>20</td>
					<td>2 days</td>
					<td>Every 3 hours</td>
				</tr>
				<tr>
					<td>ICON-EU-EPS</td>
					<td>Europe</td>
					<td>13 km, hourly</td>
					<td>40</td>
					<td>5 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<td>ICON-EPS</td>
					<td>Global</td>
					<td>26 km, hourly</td>
					<td>40</td>
					<td>7.5 days</td>
					<td>Every 12 hours</td>
				</tr>
				<tr>
					<th scope="row" rowspan="2">NOAA</th>
					<td>GFS Ensemble 0.25°</td>
					<td>Global</td>
					<td>25 km, 3-hourly</td>
					<td>31</td>
					<td>10 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<td>GFS Ensemble 0.5°</td>
					<td>Global</td>
					<td>50 km, 3-hourly</td>
					<td>31</td>
					<td>35 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row" rowspan="2">ECMWF</th>
					<td>IFS 0.4°</td>
					<td>Global</td>
					<td>44 km, 3-hourly</td>
					<td>51</td>
					<td>15 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<td>IFS 0.25°</td>
					<td>Global</td>
					<td>25 km, 3-hourly</td>
					<td>51</td>
					<td>15 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row">Canadian Weather Service</th>
					<td>GEM</td>
					<td>Global</td>
					<td>25 km, 3-hourly</td>
					<td>21</td>
					<td>16 days (32 days every thursday)</td>
					<td>Every 12 hours</td>
				</tr>
				<tr>
					<th scope="row">Australian Bureau of Meteorology (BOM)</th>
					<td>ACCESS-GE</td>
					<td>Global</td>
					<td>40 km, 3-hourly</td>
					<td>18</td>
					<td>10 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row">UK Met Office</th>
					<td>MOGREPS-G</td>
					<td>Global</td>
					<td>20 km, 1-hourly</td>
					<td>18</td>
					<td>8 days</td>
					<td>Every 6 hours</td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		To ensure ease of use, all data is interpolated to a 1-hourly time-step resolution. As the
		forecast horizon extends further into the future, some ensemble models may reduce the time
		resolution to 6-hourly intervals.
	</p>
</div>

<h2 id="api-documentation" class="mt-3">API Documentation</h2>
<p>
	The API endpoint <mark>/v1/ensemble</mark> accepts a geographical coordinate, a list of weather variables
	and responds with a JSON hourly weather forecast for 7 days for each ensemble member. Time always starts
	at 0:00 today. All URL parameters are listed below:
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
				<th scope="row">models</th>
				<td>String array</td>
				<td>Yes</td>
				<td></td>
				<td>Select one or more ensemble weather models as comma-separated list</td>
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
			<!--<tr>
				<th scope="row">daily</th>
				<td>String array</td>
				<td>No</td>
				<td></td>
				<td
					>A list of daily weather variable aggregations which should be returned. Values can be
					comma separated, or multiple <mark>&daily=</mark> parameter in the URL can be used. If
					daily weather variables are specified, parameter <mark>timezone</mark> is required.</td
				>
			</tr>-->
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
				<td>Other wind speed speed units: <mark>ms</mark>, <mark>mph</mark> and <mark>kn</mark></td>
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
					time in seconds. Please note that all timestamp are in GMT+0! For daily values with unix
					timestamps, please apply
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
				<td>Integer</td>
				<td>No</td>
				<td><mark>0</mark></td>
				<td>If <mark>past_days</mark> is set, past weather data can be returned.</td>
			</tr>
			<tr>
				<th scope="row">forecast_days</th>
				<td>Integer (0-35)</td>
				<td>No</td>
				<td><mark>7</mark></td>
				<td>Per default, only 7 days are returned. Up to 35 days of forecast are possible.</td>
			</tr>
			<tr>
				<th scope="row"
					>forecast_hours<br />forecast_minutely_15<br />past_hours<br />past_minutely_15</th
				>
				<td>Integer (&gt;0)</td>
				<td>No</td>
				<td></td>
				<td
					>Similar to forecast_days, the number of timesteps of hourly and 15-minutely data can
					controlled. Instead of using the current day as a reference, the current hour or the
					current 15-minute time-step is used.
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
				<th scope="row">start_hour<br />end_hour<br />start_minutely_15<br />end_minutely_15</th>
				<td>String (yyyy-mm-ddThh:mm)</td>
				<td>No</td>
				<td></td>
				<td
					>The time interval to get weather data for hourly or 15 minutely data. Time must be
					specified as an ISO8601 date (e.g.
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
						>similar elevation to the requested coordinates using a 90-meter digital elevation model</a
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

<h3 class="mt-3">Hourly Parameter Definition</h3>
<p>
	The parameter <mark>&hourly=</mark> accepts the following values. Most weather variables are given
	as an instantaneous value for the indicated hour. Some variables like precipitation are calculated
	from the preceding hour as an average or sum.
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
					>Apparent temperature is the perceived feels-like temperature combining wind chill factor,
					relative humidity and solar radiation</td
				>
			</tr>
			<tr>
				<th scope="row">pressure_msl<br />surface_pressure</th>
				<td>Instant</td>
				<td>hPa</td>
				<td
					>Atmospheric air pressure reduced to mean sea level (msl) or pressure at surface.
					Typically pressure on mean sea level is used in meteorology. Surface pressure gets lower
					with increasing elevation.</td
				>
			</tr>
			<tr>
				<th scope="row">cloud_cover</th>
				<td>Instant</td>
				<td>%</td>
				<td>Total cloud cover as an area fraction</td>
			</tr>
			<tr>
				<th scope="row">wind_speed_10m<br />wind_speed_80m<br />wind_speed_120m</th>
				<td>Instant</td>
				<td>km/h (mph, m/s, knots)</td>
				<td
					>Wind speed at 10, 80 or 120 meters above ground. Wind speed on 10 meters is the standard
					level.</td
				>
			</tr>
			<tr>
				<th scope="row">wind_direction_10m<br />wind_direction_80m<br />wind_direction_120m</th>
				<td>Instant</td>
				<td>°</td>
				<td>Wind direction at 10, 80 or 120 meters above ground</td>
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
					normal plane (perpendicular to the sun). HRRR offers direct radiation directly. In GFS it
					is approximated based on <a
						href="https://www.ise.fraunhofer.de/content/dam/ise/de/documents/publications/conference-paper/36-eupvsec-2019/Guzman_5CV31.pdf"
						target="_blank">Razo, Müller Witwer</a
					></td
				>
			</tr>
			<tr>
				<th scope="row">diffuse_radiation</th>
				<td>Preceding hour mean</td>
				<td>W/m²</td>
				<td
					>Diffuse solar radiation as average of the preceding hour. HRRR offers diffuse radiation
					directly. In GFS it is approximated based on <a
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
					calculation assumes a horizontal tracker. If tilt is set to "nan", it is assumed that the
					panel has a vertical tracker. If both are set to "nan", a bi-axial tracker is assumed.</td
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
				<th scope="row">evapotranspiration</th>
				<td>Preceding hour sum</td>
				<td>mm (inch)</td>
				<td
					>Evapotranspration from land surface and plants that weather models assumes for this
					location. Available soil water is considered. 1 mm evapotranspiration per hour equals 1
					liter of water per spare meter.</td
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
					> ET₀ is calculated from temperature, wind speed, humidity and solar radiation. Unlimited soil
					water is assumed. ET₀ is commonly used to estimate the required irrigation for plants.</td
				>
			</tr>
			<tr>
				<th scope="row">weather_code</th>
				<td>Instant</td>
				<td>WMO code</td>
				<td
					>Weather condition as a numeric code. Follow WMO weather interpretation codes. See table
					below for details. Weather code is calculated from cloud cover analysis, precipitation,
					snowfall, cape, lifted index and gusts.</td
				>
			</tr>
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
					millimeter, divide by 7. E.g. 7 cm snow = 10 mm precipitation water equivalent</td
				>
			</tr>
			<tr>
				<th scope="row">rain</th>
				<td>Preceding hour sum</td>
				<td>mm (inch)</td>
				<td>Liquid precipitation of the preceding hour in millimeter</td>
			</tr>
			<tr>
				<th scope="row">weather_code</th>
				<td>Instant</td>
				<td>WMO code</td>
				<td
					>Weather condition as a numeric code. Follow WMO weather interpretation codes. See table
					below for details.</td
				>
			</tr>
			<tr>
				<th scope="row">snow_depth</th>
				<td>Instant</td>
				<td>meters</td>
				<td>Snow depth on the ground</td>
			</tr>
			<tr>
				<th scope="row">freezing_level_height</th>
				<td>Instant</td>
				<td>meters</td>
				<td>Altitude above sea level of the 0°C level</td>
			</tr>
			<tr>
				<th scope="row">visibility</th>
				<td>Instant</td>
				<td>meters</td>
				<td>Viewing distance in meters. Influenced by low clouds, humidity and aerosols.</td>
			</tr>
			<tr>
				<th scope="row">cape</th>
				<td>Instant</td>
				<td>J/kg</td>
				<td
					>Convective available potential energy. See <a
						href="https://en.wikipedia.org/wiki/Convective_available_potential_energy"
						target="_blank">Wikipedia</a
					>.</td
				>
			</tr>
			<tr>
				<th scope="row"> surface_temperature </th>
				<td>Instant</td>
				<td>°C (°F)</td>
				<td>Temperature of the top soil level</td>
			</tr>
			<tr>
				<th scope="row">
					soil_temperature_0_to_10cm<br />soil_temperature_10_to_40cm<br
					/>soil_temperature_40_to_100cm<br />soil_temperature_100_to_200cm
				</th>
				<td>Instant</td>
				<td>°C (°F)</td>
				<td>Temperature in the soil as an average on 0-10, 10-40, 40-100 and 100-200 cm depths.</td>
			</tr>
			<tr>
				<th scope="row">
					soil_moisture_0_to_10cm<br />soil_moisture_10_to_40cm<br />soil_moisture_40_to_100cm<br
					/>soil_moisture_100_to_200cm
				</th>
				<td>Instant</td>
				<td>m³/m³</td>
				<td
					>Average soil water content as volumetric mixing ratio at 0-10, 10-40, 40-100 and 100-200
					cm depths.</td
				>
			</tr>
		</tbody>
	</table>
</div>

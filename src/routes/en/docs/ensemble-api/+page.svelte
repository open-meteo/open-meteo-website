<script lang="ts">
	import LicenseSelector from '../LicenseSelector.svelte';
	import ResultPreview from '../ResultPreview.svelte';
	import { urlHashStore } from '$lib/url-hash-store';
	import { countVariables } from '$lib/meteo';
	import AccordionItem from '$lib/Elements/AccordionItem.svelte';
	import { fade, slide } from 'svelte/transition';
	import { CalendarEvent, Clock } from 'svelte-bootstrap-icons';
	import StartEndDate from '../StartEndDate.svelte';
	import LocationSelection from '../LocationSelection.svelte';

	const defaultParameter = {
		hourly: [],
		//daily: [],
		location_mode: 'location_search',
		csv_coordinates: '',
		current_weather: false,
		temperature_unit: 'celsius',
		windspeed_unit: 'kmh',
		precipitation_unit: 'mm',
		timeformat: 'iso8601',
		timezone: 'UTC',
		past_days: '0',
		forecast_days: '7',
		start_date: '',
		end_date: '',
		time_mode: 'forecast_days',
		models: []
	};

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameter,
		hourly: ['temperature_2m'],
		models: ['icon_seamless']
	});

	$: timezoneInvalid = false; //$params.timezone == 'UTC' && $params.daily.length > 0;
	
	const icon_global_variables = [
		'weathercode',
		'temperature_2m',
		'surface_pressure',
		'pressure_msl',
		'relativehumidity_2m',
		'dewpoint_2m',
		'apparent_temperature',
		'precipitation',
		'snowfall',
		'cloudcover',
		'et0_fao_evapotranspiration',
		'vapor_pressure_deficit',
		'windspeed_10m',
		'winddirection_10m',
		'rain',
		'shortwave_radiation'
	];

	const icon_eu_variables = [
		'weathercode',
		'temperature_2m',
		'surface_pressure',
		'pressure_msl',
		'precipitation',
		'snowfall',
		'cloudcover',
		'windspeed_10m',
		'winddirection_10m',
		'windgusts_10m',
		'windspeed_80m',
		'winddirection_80m',
		'temperature_80m',
		'rain',
		'cape',
		'shortwave_radiation'
	];

	const icon_d2_variables = [
		'weathercode',
		'temperature_2m',
		'surface_pressure',
		'pressure_msl',
		'relativehumidity_2m',
		'dewpoint_2m',
		'apparent_temperature',
		'precipitation',
		'snowfall',
		'cloudcover',
		'et0_fao_evapotranspiration',
		'vapor_pressure_deficit',
		'windspeed_10m',
		'windspeed_80m',
		'windspeed_180m',
		'winddirection_10m',
		'winddirection_80m',
		'winddirection_180m',
		'windgusts_10m',
		'temperature_80m',
		'rain',
		'cape',
		'shortwave_radiation'
	];

	const gfs025_variables = [
		'temperature_2m',
		'visibility',
		'windgusts_10m',
		'surface_pressure',
		'pressure_msl',
		'soil_temperature_0_to_10cm',
		'soil_moisture_0_to_10cm',
		'snow_depth',
		'relativehumidity_2m',
		'dewpoint_2m',
		'windspeed_10m',
		'winddirection_10m',
		'precipitation',
		'snowfall',
		'cape',
		'cloudcover',
		'apparent_temperature',
		'weathercode',
		'et0_fao_evapotranspiration',
		'vapor_pressure_deficit',
		'cape',
		'rain',
		'shortwave_radiation'
	];

	const gfs05_variables = [
		...gfs025_variables,
		'snow_depth',
		'windspeed_80m',
		'winddirection_80m',
		'windspeed_120m',
		'winddirection_120m',
		'soil_temperature_10_to_40cm',
		'soil_temperature_40_to_100cm',
		'soil_temperature_100_to_200cm',
		'soil_moisture_10_to_40cm',
		'soil_moisture_40_to_100cm',
		'soil_moisture_100_to_200cm',
		'uv_index',
		'uv_index_clear_sky',
		'cape',
		'freezinglevel_height',
		'rain',
		'surface_temperature',
		'temperature_80m',
		'temperature_120m',
		'shortwave_radiation'
	];

	let available_variables = {
		icon_seamless: icon_d2_variables,
		icon_global: icon_global_variables,
		icon_eu: icon_eu_variables,
		icon_d2: icon_d2_variables,
		gfs_seamless: gfs05_variables,
		gfs025: gfs025_variables,
		gfs05: gfs05_variables,
		ecmwf_ifs04: [
			'temperature_2m',
			'precipitation',
			'rain',
			'snowfall',
			'relativehumidity_2m',
			'dewpoint_2m',
			'apparent_temperature',
			'vapor_pressure_deficit',
			'weathercode',
			'surface_pressure',
			'pressure_msl',
			'cloudcover',
			'windspeed_10m',
			'winddirection_10m',
			'surface_temperature',
			'rain',
			'soil_temperature_0_to_10cm'
		],
		gem_global: [
			'temperature_2m',
			'surface_pressure',
			'snow_depth',
			'relativehumidity_2m',
			'dewpoint_2m',
			'windspeed_10m',
			'winddirection_10m',
			'precipitation',
			'snowfall',
			'cape',
			'cloudcover',
			'apparent_temperature',
			'weathercode',
			'pressure_msl',
			'et0_fao_evapotranspiration',
			'vapor_pressure_deficit',
			'cape',
			'rain',
			'shortwave_radiation'
		]
	};

	function isAvailable(variable: String, models: String[]): Boolean {
		if (models.length == 0) {
			return true;
		}
		for (const model of models) {
			/* @ts-ignore */
			if (!Object.hasOwn(available_variables, model)) {
				continue;
			}
			/* @ts-ignore */
			if (available_variables[model].includes(variable)) {
				return true;
			}
		}
		return false;
	}

	const hourly = [
		[
			{ name: 'temperature_2m', label: 'Temperature (2 m)' },
			{ name: 'relativehumidity_2m', label: 'Relative Humidity (2 m)' },
			{ name: 'dewpoint_2m', label: 'Dewpoint (2 m)' },
			{ name: 'apparent_temperature', label: 'Apparent Temperature' },
			{ name: 'precipitation', label: 'Precipitation (rain + snow)' },
			{ name: 'rain', label: 'Rain' },
			{ name: 'snowfall', label: 'Snowfall' },
			{ name: 'snow_depth', label: 'Snow Depth' }
		],
		[
			{ name: 'weathercode', label: 'Weathercode' },
			{ name: 'pressure_msl', label: 'Sealevel Pressure' },
			{ name: 'surface_pressure', label: 'Surface Pressure' },
			{ name: 'cloudcover', label: 'Cloudcover Total' },
			{ name: 'visibility', label: 'Visibility' },
			{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
			{ name: 'vapor_pressure_deficit', label: 'Vapor Pressure Deficit' }
		],
		[
			{ name: 'windspeed_10m', label: 'Wind Speed (10 m)' },
			{ name: 'windspeed_80m', label: 'Wind Speed (80 m)' },
			{ name: 'windspeed_120m', label: 'Wind Speed (120 m)' },
			{ name: 'winddirection_10m', label: 'Wind Direction (10 m)' },
			{ name: 'winddirection_80m', label: 'Wind Direction (80 m)' },
			{ name: 'winddirection_120m', label: 'Wind Direction (120 m)' },
			{ name: 'windgusts_10m', label: 'Wind Gusts (10 m)' },
			{ name: 'temperature_80m', label: 'Temperature (80 m)' },
			{ name: 'temperature_120m', label: 'Temperature (120 m)' }
		],
		[
			{ name: 'surface_temperature', label: 'Surface Temperature' },
			{ name: 'soil_temperature_0_to_10cm', label: 'Soil Temperature (0-10 cm)' },
			{ name: 'soil_temperature_10_to_40cm', label: 'Soil Temperature (10-40 cm)' },
			{ name: 'soil_temperature_40_to_100cm', label: 'Soil Temperature (40-100 cm)' },
			{ name: 'soil_temperature_100_to_200cm', label: 'Soil Temperature (100-200 cm)' },
			{ name: 'soil_moisture_0_to_10cm', label: 'Soil Moisture (0-10 cm)' },
			{ name: 'soil_moisture_10_to_40cm', label: 'Soil Moisture (10-40 cm)' },
			{ name: 'soil_moisture_40_to_100cm', label: 'Soil Moisture (40-100 cm)' },
			{ name: 'soil_moisture_100_to_200cm', label: 'Soil Moisture (100-400 cm)' }
		]
	];

	const additionalVariables = [
		[
			{ name: 'uv_index', label: 'UV Index' },
			{ name: 'uv_index_clear_sky', label: 'UV Index Clear Sky' }
			//{ name: 'is_day', label: 'Is Day or Night' }
		],
		[
			{ name: 'cape', label: 'CAPE' },
			//{ name: 'lifted_index', label: 'Lifted Index' },
			{ name: 'freezinglevel_height', label: 'Freezinglevel Height' }
		]
	];

	const solarVariables = [
		[
			{ name: 'shortwave_radiation', label: 'Shortwave Solar Radiation' },
			{ name: 'direct_radiation', label: 'Direct Solar Radiation' },
			{ name: 'diffuse_radiation', label: 'Diffuse Solar Radiation' },
			{ name: 'direct_normal_irradiance', label: 'Direct Normal Irradiance DNI' }
			//{ name: 'terrestrial_radiation', label: 'Terrestrial Solar Radiation' }
		],
		[
			{ name: 'shortwave_radiation_instant', label: 'Shortwave Solar Radiation (Instant)' },
			{ name: 'direct_radiation_instant', label: 'Direct Solar Radiation (Instant)' },
			{ name: 'diffuse_radiation_instant', label: 'Diffuse Solar Radiation (Instant)' },
			{ name: 'direct_normal_irradiance_instant', label: 'Direct Normal Irradiance DNI (Instant)' }
			//{ name: 'terrestrial_radiation_instant', label: 'Terrestrial Solar Radiation (Instant)' }
		]
	];

	const models = [
		[
			{ name: 'icon_seamless', label: 'DWD Icon EPS Seamless' },
			{ name: 'icon_global', label: 'DWD Icon EPS Global' },
			{ name: 'icon_eu', label: 'DWD Icon EPS EU' },
			{ name: 'icon_d2', label: 'DWD Icon EPS D2' }
		],
		[
			{ name: 'gfs_seamless', label: 'GFS Ensemble Seamless' },
			{ name: 'gfs025', label: 'GFS Ensemble 0.25' },
			{ name: 'gfs05', label: 'GFS Ensemble 0.5' }
		],
		[{ name: 'ecmwf_ifs04', label: 'ECMWF IFS Ensemble' }],
		[{ name: 'gem_global', label: 'GEM Global Ensemble' }]
	];
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
	<LocationSelection
		bind:latitude={$params.latitude}
		bind:longitude={$params.longitude}
		bind:location_mode={$params.location_mode}
		bind:csv_coordinates={$params.csv_coordinates}
		bind:timezone={$params.timezone}
		bind:timezoneInvalid={timezoneInvalid}
	/>

	<div class="row py-3 px-0">
		<div>
			<ul class="nav nav-underline" id="pills-tab" role="tablist">
				<li class="nav-item" role="presentation">
					<span class="nav-link disabled" aria-disabled="true">Time Selection:</span>
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
							<StartEndDate bind:start_date={$params.start_date} bind:end_date={$params.end_date}/>
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
				title="Additional Variables"
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
				<div class="col-md-12">
					<small class="text-muted"
						>Note: Solar radiation is averaged over the past hour. Use
						<mark>instant</mark> for radiation at the indicated time.</small
					>
				</div>
			</AccordionItem>
		</div>
	</div>

	<div class="row py-3 px-0">
		<h2>Settings</h2>
		<div class="col-12 pb-3">
			<div class="form-check form-switch">
				<input
					class="form-check-input"
					type="checkbox"
					id="current_weather"
					name="current_weather"
					value="true"
					bind:checked={$params.current_weather}
				/>
				<label class="form-check-label" for="current_weather"
					>Current weather with temperature, windspeed and weather code</label
				>
			</div>
		</div>
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
	</div>

	<LicenseSelector requires_professional_plan={true} />
</form>

<ResultPreview {params} {defaultParameter} type="ensemble" action="ensemble" />

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
					<th scope="row">ECMWF</th>
					<td>IFS</td>
					<td>Global</td>
					<td>44 km, 3-hourly</td>
					<td>51</td>
					<td>10 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row">Canadian Weather Service</th>
					<td>GEM</td>
					<td>Global</td>
					<td>2.5 km, 3-hourly</td>
					<td>21</td>
					<td>16 days (32 days every thursday)</td>
					<td>Every 12 hours</td>
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
				<td />
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
				<td />
				<td>Select one or more ensemble weather models as comma-separated list</td>
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
			<!--<tr>
				<th scope="row">daily</th>
				<td>String array</td>
				<td>No</td>
				<td />
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
				<th scope="row">windspeed_unit</th>
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
				<td>Integer (0-16)</td>
				<td>No</td>
				<td><mark>7</mark></td>
				<td>Per default, only 7 days are returned. Up to 16 days of forecast are possible.</td>
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
				<th scope="row">relativehumidity_2m</th>
				<td>Instant</td>
				<td>%</td>
				<td>Relative humidity at 2 meters above ground</td>
			</tr>
			<tr>
				<th scope="row">dewpoint_2m</th>
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
				<th scope="row">cloudcover</th>
				<td>Instant</td>
				<td>%</td>
				<td>Total cloud cover as an area fraction</td>
			</tr>
			<tr>
				<th scope="row">windspeed_10m<br />windspeed_80m<br />windspeed_120m</th>
				<td>Instant</td>
				<td>km/h (mph, m/s, knots)</td>
				<td
					>Wind speed at 10, 80 or 120 meters above ground. Wind speed on 10 meters is the standard
					level.</td
				>
			</tr>
			<tr>
				<th scope="row">winddirection_10m<br />winddirection_80m<br />winddirection_120m</th>
				<td>Instant</td>
				<td>°</td>
				<td>Wind direction at 10, 80 or 120 meters above ground</td>
			</tr>
			<tr>
				<th scope="row">windgusts_10m</th>
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
				<th scope="row">vapor_pressure_deficit</th>
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
				<th scope="row">weathercode</th>
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
				<th scope="row">weathercode</th>
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
				<th scope="row">freezinglevel_height</th>
				<td>Instant</td>
				<td>meters</td>
				<td>Altitude above sea level of the 0°C level</td>
			</tr>
			<tr>
				<th scope="row">visibility</th>
				<td>Instant</td>
				<td>meters</td>
				<td
					>Viewing distance in meters. Influenced by low clouds, humidity and aerosols. Maximum
					visibility is approximately 24 km.</td
				>
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

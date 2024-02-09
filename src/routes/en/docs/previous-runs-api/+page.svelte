<script lang="ts">
	import LicenseSelector from '../LicenseSelector.svelte';
	import PressureLevelsHelpTable from '../PressureLevelsHelpTable.svelte';
	import ResultPreview from '../ResultPreview.svelte';
	import { urlHashStore } from '$lib/url-hash-store';
	import {
		altitudeAboveSeaLevelMeters,
		countPressureVariables,
		countVariables,
		sliceIntoChunks
	} from '$lib/meteo';
	import AccordionItem from '$lib/Elements/AccordionItem.svelte';
	import { fade, slide } from 'svelte/transition';
	import CalendarEvent from 'svelte-bootstrap-icons/lib/CalendarEvent.svelte';
	import Clock from 'svelte-bootstrap-icons/lib/Clock.svelte';
	import StartEndDate from '../StartEndDate.svelte';
	import LocationSelection from '../LocationSelection.svelte';
	import { onMount } from 'svelte';

	const defaultParameter = {
		current: [],
		minutely_15: [],
		hourly: [],
		daily: [],
		location_mode: 'location_search',
		csv_coordinates: '',
		temperature_unit: 'celsius',
		wind_speed_unit: 'kmh',
		precipitation_unit: 'mm',
		timeformat: 'iso8601',
		timezone: 'UTC',
		time_mode: 'forecast_days',
		past_days: '0',
		past_hours: '',
		past_minutely_15: '',
		forecast_days: '7',
		forecast_hours: '',
		forecast_minutely_15: '',
		start_date: '',
		end_date: '',
		tilt: 0,
		azimuth: 0,
		models: [],
	};

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameter,
		hourly: ['temperature_2m_previous_day0','temperature_2m_previous_day1','temperature_2m_previous_day2','temperature_2m_previous_day3','temperature_2m_previous_day4','temperature_2m_previous_day5']
	});

	const pressureVariables = [
		{ name: 'temperature', label: 'Temperature' },
		{ name: 'relative_humidity', label: 'Relative Humidity' },
		{ name: 'cloud_cover', label: 'Cloud cover' },
		{ name: 'windspeed', label: 'Wind Speed' },
		{ name: 'winddirection', label: 'Wind Direction' },
		{ name: 'geopotential_height', label: 'Geopotential Height' }
	];
	const levels = [
		30, 50, 70, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900, 925, 950, 975, 1000
	].reverse();

	let pressureVariablesTab = 'temperature';

	$: timezoneInvalid = $params.timezone == 'UTC' && $params.daily.length > 0;

	const previousDay = [
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' },
		{ name: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ name: 'rain', label: 'Rain' },
		{ name: 'showers', label: 'Showers' },
		{ name: 'snowfall', label: 'Snowfall' },
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'pressure_msl', label: 'Sealevel Pressure' },
		{ name: 'surface_pressure', label: 'Surface Pressure' },
		{ name: 'cloud_cover', label: 'Cloud cover Total' },
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ name: 'shortwave_radiation', label: 'Shortwave Solar Radiation GHI' },
		{ name: 'direct_radiation', label: 'Direct Solar Radiation' },
		{ name: 'diffuse_radiation', label: 'Diffuse Solar Radiation DHI' },
		{ name: 'direct_normal_irradiance', label: 'Direct Normal Irradiance DNI' },
		{ name: 'global_tilted_irradiance', label: 'Global Tilted Radiation GTI' }
	];

	const models = [
		[
			{ name: 'best_match', label: 'Best match' },
			{ name: 'ecmwf_ifs04', label: 'ECMWF IFS 0.4°' },
			{ name: 'ecmwf_ifs025', label: 'ECMWF IFS 0.25°' },
			{ name: 'cma_grapes_global', label: 'CMA GRAPES Global' },
			{ name: 'bom_access_global', label: 'BOM Access Global' },
			{ name: 'metno_nordic', label: 'MET Norway Nordic' }
		],
		[
			{ name: 'gfs_seamless', label: 'GFS Seamless' },
			{ name: 'gfs_global', label: 'GFS Global' },
			{ name: 'gfs_hrrr', label: 'GFS HRRR' }
		],
		[
			{ name: 'jma_seamless', label: 'JMA Seamless' },
			{ name: 'jma_msm', label: 'JMA MSM' },
			{ name: 'jma_gsm', label: 'JMA GSM' }
		],
		[
			{ name: 'icon_seamless', label: 'DWD Icon Seamless' },
			{ name: 'icon_global', label: 'DWD Icon Global' },
			{ name: 'icon_eu', label: 'DWD Icon EU' },
			{ name: 'icon_d2', label: 'DWD Icon D2' }
		],
		[
			{ name: 'gem_seamless', label: 'GEM Seamless' },
			{ name: 'gem_global', label: 'GEM Global' },
			{ name: 'gem_regional', label: 'GEM Regional' },
			{ name: 'gem_hrdps_continental', label: 'GEM HRDPS Continental' }
		],
		[
			{ name: 'meteofrance_seamless', label: 'MeteoFrance Seamless' },
			{ name: 'meteofrance_arpege_world', label: 'MeteoFrance Arpege World' },
			{ name: 'meteofrance_arpege_europe', label: 'MeteoFrance Arpege Europe' },
			{ name: 'meteofrance_arome_france', label: 'MeteoFrance Arome France' },
			{ name: 'meteofrance_arome_france_hd', label: 'MeteoFrance Arome France HD' }
		],
		[
			{ name: 'arpae_cosmo_seamless', label: 'ARPAE Seamless' },
			{ name: 'arpae_cosmo_2i', label: 'ARPAE COSMO 2I' },
			{ name: 'arpae_cosmo_2i_ruc', label: 'ARPAE COSMO 2I RUC' },
			{ name: 'arpae_cosmo_5m', label: 'ARPAE COSMO 5M' }
		]
	];
</script>

<svelte:head>
	<title>Previous Runs API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/previous-runs-api" />
</svelte:head>

<div class="alert alert-warning" role="alert">
	Work in progress. This API stores previous weather models showing what was predicted a few days prior.
</div>

<form method="get" action="https://historical-forecast-api.open-meteo.com/v1/forecast">
	<LocationSelection
		bind:latitude={$params.latitude}
		bind:longitude={$params.longitude}
		bind:location_mode={$params.location_mode}
		bind:csv_coordinates={$params.csv_coordinates}
		bind:timezone={$params.timezone}
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
						on:click={() => ($params.time_mode = 'forecast_days')}><Clock /> Forecast Length</button
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
						aria-selected="true"><CalendarEvent /> Time Interval</button
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
						<div class="col-md-6">
							<p>
								By default, we provide forecasts for 7 days, but you can access forecasts for up to
								16 days. If you're interested in past weather data, you can use the <mark
									>Past Days</mark
								>
								feature to access archived forecasts.
							</p>
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
						<div class="col-md-6">
							<p>
								The <mark>Start Date</mark> and <mark>End Date</mark> options help you choose a
								range of dates more easily. Archived forecasts come from a series of weather model
								runs over time. If you're using the free API, you can access archived forecasts for
								up to 3 months. For our commercial customers, data is available up to 6 months.
								You can also check out our
								<a href="/en/docs/historical-weather-api">Historical Weather API</a>, which provides
								data going all the way back to 1940.
							</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="row py-3 px-0">
		<h2>Hourly Weather Variables</h2>
		<div class="table-responsive">
			<table class="table table-sm ">
				<tbody>
					{#each previousDay as e}
						<tr>
							<td>{e.label}</td>
							{#each {length: 8} as _, i}
							<td><div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value="{e.name}_previous_day{i}"
									id="{e.name}_hourly_previous_day{i}"
									name="hourly"
									bind:group={$params.hourly}
								/>
								<label class="form-check-label" for="{e.name}_hourly_previous_day{i}">Day {i}</label>
							</div></td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="col-md-12 mb-3">
			<p>Forecasts from model runs of previous days show what was predicted a few days earlier. 
				By comparing these previous forecasts with the latest data, one can compute the accuracy and volatility of a forecast. 
				Additionally, this data can be utilized to refine forecasts for a specific future time using machine learning models.</p>
			<p>Day 0 represents the most recent data. Day 1 depicts what was forecast 24 hours earlier, while Day 2 reflects forecasts from 48 hours prior, and so on. Beyond Day 6 and 7, wild data jumps are anticipated, indicating increased forecast volatility.</p>
			<p>Data is refreshed with each weather model run, ranging from updates every hour to updates every six hours while maintaining a fixed offset of 24, 48, 72 hours. Local models, offering forecasts of only 2-5 days, naturally possess only 2-5 days of previous day data.</p>
		</div>
	</div>

	<div class="row py-3 px-0">
		<div class="accordion" id="accordionVariables">
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

	<LicenseSelector requires_professional_plan={true}/>
</form>

<ResultPreview {params} {defaultParameter} type="previous-runs" useStockChart={true}/>

<div class="col-12 py-5">
	<h2 id="data-sources">Data Source</h2>
	<p>
		Open-Meteo weather forecast APIs use weather models from multiple national weather providers.
		For each location worldwide, the best models will be combined to provide the best possible
		forecast.
	</p>
	<p>
		Weather models cover different geographic areas at different resolutions and provide different
		weather variables. Depending on the model, data have been interpolated to hourly values or not
		all weather variables are available. With the drop down <mark>Weather models</mark> (just below the
		hourly variables), you can select and compare individual weather models.
	</p>
	<div class="table-responsive">
		<table class="table">
			<thead>
				<tr>
					<th scope="col">Weather Model</th>
					<th scope="col">National Weather Provider</th>
					<th scope="col">Origin Country</th>
					<th scope="col">Resolution</th>
					<th scope="col">Forecast Length</th>
					<th scope="col">Update frequency</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row"><a href="/en/docs/dwd-api">ICON</a></th>
					<td>Deutscher Wetterdienst (DWD)</td>
					<td>Germany</td>
					<td>2 - 11 km</td>
					<td>7.5 days</td>
					<td>Every 3 hours</td>
				</tr>
				<tr>
					<th scope="row"><a href="/en/docs/gfs-api">GFS & HRRR</a></th>
					<td>NOAA</td>
					<td>United States</td>
					<td>3 - 25 km</td>
					<td>16 days</td>
					<td>Every hour</td>
				</tr>
				<tr>
					<th scope="row"><a href="/en/docs/meteofrance-api">Arpege & Arome</a></th>
					<td>MeteoFrance</td>
					<td>France</td>
					<td>1 - 25 km</td>
					<td>4 days</td>
					<td>Every 3 hours</td>
				</tr>
				<tr>
					<th scope="row"><a href="/en/docs/ecmwf-api">IFS</a></th>
					<td>ECMWF</td>
					<td>European Union</td>
					<td>44 km</td>
					<td>7 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row"><a href="/en/docs/jma-api">MSM & GSM</a></th>
					<td>JMA</td>
					<td>Japan</td>
					<td>5 - 55 km</td>
					<td>11 days</td>
					<td>Every 3 hours</td>
				</tr>
				<tr>
					<th scope="row"><a href="/en/docs/metno-api">MET Nordic</a></th>
					<td>MET Norway</td>
					<td>Norway</td>
					<td>1 km</td>
					<td>2.5 days</td>
					<td>Every hour</td>
				</tr>
				<tr>
					<th scope="row"><a href="/en/docs/gem-api">GEM</a></th>
					<td>Canadian Weather Service</td>
					<td>Canada</td>
					<td>2.5 km</td>
					<td>10 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row"><a href="/en/docs/cma-api">GFS GRAPES</a></th>
					<td>China Meteorological Administration (CMA)</td>
					<td>China</td>
					<td>15 km</td>
					<td>10 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row"><a href="/en/docs/bom-api">ACCESS-G</a></th>
					<td>Australian Bureau of Meteorology (BOM)</td>
					<td>Australia</td>
					<td>15 km</td>
					<td>10 days</td>
					<td>Every 6 hours</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<div class="alert alert-warning" role="alert">Documentation work in progress</div>
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

	const defaultParameter = {
		current: [],
		hourly: [],
		daily: [],
		minutely_15: [],
		location_mode: 'location_search',
		csv_coordinates: '',
		temperature_unit: 'celsius',
		wind_speed_unit: 'kmh',
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
		hourly: ['temperature_2m']
	});

	const pressureVariables = [
		{ name: 'temperature', label: 'Temperature' },
		{ name: 'dew_point', label: 'Dewpoint' },
		{ name: 'relative_humidity', label: 'Relative Humidity' },
		{ name: 'cloud_cover', label: 'Cloud cover' },
		{ name: 'windspeed', label: 'Wind Speed' },
		{ name: 'winddirection', label: 'Wind Direction' },
		{ name: 'vertical_velocity', label: 'Vertical Velocity' },
		{ name: 'geopotential_height', label: 'Geopotential Height' }
	];
	const levels = [
		10, 15, 20, 30, 40, 50, 70, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700,
		750, 800, 850, 900, 925, 950, 975, 1000
	].reverse();

	let pressureVariablesTab = 'temperature';

	$: timezoneInvalid = $params.timezone == 'UTC' && $params.daily.length > 0;

	const hourly = [
		[
			{ name: 'temperature_2m', label: 'Temperature (2 m)' },
			{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
			{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
			{ name: 'apparent_temperature', label: 'Apparent Temperature' },
			{ name: 'precipitation_probability', label: 'Precipitation Probability' },
			{ name: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
			{ name: 'rain', label: 'Rain' },
			{ name: 'showers', label: 'Showers' },
			{ name: 'snowfall', label: 'Snowfall' },
			{ name: 'snow_depth', label: 'Snow Depth' }
		],
		[
			{ name: 'weather_code', label: 'Weather code' },
			{ name: 'pressure_msl', label: 'Sealevel Pressure' },
			{ name: 'surface_pressure', label: 'Surface Pressure' },
			{ name: 'cloud_cover', label: 'Cloud cover Total' },
			{ name: 'cloud_cover_low', label: 'Cloud cover Low' },
			{ name: 'cloud_cover_mid', label: 'Cloud cover Mid' },
			{ name: 'cloud_cover_high', label: 'Cloud cover High' },
			{ name: 'visibility', label: 'Visibility' },
			{ name: 'evapotranspiration', label: 'Evapotranspiration' },
			{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
			{ name: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
		],
		[
			{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
			{ name: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
			{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
			{ name: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
			{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
			{ name: 'temperature_80m', label: 'Temperature (80 m)' }
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
			{ name: 'soil_moisture_100_to_200cm', label: 'Soil Moisture (100-200 cm)' }
		]
	];

	const current = [
		[
			{ name: 'temperature_2m', label: 'Temperature (2 m)' },
			{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
			{ name: 'apparent_temperature', label: 'Apparent Temperature' },
			{ name: 'is_day', label: 'Is Day or Night' }
		],[
			{ name: 'precipitation', label: 'Precipitation' },
			{ name: 'rain', label: 'Rain' },
			{ name: 'showers', label: 'Showers' },
			{ name: 'snowfall', label: 'Snowfall' },
		],
		[
			{ name: 'weather_code', label: 'Weather code' },
			{ name: 'cloud_cover', label: 'Cloud cover Total' },
			{ name: 'pressure_msl', label: 'Sealevel Pressure' },
			{ name: 'surface_pressure', label: 'Surface Pressure' },
		],
		[
			{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
			{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
			{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		]
	];

	const minutely_15 = [
		[
			{ name: 'temperature_2m', label: 'Temperature (2 m)' },
			{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
			{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
			{ name: 'apparent_temperature', label: 'Apparent Temperature' },
			{ name: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
			{ name: 'rain', label: 'Rain' },
			{ name: 'snowfall', label: 'Snowfall' }
		],
		[
			{ name: 'weather_code', label: 'Weather code' },
			{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
			{ name: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
			{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
			{ name: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
			{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
			{ name: 'visibility', label: 'Visibility' },
			{ name: 'cape', label: 'CAPE' }
		]
	];

	const daily = [
		[
			{ name: 'weather_code', label: 'Weather code' },
			{ name: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
			{ name: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
			{ name: 'apparent_temperature_max', label: 'Maximum Apparent Temperature (2 m)' },
			{ name: 'apparent_temperature_min', label: 'Minimum Apparent Temperature (2 m)' },
			{ name: 'sunrise', label: 'Sunrise' },
			{ name: 'sunset', label: 'Sunset' },
			{ name: 'uv_index_max', label: 'UV Index' },
			{ name: 'uv_index_clear_sky_max', label: 'UV Index Clear Sky' }
		],
		[
			{ name: 'precipitation_sum', label: 'Precipitation Sum' },
			{ name: 'rain_sum', label: 'Rain Sum' },
			{ name: 'showers_sum', label: 'Showers Sum' },
			{ name: 'snowfall_sum', label: 'Snowfall Sum' },
			{ name: 'precipitation_hours', label: 'Precipitation Hours' },
			{ name: 'precipitation_probability_max', label: 'Precipitation Probability Max' },
			{ name: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
			{ name: 'wind_gusts_10m_max', label: 'Maximum Wind Gusts (10 m)' },
			{ name: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' },
			{ name: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' },
			{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' }
		]
	];

	const additionalVariables = [
		[
			{ name: 'uv_index', label: 'UV Index' },
			{ name: 'uv_index_clear_sky', label: 'UV Index Clear Sky' },
			{ name: 'is_day', label: 'Is Day or Night' }
		],
		[
			{ name: 'cape', label: 'CAPE' },
			{ name: 'lifted_index', label: 'Lifted Index' },
			{ name: 'freezing_level_height', label: 'Freezing Level Height' }
		]
	];

	const solarVariables = [
		[
			{ name: 'shortwave_radiation', label: 'Shortwave Solar Radiation' },
			{ name: 'direct_radiation', label: 'Direct Solar Radiation' },
			{ name: 'diffuse_radiation', label: 'Diffuse Solar Radiation' },
			{ name: 'direct_normal_irradiance', label: 'Direct Normal Irradiance DNI' },
			{ name: 'terrestrial_radiation', label: 'Terrestrial Solar Radiation' }
		],
		[
			{ name: 'shortwave_radiation_instant', label: 'Shortwave Solar Radiation (Instant)' },
			{ name: 'direct_radiation_instant', label: 'Direct Solar Radiation (Instant)' },
			{ name: 'diffuse_radiation_instant', label: 'Diffuse Solar Radiation (Instant)' },
			{ name: 'direct_normal_irradiance_instant', label: 'Direct Normal Irradiance DNI (Instant)' },
			{ name: 'terrestrial_radiation_instant', label: 'Terrestrial Solar Radiation (Instant)' }
		]
	];
</script>

<svelte:head>
	<title>GFS & HRRR API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/gfs-api" />
</svelte:head>

<div class="alert alert-primary" role="alert">
	By combining the reliable NOAA GFS weather model with the rapid updating HRRR weather model, this
	API provides unrivaled forecasts for the US region. For a global forecast, the <a href="/en/docs"
		>Weather Forecast API</a
	> selects the most suitable weather models automatically to ensure optimal accuracy.
</div>

<form method="get" action="https://api.open-meteo.com/v1/gfs">
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
				id="minutely_15"
				title="15-Minutely Weather Variables"
				count={countVariables(solarVariables, $params.hourly)}
			>
				{#each minutely_15 as group}
					<div class="col-md-6 mb-3">
						{#each group as e}
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value={e.name}
									id="{e.name}_minutely_15"
									name="minutely_15"
									bind:group={$params.minutely_15}
								/>
								<label class="form-check-label" for="{e.name}_minutely_15">{e.label}</label>
							</div>
						{/each}
					</div>
				{/each}
				{#each solarVariables as group}
					<div class="col-md-6">
						{#each group as e}
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value={e.name}
									id="{e.name}_minutely_15"
									name="minutely_15"
									bind:group={$params.minutely_15}
								/>
								<label class="form-check-label" for="{e.name}_minutely_15">{e.label}</label>
							</div>
						{/each}
					</div>
				{/each}
				<div class="col-md-12">
					<small class="text-muted"
						>Note: Only available in North America. Other regions use
						interpolated hourly data. Solar radiation is averaged over the 15 minutes. Use
						<mark>instant</mark> for radiation at the indicated time.</small
					>
				</div>
			</AccordionItem>
		</div>
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
		{#if timezoneInvalid}
		<div class="alert alert-warning" role="alert">
			It is recommended to select a timezone for daily data. Per default the API will use GMT+0.
		</div>
		{/if}
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
				>Note: Current conditions are based on 15-minutely weather model data. Every weather variable available in hourly data, is available as current condition as well.</small
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
					<option selected value="celsius">Celsius °C</option>
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
					<option selected value="kmh">Km/h</option>
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

<ResultPreview {params} {defaultParameter} action="gfs" />

<div class="col-12 py-5">
	<h2 id="data-sources">Data Source</h2>
	<p>
		This API uses global NOAA GFS weather forecast and combines them with high-resolution HRRR
		forecasts. HRRR is a rapid-refresh model and updates every hour. High-resolution data are only
		available for the United States. For other locations, only GFS is used. For GFS, values are
		interpolated from 3-hourly to 1-hourly after 120 hours.
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
						><a href="https://www.nco.ncep.noaa.gov/pmb/products/gfs/" target="_blank">GFS</a></th
					>
					<td>Global</td>
					<td>0.11° (~13 km)</td>
					<td>Hourly, 3-hourly after 120 hours</td>
					<td>16 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row"
						><a href="https://www.nco.ncep.noaa.gov/pmb/products/gfs/" target="_blank"
							>GFS Pressure Variables</a
						></th
					>
					<td>Global</td>
					<td>0.25° (~25 km)</td>
					<td>Hourly, 3-hourly after 120 hours</td>
					<td>16 days</td>
					<td>Every 6 hours</td>
				</tr>
				<!--<tr>
              <th scope="row"><a href="https://www.nco.ncep.noaa.gov/pmb/products/nam/" target="_blank">NAM Conus</a></th>
              <td>U.S. Conus</td>
              <td>3 km</td>
              <td>Hourly</td>
              <td>2.5 days</td>
              <td>Every 6 hours</td>
            </tr>-->
				<tr>
					<th scope="row"
						><a href="https://rapidrefresh.noaa.gov/hrrr/" target="_blank">HRRR Conus</a></th
					>
					<td>U.S. Conus</td>
					<td>3 km</td>
					<td>Hourly</td>
					<td>18 hours (48 hours for 0, 6, 12, 18z)</td>
					<td>Every hour</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2 id="api-documentation" class="mt-5">API Documentation</h2>
	<p>
		The API endpoint <mark>/v1/gfs</mark> accepts a geographical coordinate, a list of weather
		variables and responds with a JSON hourly weather forecast for 7 days. Time always starts at
		0:00 today and contains 168 hours. If
		<mark>&forecast_days=16</mark> is set, up to 16 days of forecast can be returned. All URL parameters
		are listed below:
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
					<th scope="row">daily</th>
					<td>String array</td>
					<td>No</td>
					<td />
					<td
						>A list of daily weather variable aggregations which should be returned. Values can be
						comma separated, or multiple <mark>&daily=</mark> parameter in the URL can be used. If
						daily weather variables are specified, parameter <mark>timezone</mark> is required.</td
					>
				</tr>
				<tr>
					<th scope="row">current</th>
					<td>String array</td>
					<td>No</td>
					<td />
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
						>Apparent temperature is the perceived feels-like temperature combining wind chill
						factor, relative humidity and solar radiation</td
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
					<th scope="row">cloud_cover_low</th>
					<td>Instant</td>
					<td>%</td>
					<td>Low level clouds and fog up to 3 km altitude</td>
				</tr>
				<tr>
					<th scope="row">cloud_cover_mid</th>
					<td>Instant</td>
					<td>%</td>
					<td>Mid level clouds from 3 to 8 km altitude</td>
				</tr>
				<tr>
					<th scope="row">cloud_cover_high</th>
					<td>Instant</td>
					<td>%</td>
					<td>High level clouds from 8 km altitude</td>
				</tr>
				<tr>
					<th scope="row">wind_speed_10m<br />wind_speed_80m</th>
					<td>Instant</td>
					<td>km/h (mph, m/s, knots)</td>
					<td
						>Wind speed at 10 or 80 meters above ground. Wind speed on 10 meters is the standard
						level.</td
					>
				</tr>
				<tr>
					<th scope="row">wind_direction_10m<br />wind_direction_80m</th>
					<td>Instant</td>
					<td>°</td>
					<td>Wind direction at 10 or 80 meters above ground</td>
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
						normal plane (perpendicular to the sun). HRRR offers direct radiation directly. In GFS
						it is approximated based on <a
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
					<th scope="row">precipitation_probability</th>
					<td>Preceding hour probability</td>
					<td>%</td>
					<td
						>Probability of precipitation with more than 0.1 mm of the preceding hour. Probability
						is based on ensemble weather models with 0.25° (~27 km) resolution. 30 different
						simulations are computed to better represent future weather conditions.</td
					>
				</tr>
				<!--<tr>
              <th scope="row">rain</th>
              <td>Preceding hour sum</td>
              <td>mm (inch)</td>
              <td>Rain from large scale weather systems of the preceding hour in millimeter</td>
            </tr>
            <tr>
              <th scope="row">showers</th>
              <td>Preceding hour sum</td>
              <td>mm (inch)</td>
              <td>Showers from convective precipitation in millimeters from the preceding hour</td>
            </tr>
            <tr>
              <th scope="row">weather_code</th>
              <td>Instant</td>
              <td>WMO code</td>
              <td>Weather condition as a numeric code. Follow WMO weather interpretation codes. See table below for details.</td>
            </tr>-->
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
					<th scope="row">lifted_index</th>
					<td>Instant</td>
					<td>dimensionless</td>
					<td
						>Atmospheric stability. See <a
							href="https://en.wikipedia.org/wiki/Lifted_index"
							target="_blank">Wikipedia</a
						>.</td
					>
				</tr>
				<tr>
					<th scope="row">
						soil_temperature_0_to_10cm<br />soil_temperature_10_to_40cm<br
						/>soil_temperature_40_to_100cm<br />soil_temperature_100_to_200cm
					</th>
					<td>Instant</td>
					<td>°C (°F)</td>
					<td
						>Temperature in the soil as an average on 0-10, 10-40, 40-100 and 100-200 cm depths.</td
					>
				</tr>
				<tr>
					<th scope="row">
						soil_moisture_0_to_10cm<br />soil_moisture_10_to_40cm<br />soil_moisture_40_to_100cm<br
						/>soil_moisture_100_to_200cm
					</th>
					<td>Instant</td>
					<td>m³/m³</td>
					<td
						>Average soil water content as volumetric mixing ratio at 0-10, 10-40, 40-100 and
						100-200 cm depths.</td
					>
				</tr>
			</tbody>
		</table>
	</div>

	<h3 class="mt-5">15-Minutely Parameter Definition</h3>
	<p>
		The parameter <mark>&minutely_15=</mark> can be used to get 15-minutely data. This data is based
		on the HRRR model which is only available in North America. If 15-minutely data is requested
		for locations outside North America, data is interpolated from 1-hourly to 15-minutely.
	</p>
	<p>
		15-minutely data can be requested for other weather variables that are available for hourly
		data, but will use interpolation.
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
						>Apparent temperature is the perceived feels-like temperature combining wind chill
						factor, relative humidity and solar radiation</td
					>
				</tr>
				<tr>
					<th scope="row">wind_speed_10m<br />wind_speed_80m</th>
					<td>Instant</td>
					<td>km/h (mph, m/s, knots)</td>
					<td
						>Wind speed at 10 or 80 meters above ground. Wind speed on 10 meters is the standard
						level.
					</td>
				</tr>
				<tr>
					<th scope="row">wind_direction_10m<br />wind_direction_80m</th>
					<td>Instant</td>
					<td>°</td>
					<td>Wind direction at 10 or 80 meters above ground</td>
				</tr>
				<tr>
					<th scope="row">wind_gusts_10m</th>
					<td>Preceding 15 minutes max</td>
					<td>km/h (mph, m/s, knots)</td>
					<td>Gusts at 10 meters above ground as a maximum of the preceding 15 minutes</td>
				</tr>
				<tr>
					<th scope="row">shortwave_radiation</th>
					<td>Preceding 15 minutes mean</td>
					<td>W/m²</td>
					<td
						>Shortwave solar radiation as average of the preceding 15 minutes. This is equal to the
						total global horizontal irradiation
					</td>
				</tr>
				<tr>
					<th scope="row">direct_radiation<br />direct_normal_irradiance</th>
					<td>Preceding 15 minutes mean</td>
					<td>W/m²</td>
					<td
						>Direct solar radiation as average of the preceding 15 minutes on the horizontal plane
						and the normal plane (perpendicular to the sun)</td
					>
				</tr>
				<tr>
					<th scope="row">diffuse_radiation</th>
					<td>Preceding 15 minutes mean</td>
					<td>W/m²</td>
					<td>Diffuse solar radiation as average of the preceding 15 minutes</td>
				</tr>
				<tr>
					<th scope="row">precipitation</th>
					<td>Preceding 15 minutes sum</td>
					<td>mm (inch)</td>
					<td>Total precipitation (rain, showers, snow) sum of the preceding 15 minutes</td>
				</tr>
				<tr>
					<th scope="row">snowfall</th>
					<td>Preceding 15 minutes sum</td>
					<td>cm (inch)</td>
					<td
						>Snowfall amount of the preceding 15 minutes in centimeters. For the water equivalent in
						millimeter, divide by 7. E.g. 7 cm snow = 10 mm precipitation water equivalent</td
					>
				</tr>
				<tr>
					<th scope="row">rain</th>
					<td>Preceding 15 minutes sum</td>
					<td>mm (inch)</td>
					<td>Rain from large scale weather systems of the preceding 15 minutes in millimeter</td>
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
					<th scope="row">visibility</th>
					<td>Instant</td>
					<td>meters</td>
					<td
						>Viewing distance in meters. Influenced by low clouds, humidity and aerosols. Maximum
						visibility is approximately 24 km.</td
					>
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
			</tbody>
		</table>
	</div>

	<h3 class="mt-5">Pressure Level Variables</h3>
	<p>
		Pressure level variables do not have fixed altitudes. Altitude varies with atmospheric pressure.
		1000 hPa is roughly between 60 and 160 meters above sea level. Estimated altitudes are given
		below. Altitudes are in meters above sea level (not above ground). For precise altitudes, <mark
			>geopotential_height</mark
		> can be used.
	</p>
	<PressureLevelsHelpTable {levels} />

	<p>All pressure level have valid times of the indicated hour (instant).</p>
	<div class="table-responsive">
		<table class="table">
			<thead>
				<tr>
					<th scope="col">Variable</th>
					<th scope="col">Unit</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">weather_code</th>
					<td>WMO code</td>
					<td>The most severe weather condition on a given day</td>
				</tr>
				<tr>
					<th scope="row">temperature_1000hPa<br />temperature_975hPa, ...</th>
					<td>°C (°F)</td>
					<td
						>Air temperature at the specified pressure level. Air temperatures decrease linearly
						with pressure.</td
					>
				</tr>
				<tr>
					<th scope="row">relative_humidity_1000hPa<br />relative_humidity_975hPa, ...</th>
					<td>%</td>
					<td>Relative humidity at the specified pressure level.</td>
				</tr>
				<tr>
					<th scope="row">dew_point_1000hPa<br />dew_point_975hPa, ...</th>
					<td>°C (°F)</td>
					<td>Dew point temperature at the specified pressure level.</td>
				</tr>
				<tr>
					<th scope="row">cloud_cover_1000hPa<br />cloud_cover_975hPa, ...</th>
					<td>%</td>
					<td
						>Cloud cover at the specified pressure level. GFS is including parameterised cloud cover
						directly. HRRR cloud cover is approximated based on relative humidity using <a
							href="https://www.ecmwf.int/sites/default/files/elibrary/2005/16958-parametrization-cloud-cover.pdf"
							target="_blank">Sundqvist et al. (1989)</a
						>. It may not match perfectly with low, mid and high cloud cover variables.</td
					>
				</tr>
				<tr>
					<th scope="row">wind_speed_1000hPa<br />wind_speed_975hPa, ...</th>
					<td>km/h (mph, m/s, knots)</td>
					<td>Wind speed at the specified pressure level.</td>
				</tr>
				<tr>
					<th scope="row">wind_direction_1000hPa<br />wind_direction_975hPa, ...</th>
					<td>°</td>
					<td>Wind direction at the specified pressure level.</td>
				</tr>
				<tr>
					<th scope="row">geopotential_height_1000hPa<br />geopotential_height_975hPa, ...</th>
					<td>meter</td>
					<td
						>Geopotential height at the specified pressure level. This can be used to get the
						correct altitude in meter above sea level of each pressure level. Be carefull not to
						mistake it with altitude above ground.
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h3 class="mt-5">Daily Parameter Definition</h3>
	<p>
		Aggregations are a simple 24 hour aggregation from hourly values. The parameter <mark
			>&daily=</mark
		> accepts the following values:
	</p>
	<div class="table-responsive">
		<table class="table">
			<thead>
				<tr>
					<th scope="col">Variable</th>
					<th scope="col">Unit</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">temperature_2m_max<br />temperature_2m_min</th>
					<td>°C (°F)</td>
					<td>Maximum and minimum daily air temperature at 2 meters above ground</td>
				</tr>
				<tr>
					<th scope="row">apparent_temperature_max<br />apparent_temperature_min</th>
					<td>°C (°F)</td>
					<td>Maximum and minimum daily apparent temperature</td>
				</tr>
				<tr>
					<th scope="row">precipitation_sum</th>
					<td>mm</td>
					<td>Sum of daily precipitation (including rain, showers and snowfall)</td>
				</tr>
				<!--<tr>
              <th scope="row">rain_sum</th>
              <td>mm</td>
              <td>Sum of daily rain</td>
            </tr>
            <tr>
              <th scope="row">showers_sum</th>
              <td>mm</td>
              <td>Sum of daily showers</td>
            </tr>-->
				<tr>
					<th scope="row">snowfall_sum</th>
					<td>cm</td>
					<td>Sum of daily snowfall</td>
				</tr>
				<tr>
					<th scope="row">precipitation_hours</th>
					<td>hours</td>
					<td>The number of hours with rain</td>
				</tr>
				<tr>
					<th scope="row"
						>precipitation_probability_max<br />precipitation_probability_min<br
						/>precipitation_probability_mean</th
					>
					<td>%</td>
					<td>Probability of precipitation</td>
				</tr>
				<!--<tr>
              <th scope="row">weather_code</th>
              <td>WMO code</td>
              <td>The most severe weather condition on a given day</td>
            </tr>-->
				<tr>
					<th scope="row">sunrise<br />sunset</th>
					<td>iso8601</td>
					<td>Sun rise and set times</td>
				</tr>
				<tr>
					<th scope="row">wind_speed_10m_max<br />wind_gusts_10m_max</th>
					<td>km/h (mph, m/s, knots)</td>
					<td>Maximum wind speed and gusts on a day</td>
				</tr>
				<tr>
					<th scope="row">wind_direction_10m_dominant</th>
					<td>°</td>
					<td>Dominant wind direction</td>
				</tr>
				<tr>
					<th scope="row">shortwave_radiation_sum</th>
					<td>MJ/m²</td>
					<td>The sum of solar radiation on a given day in Megajoules</td>
				</tr>
				<tr>
					<th scope="row">et0_fao_evapotranspiration</th>
					<td>mm</td>
					<td>Daily sum of ET₀ Reference Evapotranspiration of a well watered grass field</td>
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
  "elevation": 44.812,
  "generationtime_ms": 2.2119,
  "utc_offset_seconds": 0,
  "timezone": "Europe/Berlin",
  "timezone_abbreviation": "CEST",
  "hourly": {
    "time": ["2022-07-01T00:00", "2022-07-01T01:00", "2022-07-01T02:00", ...],
    "temperature_2m": [13, 12.7, 12.7, 12.5, 12.5, 12.8, 13, 12.9, 13.3, ...]
  },
  "hourly_units": {
    "temperature_2m": "°C"
  }
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
					<th scope="row">elevation</th>
					<td>Floating point</td>
					<td
						>The elevation from a 90 meter digital elevation model. This effects which grid-cell is
						selected (see parameter <mark>cell_selection</mark>). Statistical downscaling is used to
						adapt weather conditions for this elevation. This elevation can also be controlled with
						the query parameter <mark>elevation</mark>. If <mark>&elevation=nan</mark> is specified,
						all downscaling is disabled and the averge grid-cell elevation is used.</td
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
				<tr>
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

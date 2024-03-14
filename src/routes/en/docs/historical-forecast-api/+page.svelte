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

	var d = new Date();
	d.setDate(d.getDate() - 2);
	let endDateDefault = d.toISOString().split('T')[0];
	d.setDate(d.getDate() - 14);
	let startDateDefault = d.toISOString().split('T')[0];
	let startDate = '1940-01-01';
	let endDate = '';

	const defaultParameter = {
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
		time_mode: 'time_interval',
		tilt: 0,
		azimuth: 0,
		models: [],
	};

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		start_date: startDateDefault,
		end_date: endDateDefault,
		...defaultParameter,
		hourly: ['temperature_2m']
	});

	onMount(async () => {
		var d = new Date();
		endDate = d.toISOString().split('T')[0];
		d.setDate(d.getDate() - 1);
		$params.end_date = d.toISOString().split('T')[0];
		d.setDate(d.getDate() - 14);
		$params.start_date = d.toISOString().split('T')[0];
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
			{ name: 'wind_speed_120m', label: 'Wind Speed (120 m)' },
			{ name: 'wind_speed_180m', label: 'Wind Speed (180 m)' },
			{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
			{ name: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
			{ name: 'wind_direction_120m', label: 'Wind Direction (120 m)' },
			{ name: 'wind_direction_180m', label: 'Wind Direction (180 m)' },
			{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
			{ name: 'temperature_80m', label: 'Temperature (80 m)' },
			{ name: 'temperature_120m', label: 'Temperature (120 m)' },
			{ name: 'temperature_180m', label: 'Temperature (180 m)' }
		],
		[
			{ name: 'soil_temperature_0cm', label: 'Soil Temperature (0 cm)' },
			{ name: 'soil_temperature_6cm', label: 'Soil Temperature (6 cm)' },
			{ name: 'soil_temperature_18cm', label: 'Soil Temperature (18 cm)' },
			{ name: 'soil_temperature_54cm', label: 'Soil Temperature (54 cm)' },
			{ name: 'soil_moisture_0_to_1cm', label: 'Soil Moisture (0-1 cm)' },
			{ name: 'soil_moisture_1_to_3cm', label: 'Soil Moisture (1-3 cm)' },
			{ name: 'soil_moisture_3_to_9cm', label: 'Soil Moisture (3-9 cm)' },
			{ name: 'soil_moisture_9_to_27cm', label: 'Soil Moisture (9-27 cm)' },
			{ name: 'soil_moisture_27_to_81cm', label: 'Soil Moisture (27-81 cm)' }
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
			{ name: 'snowfall', label: 'Snowfall' },
			{ name: 'snowfall_height', label: 'Snowfall Height' },
			{ name: 'freezing_level_height', label: 'Freezing Level Height' },
			{ name: 'sunshine_duration', label: 'Sunshine Duration' }
		],
		[
			{ name: 'weather_code', label: 'Weather code' },
			{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
			{ name: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
			{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
			{ name: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
			{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
			{ name: 'visibility', label: 'Visibility' },
			{ name: 'cape', label: 'CAPE' },
			{ name: 'lightning_potential', label: 'Lightning Potential Index LPI' },
			{ name: 'is_day', label: 'Is Day or Night' }
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
			{ name: 'daylight_duration', label: 'Daylight Duration' },
			{ name: 'sunshine_duration', label: 'Sunshine Duration' },
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
			{ name: 'freezing_level_height', label: 'Freezing Level Height' },
			{ name: 'sunshine_duration', label: 'Sunshine Duration' },
		]
	];

	const solarVariables = [
		[
			{ name: 'shortwave_radiation', label: 'Shortwave Solar Radiation GHI' },
			{ name: 'direct_radiation', label: 'Direct Solar Radiation' },
			{ name: 'diffuse_radiation', label: 'Diffuse Solar Radiation DHI' },
			{ name: 'direct_normal_irradiance', label: 'Direct Normal Irradiance DNI' },
			{ name: 'global_tilted_irradiance', label: 'Global Tilted Radiation GTI' },
			{ name: 'terrestrial_radiation', label: 'Terrestrial Solar Radiation' }
		],
		[
			{ name: 'shortwave_radiation_instant', label: 'Shortwave Solar Radiation GHI (Instant)' },
			{ name: 'direct_radiation_instant', label: 'Direct Solar Radiation (Instant)' },
			{ name: 'diffuse_radiation_instant', label: 'Diffuse Solar Radiation DHI (Instant)' },
			{ name: 'direct_normal_irradiance_instant', label: 'Direct Normal Irradiance DNI (Instant)' },
			{ name: 'global_tilted_irradiance_instant', label: 'Global Tilted Radiation GTI' },
			{ name: 'terrestrial_radiation_instant', label: 'Terrestrial Solar Radiation (Instant)' }
		]
	];

	const models = [
		[
			{ name: 'best_match', label: 'Best match' },
			{ name: 'ecmwf_ifs04', label: 'ECMWF IFS 0.4°' },
			{ name: 'ecmwf_ifs025', label: 'ECMWF IFS 0.25°' },
			{ name: 'cma_grapes_global', label: 'CMA GRAPES Global' },
			{ name: 'bom_access_global', label: 'BOM ACCESS Global' },
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
			{ name: 'icon_seamless', label: 'DWD ICON Seamless' },
			{ name: 'icon_global', label: 'DWD ICON Global' },
			{ name: 'icon_eu', label: 'DWD ICON EU' },
			{ name: 'icon_d2', label: 'DWD ICON D2' }
		],
		[
			{ name: 'gem_seamless', label: 'GEM Seamless' },
			{ name: 'gem_global', label: 'GEM Global' },
			{ name: 'gem_regional', label: 'GEM Regional' },
			{ name: 'gem_hrdps_continental', label: 'GEM HRDPS Continental' }
		],
		[
			{ name: 'meteofrance_seamless', label: 'Météo-France Seamless' },
			{ name: 'meteofrance_arpege_world', label: 'Météo-France ARPEGE World' },
			{ name: 'meteofrance_arpege_europe', label: 'Météo-France ARPEGE Europe' },
			{ name: 'meteofrance_arome_france', label: 'Météo-France AROME France' },
			{ name: 'meteofrance_arome_france_hd', label: 'Météo-France AROME France HD' }
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
	<title>Historical Forecast API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/historical-forecast-api" />
</svelte:head>

<div class="alert alert-warning" role="alert">
	Work in progress. This API offers access to <strong>archived</strong> high resolution weather forecasts. Data is only updated once per day. This API is similar to the regular Weather Forecast API, but retains more than 90 days of past data.
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
		<div class="col-md-6 mb-3">
			<StartEndDate
				bind:start_date={$params.start_date}
				bind:end_date={$params.end_date}
				{startDate}
				{endDate}
			/>
		</div>
		<div class="col-md-6">
			<p>
				Past weather forecasts from 2022 onwards are available.
			</p>
			<p>
				Quick:
				<!--<button
					class="btn btn-outline-primary btn-sm"
					on:click|preventDefault={() => (
						($params.start_date = '2020-01-01'), ($params.end_date = '2020-12-31')
					)}>2020</button
				>
				<button
					class="btn btn-outline-primary btn-sm"
					on:click|preventDefault={() => (
						($params.start_date = '2021-01-01'), ($params.end_date = '2021-12-31')
					)}>2021</button
				>-->
				<button
					class="btn btn-outline-primary btn-sm"
					on:click|preventDefault={() => (
						($params.start_date = '2022-01-01'), ($params.end_date = '2022-12-31')
					)}>2022</button
				>
				<button
				class="btn btn-outline-primary btn-sm"
				on:click|preventDefault={() => (
					($params.start_date = '2023-01-01'), ($params.end_date = '2023-12-31')
				)}>2023</button
			>
			</p>
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
						<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI please specify Tilt and Azimuth below.</small
					>
				</div>
				<div class="col-md-3">
					<div class="form-floating">
						<input
							type="number"
							class="form-control"
							class:is-invalid={$params.tilt < 0 ||$params.tilt > 90}
							name="tilt"
							id="tilt"
							step="1"
							min="0"
							max="90"
							bind:value={$params.tilt}
						/>
						<label for="latitude">Panel Tilt (0° horizontal)</label>
						{#if $params.tilt < 0 ||$params.tilt > 90 }
							<div class="invalid-tooltip" transition:slide>
								Tilt must be between 0° and 90°
							</div>
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
						<label for="latitude">Panel Azimuth (0° S, -90° E, 90° W)</label>
						{#if Number($params.azimuth) < -180 || Number($params.azimuth) > 180 }
							<div class="invalid-tooltip" transition:slide>
								Azimuth must be between -90° (east) and 90° (west)
							</div>
						{/if}
					</div>
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
				<div class="col-md-12 mb-3">
					<small class="text-muted"
						>Note: Only available in Central Europe and North America. Other regions use interpolated hourly data. Solar radiation is averaged over the 15 minutes. Use
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

<ResultPreview {params} {defaultParameter} type="historical-forecast" useStockChart={true}/>

<div class="col-12 py-5">
	<h2 id="data-sources">Data Source</h2>
	<p>
		Weather models cover different geographic areas at different resolutions and provide different
		weather variables. Depending on the model, data have been interpolated to hourly values or not
		all weather variables are available. With the drop down <mark>Weather models</mark> (just below the
		hourly variables), you can select and compare individual weather models.
	</p>
	<p>The default <mark>Best Match</mark> selects the best suitable high resolution weather models for any location worldwide.</p>
	<div class="table-responsive">
		<table class="table">
			<thead>
				<tr>
					<th scope="col">National Weather Provider</th>
					<th scope="col">Weather Model</th>
					<th scope="col">Region</th>
					<th scope="col">Spatial Resolution</th>
					<th scope="col">Temporal Resolution</th>
					<th scope="col">Update Frequency</th>
					<th scope="col">Available Since</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row" rowspan="3">Deutscher Wetterdienst (DWD)</th>
					<td>ICON</td>
					<td>Global</td>
					<td>0.1° (~11 km)</td>
					<td>1-Hourly</td>
					<td>Every 6 hours</td>
					<td>2022-11-24</td>
				</tr>
				<tr>
					<td>ICON-EU</td>
					<td>Europe</td>
					<td>0.0625° (~7 km)</td>
					<td>1-Hourly</td>
					<td>Every 3 hours</td>
					<td>2022-11-24</td>
				</tr>
				<tr>
					<td>ICON-D2</td>
					<td>Central Europe</td>
					<td>0.02° (~2 km)</td>
					<td>1-Hourly</td>
					<td>Every 3 hours</td>
					<td>2022-11-24</td>
				</tr>
				<tr>
					<th scope="row" rowspan="3">NOAA NCEP</th>
					<td>GFS</td>
					<td>Global</td>
					<td>0.11° (~13 km)</td>
					<td>1-Hourly</td>
					<td>Every 6 hours</td>
					<td>2021-03-23</td>
				</tr>
				<tr>
					<td>GFS Pressure Variables</td>
					<td>Global</td>
					<td>0.25° (~25 km)</td>
					<td>1-Hourly</td>
					<td>Every 6 hours</td>
					<td>2021-03-23</td>
				</tr>
				<tr>
					<td>HRRR</td>
					<td>U.S. Conus</td>
					<td>3 km</td>
					<td>1-Hourly</td>
					<td>Every hour</td>
					<td>2021-03-23</td>
				</tr>
				<tr>
					<th scope="row" rowspan="4">Météo-France</th>
					<td>ARPEGE World</td>
					<td>Global</td>
					<td>0.25° (~25 km)</td>
					<td>1-Hourly</td>
					<td>Every 6 hours</td>
					<td>2014-01-02</td>
				</tr>
				<tr>
					<td>ARPEGE Europe</td>
					<td>Europe</td>
					<td>0.1° (~11 km)</td>
					<td>1-Hourly</td>
					<td>Every 6 hours</td>
					<td>2022-11-13</td>
				</tr>
				<tr>
					<td>AROME France</td>
					<td>Global</td>
					<td>0.025° (~2.5 km)</td>
					<td>1-Hourly</td>
					<td>Every 3 hours</td>
					<td>2014-01-02</td>
				</tr>
				<tr>
					<td>AROME France HD</td>
					<td>Global</td>
					<td>0.01° (~1.5 km)</td>
					<td>1-Hourly</td>
					<td>Every 3 hours</td>
					<td>2022-11-13</td>
				</tr>
				<tr>
					<th scope="row" rowspan="2">ECMWF</th>
					<td>IFS 0.4°</td>
					<td>Global</td>
					<td>0.4° (~44 km)</td>
					<td>3-Hourly</td>
					<td>Every 6 hours</td>
					<td>2022-11-07</td>
				</tr>
				<tr>
					<td>IFS 0.25°</td>
					<td>Global</td>
					<td>0.25° (~25 km)</td>
					<td>3-Hourly</td>
					<td>Every 6 hours</td>
					<td>2024-02-03</td>
				</tr>
				<tr>
					<th scope="row" rowspan="2">JMA</th>
					<td>GSM</td>
					<td>Global</td>
					<td>0.5° (~55 km)</td>
					<td>6-Hourly</td>
					<td>Every 6 hours</td>
					<td>2016-01-01</td>
				</tr>
				<tr>
					<td>MSM</td>
					<td>Japan</td>
					<td>0.05° (~5 km)</td>
					<td>1-Hourly</td>
					<td>Every 3 hours</td>
					<td>2016-01-01</td>
				</tr>
				<tr>
					<th scope="row">MET Norway</th>
					<td>MET Nordic</td>
					<td>Norway, Denmark, Sweden, Finland</td>
					<td>1 km</td>
					<td>1-Hourly</td>
					<td>Every hour</td>
					<td>2022-11-15</td>
				</tr>
				<tr>
					<th scope="row" rowspan="3">Canadian Weather Service</th>
					<td>GEM Global</td>
					<td>Global</td>
					<td>0.15° (~15 km)</td>
					<td>3-Hourly</td>
					<td>Every 12 hours</td>
					<td>2022-11-23</td>
				</tr>
				<tr>
					<td>GEM Regional</td>
					<td>North America, North Pole</td>
					<td>10 km</td>
					<td>1-Hourly</td>
					<td>Every 6 hours</td>
					<td>2022-11-23</td>
				</tr>
				<tr>
					<td>HRDPS Continental</td>
					<td>Canada, Nothern US</td>
					<td>2.5 km</td>
					<td>1-Hourly</td>
					<td>Every 6 hours</td>
					<td>2023-03-03</td>
				</tr>
				<tr>
					<th scope="row">China Meteorological Administration (CMA)</th>
					<td>GFS GRAPES</td>
					<td>Global</td>
					<td>0.125° (~15 km)</td>
					<td>3-hourly</td>
					<td>Every 6 hours</td>
					<td>2023-12-31</td>
				</tr>
				<tr>
					<th scope="row">Australian Bureau of Meteorology (BOM)</th>
					<td>ACCESS-G</td>
					<td>Global</td>
					<td>0.15° (~15 km)</td>
					<td>1-Hourly</td>
					<td>Every 6 hours</td>
					<td>2024-01-18</td>
				</tr>
				<tr>
					<th scope="row" rowspan="3">COSMO 2I & 5M  AM ARPAE ARPAP Italy</th>
					<td>COSMO 5M</td>
					<td>Europe</td>
					<td>5 km</td>
					<td>1-Hourly</td>
					<td>Every 12 hours</td>
					<td>2024-02-01</td>
				</tr>
				<tr>
					<td>COSMO 2I</td>
					<td>Italy</td>
					<td>2.2 km</td>
					<td>1-Hourly</td>
					<td>Every 12 hours</td>
					<td>2024-02-01</td>
				</tr>
				<tr>
					<td>COSMO 2I RUC</td>
					<td>Italy</td>
					<td>2.2 km</td>
					<td>1-Hourly</td>
					<td>Every 3 hours</td>
					<td>2024-02-01</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<div class="alert alert-warning" role="alert">Documentation work in progress</div>
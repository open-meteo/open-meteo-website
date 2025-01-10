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
	import { fade, slide } from 'svelte/transition';
	import CalendarEvent from 'svelte-bootstrap-icons/lib/CalendarEvent.svelte';
	import Clock from 'svelte-bootstrap-icons/lib/Clock.svelte';
	import StartEndDate from '../StartEndDate.svelte';
	import LocationSelection from '../LocationSelection.svelte';

	const defaultParameter = {
		hourly: [],
		daily: [],
		location_mode: 'location_search',
		csv_coordinates: '',
		temperature_unit: 'celsius',
		wind_speed_unit: 'kmh',
		precipitation_unit: 'mm',
		timeformat: 'iso8601',
		timezone: 'UTC',
		past_days: '0',
		past_hours: '',
		past_minutely_15: '',
		forecast_days: '7',
		forecast_hours: '',
		forecast_minutely_15: '',
		temporal_resolution: '',
		start_date: '',
		end_date: '',
		tilt: 0,
		azimuth: 0,
		time_mode: 'forecast_days',
		models: [],
		cell_selection: ''
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
		{ name: 'wind_speed', label: 'Wind Speed' },
		{ name: 'wind_direction', label: 'Wind Direction' },
		{ name: 'geopotential_height', label: 'Geopotential Height' }
	];
	const levels = [300, 500, 700, 850, 925].reverse();

	let pressureVariablesTab = $state('temperature');

	let timezoneInvalid = $derived($params.timezone == 'UTC' && $params.daily.length > 0);

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
			{ name: 'visibility', label: 'Visibility' },
			{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
			{ name: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
		],
		[
			{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
			{ name: 'wind_speed_50m', label: 'Wind Speed (50 m)' },
			{ name: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
			{ name: 'wind_speed_200m', label: 'Wind Speed (200 m)' },
			{ name: 'wind_speed_300m', label: 'Wind Speed (300 m)' },
			{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
			{ name: 'wind_direction_50m', label: 'Wind Direction (50 m)' },
			{ name: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
			{ name: 'wind_direction_200m', label: 'Wind Direction (200 m)' },
			{ name: 'wind_direction_300m', label: 'Wind Direction (300 m)' },
			{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
		],
		[
			{ name: 'surface_temperature', label: 'Surface Temperature' },
			{ name: 'temperature_50m', label: 'Temperature (5 m)' },
			{ name: 'temperature_100m', label: 'Temperature (100 m)' },
			{ name: 'temperature_200m', label: 'Temperature (200 m)' },
			{ name: 'temperature_300m', label: 'Temperature (300 m)' }
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
			{ name: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
			{ name: 'wind_gusts_10m_max', label: 'Maximum Wind Gusts (10 m)' },
			{ name: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' },
			{ name: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' },
			{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' }
		]
	];

	const additionalVariables = [
		[
			{ name: 'is_day', label: 'Is Day or Night' },
			{ name: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
		],
		[{ name: 'sunshine_duration', label: 'Sunshine Duration' }]
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
			{ name: 'knmi_seamless', label: 'KNMI Seamless (with ECMWF)' },
			{ name: 'knmi_harmonie_arome_europe', label: 'KNMI Harmonie Arome Europe' },
			{ name: 'knmi_harmonie_arome_netherlands', label: 'KNMI Harmonie Arome Netherlands' }
		]
	];
</script>

<svelte:head>
	<title>KNMI Weather Model API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/knmi-api" />
</svelte:head>

<form method="get" action="https://api.open-meteo.com/v1/knmi">
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
									<option value="3">3 days</option>
									<option value="7">7 days (default)</option>
									<option value="10">10 days</option>
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
								onclick={() => (pressureVariablesTab = variable.name)}>{variable.label}</button
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

<ResultPreview {params} {defaultParameter} model_default="knmi_seamless" />

<div class="col-12 py-5">
	<h2 id="data-sources">Data Source</h2>
	<p>
		KNMI provides weather forecasts from the HARMONIE AROME model with ECMWF IFS initialization.
		This is a collaboration of multiple European national weather services under the name "United
		Weather Centres-West" (UWC-West). Two model configuration one for Europe (5.5 km resolution) and
		an inset for the Netherlands (2 km resolution) are available. All data is updated hourly and
		provides forecast for up to 2.5 days. After 2.5 days, Open-Meteo combines forecasts with the <a
			href="/en/docs/ecmwf-api">ECMWF IFS 0.25° model</a
		> to provide up to 10 days of forecast.
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
						><a
							href="https://dataplatform.knmi.nl/dataset/harmonie-arome-cy43-p1-1-0"
							target="_blank">KNMI HARMONIE AROME Netherlands</a
						></th
					>
					<td>Netherlands, Belgium</td>
					<td>2 km</td>
					<td>1-hourly</td>
					<td>2.5 days</td>
					<td>Every hour</td>
				</tr>
				<tr>
					<th scope="row"
						><a
							href="https://dataplatform.knmi.nl/dataset/harmonie-arome-cy43-p3-1-0"
							target="_blank">KNMI HARMONIE AROME Europe</a
						></th
					>
					<td>Central & Northern Europe up to Iceland</td>
					<td>5.5 km</td>
					<td>1-hourly</td>
					<td>2.5 days</td>
					<td>Every hour</td>
				</tr>
			</tbody>
		</table>
	</div>

	<figure class="figure">
		<img src="/images/models/knmi_harmonie.webp" class="figure-img img-fluid rounded" alt="..." />
		<figcaption class="figure-caption">
			KNMI HARMONIE AROME model area Europe (blue/red) and Netherlands nest (green). Source: <a
				href="https://english.knmidata.nl/latest/newsletters/open-data-newsletter/2024/open-data-march-2024"
				>KMNI Blog</a
			>.
		</figcaption>
	</figure>

	<h2 id="api-documentation" class="mt-5">API Documentation</h2>
	<p>
		For a detailed list of all available weather variables please refer to the general <a
			href="/en/docs">Weather Forecast API</a
		>. Only notable remarks are listed below
	</p>
	<ul>
		<li>
			<strong>Solar Radiation:</strong> KNMI supplies only global solar radiation data and does not
			offer direct or diffuse solar radiation. Open-Meteo applies the separation model from
			<a
				href="https://www.ise.fraunhofer.de/content/dam/ise/de/documents/publications/conference-paper/36-eupvsec-2019/Guzman_5CV31.pdf"
				>Razo, Müller Witwer</a
			> to calculate direct radiation from shortwave solar radiation.
		</li>
		<li>
			<strong>Wind Direction Correction:</strong> Wind direction has been calculated from U/V wind
			component vectors. Special care has been taken to correct for the
			<mark>Rotated Lat Long</mark> projection. Without this correction, wind directions have an error
			of up to 15°.
		</li>
		<li>
			<strong>Wind on 50, 100, 200, 300m:</strong> Wind forecasts for higher altitudes are only available
			for the Netherlands area.
		</li>
		<li>
			<strong>Pressure Level Data:</strong> Forecasts on pressure level are only available for the European
			model.
		</li>
	</ul>
</div>

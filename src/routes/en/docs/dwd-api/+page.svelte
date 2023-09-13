<script lang="ts">
	import LicenseSelector from '../LicenseSelector.svelte';
	import PressureLevelsHelpTable from '../PressureLevelsHelpTable.svelte';
	import LocationSearch from '../LocationSearch.svelte';
	import type { GeoLocation } from '$lib/stores';
	import ResultPreview from '../ResultPreview.svelte';
	import { urlHashStore } from '$lib/url-hash-store';
	import {
		altitudeAboveSeaLevelMeters,
		countPressureVariables,
		countVariables,
		sliceIntoChunks
	} from '$lib/meteo';
	import AccordionItem from '$lib/Elements/AccordionItem.svelte';
	import SveltyPicker from 'svelty-picker';
	import { fade, slide } from 'svelte/transition';
	import { PlusLg, Trash } from 'svelte-bootstrap-icons';

	const defaultParameter = {
		hourly: [],
		daily: [],
		minutely_15: [],
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
		hourly: ['temperature_2m']
	});

	// Date picker is using an array. Keep date pcker and start and end_date in sync
	let time_interval = [$params.start_date, $params.end_date];
	$: ((time_interval) => {
		$params.start_date = time_interval[0];
		$params.end_date = time_interval[1];
	})(time_interval);

	params.subscribe((params) => {
		if (params.start_date != time_interval[0] || params.end_date != time_interval[1]) {
			time_interval = [params.start_date, params.end_date];
		}
	});

	const pressureVariables = [
		{ name: 'temperature', label: 'Temperature' },
		{ name: 'relativehumidity', label: 'Relative Humidity' },
		{ name: 'cloudcover', label: 'Cloudcover' },
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
			{ name: 'relativehumidity_2m', label: 'Relative Humidity (2 m)' },
			{ name: 'dewpoint_2m', label: 'Dewpoint (2 m)' },
			{ name: 'apparent_temperature', label: 'Apparent Temperature' },
			//{ name: 'precipitation_probability', label: 'Precipitation Probability' },
			{ name: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
			{ name: 'rain', label: 'Rain' },
			{ name: 'showers', label: 'Showers' },
			{ name: 'snowfall', label: 'Snowfall' },
			{ name: 'snow_depth', label: 'Snow Depth' }
		],
		[
			{ name: 'weathercode', label: 'Weathercode' },
			{ name: 'pressure_msl', label: 'Sealevel Pressure' },
			{ name: 'surface_pressure', label: 'Surface Pressure' },
			{ name: 'cloudcover', label: 'Cloudcover Total' },
			{ name: 'cloudcover_low', label: 'Cloudcover Low' },
			{ name: 'cloudcover_mid', label: 'Cloudcover Mid' },
			{ name: 'cloudcover_high', label: 'Cloudcover High' },
			//{ name: 'visibility', label: 'Visibility' },
			{ name: 'evapotranspiration', label: 'Evapotranspiration' },
			{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
			{ name: 'vapor_pressure_deficit', label: 'Vapor Pressure Deficit' }
		],
		[
			{ name: 'windspeed_10m', label: 'Wind Speed (10 m)' },
			{ name: 'windspeed_80m', label: 'Wind Speed (80 m)' },
			{ name: 'windspeed_120m', label: 'Wind Speed (120 m)' },
			{ name: 'windspeed_180m', label: 'Wind Speed (180 m)' },
			{ name: 'winddirection_10m', label: 'Wind Direction (10 m)' },
			{ name: 'winddirection_80m', label: 'Wind Direction (80 m)' },
			{ name: 'winddirection_120m', label: 'Wind Direction (120 m)' },
			{ name: 'winddirection_180m', label: 'Wind Direction (180 m)' },
			{ name: 'windgusts_10m', label: 'Wind Gusts (10 m)' },
			{ name: 'temperature_80m', label: 'Temperature (80 m)' },
			{ name: 'temperature_120m', label: 'Temperature (120 m)' },
			{ name: 'temperature_180m', label: 'Temperature (180 m)' }
		],
		[
			{ name: 'soil_temperature_0cm', label: 'Soil Temperature (0 cm)' },
			{ name: 'soil_temperature_6cm', label: 'Soil Temperature (6 cm)' },
			{ name: 'soil_temperature_18cm', label: 'Soil Temperature (18 cm)' },
			{ name: 'soil_temperature_54cm', label: 'Soil Temperature (54 cm)' },
			{ name: 'soil_moisture_0_1cm', label: 'Soil Moisture (0-1 cm)' },
			{ name: 'soil_moisture_1_3cm', label: 'Soil Moisture (1-3 cm)' },
			{ name: 'soil_moisture_3_9cm', label: 'Soil Moisture (3-9 cm)' },
			{ name: 'soil_moisture_9_27cm', label: 'Soil Moisture (9-27 cm)' },
			{ name: 'soil_moisture_27_81cm', label: 'Soil Moisture (27-81 cm)' }
		]
	];

	const minutely_15 = [
		[
			{ name: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
			{ name: 'rain', label: 'Rain' },
			{ name: 'snowfall', label: 'Snowfall' },
			{ name: 'snowfall_height', label: 'Snowfall Height' },
			{ name: 'freezinglevel_height', label: 'Freezinglevel Height' }
		],
		[
			{ name: 'cape', label: 'CAPE' },
			{ name: 'lightning_potential', label: 'Lightning Potential Index LPI' }
		]
	];

	const daily = [
		[
			{ name: 'weathercode', label: 'Weathercode' },
			{ name: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
			{ name: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
			{ name: 'apparent_temperature_max', label: 'Maximum Apparent Temperature (2 m)' },
			{ name: 'apparent_temperature_min', label: 'Minimum Apparent Temperature (2 m)' },
			{ name: 'sunrise', label: 'Sunrise' },
			{ name: 'sunset', label: 'Sunset' },
		],
		[
			{ name: 'precipitation_sum', label: 'Precipitation Sum' },
			{ name: 'rain_sum', label: 'Rain Sum' },
			{ name: 'showers_sum', label: 'Showers Sum' },
			{ name: 'snowfall_sum', label: 'Snowfall Sum' },
			{ name: 'precipitation_hours', label: 'Precipitation Hours' },
			{ name: 'precipitation_probability_max', label: 'Precipitation Probability Max' },
			{ name: 'windspeed_10m_max', label: 'Maximum Wind Speed (10 m)' },
			{ name: 'windgusts_10m_max', label: 'Maximum Wind Gusts (10 m)' },
			{ name: 'winddirection_10m_dominant', label: 'Dominant Wind Direction (10 m)' },
			{ name: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' },
			{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' }
		]
	];

	const additionalVariables = [
		[
			{ name: 'is_day', label: 'Is Day or Night' },
			{ name: 'lightning_potential', label: 'Lightning Potential Index LPI (2)' },
			{ name: 'updraft', label: 'Updraft (2)' }
		],
		[
			{ name: 'cape', label: 'CAPE' },
			{ name: 'freezinglevel_height', label: 'Freezinglevel Height' },
			{ name: 'snowfall_height', label: 'Snowfall Height (1)' }
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

	function locationCallback(event: CustomEvent<GeoLocation>, index: number) {
		const latitude = Number(event.detail.latitude.toFixed(4));
		const longitude = Number(event.detail.longitude.toFixed(4));
		$params.latitude = $params.latitude.toSpliced(index, 1, latitude);
		$params.longitude = $params.longitude.toSpliced(index, 1, longitude);
	}
	function addLocation() {
		$params.latitude = [...$params.latitude, NaN];
		$params.longitude = [...$params.longitude, NaN];
	}
	function removeLocation(index: number) {
		$params.latitude = $params.latitude.toSpliced(index, 1);
		$params.longitude = $params.longitude.toSpliced(index, 1);
	}
</script>

<svelte:head>
	<title>DWD ICON API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/dwd-api" />
</svelte:head>

<div class="alert alert-primary" role="alert">
	This API offers access to the renowned ICON weather models from the German Weather service DWD,
	delivering 15-minutely data for short-term forecasts in central Europe and 11 km resolution global
	forecasts. The ICON model is a preferred choice in <a href="/en/docs"
		>generic weather forecast API</a
	> if no other high resolution weather models are available.
</div>

<form method="get" action="https://api.open-meteo.com/v1/dwd-icon">
	<div class="row">
		<h2>Select Coordinates or City</h2>
		{#each $params.latitude as _, index}
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
						bind:value={$params.latitude[index]}
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
						bind:value={$params.longitude[index]}
					/>
					<label for="longitude">Longitude</label>
				</div>
			</div>
			<div class="col-md-5">
				<LocationSearch on:location={(event) => locationCallback(event, index)} />
			</div>
			{#if index == 0}
				<div class="col-md-1">
					<button
						type="button"
						class="btn btn-outline-secondary w-100 p-3"
						on:click={addLocation}
						title="Add coordinates"><PlusLg /></button
					>
				</div>
			{:else}
				<div class="col-md-1">
					<button
						type="button"
						class="btn btn-outline-secondary w-100 p-3"
						on:click={() => removeLocation(index)}
						title="Delete coordinates"><Trash /></button
					>
				</div>
			{/if}
		{/each}
	</div>

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
						on:click={() => ($params.time_mode = 'forecast_days')}>Forecast Length</button
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
						aria-selected="true">Time Interval</button
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
									<option value="7">7 days (default)</option>
									<option value="8">8 days</option>
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
						<div class="col-md-3">
							<div class="form-floating mb-3">
								<input
									type="text"
									class="form-control"
									name="start_date"
									id="start_date"
									bind:value={$params.start_date}
								/>
								<label for="time_istart_dateterval">Start Date</label>
							</div>
							<div class="form-floating mb-3">
								<input
									type="text"
									class="form-control"
									name="end_date"
									id="end_date"
									bind:value={$params.end_date}
								/>
								<label for="end_date">End Date</label>
							</div>
						</div>
						<div class="col-md-9 mb-3">
							<SveltyPicker
								inputClasses="form-select"
								name="time_interval"
								pickerOnly={true}
								todayBtn={false}
								clearBtn={false}
								theme="dark"
								isRange
								mode="date"
								bind:value={time_interval}
							/>
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
				<small class="text-muted mt-3">(1) Europe only, (2) Central Europe only</small>
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
		</div>
	</div>

	<div class="row py-3 px-0">
		<h2>15-Minutely Weather Variables <small class="text-muted">(*)</small></h2>
		{#each minutely_15 as group}
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
		<small class="text-muted"
			>* Only available in Central Europe (otherwise just interpolated data) and limited to 3 days
			of forecast</small
		>
	</div>

	<div class="row py-3 px-0">
		<div class="accordion" id="accordionVariables">
			<AccordionItem
				id="solar-variables"
				title="Solar Radiation Variables"
				count={countVariables(solarVariables, $params.minutely_15)}
			>
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
						>Note: Solar radiation is averaged over the past hour. Use
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
    <div class="col-md-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
					class:is-invalid={timezoneInvalid}
					name="timezone"
					id="timezone"
					aria-label="Timezone"
					bind:value={$params.timezone}
				>
					<option value="America/Anchorage">America/Anchorage</option>
					<option value="America/Los_Angeles">America/Los_Angeles</option>
					<option value="America/Denver">America/Denver</option>
					<option value="America/Chicago">America/Chicago</option>
					<option value="America/New_York">America/New_York</option>
					<option value="America/Sao_Paulo">America/Sao_Paulo</option>
					<option value="UTC">Not set (GMT+0)</option>
					<option value="GMT">GMT+0</option>
					<option value="auto">Automatically detect time zone</option>
					<option value="Europe/London">Europe/London</option>
					<option value="Europe/Berlin">Europe/Berlin</option>
					<option value="Europe/Moscow">Europe/Moscow</option>
					<option value="Africa/Cairo">Africa/Cairo</option>
					<option value="Asia/Bangkok">Asia/Bangkok</option>
					<option value="Asia/Singapore">Asia/Singapore</option>
					<option value="Asia/Tokyo">Asia/Tokyo</option>
					<option value="Australia/Sydney">Australia/Sydney</option>
					<option value="Pacific/Auckland">Pacific/Auckland</option>
				</select>
				<label for="timezone">Timezone</label>
				{#if timezoneInvalid}
					<div class="invalid-tooltip" transition:slide|global>
						Timezone is required for daily variables
					</div>
				{/if}
			</div>
		</div>
	</div>

	<LicenseSelector />
</form>

<ResultPreview {params} {defaultParameter} action="dwd-icon" />

<div class="col-12 py-5">
	<h2 id="data-sources">Data Source</h2>
	<p>
		This API uses global DWD ICON weather forecast and combines them with high-resolution ICON
		Europe and Central Europe forecasts. Information about DWD wearther models is available <a
			href="https://www.dwd.de/EN/ourservices/nwp_forecast_data/nwp_forecast_data.html"
			target="_blank">here</a
		>. For ICON Global and Europe, values are interpolated from 3-hourly to 1-hourly after 78 hours.
		15-minutely data is only available for a small number of weather variables and only in Central
		Europe.
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
					<th scope="row">ICON Global</th>
					<td>Global</td>
					<td>0.1° (~11 km)</td>
					<td>Hourly<small class="text-muted">, 3-hourly after 78 hours</small></td>
					<td>7.5 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row">ICON Europe</th>
					<td>Europe</td>
					<td>0.0625° (~7 km)</td>
					<td>Hourly<small class="text-muted">, 3-hourly after 78 hours</small></td>
					<td>5 days</td>
					<td>Every 3 hours</td>
				</tr>
				<tr>
					<th scope="row">ICON D2</th>
					<td>Central Europe</td>
					<td>0.02° (~2 km)</td>
					<td>15-Minutely</td>
					<td>2 days</td>
					<td>Every 3 hours</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2 id="api-documentation" class="mt-5">API Documentation</h2>
	<p>
		The API endpoint <mark>/v1/dwd-icon</mark> accepts a geographical coordinate, a list of weather variables
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
					<th scope="row">minutely_15</th>
					<td>String array</td>
					<td>No</td>
					<td />
					<td
						>A list of weather variables which should be returned. Values can be comma separated, or
						multiple
						<mark>&minutely_15=</mark> parameter in the URL can be used.
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
					<th scope="row">current_weather</th>
					<td>Bool</td>
					<td>No</td>
					<td><mark>false</mark></td>
					<td>Include current weather conditions in the JSON output.</td>
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
					<th scope="row">cloudcover</th>
					<td>Instant</td>
					<td>%</td>
					<td>Total cloud cover as an area fraction</td>
				</tr>
				<tr>
					<th scope="row">cloudcover_low</th>
					<td>Instant</td>
					<td>%</td>
					<td>Low level clouds and fog up to 3 km altitude</td>
				</tr>
				<tr>
					<th scope="row">cloudcover_mid</th>
					<td>Instant</td>
					<td>%</td>
					<td>Mid level clouds from 3 to 8 km altitude</td>
				</tr>
				<tr>
					<th scope="row">cloudcover_high</th>
					<td>Instant</td>
					<td>%</td>
					<td>High level clouds from 8 km altitude</td>
				</tr>
				<tr>
					<th scope="row"
						>windspeed_10m<br />windspeed_80m<br />windspeed_120m<br />windspeed_180m</th
					>
					<td>Instant</td>
					<td>km/h (mph, m/s, knots)</td>
					<td
						>Wind speed at 10, 80, 120 or 180 meters above ground. Wind speed on 10 meters is the
						standard level.
					</td>
				</tr>
				<tr>
					<th scope="row"
						>winddirection_10m<br />winddirection_80m<br />winddirection_120m<br
						/>winddirection_180m</th
					>
					<td>Instant</td>
					<td>°</td>
					<td>Wind direction at 10, 80, 120 or 180 meters above ground</td>
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
						normal plane (perpendicular to the sun)</td
					>
				</tr>
				<tr>
					<th scope="row">diffuse_radiation</th>
					<td>Preceding hour mean</td>
					<td>W/m²</td>
					<td>Diffuse solar radiation as average of the preceding hour</td>
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
					<th scope="row">lightning_potential</th>
					<td>Instant</td>
					<td>J/kg</td>
					<td
						>The Lightning Potential Index after <a
							href="https://adgeo.copernicus.org/articles/23/11/2010/adgeo-23-11-2010.pdf"
							>Lynn and Yair (2010)</a
						>. It is calculated as a vertical integral of the squared updraft velocity weighted by a
						function that essentially contains the graupel concentration</td
					>
				</tr>
				<tr>
					<th scope="row">updraft</th>
					<td>Instant</td>
					<td>m/s</td>
					<td>The maximum vertical updraft velocity within ground and 10 km altitude.</td>
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
					<td>Rain from large scale weather systems of the preceding hour in millimeter</td>
				</tr>
				<tr>
					<th scope="row">showers</th>
					<td>Preceding hour sum</td>
					<td>mm (inch)</td>
					<td>Showers from convective precipitation in millimeters from the preceding hour</td>
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
					<th scope="row">snowfall_height</th>
					<td>Instant</td>
					<td>meters</td>
					<td
						>Height of snowfall limit above mean sea level. It is defined as the height where the
						wet bulb temperature first exceeds 1.3◦C.</td
					>
				</tr>
				<tr>
					<th scope="row">freezinglevel_height</th>
					<td>Instant</td>
					<td>meters</td>
					<td>Altitude above sea level of the 0°C level</td>
				</tr>
				<tr>
					<th scope="row">
						soil_temperature_0cm<br />soil_temperature_6cm<br />soil_temperature_18cm<br
						/>soil_temperature_54cm</th
					>
					<td>Instant</td>
					<td>°C (°F)</td>
					<td
						>Temperature in the soil at 0, 6, 18 and 54 cm depths. 0 cm is the surface temperature
						on land or water surface temperature on water.</td
					>
				</tr>
				<tr>
					<th scope="row">
						soil_moisture_0_1cm<br />soil_moisture_1_3cm<br />soil_moisture_3_9cm<br
						/>soil_moisture_9_27cm<br />soil_moisture_27_81cm
					</th>
					<td>Instant</td>
					<td>m³/m³</td>
					<td
						>Average soil water content as volumetric mixing ratio at 0-1, 1-3, 3-9, 9-27 and 27-81
						cm depths.</td
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
			</tbody>
		</table>
	</div>

	<h3 class="mt-5">15-Minutely Parameter Definition</h3>
	<p>
		The parameter <mark>&minutely_15=</mark> can be used to get 15-minutely data. This data is based
		on the ICON-D2 model which is only available in Central Europe. If 15-minutely data is requested
		for locations outside Central Europe, data is interpolated from 1-hourly to 15-minutely.
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
					<th scope="row">shortwave_radiation</th>
					<td>Preceding hour mean</td>
					<td>W/m²</td>
					<td
						>Shortwave solar radiation as average of the preceding 15 minutes. This is equal to the
						total global horizontal irradiation
					</td>
				</tr>
				<tr>
					<th scope="row">direct_radiation<br />direct_normal_irradiance</th>
					<td>Preceding hour mean</td>
					<td>W/m²</td>
					<td
						>Direct solar radiation as average of the preceding 15 minutes on the horizontal plane
						and the normal plane (perpendicular to the sun)</td
					>
				</tr>
				<tr>
					<th scope="row">diffuse_radiation</th>
					<td>Preceding hour mean</td>
					<td>W/m²</td>
					<td>Diffuse solar radiation as average of the preceding 15 minutes</td>
				</tr>
				<tr>
					<th scope="row">lightning_potential</th>
					<td>Instant</td>
					<td>J/kg</td>
					<td
						>The Lightning Potential Index after <a
							href="https://adgeo.copernicus.org/articles/23/11/2010/adgeo-23-11-2010.pdf"
							>Lynn and Yair (2010)</a
						>. It is calculated as a vertical integral of the squared updraft velocity weighted by a
						function that essentially contains the graupel concentration</td
					>
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
					<th scope="row">snowfall_height</th>
					<td>Instant</td>
					<td>meters</td>
					<td
						>Height of snowfall limit above mean sea level. It is defined as the height where the
						wet bulb temperature first exceeds 1.3◦C.</td
					>
				</tr>
				<tr>
					<th scope="row">freezinglevel_height</th>
					<td>Instant</td>
					<td>meters</td>
					<td>Altitude above sea level of the 0°C level</td>
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
					<th scope="row">temperature_1000hPa<br />temperature_975hPa, ...</th>
					<td>°C (°F)</td>
					<td
						>Air temperature at the specified pressure level. Air temperatures decrease linearly
						with pressure.</td
					>
				</tr>
				<tr>
					<th scope="row">relativehumidity_1000hPa<br />relativehumidity_975hPa, ...</th>
					<td>%</td>
					<td>Relative humidity at the specified pressure level.</td>
				</tr>
				<tr>
					<th scope="row">dewpoint_1000hPa<br />dewpoint_975hPa, ...</th>
					<td>°C (°F)</td>
					<td>Dew point temperature at the specified pressure level.</td>
				</tr>
				<tr>
					<th scope="row">cloudcover_1000hPa<br />cloudcover_975hPa, ...</th>
					<td>%</td>
					<td
						>Cloud cover at the specified pressure level. Cloud cover is approximated based on
						relative humidity using <a
							href="https://www.ecmwf.int/sites/default/files/elibrary/2005/16958-parametrization-cloud-cover.pdf"
							target="_blank">Sundqvist et al. (1989)</a
						>. It may not match perfectly with low, mid and high cloud cover variables.</td
					>
				</tr>
				<tr>
					<th scope="row">windspeed_1000hPa<br />windspeed_975hPa, ...</th>
					<td>km/h (mph, m/s, knots)</td>
					<td>Wind speed at the specified pressure level.</td>
				</tr>
				<tr>
					<th scope="row">winddirection_1000hPa<br />winddirection_975hPa, ...</th>
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
				<tr>
					<th scope="row">rain_sum</th>
					<td>mm</td>
					<td>Sum of daily rain</td>
				</tr>
				<tr>
					<th scope="row">showers_sum</th>
					<td>mm</td>
					<td>Sum of daily showers</td>
				</tr>
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
					<th scope="row">weathercode</th>
					<td>WMO code</td>
					<td>The most severe weather condition on a given day</td>
				</tr>
				<tr>
					<th scope="row">sunrise<br />sunset</th>
					<td>iso8601</td>
					<td>Sun rise and set times</td>
				</tr>
				<tr>
					<th scope="row">windspeed_10m_max<br />windgusts_10m_max</th>
					<td>km/h (mph, m/s, knots)</td>
					<td>Maximum wind speed and gusts on a day</td>
				</tr>
				<tr>
					<th scope="row">winddirection_10m_dominant</th>
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
  },
  "current_weather": {
    "time": "2022-07-01T09:00",
    "temperature": 13.3,
    "weathercode": 3,
    "windspeed": 10.3,
    "winddirection": 262
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
					<th scope="row">current_weather</th>
					<td>Object</td>
					<td
						>Current weather conditions with the attributes: <mark>time</mark>,
						<mark>temperature</mark>,
						<mark>windspeed</mark>, <mark>winddirection</mark> and <mark>weathercode</mark>
					</td>
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
					<th scope="row">77</th>
					<td>Snow grains</td>
				</tr>
				<tr>
					<th scope="row">80, 81, 82</th>
					<td>Rain showers: Slight, moderate, and violent</td>
				</tr>
				<tr>
					<th scope="row">85, 86</th>
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
	<p>(*) Thunderstorm forecast with hail is only available in Central Europe</p>
</div>

<script lang="ts">
	import { dev } from '$app/environment';
	import LicenseSelector from '../LicenseSelector.svelte';
	import ResultPreview from '../ResultPreview.svelte';
	import { urlHashStore } from '$lib/url-hash-store';
	import { countVariables } from '$lib/meteo';
	import AccordionItem from '$lib/Elements/AccordionItem.svelte';
	import { onMount } from 'svelte';
	import StartEndDate from '../StartEndDate.svelte';
	import LocationSelection from '../LocationSelection.svelte';
	import { slide } from 'svelte/transition';

	var d = new Date();
	d.setDate(d.getDate() - 2);
	let endDateDefault = d.toISOString().split('T')[0];
	d.setDate(d.getDate() - 14);
	let startDateDefault = d.toISOString().split('T')[0];
	let startDate = '1940-01-01';
	let endDate = '';

	const defaultParameter = {
		hourly: [],
		daily: [],
		location_mode: 'location_search',
		time_mode: 'time_interval',
		csv_coordinates: '',
		temperature_unit: 'celsius',
		wind_speed_unit: 'kmh',
		precipitation_unit: 'mm',
		timeformat: 'iso8601',
		timezone: 'UTC',
		temporal_resolution: '',
		tilt: 0,
		azimuth: 0,
		models: []
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
		d.setDate(d.getDate() - 2);
		if ($params.end_date == startDateDefault) {
			$params.end_date = d.toISOString().split('T')[0];
		}
		d.setDate(d.getDate() - 14);
		if ($params.start_date == startDateDefault) {
			$params.start_date = d.toISOString().split('T')[0];
		}
	});

	$: timezoneInvalid = $params.timezone == 'UTC' && $params.daily.length > 0;

	let hourly = [
		[
			{ name: 'temperature_2m', label: 'Temperature (2 m)' },
			{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
			{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
			{ name: 'apparent_temperature', label: 'Apparent Temperature' },
			{ name: 'precipitation', label: 'Precipitation (rain + snow)' },
			{ name: 'rain', label: 'Rain' },
			{ name: 'snowfall', label: 'Snowfall' },
			{ name: 'snow_depth', label: 'Snow depth' }
		],
		[
			{ name: 'weather_code', label: 'Weather code' },
			{ name: 'pressure_msl', label: 'Sealevel Pressure' },
			{ name: 'surface_pressure', label: 'Surface Pressure' },
			{ name: 'cloud_cover', label: 'Cloud cover Total' },
			{ name: 'cloud_cover_low', label: 'Cloud cover Low' },
			{ name: 'cloud_cover_mid', label: 'Cloud cover Mid' },
			{ name: 'cloud_cover_high', label: 'Cloud cover High' },
			{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
			{ name: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
		],
		[
			{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
			{ name: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
			{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
			{ name: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
			{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
		],
		[
			{ name: 'soil_temperature_0_to_7cm', label: 'Soil Temperature (0-7 cm)' },
			{ name: 'soil_temperature_7_to_28cm', label: 'Soil Temperature (7-28 cm)' },
			{ name: 'soil_temperature_28_to_100cm', label: 'Soil Temperature (28-100 cm)' },
			{ name: 'soil_temperature_100_to_255cm', label: 'Soil Temperature (100-255 cm)' },
			{ name: 'soil_moisture_0_to_7cm', label: 'Soil Moisture (0-7 cm)' },
			{ name: 'soil_moisture_7_to_28cm', label: 'Soil Moisture (7-28 cm)' },
			{ name: 'soil_moisture_28_to_100cm', label: 'Soil Moisture (28-100 cm)' },
			{ name: 'soil_moisture_100_to_255cm', label: 'Soil Moisture (100-255 cm)' }
		]
	];
	if (dev) {
		hourly.push([
			{ name: 'soil_temperature_0_to_100cm', label: 'Soil Temperature (0-100 cm)' },
			{ name: 'soil_moisture_0_to_100cm', label: 'Soil Moisture (0-100 cm)' },
			{ name: 'soil_moisture_index_0_to_7cm', label: 'Soil Moisture Index (0-7 cm)' },
			{ name: 'soil_moisture_index_7_to_28cm', label: 'Soil Moisture Index (7-28 cm)' },
			{ name: 'soil_moisture_index_28_to_100cm', label: 'Soil Moisture Index (28-100 cm)' },
			{ name: 'soil_moisture_index_0_to_100cm', label: 'Soil Moisture Index (0-100 cm)' }
		]);
	}

	let daily = [
		[
			{ name: 'weather_code', label: 'Weather code' },
			{ name: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
			{ name: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
			{ name: 'temperature_2m_mean', label: 'Mean Temperature (2 m)' },
			{ name: 'apparent_temperature_max', label: 'Maximum Apparent Temperature (2 m)' },
			{ name: 'apparent_temperature_min', label: 'Minimum Apparent Temperature (2 m)' },
			{ name: 'apparent_temperature_mean', label: 'Mean Apparent Temperature (2 m)' },
			{ name: 'sunrise', label: 'Sunrise' },
			{ name: 'sunset', label: 'Sunset' },
			{ name: 'daylight_duration', label: 'Daylight Duration' },
			{ name: 'sunshine_duration', label: 'Sunshine Duration' },
		],
		[
			{ name: 'precipitation_sum', label: 'Precipitation Sum' },
			{ name: 'rain_sum', label: 'Rain Sum' },
			{ name: 'snowfall_sum', label: 'Snowfall Sum' },
			{ name: 'precipitation_hours', label: 'Precipitation Hours' },
			{ name: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
			{ name: 'wind_gusts_10m_max', label: 'Maximum Wind Gusts (10 m)' },
			{ name: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' },
			{ name: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' },
			{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' }
		]
	];

	if (dev) {
		daily.push([
			{ name: 'soil_temperature_0_to_100cm_mean', label: 'Mean Soil Temperature (0-100 cm)' },
			{ name: 'soil_moisture_0_to_100cm_mean', label: 'Mean Soil Moisture (0-100 cm)' },
			{ name: 'soil_moisture_index_0_to_100cm_mean', label: 'Mean Soil Moisture Index (0-100 cm)' },
			{ name: 'growing_degree_days_base_0_limit_50', label: 'Growing Degree Days Base 0 Limit 50' },
			{ name: 'leaf_wetness_probability_mean', label: 'Mean Leaf Wetness Probability' },
			{ name: 'vapour_pressure_deficit_max', label: 'Vapour Pressure Deficit Max' }
		]);
	}

	const additionalVariables = [[{ name: 'is_day', label: 'Is Day or Night' }, { name: 'sunshine_duration', label: 'Sunshine Duration' }]];

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

	const ensembleSpreadVariables = [
		[
			{ name: 'temperature_2m_spread', label: 'Temperature (2 m)' },
			{ name: 'dew_point_2m_spread', label: 'Dewpoint (2 m)' },
			{ name: 'precipitation_spread', label: 'Precipitation (rain + snow)' },
			{ name: 'snowfall_spread', label: 'Snowfall' },
			{ name: 'shortwave_radiation_spread', label: 'Shortwave Solar Radiation GHI' },
			{ name: 'direct_radiation_spread', label: 'Direct Solar Radiation' },
			{ name: 'pressure_msl_spread', label: 'Sealevel Pressure' },
			{ name: 'cloud_cover_low_spread', label: 'Cloud cover Low' },
			{ name: 'cloud_cover_mid_spread', label: 'Cloud cover Mid' },
			{ name: 'cloud_cover_high_spread', label: 'Cloud cover High' },
		],
		[
			{ name: 'wind_speed_10m_spread', label: 'Wind Speed (10 m)' },
			{ name: 'wind_speed_100m_spread', label: 'Wind Speed (100 m)' },
			{ name: 'wind_gusts_10m_spread', label: 'Wind Gusts (10 m)' },
			{ name: 'soil_temperature_0_to_7cm_spread', label: 'Soil Temperature (0-7 cm)' },
			{ name: 'soil_temperature_7_to_28cm_spread', label: 'Soil Temperature (7-28 cm)' },
			{ name: 'soil_temperature_28_to_100cm_spread', label: 'Soil Temperature (28-100 cm)' },
			{ name: 'soil_temperature_100_to_255cm_spread', label: 'Soil Temperature (100-255 cm)' },
			{ name: 'soil_moisture_0_to_7cm_spread', label: 'Soil Moisture (0-7 cm)' },
			{ name: 'soil_moisture_7_to_28cm_spread', label: 'Soil Moisture (7-28 cm)' },
			{ name: 'soil_moisture_28_to_100cm_spread', label: 'Soil Moisture (28-100 cm)' },
			{ name: 'soil_moisture_100_to_255cm_spread', label: 'Soil Moisture (100-255 cm)' }
		]
	]

	let models = [
		[
			{ name: 'best_match', label: 'Best match', caption: 'ECMWF IFS & ERA5' },
			{ name: 'ecmwf_ifs', label: 'ECMWF IFS', caption: '9 km, Global, 2017 onwards' },
			{ name: 'ecmwf_ifs_analysis_long_window', label: 'ECMWF IFS Analysis Long-Window', caption: '9 km, 6-Hourly Measurements' },
			//{ name: 'ecmwf_ifs_analysis', label: 'ECMWF IFS Analysis', caption: '9 km, 6-Hourly Measurements' },
			//{ name: 'ecmwf_ifs_long_window', label: 'ECMWF IFS Long-Window', caption: '9 km, 1-Hourly' }
		],[
			{ name: 'era5_seamless', label: 'ERA5-Seamless', caption: 'ERA5 & ERA5-Land combined' },
			{ name: 'era5', label: 'ERA5', caption: '25 km, Global' },
			{ name: 'era5_land', label: 'ERA5-Land', caption: '10 km, Global' },
			{ name: 'era5_ensemble', label: 'ERA5-Ensemble', caption: '0.5° ~55km, Global' },
			{ name: 'cerra', label: 'CERRA', caption: '5 km, Europe, 1985 to June 2021' }
		]
	];
</script>

<svelte:head>
	<title>🏛️ Historical Weather API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/historical-weather-api" />
	<meta
		name="description"
		content="Historical 🌤️ weather data from 1940 onwards with weather records dating back to 1940 and hourly resolution available for any location on earth. Retrieve decades worth of data in less than a second with our lightning-fast API. Dive deep into historical weather records, uncover trends, and gain valuable insights with ease."
	/>
</svelte:head>

<div class="alert alert-primary" role="alert">
	Now, with the addition of the 9-kilometer ECMWF IFS model, the historical weather API provides access to a staggering 90 terabytes of meteorological data! Read the <a
		href="https://open.substack.com/pub/openmeteo/p/processing-90-tb-historical-weather"
		target="_blank">blog article</a
	>.
</div>

<form method="get" action="https://archive-api.open-meteo.com/v1/archive">
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
				You can access past weather data dating back to 1940. However, there is a 5-day delay in the
				data. If you want information for the most recent days, you can use the <a
					href="/en/docs"
					title="Weather forecast API">forecast API</a
				>
				and adjust the <mark>Past Days</mark> setting.
			</p>
			<p>
				Quick:
				<button
					class="btn btn-outline-primary btn-sm"
					on:click|preventDefault={() => (
						($params.start_date = '2000-01-01'), ($params.end_date = '2009-12-31')
					)}>2000-2010</button
				>
				<button
					class="btn btn-outline-primary btn-sm"
					on:click|preventDefault={() => (
						($params.start_date = '2010-01-01'), ($params.end_date = '2019-12-31')
					)}>2010-2022</button
				>
				<button
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
				>
				<button
					class="btn btn-outline-primary btn-sm"
					on:click|preventDefault={() => (
						($params.start_date = '2022-01-01'), ($params.end_date = '2022-12-31')
					)}>2022</button
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
						<label for="tilt">Panel Tilt (0° horizontal)</label>
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
						<label for="azimuth">Panel Azimuth (0° S, -90° E, 90° W)</label>
						{#if Number($params.azimuth) < -180 || Number($params.azimuth) > 180 }
							<div class="invalid-tooltip" transition:slide>
								Azimuth must be between -90° (east) and 90° (west)
							</div>
						{/if}
					</div>
				</div>
			</AccordionItem>
			<AccordionItem
				id="ensemble-spread-variables"
				title="ERA5-Ensemble Spread Variables"
				count={countVariables(ensembleSpreadVariables, $params.hourly)}
			>
				{#each ensembleSpreadVariables as group}
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
						>Note: Ensemble spread variables are available if the model <mark>ERA5-Ensemble</mark> is used. </small
					>
				</div>
			</AccordionItem>
			<AccordionItem
				id="models"
				title="Reanalysis models"
				count={countVariables(models, $params.models)}
			>
				{#each models as group}
					<div class="col-md-6 mb-3">
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
								<label class="form-check-label" for="{e.name}_model"
									>{e.label}&nbsp;<span class="text-muted">({e.caption})</span></label
								>
							</div>
						{/each}
					</div>
				{/each}
				<div class="col-md-12">
					<small class="text-muted"
						>Note: The default <mark>Best Match</mark> combines ERA5 and ERA5-Land seamlessly. The
						CERRA model will also be included in <mark>Best Match</mark> once real-time updates become
						available.</small
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
					<option selected value="mm">Millimeter</option>
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
					<option selected value="iso8601">ISO 8601 (e.g. 2022-12-31)</option>
					<option value="unixtime">Unix timestamp</option>
				</select>
				<label for="timeformat">Timeformat</label>
			</div>
		</div>
	</div>

	<LicenseSelector requires_professional_plan={true} />
</form>

<ResultPreview {params} {defaultParameter} type="archive" action="archive" sdk_cache={-1} useStockChart={true} />

<h2 id="data-sources" class="mt-5">Data Sources</h2>
<div class="row">
	<div class="col-6">
		<p>
			The Historical Weather API is based on reanalysis datasets and uses a combination of weather
			station, aircraft, buoy, radar, and satellite observations to create a comprehensive record of
			past weather conditions. These datasets are able to fill in gaps by using mathematical models
			to estimate the values of various weather variables. As a result, reanalysis datasets are able
			to provide detailed historical weather information for locations that may not have had weather
			stations nearby, such as rural areas or the open ocean.
		</p>
		<p>
			The models for historical weather data use a spatial resolution of 9 km to resolve fine details 
			close to coasts or complex mountain terrain. In general, a higher spatial resolution means that the data is
			more detailed and represents the weather conditions more accurately at smaller scales.
		</p>
	</div>
	<div class="col-6">
		<p>
			The ECMWF IFS dataset has been meticulously assembled by Open-Meteo using simulation runs at 0z and 12z, 
			employing the most up-to-date version of IFS. This dataset offers the utmost resolution and precision 
			in depicting historical weather conditions.
		</p>
		<p>However, when studying climate change over decades, it is advisable to exclusively utilize ERA5 or ERA5-Land. 
			This choice ensures data consistency and prevents unintentional alterations that could arise from the adoption 
			of different weather model upgrades.</p>
		<p>
			You can access data dating back to 1940 with a delay of 2 days. If you're looking for weather
			information from the previous day, our <a
				href="/en/docs"
				title="Weather Forecast API documentation">Forecast API</a
			>
			offers the <mark>&past_days=</mark> feature for your convenience.
		</p>
	</div>
</div>
<div class="table-responsive">
	<table class="table">
		<thead>
			<tr>
				<th scope="col">Data Set</th>
				<th scope="col">Region</th>
				<th scope="col">Spatial Resolution</th>
				<th scope="col">Temporal Resolution</th>
				<th scope="col">Data Availability</th>
				<th scope="col">Update frequency</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th scope="row"
					><a
						href="https://www.ecmwf.int/en/forecasts/documentation-and-support/changes-ecmwf-model"
						>ECMWF IFS</a
					>
				</th>
				<td>Global</td>
				<td>9 km</td>
				<td>Hourly</td>
				<td>2017 to present</td>
				<td>Daily with 2 days delay</td>
			</tr>
			<tr>
				<th scope="row"
					><a
						href="https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels?tab=overview"
						>ERA5</a
					>
				</th>
				<td>Global</td>
				<td>0.25° (~25 km)</td>
				<td>Hourly</td>
				<td>1940 to present</td>
				<td>Daily with 5 days delay</td>
			</tr>
			<tr>
				<th scope="row"
					><a
						href="https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land?tab=overview"
						>ERA5-Land</a
					>
				</th>
				<td>Global</td>
				<td>0.1° (~11 km)</td>
				<td>Hourly</td>
				<td>1950 to present</td>
				<td>Daily with 5 days delay</td>
			</tr>
			<tr>
				<th scope="row"
					><a
						href="https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels?tab=overview"
						>ERA5-Ensemble</a
					>
				</th>
				<td>Global</td>
				<td>0.5° (~55 km)</td>
				<td>3-Hourly</td>
				<td>1940 to present</td>
				<td>Daily with 5 days delay</td>
			</tr>
			<tr>
				<th scope="row"
					><a
						href="https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-cerra-single-levels?tab=overview"
						>CERRA</a
					>
				</th>
				<td>Europe</td>
				<td>5 km</td>
				<td>Hourly</td>
				<td>1985 to June 2021</td>
				<td>-</td>
			</tr>
			<tr>
				<th scope="row"
					><a
						href="https://confluence.ecmwf.int/display/FUG/Section+2.5+Model+Data+Assimilation%2C+4D-Var"
						>ECMWF IFS Assimilation Long-Window</a
					>
				</th>
				<td>Global</td>
				<td>9 km</td>
				<td>6-Hourly</td>
				<td>2024 to present</td>
				<td>Daily with 2 days delay</td>
			</tr>
		</tbody>
	</table>
</div>
<p>
	Different reanalysis models may include different sets of weather variables in their datasets. For
	example, the ERA5 model includes all weather variables, while the ERA5-Land model only includes
	surface variables such as temperature, humidity, soil temperature, and soil moisture. The CERRA
	model includes most weather variables, but does not include soil temperature and moisture. It is
	important to be aware of the specific variables that are included in a particular reanalysis model
	in order to understand the limitations and potential biases of the data.
</p>

<div class="col-12 py-5">
	<h2 id="api-documentation">API Documentation</h2>
	<p>
		The API endpoint <mark>/v1/archive</mark> allows users to retrieve historical weather data for a
		specific location and time period. To use this endpoint, you can specify a geographical coordinate,
		a time interval, and a list of weather variables that they are interested in. The endpoint will then
		return the requested data in a format that can be easily accessed and used by applications or other
		software. This endpoint can be very useful for researchers and other users who need to access detailed
		historical weather data for specific locations and time periods.
	</p>
	<p>All URL parameters are listed below:</p>
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
					<th scope="row">latitude<br />longitude</th>
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
					<th scope="row">start_date<br />end_date</th>
					<td>String (yyyy-mm-dd)</td>
					<td>Yes</td>
					<td />
					<td
						>The time interval to get weather data. A day must be specified as an ISO8601 date (e.g.
						<mark>2022-12-31</mark>).
					</td>
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
						is supported If <mark>auto</mark> is set as a time zone, the coordinates will be automatically
						resolved to the local time zone. For multiple coordinates, a comma separated list of timezones
						can be specified.</td
					>
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
					<th scope="row">precipitation</th>
					<td>Preceding hour sum</td>
					<td>mm (inch)</td>
					<td
						>Total precipitation (rain, showers, snow) sum of the preceding hour. Data is stored
						with a 0.1 mm precision. If precipitation data is summed up to monthly sums, there might
						be small inconsistencies with the total precipitation amount.</td
					>
				</tr>
				<tr>
					<th scope="row">rain</th>
					<td>Preceding hour sum</td>
					<td>mm (inch)</td>
					<td
						>Only liquid precipitation of the preceding hour including local showers and rain from
						large scale systems.</td
					>
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
					<th scope="row">cloud_cover</th>
					<td>Instant</td>
					<td>%</td>
					<td>Total cloud cover as an area fraction</td>
				</tr>
				<tr>
					<th scope="row">cloud_cover_low</th>
					<td>Instant</td>
					<td>%</td>
					<td>Low level clouds and fog up to 2 km altitude</td>
				</tr>
				<tr>
					<th scope="row">cloud_cover_mid</th>
					<td>Instant</td>
					<td>%</td>
					<td>Mid level clouds from 2 to 6 km altitude</td>
				</tr>
				<tr>
					<th scope="row">cloud_cover_high</th>
					<td>Instant</td>
					<td>%</td>
					<td>High level clouds from 6 km altitude</td>
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
					<th scope="row">global_tilted_irradiance</th>
					<td>Preceding hour mean</td>
					<td>W/m²</td>
					<td>Total radiation received on a tilted pane as average of the preceding hour. 
						The calculation is assuming a fixed albedo of 20% and in isotropic sky. 
						Please specify tilt and azimuth parameter. Tilt ranges from 0° to 90° and is typically around 45°. 
						Azimuth should be close to 0° (0° south, -90° east, 90° west).
						If azimuth is set to "nan", the calculation assumes a horizontal tracker. 
						If tilt is set to "nan", it is assumed that the panel has a vertical tracker. 
						If both are set to "nan", a bi-axial tracker is assumed.</td>
				</tr>
				<tr>
					<th scope="row">sunshine_duration</th>
					<td>Preceding hour sum</td>
					<td>Seconds</td>
					<td>Number of seconds of sunshine of the preceding hour per hour calculated by direct normalized irradiance exceeding 120 W/m², following the WMO definition.</td>
				</tr>
				<tr>
					<th scope="row">wind_speed_10m<br />wind_speed_100m</th>
					<td>Instant</td>
					<td>km/h (mph, m/s, knots)</td>
					<td
						>Wind speed at 10 or 100 meters above ground. Wind speed on 10 meters is the standard
						level.</td
					>
				</tr>
				<tr>
					<th scope="row">wind_direction_10m<br />wind_direction_100m</th>
					<td>Instant</td>
					<td>°</td>
					<td>Wind direction at 10 or 100 meters above ground</td>
				</tr>
				<tr>
					<th scope="row">wind_gusts_10m</th>
					<td>Instant</td>
					<td>km/h (mph, m/s, knots)</td>
					<td
						>Gusts at 10 meters above ground of the indicated hour. Wind gusts in <mark>CERRA</mark>
						are defined as the maximum wind gusts of the preceding hour. Please consult the
						<a
							href="https://www.ecmwf.int/en/elibrary/81271-ifs-documentation-cy47r3-part-iv-physical-processes"
							>ECMWF IFS documentation</a
						> for more information on how wind gusts are parameterized in weather models.</td
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
						>
						ET₀ is calculated from temperature, wind speed, humidity and solar radiation. Unlimited soil
						water is assumed. ET₀ is commonly used to estimate the required irrigation for plants.</td
					>
				</tr>
				<tr>
					<th scope="row">weather_code</th>
					<td>Instant</td>
					<td>WMO code</td>
					<td
						>Weather condition as a numeric code. Follow WMO weather interpretation codes. See table
						below for details. Weather code is calculated from cloud cover analysis, precipitation
						and snowfall. As barely no information about atmospheric stability is available,
						estimation about thunderstorms is not possible.</td
					>
				</tr>
				<tr>
					<th scope="row">snow_depth</th>
					<td>Instant</td>
					<td>meters</td>
					<td
						>Snow depth on the ground. Snow depth in ERA5-Land tends to be overestimated. As the
						spatial resolution for snow depth is limited, please use it with care.</td
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
					<th scope="row">
						soil_temperature_0_to_7cm<br />soil_temperature_7_to_28cm<br
						/>soil_temperature_28_to_100cm<br />soil_temperature_100_to_255cm
					</th>
					<td>Instant</td>
					<td>°C (°F)</td>
					<td>Average temperature of different soil levels below ground.</td>
				</tr>
				<tr>
					<th scope="row">
						soil_moisture_0_to_7cm<br />soil_moisture_7_to_28cm<br />soil_moisture_28_to_100cm<br
						/>soil_moisture_100_to_255cm
					</th>
					<td>Instant</td>
					<td>m³/m³</td>
					<td
						>Average soil water content as volumetric mixing ratio at 0-7, 7-28, 28-100 and 100-255
						cm depths.</td
					>
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
					<th scope="row">weather_code</th>
					<td>WMO code</td>
					<td>The most severe weather condition on a given day</td>
				</tr>
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
					<th scope="row">sunrise<br />sunset</th>
					<td>iso8601</td>
					<td>Sun rise and set times</td>
				</tr>
				<tr>
					<th scope="row">sunshine_duration</th>
					<td>seconds</td>
					<td>The number of seconds of sunshine per day is determined by calculating direct normalized irradiance exceeding 120 W/m², following the WMO definition. Sunshine duration will consistently be less than daylight duration due to dawn and dusk.</td>
				</tr>
				<tr>
					<th scope="row">daylight_duration</th>
					<td>seconds</td>
					<td>Number of seconds of daylight per day</td>
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
					<td>The sum of solar radiaion on a given day in Megajoules</td>
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
			</tbody>
		</table>
	</div>
	<h3 class="mt-5">Errors</h3>
	<p>
		In case an error occurs, for example a URL parameter is not correctly specified, a JSON error
		object is returned with a HTTP 400 status code.
	</p>
	<pre><code>
{`
  "error": true,
  "reason": "Cannot initialize WeatherVariable from invalid String value tempeture_2m for key hourly"
`}
      </code></pre>
</div>

<h2 id="citation">Citation & Acknowledgement</h2>
<p>
	We encourage researchers in the field of meteorology and related disciplines to cite Open-Meteo
	and its sources in their work. Citing not only gives proper credit but also promotes transparency,
	reproducibility, and collaboration within the scientific community. Together, let's foster a
	culture of recognition and support for open-data initiatives like Open-Meteo, ensuring that future
	researchers can benefit from the valuable resources it provides.
</p>

<div class="border rounded p-3">
	<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
		<li class="nav-item" role="presentation">
			<button
				class="nav-link active"
				id="pills-apa-tab"
				data-bs-toggle="pill"
				data-bs-target="#pills-apa"
				type="button"
				role="tab"
				aria-controls="pills-apa"
				aria-selected="true">APA</button
			>
		</li>
		<li class="nav-item" role="presentation">
			<button
				class="nav-link"
				id="pills-mla-tab"
				data-bs-toggle="pill"
				data-bs-target="#pills-mla"
				type="button"
				role="tab"
				aria-controls="pills-mla"
				aria-selected="true">MLA</button
			>
		</li>
		<li class="nav-item" role="presentation">
			<button
				class="nav-link"
				id="pills-harvard-tab"
				data-bs-toggle="pill"
				data-bs-target="#pills-harvard"
				type="button"
				role="tab"
				aria-controls="pills-harvard"
				aria-selected="true">Harvard</button
			>
		</li>
		<li class="nav-item" role="presentation">
			<button
				class="nav-link"
				id="pills-bibtex-tab"
				data-bs-toggle="pill"
				data-bs-target="#pills-bibtex"
				type="button"
				role="tab"
				aria-controls="pills-bibtex"
				aria-selected="false">BibTeX</button
			>
		</li>
	</ul>
	<div class="tab-content" id="pills-tabContent">
		<div
			class="tab-pane fade show active"
			id="pills-apa"
			role="tabpanel"
			aria-labelledby="pills-apa-tab"
			tabindex="0"
		>
			<p>
				Zippenfenig, P. (2023). Open-Meteo.com Weather API [Computer software]. Zenodo. <a
					title="zenodo publication"
					href="https://doi.org/10.5281/ZENODO.7970649">https://doi.org/10.5281/ZENODO.7970649</a
				>
			</p>
			<p>
				Hersbach, H., Bell, B., Berrisford, P., Biavati, G., Horányi, A., Muñoz Sabater, J.,
				Nicolas, J., Peubey, C., Radu, R., Rozum, I., Schepers, D., Simmons, A., Soci, C., Dee, D.,
				Thépaut, J-N. (2023). ERA5 hourly data on single levels from 1940 to present [Data set].
				ECMWF. <a href="https://doi.org/10.24381/cds.adbb2d47" title="era5-land"
					>https://doi.org/10.24381/cds.adbb2d47</a
				>
			</p>
			<p>
				Muñoz Sabater, J. (2019). ERA5-Land hourly data from 2001 to present [Data set]. ECMWF. <a
					href="https://doi.org/10.24381/CDS.E2161BAC"
					title="era5-land">https://doi.org/10.24381/CDS.E2161BAC</a
				>
			</p>
			<p>
				Schimanke S., Ridal M., Le Moigne P., Berggren L., Undén P., Randriamampianina R., Andrea
				U., Bazile E., Bertelsen A., Brousseau P., Dahlgren P., Edvinsson L., El Said A., Glinton
				M., Hopsch S., Isaksson L., Mladek R., Olsson E., Verrelle A., Wang Z.Q. (2021). CERRA
				sub-daily regional reanalysis data for Europe on single levels from 1984 to present [Data
				set]. ECMWF. <a href="https://doi.org/10.24381/CDS.622A565A" title="cerra"
					>https://doi.org/10.24381/CDS.622A565A</a
				>
			</p>
		</div>
		<div
			class="tab-pane fade show"
			id="pills-mla"
			role="tabpanel"
			aria-labelledby="pills-mla-tab"
			tabindex="0"
		>
			<p>
				Zippenfenig, Patrick. Open-Meteo.com Weather API., Zenodo, 2023, doi:10.5281/ZENODO.7970649.
			</p>
			<p>
				Hersbach, H., Bell, B., Berrisford, P., Biavati, G., Horányi, A., Muñoz Sabater, J.,
				Nicolas, J., Peubey, C., Radu, R., Rozum, I., Schepers, D., Simmons, A., Soci, C., Dee, D.,
				Thépaut, J-N. (2023). ERA5 hourly data on single levels from 1940 to present [Data set].
				ECMWF. https://doi.org/10.24381/cds.adbb2d47
			</p>
			<p>
				Muñoz Sabater, J. (2019). ERA5-Land hourly data from 2001 to present [Data set]. ECMWF.
				https://doi.org/10.24381/CDS.E2161BAC
			</p>
			<p>
				Schimanke S., Ridal M., Le Moigne P., Berggren L., Undén P., Randriamampianina R., Andrea
				U., Bazile E., Bertelsen A., Brousseau P., Dahlgren P., Edvinsson L., El Said A., Glinton
				M., Hopsch S., Isaksson L., Mladek R., Olsson E., Verrelle A., Wang Z.Q. CERRA Sub-Daily
				Regional Reanalysis Data for Europe on Single Levels from 1984 to Present. ECMWF, 2021,
				doi:10.24381/CDS.622A565A.
			</p>
		</div>
		<div
			class="tab-pane fade show"
			id="pills-harvard"
			role="tabpanel"
			aria-labelledby="pills-harvard-tab"
			tabindex="0"
		>
			<p>Zippenfenig, P. (2023) Open-Meteo.com Weather API. Zenodo. doi: 10.5281/ZENODO.7970649.</p>
			<p>
				Hersbach, H., Bell, B., Berrisford, P., Biavati, G., Horányi, A., Muñoz Sabater, J.,
				Nicolas, J., Peubey, C., Radu, R., Rozum, I., Schepers, D., Simmons, A., Soci, C., Dee, D.,
				Thépaut, J-N. (2023) “ERA5 hourly data on single levels from 1940 to present.” ECMWF. doi:
				10.24381/cds.adbb2d47.
			</p>
			<p>
				Muñoz Sabater, J. (2019) “ERA5-Land hourly data from 2001 to present.” ECMWF. doi:
				10.24381/CDS.E2161BAC.
			</p>
			<p>
				Schimanke S., Ridal M., Le Moigne P., Berggren L., Undén P., Randriamampianina R., Andrea
				U., Bazile E., Bertelsen A., Brousseau P., Dahlgren P., Edvinsson L., El Said A., Glinton
				M., Hopsch S., Isaksson L., Mladek R., Olsson E., Verrelle A., Wang Z.Q. (2021) “CERRA
				sub-daily regional reanalysis data for Europe on single levels from 1984 to present.” ECMWF.
				doi: 10.24381/CDS.622A565A.
			</p>
		</div>
		<div
			class="tab-pane fade"
			id="pills-bibtex"
			role="tabpanel"
			aria-labelledby="pills-bibtex-tab"
			tabindex="0"
		>
			<pre>
<code
					>@software&#123;Zippenfenig_Open-Meteo,
  author = &#123;Zippenfenig, Patrick&#125;,
  doi = &#123;10.5281/zenodo.7970649&#125;,
  license = &#123;CC-BY-4.0&#125;,
  title = &#123;Open-Meteo.com Weather API&#125;,
  year = &#123;2023&#125;,
  copyright = &#123;Creative Commons Attribution 4.0 International&#125;,
  url = &#123;https://open-meteo.com/&#125;
&#125;</code
				></pre>
			<pre><code
					>@misc&#123;Hersbach_ERA5,
  doi = &#123;10.24381/cds.adbb2d47&#125;,
  url = &#123;https://cds.climate.copernicus.eu/doi/10.24381/cds.adbb2d47&#125;,
  author = &#123;Hersbach, H., Bell, B., Berrisford, P., Biavati, G., Horányi, A., Muñoz Sabater, J., Nicolas, J., Peubey, C., Radu, R., Rozum, I., Schepers, D., Simmons, A., Soci, C., Dee, D., Thépaut, J-N.&#125;,
  title = &#123;ERA5 hourly data on single levels from 1940 to present&#125;,
  publisher = &#123;ECMWF&#125;,
  year = &#123;2023&#125;
&#125;</code
				></pre>
			<pre><code
					>@misc&#123;Munoz_ERA5_LAND,
  doi = &#123;10.24381/CDS.E2161BAC&#125;,
  url = &#123;https://cds.climate.copernicus.eu/doi/10.24381/cds.e2161bac&#125;,
  author = &#123;Muñoz Sabater, J.&#125;,
  title = &#123;ERA5-Land hourly data from 2001 to present&#125;,
  publisher = &#123;ECMWF&#125;,
  year = &#123;2019&#125;
&#125;</code
				></pre>
			<pre><code
					>@misc&#123;Schimanke_CERRA,
  doi = &#123;10.24381/CDS.622A565A&#125;,
  url = &#123;https://cds.climate.copernicus.eu/doi/10.24381/cds.622a565a&#125;,
  author = &#123;Schimanke S., Ridal M., Le Moigne P., Berggren L., Undén P., Randriamampianina R., Andrea U., Bazile E., Bertelsen A., Brousseau P., Dahlgren P., Edvinsson L., El Said A., Glinton M., Hopsch S., Isaksson L., Mladek R., Olsson E., Verrelle A., Wang Z.Q.&#125;,
  title = &#123;CERRA sub-daily regional reanalysis data for Europe on single levels from 1984 to present&#125;,
  publisher = &#123;ECMWF&#125;,
  year = &#123;2021&#125;
&#125;</code
				></pre>
		</div>
	</div>
</div>
<p class="mt-4">Generated using Copernicus Climate Change Service information 2022.</p>

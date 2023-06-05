<script lang="ts">
	import { onMount } from 'svelte';
	import 'bootstrap-datepicker/dist/css/bootstrap-datepicker3.css';

	onMount(async () => {
		const datepicker = await import('bootstrap-datepicker');
		const weather = await import('$lib/weather');
		const Dropdown = await import('bootstrap/js/dist/dropdown');
		const Collapse = await import('bootstrap/js/dist/collapse');
		const Tab = await import('bootstrap/js/dist/tab');
		weather.init(Dropdown.default);
	});

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
			'soil_temperature_0_to_10cm',
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

	let models: String[] = ['icon_seamless'];

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
</script>

<svelte:head>
	<title>Ensemble API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/ensemble-api" />
</svelte:head>

<div class="alert alert-primary" role="alert">
	The initial version of ensemble weather models has been integrated. You can learn more about these models in the <a
	href="https://openmeteo.substack.com/p/ensemble-weather-forecast-api" target="_blank">blog article</a>.
</div>

<form id="api_form" method="get" action="https://ensemble-api.open-meteo.com/v1/ensemble">
	<div class="row">
		<h2>Select Coordinates or City</h2>
		<div class="col-md-3">
			<div class="form-floating">
				<input
					type="number"
					step="0.0001"
					class="form-control"
					name="latitude"
					id="latitude"
					value="52.52"
				/>
				<label for="latitude">Latitude</label>
			</div>
		</div>
		<div class="col-md-3">
			<div class="form-floating">
				<input
					type="number"
					step="0.0001"
					class="form-control"
					name="longitude"
					id="longitude"
					value="13.41"
				/>
				<label for="longitude">Longitude</label>
			</div>
		</div>
		<div class="col-md-6">
			<div class="input-group mb-3">
				<div class="form-floating dropdown">
					<input
						type="text"
						class="form-control"
						id="select_city"
						autocomplete="off"
						spellcheck="false"
						aria-label="Select city"
						data-bs-toggle="dropdown"
					/>
					<ul id="select_city_results" class="dropdown-menu" aria-labelledby="select_city">
						<li><span class="dropdown-item">Start typing to search for locations</span></li>
					</ul>
					<label for="select_city">Select city</label>
				</div>
				<button class="btn btn-outline-secondary" type="button" id="detect_gps"
					>Detect GPS Position</button
				>
			</div>
		</div>
	</div>
	<div class="row py-3 px-0">
		<h2>Ensemble Models</h2>
		<div class="col-md-3">
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="icon_seamless"
					id="icon_seamless"
					name="models"
					bind:group={models}
					checked
				/>
				<label class="form-check-label" for="icon_seamless">DWD Icon EPS Seamless </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="icon_global"
					id="icon_global"
					name="models"
					bind:group={models}
				/>
				<label class="form-check-label" for="icon_global"> DWD Icon EPS Global </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="icon_eu"
					id="icon_eu"
					name="models"
					bind:group={models}
				/>
				<label class="form-check-label" for="icon_eu"> DWD Icon EPS EU </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="icon_d2"
					id="icon_d2"
					name="models"
					bind:group={models}
				/>
				<label class="form-check-label" for="icon_d2"> DWD Icon EPS D2 </label>
			</div>
		</div>
		<div class="col-md-3">
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="gfs_seamless"
					id="gfs_seamless"
					name="models"
					bind:group={models}
				/>
				<label class="form-check-label" for="gfs_seamless"> GFS Ensemble Seamless </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="gfs025"
					id="gfs025"
					name="models"
					bind:group={models}
				/>
				<label class="form-check-label" for="gfs025"> GFS Ensemble 0.25 </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="gfs05"
					id="gfs05"
					name="models"
					bind:group={models}
				/>
				<label class="form-check-label" for="gfs05"> GFS Ensemble 0.5 </label>
			</div>
		</div>
		<div class="col-md-3">
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="ecmwf_ifs04"
					id="ecmwf_ifs04"
					name="models"
					bind:group={models}
				/>
				<label class="form-check-label" for="ecmwf_ifs04"> ECMWF IFS Ensemble </label>
			</div>
		</div>
		<div class="col-md-3">
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="gem_global"
					id="gem_global"
					name="models"
					bind:group={models}
				/>
				<label class="form-check-label" for="gem_global"> GEM Global Ensemble </label>
			</div>
		</div>
	</div>
	<div class="row py-3 px-0">
		<h2>Hourly Weather Variables</h2>
		<div class="col-md-3">
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="temperature_2m"
					id="temperature_2m"
					name="hourly"
					checked
					disabled={!isAvailable('temperature_2m', models)}
				/>
				<label class="form-check-label" for="temperature_2m"> Temperature (2 m) </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="relativehumidity_2m"
					id="relativehumidity_2m"
					name="hourly"
					disabled={!isAvailable('relativehumidity_2m', models)}
				/>
				<label class="form-check-label" for="relativehumidity_2m"> Relative Humidity (2 m) </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="dewpoint_2m"
					id="dewpoint_2m"
					name="hourly"
					disabled={!isAvailable('dewpoint_2m', models)}
				/>
				<label class="form-check-label" for="dewpoint_2m"> Dewpoint (2 m) </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="apparent_temperature"
					id="apparent_temperature"
					name="hourly"
					disabled={!isAvailable('apparent_temperature', models)}
				/>
				<label class="form-check-label" for="apparent_temperature"> Apparent Temperature </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="precipitation"
					id="precipitation"
					name="hourly"
					disabled={!isAvailable('precipitation', models)}
				/>
				<label class="form-check-label" for="precipitation"> Precipitation (rain + snow) </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="rain"
					id="rain"
					name="hourly"
					disabled={!isAvailable('rain', models)}
				/>
				<label class="form-check-label" for="rain"> Rain </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="snowfall"
					id="snowfall"
					name="hourly"
					disabled={!isAvailable('snowfall', models)}
				/>
				<label class="form-check-label" for="snowfall"> Snowfall </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="snow_depth"
					id="snow_depth"
					name="hourly"
					disabled={!isAvailable('snow_depth', models)}
				/>
				<label class="form-check-label" for="snow_depth"> Snow Depth </label>
			</div>
		</div>
		<div class="col-md-3">
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="weathercode"
					id="weathercode"
					name="hourly"
					disabled={!isAvailable('weathercode', models)}
				/>
				<label class="form-check-label" for="weathercode"> Weathercode </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="pressure_msl"
					id="pressure_msl"
					name="hourly"
					disabled={!isAvailable('pressure_msl', models)}
				/>
				<label class="form-check-label" for="pressure_msl"> Sealevel Pressure </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="surface_pressure"
					id="surface_pressure"
					name="hourly"
					disabled={!isAvailable('surface_pressure', models)}
				/>
				<label class="form-check-label" for="surface_pressure"> Surface Pressure </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="cloudcover"
					id="cloudcover"
					name="hourly"
					disabled={!isAvailable('cloudcover', models)}
				/>
				<label class="form-check-label" for="cloudcover"> Cloudcover Total </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="visibility"
					id="visibility"
					name="hourly"
					disabled={!isAvailable('visibility', models)}
				/>
				<label class="form-check-label" for="visibility"> Visibility </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="et0_fao_evapotranspiration"
					id="et0_fao_evapotranspiration"
					name="hourly"
					disabled={!isAvailable('et0_fao_evapotranspiration', models)}
				/>
				<label class="form-check-label" for="et0_fao_evapotranspiration">
					Reference Evapotranspiration (ET₀)
				</label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="vapor_pressure_deficit"
					id="vapor_pressure_deficit"
					name="hourly"
					disabled={!isAvailable('vapor_pressure_deficit', models)}
				/>
				<label class="form-check-label" for="vapor_pressure_deficit">
					Vapor Pressure Deficit
				</label>
			</div>
		</div>
		<div class="col-md-3">
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="windspeed_10m"
					id="windspeed_10m"
					name="hourly"
					disabled={!isAvailable('windspeed_10m', models)}
				/>
				<label class="form-check-label" for="windspeed_10m"> Wind Speed (10 m) </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="windspeed_80m"
					id="windspeed_80m"
					name="hourly"
					disabled={!isAvailable('windspeed_80m', models)}
				/>
				<label class="form-check-label" for="windspeed_80m"> Wind Speed (80 m) </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="windspeed_120m"
					id="windspeed_120m"
					name="hourly"
					disabled={!isAvailable('windspeed_120m', models)}
				/>
				<label class="form-check-label" for="windspeed_120m"> Wind Speed (120 m) </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="winddirection_10m"
					id="winddirection_10m"
					name="hourly"
					disabled={!isAvailable('winddirection_10m', models)}
				/>
				<label class="form-check-label" for="winddirection_10m"> Wind Direction (10 m) </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="winddirection_80m"
					id="winddirection_80m"
					name="hourly"
					disabled={!isAvailable('winddirection_80m', models)}
				/>
				<label class="form-check-label" for="winddirection_80m"> Wind Direction (80 m) </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="winddirection_120m"
					id="winddirection_120m"
					name="hourly"
					disabled={!isAvailable('winddirection_120m', models)}
				/>
				<label class="form-check-label" for="winddirection_120m"> Wind Direction (120 m) </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="windgusts_10m"
					id="windgusts_10m"
					name="hourly"
					disabled={!isAvailable('windgusts_10m', models)}
				/>
				<label class="form-check-label" for="windgusts_10m"> Wind Gusts (10 m) </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="temperature_80m"
					id="temperature_80m"
					name="hourly"
					disabled={!isAvailable('temperature_80m', models)}
				/>
				<label class="form-check-label" for="temperature_80m"> Temperature (80 m) </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="temperature_120m"
					id="temperature_120m"
					name="hourly"
					disabled={!isAvailable('temperature_120m', models)}
				/>
				<label class="form-check-label" for="temperature_120m"> Temperature (120 m) </label>
			</div>
		</div>
		<div class="col-md-3">
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="surface_temperature"
					id="surface_temperature"
					name="hourly"
					disabled={!isAvailable('surface_temperature', models)}
				/>
				<label class="form-check-label" for="surface_temperature"> Surface Temperature </label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="soil_temperature_0_to_10cm"
					id="soil_temperature_0_to_10cm"
					name="hourly"
					disabled={!isAvailable('soil_temperature_0_to_10cm', models)}
				/>
				<label class="form-check-label" for="soil_temperature_0_to_10cm">
					Soil Temperature (0-10 cm)
				</label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="soil_temperature_10_to_40cm"
					id="soil_temperature_10_to_40cm"
					name="hourly"
					disabled={!isAvailable('soil_temperature_10_to_40cm', models)}
				/>
				<label class="form-check-label" for="soil_temperature_10_to_40cm">
					Soil Temperature (10-40 cm)
				</label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="soil_temperature_40_to_100cm"
					id="soil_temperature_40_to_100cm"
					name="hourly"
					disabled={!isAvailable('soil_temperature_40_to_100cm', models)}
				/>
				<label class="form-check-label" for="soil_temperature_40_to_100cm">
					Soil Temperature (40-100 cm)
				</label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="soil_temperature_100_to_200cm"
					id="soil_temperature_100_to_200cm"
					name="hourly"
					disabled={!isAvailable('soil_temperature_100_to_200cm', models)}
				/>
				<label class="form-check-label" for="soil_temperature_100_to_200cm">
					Soil Temperature (100-200 cm)
				</label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="soil_moisture_0_to_10cm"
					id="soil_moisture_0_to_10cm"
					name="hourly"
					disabled={!isAvailable('soil_moisture_0_to_10cm', models)}
				/>
				<label class="form-check-label" for="soil_moisture_0_to_10cm">
					Soil Moisture (0-10 cm)
				</label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="soil_moisture_10_to_40cm"
					id="soil_moisture_10_to_40cm"
					name="hourly"
					disabled={!isAvailable('soil_moisture_10_to_40cm', models)}
				/>
				<label class="form-check-label" for="soil_moisture_10_to_40cm">
					Soil Moisture (10-40 cm)
				</label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="soil_moisture_40_to_100cm"
					id="soil_moisture_40_to_100cm"
					name="hourly"
					disabled={!isAvailable('soil_moisture_40_to_100cm', models)}
				/>
				<label class="form-check-label" for="soil_moisture_40_to_100cm">
					Soil Moisture (40-100 cm)
				</label>
			</div>
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					value="soil_moisture_100_to_200cm"
					id="soil_moisture_100_to_200cm"
					name="hourly"
					disabled={!isAvailable('soil_moisture_100_to_200cm', models)}
				/>
				<label class="form-check-label" for="soil_moisture_100_to_200cm">
					Soil Moisture (100-400 cm)
				</label>
			</div>
		</div>
	</div>

	<div class="row py-3 px-0">
		<div class="accordion" id="accordionVariables">
			<div class="accordion-item">
				<h2 class="accordion-header" id="heading-additional-variables">
					<button
						class="accordion-button collapsed py-2"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapse-additional-variables"
						aria-expanded="false"
						aria-controls="collapse-additional-variables"
					>
						Additional Variables&nbsp;<span
							class="badge rounded-pill bg-secondary checkboxcounter"
							data-count-checkboxes-of="#collapse-additional-variables">0/x</span
						>
					</button>
				</h2>
				<div
					id="collapse-additional-variables"
					class="accordion-collapse collapse"
					aria-labelledby="heading-additional-variables"
					data-bs-parent="#accordionVariables"
				>
					<div class="accordion-body row">
						<div class="col-md-6">
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value="uv_index"
									id="uv_index"
									name="hourly"
									disabled={!isAvailable('uv_index', models)}
								/>
								<label class="form-check-label" for="uv_index"> UV Index </label>
							</div>
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value="uv_index_clear_sky"
									id="uv_index_clear_sky"
									name="hourly"
									disabled={!isAvailable('uv_index_clear_sky', models)}
								/>
								<label class="form-check-label" for="uv_index_clear_sky">
									UV Index Clear Sky
								</label>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value="cape"
									id="cape"
									name="hourly"
									disabled={!isAvailable('cape', models)}
								/>
								<label class="form-check-label" for="cape"> CAPE </label>
							</div>
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value="freezinglevel_height"
									id="freezinglevel_height"
									name="hourly"
									disabled={!isAvailable('freezinglevel_height', models)}
								/>
								<label class="form-check-label" for="freezinglevel_height">
									Freezinglevel Height
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="accordion-item">
				<h2 class="accordion-header" id="heading-solar-variables">
					<button
						class="accordion-button collapsed py-2"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapse-solar-variables"
						aria-expanded="false"
						aria-controls="collapse-solar-variables"
					>
						Solar Radiation Variables&nbsp;<span
							class="badge rounded-pill bg-secondary checkboxcounter"
							data-count-checkboxes-of="#collapse-solar-variables">0/x</span
						>
					</button>
				</h2>
				<div
					id="collapse-solar-variables"
					class="accordion-collapse collapse"
					aria-labelledby="heading-solar-variables"
					data-bs-parent="#accordionVariables"
				>
					<div class="accordion-body row">
						<div class="col-md-6">
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value="shortwave_radiation"
									id="shortwave_radiation"
									name="hourly"
									disabled={!isAvailable('shortwave_radiation', models)}
								/>
								<label class="form-check-label" for="shortwave_radiation">
									Shortwave Solar Radiation
								</label>
							</div>
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value="direct_radiation"
									id="direct_radiation"
									name="hourly"
									disabled={!isAvailable('shortwave_radiation', models)}
								/>
								<label class="form-check-label" for="direct_radiation">
									Direct Solar Radiation
								</label>
							</div>
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value="diffuse_radiation"
									id="diffuse_radiation"
									name="hourly"
									disabled={!isAvailable('shortwave_radiation', models)}
								/>
								<label class="form-check-label" for="diffuse_radiation">
									Diffuse Solar Radiation
								</label>
							</div>
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value="direct_normal_irradiance"
									id="direct_normal_irradiance"
									name="hourly"
									disabled={!isAvailable('shortwave_radiation', models)}
								/>
								<label class="form-check-label" for="direct_normal_irradiance">
									Direct Normal Irradiance DNI
								</label>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value="shortwave_radiation_instant"
									id="shortwave_radiation_instant"
									name="hourly"
									disabled={!isAvailable('shortwave_radiation', models)}
								/>
								<label class="form-check-label" for="shortwave_radiation_instant">
									Shortwave Solar Radiation (Instant)
								</label>
							</div>
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value="direct_radiation_instant"
									id="direct_radiation_instant"
									name="hourly"
									disabled={!isAvailable('shortwave_radiation', models)}
								/>
								<label class="form-check-label" for="direct_radiation_instant">
									Direct Solar Radiation (Instant)
								</label>
							</div>
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value="diffuse_radiation_instant"
									id="diffuse_radiation_instant"
									name="hourly"
									disabled={!isAvailable('shortwave_radiation', models)}
								/>
								<label class="form-check-label" for="diffuse_radiation_instant">
									Diffuse Solar Radiation (Instant)
								</label>
							</div>
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									value="direct_normal_irradiance_instant"
									id="direct_normal_irradiance_instant"
									name="hourly"
									disabled={!isAvailable('shortwave_radiation', models)}
								/>
								<label class="form-check-label" for="direct_normal_irradiance_instant">
									Direct Normal Irradiance DNI (Instant)
								</label>
							</div>
						</div>
						<div class="col-md-12">
							<small class="text-muted"
								>Note: Solar radiation is averaged over the past hour. Use
								<mark>instant</mark> for radiation at the indicated time.</small
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!--<div class="row py-3 px-0">
      <h2>Daily Weather Variables <small class="text-muted">(*)</small></h2>
      <div class="col-md-6">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="weathercode" id="weathercode_daily" name="daily">
          <label class="form-check-label" for="weathercode_daily">
            Weathercode
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="temperature_2m_max" id="temperature_2m_max"
            name="daily">
          <label class="form-check-label" for="temperature_2m_max">
            Maximum Temperature (2 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="temperature_2m_min" id="temperature_2m_min"
            name="daily">
          <label class="form-check-label" for="temperature_2m_min">
            Minimum Temperature (2 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="apparent_temperature_max" id="apparent_temperature_max"
            name="daily">
          <label class="form-check-label" for="apparent_temperature_max">
            Maximum Apparent Temperature (2 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="apparent_temperature_min" id="apparent_temperature_min"
            name="daily">
          <label class="form-check-label" for="apparent_temperature_min">
            Minimum Apparent Temperature (2 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="sunrise" id="sunrise" name="daily">
          <label class="form-check-label" for="sunrise">
            Sunrise
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="sunset" id="sunset" name="daily">
          <label class="form-check-label" for="sunset">
            Sunset
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="uv_index_max" id="uv_index_max" name="daily">
          <label class="form-check-label" for="uv_index_max">
            UV Index
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="uv_index_clear_sky_max" id="uv_index_clear_sky_max" name="daily">
          <label class="form-check-label" for="uv_index_clear_sky_max">
            UV Index Clear Sky
          </label>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="precipitation_sum" id="precipitation_sum" name="daily">
          <label class="form-check-label" for="precipitation_sum">
            Precipitation Sum
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="rain_sum" id="rain_sum" name="daily">
          <label class="form-check-label" for="rain_sum">
            Rain Sum
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="showers_sum" id="showers_sum" name="daily">
          <label class="form-check-label" for="showers_sum">
            Showers Sum
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="snowfall_sum" id="snowfall_sum" name="daily">
          <label class="form-check-label" for="snowfall_sum">
            Snowfall Sum
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="precipitation_hours" id="precipitation_hours"
            name="daily">
          <label class="form-check-label" for="precipitation_hours">
            Precipitation Hours
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="precipitation_probability_max" id="precipitation_probability_max" name="daily">
          <label class="form-check-label" for="precipitation_probability_max">
            Precipitation Probability Max
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="windspeed_10m_max" id="windspeed_10m_max" name="daily">
          <label class="form-check-label" for="windspeed_10m_max">
            Maximum Wind Speed (10 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="windgusts_10m_max" id="windgusts_10m_max" name="daily">
          <label class="form-check-label" for="windgusts_10m_max">
            Maximum Wind Gusts (10 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="winddirection_10m_dominant"
            id="winddirection_10m_dominant" name="daily">
          <label class="form-check-label" for="winddirection_10m_dominant">
            Dominant Wind Direction (10 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="shortwave_radiation_sum" id="shortwave_radiation_sum"
            name="daily">
          <label class="form-check-label" for="shortwave_radiation_sum">
            Shortwave Radiation Sum
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="et0_fao_evapotranspiration"
            id="et0_fao_evapotranspiration_daily" name="daily">
          <label class="form-check-label" for="et0_fao_evapotranspiration_daily">
            Reference Evapotranspiration (ET₀)
          </label>
        </div>
      </div>
      <small class="text-muted">* Parameter <mark>timezone</mark> is mandatory</small>
    </div>-->

	<div class="row py-3 px-0">
		<h2>Settings</h2>
		<div class="col-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
					name="temperature_unit"
					id="temperature_unit"
					aria-label="Temperature Unit"
					data-default="celsius"
				>
					<option selected value="celsius">Celsius °C</option>
					<option value="fahrenheit">Fahrenheit °F</option>
				</select>
				<label for="temperature_unit">Temperature Unit</label>
			</div>
		</div>
		<div class="col-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
					name="windspeed_unit"
					id="windspeed_unit"
					aria-label="Windspeed Unit"
					data-default="kmh"
				>
					<option selected value="kmh">Km/h</option>
					<option value="ms">m/s</option>
					<option value="mph">Mph</option>
					<option value="kn">Knots</option>
				</select>
				<label for="windspeed_unit">Wind Speed Unit</label>
			</div>
		</div>
		<div class="col-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
					name="precipitation_unit"
					id="precipitation_unit"
					aria-label="Precipitation Unit"
					data-default="mm"
				>
					<option selected value="mm">Millimeter</option>
					<option value="inch">Inch</option>
				</select>
				<label for="precipitation_unit">Precipitation Unit</label>
			</div>
		</div>
		<div class="col-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
					name="timeformat"
					id="timeformat"
					aria-label="Timeformat"
					data-default="iso8601"
				>
					<option selected value="iso8601">ISO 8601 (e.g. 2022-12-31)</option>
					<option value="unixtime">Unix timestamp</option>
				</select>
				<label for="timeformat">Timeformat</label>
			</div>
		</div>
		<div class="col-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
					name="past_days"
					id="past_days"
					aria-label="Past days"
					data-default="0"
				>
					<option selected value="0">0</option>
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
		<div class="col-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
					name="forecast_days"
					id="forecast_days"
					aria-label="Forecast days"
					data-default="7"
				>
					<option value="1">1 day</option>
					<option value="3">3 days</option>
					<option selected value="7">7 days</option>
					<option value="14">14 days</option>
					<option value="16">16 days</option>
					<option value="30">30 days</option>
					<option value="35">35 days</option>
				</select>
				<label for="forecast_days">Forecast days</label>
			</div>
		</div>
		<div class="col-3">
			<div class="form-floating">
				<input
					type="text"
					class="form-control"
					data-provide="datepicker"
					data-date-format="yyyy-mm-dd"
					data-date-start-date="2022-06-08"
					value=""
					data-default=""
					name="start_date"
					id="start_date"
				/><span class="input-group-addon"><i class="glyphicon glyphicon-th" /></span>
				<label for="start_date">Start date</label>
			</div>
		</div>
		<div class="col-3">
			<div class="form-floating">
				<input
					type="text"
					class="form-control"
					data-provide="datepicker"
					data-date-format="yyyy-mm-dd"
					data-date-start-date="2022-06-08"
					value=""
					data-default=""
					name="end_date"
					id="end_date"
				/><span class="input-group-addon"><i class="glyphicon glyphicon-th" /></span>
				<label for="end_date">End date</label>
			</div>
		</div>
		<div class="col-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
					name="timezone"
					id="timezone"
					aria-label="Timezone"
					data-default="GMT"
				>
					<option value="America/Anchorage">America/Anchorage</option>
					<option value="America/Los_Angeles">America/Los_Angeles</option>
					<option value="America/Denver">America/Denver</option>
					<option value="America/Chicago">America/Chicago</option>
					<option value="America/New_York">America/New_York</option>
					<option value="America/Sao_Paulo">America/Sao_Paulo</option>
					<option selected value="GMT">GMT+0</option>
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
			</div>
		</div>
		<div class="col-12 pb-3 debug-hidden">
			<div class="form-check form-switch">
				<input
					class="form-check-input"
					type="checkbox"
					id="localhost"
					name="localhost"
					value="true"
				/>
				<label class="form-check-label" for="localhost">Use localhost server</label>
			</div>
		</div>
	</div>

	<div class="col-12">
		<button type="submit" class="btn btn-primary">Preview Chart</button>
		<button type="submit" class="btn btn-outline-primary" name="format" value="xlsx"
			>Download XLSX</button
		>
		<button type="submit" class="btn btn-outline-primary" name="format" value="csv"
			>Download CSV</button
		>
	</div>
</form>

<div class="col-12 my-4">
	<div id="container" style="height: 400px; width: 100%" />
</div>

<div class="col-12">
	<label for="api_url" class="form-label"
		>API URL (<a id="api_url_link" target="_blank" href="#">Open in new tab</a>)</label
	>
	<input type="text" class="form-control" id="api_url" readonly />
	<div id="emailHelp" class="form-text">You can copy this API URL into your application</div>
</div>

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
				<td>Geographical WGS84 coordinate of the location</td>
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
					resolved to the local time zone.</td
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
			</tr></tbody
		>
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

<script lang="ts">
	import LicenseSelector from '../LicenseSelector.svelte';
	import ResultPreview from '../ResultPreview.svelte';
	import { urlHashStore } from '$lib/url-hash-store';
	import { countVariables } from '$lib/meteo';
	import AccordionItem from '$lib/Elements/AccordionItem.svelte';
	import { fade } from 'svelte/transition';
	import CalendarEvent from 'svelte-bootstrap-icons/lib/CalendarEvent.svelte';
	import Clock from 'svelte-bootstrap-icons/lib/Clock.svelte';
	import StartEndDate from '../StartEndDate.svelte';

	import LocationSelection from '../LocationSelection.svelte';

	const defaultParameter = {
		current: [],
		hourly: [],
		location_mode: 'location_search',
		csv_coordinates: '',
		timeformat: 'iso8601',
		timezone: 'UTC',
		past_days: '0',
		past_hours: '',
		forecast_days: '5',
		forecast_hours: '',
		temporal_resolution: '',
		start_date: '',
		end_date: '',
		time_mode: 'forecast_days',
		domains: 'auto',
		cell_selection: ''
	};

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameter,
		hourly: ['pm10', 'pm2_5']
	});

	const hourly = [
		[
			{ name: 'pm10', label: 'Particulate Matter PM<sub>10</sub>' },
			{ name: 'pm2_5', label: 'Particulate Matter PM<sub>2.5</sub>' },
			{ name: 'carbon_monoxide', label: 'Carbon Monoxide CO' },
			{ name: 'nitrogen_dioxide', label: 'Nitrogen Dioxide NO<sub>2</sub>' },
			{ name: 'sulphur_dioxide', label: 'Sulphur Dioxide SO<sub>2</sub>' },
			{ name: 'ozone', label: 'Ozone O<sub>3</sub>' }
		],
		[
			{ name: 'aerosol_optical_depth', label: 'Aerosol Optical Depth' },
			{ name: 'dust', label: 'Dust' },
			{ name: 'uv_index', label: 'UV Index' },
			{ name: 'uv_index_clear_sky', label: 'UV Index Clear Sky' },
			{ name: 'ammonia', label: 'Ammonia NH<sub>3</sub> <small class="text-muted">(*)</small>' }
		],
		[
			{ name: 'alder_pollen', label: 'Alder Pollen <small class="text-muted">(*)</small>' },
			{ name: 'birch_pollen', label: 'Birch Pollen <small class="text-muted">(*)</small>' },
			{ name: 'grass_pollen', label: 'Grass Pollen <small class="text-muted">(*)</small>' },
			{ name: 'mugwort_pollen', label: 'Mugwort Pollen <small class="text-muted">(*)</small>' },
			{ name: 'olive_pollen', label: 'Olive Pollen <small class="text-muted">(*)</small>' },
			{ name: 'ragweed_pollen', label: 'Ragweed Pollen <small class="text-muted">(*)</small>' }
		]
	];

	const current = [
		[
			{ name: 'european_aqi', label: 'European AQI' },
			{ name: 'us_aqi', label: 'United States AQI' },
			{ name: 'pm10', label: 'Particulate Matter PM<sub>10</sub>' },
			{ name: 'pm2_5', label: 'Particulate Matter PM<sub>2.5</sub>' },
			{ name: 'carbon_monoxide', label: 'Carbon Monoxide CO' },
			{ name: 'nitrogen_dioxide', label: 'Nitrogen Dioxide NO<sub>2</sub>' },
			{ name: 'sulphur_dioxide', label: 'Sulphur Dioxide SO<sub>2</sub>' },
			{ name: 'ozone', label: 'Ozone O<sub>3</sub>' }
		],
		[
			{ name: 'aerosol_optical_depth', label: 'Aerosol Optical Depth' },
			{ name: 'dust', label: 'Dust' },
			{ name: 'uv_index', label: 'UV Index' },
			{ name: 'uv_index_clear_sky', label: 'UV Index Clear Sky' },
			{ name: 'ammonia', label: 'Ammonia NH<sub>3</sub> <small class="text-muted">(*)</small>' }
		],
		[
			{ name: 'alder_pollen', label: 'Alder Pollen <small class="text-muted">(*)</small>' },
			{ name: 'birch_pollen', label: 'Birch Pollen <small class="text-muted">(*)</small>' },
			{ name: 'grass_pollen', label: 'Grass Pollen <small class="text-muted">(*)</small>' },
			{ name: 'mugwort_pollen', label: 'Mugwort Pollen <small class="text-muted">(*)</small>' },
			{ name: 'olive_pollen', label: 'Olive Pollen <small class="text-muted">(*)</small>' },
			{ name: 'ragweed_pollen', label: 'Ragweed Pollen <small class="text-muted">(*)</small>' }
		]
	];

	const aqi_european = [
		[
			{ name: 'european_aqi', label: 'European AQI' },
			{ name: 'european_aqi_pm2_5', label: 'European AQI PM<sub>2.5</sub>' },
			{ name: 'european_aqi_pm10', label: 'European AQI PM<sub>10</sub>' },
			{ name: 'european_aqi_nitrogen_dioxide', label: 'European AQI NO<sub>2</sub>' },
			{ name: 'european_aqi_ozone', label: 'European AQI O<sub>3</sub>' },
			{ name: 'european_aqi_sulphur_dioxide', label: 'European AQI SO<sub>2</sub>' },
		]
	];

	const aqi_united_states = [
		[
			{ name: 'us_aqi', label: 'United States AQI' },
			{ name: 'us_aqi_pm2_5', label: 'United States AQI PM<sub>2.5</sub>' },
			{ name: 'us_aqi_pm10', label: 'United States AQI PM<sub>10</sub>' },
			{ name: 'us_aqi_nitrogen_dioxide', label: 'United States AQI NO<sub>2</sub>' },
			{ name: 'us_aqi_carbon_monoxide', label: 'United States AQI CO' },
			{ name: 'us_aqi_ozone', label: 'United States AQI O<sub>3</sub>' },
			{ name: 'us_aqi_sulphur_dioxide', label: 'United States AQI SO<sub>2</sub>' }
		]
	];
</script>

<svelte:head>
	<title>💨 Air Quality API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/air-quality-api" />
	<meta
		name="description"
		content="Get accurate forecasts for gases, particulate matter (PM), and pollen with the Air Quality API. Access this powerful API for free for non-commercial use. Stay informed about air quality conditions and make informed decisions based on reliable data. Enhance your applications and services with real-time air quality information."
	/>
</svelte:head>

<form method="get" action="https://air-quality-api.open-meteo.com/v1/air-quality">
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
									<option value="5">5 days (default)</option>
									<option value="7">7 days</option>
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
		<h2>Hourly Air Quality Variables</h2>
		{#each hourly as group}
			<div class="col-md-4">
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
						<label class="form-check-label" for="{e.name}_hourly">{@html e.label}</label>
					</div>
				{/each}
			</div>
		{/each}
		<small class="text-muted"
			>* Only available in Europe during pollen season with 4 days forecast</small
		>
	</div>

	<div class="row py-3 px-0">
		<div class="accordion" id="accordionVariables">
			<AccordionItem
				id="european_air_quality_index"
				title="European Air Quality Index"
				count={countVariables(aqi_european, $params.hourly)}
			>
				{#each aqi_european as group}
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
								<label class="form-check-label" for="{e.name}_hourly">{@html e.label}</label>
							</div>
						{/each}
					</div>
				{/each}
				<div class="col-md-6">
					<p>
						<small class="text-muted"
							>Note: The European Air Quality Index (AQI) ranges from 0-20 (good), 20-40 (fair),
							40-60 (moderate), 60-80 (poor), 80-100 (very poor) and exceeds 100 for extremely poor
							conditions.</small
						>
					</p>
					<p>
						<small class="text-muted"
							>Pollutant thresholds in μg/m³ from the <a
								href="https://www.eea.europa.eu/themes/air/air-quality-index"
								>European Environment Agency (EAA)</a
							> are given on the right. Particulate Matter (PM) is using a 24 hour roling average, while
							gases use hourly values.</small
						>
					</p>
				</div>
				<div class="col-md-12">
					<div class="table-responsive">
						<table class="table" id="airquality_table">
							<thead>
								<tr>
									<th scope="col">Pollutant <small class="text-muted">(μg/m³)</small></th>
									<th scope="col">Timespan</th>
									<th scope="col">Good</th>
									<th scope="col">Fair</th>
									<th scope="col">Moderate</th>
									<th scope="col">Poor</th>
									<th scope="col">Very poor</th>
									<th scope="col">Extremely poor</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row">PM<sub>2.5</sub></th>
									<td>24h</td>
									<td>0-10</td>
									<td>10-20</td>
									<td>20-25</td>
									<td>25-50</td>
									<td>50-75</td>
									<td>75-800</td>
								</tr>
								<tr>
									<th scope="row">PM<sub>10</sub></th>
									<td>24h</td>
									<td>0-20</td>
									<td>20-40</td>
									<td>40-50</td>
									<td>50-100</td>
									<td>100-150</td>
									<td>150-1200</td>
								</tr>
								<tr>
									<th scope="row">NO<sub>2</sub></th>
									<td>1h</td>
									<td>0-40</td>
									<td>40-90</td>
									<td>90-120</td>
									<td>120-230</td>
									<td>230-340</td>
									<td>340-1000</td>
								</tr>
								<tr>
									<th scope="row">O<sub>3</sub></th>
									<td>1h</td>
									<td>0-50</td>
									<td>50-100</td>
									<td>100-130</td>
									<td>130-240</td>
									<td>240-380</td>
									<td>380-800</td>
								</tr>
								<tr>
									<th scope="row">SO<sub>2</sub></th>
									<td>1h</td>
									<td>0-100</td>
									<td>100-200</td>
									<td>200-350</td>
									<td>350-500</td>
									<td>500-750</td>
									<td>750-1250</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</AccordionItem>
			<AccordionItem
				id="united_states_air_quality_index"
				title="United States Air Quality Index "
				count={countVariables(aqi_united_states, $params.hourly)}
			>
				{#each aqi_united_states as group}
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
								<label class="form-check-label" for="{e.name}_hourly">{@html e.label}</label>
							</div>
						{/each}
					</div>
				{/each}
				<div class="col-md-6">
					<p>
						<small class="text-muted"
							>Note: The United States Air Quality Index (AQI) ranges from 0-50 (good), 51-100
							(moderate), 101-150 (unhealthy for sensitive groups), 151-200 (unhealthy), 201-300
							(very unhealthy) and 301-500 (hazardous).</small
						>
					</p>
					<p>
						<small class="text-muted"
							>Pollutant thresholds from the <a
								href="https://en.wikipedia.org/wiki/Air_quality_index#United_States"
								>United States Environmental Protection Agency (EPA)</a
							>
							are given below. Some thresholds are in parts per billion (ppb) instead of μg/m³. Conversion
							explained
							<a
								href="https://www.breeze-technologies.de/blog/air-pollution-how-to-convert-between-mgm3-µgm3-ppm-ppb/"
								>here</a
							>. Particulate Matter (PM) is using a 24 hour roling average, ozone and carbon
							monoxide use 8 hour averages, other gases use hourly values.</small
						>
					</p>
				</div>
				<div class="col-md-12">
					<div class="table-responsive">
						<table class="table" id="airquality_table_us">
							<thead>
								<tr>
									<th scope="col">Pollutant</th>
									<th scope="col">Timespan</th>
									<th scope="col">Good</th>
									<th scope="col">Moderate</th>
									<th scope="col">Unhealthy for<br />Sensitive Groups</th>
									<th scope="col">Unhealthy</th>
									<th scope="col">Very Unhealthy</th>
									<th scope="col" colspan="2">Hazardous</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row">O<sub>3</sub> <small class="text-muted">(ppb)</small></th>
									<td>8h</td>
									<td>0-55</td>
									<td>55-70</td>
									<td>70-85</td>
									<td>85-105</td>
									<td>105-200</td>
									<td>-</td>
									<td>-</td>
								</tr>
								<tr>
									<th scope="row">O<sub>3</sub> <small class="text-muted">(ppb)</small></th>
									<td>1h</td>
									<td>-</td>
									<td>-</td>
									<td>125-165</td>
									<td>165-205</td>
									<td>205-405</td>
									<td>405-505</td>
									<td>505-605</td>
								</tr>
								<tr>
									<th scope="row">PM<sub>2.5</sub> <small class="text-muted">(μg/m³)</small></th>
									<td>24h</td>
									<td>0-12</td>
									<td>12-35.5</td>
									<td>35.5-55.5</td>
									<td>55.5-150.5</td>
									<td>150.5-250.5</td>
									<td>250.5-350.5</td>
									<td>350.5-500.5</td>
								</tr>
								<tr>
									<th scope="row">PM<sub>10</sub> <small class="text-muted">(μg/m³)</small></th>
									<td>24h</td>
									<td>0-55</td>
									<td>55-155</td>
									<td>155-255</td>
									<td>255-355</td>
									<td>355-425</td>
									<td>425-505</td>
									<td>505-605</td>
								</tr>
								<tr>
									<th scope="row">CO <small class="text-muted">(ppm)</small></th>
									<td>8h</td>
									<td>0-4.5</td>
									<td>4.5-9.5</td>
									<td>9.5-12.5</td>
									<td>12.5-15.5</td>
									<td>15.5-30.5</td>
									<td>30.5-40.5</td>
									<td>40.5-50.5</td>
								</tr>
								<tr>
									<th scope="row">SO<sub>2</sub> <small class="text-muted">(ppb)</small></th>
									<td>1h</td>
									<td>0-35</td>
									<td>35-75</td>
									<td>75-185</td>
									<td>185-305</td>
									<td>-</td>
									<td>-</td>
									<td>-</td>
								</tr>
								<tr>
									<th scope="row">SO<sub>2</sub> <small class="text-muted">(ppb)</small></th>
									<td>24h</td>
									<td>-</td>
									<td>-</td>
									<td>-</td>
									<td>-</td>
									<td>305-605</td>
									<td>605-805</td>
									<td>805-1005</td>
								</tr>
								<tr>
									<th scope="row">NO<sub>2</sub> <small class="text-muted">(ppb)</small></th>
									<td>1h</td>
									<td>0-54</td>
									<td>54-100</td>
									<td>100-360</td>
									<td>360-650</td>
									<td>650-1250</td>
									<td>1250-1650</td>
									<td>1650-2050</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</AccordionItem>
			<AccordionItem
				id="additional-variables"
				title="Additional Options"
			>
				<div class="col-md-12 mb-3">
					<small class="text-muted"
						>Note: You can further adjust the forecast time range for hourly weather variables using <mark>&forecast_hours=</mark> and <mark>&past_hours=</mark> as shown below.
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
		</div>
	</div>

	<div class="row py-3 px-0">
		<h2>Current Conditions</h2>
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
						<label class="form-check-label" for="{e.name}_current">{@html e.label}</label>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="row py-3 px-0">
		<h2>Settings</h2>
		<div class="col-3 mb-3">
			<div class="form-floating mb-3">
				<select
					class="form-select"
					name="domains"
					id="domains"
					aria-label="Domains"
					bind:value={$params.domains}
				>
					<option value="auto">Global + European</option>
					<option value="cams_global">Global (40 km)</option>
					<option value="cams_europe">European (11 km)</option>
				</select>
				<label for="domains">Domain</label>
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

<ResultPreview {params} {defaultParameter} type="air-quality" action="air-quality" sdk_type="air_quality_api"/>

<div class="col-12 py-5">
	<h2 id="api-documentation">API Documentation</h2>
	<p>
		The API endpoint <mark>/v1/air-quality</mark> accepts a geographical coordinate, a list of weather
		variables and responds with a JSON hourly air quality forecast for 5 days. Time always starts at
		0:00 today.
	</p>
	<p>
		Forecast is based on the 11 kilometer <a
			href="https://ads.atmosphere.copernicus.eu/cdsapp#!/dataset/cams-europe-air-quality-forecasts?tab=overview"
			target="_blank">CAMS European air quality forecast</a
		>
		and the 40 kilometer
		<a
			href="https://ads.atmosphere.copernicus.eu/cdsapp#!/dataset/cams-global-atmospheric-composition-forecasts?tab=overview"
			target="_blank">CAMS global atmospheric composition forecasts</a
		>. The European and global domain are not coupled and may show different forecasts.
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
					<th scope="row">current</th>
					<td>String array</td>
					<td>No</td>
					<td />
					<td>A list of variables to get current conditions.</td>
				</tr>
				<tr>
					<th scope="row">domains</th>
					<td>String</td>
					<td>No</td>
					<td><mark>auto</mark></td>
					<td
						>Automatically combine both domains <mark>auto</mark> or specifically select the
						European
						<mark>cams_europe</mark> or global domain <mark>cams_global</mark>.
					</td>
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
					<td>Integer (0-92)</td>
					<td>No</td>
					<td><mark>0</mark></td>
					<td
						>If <mark>past_days</mark> is set, yesterday or the day before yesterday data are also returned.</td
					>
				</tr>
				<tr>
					<th scope="row">forecast_days</th>
					<td>Integer (0-7)</td>
					<td>No</td>
					<td><mark>5</mark></td>
					<td>Per default, 5 days are returned. Up to 7 days of forecast are possible.</td>
				</tr>
				<tr>
					<th scope="row">forecast_hours<br />past_hours</th>
					<td>Integer (&gt;0)</td>
					<td>No</td>
					<td></td>
					<td>Similar to forecast_days, the number of timesteps of hourly data can controlled. Instead of using the current day as a reference, the current hour is used. </td>
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
					<th scope="row">start_hour<br />end_hour</th>
					<td>String (yyyy-mm-ddThh:mm)</td>
					<td>No</td>
					<td />
					<td
						>The time interval to get weather data for hourly data. Time must be specified as an ISO8601 date (e.g.
						<mark>2022-06-30T12:00</mark>).
					</td>
				</tr>
				<tr>
					<th scope="row">cell_selection</th>
					<td>String</td>
					<td>No</td>
					<td><mark>nearest</mark></td>
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
					<th scope="row">pm10<br />pm2_5</th>
					<td>Instant</td>
					<td>μg/m³</td>
					<td
						>Particulate matter with diameter smaller than 10 µm (PM<sub>10</sub>) and smaller than
						2.5 µm (PM<sub>2.5</sub>) close to surface (10 meter above ground)</td
					>
				</tr>
				<tr>
					<th scope="row">carbon_monoxide<br />nitrogen_dioxide<br />sulphur_dioxide<br />ozone</th>
					<td>Instant</td>
					<td>μg/m³</td>
					<td>Atmospheric gases close to surface (10 meter above ground)</td>
				</tr>
				<tr>
					<th scope="row">ammonia</th>
					<td>Instant</td>
					<td>μg/m³</td>
					<td>Ammonia concentration. Only available for Europe.</td>
				</tr>
				<tr>
					<th scope="row">aerosol_optical_depth</th>
					<td>Instant</td>
					<td>Dimensionless</td>
					<td>Aerosol optical depth at 550 nm of the entire atmosphere to indicate haze.</td>
				</tr>
				<tr>
					<th scope="row">dust</th>
					<td>Instant</td>
					<td>μg/m³</td>
					<td>Saharan dust particles close to surface level (10 meter above ground).</td>
				</tr>
				<tr>
					<th scope="row">uv_index<br />uv_index_clear_sky</th>
					<td>Instant</td>
					<td>Index</td>
					<td
						>UV index considering clouds and clear sky. See <a
							href="https://confluence.ecmwf.int/display/CUSF/CAMS+global+UV+index"
							target="_blank">ECMWF UV Index recommendation</a
						> for more information</td
					>
				</tr>
				<tr>
					<th scope="row">
						alder_pollen<br />birch_pollen<br />grass_pollen<br />mugwort_pollen<br
						/>olive_pollen<br />ragweed_pollen
					</th>
					<td>Instant</td>
					<td>Grains/m³</td>
					<td
						>Pollen for various plants. Only available in Europe as provided by CAMS European Air
						Quality forecast.
					</td>
				</tr>
				<tr>
					<th scope="row">
						european_aqi<br />european_aqi_pm2_5<br />european_aqi_pm10<br />european_aqi_nitrogen_dioxide<br
						/>european_aqi_ozone<br />european_aqi_sulphur_dioxide
					</th>
					<td>Instant</td>
					<td>European AQI</td>
					<td
						>European Air Quality Index (AQI) calculated for different particulate matter and gases
						individually. The consolidated <mark>european_aqi</mark> returns the maximum of all individual
						indices. Ranges from 0-20 (good), 20-40 (fair), 40-60 (moderate), 60-80 (poor), 80-100 (very
						poor) and exceeds 100 for extremely poor conditions.</td
					>
				</tr>
				<tr>
					<th scope="row">
						us_aqi<br />us_aqi_pm2_5<br />us_aqi_pm10<br />us_aqi_nitrogen_dioxide<br />us_aqi_ozone<br
						/>us_aqi_sulphur_dioxide<br />us_aqi_carbon_monoxide
					</th>
					<td>Instant</td>
					<td>U.S. AQI</td>
					<td
						>United States Air Quality Index (AQI) calculated for different particulate matter and
						gases individually. The consolidated <mark>us_aqi</mark> returns the maximum of all individual
						indices. Ranges from 0-50 (good), 51-100 (moderate), 101-150 (unhealthy for sensitive groups),
						151-200 (unhealthy), 201-300 (very unhealthy) and 301-500 (hazardous).</td
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
  "elevation": 44.812,
  "generationtime_ms": 2.2119,
  "utc_offset_seconds": 0,
  "timezone": "Europe/Berlin",
  "timezone_abbreviation": "CEST",
  "hourly": {
    "time": ["2022-07-01T00:00", "2022-07-01T01:00", "2022-07-01T02:00", ...],
    "pm10": [1, 1.7, 1.7, 1.5, 1.5, 1.8, 2.0, 1.9, 1.3, ...]
  },
  "hourly_units": {
    "pm10": "μg/m³"
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

<h2 id="citation">Citation & Acknowledgement</h2>
<p>
	METEO FRANCE, Institut national de l'environnement industriel et des risques (Ineris), Aarhus
	University, Norwegian Meteorological Institute (MET Norway), Jülich Institut für Energie- und
	Klimaforschung (IEK), Institute of Environmental Protection – National Research Institute
	(IEP-NRI), Koninklijk Nederlands Meteorologisch Instituut (KNMI), Nederlandse Organisatie voor
	toegepast-natuurwetenschappelijk onderzoek (TNO), Swedish Meteorological and Hydrological
	Institute (SMHI), Finnish Meteorological Institute (FMI), Italian National Agency for New
	Technologies, Energy and Sustainable Economic Development (ENEA) and Barcelona Supercomputing
	Center (BSC) (2022): CAMS European air quality forecasts, ENSEMBLE data. Copernicus Atmosphere
	Monitoring Service (CAMS) Atmosphere Data Store (ADS). (Updated twice daily).
</p>
<p>
	All users of Open-Meteo data must provide a clear attribution to <a
		href="https://confluence.ecmwf.int/display/CKB/CAMS+Regional%3A+European+air+quality+analysis+and+forecast+data+documentation\#CAMSRegional:Europeanairqualityanalysisandforecastdatadocumentation-Howtoacknowledge,citeandrefertothedata"
		target="_blank">CAMS ENSEMBLE data provider</a
	> as well as a reference to Open-Meteo.
</p>

<style>
	#airquality_table tbody td:nth-child(3) {
		background-color: rgba(80, 240, 230, 1);
		color: #333;
	}

	#airquality_table tbody td:nth-child(4) {
		background-color: rgba(80, 204, 170, 1);
		color: white;
	}

	#airquality_table tbody td:nth-child(5) {
		background-color: rgba(240, 230, 65, 1);
		color: #333;
	}

	#airquality_table tbody td:nth-child(6) {
		background-color: rgba(255, 80, 80, 1);
		color: white;
	}

	#airquality_table tbody td:nth-child(7) {
		background-color: rgba(150, 0, 50, 1);
		color: white;
	}

	#airquality_table tbody td:nth-child(8) {
		background-color: rgba(125, 33, 129, 1);
		color: white;
	}

	#airquality_table_us tbody td:nth-child(3) {
		background-color: rgba(80, 204, 170, 1);
		color: white;
	}

	#airquality_table_us tbody td:nth-child(4) {
		background-color: rgba(240, 230, 65, 1);
		color: #333;
	}

	#airquality_table_us tbody td:nth-child(5) {
		background-color: rgb(240, 167, 65);
		color: #333;
	}

	#airquality_table_us tbody td:nth-child(6) {
		background-color: rgba(255, 80, 80, 1);
		color: white;
	}

	#airquality_table_us tbody td:nth-child(7) {
		background-color: rgba(150, 0, 50, 1);
		color: white;
	}

	#airquality_table_us tbody td:nth-child(8),
	#airquality_table_us tbody td:nth-child(9) {
		background-color: rgba(125, 33, 129, 1);
		color: white;
	}
</style>

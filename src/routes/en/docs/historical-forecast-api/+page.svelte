<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/utils/url-hash-store';
	import {
		altitudeAboveSeaLevelMeters,
		countPressureVariables,
		countVariables,
		sliceIntoChunks
	} from '$lib/utils/meteo';

	import DatePicker from '$lib/components/date/date-picker.svelte';
	import ResultPreview from '$lib/components/highcharts/result-preview.svelte';
	import AccordionItem from '$lib/components/AccordionItem.svelte';
	import LicenseSelector from '$lib/components/license/license-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';

	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select/index';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

	import {
		daily,
		hourly,
		levels,
		models,
		minutely_15,
		solarVariables,
		defaultParameters,
		pressureVariables,
		additionalVariables
	} from './options';

	var d = new Date();
	d.setDate(d.getDate() - 2);
	let endDateDefault = d.toISOString().split('T')[0];
	d.setDate(d.getDate() - 14);
	let startDateDefault = d.toISOString().split('T')[0];
	let startDate = '1940-01-01';
	let endDate = $state('');

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		start_date: startDateDefault,
		end_date: endDateDefault,
		...defaultParameters,
		hourly: ['temperature_2m']
	});

	onMount(async () => {
		var d = new Date();
		endDate = d.toISOString().split('T')[0];
		d.setDate(d.getDate() - 1);
		if ($params.end_date == startDateDefault) {
			$params.end_date = d.toISOString().split('T')[0];
		}
		d.setDate(d.getDate() - 14);
		if ($params.start_date == startDateDefault) {
			$params.start_date = d.toISOString().split('T')[0];
		}
	});

	let pressureVariablesTab = $state('temperature');

	let timezoneInvalid = $derived($params.timezone == 'UTC' && $params.daily.length > 0);
</script>

<svelte:head>
	<title>Historical Forecast API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/historical-forecast-api" />
	<meta
		name="description"
		content="Access accurate and comprehensive historical weather data with Open-Meteo's API. Explore global weather trends, analyze climate change, and optimize forecasts using reanalysis models and high-resolution weather data. Visit our documentation for detailed variables and parameters."
	/>
</svelte:head>

<Alert.Root variant="informative">
	<Alert.Description>
		This API provides access to archived high-resolution weather model data from the <a
			href={'/en/docs'}>Weather Forecast API</a
		>. The data is continuously archived and updated daily. For more information read the
		<a
			href="https://openmeteo.substack.com/p/introducing-the-historical-forecast"
			title="Introducing the Historical Forecast API">announcement blog article</a
		>.
	</Alert.Description>
</Alert.Root>

<form method="get" class="mt-3" action="https://historical-forecast-api.open-meteo.com/v1/forecast">
	<LocationSelection bind:params={$params} />

	<div class="flex flex-row">
		<div>
			<DatePicker
				bind:start_date={$params.start_date}
				bind:end_date={$params.end_date}
				{startDate}
				{endDate}
			/>
		</div>
		<div>
			<p>Past weather forecasts from 2022 onwards are available.</p>
			<p>
				Quick:
				<button
					class="btn btn-outline-primary btn-sm"
					onclick={(e) => {
						e.preventDefault();
						$params.start_date = '2022-01-01';
						$params.end_date = '2022-12-31';
					}}>2022</button
				>
				<button
					class="btn btn-outline-primary btn-sm"
					onclick={(e) => {
						e.preventDefault();
						$params.start_date = '2023-01-01';
						$params.end_date = '2023-12-31';
					}}>2023</button
				>
				<button
					class="btn btn-outline-primary btn-sm"
					onclick={(e) => {
						e.preventDefault();
						$params.start_date = '2024-01-01';
						$params.end_date = endDate;
					}}>2024</button
				>
			</p>
		</div>
	</div>

	<div>
		<h2>Hourly Weather Variables</h2>
		{#each hourly as group}
			<div>
				{#each group as e}
					<div>
						<input
							type="checkbox"
							value={e.name}
							id="{e.name}_hourly"
							name="hourly"
							bind:group={$params.hourly}
						/>
						<label for="{e.name}_hourly">{e.label}</label>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div>
		<Accordion.Root class="rounded-lg border" multiple={true}>
			<AccordionItem
				id="additional-variables"
				title="Additional Variables And Options"
				count={countVariables(additionalVariables, $params.hourly)}
			>
				{#each additionalVariables as group}
					<div>
						{#each group as e}
							<div>
								<input
									type="checkbox"
									value={e.name}
									id="{e.name}_hourly"
									name="hourly"
									bind:group={$params.hourly}
								/>
								<label for="{e.name}_hourly">{e.label}</label>
							</div>
						{/each}
					</div>
				{/each}

				<div>
					<div class="  mb-6">
						<select
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
				<div>
					<div class="  mb-6">
						<select
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
					<div>
						{#each group as e}
							<div>
								<input
									type="checkbox"
									value={e.name}
									id="{e.name}_hourly"
									name="hourly"
									bind:group={$params.hourly}
								/>
								<label for="{e.name}_hourly">{e.label}</label>
							</div>
						{/each}
					</div>
				{/each}
				<div class="  mb-3">
					<small class="text-muted-foreground"
						>Note: Solar radiation is averaged over the past hour. Use
						<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI
						please specify Tilt and Azimuth below.</small
					>
				</div>
				<div>
					<div>
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
				<div>
					<div>
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
				<div class="  align-items-start">
					<div class="nav flex-column me-3" id="v-pills-tab" aria-orientation="vertical">
						{#each pressureVariables as variable, i}
							<button
								class="nav-link text-nowrap text-start"
								class:active={pressureVariablesTab == variable.name}
								id="v-pills-{variable.name}-tab"
								type="button"
								aria-controls="v-pills-{variable.name}"
								aria-selected={pressureVariablesTab == variable.name}
								onclick={() => (pressureVariablesTab = variable.name)}>{variable.label}</button
							>
						{/each}
					</div>
					<div id="v-pills-tabContent">
						{#each pressureVariables as variable}
							<div
								class="tab-pane fade"
								class:active={pressureVariablesTab == variable.name}
								class:show={pressureVariablesTab == variable.name}
								id="v-pills-{variable.name}"
								aria-labelledby="v-pills-{variable.name}-tab"
							>
								<div>
									{#each sliceIntoChunks(levels, levels.length / 3 + 1) as chunk}
										<div class="col-lg-4">
											{#each chunk as level}
												<div>
													<input
														type="checkbox"
														value="{variable.name}_{level}hPa"
														id="{variable.name}_{level}hPa"
														name="hourly"
														bind:group={$params.hourly}
													/>
													<label for="{variable.name}_{level}hPa">
														{level} hPa
														<small class="text-muted-foreground"
															>({altitudeAboveSeaLevelMeters(level)})</small
														>
													</label>
												</div>
											{/each}
										</div>
									{/each}
								</div>
							</div>
						{/each}
						<div class="mt-3">
							<small class="text-muted-foreground"
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
					<div class="  mb-3">
						{#each group as e}
							<div>
								<input
									type="checkbox"
									value={e.name}
									id="{e.name}_model"
									name="models"
									bind:group={$params.models}
								/>
								<label for="{e.name}_model">{e.label}</label>
							</div>
						{/each}
					</div>
				{/each}
				<div>
					<small class="text-muted-foreground"
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
					<div class="  mb-3">
						{#each group as e}
							<div>
								<input
									type="checkbox"
									value={e.name}
									id="{e.name}_minutely_15"
									name="minutely_15"
									bind:group={$params.minutely_15}
								/>
								<label for="{e.name}_minutely_15">{e.label}</label>
							</div>
						{/each}
					</div>
				{/each}
				{#each solarVariables as group}
					<div>
						{#each group as e}
							<div>
								<input
									type="checkbox"
									value={e.name}
									id="{e.name}_minutely_15"
									name="minutely_15"
									bind:group={$params.minutely_15}
								/>
								<label for="{e.name}_minutely_15">{e.label}</label>
							</div>
						{/each}
					</div>
				{/each}
				<div class="  mb-3">
					<small class="text-muted-foreground"
						>Note: Only available in Central Europe and North America. Other regions use
						interpolated hourly data. Solar radiation is averaged over the 15 minutes. Use
						<mark>instant</mark> for radiation at the indicated time.</small
					>
				</div>
			</AccordionItem>
		</Accordion.Root>
	</div>

	<div>
		<h2>Daily Weather Variables</h2>
		{#each daily as group}
			<div>
				{#each group as e}
					<div>
						<input
							type="checkbox"
							value={e.name}
							id="{e.name}_daily"
							name="daily"
							bind:group={$params.daily}
						/>
						<label for="{e.name}_daily">{e.label}</label>
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

	<div>
		<h2 class="mb-2 mt-6 text-2xl">Settings</h2>
		<div>
			<div class="  mb-3">
				<select
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
		<div>
			<div class="  mb-3">
				<select
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
		<div>
			<div class="  mb-3">
				<select
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
		<div>
			<div class="  mb-3">
				<select
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

<ResultPreview {params} {defaultParameters} type="historical-forecast" useStockChart={true} />

<div>
	<h2 id="data-sources">Data Source</h2>
	<p>
		The weather data precisely aligns with the weather forecast API, created by continuously
		integrating weather forecast model data. Each update from the weather models' initial hours is
		compiled into a seamless time series. This extensive dataset is ideal for training machine
		learning models and combining them with forecast data to generate optimized predictions.
	</p>
	<p>
		Weather models are initialized using data from weather stations, satellites, radar, airplanes,
		soundings, and buoys. With high update frequencies of 1, 3, or 6 hours, the resulting time
		series is nearly as accurate as direct measurements and offers global coverage. In regions like
		North America and Central Europe, the difference from local weather stations is minimal.
		However, for precise values such as precipitation, local measurements are preferable when
		available.
	</p>
	<p>
		The Historical Forecast API archives comprehensive data, including atmospheric pressure levels,
		from all accessible weather forecast models. Depending on the model and public archive
		availability, data is available starting from 2021 or 2022.
	</p>
	<p>
		The default <mark>Best Match</mark> option selects the most suitable high-resolution weather models
		for any global location, though users can also manually specify the weather model. Open-Meteo utilizes
		the following weather forecast models:
	</p>
	<div class="table-responsive">
		<table
			class="mt-6 w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_tr]:border-b"
		>
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
					<th scope="row" rowspan="5">NOAA NCEP</th>
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
					<td>2018-01-01</td>
				</tr>
				<tr>
					<td>NBM</td>
					<td>U.S. Conus</td>
					<td>3 km</td>
					<td>1-Hourly</td>
					<td>Every hour</td>
					<td>2024-10-08</td>
				</tr>
				<tr>
					<td>GFS GraphCast</td>
					<td>Global</td>
					<td>0.25° (~25 km)</td>
					<td>6-Hourly</td>
					<td>Every 6 hours</td>
					<td>2024-02-05</td>
				</tr>
				<tr>
					<th scope="row" rowspan="4">Météo-France</th>
					<td>ARPEGE World</td>
					<td>Global</td>
					<td>0.25° (~25 km)</td>
					<td>1-Hourly</td>
					<td>Every 6 hours</td>
					<td>2024-01-02</td>
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
					<td>2024-01-02</td>
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
					<th scope="row" rowspan="3">ECMWF</th>
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
					<td>AIFS 0.25°</td>
					<td>Global</td>
					<td>0.25° (~25 km)</td>
					<td>6-Hourly</td>
					<td>Every 6 hours</td>
					<td>2024-03-13</td>
				</tr>
				<tr>
					<th scope="row" rowspan="2">UK Met Office</th>
					<td>UKMO Global</td>
					<td>Global</td>
					<td>0.09° (~10 km)</td>
					<td>Hourly</td>
					<td>Every 6 hours</td>
					<td>2022-03-01</td>
				</tr>
				<tr>
					<td>UKMO UKV</td>
					<td>UK and Ireland</td>
					<td>2 km</td>
					<td>Hourly</td>
					<td>Every hour</td>
					<td>2022-03-01</td>
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
					<th scope="row" rowspan="3">COSMO 2I & 5M AM ARPAE ARPAP Italy</th>
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
				<tr>
					<th scope="row">DMI</th>
					<td>HARMONIE AROME DINI</td>
					<td>Central & Northern Europe</td>
					<td>2 km</td>
					<td>1-Hourly</td>
					<td>Every 3 hours</td>
					<td>2024-07-01</td>
				</tr>
				<tr>
					<th scope="row" rowspan="2">KNMI</th>
					<td>HARMONIE AROME Netherlands</td>
					<td>Netherlands, Belgium</td>
					<td>2 km</td>
					<td>1-Hourly</td>
					<td>Every hour</td>
					<td>2024-07-01</td>
				</tr>
				<tr>
					<td>HARMONIE AROME Europe</td>
					<td>Central & Northern Europe up to Iceland</td>
					<td>5.5 km</td>
					<td>1-Hourly</td>
					<td>Every hour</td>
					<td>2024-07-01</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<div class=" py-2">
	<h2 id="data-sources">Which Historical Weather Data to Use?</h2>
	<p>
		Open-Meteo provides various datasets for historical weather data: the Historical Weather API and
		the Historical Forecast API. For novice users expecting a single, definitive source of weather
		data, this can be confusing. In reality, only a small fraction of the Earth's surface is covered
		by weather stations with accurate and consistent measurements. To address this gap, numerical
		weather models are used to approximate past global weather.
	</p>
	<ul>
		<li>
			<strong><a href={'/en/docs/historical-weather-api'}>Historical Weather API:</a></strong> This dataset
			is based on reanalysis weather models, particularly ERA5. It offers data from 1940 onwards with
			reasonable consistency throughout the time series, making it ideal for analyzing weather trends
			and climate change. The focus here is on consistency rather than pinpoint accuracy, with a spatial
			resolution ranging from 9 to 25 kilometers.
		</li>
		<li>
			<strong><a href={'/en/docs/historical-forecast-api'}>Historical Forecast API:</a></strong> This
			dataset is constructed by continuously assembling weather forecasts, concatenating the first hours
			of each model update. Initialized with actual measurements, it closely mirrors local measurements
			but provides global coverage. However, it only includes data from the past 2-5 years and lacks
			long-term consistency due to evolving weather models and better initialization data over time.
		</li>
		<li>
			<strong><a href={'/en/docs/previous-runs-api'}>Previous Runs API</a></strong>: Similar to the
			Historical Forecast API, this dataset archives high-resolution weather models but includes
			data with a lead time offset of 1, 2, 3, 4, or more days. This makes it ideal for analyzing
			forecast performance several days into the future. Due to the vast amount of data, only common
			weather variables are stored, with data processing beginning in early 2024.
		</li>
	</ul>
	<h4>Choosing the Right Dataset:</h4>
	<ul>
		<li>
			For analyzing weather trends or climate change over decades, use the Historical Weather API
			with reanalysis data from 1940 onwards.
		</li>
		<li>
			For higher accuracy over the past few years, the Historical Forecast API with high-resolution
			forecasts is more suitable.
		</li>
		<li>
			To optimize weather forecasts using machine learning, it's essential to use data from the same
			high-resolution weather models, available through both the Historical Forecast API and the
			Previous Runs API.
		</li>
	</ul>
</div>

<div class=" py-2">
	<h2 id="data-sources">API Parameter</h2>
	<p>
		As the API is identical to the Forecast API, please refer to the Weather Forecast API
		documentation for all available variables and parameters. The only notable difference is the API
		host "historical-forecast-api.open-meteo.com" as historical data is moved to a different set of
		servers with access to a large storage system.
	</p>
</div>

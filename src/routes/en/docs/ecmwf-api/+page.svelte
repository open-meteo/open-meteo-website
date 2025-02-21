<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';
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

	import Clock from 'lucide-svelte/icons/clock';
	import Calendar from 'lucide-svelte/icons/calendar-cog';

	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select/index';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

	import {
		hourly,
		levels,
		models,
		solarVariables,
		defaultParameters,
		pressureVariables,
		additionalVariables
	} from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['temperature_2m']
	});

	let pressureVariablesTab = $state('temperature');
</script>

<svelte:head>
	<title>ECMWF Forecast API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/ecmwf-api" />
</svelte:head>

<Alert.Root>
	<Alert.Description>
		The API uses open-data ECMWF weather forecasts from the IFS weather model with a resolution of 9
		km. However, the open-data access is restricted to a resolution of 25 km and 3-hourly values,
		although the model still provides excellent accuracy for large scale weather patterns. For more
		detailed local forecasts, we recommend using the <a href={'/en/docs'}
			>generic weather forecast API</a
		>, which combines weather models up to 1 km resolution seamlessly.
	</Alert.Description>
</Alert.Root>

<form method="get" action="https://api.open-meteo.com/v1/ecmwf">
	<LocationSelection bind:params={$params} />

	<div>
		<div>
			<ul class="nav nav-underline">
				<li style="width: 70px;">
					<span class="nav-link disabled" aria-disabled="true">Time:</span>
				</li>
				<li>
					<button
						class="nav-link"
						class:active={$params.time_mode == 'forecast_days'}
						id="pills-forecast_days-tab"
						type="button"
						aria-controls="pills-forecast_days"
						onclick={() => ($params.time_mode = 'forecast_days')}
						><Clock class="mb-1 me-1" /> Forecast Length</button
					>
				</li>
				<li>
					<button
						class="nav-link"
						class:active={$params.time_mode == 'time_interval'}
						id="pills-time_interval-tab"
						type="button"
						aria-controls="pills-time_interval"
						onclick={() => ($params.time_mode = 'time_interval')}
						><Calendar class="mb-1 me-1" /> Time Interval</button
					>
				</li>
			</ul>
		</div>
		<div class="  py-3">
			{#if $params.time_mode == 'forecast_days'}
				<div in:fade id="pills-forecast_days" aria-labelledby="pills-forecast_days-tab">
					<div>
						<div>
							<div class="  mb-3">
								<select
									name="forecast_days"
									id="forecast_days"
									aria-label="Forecast days"
									bind:value={$params.forecast_days}
								>
									<option value="1">1 day</option>
									<option value="3">3 days</option>
									<option value="5">5 days</option>
									<option value="7">7 days</option>
									<option value="10">10 days (default)</option>
									<option value="15">15 days</option>
								</select>
								<label for="forecast_days">Forecast days</label>
							</div>
						</div>
						<div>
							<div class="  mb-3">
								<select
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
				<div in:fade id="pills-time_interval" aria-labelledby="pills-time_interval-tab">
					<div>
						<div class="  mb-3">
							<DatePicker bind:start_date={$params.start_date} bind:end_date={$params.end_date} />
						</div>
					</div>
				</div>
			{/if}
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
				id="pressure-levels"
				title="Pressure Level Variables"
				count={countPressureVariables(pressureVariables, levels, $params.hourly)}
			>
				<div class="   ">
					<div class="nav flex-column me-3">
						{#each pressureVariables as variable, i}
							<Button
								id="v-pills-{variable.name}-tab"
								onclick={() => (pressureVariablesTab = variable.name)}>{variable.label}</Button
							>
						{/each}
					</div>
					<div>
						{#each pressureVariables as variable}
							<div
								class:active={pressureVariablesTab == variable.name}
								class:show={pressureVariablesTab == variable.name}
								id="v-pills-{variable.name}"
								aria-labelledby="v-pills-{variable.name}-tab"
							>
								<div>
									{#each sliceIntoChunks(levels, levels.length / 3 + 1) as chunk}
										<div>
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
				<small class="text-muted-foreground mt-3">(1) Europe only, (2) Central Europe only</small>
				<div class="  mb-3 mt-3">
					<small class="text-muted-foreground"
						>Note: You can further adjust the forecast time range for hourly weather variables using <mark
							>&forecast_hours=</mark
						>
						and <mark>&past_hours=</mark> as shown below.
					</small>
				</div>
				<div>
					<div class="  mb-3">
						<select
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
				<div>
					<div class="  mb-3">
						<select
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
				<div>
					<div class="  mb-3">
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
					<div class="  mb-3">
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
						>Note: IFS in 0.4° resolution will be discontinued on 27th November 2024.</small
					>
				</div>
			</AccordionItem>
		</Accordion.Root>
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

	<LicenseSelector />
</form>

<ResultPreview {params} {defaultParameters} model_default="ecmwf_ifs025" />

<div>
	<h2 id="data-sources">Data Source</h2>
	<p>
		This API uses <a href="https://www.ecmwf.int/en/forecasts/datasets/open-data"
			>open-data ECMWF Integrated Forecast System IFS</a
		>. ECMWF IFS models run every 6 hours at 9 km resolution, but only 0.25° grid spacing (~25 km)
		is available as open data with a limited number of weather variables at 3-hourly intervals.
	</p>
	<p>
		AIFS is an artificial intelligence weather model from ECMWF yielding better results as GraphCast
		and other models. Unfortunately, only 6-hourly time-steps are available. You can find more
		information about AIFS <a href="https://www.ecmwf.int/en/about/media-centre/aifs-blog">here</a>.
		As soon as ECWMF includes additional data, they will be made available in this API.
	</p>
	<p>
		For hourly and high-resolution data (up to 1 km) try our <a href={'/en/docs'}>forecast API</a> which
		combines multiple models.
	</p>
	<div>
		<table
			class="mt-6 w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_tr]:border-b"
		>
			<caption class="text-muted-foreground mt-2 table-caption text-left"
				>You can find the update timings in the <a href={'/en/docs/model-updates'}
					>model updates documentation</a
				>.</caption
			>
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
						><a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" target="_blank">IFS</a
						></th
					>
					<td>Global</td>
					<td>0.4° (~44 km)</td>
					<td>3-Hourly</td>
					<td>15 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row"
						><a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" target="_blank">IFS</a
						></th
					>
					<td>Global</td>
					<td>0.25° (~25 km)</td>
					<td>3-Hourly</td>
					<td>15 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row"
						><a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" target="_blank">AIFS</a
						></th
					>
					<td>Global</td>
					<td>0.25° (~28 km)</td>
					<td>6-Hourly</td>
					<td>15 days</td>
					<td>Every 6 hours</td>
				</tr>
				<tr>
					<th scope="row"
						><a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" target="_blank"
							>AIFS Single</a
						></th
					>
					<td>Global</td>
					<td>0.25° (~28 km)</td>
					<td>6-Hourly</td>
					<td>15 days</td>
					<td>Every 6 hours</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2 id="api-documentation" class="mt-5">API Documentation</h2>
	<p>
		The API endpoint <mark>/v1/ecmwf</mark> accepts a geographical coordinate, a list of weather variables
		and responds with a JSON hourly weather forecast for 10 days. Time always starts at 0:00 today. All
		URL parameters are listed below:
	</p>
	<div>
		<table
			class="mt-6 w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_tr]:border-b"
		>
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
					<td></td>
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
					<td></td>
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
					<td></td>
					<td
						>A list of weather variables which should be returned. Values can be comma separated, or
						multiple
						<mark>&hourly=</mark> parameter in the URL can be used.
					</td>
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
					<th scope="row">past_days</th>
					<td>Integer (0-92)</td>
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
					<td></td>
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
					<td></td>
					<td
						>Only required to commercial use to access reserved API resources for customers. The
						server URL requires the prefix <mark>customer-</mark>. See
						<a href={'/en/pricing'} title="Pricing information to use the weather API commercially"
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
	<div>
		<table
			class="mt-6 w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_tr]:border-b"
		>
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
						millimeter, divide by 7. E.g. 7 cm snow = 10 mm precipitation water equivalent. Snowfall
						amount is not provided by ECMWF directly, instead it is approximated based on total
						precipitation and temperature</td
					>
				</tr>
				<tr>
					<th scope="row">precipitation_type</th>
					<td>Instantaneous</td>
					<td>mm (inch)</td>
					<td
						>0 = No precipitation, 1 = Rain, 3 = Freezing rain (i.e. supercooled raindrops which
						freeze on contact with the ground and other surfaces), 5 = Snow, 6 = Wet snow (i.e. snow
						particles which are starting to melt), 7 = Mixture of rain and snow, 8 = Ice pellets, 12
						= Freezing drizzle (i.e. supercooled drizzle which freezes on contact with the ground
						and other surfaces)</td
					>
				</tr>
				<tr>
					<th scope="row">runoff</th>
					<td>Preceding hour sum</td>
					<td>mm (inch)</td>
					<td>Execess rain that is not absorbed by the soil</td>
				</tr>
				<tr>
					<th scope="row">weather_code</th>
					<td>Instant</td>
					<td>WMO code</td>
					<td
						>Weather condition as a numeric code. Follow WMO weather interpretation codes. See table
						below for details. Weather code is calculated from cloud cover analysis, precipitation
						and snowfall. As ECMWF IFS has barely no information about atmospheric stability,
						estimation about thunderstorms is not possible.</td
					>
				</tr>
				<tr>
					<th scope="row">cloud_cover</th>
					<td>Instant</td>
					<td>%</td>
					<td
						>Total cloud cover as an area fraction. Calculated as a weighted function from low, mid
						and high level clouds.</td
					>
				</tr>
				<tr>
					<th scope="row">cloud_cover_low</th>
					<td>Instant</td>
					<td>%</td>
					<td
						>Low level clouds and fog up to 3 km altitude. In case of ECMWF IFS it is based on
						relative humidity on pressure levels 1000, 925 and 850 hPa.</td
					>
				</tr>
				<tr>
					<th scope="row">cloud_cover_mid</th>
					<td>Instant</td>
					<td>%</td>
					<td
						>Mid level clouds from 3 to 8 km altitude. In case of ECMWF IFS it is based on relative
						humidity on pressure levels 700 and 500 hPa.</td
					>
				</tr>
				<tr>
					<th scope="row">cloud_cover_high</th>
					<td>Instant</td>
					<td>%</td>
					<td
						>High level clouds from 8 km altitude. In case of ECMWF IFS it is based on relative
						humidity on pressure levels 300, 250 and 200 hPa.</td
					>
				</tr>
				<tr>
					<th scope="row">pressure_msl<br />surface_pressure</th>
					<td>Instant</td>
					<td>hPa</td>
					<td
						>Atmospheric air pressure reduced to sea level (Mean sea level) and actual pressure at
						surface level</td
					>
				</tr>
				<tr>
					<th scope="row">surface_temperature</th>
					<td>Instant</td>
					<td>°C (°F)</td>
					<td
						>Temperature of the the surface. Depending on the type of surface (e.g. concrete) this
						temperature can be significantly higher then the 2 meter air temperature</td
					>
				</tr>
				<tr>
					<th scope="row"
						>soil_temperature_0_7cm<br />soil_temperature_7_to_28cm<br
						/>soil_temperature_28_to_100cm<br />soil_temperature_100_to_255cm</th
					>
					<td>Instant</td>
					<td>°C (°F)</td>
					<td>Average temperature of different soil depths below ground.</td>
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
				<tr>
					<th scope="row">total_column_integrated_water_vapour</th>
					<td>Instant</td>
					<td>kg/m²</td>
					<td>Total amount of water in the atmosphere.</td>
				</tr>
				<tr>
					<th scope="row">temperature_2m<br />temperature_1000hPa, ...</th>
					<td>Instant</td>
					<td>°C (°F)</td>
					<td
						>Air temperature 2 meter above ground. Additional temperature in the atmopshere are
						given on different pressure levels.
					</td>
				</tr>
				<tr>
					<th scope="row">temperature_2m_min<br />temperature_2m_max</th>
					<td>Preceding 3-hour</td>
					<td>°C (°F)</td>
					<td>Minimum and maximum temperature of the preceding 3 hours. </td>
				</tr>
				<tr>
					<th scope="row">geopotential_height_1000hPa</th>
					<td>Instant</td>
					<td>meter</td>
					<td>Geopotential height on different atmospheric pressure levels</td>
				</tr>
				<tr>
					<th scope="row">wind_speed_10m<br />wind_speed_1000hPa, ...</th>
					<td>Instant</td>
					<td>km/h (mph, m/s, knots)</td>
					<td
						>Wind speed at 10 meters above ground. Wind speed on 10 meters is the standard level.
						Additional wind speeds are given on atmospheric pressure levels.</td
					>
				</tr>
				<tr>
					<th scope="row">wind_direction_10m<br />wind_direction_1000hPa, ...</th>
					<td>Instant</td>
					<td>°</td>
					<td>Wind direction at 10 meters above ground and different pressure levels.</td>
				</tr>
				<tr>
					<th scope="row">wind_gusts_10m</th>
					<td>Preceding 3-hour max</td>
					<td>km/h (mph, m/s, knots)</td>
					<td
						>Maximum 3 second wind at 10 m height above ground as a maximum of the preceding 3 hours</td
					>
				</tr>
				<tr>
					<th scope="row">relative_humidity_1000hPa, ...</th>
					<td>Instant</td>
					<td>%</td>
					<td
						>Relative humidity at atmospheric pressure levels. Unfortunately, 2 meter relative
						humidity is unavailable.</td
					>
				</tr>
				<tr>
					<th scope="row">cloud_cover_1000hPa, ...</th>
					<td>Instant</td>
					<td>%</td>
					<td
						>Cloud cover at the specified pressure level. Cloud cover is approximated based on
						relative humidity using <a
							href="https://www.ecmwf.int/sites/default/files/elibrary/2005/16958-parametrization-cloud-cover.pdf"
							target="_blank">Sundqvist et al. (1989)</a
						></td
					>
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
						normal plane (perpendicular to the sun). ECMWF IFS open-data does not provide direct and
						diffuse radiation. It is approximated based on <a
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
						>Diffuse solar radiation as average of the preceding hour. Similar to direct radiation,
						it is approximated based on <a
							href="https://www.ise.fraunhofer.de/content/dam/ise/de/documents/publications/conference-paper/36-eupvsec-2019/Guzman_5CV31.pdf"
							target="_blank">Razo, Müller Witwer</a
						></td
					>
				</tr>
				<tr>
					<th scope="row">global_tilted_irradiance</th>
					<td>Preceding hour mean</td>
					<td>W/m²</td>
					<td
						>Total radiation received on a tilted pane as average of the preceding hour. The
						calculation is assuming a fixed albedo of 20% and in isotropic sky. Please specify tilt
						and azimuth parameter. Tilt ranges from 0° to 90° and is typically around 45°. Azimuth
						should be close to 0° (0° south, -90° east, 90° west). If azimuth is set to "nan", the
						calculation assumes a horizontal tracker. If tilt is set to "nan", it is assumed that
						the panel has a vertical tracker. If both are set to "nan", a bi-axial tracker is
						assumed.</td
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
	<div>
		<table
			class="mt-6 w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_tr]:border-b"
		>
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
	<h3 class="mb-3 mt-5 text-2xl">Errors</h3>
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

<div>
	<h2 id="weathervariables">Weather variable documentation</h2>
</div>

<div>
	<h3>WMO Weather interpretation codes (WW)</h3>
	<div>
		<table
			class="mt-6 w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_tr]:border-b"
		>
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
					<th scope="row">77 *</th>
					<td>Snow grains</td>
				</tr>
				<tr>
					<th scope="row">80, 81, 82 *</th>
					<td>Rain showers: Slight, moderate, and violent</td>
				</tr>
				<tr>
					<th scope="row">85, 86 *</th>
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
	<p>(*) Showers and thunderstorm forecast not available with ECMWF IFS</p>

	<p>
		This service is based on data and products of the European Centre for Medium-Range Weather
		Forecasts (ECMWF). Source www.ecmwf.int. ECMWF does not accept any liability whatsoever for any
		error or omission in the data, their availability, or for any loss or damage arising from their
		use.
	</p>
</div>

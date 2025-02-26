<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';
	import { countVariables } from '$lib/utils/meteo';

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
		daily,
		hourly,
		models,
		solarVariables,
		defaultParameters,
		additionalVariables
	} from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['temperature_2m']
	});

	let timezoneInvalid = $derived($params.timezone == 'UTC' && $params.daily.length > 0);
</script>

<svelte:head>
	<title>DMI Weather Model API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/dmi-api" />
</svelte:head>

<form method="get" action="https://api.open-meteo.com/v1/dmi">
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
									<option value="7">7 days (default)</option>
									<option value="10">10 days</option>
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
				<div class="  mb-3">
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
						>Note: The default <mark>Best Match</mark> provides the best forecast for any given
						location worldwide. <mark>Seamless</mark> combines all models from a given provider into
						a seamless prediction.</small
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
					<option selected value="celsius">Celsius °C</option>
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
					<option selected value="kmh">Km/h</option>
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

<ResultPreview {params} {defaultParameters} model_default="dmi_seamless" />

<div>
	<h2 id="data-sources">Data Source</h2>
	<p>
		DMI provides weather forecasts from the HARMONIE AROME model with ECMWF IFS initialization. This
		is a collaboration of multiple European national weather services under the name "United Weather
		Centres-West" (UWC-West). Forecasts for Europe use 2 km resolution and provide a large range of
		weather variables. All data is updated every 3 hours and provides forecast for up to 2.5 days.
		After 2.5 days, Open-Meteo combines forecasts with the <a href={'/en/docs/ecmwf-api'}
			>ECMWF IFS 0.25° model</a
		> to provide up to 10 days of forecast.
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
						><a
							href="https://opendatadocs.dmi.govcloud.dk/Data/Forecast_Data_Weather_Model_HARMONIE_DINI_IG"
							target="_blank">DMI HARMONIE AROME DINI</a
						></th
					>
					<td>Central & Northern Europe up to Iceland (green area below)</td>
					<td>2 km</td>
					<td>1-hourly</td>
					<td>2.5 days</td>
					<td>Every 3 hours</td>
				</tr>
			</tbody>
		</table>
	</div>

	<figure>
		<img src="/images/models/dmi_harmonie_dini-ig.webp" class="rounded-lg" alt="..." />
		<figcaption>
			DMI HARMONIE AROME DINI model area (green). Source: <a
				href="https://opendatadocs.dmi.govcloud.dk/Data/Forecast_Data_Weather_Model_HARMONIE_DINI_IG"
				>DMI</a
			>.
		</figcaption>
	</figure>

	<h2 id="api-documentation" class="mt-5">API Documentation</h2>
	<p>
		For a detailed list of all available weather variables please refer to the general <a
			href={'/en/docs'}>Weather Forecast API</a
		>. Only notable remarks are listed below
	</p>
	<ul>
		<li>
			<strong>Direct Solar Radiation:</strong> DMI provides direct solar radiation. Many other weather
			models only provide global solar radiation and direct solar radiation must be calculated user separation
			models.
		</li>
		<li>
			<strong>Direct Normalized Irradiance (DNI):</strong> Although DNI is available, it has not been
			integrated. Open-Meteo uses solar position algorithms which calculate DNI from direct radiation
			with (almost) the same results.
		</li>
		<li>
			<strong>Wind Direction Correction:</strong> Wind direction has been calculated from U/V wind
			component vectors. Special care has been taken to correct for the
			<mark>Lambert Conformal Conic</mark> projection. Without this correction, wind directions have
			an error of up to 15°.
		</li>
		<li>
			<strong>Cloud Cover (2m):</strong> DMI provides cloud cover at 2 metre abouve ground which can
			be interpreted as fog. This is remarkable, because only very weather models are capable of modeling
			low level cloud cover and fog with a good degree of accuracy.
		</li>
	</ul>
</div>

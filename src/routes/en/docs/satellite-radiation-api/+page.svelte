<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/utils/url-hash-store';
	import { countVariables } from '$lib/utils/meteo';

	import StartEndDate from '$lib/components/date-selector/StartEndDate.svelte';
	import AccordionItem from '$lib/components/accordion/AccordionItem.svelte';
	import ResultPreview from '$lib/components/highcharts/ResultPreview.svelte';
	import LicenseSelector from '$lib/components/license/LicenseSelector.svelte';
	import LocationSelection from '$lib/components/location/LocationSelection.svelte';

	import CalendarEvent from 'svelte-bootstrap-icons/lib/CalendarEvent.svelte';
	import Clock from 'svelte-bootstrap-icons/lib/Clock.svelte';

	import { daily, hourly, models, defaultParameters, additionalVariables } from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters
	});

	let timezoneInvalid = $derived($params.timezone == 'UTC' && $params.daily.length > 0);
</script>

{'' +
	/* 
TODO:
- consider switch between archive and realtime endpoints -> Archive data requires large amounts of storage (>4TB)
- future option for satellite corrected weather forecasts? Data needs to be on the same node
- api endpoint URL... regular API server? dedicated satellite only server that pulls in weather model SW rad (+ens, +prev days)?
- proper solar variables documentation
- better time switch for hourly/10 and 15min
- add GEOS data
- add image with satellite area cover
*/ ''}

<svelte:head>
	<title>Satellite Radiation API 🛰️☀️ | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/satellite-radiation-api" />
</svelte:head>

<form method="get" action="https://api.open-meteo.com/v1/forecast">
	<LocationSelection bind:params={$params} />

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
		<h2>Variables</h2>
		{#each hourly as group}
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
				<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI please
				specify Tilt and Azimuth below.</small
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
			<AccordionItem id="models" title="Models" count={countVariables(models, $params.models)}>
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

<ResultPreview {params} {defaultParameters} model_default="satellite_radiation_seamless" type="satellite" action="archive" />

<div class="col-12 py-5">
	<h2 id="data-sources">Data Source</h2>
	<p>TODO docs</p>
	<div class="table-responsive">
		<table class="table">
			<thead>
				<tr>
					<th scope="col">Provider</th>
					<th scope="col">Satellite</th>
					<th scope="col">Region</th>
					<th scope="col">Spatial Resolution</th>
					<th scope="col">Temporal Resolution</th>
					<th scope="col">Update frequency</th>
					<th scope="col">Delay</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th rowspan="2" scope="row"
						><a href="https://lsa-saf.eumetsat.int/en/data/products/radiation/" target="_blank"
							>EUMETSAT LSA SAF</a
						></th
					>
					<td>MSG</td>
					<td>Europe, Africa, South America (only land)</td>
					<td>0.05° (~ 5km)</td>
					<td>15 minutely</td>
					<td>Every Hour</td>
					<td>1 Hour</td>
				</tr>
				<tr>
					<td>IODC</td>
					<td>Europe, Africa, India (only land)</td>
					<td>0.05° (~ 5km)</td>
					<td>15 minutely</td>
					<td>Every Hour</td>
					<td>2 Hours</td>
				</tr>
				<tr>
					<th scope="row"
						><a
							href="https://wui.cmsaf.eu/safira/action/viewDoiDetails?acronym=SARAH_V003"
							target="_blank">EUMETSAT CM SAF SARAH3</a
						></th
					>
					<td>MSG</td>
					<td>Europe, Africa, South America</td>
					<td>0.05° (~ 5km)</td>
					<td>30 minutely</td>
					<td>Every Hour</td>
					<td>2 Days</td>
				</tr>
				<tr>
					<th scope="row"
						><a href="https://www.eorc.jaxa.jp/ptree/userguide.html" target="_blank">JMA JAXA</a
						></th
					>
					<td>Himawari-9</td>
					<td>India, Asia, Australia, New Zealand</td>
					<td>0.05° (~ 5km)</td>
					<td>10 minutely</td>
					<td>Every 10 minutes</td>
					<td>20 Minutes</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2 id="api-documentation" class="mt-5">API Documentation</h2>
	<p>
		For a detailed list of all available weather variables please refer to the general <a
			href="/en/docs">Weather Forecast API</a
		>. Only notable remarks are listed below
	</p>
	<ul>
		<li>
			<strong>Himawari direct and diffuse radiation</strong> JMA JAXA provides only shortwave
			radiation data and does not offer direct or diffuse solar radiation. Open-Meteo applies the
			separation model from
			<a
				href="https://www.ise.fraunhofer.de/content/dam/ise/de/documents/publications/conference-paper/36-eupvsec-2019/Guzman_5CV31.pdf"
				>Razo, Müller Witwer</a
			> to calculate direct radiation from shortwave solar radiation.
		</li>
		<li>
			<strong>Instantaneous Values Correction</strong>: Satellites provide data as instantaneous
			values. However, a full Earth scan takes approximately 10–15 minutes. As a result, the top and
			bottom of each scan have a significant time difference. To ensure comparability with data
			sources like weather models, OpenMeteo corrects for these scan time differences and derives
			backward-averaged values.
		</li>
		<li>
			<strong>Gap-Filling</strong>: Satellites often have missing values for 1–2 time steps. Small
			gaps are filled using cubic interpolation on the clearness index (kt) and a solar position
			model. However, larger gaps of several hours or more cannot be filled and will return NaN
			values.
		</li>
	</ul>
</div>

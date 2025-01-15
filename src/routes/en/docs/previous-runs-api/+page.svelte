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

	import { models, previousDay, windVariables, solarVariables, defaultParameters } from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		past_days: '7',
		hourly: [
			'temperature_2m',
			'temperature_2m_previous_day1',
			'temperature_2m_previous_day2',
			'temperature_2m_previous_day3',
			'temperature_2m_previous_day4',
			'temperature_2m_previous_day5'
		]
	});

	function formatVariableName(variable: string, previous_day: number) {
		if (previous_day == 0) {
			return variable;
		}
		return `${variable}_previous_day${previous_day}`;
	}
</script>

<svelte:head>
	<title>Previous Runs API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/previous-runs-api" />
</svelte:head>

<div class="alert alert-primary" role="alert">
	Read the announcement for the Previous Day API and how you can use to it calculate model accuracy
	in the <a href="https://openmeteo.substack.com/p/weather-forecasts-from-previous-model-runs"
		>Open-Meteo blog post</a
	>.
</div>

<form method="get" action="https://historical-forecast-api.open-meteo.com/v1/forecast">
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
									<option value="14">14 days</option>
									<option value="16">16 days</option>
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
						<div class="col-md-6">
							<p>
								By default, we provide forecasts for 7 days, but you can access forecasts for up to
								16 days. If you're interested in past weather data, you can use the <mark
									>Past Days</mark
								>
								feature to access archived forecasts.
							</p>
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
						<div class="col-md-6">
							<p>
								The <mark>Start Date</mark> and <mark>End Date</mark> options help you choose a range
								of dates more easily. Archived forecasts come from a series of weather model runs over
								time.
							</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="row py-3 px-0">
		<h2>Hourly Weather Variables</h2>
		<div class="table-responsive">
			<table class="table table-sm">
				<tbody>
					{#each previousDay as e}
						<tr>
							<td>{e.label}</td>
							{#each { length: 8 } as _, i}
								<td
									><div class="form-check">
										<input
											class="form-check-input"
											type="checkbox"
											value={formatVariableName(e.name, i)}
											id="{e.name}_hourly_previous_day{i}"
											name="hourly"
											bind:group={$params.hourly}
										/>
										<label class="form-check-label" for="{e.name}_hourly_previous_day{i}"
											>Day {i}</label
										>
									</div></td
								>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<div class="row py-3 px-0">
		<div class="accordion" id="accordionVariables">
			<AccordionItem id="additional-variables" title="Additional Options">
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
			<AccordionItem id="solar" title="Solar Radiation Variables">
				<div class="table-responsive">
					<table class="table table-sm">
						<tbody>
							{#each solarVariables as e}
								<tr>
									<td>{e.label}</td>
									{#each { length: 8 } as _, i}
										<td
											><div class="form-check">
												<input
													class="form-check-input"
													type="checkbox"
													value={formatVariableName(e.name, i)}
													id="{e.name}_hourly_previous_day{i}"
													name="hourly"
													bind:group={$params.hourly}
												/>
												<label class="form-check-label" for="{e.name}_hourly_previous_day{i}"
													>Day {i}</label
												>
											</div></td
										>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
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
			<AccordionItem id="wind_upper" title="Wind on 80, 120 and 180 metre">
				<div class="table-responsive">
					<table class="table table-sm">
						<tbody>
							{#each windVariables as e}
								<tr>
									<td>{e.label}</td>
									{#each { length: 8 } as _, i}
										<td
											><div class="form-check">
												<input
													class="form-check-input"
													type="checkbox"
													value={formatVariableName(e.name, i)}
													id="{e.name}_hourly_previous_day{i}"
													name="hourly"
													bind:group={$params.hourly}
												/>
												<label class="form-check-label" for="{e.name}_hourly_previous_day{i}"
													>Day {i}</label
												>
											</div></td
										>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
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

	<LicenseSelector requires_professional_plan={true} />
</form>

<ResultPreview {params} {defaultParameters} type="previous-runs" useStockChart={true} />

<div class="col-12 py-5">
	<h2 id="documentation">API Documentation</h2>
	<div class="col-md-12 mb-3">
		<p>
			Weather models constantly churn out updates, each predicting the future at different lead
			times. Think of Day 0 as latest forecast close to measurements, Day 1 as a glimpse 24 hours
			back, and Day 2 as a 48-hour rewind. Each day further back forecasts longer into the future
			and, typically, increases volatility. Data jumps become wilder past Day 6 or 7, highlighting
			the inherent challenge of long-term forecasting.
		</p>
		<p>
			This data serves multiple purposes, including answering questions such as "what did
			yesterday's forecast predict for today?" or by comparing past forecasts with real-time
			observations, we can assess a forecast's accuracy and volatility. When combined with machine
			learning techniques, models can be trained specifically to enhance forecasts for the next 2 or
			3 days.
		</p>
		<p>
			The frequency of model updates varies, ranging from hourly to every six hours. For local
			models with shorter prediction horizons (2-5 days), we naturally have access to a shorter
			"time machine" of past predictions (2-5 days).
		</p>
		<p>
			<strong>Weather Models Sources:</strong> The Previous Runs API uses the same models as
			available in the general weather forecast API. Please refer to the
			<a href="/en/docs">Forecast API documentation</a> for a list of all weather models and weather
			variables.
		</p>
		<p>
			<strong>Data Availability:</strong> Data is generally available from January 2024 onwards. Exceptions
			are GFS temperature on 2 metre, which is available from March 2021 and JMA GSM + MSM models which
			are available from 2018. More data from previous runs can be reconstructed on request (depending
			on data availability from official sources).
		</p>
	</div>
</div>

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

	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select/index';
	import * as Accordion from '$lib/components/ui/accordion';

	import { models, previousDay, windVariables, solarVariables, defaultParameters } from './options';

	import { pastDaysOptions, forecastDaysOptions } from '../options';
	import Settings from '$lib/components/settings/settings.svelte';

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

	let forecastDays = $derived(
		forecastDaysOptions.find((fco) => String(fco.value) == $params.forecast_days)
	);

	let pastDays = $derived(pastDaysOptions.find((pdo) => String(pdo.value) == $params.past_days));
</script>

<svelte:head>
	<title>Previous Runs API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/previous-runs-api" />
</svelte:head>

<Alert.Root>
	<Alert.Description>
		Read the announcement for the Previous Day API and how you can use to it calculate model
		accuracy in the <a
			class="text-link underline"
			href="https://openmeteo.substack.com/p/weather-forecasts-from-previous-model-runs"
			>Open-Meteo blog post</a
		>.
	</Alert.Description>
</Alert.Root>

<form method="get" class="mt-3" action="https://historical-forecast-api.open-meteo.com/v1/forecast">
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<div class="mt-6">
		<div class="mt-3 flex items-center gap-2">
			<div class="text-muted-foreground">Time:</div>

			<div class="border-border flex rounded-md border">
				<Button
					variant="ghost"
					class="rounded-e-none !opacity-100 {$params.time_mode === 'forecast_days'
						? 'bg-accent cursor-not-allowed'
						: ''}"
					disabled={$params.time_mode === 'forecast_days'}
					onclick={() => {
						$params.time_mode = 'forecast_days';
						$params.start_date = '';
						$params.end_date = '';
					}}
				>
					<Clock size={20} />Forecast Length
				</Button>
				<Button
					variant="ghost"
					class="rounded-md rounded-s-none !opacity-100 duration-300 {$params.time_mode ===
					'time_interval'
						? 'bg-accent'
						: ''}"
					disabled={$params.time_mode === 'time_interval'}
					onclick={() => {
						$params.time_mode = 'time_interval';
					}}
				>
					<Calendar size={20} />Time Interval
				</Button>
			</div>
		</div>

		<div class="mt-3 md:mt-4">
			{#if $params.time_mode === 'forecast_days'}
				<div in:fade class="grid gap-3 md:gap-6 lg:grid-cols-2">
					<div class="grid gap-3 sm:grid-cols-2 md:gap-6">
						<div class="relative">
							<Select.Root name="forecast_days" type="single" bind:value={$params.forecast_days}>
								<Select.Trigger
									aria-label="Forecast days input"
									class="h-12 cursor-pointer pt-6 [&_svg]:mb-3"
									>{forecastDays?.label}</Select.Trigger
								>
								<Select.Content preventScroll={false} class="border-border">
									{#each forecastDaysOptions as fdo}
										<Select.Item class="cursor-pointer" value={String(fdo.value)}
											>{fdo.label}</Select.Item
										>
									{/each}
								</Select.Content>
								<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
									>Forecast days</Label
								>
							</Select.Root>
						</div>
						<div class="relative">
							<Select.Root name="past_days" type="single" bind:value={$params.past_days}>
								<Select.Trigger
									aria-label="Past days input"
									class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{pastDays?.label}</Select.Trigger
								>
								<Select.Content preventScroll={false} class="border-border">
									{#each pastDaysOptions as pdo}
										<Select.Item class="cursor-pointer" value={String(pdo.value)}
											>{pdo.label}</Select.Item
										>
									{/each}
								</Select.Content>
								<Label
									class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
								>
									Past days</Label
								>
							</Select.Root>
						</div>
					</div>

					<div class="">
						<p>
							By default, we provide forecasts for 7 days, but you can access forecasts for up to 16
							days. If you're interested in past weather data, you can use the <mark>Past Days</mark
							>
							feature to access archived forecasts.
						</p>
					</div>
				</div>
			{/if}
			{#if $params.time_mode === 'time_interval'}
				<div in:fade class="flex flex-col gap-4 md:flex-row">
					<div class="mb-3 md:w-1/2">
						<DatePicker
							bind:start_date={$params.start_date}
							bind:end_date={$params.end_date}
							{begin_date}
							{last_date}
						/>
					</div>
					<div class="mb-3 md:w-1/2">
						<p>
							The <mark>Start Date</mark> and <mark>End Date</mark> options help you choose a range
							of dates more easily. Archived forecasts come from a series of weather model runs over
							time. You can access forecasts for up to 3 months and continuously archived in the
							<a href={'/en/docs/historical-forecast-api'}>Historical Forecast API</a>. You can also
							check out our
							<a href={'/en/docs/historical-weather-api'}>Historical Weather API</a>, which provides
							data going all the way back to 1940.
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- HOURLY -->
	<div class="mt-6 md:mt-12">
		<h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">Hourly Weather Variables</h2>
		<div class="mt-2 overflow-auto md:mt-4">
			<table class="w-full">
				<tbody>
					{#each previousDay as e}
						<tr class="border-border border-b">
							<td class="text-nowrap">{e.label}</td>
							{#each { length: 8 } as _, i}
								<td class="py-1"
									><div class="flex items-center justify-center px-2">
										<Checkbox
											id="{e.value}_hourly_previous_day{i}"
											class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
											value={formatVariableName(e.value, i)}
											checked={$params.hourly?.includes(formatVariableName(e.value, i))}
											aria-labelledby="{e.value}_hourly_previous_day_label{i}"
											onCheckedChange={() => {
												if ($params.hourly?.includes(formatVariableName(e.value, i))) {
													$params.hourly = $params.hourly.filter((item) => {
														return item !== formatVariableName(e.value, i);
													});
												} else {
													$params.hourly.push(formatVariableName(e.value, i));
													$params.hourly = $params.hourly;
												}
											}}
										/>
										<Label
											id="{e.value}_hourly_previous_day_label{i}"
											for="{e.value}_hourly_previous_day{i}"
											class="ml-[0.42rem] cursor-pointer truncate py-[0.32rem]">Day {i}</Label
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

	<!-- ADDITIONAL VARIABLES -->
	<div class="mt-6">
		<Accordion.Root class="border-border rounded-lg border" multiple={true}>
			<AccordionItem id="additional-variables" title="Additional Options">
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
			<AccordionItem id="solar" title="Solar Radiation Variables">
				<div>
					<table class="table-sm table">
						<tbody>
							{#each solarVariables as e}
								<tr>
									<td>{e.label}</td>
									{#each { length: 8 } as _, i}
										<td
											><div>
												<input
													type="checkbox"
													value={formatVariableName(e.name, i)}
													id="{e.name}_hourly_previous_day{i}"
													name="hourly"
													bind:group={$params.hourly}
												/>
												<label for="{e.name}_hourly_previous_day{i}">Day {i}</label>
											</div></td
										>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
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
			<AccordionItem id="wind_upper" title="Wind on 80, 120 and 180 metre">
				<div>
					<table class="table-sm table">
						<tbody>
							{#each windVariables as e}
								<tr>
									<td>{e.label}</td>
									{#each { length: 8 } as _, i}
										<td
											><div>
												<input
													type="checkbox"
													value={formatVariableName(e.name, i)}
													id="{e.name}_hourly_previous_day{i}"
													name="hourly"
													bind:group={$params.hourly}
												/>
												<label for="{e.name}_hourly_previous_day{i}">Day {i}</label>
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
				<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
					{#each models as group}
						<div class="mb-3">
							{#each group as e}
								<div class="group flex items-center">
									<Checkbox
										id="{e.value}_model"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										value={e.value}
										checked={$params.models?.includes(e.value)}
										aria-labelledby="{e.value}_label"
										onCheckedChange={() => {
											if ($params.models?.includes(e.value)) {
												$params.models = $params.models.filter((item) => {
													return item !== e.value;
												});
											} else {
												$params.models.push(e.value);
												$params.models = $params.models;
											}
										}}
									/>
									<Label
										id="{e.value}_model_label"
										for="{e.value}_model"
										class="ml-[0.42rem] cursor-pointer truncate py-[0.32rem]">{e.label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>
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

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<!-- LISENCE -->
	<div class="mt-3 md:mt-6">
		<LicenseSelector requires_professional_plan={true} />
	</div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultPreview {params} {defaultParameters} type="previous-runs" useStockChart={true} />
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2>
	<div class="mt-2 md:mt-4">
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
			<a href={'/en/docs'}>Forecast API documentation</a> for a list of all weather models and weather
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

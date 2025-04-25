<script lang="ts">
	import { onMount } from 'svelte';

	import { fade, slide } from 'svelte/transition';

	import { countVariables, countPreviousVariables } from '$lib/utils/meteo';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select';
	import * as Accordion from '$lib/components/ui/accordion';

	import Settings from '$lib/components/settings/settings.svelte';
	import DatePicker from '$lib/components/date/date-picker.svelte';
	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import ResultPreview from '$lib/components/highcharts/result-preview.svelte';
	import LicenseSelector from '$lib/components/license/license-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';

	import {
		previousDay,
		windVariables,
		solarVariables,
		pastDaysOptions,
		defaultParameters
	} from './options';

	import {
		forecastDaysOptions,
		gridCellSelectionOptions,
		temporalResolutionOptions,
		models
	} from '../options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],

		...defaultParameters,

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
		forecastDaysOptions.find((fco) => fco.value == $params.forecast_days)
	);

	let pastDays = $derived(pastDaysOptions.find((pdo) => pdo.value == $params.past_days));

	// Additional variable settings
	let cellSelection = $derived(
		gridCellSelectionOptions.find((gcso) => String(gcso.value) == $params.cell_selection)
	);
	let temporalResolution = $derived(
		temporalResolutionOptions.find((tro) => String(tro.value) == $params.temporal_resolution)
	);

	let accordionValues: string[] = $state([]);
	onMount(() => {
		if (
			((temporalResolution ? temporalResolution.value : false) ||
				(cellSelection ? cellSelection.value : false)) &&
			!accordionValues.includes('additional-variables')
		) {
			accordionValues.push('additional-variables');
		}

		if (
			(countPreviousVariables(solarVariables, $params.hourly, true).active ||
				($params.tilt ? $params.tilt > 0 : false) ||
				($params.azimuth ? $params.azimuth > 0 : false)) &&
			!accordionValues.includes('solar-variables')
		) {
			accordionValues.push('solar-variables');
		}

		if (
			countPreviousVariables(windVariables, $params.hourly, true).active &&
			!accordionValues.includes('wind-variables')
		) {
			accordionValues.push('wind-variables');
		}

		if (countVariables(models, $params.models).active && !accordionValues.includes('models')) {
			accordionValues.push('models');
		}
	});

	let begin_date = new Date('2021-04-01');

	let last_date = new Date();
	last_date.setDate(last_date.getDate() + 16);
</script>

<svelte:head>
	<title>Previous Runs API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/previous-runs-api" />
</svelte:head>

<Alert.Root class="border-border mb-4">
	<Alert.Description>
		Read the announcement for the Previous Day API and how you can use to it calculate model
		accuracy in the <a
			class="text-link underline"
			href="https://openmeteo.substack.com/p/weather-forecasts-from-previous-model-runs"
			>Open-Meteo blog post</a
		>.
	</Alert.Description>
</Alert.Root>

<form method="get" action="https://historical-forecast-api.open-meteo.com/v1/forecast">
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<div class="mt-6">
		<div class="mt-3 flex items-center gap-2">
			<div class="text-muted-foreground">Time:</div>

			<div class="border-border flex rounded-md border">
				<Button
					variant="ghost"
					class="rounded-e-none !opacity-100 gap-1 duration-300 {$params.time_mode ===
					'forecast_days'
						? 'bg-accent cursor-not-allowed'
						: ''}"
					disabled={$params.time_mode === 'forecast_days'}
					onclick={() => {
						$params.time_mode = 'forecast_days';
						$params.start_date = '';
						$params.end_date = '';
					}}
				>
					<svg
						class="lucide lucide-clock mr-[2px]"
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>Forecast Length
				</Button>
				<Button
					variant="ghost"
					class="rounded-s-none !opacity-100 gap-1 duration-300  {$params.time_mode ===
					'time_interval'
						? 'bg-accent'
						: ''}"
					disabled={$params.time_mode === 'time_interval'}
					onclick={() => {
						$params.time_mode = 'time_interval';
					}}
				>
					<svg
						class="lucide lucide-calendar-cog mr-[2px]"
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="m15.2 16.9-.9-.4" />
						<path d="m15.2 19.1-.9.4" />
						<path d="M16 2v4" />
						<path d="m16.9 15.2-.4-.9" />
						<path d="m16.9 20.8-.4.9" />
						<path d="m19.5 14.3-.4.9" />
						<path d="m19.5 21.7-.4-.9" />
						<path d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
						<path d="m21.7 16.5-.9.4" />
						<path d="m21.7 19.5-.9-.4" />
						<path d="M3 10h18" />
						<path d="M8 2v4" />
						<circle cx="18" cy="18" r="3" />
					</svg>Time Interval
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
										<Select.Item class="cursor-pointer" value={fdo.value}>{fdo.label}</Select.Item>
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
										<Select.Item class="cursor-pointer" value={pdo.value}>{pdo.label}</Select.Item>
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

					<div>
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
				<div in:fade class="flex flex-col gap-4 lg:flex-row">
					<div class="mb-3 lg:w-1/2">
						<DatePicker
							bind:start_date={$params.start_date}
							bind:end_date={$params.end_date}
							{begin_date}
							{last_date}
						/>
					</div>
					<div class="mb-3 lg:w-1/2">
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
											class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">Day {i}</Label
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
		<Accordion.Root class="border-border rounded-lg border" bind:value={accordionValues}>
			<AccordionItem id="additional-variables" title="Additional Options">
				<div class=" mt-2 grid grid-cols-1 gap-3 md:mt-4 md:grid-cols-4 md:gap-6">
					<div class="relative md:col-span-2">
						<Select.Root
							name="temporal_resolution"
							type="single"
							bind:value={$params.temporal_resolution}
						>
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
								>{temporalResolution?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each temporalResolutionOptions as tro}
									<Select.Item value={tro.value}>{tro.label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
								>Temporal Resolution For Hourly Data</Label
							>
						</Select.Root>
					</div>
					<div class="relative md:col-span-2">
						<Select.Root name="cell_selection" type="single" bind:value={$params.cell_selection}>
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
								>{cellSelection?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each gridCellSelectionOptions as gcso}
									<Select.Item value={gcso.value}>{gcso.label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
								>Grid Cell Selection</Label
							>
						</Select.Root>
					</div>
				</div>
			</AccordionItem>
			<AccordionItem
				id="solar-variables"
				title="Solar Radiation Variables"
				count={countPreviousVariables(solarVariables, $params.hourly)}
			>
				<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
					<table class="w-full mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1020px]">
						<tbody>
							{#each solarVariables as e}
								<tr class="border-border border-b">
									<td>{e.label}</td>
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
													class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">Day {i}</Label
												>
											</div></td
										>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div class="mb-3">
					<small class="text-muted-foreground"
						>Note: Solar radiation is averaged over the past hour. Use
						<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI
						please specify Tilt and Azimuth below.</small
					>
				</div>
				<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-2 md:gap-6">
					<div class="relative">
						<Input
							id="tilt"
							type="number"
							class="h-12 cursor-pointer pt-6 {$params.tilt < 0 || $params.tilt > 90
								? 'text-red'
								: ''}"
							name="tilt"
							step="1"
							min="0"
							max="90"
							bind:value={$params.tilt}
						/>
						<Label
							class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
							for="tilt">Panel Tilt (0° horizontal)</Label
						>
						{#if $params.tilt < 0 || $params.tilt > 90}
							<div class="invalid-tooltip" transition:slide>Tilt must be between 0° and 90°</div>
						{/if}
					</div>

					<div class="relative">
						<Input
							type="number"
							class="h-12 cursor-pointer pt-6 {$params.azimuth < -180 || $params.azimuth > 180
								? 'text-red'
								: ''}"
							name="azimuth"
							id="azimuth"
							step="1"
							min="-180"
							max="180"
							bind:value={$params.azimuth}
						/>
						<Label
							class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
							for="azimuth">Panel Azimuth (0° S, -90° E, 90° W, ±180° N)</Label
						>
						{#if Number($params.azimuth) < -180 || Number($params.azimuth) > 180}
							<div class="invalid-tooltip" transition:slide>
								Azimuth must be between -180° (north) and 180° (north)
							</div>
						{/if}
					</div>
				</div>
			</AccordionItem>
			<AccordionItem
				id="wind-variables"
				title="Wind on 80, 120 and 180 meter"
				count={countPreviousVariables(windVariables, $params.hourly)}
			>
				<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
					<table class="w-full mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1020px]">
						<tbody>
							{#each windVariables as e}
								<tr class="border-border border-b">
									<td>{e.label}</td>
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
													class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">Day {i}</Label
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
				<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
					{#each models as group}
						<div class="mb-3">
							{#each group as e}
								<div class="group flex items-center" title={e.label}>
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
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
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

<div class="mt-6 md:mt-12">
	<h2 id="api_documentation" class="text-2xl md:text-3xl">Data Availability</h2>
	<div class="mt-2 md:mt-4">
		<p>
			We began collecting past model run data in January 2024, with most weather models offering
			data from this point onward. Some models were added later in 2024 and 2025, providing data
			from a later start date. For GFS, data has been integrated from April 2021 onward, but only
			for 2m temperature.
		</p>
	</div>
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

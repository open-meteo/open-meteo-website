<script lang="ts">
	import { onMount } from 'svelte';

	import { fade } from 'svelte/transition';

	import { countVariables } from '$lib/utils/meteo';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import * as Select from '$lib/components/ui/select';
	import * as Accordion from '$lib/components/ui/accordion';

	import Settings from '$lib/components/settings/settings.svelte';
	import DatePicker from '$lib/components/date/date-picker.svelte';
	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import ResultPreview from '$lib/components/highcharts/result-preview.svelte';
	import LicenseSelector from '$lib/components/license/license-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';

	import AirQualityObject from '$lib/components/code/docs/air-quality-object.svx';
	import WeatherForecastError from '$lib/components/code/docs/weather-forecast-error.svx';

	import {
		hourly,
		current,
		aqi_european,
		aqi_united_states,
		defaultParameters,
		additionalVariables,
		forecastDaysOptions
	} from './options';

	import {
		pastDaysOptions,
		pastHoursOptions,
		forecastHoursOptions,
		gridCellSelectionOptions,
		temporalResolutionOptions
	} from '../options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['pm10', 'pm2_5']
	});

	let forecastDays = $derived(
		forecastDaysOptions.find((fco) => fco.value == $params.forecast_days)
	);
	let pastDays = $derived(pastDaysOptions.find((pdo) => pdo.value == $params.past_days));

	// Additional variable settings
	let pastHours = $derived(pastHoursOptions.find((pho) => String(pho.value) == $params.past_hours));
	let forecastHours = $derived(
		forecastHoursOptions.find((fho) => String(fho.value) == $params.forecast_hours)
	);
	let cellSelection = $derived(
		gridCellSelectionOptions.find((gcso) => String(gcso.value) == $params.cell_selection)
	);
	let temporalResolution = $derived(
		temporalResolutionOptions.find((tro) => String(tro.value) == $params.temporal_resolution)
	);

	let accordionValues: string[] = $state([]);
	onMount(() => {
		if (
			countVariables(aqi_european, $params.hourly).active &&
			!accordionValues.includes('european_air_quality_index')
		) {
			accordionValues.push('european_air_quality_index');
		}

		if (
			countVariables(aqi_united_states, $params.hourly).active &&
			!accordionValues.includes('united_states_air_quality_index')
		) {
			accordionValues.push('united_states_air_quality_index');
		}

		if (
			(countVariables(additionalVariables, $params.hourly).active ||
				(pastHours ? pastHours.value : false) ||
				(cellSelection ? cellSelection.value : false) ||
				(forecastHours ? forecastHours.value : false) ||
				(temporalResolution ? temporalResolution.value : false)) &&
			!accordionValues.includes('additional-variables')
		) {
			accordionValues.push('additional-variables');
		}
	});

	let begin_date = new Date('2013-01-01');

	let last_date = new Date();
	last_date.setDate(last_date.getDate() + 5);
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
				<div in:fade class="flex flex-col gap-x-6 gap-y-4 lg:flex-row">
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
		<h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">Hourly Air Quality Variables</h2>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each hourly as group}
				<div>
					{#each group as e}
						<div class="group flex items-center" title={e.label}>
							<Checkbox
								id="{e.value}_hourly"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								value={e.value}
								checked={$params.hourly?.includes(e.value)}
								aria-labelledby="{e.value}_label"
								onCheckedChange={() => {
									if ($params.hourly?.includes(e.value)) {
										$params.hourly = $params.hourly.filter((item) => {
											return item !== e.value;
										});
									} else {
										$params.hourly.push(e.value);
										$params.hourly = $params.hourly;
									}
								}}
							/>
							<Label
								id="{e.value}_label"
								for="{e.value}_hourly"
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{@html e.label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
		<small class="text-muted-foreground"
			>* Only available in Europe during pollen season with 4 days forecast</small
		>
	</div>

	<!-- ADDITIONAL VARIABLES -->
	<div class="mt-6">
		<Accordion.Root class="border-border rounded-lg border" bind:value={accordionValues}>
			<AccordionItem
				id="european_air_quality_index"
				title="European Air Quality Index"
				count={countVariables(aqi_european, $params.hourly)}
			>
				{#each aqi_european as group}
					<div>
						{#each group as e}
							<div class="group flex items-center" title={e.label}>
								<Checkbox
									id="{e.value}_hourly"
									class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
									value={e.value}
									checked={$params.hourly?.includes(e.value)}
									aria-labelledby="{e.value}_label"
									onCheckedChange={() => {
										if ($params.hourly?.includes(e.value)) {
											$params.hourly = $params.hourly.filter((item) => {
												return item !== e.value;
											});
										} else {
											$params.hourly.push(e.value);
											$params.hourly = $params.hourly;
										}
									}}
								/>
								<Label
									id="{e.value}_label"
									for="{e.value}_hourly"
									class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{@html e.label}</Label
								>
							</div>
						{/each}
					</div>
				{/each}
				<div>
					<p>
						<small class="text-muted-foreground"
							>Note: The European Air Quality Index (AQI) ranges from 0-20 (good), 20-40 (fair),
							40-60 (moderate), 60-80 (poor), 80-100 (very poor) and exceeds 100 for extremely poor
							conditions.</small
						>
					</p>
					<p>
						<small class="text-muted-foreground"
							>Pollutant thresholds in μg/m³ from the <a
								href="https://www.eea.europa.eu/themes/air/air-quality-index"
								>European Environment Agency (EAA)</a
							> are given on the right. Particulate Matter (PM) is using a 24 hour roling average, while
							gases use hourly values.</small
						>
					</p>
				</div>
				<div>
					<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
						<table
							class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[740px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
							id="airquality_table"
						>
							<caption class="text-muted-foreground mt-2 table-caption text-left"
								>You can find the update timings in the <a
									class="text-link underline"
									href={'/en/docs/model-updates'}>model updates documentation</a
								>.</caption
							>
							<thead>
								<tr>
									<th scope="col">Pollutant <small class="text-muted-foreground">(μg/m³)</small></th
									>
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
					<div>
						{#each group as e}
							<div class="group flex items-center" title={e.label}>
								<Checkbox
									id="{e.value}_hourly"
									class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
									value={e.value}
									checked={$params.hourly?.includes(e.value)}
									aria-labelledby="{e.value}_label"
									onCheckedChange={() => {
										if ($params.hourly?.includes(e.value)) {
											$params.hourly = $params.hourly.filter((item) => {
												return item !== e.value;
											});
										} else {
											$params.hourly.push(e.value);
											$params.hourly = $params.hourly;
										}
									}}
								/>
								<Label
									id="{e.value}_label"
									for="{e.value}_hourly"
									class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{@html e.label}</Label
								>
							</div>
						{/each}
					</div>
				{/each}
				<div>
					<p>
						<small class="text-muted-foreground"
							>Note: The United States Air Quality Index (AQI) ranges from 0-50 (good), 51-100
							(moderate), 101-150 (unhealthy for sensitive groups), 151-200 (unhealthy), 201-300
							(very unhealthy) and 301-500 (hazardous).</small
						>
					</p>
					<p>
						<small class="text-muted-foreground"
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
				<div>
					<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
						<table
							class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[10 54-10040px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
							id="airquality_table_us"
						>
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
									<th scope="row"
										>O<sub>3</sub> <small class="text-muted-foreground">(ppb)</small></th
									>
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
									<th scope="row"
										>O<sub>3</sub> <small class="text-muted-foreground">(ppb)</small></th
									>
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
									<th scope="row"
										>PM<sub>2.5</sub> <small class="text-muted-foreground">(μg/m³)</small></th
									>
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
									<th scope="row"
										>PM<sub>10</sub> <small class="text-muted-foreground">(μg/m³)</small></th
									>
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
									<th scope="row">CO <small class="text-muted-foreground">(ppm)</small></th>
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
									<th scope="row"
										>SO<sub>2</sub> <small class="text-muted-foreground">(ppb)</small></th
									>
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
									<th scope="row"
										>SO<sub>2</sub> <small class="text-muted-foreground">(ppb)</small></th
									>
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
									<th scope="row"
										>NO<sub>2</sub> <small class="text-muted-foreground">(ppb)</small></th
									>
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
				title="Additional Variables And Options"
				last={true}
				count={countVariables(additionalVariables, $params.hourly)}
			>
				<div class="grid md:grid-cols-2">
					{#each additionalVariables as group}
						<div>
							{#each group as e}
								<div class="group flex items-center" title={e.label}>
									<Checkbox
										id="{e.value}_hourly"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										value={e.value}
										checked={$params.hourly?.includes(e.value)}
										aria-labelledby="{e.value}_label"
										onCheckedChange={() => {
											if (e.value && $params.hourly?.includes(e.value)) {
												$params.hourly = $params.hourly.filter((item) => {
													return item !== e.value;
												});
											} else if (e.value && $params.hourly) {
												$params.hourly.push(e.value);
												$params.hourly = $params.hourly;
											}
										}}
									/>
									<Label
										id="{e.value}_label"
										for="{e.value}_hourly"
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{@html e.label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>

				<small class="text-muted-foreground mt-1">
					Note: You can further adjust the forecast time range for hourly weather variables using <mark
						>&forecast_hours=</mark
					>
					and <mark>&past_hours=</mark> as shown below.
				</small>
				<div class=" mt-2 grid grid-cols-1 gap-3 md:mt-4 md:grid-cols-4 md:gap-6">
					<div class="relative">
						<Select.Root name="forecast_hours" type="single" bind:value={$params.forecast_hours}>
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
								>{forecastHours?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each forecastHoursOptions as fho}
									<Select.Item value={fho.value}>{fho.label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
								>Forecast Hours</Label
							>
						</Select.Root>
					</div>
					<div class="relative">
						<Select.Root name="past_hours" type="single" bind:value={$params.past_hours}>
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
								>{pastHours?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each pastHoursOptions as pho}
									<Select.Item value={pho.value}>{pho.label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
								>Past Hours</Label
							>
						</Select.Root>
					</div>

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
		</Accordion.Root>
	</div>

	<!-- CURRENT -->
	<div class="mt-6 md:mt-12">
		<h2 id="current_weather" class="text-2xl md:text-3xl">Current Conditions</h2>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each current as group}
				<div>
					{#each group as e}
						<div class="group flex items-center" title={e.label}>
							<Checkbox
								id="{e.value}_current"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								value={e.value}
								checked={$params.current?.includes(e.value)}
								aria-labelledby="{e.value}_current_label"
								onCheckedChange={() => {
									if ($params.current?.includes(e.value)) {
										$params.current = $params.current.filter((item) => {
											return item !== e.value;
										});
									} else {
										$params.current.push(e.value);
										$params.current = $params.current;
									}
								}}
							/>
							<Label
								id="{e.value}_current_label"
								for="{e.value}_current"
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{@html e.label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
		<div class="text-muted-foreground mt-1 text-sm">
			Note: Current conditions are based on 15-minutely weather model data. Every weather variable
			available in hourly data, is available as current condition as well.
		</div>
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} visible={['domains', 'timeformat']} />
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6"><LicenseSelector /></div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultPreview
		{params}
		{defaultParameters}
		type="air-quality"
		action="air-quality"
		sdk_type="air_quality_api"
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2>
	<div class="mt-2 md:mt-4">
		<p>
			Forecast is based on the 11 kilometer CAMS European air quality forecast and the 40 kilometer
			CAMS global atmospheric composition forecasts. The European and global domain are not coupled
			and may show different forecasts.
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1140px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<caption class="text-muted-foreground mt-2 table-caption text-left"
					>You can find the update timings in the <a
						class="text-link underline"
						href={'/en/docs/model-updates'}>model updates documentation</a
					>.</caption
				>
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
								href="https://ads.atmosphere.copernicus.eu/datasets/cams-europe-air-quality-forecasts?tab=overview"
								>CAMS European Air Quality Forecast</a
							>
						</th>
						<td>Europe</td>
						<td>0.1° (~11 km)</td>
						<td>1-Hourly</td>
						<td>October 2023 onwards</td>
						<td>Every 24 hours, 4 days forecast</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://ads.atmosphere.copernicus.eu/datasets/cams-europe-air-quality-reanalyses?tab=overview"
								>CAMS European Air Quality Reanalysis
							</a>
						</th>
						<td>Europe</td>
						<td>0.1° (~11 km)</td>
						<td>Hourly</td>
						<td>2013 onwards</td>
						<td>-</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://ads.atmosphere.copernicus.eu/datasets/cams-global-atmospheric-composition-forecasts?tab=overview"
								>CAMS global atmospheric composition forecasts</a
							>
						</th>
						<td>Global</td>
						<td>0.25° (~25 km)</td>
						<td>3-Hourly</td>
						<td>August 2022 onwards </td>
						<td>Every 12 hours, 5 days forecast</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://ads.atmosphere.copernicus.eu/datasets/cams-global-greenhouse-gas-forecasts?tab=overview"
								>CAMS Global Greenhouse Gas Forecast</a
							>
						</th>
						<td>Global</td>
						<td>0.1° (~11 km)</td>
						<td>3-Hourly</td>
						<td>November 2024 onwards</td>
						<td>Every 24 hours, 5 days forecast</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2>
	<div class="mt-2 md:mt-4">
		<p>
			The API endpoint <mark>/v1/air-quality</mark> accepts a geographical coordinate, a list of weather
			variables and responds with a JSON hourly air quality forecast for 5 days. Time always starts at
			0:00 today.
		</p>
		<p>All URL parameters are listed below:</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[940px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
							separated. E.g. <mark>&latitude=52.52,48.85&longitude=13.41,2.35</mark>. To return
							data for multiple locations the JSON output changes to a list of structures. CSV and
							XLSX formats add a column <mark>location_id</mark>.</td
						>
					</tr>
					<tr>
						<th scope="row">hourly</th>
						<td>String array</td>
						<td>No</td>
						<td></td>
						<td
							>A list of weather variables which should be returned. Values can be comma separated,
							or multiple
							<mark>&hourly=</mark> parameter in the URL can be used.
						</td>
					</tr>
					<tr>
						<th scope="row">current</th>
						<td>String array</td>
						<td>No</td>
						<td></td>
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
							>If format <mark>unixtime</mark> is selected, all time values are returned in UNIX
							epoch time in seconds. Please note that all timestamp are in GMT+0! For daily values
							with unix timestamps, please apply
							<mark>utc_offset_seconds</mark> again to get the correct date.
						</td>
					</tr>
					<tr>
						<th scope="row">timezone</th>
						<td>String</td>
						<td>No</td>
						<td><mark>GMT</mark></td>
						<td
							>If <mark>timezone</mark> is set, all timestamps are returned as local-time and data
							is returned starting at 00:00 local-time. Any time zone name from the
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
							>If <mark>past_days</mark> is set, yesterday or the day before yesterday data are also
							returned.</td
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
						<td
							>Similar to forecast_days, the number of timesteps of hourly data can controlled.
							Instead of using the current day as a reference, the current hour is used.
						</td>
					</tr>
					<tr>
						<th scope="row">start_date<br />end_date</th>
						<td>String (yyyy-mm-dd)</td>
						<td>No</td>
						<td></td>
						<td
							>The time interval to get weather data. A day must be specified as an ISO8601 date
							(e.g.
							<mark>2022-06-30</mark>).
						</td>
					</tr>
					<tr>
						<th scope="row">start_hour<br />end_hour</th>
						<td>String (yyyy-mm-ddThh:mm)</td>
						<td>No</td>
						<td></td>
						<td
							>The time interval to get weather data for hourly data. Time must be specified as an
							ISO8601 date (e.g.
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
						<td></td>
						<td
							>Only required to commercial use to access reserved API resources for customers. The
							server URL requires the prefix <mark>customer-</mark>. See
							<a
								href={'/en/pricing'}
								title="Pricing information to use the weather API commercially">pricing</a
							> for more information.</td
						>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="text-muted-foreground mt-2">
			Additional optional URL parameters will be added. For API stability, no required parameters
			will be added in the future!
		</p>
	</div>
</div>

<!-- API DOCS - HOURLY -->
<div class="mt-6 md:mt-12">
	<h3 id="hourly_parameter_definition" class="text-xl md:text-2xl">Hourly Parameter Definition</h3>
	<div class="mt-2 md:mt-4">
		<p>
			The parameter <mark>&hourly=</mark> accepts the following values. Most weather variables are given
			as an instantaneous value for the indicated hour. Some variables like precipitation are calculated
			from the preceding hour as an average or sum.
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[940px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
						<th scope="row">pm10<br />pm2_5</th>
						<td>Instant</td>
						<td>μg/m³</td>
						<td
							>Particulate matter with diameter smaller than 10 µm (PM<sub>10</sub>) and smaller
							than 2.5 µm (PM<sub>2.5</sub>) close to surface (10 meter above ground)</td
						>
					</tr>
					<tr>
						<th scope="row"
							>carbon_monoxide<br />nitrogen_dioxide<br />sulphur_dioxide<br />ozone</th
						>
						<td>Instant</td>
						<td>μg/m³</td>
						<td>Atmospheric gases close to surface (10 meter above ground)</td>
					</tr>
					<tr>
						<th scope="row">carbon_dioxide</th>
						<td>Instant</td>
						<td>ppm</td>
						<td>CO2 close to surface (10 meter above ground)</td>
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
						<th scope="row">methane</th>
						<td>Instant</td>
						<td>μg/m³</td>
						<td>Methane close to surface (10 meter above ground)</td>
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
							european_aqi<br />european_aqi_pm2_5<br />european_aqi_pm10<br
							/>european_aqi_nitrogen_dioxide<br />european_aqi_ozone<br
							/>european_aqi_sulphur_dioxide
						</th>
						<td>Instant</td>
						<td>European AQI</td>
						<td
							>European Air Quality Index (AQI) calculated for different particulate matter and
							gases individually. The consolidated <mark>european_aqi</mark> returns the maximum of all
							individual indices. Ranges from 0-20 (good), 20-40 (fair), 40-60 (moderate), 60-80 (poor),
							80-100 (very poor) and exceeds 100 for extremely poor conditions.</td
						>
					</tr>
					<tr>
						<th scope="row">
							us_aqi<br />us_aqi_pm2_5<br />us_aqi_pm10<br />us_aqi_nitrogen_dioxide<br
							/>us_aqi_ozone<br />us_aqi_sulphur_dioxide<br />us_aqi_carbon_monoxide
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
	</div>
</div>

<!-- API DOCS - JSON -->
<div class="mt-6 md:mt-12">
	<h3 id="json_return_object" class="text-xl md:text-2xl">JSON Return Object</h3>
	<div class="mt-2 md:mt-4">
		<p class="">On success a JSON object will be returned.</p>
		<div
			class="code-numbered overflow-auto bg-[#FAFAFA] rounded-lg dark:bg-[#212121] -mx-6 md:ml-0 lg:mx-0 mt-2 md:mt-4"
		>
			<AirQualityObject />
		</div>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[940px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
							>WGS84 of the center of the weather grid-cell which was used to generate this
							forecast. This coordinate might be a few kilometers away from the requested
							coordinate.</td
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
	</div>
</div>

<!-- API DOCS - ERRORS -->
<div class="mt-6 md:mt-12">
	<h3 id="errors" class="text-xl md:text-2xl">Errors</h3>
	<div class="mt-2 md:mt-4">
		<p>
			In case an error occurs, for example a URL parameter is not correctly specified, a JSON error
			object is returned with a HTTP 400 status code.
		</p>
		<div
			class="mt-2 md:mt-4 bg-[#FAFAFA] rounded-lg dark:bg-[#212121] overflow-auto -mx-6 md:ml-0 lg:mx-0"
		>
			<WeatherForecastError />
		</div>
	</div>
</div>

<!-- CITATION -->
<div class="mt-6 md:mt-12">
	<h2 id="citation" class="text-2xl md:text-3xl">Citation & Acknowledgement</h2>
	<div class="mt-3 md:mt-6">
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
	</div>
</div>

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

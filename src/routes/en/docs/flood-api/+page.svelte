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

	import FloodError from '$lib/components/code/docs/flood-error.svx';
	import FloodObject from '$lib/components/code/docs/flood-object.svx';

	import { daily, models, defaultParameters, forecastDaysOptions } from './options';

	import { pastDaysOptions } from '../options';

	const params = urlHashStore({
		latitude: [59.91],
		longitude: [10.75],
		...defaultParameters,
		daily: ['river_discharge']
	});

	let forecastDays = $derived(
		forecastDaysOptions.find((fco) => fco.value == $params.forecast_days)
	);
	let pastDays = $derived(pastDaysOptions.find((pdo) => pdo.value == $params.past_days));

	let accordionValues: string[] = $state([]);
	onMount(() => {
		if (countVariables(models, $params.models).active > 0 && !accordionValues.includes('models')) {
			accordionValues.push('models');
		}
	});

	let begin_date = new Date('1984-01-01');

	let last_date = new Date();
	last_date.setDate(last_date.getDate() + 183);
</script>

<svelte:head>
	<title>Flood API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/flood-api" />
	<meta
		name="description"
		content="Access ensemble flood forecasts estimating the volume of water discharged by rivers worldwide. Get invaluable information for predicting flood events and taking proactive measures for flood preparedness. Ensure safety and minimize the impact of floods with our reliable flood data."
	/>
</svelte:head>

<form method="get" action="https://flood-api.open-meteo.com/v1/flood">
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

	<!-- DAILY -->
	<div class="mt-6 md:mt-12">
		<h2 id="daily_weather_variables" class="text-2xl md:text-3xl">Daily Weather Variables</h2>
		<div class="mt-2">
			{#each daily as group}
				{#each group as e}
					<div class="group flex items-center" title={e.label}>
						<Checkbox
							id="{e.value}_daily"
							class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
							value={e.value}
							checked={$params.daily?.includes(e.value)}
							aria-labelledby="{e.value}_daily_label"
							onCheckedChange={() => {
								if ($params.daily?.includes(e.value)) {
									$params.daily = $params.daily.filter((item) => {
										return item !== e.value;
									});
								} else {
									$params.daily.push(e.value);
									$params.daily = $params.daily;
								}
							}}
						/>
						<Label
							id="{e.value}_daily_label"
							for="{e.value}_daily"
							class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{@html e.label}</Label
						>
					</div>
				{/each}
			{/each}
			<div class="group flex items-center" title="All 50 Ensemble Members">
				<Checkbox
					id="ensemble"
					class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
					value="true"
					bind:checked={$params.ensemble}
					aria-labelledby="ensemble_label"
				/>
				<Label
					id="ensemble_label"
					for="ensemble"
					class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">All 50 Ensemble Members</Label
				>
			</div>
		</div>
	</div>

	<!-- ADDITIONAL VARIABLES -->
	<div class="mt-6">
		<Accordion.Root class="border-border rounded-lg border" bind:value={accordionValues}>
			<AccordionItem
				id="models"
				title="Flood models"
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
				<p>
					<small class="text-muted-foreground"
						>Note: <mark>Seamless</mark> combines forecast and consolidated historical data. Per default,
						GloFAS version 4 with data from 1984 up to 7 months of forecast is used.</small
					>
				</p>
			</AccordionItem>
		</Accordion.Root>
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} visible={['timeformat']} />
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6"><LicenseSelector /></div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultPreview {params} {defaultParameters} type="flood" action="flood" sdk_type="flood_api" />
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2>
	<div class="mt-2 md:mt-4">
		<p>
			This API uses reanalysis and forecast data from the <a
				href="https://www.globalfloods.eu"
				target="_blank">Global Flood Awareness System (GloFAS)</a
			>. Per default, GloFAS version 4 with seamless data from 1984 until 7 months of forecast is
			used.
		</p>
		<p>
			Please note: Due to the 5 km resolution the closest river might not be selected correctly.
			Varying coordiantes by 0.1° can help to get a more representable discharge rate. The GloFAS
			website provides additional maps to help understand how rivers are covered in this dataset.
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[940px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<thead>
					<tr>
						<th scope="col">Weather Model</th>
						<th scope="col">Region</th>
						<th scope="col">Spatial Resolution</th>
						<th scope="col">Temporal Resolution</th>
						<th scope="col">Data Length</th>
						<th scope="col">Update frequency</th>
					</tr>
				</thead>
				<tbody class="[&_a]:text-link [&_a]:underline-offset-3 [&_a]:underline">
					<tr>
						<th scope="row"
							><a
								href="https://cds.climate.copernicus.eu/datasets/cems-glofas-historical?tab=overview"
								target="_blank">GloFAS v4 Reanalysis</a
							></th
						>
						<td>Global</td>
						<td>0.05° (~5 km)</td>
						<td>Daily</td>
						<td>1984 - July 2022</td>
						<td>-</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://cds.climate.copernicus.eu/datasets/cems-glofas-forecast?tab=overview"
								target="_blank">GloFAS v4 Forecast</a
							></th
						>
						<td>Global</td>
						<td>0.05° (~5 km)</td>
						<td>Daily</td>
						<td>30 days forecast</td>
						<td>Daily</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://ewds.climate.copernicus.eu/datasets/cems-glofas-seasonal?tab=overview"
								target="_blank">GloFAS v4 Seasonal Forecast</a
							></th
						>
						<td>Global</td>
						<td>0.05° (~5 km)</td>
						<td>Daily</td>
						<td>7 months forecast</td>
						<td>Monthly</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://ewds.climate.copernicus.eu/datasets/cems-glofas-historical?tab=overview"
								target="_blank">GloFAS v3 Reanalysis</a
							></th
						>
						<td>Global</td>
						<td>0.1° (~11 km)</td>
						<td>Daily</td>
						<td>1984 - July 2022</td>
						<td>-</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://ewds.climate.copernicus.eu/datasets/cems-glofas-forecast?tab=overview"
								target="_blank">GloFAS v3 Forecast</a
							></th
						>
						<td>Global</td>
						<td>0.1° (~11 km)</td>
						<td>Daily</td>
						<td>30 days forecast</td>
						<td>Daily</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://ewds.climate.copernicus.eu/datasets/cems-glofas-seasonal?tab=overview"
								target="_blank">GloFAS v3 Seasonal Forecast</a
							></th
						>
						<td>Global</td>
						<td>0.1° (~11 km)</td>
						<td>Daily</td>
						<td>7 months forecast</td>
						<td>Monthly</td>
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
			The API endpoint <mark>/v1/flood</mark> accepts a geographical coordinate and returns river discharge
			data from the largest river in a 5 km area for the given coordinates. All URL parameters are listed
			below:
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1140px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
						<th scope="row">daily</th>
						<td>String array</td>
						<td>No</td>
						<td></td>
						<td
							>A list of weather variables which should be returned. Values can be comma separated,
							or multiple
							<mark>&daily=</mark> parameter in the URL can be used.
						</td>
					</tr>
					<tr>
						<th scope="row">timeformat</th>
						<td>String</td>
						<td>No</td>
						<td><mark>iso8601</mark></td>
						<td
							>If format <mark>unixtime</mark> is selected, all time values are returned in UNIX epoch
							time in seconds. Please note that all time is then in GMT+0!
						</td>
					</tr>
					<tr>
						<th scope="row">past_days</th>
						<td>Integer</td>
						<td>No</td>
						<td><mark>0</mark></td>
						<td>If <mark>past_days</mark> is set, past data can be returned.</td>
					</tr>
					<tr>
						<th scope="row">forecast_days</th>
						<td>Integer (0-210)</td>
						<td>No</td>
						<td><mark>92</mark></td>
						<td>Per default, only 92 days are returned. Up to 210 days of forecast are possible.</td
						>
					</tr>
					<tr>
						<th scope="row">start_date<br />end_date</th>
						<td>String (yyyy-mm-dd)</td>
						<td>No</td>
						<td></td>
						<td
							>The time interval to get data. A day must be specified as an ISO8601 date (e.g.
							<mark>2022-06-30</mark>). Data are available from 1984-01-01 until 7 month forecast.
						</td>
					</tr>
					<tr>
						<th scope="row">ensemble</th>
						<td>Boolean</td>
						<td>No</td>
						<td></td>
						<td>If <mark>True</mark> all forecast ensemble members will be returned</td>
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
	</div>
	<p class="text-muted-foreground mt-2">
		Additional optional URL parameters will be added. For API stability, no required parameters will
		be added in the future!
	</p>
</div>

<!-- API DOCS - DAILY -->
<div class="mt-6 md:mt-12">
	<h3 id="daily_parameter_definition" class="text-xl md:text-2xl">Daily Parameter Definition</h3>
	<div class="mt-2 md:mt-4">
		<p>The parameter <mark>&daily=</mark> accepts the following values:</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[540px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<thead>
					<tr>
						<th scope="col">Variable</th>
						<th scope="col">Unit</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">river_discharge</th>
						<td>m³/s</td>
						<td>Daily river discharge rate in m³/s</td>
					</tr>
					<tr>
						<th scope="row"
							>river_discharge_mean<br />river_discharge_median<br />river_discharge_max<br
							/>river_discharge_min<br />river_discharge_p25<br />river_discharge_p75</th
						>
						<td>m³/s</td>
						<td
							>Statistical analysis from ensemble members for river discharge rate in m³/s. Only
							available for forecasts and not for consolidated historical data.</td
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
		<p>On success a JSON object will be returned.</p>
		<div
			class="code-numbered overflow-auto bg-[#FAFAFA] rounded-lg dark:bg-[#212121] -mx-6 md:ml-0 lg:mx-0 mt-2 md:mt-4"
		>
			<FloodObject />
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
						<th scope="row">daily</th>
						<td>Object</td>
						<td
							>For each selected weather variable, data will be returned as a floating point array.
							Additionally a
							<mark>time</mark> array will be returned with ISO8601 timestamps.
						</td>
					</tr>
					<tr>
						<th scope="row">daily_units</th>
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
			<FloodError />
		</div>
	</div>
</div>

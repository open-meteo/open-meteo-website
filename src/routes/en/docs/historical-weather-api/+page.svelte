<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { countVariables } from '$lib/utils/meteo';

	import WeatherForecastError from '$lib/components/code/docs/weather-forecast-error.svx';
	import WeatherForecastObject from '$lib/components/code/docs/weather-forecast-object.svx';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select/index';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import DatePicker from '$lib/components/date/date-picker.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import Settings from '$lib/components/settings/settings.svelte';

	import { gridCellSelectionOptions, temporalResolutionOptions } from '../options';
	import {
		additionalDaily,
		additionalVariables,
		daily,
		defaultParameters,
		ensembleSpreadVariables,
		hourly,
		models,
		solarVariables
	} from './options';

	var d = new Date();
	d.setDate(d.getDate() - 2);
	let endDateDefault = d.toISOString().split('T')[0];
	d.setDate(d.getDate() - 14);
	let startDateDefault = d.toISOString().split('T')[0];

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		start_date: startDateDefault,
		end_date: endDateDefault,
		...defaultParameters,
		hourly: ['temperature_2m']
	});

	let timezoneInvalid = $derived(
		$params.timezone == 'UTC' && ($params.daily ? $params.daily.length > 0 : false)
	);

	// Additional variable settings
	let temporalResolution = $derived(
		temporalResolutionOptions.find((tro) => String(tro.value) == $params.temporal_resolution)
	);
	let cellSelection = $derived(
		gridCellSelectionOptions.find((gcso) => String(gcso.value) == $params.cell_selection)
	);

	let accordionValues: string[] = $state([]);
	onMount(() => {
		if (
			(countVariables(additionalVariables, $params.hourly).active ||
				temporalResolution?.value ||
				cellSelection?.value) &&
			!accordionValues.includes('additional-variables')
		) {
			accordionValues.push('additional-variables');
		}

		if (
			(countVariables(solarVariables, $params.hourly).active ||
				Number($params.tilt) > 0 ||
				Number($params.azimuth) > 0) &&
			!accordionValues.includes('solar-variables')
		) {
			accordionValues.push('solar-variables');
		}

		if (
			countVariables(ensembleSpreadVariables, $params.hourly).active &&
			!accordionValues.includes('ensemble-spread-variables')
		) {
			accordionValues.push('ensemble-spread-variables');
		}

		if (countVariables(models, $params.models).active && !accordionValues.includes('models')) {
			accordionValues.push('models');
		}
	});

	// Citation
	let citation = $state('apa');

	let beginDate = new Date('1940-01-01');

	let lastDate = new Date();
	lastDate.setDate(lastDate.getDate() - 1);
</script>

<svelte:head>
	<title>🏛️ Historical Weather API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/historical-weather-api" />
	<meta
		name="description"
		content="Historical 🌤️ weather data from 1940 onwards with weather records dating back to 1940 and hourly resolution available for any location on earth. Retrieve decades worth of data in less than a second with our lightning-fast API. Dive deep into historical weather records, uncover trends, and gain valuable insights with ease."
	/>
</svelte:head>

<Alert.Root variant="info" class="mb-4"
	><svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-info-icon lucide-info"
		><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
	>
	<Alert.Description>
		Now, with the addition of the 9-kilometre ECMWF IFS model, the historical weather API provides
		access to a staggering 90 terabytes of meteorological data! Read the <a
			class="text-link underline"
			href="https://open.substack.com/pub/openmeteo/p/processing-90-tb-historical-weather"
			target="_blank">blog article</a
		>.
	</Alert.Description>
</Alert.Root>

<form method="get" action="https://archive-api.open-meteo.com/v1/archive">
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<div class="mt-6 flex flex-col gap-4 lg:flex-row">
		<div class="lg:w-1/2">
			<DatePicker
				bind:start_date={$params.start_date}
				bind:end_date={$params.end_date}
				{beginDate}
				{lastDate}
			/>
		</div>
		<div class="lg:w-1/2">
			<p>
				You can access past weather data dating back to 1940 in 0.1 or 0.25° resolution. Data from 2017 onwards uses newer weather models with 9 km resolution. Select "ERA5" or "ERA5-Land" for consistent data over multiple decades.
			</p>
			<div class="flex flex-wrap items-center gap-2">
				Quick:
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={() => {
						$params.start_date = '2000-01-01';
						$params.end_date = '2009-12-31';
					}}>2000-2009</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={() => {
						$params.start_date = '2010-01-01';
						$params.end_date = '2019-12-31';
					}}>2010-2019</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={() => {
						$params.start_date = '2020-01-01';
						$params.end_date = '2020-12-31';
					}}>2020</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={() => {
						$params.start_date = '2021-01-01';
						$params.end_date = '2021-12-31';
					}}>2021</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={() => {
						$params.start_date = '2022-01-01';
						$params.end_date = '2022-12-31';
					}}>2022</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={() => {
						$params.start_date = '2023-01-01';
						$params.end_date = '2023-12-31';
					}}>2023</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={() => {
						$params.start_date = '2024-01-01';
						$params.end_date = '2024-12-31';
					}}>2024</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={() => {
						$params.start_date = '2025-01-01';
						$params.end_date = endDateDefault;
					}}>2025</Button
				>
			</div>
		</div>
	</div>

	<!-- HOURLY -->
	<div class="mt-6 md:mt-12">
		<a href="#hourly_weather_variables"
			><h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">
				Hourly Weather Variables
			</h2></a
		>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each hourly as group, i (i)}
				<div>
					{#each group as { value, label } (value)}
						<div class="group flex items-center" title={label}>
							<Checkbox
								id="{value}_hourly"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								{value}
								checked={$params.hourly?.includes(value)}
								aria-labelledby="{value}_label"
								onCheckedChange={() => {
									if ($params.hourly?.includes(value)) {
										$params.hourly = $params.hourly.filter((item: string) => {
											return item !== value;
										});
									} else if ($params.hourly) {
										$params.hourly.push(value);
										$params.hourly = $params.hourly;
									}
								}}
							/>
							<Label
								id="{value}_label"
								for="{value}_hourly"
								class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- ADDITIONAL VARIABLES -->
	<div class="mt-6">
		<Accordion.Root
			type="multiple"
			class="border-border rounded-lg border"
			bind:value={accordionValues}
		>
			<AccordionItem
				id="additional-variables"
				title="Additional Variables And Options"
				count={countVariables(additionalVariables, $params.hourly)}
			>
				<div class="grid md:grid-cols-2">
					{#each additionalVariables as group, i (i)}
						<div>
							{#each group as { value, label } (value)}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{value}_hourly"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										{value}
										checked={$params.hourly?.includes(value)}
										aria-labelledby="{value}_label"
										onCheckedChange={() => {
											if ($params.hourly?.includes(value)) {
												$params.hourly = $params.hourly.filter((item: string) => {
													return item !== value;
												});
											} else if ($params.hourly) {
												$params.hourly.push(value);
												$params.hourly = $params.hourly;
											}
										}}
									/>
									<Label
										id="{value}_label"
										for="{value}_hourly"
										class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
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
								{#each temporalResolutionOptions as { value, label } (value)}
									<Select.Item {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
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
								{#each gridCellSelectionOptions as { value, label } (value)}
									<Select.Item {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
								>Grid Cell Selection</Label
							>
						</Select.Root>
					</div>
				</div>
			</AccordionItem>
			<AccordionItem
				id="solar-variables"
				title="Solar Radiation Variables"
				count={countVariables(solarVariables, $params.hourly)}
			>
				<div class="grid md:grid-cols-2">
					{#each solarVariables as group, i (i)}
						<div>
							{#each group as { value, label } (value)}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{value}_hourly"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										{value}
										checked={$params.hourly?.includes(value)}
										aria-labelledby="{value}_hourly_label"
										onCheckedChange={() => {
											if ($params.hourly?.includes(value)) {
												$params.hourly = $params.hourly.filter((item: string) => {
													return item !== value;
												});
											} else if ($params.hourly) {
												$params.hourly.push(value);
												$params.hourly = $params.hourly;
											}
										}}
									/>
									<Label
										id="{value}_hourly_label"
										for="{value}_hourly"
										class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>

				<small class="text-muted-foreground mt-1">
					Note: Solar radiation is averaged over the past hour. Use
					<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI please
					specify Tilt and Azimuth below.
				</small>

				<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-2 md:gap-6">
					<div class="relative">
						<Input
							id="tilt"
							type="number"
							class="h-12 cursor-pointer pt-6 {Number($params.tilt) < 0 || Number($params.tilt) > 90
								? 'text-red'
								: ''}"
							name="tilt"
							step="1"
							min="0"
							max="90"
							bind:value={$params.tilt}
						/>
						<Label
							class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
							for="tilt">Panel Tilt (0° horizontal)</Label
						>
						{#if Number($params.tilt) < 0 || Number($params.tilt) > 90}
							<div class="invalid-tooltip" transition:slide>Tilt must be between 0° and 90°</div>
						{/if}
					</div>

					<div class="relative">
						<Input
							type="number"
							class="h-12 cursor-pointer pt-6 {Number($params.azimuth) < -180 ||
							Number($params.azimuth) > 180
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
							class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
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
				id="ensemble-spread-variables"
				title="ERA5-Ensemble Spread Variables"
				count={countVariables(ensembleSpreadVariables, $params.hourly)}
			>
				<div class="mt-2 grid sm:grid-cols-2">
					{#each ensembleSpreadVariables as group}
						<div class="col-md-6">
							{#each group as { value, label } (value)}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{value}_hourly"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										{value}
										checked={$params.hourly?.includes(value)}
										aria-labelledby="{value}_hourly_label"
										onCheckedChange={() => {
											if ($params.hourly?.includes(value)) {
												$params.hourly = $params.hourly.filter((item: string) => {
													return item !== value;
												});
											} else if ($params.hourly) {
												$params.hourly.push(value);
												$params.hourly = $params.hourly;
											}
										}}
									/>
									<Label
										id="{value}_hourly_label"
										for="{value}_hourly"
										class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>
				<div>
					<small class="text-muted-foreground"
						>Note: Ensemble spread variables are available if the model <mark>ERA5-Ensemble</mark> is
						used.
					</small>
				</div>
			</AccordionItem>
			<AccordionItem
				id="models"
				title="Reanalysis models"
				count={countVariables(models, $params.models)}
			>
				<div class="mt-2 grid sm:grid-cols-2">
					{#each models as group, i (i)}
						<div class="mb-3">
							{#each group as { value, label } (value)}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{value}_model"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										{value}
										checked={$params.models?.includes(value)}
										aria-labelledby="{value}_label"
										onCheckedChange={() => {
											if ($params.models?.includes(value)) {
												$params.models = $params.models.filter((item: string) => {
													return item !== value;
												});
											} else if ($params.models) {
												$params.models.push(value);
												$params.models = $params.models;
											}
										}}
									/>
									<Label
										id="{value}_model_label"
										for="{value}_model"
										class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>
				<div>
					<small class="text-muted-foreground"
						>Note: The default <mark>Best Match</mark> combines IFS HRES, ERA5 and ERA5-Land
						seamlessly. The CERRA model will also be included in <mark>Best Match</mark> once real-time
						updates become available.</small
					>
				</div>
			</AccordionItem>
		</Accordion.Root>
	</div>

	<!-- DAILY -->
	<div class="mt-6 md:mt-12">
		<a href="#daily_weather_variables"
			><h2 id="daily_weather_variables" class="text-2xl md:text-3xl">Daily Weather Variables</h2></a
		>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each daily as group, i (i)}
				<div>
					{#each group as { value, label } (value)}
						<div class="group flex items-center" title={label}>
							<Checkbox
								id="{value}_daily"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								{value}
								checked={$params.daily?.includes(value)}
								aria-labelledby="{value}_daily_label"
								onCheckedChange={() => {
									if ($params.daily?.includes(value)) {
										$params.daily = $params.daily.filter((item: string) => {
											return item !== value;
										});
									} else if ($params.daily) {
										$params.daily.push(value);
										$params.daily = $params.daily;
									}
								}}
							/>
							<Label
								id="{value}_daily_label"
								for="{value}_daily"
								class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
		{#if timezoneInvalid}
			<div transition:slide>
				<Alert.Root variant="warning" class="mt-2 md:mt-4">
					<Alert.Description>
						It is recommended to select a timezone for daily data. Per default the API will use
						GMT+0.
					</Alert.Description>
				</Alert.Root>
			</div>
		{/if}

		<Accordion.Root type="single" class="border-border mt-3 rounded-lg border md:mt-6">
			<AccordionItem
				id="additional-daily-variables"
				title="Additional Daily Variables"
				count={countVariables(additionalDaily, $params.daily)}
			>
				<div
					class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
				>
					{#each additionalDaily as group, i (i)}
						<div>
							{#each group as { value, label } (value)}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{value}_daily"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										{value}
										checked={$params.daily?.includes(value)}
										aria-labelledby="{value}_daily_label"
										onCheckedChange={() => {
											if ($params.daily?.includes(value)) {
												$params.daily = $params.daily.filter((item: string) => {
													return item !== value;
												});
											} else if ($params.daily) {
												$params.daily.push(value);
												$params.daily = $params.daily;
											}
										}}
									/>
									<Label
										id="{value}_daily_label"
										for="{value}_daily"
										class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</AccordionItem>
		</Accordion.Root>
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<!-- LICENSE -->
	<div class="mt-6 md:mt-12">
		<LicenceSelector requires_professional_plan={true} />
	</div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultsPreview
		{params}
		{defaultParameters}
		type="archive"
		action="archive"
		sdk_cache={-1}
		useStockChart={true}
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<div>
			<p>
				The Historical Weather API is based on reanalysis datasets and uses a combination of weather
				station, aircraft, buoy, radar, and satellite observations to create a comprehensive record
				of past weather conditions. These datasets are able to fill in gaps by using mathematical
				models to estimate the values of various weather variables. As a result, reanalysis datasets
				are able to provide detailed historical weather information for locations that may not have
				had weather stations nearby, such as rural areas or the open ocean.
			</p>
			<p>
				The models for historical weather data use a spatial resolution of 9 km to resolve fine
				details close to coasts or complex mountain terrain. In general, a higher spatial resolution
				means that the data is more detailed and represents the weather conditions more accurately
				at smaller scales.
			</p>
		</div>
		<div>
			<p>
				The ECMWF IFS dataset has been meticulously assembled by Open-Meteo using simulation runs daily at
				0z, 6z, 12z and 18z, employing the most up-to-date version of IFS. This dataset offers the highest
				resolution and precision for global historical weather conditions.
			</p>
			<p>
				However, when studying climate change over decades, it is advisable to exclusively utilise
				ERA5 or ERA5-Land. This choice ensures data consistency and prevents unintentional
				alterations that could arise from the adoption of different weather model upgrades.
			</p>
			<p>
				You can access data dating back to 1940. If you're looking for
				weather information from the previous day, our <a
					href={'/en/docs'}
					title="Weather Forecast API documentation">Forecast API</a
				>
				offers the <mark>&past_days=</mark> feature for your convenience.
			</p>
		</div>
	</div>
	<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
		<table
			class="[&_tr]:border-border mx-6 mt-2 w-full min-w-[1040px] caption-bottom text-left md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
		>
			<caption class="text-muted-foreground mt-2 table-caption text-left"
				>You can find the update timings in the <a
					class="text-link underline"
					href="/en/docs/model-updates">model updates documentation</a
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
			<tbody class="[&_a]:text-link [&_a]:underline [&_a]:underline-offset-3">
				<tr>
					<th scope="row"
						><a
							href="https://www.ecmwf.int/en/forecasts/documentation-and-support/changes-ecmwf-model"
							>ECMWF IFS</a
						>
					</th>
					<td>Global</td>
					<td>9 km</td>
					<td>Hourly</td>
					<td>2017 to present</td>
					<td>Every 6 hours with no delay</td>
				</tr>
				<tr>
					<th scope="row"
						><a
							href="https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels?tab=overview"
							>ERA5</a
						>
					</th>
					<td>Global</td>
					<td>0.25° (~25 km)</td>
					<td>Hourly</td>
					<td>1940 to present</td>
					<td>Daily with 5 days delay</td>
				</tr>
				<tr>
					<th scope="row"
						><a href="https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land?tab=overview"
							>ERA5-Land</a
						>
					</th>
					<td>Global</td>
					<td>0.1° (~11 km)</td>
					<td>Hourly</td>
					<td>1950 to present</td>
					<td>Daily with 5 days delay</td>
				</tr>
				<tr>
					<th scope="row"
						><a
							href="https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels?tab=overview"
							>ERA5-Ensemble</a
						>
					</th>
					<td>Global</td>
					<td>0.5° (~55 km)</td>
					<td>3-Hourly</td>
					<td>1940 to present</td>
					<td>Daily with 5 days delay</td>
				</tr>
				<tr>
					<th scope="row"
						><a
							href="https://cds.climate.copernicus.eu/datasets/reanalysis-cerra-single-levels?tab=overview"
							>CERRA</a
						>
					</th>
					<td>Europe</td>
					<td>5 km</td>
					<td>Hourly</td>
					<td>1985 to June 2021</td>
					<td>-</td>
				</tr>
				<tr>
					<th scope="row"
						><a
							href="https://confluence.ecmwf.int/display/FUG/Section+2.5+Model+Data+Assimilation%2C+4D-Var"
							>ECMWF IFS Assimilation Long-Window</a
						>
					</th>
					<td>Global</td>
					<td>9 km</td>
					<td>6-Hourly</td>
					<td>2024 to present</td>
					<td>Daily with 2 days delay</td>
				</tr>
			</tbody>
		</table>
	</div>
	<p class="mt-3 !mb-0">
		Different reanalysis models may include different sets of weather variables. For instance, ERA5
		offers a full range of variables but only at 0.25° resolution, whereas ERA5-Land focuses on
		surface conditions like temperature, humidity, soil temperature, and soil moisture. CERRA covers
		most variables but excludes soil temperature and moisture. IFS includes nearly all variables
		except snow depth, while IFA Assimilation omits precipitation, snowfall, and solar radiation.
	</p>
	<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
		<table
			class="[&_tr]:border-border mx-6 mt-2 w-full min-w-[1040px] caption-bottom text-left md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
		>
			<caption class="text-muted-foreground mt-2 table-caption text-left text-sm">
				<p class="!mb-0">
					<sup>1</sup> ERA5-Land is driven by atmospheric variables from ERA5 as its "forcing," meaning
					it relies on the same data as ERA5.
				</p>
				<p>
					<sup>2</sup> Only with model “ERA5-Seamless” merging temperature and humidity from ERA5-Land
					with wind and solar radiation from ERA5.
				</p></caption
			>
			<thead>
				<tr>
					<th scope="col">Variable</th>
					<th scope="col">ERA5 0.25°</th>
					<th scope="col">ERA5-Land 0.1°</th>
					<th scope="col">CERRA</th>
					<th scope="col">IFS 9-km</th>
					<th scope="col">IFS 9-km Assimilation</th>
				</tr>
			</thead>
			<tbody class="[&_a]:text-link [&_a]:underline [&_a]:underline-offset-3">
				<tr>
					<th scope="row" class="font-normal"
						>Temperature, Relative Humidity, Dew-point, Vapour Pressure Deficit</th
					>
					<td>x</td>
					<td>x</td>
					<td>x</td>
					<td>x</td>
					<td>x</td>
				</tr>
				<tr>
					<th scope="row" class="font-normal">Soil Temperature & Moisture</th>
					<td>x</td>
					<td>x</td>
					<td>-</td>
					<td>x</td>
					<td>x</td>
				</tr>
				<tr>
					<th scope="row" class="font-normal">Precipitation, Rain, Snowfall</th>
					<td>x</td>
					<td>-<sup class="text-muted-foreground ml-1">*1</sup></td>
					<td>x</td>
					<td>x</td>
					<td>-</td>
				</tr>
				<tr>
					<th scope="row" class="font-normal">Solar Radiation</th>
					<td>x</td>
					<td>-<sup class="text-muted-foreground ml-1">*1</sup></td>
					<td>x</td>
					<td>x</td>
					<td>x</td>
				</tr>
				<tr>
					<th scope="row" class="font-normal">Snow Depth </th>
					<td>-</td>
					<td>x</td>
					<td>x</td>
					<td>-</td>
					<td>-</td>
				</tr>
				<tr>
					<th scope="row" class="font-normal">Wind Speed & Direction</th>
					<td>x</td>
					<td>-<sup class="text-muted-foreground ml-1">*1</sup></td>
					<td>x</td>
					<td>x</td>
					<td>x</td>
				</tr>
				<tr>
					<th scope="row" class="font-normal">Wind Gusts</th>
					<td>-</td>
					<td>x</td>
					<td>x</td>
					<td>x</td>
					<td>-</td>
				</tr>
				<tr>
					<th scope="row" class="font-normal"
						>Apparent Temperature, Reference Evapotranspiration (ET₀)</th
					>
					<td>x<sup class="text-muted-foreground ml-1">*2</sup></td>
					<td>x</td>
					<td>x</td>
					<td>x</td>
					<td>-</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<a href="#api_documentation"
		><h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			The API endpoint <mark>/v1/archive</mark> allows users to retrieve historical weather data for a
			specific location and time period. To use this endpoint, you can specify a geographical coordinate,
			a time interval, and a list of weather variables that they are interested in. The endpoint will
			then return the requested data in a format that can be easily accessed and used by applications
			or other software. This endpoint can be very useful for researchers and other users who need to
			access detailed historical weather data for specific locations and time periods.
		</p>
		<p>All URL parameters are listed below:</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 mt-2 w-full min-w-[1240px] caption-bottom text-left md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<caption class="text-muted-foreground mt-2 table-caption text-left"
					>Additional optional URL parameters will be added. For API stability, no required
					parameters will be added in the future.</caption
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
						<th scope="row">latitude<br />longitude</th>
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
							<mark>&elevation=nan</mark> is specified, downscaling will be disabled and the API uses
							the average grid-cell height. For multiple locations, elevation can also be comma separated.</td
						>
					</tr>
					<tr>
						<th scope="row">start_date<br />end_date</th>
						<td>String (yyyy-mm-dd)</td>
						<td>Yes</td>
						<td></td>
						<td
							>The time interval to get weather data. A day must be specified as an ISO8601 date
							(e.g.
							<mark>2022-12-31</mark>).
						</td>
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
						<th scope="row">daily</th>
						<td>String array</td>
						<td>No</td>
						<td></td>
						<td
							>A list of daily weather variable aggregations which should be returned. Values can be
							comma separated, or multiple <mark>&daily=</mark> parameter in the URL can be used. If
							daily weather variables are specified, parameter <mark>timezone</mark> is required.</td
						>
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
							>Other wind speed speed units: <mark>ms</mark>, <mark>mph</mark> and
							<mark>kn</mark></td
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
							>If format <mark>unixtime</mark> is selected, all time values are returned in UNIX
							epoch time in seconds. Please note that all time is then in GMT+0! For daily values
							with unix timestamp, please apply
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
							is supported If <mark>auto</mark> is set as a time zone, the coordinates will be automatically
							resolved to the local time zone. For multiple coordinates, a comma separated list of timezones
							can be specified.</td
						>
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
							<a href="/en/pricing" title="Pricing information to use the weather API commercially"
								>pricing</a
							> for more information.</td
						>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- API DOCS - HOURLY -->
<div class="mt-6 md:mt-12">
	<a href="#hourly_parameter_definition"
		><h3 id="hourly_parameter_definition" class="text-xl md:text-2xl">
			Hourly Parameter Definition
		</h3></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			The parameter <mark>&hourly=</mark> accepts the following values. Most weather variables are given
			as an instantaneous value for the indicated hour. Some variables like precipitation are calculated
			from the preceding hour as and average or sum.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 mt-2 w-full min-w-[1240px] caption-bottom text-left md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
						<th scope="row">temperature_2m</th>
						<td>Instant</td>
						<td>°C (°F)</td>
						<td>Air temperature at 2 meters above ground</td>
					</tr>
					<tr>
						<th scope="row">relative_humidity_2m</th>
						<td>Instant</td>
						<td>%</td>
						<td>Relative humidity at 2 meters above ground</td>
					</tr>
					<tr>
						<th scope="row">dew_point_2m</th>
						<td>Instant</td>
						<td>°C (°F)</td>
						<td>Dew point temperature at 2 meters above ground</td>
					</tr>
					<tr>
						<th scope="row">apparent_temperature</th>
						<td>Instant</td>
						<td>°C (°F)</td>
						<td
							>Apparent temperature is the perceived feels-like temperature combining wind chill
							factor, relative humidity and solar radiation</td
						>
					</tr>
					<tr>
						<th scope="row">pressure_msl<br />surface_pressure</th>
						<td>Instant</td>
						<td>hPa</td>
						<td
							>Atmospheric air pressure reduced to mean sea level (msl) or pressure at surface.
							Typically pressure on mean sea level is used in meteorology. Surface pressure gets
							lower with increasing elevation.</td
						>
					</tr>
					<tr>
						<th scope="row">precipitation</th>
						<td>Preceding hour sum</td>
						<td>mm (inch)</td>
						<td
							>Total precipitation (rain, showers, snow) sum of the preceding hour. Data is stored
							with a 0.1 mm precision. If precipitation data is summed up to monthly sums, there
							might be small inconsistencies with the total precipitation amount.</td
						>
					</tr>
					<tr>
						<th scope="row">rain</th>
						<td>Preceding hour sum</td>
						<td>mm (inch)</td>
						<td
							>Only liquid precipitation of the preceding hour including local showers and rain from
							large scale systems.</td
						>
					</tr>
					<tr>
						<th scope="row">snowfall</th>
						<td>Preceding hour sum</td>
						<td>cm (inch)</td>
						<td
							>Snowfall amount of the preceding hour in centimeters. For the water equivalent in
							millimeter, divide by 7. E.g. 7 cm snow = 10 mm precipitation water equivalent</td
						>
					</tr>
					<tr>
						<th scope="row">cloud_cover</th>
						<td>Instant</td>
						<td>%</td>
						<td>Total cloud cover as an area fraction</td>
					</tr>
					<tr>
						<th scope="row">cloud_cover_low</th>
						<td>Instant</td>
						<td>%</td>
						<td>Low level clouds and fog up to 2 km altitude</td>
					</tr>
					<tr>
						<th scope="row">cloud_cover_mid</th>
						<td>Instant</td>
						<td>%</td>
						<td>Mid level clouds from 2 to 6 km altitude</td>
					</tr>
					<tr>
						<th scope="row">cloud_cover_high</th>
						<td>Instant</td>
						<td>%</td>
						<td>High level clouds from 6 km altitude</td>
					</tr>
					<tr>
						<th scope="row">shortwave_radiation</th>
						<td>Preceding hour mean</td>
						<td>W/m²</td>
						<td
							>Shortwave solar radiation as average of the preceding hour. This is equal to the
							total global horizontal irradiation
						</td>
					</tr>
					<tr>
						<th scope="row">direct_radiation<br />direct_normal_irradiance</th>
						<td>Preceding hour mean</td>
						<td>W/m²</td>
						<td
							>Direct solar radiation as average of the preceding hour on the horizontal plane and
							the normal plane (perpendicular to the sun)</td
						>
					</tr>
					<tr>
						<th scope="row">diffuse_radiation</th>
						<td>Preceding hour mean</td>
						<td>W/m²</td>
						<td>Diffuse solar radiation as average of the preceding hour</td>
					</tr>
					<tr>
						<th scope="row">global_tilted_irradiance</th>
						<td>Preceding hour mean</td>
						<td>W/m²</td>
						<td
							>Total radiation received on a tilted pane as average of the preceding hour. The
							calculation is assuming a fixed albedo of 20% and in isotropic sky. Please specify
							tilt and azimuth parameter. Tilt ranges from 0° to 90° and is typically around 45°.
							Azimuth should be close to 0° (0° south, -90° east, 90° west, ±180 north). If azimuth
							is set to "nan", the calculation assumes a vertical tracker (east-west). If tilt is
							set to "nan", it is assumed that the panel has a horizontal tracker (up-down). If both
							are set to "nan", a bi-axial tracker is assumed.</td
						>
					</tr>
					<tr>
						<th scope="row">sunshine_duration</th>
						<td>Preceding hour sum</td>
						<td>Seconds</td>
						<td
							>Number of seconds of sunshine of the preceding hour per hour calculated by direct
							normalized irradiance exceeding 120 W/m², following the WMO definition.</td
						>
					</tr>
					<tr>
						<th scope="row">wind_speed_10m<br />wind_speed_100m</th>
						<td>Instant</td>
						<td>km/h (mph, m/s, knots)</td>
						<td
							>Wind speed at 10 or 100 meters above ground. Wind speed on 10 meters is the standard
							level.</td
						>
					</tr>
					<tr>
						<th scope="row">wind_direction_10m<br />wind_direction_100m</th>
						<td>Instant</td>
						<td>°</td>
						<td>Wind direction at 10 or 100 meters above ground</td>
					</tr>
					<tr>
						<th scope="row">wind_gusts_10m</th>
						<td>Instant</td>
						<td>km/h (mph, m/s, knots)</td>
						<td
							>Gusts at 10 meters above ground of the indicated hour. Wind gusts in <mark
								>CERRA</mark
							>
							are defined as the maximum wind gusts of the preceding hour. Please consult the
							<a
								href="https://www.ecmwf.int/en/elibrary/81271-ifs-documentation-cy47r3-part-iv-physical-processes"
								>ECMWF IFS documentation</a
							> for more information on how wind gusts are parameterized in weather models.</td
						>
					</tr>
					<tr>
						<th scope="row">et0_fao_evapotranspiration</th>
						<td>Preceding hour sum</td>
						<td>mm (inch)</td>
						<td
							>ET₀ Reference Evapotranspiration of a well watered grass field. Based on <a
								href="https://www.fao.org/3/x0490e/x0490e04.htm"
								target="_blank">FAO-56 Penman-Monteith equations</a
							>
							ET₀ is calculated from temperature, wind speed, humidity and solar radiation. Unlimited
							soil water is assumed. ET₀ is commonly used to estimate the required irrigation for plants.</td
						>
					</tr>
					<tr>
						<th scope="row">weather_code</th>
						<td>Instant</td>
						<td>WMO code</td>
						<td
							>Weather condition as a numeric code. Follow WMO weather interpretation codes. See
							table below for details. Weather code is calculated from cloud cover analysis,
							precipitation and snowfall. As barely no information about atmospheric stability is
							available, estimation about thunderstorms is not possible.</td
						>
					</tr>
					<tr>
						<th scope="row">snow_depth</th>
						<td>Instant</td>
						<td>meters</td>
						<td
							>Snow depth on the ground. Snow depth in ERA5-Land tends to be overestimated. As the
							spatial resolution for snow depth is limited, please use it with care.</td
						>
					</tr>
					<tr>
						<th scope="row">vapour_pressure_deficit</th>
						<td>Instant</td>
						<td>kPa</td>
						<td
							>Vapor Pressure Deificit (VPD) in kilopascal (kPa). For high VPD (&gt;1.6), water
							transpiration of plants increases. For low VPD (&lt;0.4), transpiration decreases</td
						>
					</tr>
					<tr>
						<th scope="row">
							soil_temperature_0_to_7cm<br />soil_temperature_7_to_28cm<br
							/>soil_temperature_28_to_100cm<br />soil_temperature_100_to_255cm
						</th>
						<td>Instant</td>
						<td>°C (°F)</td>
						<td>Average temperature of different soil levels below ground.</td>
					</tr>
					<tr>
						<th scope="row">
							soil_moisture_0_to_7cm<br />soil_moisture_7_to_28cm<br />soil_moisture_28_to_100cm<br
							/>soil_moisture_100_to_255cm
						</th>
						<td>Instant</td>
						<td>m³/m³</td>
						<td
							>Average soil water content as volumetric mixing ratio at 0-7, 7-28, 28-100 and
							100-255 cm depths.</td
						>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- API DOCS - DAILY -->
<div class="mt-6 md:mt-12">
	<a href="#daily_parameter_definition"
		><h3 id="daily_parameter_definition" class="text-xl md:text-2xl">
			Daily Parameter Definition
		</h3></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			Aggregations are a simple 24 hour aggregation from hourly values. The parameter <mark
				>&daily=</mark
			> accepts the following values:
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 mt-2 w-full min-w-[940px] caption-bottom text-left md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
						<th scope="row">weather_code</th>
						<td>WMO code</td>
						<td>The most severe weather condition on a given day</td>
					</tr>
					<tr>
						<th scope="row">temperature_2m_max<br />temperature_2m_min</th>
						<td>°C (°F)</td>
						<td>Maximum and minimum daily air temperature at 2 meters above ground</td>
					</tr>
					<tr>
						<th scope="row">apparent_temperature_max<br />apparent_temperature_min</th>
						<td>°C (°F)</td>
						<td>Maximum and minimum daily apparent temperature</td>
					</tr>
					<tr>
						<th scope="row">precipitation_sum</th>
						<td>mm</td>
						<td>Sum of daily precipitation (including rain, showers and snowfall)</td>
					</tr>
					<tr>
						<th scope="row">rain_sum</th>
						<td>mm</td>
						<td>Sum of daily rain</td>
					</tr>
					<tr>
						<th scope="row">snowfall_sum</th>
						<td>cm</td>
						<td>Sum of daily snowfall</td>
					</tr>
					<tr>
						<th scope="row">precipitation_hours</th>
						<td>hours</td>
						<td>The number of hours with rain</td>
					</tr>
					<tr>
						<th scope="row">sunrise<br />sunset</th>
						<td>iso8601</td>
						<td>Sun rise and set times</td>
					</tr>
					<tr>
						<th scope="row">sunshine_duration</th>
						<td>seconds</td>
						<td
							>The number of seconds of sunshine per day is determined by calculating direct
							normalized irradiance exceeding 120 W/m², following the WMO definition. Sunshine
							duration will consistently be less than daylight duration due to dawn and dusk.</td
						>
					</tr>
					<tr>
						<th scope="row">daylight_duration</th>
						<td>seconds</td>
						<td>Number of seconds of daylight per day</td>
					</tr>
					<tr>
						<th scope="row">wind_speed_10m_max<br />wind_gusts_10m_max</th>
						<td>km/h (mph, m/s, knots)</td>
						<td>Maximum wind speed and gusts on a day</td>
					</tr>
					<tr>
						<th scope="row">wind_direction_10m_dominant</th>
						<td>°</td>
						<td>Dominant wind direction</td>
					</tr>
					<tr>
						<th scope="row">shortwave_radiation_sum</th>
						<td>MJ/m²</td>
						<td>The sum of solar radiaion on a given day in Megajoules</td>
					</tr>
					<tr>
						<th scope="row">et0_fao_evapotranspiration</th>
						<td>mm</td>
						<td>Daily sum of ET₀ Reference Evapotranspiration of a well watered grass field</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- API DOCS - JSON -->
<div class="mt-6 md:mt-12">
	<a href="#json_return_object"
		><h3 id="json_return_object" class="text-xl md:text-2xl">JSON Return Object</h3></a
	>
	<div class="mt-2 md:mt-4">
		<p class="">On success a JSON object will be returned.</p>
		<div
			class="pregenerated-code code-numbered -mx-6 mt-2 overflow-auto rounded-lg bg-[#FAFAFA] md:mt-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
		>
			<WeatherForecastObject />
		</div>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 mt-2 w-full min-w-[940px] caption-bottom text-left md:mt-4 md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
							forecast. This coordinate might be a few kilometres away from the requested
							coordinate.</td
						>
					</tr>
					<tr>
						<th scope="row">elevation</th>
						<td>Floating point</td>
						<td
							>The elevation from a 90 meter digital elevation model. This effects which grid-cell
							is selected (see parameter <mark>cell_selection</mark>). Statistical downscaling is
							used to adapt weather conditions for this elevation. This elevation can also be
							controlled with the query parameter <mark>elevation</mark>. If
							<mark>&elevation=nan</mark> is specified, all downscaling is disabled and the averge grid-cell
							elevation is used.</td
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
					<tr>
						<th scope="row">daily</th>
						<td>Object</td>
						<td
							>For each selected daily weather variable, data will be returned as a floating point
							array. Additionally a <mark>time</mark> array will be returned with ISO8601 timestamps.</td
						>
					</tr>
					<tr>
						<th scope="row">daily_units</th>
						<td>Object</td>
						<td>For each selected daily weather variable, the unit will be listed here.</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- API DOCS - ERRORS -->
<div class="mt-6 md:mt-12">
	<a href="#errors"><h3 id="errors" class="text-xl md:text-2xl">Errors</h3></a>
	<div class="mt-2 md:mt-4">
		<p>
			In case an error occurs, for example a URL parameter is not correctly specified, a JSON error
			object is returned with a HTTP 400 status code.
		</p>
		<div
			class="pregenerated-code -mx-6 mt-2 overflow-auto rounded-lg bg-[#FAFAFA] md:mt-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
		>
			<WeatherForecastError />
		</div>
	</div>
</div>

<!-- CITATION -->
<div class="mt-6 md:mt-12">
	<a href="#citation"
		><h2 id="citation" class="text-2xl md:text-3xl">Citation & Acknowledgement</h2></a
	>
	<div class="mt-3 md:mt-6">
		<p>
			We encourage researchers in the field of meteorology and related disciplines to cite
			Open-Meteo and its sources in their work. Citing not only gives proper credit but also
			promotes transparency, reproducibility, and collaboration within the scientific community.
			Together, let's foster a culture of recognition and support for open-data initiatives like
			Open-Meteo, ensuring that future researchers can benefit from the valuable resources it
			provides.
		</p>

		<div class="border-border mt-3 rounded-lg border p-6 md:mt-6">
			<ToggleGroup.Root type="single" bind:value={citation} class="mb-3  justify-start gap-0">
				<div class="text-muted-foreground">Citation:</div>
				<div class="border-border ml-2 flex rounded-lg border">
					<ToggleGroup.Item
						value="apa"
						class="!h-10 cursor-pointer rounded-e-none py-2 opacity-100! lg:min-h-[unset] "
						disabled={citation === 'apa'}
					>
						APA
					</ToggleGroup.Item>
					<ToggleGroup.Item
						value="mla"
						class="!h-10 cursor-pointer rounded-none opacity-100! duration-300 lg:min-h-[unset] "
						disabled={citation === 'mla'}
					>
						MLA
					</ToggleGroup.Item>
					<ToggleGroup.Item
						value="harvard"
						class="!h-10 cursor-pointer rounded-none opacity-100! duration-300 lg:min-h-[unset] "
						disabled={citation === 'harvard'}
					>
						Harvard
					</ToggleGroup.Item>
					<ToggleGroup.Item
						value="bibtex"
						class="!h-10 cursor-pointer rounded-md rounded-s-none opacity-100! duration-300 lg:min-h-[unset] "
						disabled={citation === 'bibtex'}
					>
						BibTex
					</ToggleGroup.Item>
				</div>
			</ToggleGroup.Root>

			<div>
				{#if citation === 'apa'}
					<div in:fade>
						<p>
							Zippenfenig, P. (2023). Open-Meteo.com Weather API [Computer software]. Zenodo. <a
								title="zenodo publication"
								href="https://doi.org/10.5281/ZENODO.7970649"
								>https://doi.org/10.5281/ZENODO.7970649</a
							>
						</p>
						<p>
							Hersbach, H., Bell, B., Berrisford, P., Biavati, G., Horányi, A., Muñoz Sabater, J.,
							Nicolas, J., Peubey, C., Radu, R., Rozum, I., Schepers, D., Simmons, A., Soci, C.,
							Dee, D., Thépaut, J-N. (2023). ERA5 hourly data on single levels from 1940 to present
							[Data set]. ECMWF. <a href="https://doi.org/10.24381/cds.adbb2d47" title="era5-land"
								>https://doi.org/10.24381/cds.adbb2d47</a
							>
						</p>
						<p>
							Muñoz Sabater, J. (2019). ERA5-Land hourly data from 2001 to present [Data set].
							ECMWF. <a href="https://doi.org/10.24381/CDS.E2161BAC" title="era5-land"
								>https://doi.org/10.24381/CDS.E2161BAC</a
							>
						</p>
						<p>
							Schimanke S., Ridal M., Le Moigne P., Berggren L., Undén P., Randriamampianina R.,
							Andrea U., Bazile E., Bertelsen A., Brousseau P., Dahlgren P., Edvinsson L., El Said
							A., Glinton M., Hopsch S., Isaksson L., Mladek R., Olsson E., Verrelle A., Wang Z.Q.
							(2021). CERRA sub-daily regional reanalysis data for Europe on single levels from 1984
							to present [Data set]. ECMWF. <a
								href="https://doi.org/10.24381/CDS.622A565A"
								title="cerra">https://doi.org/10.24381/CDS.622A565A</a
							>
						</p>
					</div>
				{:else if citation === 'mla'}
					<div
						in:fade
						class:active={citation === 'mla'}
						id="pills-mla"
						aria-labelledby="pills-mla-tab"
					>
						<p>
							Zippenfenig, Patrick. Open-Meteo.com Weather API., Zenodo, 2023,
							doi:10.5281/ZENODO.7970649.
						</p>
						<p>
							Hersbach, H., Bell, B., Berrisford, P., Biavati, G., Horányi, A., Muñoz Sabater, J.,
							Nicolas, J., Peubey, C., Radu, R., Rozum, I., Schepers, D., Simmons, A., Soci, C.,
							Dee, D., Thépaut, J-N. (2023). ERA5 hourly data on single levels from 1940 to present
							[Data set]. ECMWF. https://doi.org/10.24381/cds.adbb2d47
						</p>
						<p>
							Muñoz Sabater, J. (2019). ERA5-Land hourly data from 2001 to present [Data set].
							ECMWF. https://doi.org/10.24381/CDS.E2161BAC
						</p>
						<p>
							Schimanke S., Ridal M., Le Moigne P., Berggren L., Undén P., Randriamampianina R.,
							Andrea U., Bazile E., Bertelsen A., Brousseau P., Dahlgren P., Edvinsson L., El Said
							A., Glinton M., Hopsch S., Isaksson L., Mladek R., Olsson E., Verrelle A., Wang Z.Q.
							CERRA Sub-Daily Regional Reanalysis Data for Europe on Single Levels from 1984 to
							Present. ECMWF, 2021, doi:10.24381/CDS.622A565A.
						</p>
					</div>
				{:else if citation === 'harvard'}
					<div in:fade>
						<p>
							Zippenfenig, P. (2023) Open-Meteo.com Weather API. Zenodo. doi:
							10.5281/ZENODO.7970649.
						</p>
						<p>
							Hersbach, H., Bell, B., Berrisford, P., Biavati, G., Horányi, A., Muñoz Sabater, J.,
							Nicolas, J., Peubey, C., Radu, R., Rozum, I., Schepers, D., Simmons, A., Soci, C.,
							Dee, D., Thépaut, J-N. (2023) “ERA5 hourly data on single levels from 1940 to
							present.” ECMWF. doi: 10.24381/cds.adbb2d47.
						</p>
						<p>
							Muñoz Sabater, J. (2019) “ERA5-Land hourly data from 2001 to present.” ECMWF. doi:
							10.24381/CDS.E2161BAC.
						</p>
						<p>
							Schimanke S., Ridal M., Le Moigne P., Berggren L., Undén P., Randriamampianina R.,
							Andrea U., Bazile E., Bertelsen A., Brousseau P., Dahlgren P., Edvinsson L., El Said
							A., Glinton M., Hopsch S., Isaksson L., Mladek R., Olsson E., Verrelle A., Wang Z.Q.
							(2021) “CERRA sub-daily regional reanalysis data for Europe on single levels from 1984
							to present.” ECMWF. doi: 10.24381/CDS.622A565A.
						</p>
					</div>
				{:else if citation === 'bibtex'}
					<div in:fade>
						<pre class="overflow-auto rounded-lg">
<code
								>@software&#123;Zippenfenig_Open-Meteo,
  author = &#123;Zippenfenig, Patrick&#125;,
  doi = &#123;10.5281/zenodo.7970649&#125;,
  licence = &#123;CC-BY-4.0&#125;,
  title = &#123;Open-Meteo.com Weather API&#125;,
  year = &#123;2023&#125;,
  copyright = &#123;Creative Commons Attribution 4.0 International&#125;,
  url = &#123;https://open-meteo.com/&#125;
&#125;</code
							><br /><br /><code
								>@misc&#123;Hersbach_ERA5,
  doi = &#123;10.24381/cds.adbb2d47&#125;,
  url = &#123;https://cds.climate.copernicus.eu/doi/10.24381/cds.adbb2d47&#125;,
  author = &#123;Hersbach, H., Bell, B., Berrisford, P., Biavati, G., Horányi, A., Muñoz Sabater, J., Nicolas, J., Peubey, C., Radu, R., Rozum, I., Schepers, D., Simmons, A., Soci, C., Dee, D., Thépaut, J-N.&#125;,
  title = &#123;ERA5 hourly data on single levels from 1940 to present&#125;,
  publisher = &#123;ECMWF&#125;,
  year = &#123;2023&#125;
&#125;</code
							><br /><br /><code
								>@misc&#123;Munoz_ERA5_LAND,
  doi = &#123;10.24381/CDS.E2161BAC&#125;,
  url = &#123;https://cds.climate.copernicus.eu/doi/10.24381/cds.e2161bac&#125;,
  author = &#123;Muñoz Sabater, J.&#125;,
  title = &#123;ERA5-Land hourly data from 2001 to present&#125;,
  publisher = &#123;ECMWF&#125;,
  year = &#123;2019&#125;
&#125;</code
							><br /><br /><code
								>@misc&#123;Schimanke_CERRA,
  doi = &#123;10.24381/CDS.622A565A&#125;,
  url = &#123;https://cds.climate.copernicus.eu/doi/10.24381/cds.622a565a&#125;,
  author = &#123;Schimanke S., Ridal M., Le Moigne P., Berggren L., Undén P., Randriamampianina R., Andrea U., Bazile E., Bertelsen A., Brousseau P., Dahlgren P., Edvinsson L., El Said A., Glinton M., Hopsch S., Isaksson L., Mladek R., Olsson E., Verrelle A., Wang Z.Q.&#125;,
  title = &#123;CERRA sub-daily regional reanalysis data for Europe on single levels from 1984 to present&#125;,
  publisher = &#123;ECMWF&#125;,
  year = &#123;2021&#125;
&#125;</code
							></pre>
					</div>
				{/if}
			</div>
		</div>
		<p class="text-muted-foreground mt-2">
			Generated using Copernicus Climate Change Service information 2022.
		</p>
	</div>
</div>

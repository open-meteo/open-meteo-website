<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { countVariables } from '$lib/utils/meteo';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import DatePicker from '$lib/components/date/date-picker.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import Settings from '$lib/components/settings/settings.svelte';

	import {
		forecastHoursOptions,
		gridCellSelectionOptions,
		pastDaysOptions,
		pastHoursOptions,
		temporalResolutionOptions,
		models as weatherModels
	} from '../options';
	import {
		additionalVariables,
		daily,
		defaultParameters,
		forecastDaysOptions,
		hourly,
		models
	} from './options';

	weatherModels.push([
		{ value: 'ecmwf_ifs', label: 'ECMWF IFS 9km HRES' },
		{ value: 'era5_seamless', label: 'ERA5-Seamless', caption: 'ERA5 & ERA5-Land combined' },
		{ value: 'era5', label: 'ERA5', caption: '25 km, Global' },
		{ value: 'era5_land', label: 'ERA5-Land', caption: '10 km, Global' },
		{ value: 'era5_ensemble', label: 'ERA5-Ensemble', caption: '0.5° ~55km, Global' },
		{ value: 'cerra', label: 'CERRA', caption: '5 km, Europe, 1985 to June 2021' }
	]);

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		temporal_resolution: 'native',
		hourly: ['shortwave_radiation']
	});

	let timezoneInvalid = $derived(
		$params.timezone == 'UTC' && ($params.daily ? $params.daily.length > 0 : false)
	);

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
			(countVariables(additionalVariables, $params.hourly).active ||
				(pastHours ? pastHours.value : false) ||
				(cellSelection ? cellSelection.value : false) ||
				(forecastHours ? forecastHours.value : false) ||
				(temporalResolution ? temporalResolution.value : false)) &&
			!accordionValues.includes('additional-variables')
		) {
			accordionValues.push('additional-variables');
		}

		if (countVariables(models, $params.models).active && !accordionValues.includes('models')) {
			accordionValues.push('models');
		}
	});

	let beginDate = new Date('1983-01-01');

	let lastDate = new Date();
	lastDate.setDate(lastDate.getDate());
</script>

{'' +
	/*
TODO:
- consider switch between archive and realtime endpoints -> Archive data requires large amounts of storage (>4TB)
- future option for satellite corrected weather forecasts? Data needs to be on the same node
- api endpoint URL... regular API server? dedicated satellite only server that pulls in weather model SW rad (+ens, +prev days)?
- proper solar variables documentation
- better time switch for hourly/10 and 15min
- better model selection
- add GEOS data
- add image with satellite area cover
*/ ''}

<svelte:head>
	<title>Satellite Radiation API 🛰️☀️ | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/satellite-radiation-api" />
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
		Solar radiation data from NASA GOES satellites has not been integrated yet, so data is currently
		unavailable for North America.
	</Alert.Description>
</Alert.Root>

<form method="get" action="https://api.open-meteo.com/v1/forecast">
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<div class="mt-6">
		<div class="mt-3 flex items-center gap-2">
			<div class="text-muted-foreground">Time:</div>

			<div class="border-border flex rounded-md border">
				<Button
					variant="ghost"
					class="gap-1 rounded-e-none !opacity-100 duration-300 {$params.time_mode ===
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
					class="gap-1 rounded-s-none !opacity-100 duration-300  {$params.time_mode ===
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
									{#each forecastDaysOptions as { value, label } (value)}
										<Select.Item class="cursor-pointer" {value}>{label}</Select.Item>
									{/each}
								</Select.Content>
								<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
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
									{#each pastDaysOptions as { value, label } (value)}
										<Select.Item class="cursor-pointer" {value}>{label}</Select.Item>
									{/each}
								</Select.Content>
								<Label
									class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
								>
									Past days</Label
								>
							</Select.Root>
						</div>
					</div>

					<div>
						<p>
							By default, solar radiation for the current day is returned. If you're interested in
							past satellite data, you can use the <mark>Past Days</mark>
							feature to access archived data.
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
							{beginDate}
							{lastDate}
						/>
					</div>
					<div class="mb-3 lg:w-1/2">
						<p>
							The <mark>Start Date</mark> and <mark>End Date</mark> options help you choose a range of
							dates more easily. Depending on the satellite data source, data from 1983 onwards is available.
						</p>
						<div class="flex flex-wrap items-center gap-2">
							Quick:
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
									$params.end_date = new Date().toISOString().split('T')[0];
								}}>2025</Button
							>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- HOURLY -->
	<div class="mt-6 md:mt-12">
		<a href="#hourly_weather_variables">
			<h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">Hourly Radiation Variables</h2>
		</a>
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
		<small class="text-muted-foreground"
			>Note: Solar radiation is averaged over the past hour. Use
			<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI please
			specify Tilt and Azimuth below.</small
		>

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
											if (value && $params.hourly?.includes(value)) {
												$params.hourly = $params.hourly.filter((item: string) => {
													return item !== value;
												});
											} else if (value && $params.hourly) {
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
					<div class="relative">
						<Select.Root name="forecast_hours" type="single" bind:value={$params.forecast_hours}>
							<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
								>{forecastHours?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each forecastHoursOptions as { value, label } (value)}
									<Select.Item {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
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
								{#each pastHoursOptions as { value, label } (value)}
									<Select.Item {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
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
				id="models"
				title="Satellite Data Sources"
				count={countVariables(models.concat(weatherModels), $params.models)}
			>
				<div class="mt-2">
					{#each models as group, i (i)}
						<div class="mb-12">
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
				<p>
					You can also compare solar radiation directly with weather models by selecting a model
					below
				</p>
				<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
					{#each weatherModels as group, i (i)}
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
						>Note: The default <mark>Best Match</mark> provides the best forecast for any given
						location worldwide. <mark>Seamless</mark> combines all models from a given provider into a
						seamless prediction.</small
					>
				</div>
			</AccordionItem>
		</Accordion.Root>
	</div>

	<!-- DAILY -->
	<div class="mt-6 md:mt-12">
		<a href="#daily_weather_variables"
			><h2 id="daily_weather_variables" class="text-2xl md:text-3xl">
				Daily Radiation Variables
			</h2></a
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
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} visible={['timeformat']} />
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6"><LicenceSelector /></div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultsPreview
		{params}
		{defaultParameters}
		model_default="satellite_radiation_seamless"
		type="satellite"
		action="archive"
		useStockChart={true}
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
		<table
			class="[&_tr]:border-border mx-6 mt-2 min-w-[1040px] caption-bottom text-left md:mt-4 md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
		>
			<thead>
				<tr>
					<th scope="col">Provider</th>
					<th scope="col">Satellite</th>
					<th scope="col">Region</th>
					<th scope="col">Spatial Resolution</th>
					<th scope="col">Temporal Resolution</th>
					<th scope="col">Update frequency</th>
					<th scope="col">Delay</th>
					<th scope="col">Archive since</th>
				</tr>
			</thead>
			<tbody>
				<tr>
				<th scope="row"
						><a
							href="https://www.dwd.de/DE/leistungen/fernerkund_globalstrahlung_sis/fernerkund_globalstrahlung_sis.html"
							target="_blank">DWD</a
						></th
					>
					<td>EUMETSAT MTG</td>
					<td>Europe, Africa</td>
					<td>0.025° (~ 2.5km)</td>
					<td>10 minutely</td>
					<td>Every 10 minutes</td>
					<td>20 Minutes</td>
					<td>Feb. 2026</td>
				</tr>
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
					<td>2 Hours</td>
					<td>2025</td>
				</tr>
				<tr>
					<td>IODC</td>
					<td>Europe, Africa, India (only land)</td>
					<td>0.05° (~ 5km)</td>
					<td>15 minutely</td>
					<td>Every Hour</td>
					<td>2 Hours</td>
					<td>2025</td>
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
					<td>1983</td>
				</tr>
				<tr>
					<th rowspan="2" scope="row"
						><a href="https://www.eorc.jaxa.jp/ptree/userguide.html" target="_blank">JMA JAXA</a
						></th
					>
					<td>Himawari-9</td>
					<td>India, Asia, Australia, New Zealand</td>
					<td>0.05° (~ 5km)</td>
					<td>10 minutely</td>
					<td>Every 10 minutes</td>
					<td>30 Minutes</td>
					<td>2015</td>
				</tr>
				<tr>
					<td>EUMETSAT MTG</td>
					<td>Europe, Africa</td>
					<td>0.05° (~ 5km)</td>
					<td>10 minutely</td>
					<td>Every 10 minutes</td>
					<td>30 Minutes</td>
					<td>2025</td>
				</tr>
				<tr>
					<th scope="row" rowspan="2">NASA (not yet available)</th>
					<td>GOES-East</td>
					<td>North & South America</td>
					<td>0.05° (~ 5km)</td>
					<td>N/A</td>
					<td>N/A</td>
					<td>N/A</td>
					<td>N/A</td>
				</tr>
				<tr>
					<td>GOES-West</td>
					<td>Pacific Ocean & Alaska</td>
					<td>N/A</td>
					<td>N/A</td>
					<td>N/A</td>
					<td>N/A</td>
					<td>N/A</td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:gap-6">
		<figure>
			<enhanced:img
				src="/static/images/models/geostationary-satellites.png"
				class="rounded-lg"
				alt="Geostationary satellites for solar radiation"
			/>
			<figcaption class="text-muted-foreground">
				Geostationary satellites for solar radiation. Source: <a
					href="https://www.earthdata.nasa.gov/news/blog/geostationary-active-fire-detection-data-firms"
					>NASA</a
				>.
			</figcaption>
		</figure>
	</div>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<a href="#api_documentation"
		><h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			The Satellite Radiation API integrate solar radiation data from various satellite datasets
			into a single consistent endpoint. Different geostationary satellites are used to provide
			global coverage.
		</p>
		<ul class="ml-6 list-disc">
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
				<strong>Clear-Sky solar shortwave radiation</strong> is only available for DWD satellite shortwave
				radiation data.
			</li>
			<li>
				<strong>Instantaneous Values Correction</strong>: All satellites provide data as
				instantaneous values. However, a full Earth scan takes approximately 10–15 minutes. As a
				result, the top and bottom of each scan have a significant time difference. To ensure
				comparability with data sources like weather models, OpenMeteo corrects for these scan time
				differences and derives backward-averaged values.
			</li>
			<li>
				<strong>Different temporal resolutions:</strong> Data is available in 10, 15 or 30–minutely steps.
				For compatibility, the API returns 1–hourly data. If you want to access the underlying time resolution,
				make sure to set "Temporal resolution for hourly data" to "native".
			</li>
		</ul>
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
			The parameter <mark>&hourly=</mark> accepts the following values. All data is provided in W/m².
			Solar radiation parameters are available as either instantaneous values or backward averages over
			the past hour. If you select 10/15/30-minute data, the backward averages will use the same 10/15/30-minute
			intervals.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 mt-2 w-full min-w-[1060px] caption-bottom text-left md:mt-4 md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<thead>
					<tr>
						<th scope="col">Variable</th>
						<th scope="col">Valid time</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">shortwave_radiation</th>
						<td>Preceding hour mean</td>
						<td
							>Shortwave solar radiation is the average incoming solar radiation over the preceding
							hour at the surface. It corresponds to the total global horizontal irradiance (GHI),
							defined as the sum of direct and diffuse solar radiation. It accounts for atmospheric
							effects including clouds and aerosols.
						</td>
					</tr>
					<tr>
						<th scope="row">diffuse_radiation</th>
						<td>Preceding hour mean</td>
						<td
							>Diffuse solar radiation is the average refracted and scattered component of solar
							radiation reaching the surface over the preceding hour. It excludes the direct solar
							beam and results from interactions of sunlight with atmospheric molecules, aerosols,
							and clouds.</td
						>
					</tr>
					<tr>
						<th scope="row">direct_radiation</th>
						<td>Preceding hour mean</td>
						<td
							>Direct solar radiation is the average solar radiation over the preceding hour on a
							horizontal surface that comes straight from the sun. It excludes any scattered or
							reflected light and represents the unaltered solar beam reaching the surface.</td
						>
					</tr>
					<tr>
						<th scope="row">direct_normal_irradiance</th>
						<td>Preceding hour mean</td>
						<td
							>Direct normal irradiance (DNI) is the average direct solar radiation over the
							preceding hour measured on a surface perpendicular to the sun’s rays. “Perpendicular”
							means the surface always faces the sun directly, as if mounted on a solar tracker,
							capturing the maximum direct solar beam without scattering.</td
						>
					</tr>
					<tr>
						<th scope="row">global_tilted_irradiance</th>
						<td>Preceding hour mean</td>
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
						<th scope="row">shortwave_radiation_clear_sky</th>
						<td>Preceding hour mean</td>
						<td
							>Clear-sky shortwave radiation is the solar radiation reaching the surface in the
							absence of clouds. Atmospheric effects such as gas absorption, aerosol scattering, and
							refraction due to air density are included, while cloud particles are excluded. Under
							perfectly clear conditions, the regular shortwave radiation can be as high as the
							clear-sky shortwave radiation.</td
						>
					</tr>
					<tr>
						<th scope="row">terrestrial_radiation</th>
						<td>Preceding hour mean</td>
						<td
							>The solar radiation at the top of the atmosphere, unaffected by clouds or aerosols.
							It is purely calculated using the solar position factor multiplied by the solar
							constant of 1367.7 W/m². This differs from clear sky radiation, which accounts for
							aerosols but not clouds.</td
						>
					</tr>
					<tr>
						<th scope="row">*_instant</th>
						<td>Instant</td>
						<td
							>All solar radiation parameters can be expressed as instantaneous values by accounting
							for the solar zenith angle at a specific moment. Instantaneous values are useful for
							direct comparison with local measurements. However, for energy calculations or model
							evaluations, backward-averaged (preceding hour) data is preferred. By default, the
							Open-Meteo API provides backward-averaged solar radiation to simplify energy
							calculations.</td
						>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

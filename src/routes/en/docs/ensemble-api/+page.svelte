<script lang="ts">
	import { onMount } from 'svelte';

	import { fade, slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { countVariables } from '$lib/utils/meteo';

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
		hourly,
		models,
		solarVariables,
		defaultParameters,
		available_variables,
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
		hourly: ['temperature_2m'],
		models: ['icon_seamless']
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

	let accordionValues = $state([]);
	onMount(() => {
		if (
			(countVariables(additionalVariables, $params.hourly).active ||
				forecastHours.value ||
				pastHours.value ||
				temporalResolution.value ||
				cellSelection.value) &&
			!accordionValues.includes('additional-variables')
		) {
			accordionValues.push('additional-variables');
		}

		if (
			(countVariables(solarVariables, $params.hourly).active ||
				$params.tilt > 0 ||
				$params.azimuth > 0) &&
			!accordionValues.includes('solar-variables')
		) {
			accordionValues.push('solar-variables');
		}
	});

	function isAvailable(variable: String, models: String[]): Boolean {
		if (models.length == 0) {
			return true;
		}
		for (const model of models) {
			if (!Object.hasOwn(available_variables, model)) {
				continue;
			}
			if (available_variables[model].includes(variable)) {
				return true;
			}
		}
		return false;
	}

	let begin_date = new Date('2023-04-01');

	let last_date = new Date();
	last_date.setDate(last_date.getDate() + 35);
</script>

<svelte:head>
	<title>Ensemble API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/ensemble-api" />
</svelte:head>

<Alert.Root class="border-border mb-4">
	<Alert.Description>
		The initial version of ensemble weather models has been integrated. You can learn more about
		these models in the <a
			class="text-link underline"
			href="https://openmeteo.substack.com/p/ensemble-weather-forecast-api"
			target="_blank">blog article</a
		>.
	</Alert.Description>
</Alert.Root>

<form method="get" action="https://ensemble-api.open-meteo.com/v1/ensemble">
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

	<!-- ENSEMBLE -->
	<div class="mt-6 md:mt-12">
		<h2 id="ensemble_models" class="text-2xl md:text-3xl">Ensemble Models</h2>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each models as group}
				<div>
					{#each group as e}
						<div class="group flex items-center" title={e.label}>
							<Checkbox
								id="{e.value}_models"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								value={e.value}
								checked={$params.models?.includes(e.value)}
								aria-labelledby="{e.value}_model_label"
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
								for="{e.value}_models"
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- HOURLY -->
	<div class="mt-6 md:mt-12">
		<h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">Hourly Weather Variables</h2>
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
								disabled={!isAvailable(e.value, $params.models)}
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
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- ADDITIONAL VARIABLES -->
	<div class="mt-6">
		<Accordion.Root class="border-border rounded-lg border" bind:value={accordionValues}>
			<AccordionItem
				id="additional-variables"
				title="Additional Variables And Options"
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
										disabled={!isAvailable(e.value, $params.models)}
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
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
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
			<AccordionItem
				id="solar-variables"
				title="Solar Radiation Variables"
				count={countVariables(solarVariables, $params.hourly)}
			>
				{#each solarVariables as group}
					<div class="grid md:grid-cols-2">
						{#each group as e}
							<div class="group flex items-center" title={e.label}>
								<Checkbox
									id="{e.value}_hourly"
									class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
									value={e.value}
									checked={$params.hourly?.includes(e.value)}
									disabled={!isAvailable(e.value, $params.models)}
									aria-labelledby="{e.value}_hourly_label"
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
									id="{e.value}_hourly_label"
									for="{e.value}_hourly"
									class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{e.label}</Label
								>
							</div>
						{/each}
					</div>
				{/each}

				<small class="text-muted-foreground mt-1">
					Note: Solar radiation is averaged over the past hour. Use
					<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI
					please specify Tilt and Azimuth below.
				</small>

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
		</Accordion.Root>
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6"><LicenseSelector requires_professional_plan={true} /></div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultPreview
		{params}
		{defaultParameters}
		type="ensemble"
		action="ensemble"
		sdk_type="ensemble_api"
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2>
	<div class="mt-2 md:mt-4">
		<p>
			Ensemble models are a type of weather forecasting technique that use multiple members or
			versions of a model to produce a range of possible outcomes for a given forecast. Each member
			is initialized with slightly different initial conditions and/or model parameters to account
			for uncertainties and variations in the atmosphere, resulting in a set of perturbed forecasts.
		</p>
		<p>
			By combining the perturbed forecasts, the ensemble model generates a probability distribution
			of possible outcomes, indicating not only the most likely forecast but also the range of
			possible outcomes and their likelihoods. This probabilistic approach provides more
			comprehensive and accurate forecast guidance, especially for high-impact weather events where
			uncertainties are high.
		</p>
		<p>
			Different national weather services calculate ensemble models, each with varying resolutions
			of weather variables and forecast time-range. For instance, the German weather service DWD's
			ICON model provides exceptionally high resolution for Europe but only forecasts up to 7 days.
			Meanwhile, the GFS model can forecast up to 35 days, albeit at a lower resolution of 50 km.
			The appropriate ensemble model to use would depend on the forecast horizon and region of
			interest.
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1240px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<caption class="text-muted-foreground mt-2 table-caption text-left"
					>You can find the update timings in the <a
						class="text-link underline"
						href={'/en/docs/model-updates'}>model updates documentation</a
					>. To ensure ease of use, all data is interpolated to a 1-hourly time-step resolution. As
					the forecast horizon extends further into the future, some ensemble models may reduce the
					time resolution to 6-hourly intervals.</caption
				>
				<thead>
					<tr>
						<th scope="col">National Weather Service</th>
						<th scope="col">Weather Model</th>
						<th scope="col">Region</th>
						<th scope="col">Resolution</th>
						<th scope="col">Members</th>
						<th scope="col">Forecast Length</th>
						<th scope="col">Update frequency</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row" rowspan="3">Deutscher Wetterdienst (DWD)</th>
						<td>ICON-D2-EPS</td>
						<td>Central Europe</td>
						<td>2 km, hourly</td>
						<td>20</td>
						<td>2 days</td>
						<td>Every 3 hours</td>
					</tr>
					<tr>
						<td>ICON-EU-EPS</td>
						<td>Europe</td>
						<td>13 km, hourly</td>
						<td>40</td>
						<td>5 days</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<td>ICON-EPS</td>
						<td>Global</td>
						<td>26 km, hourly</td>
						<td>40</td>
						<td>7.5 days</td>
						<td>Every 12 hours</td>
					</tr>
					<tr>
						<th scope="row" rowspan="2">NOAA</th>
						<td>GFS Ensemble 0.25°</td>
						<td>Global</td>
						<td>25 km, 3-hourly</td>
						<td>31</td>
						<td>10 days</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<td>GFS Ensemble 0.5°</td>
						<td>Global</td>
						<td>50 km, 3-hourly</td>
						<td>31</td>
						<td>35 days</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row" rowspan="2">ECMWF</th>
						<td>IFS 0.4°</td>
						<td>Global</td>
						<td>44 km, 3-hourly</td>
						<td>51</td>
						<td>15 days</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<td>IFS 0.25°</td>
						<td>Global</td>
						<td>25 km, 3-hourly</td>
						<td>51</td>
						<td>15 days</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row">Canadian Weather Service</th>
						<td>GEM</td>
						<td>Global</td>
						<td>25 km, 3-hourly</td>
						<td>21</td>
						<td>16 days (32 days every thursday)</td>
						<td>Every 12 hours</td>
					</tr>
					<tr>
						<th scope="row">Australian Bureau of Meteorology (BOM)</th>
						<td>ACCESS-GE</td>
						<td>Global</td>
						<td>40 km, 3-hourly</td>
						<td>18</td>
						<td>10 days</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row">UK Met Office</th>
						<td>MOGREPS-G</td>
						<td>Global</td>
						<td>20 km, 1-hourly</td>
						<td>18</td>
						<td>8 days</td>
						<td>Every 6 hours</td>
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
			The API endpoint <mark>/v1/ensemble</mark> accepts a geographical coordinate, a list of weather
			variables and responds with a JSON hourly weather forecast for 7 days for each ensemble member.
			Time always starts at 0:00 today. All URL parameters are listed below:
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1240px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
						<th scope="row">models</th>
						<td>String array</td>
						<td>Yes</td>
						<td></td>
						<td>Select one or more ensemble weather models as comma-separated list</td>
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
						<td>Integer</td>
						<td>No</td>
						<td><mark>0</mark></td>
						<td>If <mark>past_days</mark> is set, past weather data can be returned.</td>
					</tr>
					<tr>
						<th scope="row">forecast_days</th>
						<td>Integer (0-35)</td>
						<td>No</td>
						<td><mark>7</mark></td>
						<td>Per default, only 7 days are returned. Up to 35 days of forecast are possible.</td>
					</tr>
					<tr>
						<th scope="row"
							>forecast_hours<br />forecast_minutely_15<br />past_hours<br />past_minutely_15</th
						>
						<td>Integer (&gt;0)</td>
						<td>No</td>
						<td></td>
						<td
							>Similar to forecast_days, the number of timesteps of hourly and 15-minutely data can
							controlled. Instead of using the current day as a reference, the current hour or the
							current 15-minute time-step is used.
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
						<th scope="row">start_hour<br />end_hour<br />start_minutely_15<br />end_minutely_15</th
						>
						<td>String (yyyy-mm-ddThh:mm)</td>
						<td>No</td>
						<td></td>
						<td
							>The time interval to get weather data for hourly or 15 minutely data. Time must be
							specified as an ISO8601 date (e.g.
							<mark>2022-06-30T12:00</mark>).
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
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1240px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
						<th scope="row">cloud_cover</th>
						<td>Instant</td>
						<td>%</td>
						<td>Total cloud cover as an area fraction</td>
					</tr>
					<tr>
						<th scope="row"
							>wind_speed_10m<br />wind_speed_80m<br />wind_speed_100m<br /><br
							/>wind_speed_120m</th
						>
						<td>Instant</td>
						<td>km/h (mph, m/s, knots)</td>
						<td
							>Wind speed at 10, 80, 100 or 120 meters above ground. Wind speed on 10 meters is the
							standard level.</td
						>
					</tr>
					<tr>
						<th scope="row"
							>wind_direction_10m<br />wind_direction_80m<br />wind_direction_100m<br
							/>wind_direction_120m</th
						>
						<td>Instant</td>
						<td>°</td>
						<td>Wind direction at 10, 80, 100 or 120 meters above ground</td>
					</tr>
					<tr>
						<th scope="row">wind_gusts_10m</th>
						<td>Preceding hour max</td>
						<td>km/h (mph, m/s, knots)</td>
						<td>Gusts at 10 meters above ground as a maximum of the preceding hour</td>
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
							the normal plane (perpendicular to the sun). HRRR offers direct radiation directly. In
							GFS it is approximated based on <a
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
							>Diffuse solar radiation as average of the preceding hour. HRRR offers diffuse
							radiation directly. In GFS it is approximated based on <a
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
							calculation is assuming a fixed albedo of 20% and in isotropic sky. Please specify
							tilt and azimuth parameter. Tilt ranges from 0° to 90° and is typically around 45°.
							Azimuth should be close to 0° (0° south, -90° east, 90° west, ±180 north). If azimuth
							is set to "nan", the calculation assumes a horizontal tracker. If tilt is set to
							"nan", it is assumed that the panel has a vertical tracker. If both are set to "nan",
							a bi-axial tracker is assumed.</td
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
						<th scope="row">vapour_pressure_deficit</th>
						<td>Instant</td>
						<td>kPa</td>
						<td
							>Vapor Pressure Deificit (VPD) in kilopascal (kPa). For high VPD (&gt;1.6), water
							transpiration of plants increases. For low VPD (&lt;0.4), transpiration decreases</td
						>
					</tr>
					<tr>
						<th scope="row">evapotranspiration</th>
						<td>Preceding hour sum</td>
						<td>mm (inch)</td>
						<td
							>Evapotranspration from land surface and plants that weather models assumes for this
							location. Available soil water is considered. 1 mm evapotranspiration per hour equals
							1 liter of water per spare meter.</td
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
							> ET₀ is calculated from temperature, wind speed, humidity and solar radiation. Unlimited
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
							precipitation, snowfall, cape, lifted index and gusts.</td
						>
					</tr>
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
							millimeter, divide by 7. E.g. 7 cm snow = 10 mm precipitation water equivalent</td
						>
					</tr>
					<tr>
						<th scope="row">rain</th>
						<td>Preceding hour sum</td>
						<td>mm (inch)</td>
						<td>Liquid precipitation of the preceding hour in millimeter</td>
					</tr>
					<tr>
						<th scope="row">weather_code</th>
						<td>Instant</td>
						<td>WMO code</td>
						<td
							>Weather condition as a numeric code. Follow WMO weather interpretation codes. See
							table below for details.</td
						>
					</tr>
					<tr>
						<th scope="row">snow_depth</th>
						<td>Instant</td>
						<td>meters</td>
						<td>Snow depth on the ground</td>
					</tr>
					<tr>
						<th scope="row">freezing_level_height</th>
						<td>Instant</td>
						<td>meters</td>
						<td>Altitude above sea level of the 0°C level</td>
					</tr>
					<tr>
						<th scope="row">visibility</th>
						<td>Instant</td>
						<td>meters</td>
						<td>Viewing distance in meters. Influenced by low clouds, humidity and aerosols.</td>
					</tr>
					<tr>
						<th scope="row">cape</th>
						<td>Instant</td>
						<td>J/kg</td>
						<td
							>Convective available potential energy. See <a
								href="https://en.wikipedia.org/wiki/Convective_available_potential_energy"
								target="_blank">Wikipedia</a
							>.</td
						>
					</tr>
					<tr>
						<th scope="row"> surface_temperature </th>
						<td>Instant</td>
						<td>°C (°F)</td>
						<td>Temperature of the top soil level</td>
					</tr>
					<tr>
						<th scope="row">
							soil_temperature_0_to_10cm<br />soil_temperature_10_to_40cm<br
							/>soil_temperature_40_to_100cm<br />soil_temperature_100_to_200cm
						</th>
						<td>Instant</td>
						<td>°C (°F)</td>
						<td
							>Temperature in the soil as an average on 0-10, 10-40, 40-100 and 100-200 cm depths.</td
						>
					</tr>
					<tr>
						<th scope="row">
							soil_moisture_0_to_10cm<br />soil_moisture_10_to_40cm<br
							/>soil_moisture_40_to_100cm<br />soil_moisture_100_to_200cm
						</th>
						<td>Instant</td>
						<td>m³/m³</td>
						<td
							>Average soil water content as volumetric mixing ratio at 0-10, 10-40, 40-100 and
							100-200 cm depths.</td
						>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

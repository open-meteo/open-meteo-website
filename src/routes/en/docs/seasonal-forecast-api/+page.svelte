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
	import TimeSelector from '$lib/components/time/time-selector.svelte';
	import ResultPreview from '$lib/components/response/results-preview.svelte';
	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';

	import {
		daily,
		hourly,
		models,
		monthly,
		solarVariables,
		defaultParameters,
		forecastDaysOptions,
		temporalResolutionOptions
	} from './options';

	import { pastDaysOptions } from '../options';
	import { onMount } from 'svelte';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		daily: ['temperature_2m_max']
	});

	if ($params.forecast_days === '7') {
		$params.forecast_days = '183';
	}
	if ($params.temporal_resolution === 'hourly_1') {
		$params.temporal_resolution = 'hourly_6';
	}

	let forecastDays = $derived(
		forecastDaysOptions.find((fco) => fco.value == $params.forecast_days)
	);
	let pastDays = $derived(pastDaysOptions.find((pdo) => pdo.value == $params.past_days));

	let temporalResolution = $derived(
		temporalResolutionOptions.find((tro) => String(tro.value) == $params.temporal_resolution)
	);

	let accordionValues: string[] = $state([]);

	onMount(() => {
		if (
			$params.hourly && temporalResolution
				? temporalResolution.value !== 'hourly_6'
				: false && !accordionValues.includes('additional-variables')
		) {
			accordionValues.push('additional-variables');
		}

		if (
			$params.hourly &&
			(countVariables(solarVariables, $params.hourly).active ||
				($params.tilt ? Number($params.tilt) > 0 : false) ||
				($params.azimuth ? Number($params.azimuth) > 0 : false)) &&
			!accordionValues.includes('solar-variables')
		) {
			accordionValues.push('solar-variables');
		}

		if (
			$params.models &&
			countVariables(models, $params.models).active &&
			!accordionValues.includes('models')
		) {
			accordionValues.push('models');
		}
	});

	let beginDate = new Date('2022-06-08');

	let lastDate = new Date();
	lastDate.setDate(lastDate.getDate() + 274);

	let accordionValues: string[] = $state([]);
	onMount(() => {
		(($params.temporal_resolution = 'hourly_6'), ($params.forecast_days = '183'));
	});
</script>

<svelte:head>
	<title>Seasonal Weather Forecast API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/seasonal-forecast-api" />
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
	<Alert.Description
		><p>
			This API delivers ECMWF SEAS5 data at a 36 km resolution with 51 ensemble members. The data
			are not bias-corrected and may not accurately reflect local conditions. They should be
			interpreted as area forecasts, giving an indication of whether the coming months are likely to
			be warmer, colder, wetter, or drier than average.
		</p></Alert.Description
	>
</Alert.Root>

<form method="get" action="https://seasonal-api.open-meteo.com/v1/forecast">
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<TimeSelector
		bind:params={$params}
		{forecastDaysOptions}
		{pastDaysOptions}
		{beginDate}
		{lastDate}
	/>

	<!-- 6 HOURLY -->
	<div class="mt-6 md:mt-12">
		<a href="#6_hourly_weather_variables">
			<h2 id="6_hourly_weather_variables" class="text-2xl md:text-3xl">
				6-Hourly Weather Variables
			</h2>
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
								aria-labelledby="{value}_hourly_label"
								onCheckedChange={() => {
									if ($params.hourly?.includes(value)) {
										$params.hourly = $params.hourly.filter((item) => {
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
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
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
			<AccordionItem id="additional-variables" title="Additional Options">
				<div class="md:w-1/2">
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
												$params.hourly = $params.hourly.filter((item) => {
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
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>

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
			{'' +
				/*
			<AccordionItem id="models" title="Models" count={countVariables(models, $params.models)}>
				<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
												$params.models = $params.models.filter((item) => {
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
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
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
			*/ ''}
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
										$params.daily = $params.daily.filter((item) => {
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
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- Monthly -->
	<div class="mt-6 md:mt-12">
		<a href="#monthly_weather_variables"
			><h2 id="monthly_weather_variables" class="text-2xl md:text-3xl">
				Monthly Weather Variables
			</h2></a
		>
		<div
			class="mt-2 grid grid-flow-row gap-x-4 gap-y-4 md:gap-x-8 md:gap-y-8 lg:grid-cols-1 xl:grid-cols-2"
		>
			{#each monthly as group, i (i)}
				<div>
					{#each group as { value, label } (value)}
						{#if !value.includes('anomaly')}
							{@const valueAn = value.replace('_mean', '_anomaly')}
							{@const labelAn = label.replace('Mean', 'Anomaly')}
							{@const labelBoth = label.replace(' Mean', '')}
							<div class="flex gap-3">
								<div class="w-1/2">
									{labelBoth}
								</div>

								<div class="flex w-1/2 gap-2">
									<div class="group flex items-center" title={label}>
										<Checkbox
											id="{value}_monthly"
											class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
											{value}
											checked={$params.monthly?.includes(value)}
											aria-labelledby="{value}_monthly_label"
											onCheckedChange={() => {
												if ($params.monthly?.includes(value)) {
													$params.monthly = $params.monthly.filter((item) => {
														return item !== value;
													});
												} else if ($params.monthly) {
													$params.monthly.push(value);
													$params.monthly = $params.monthly;
												}
											}}
										/>
										<Label
											id="{value}_monthly_label"
											for="{value}_monthly"
											class="ml-[0.42rem]  cursor-pointer truncate py-[0.1rem]">Mean</Label
										>
									</div>
									<div class="group flex items-center" title={labelAn}>
										<Checkbox
											id="{valueAn}_monthly"
											class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
											value={valueAn}
											checked={$params.monthly?.includes(valueAn)}
											aria-labelledby="{valueAn}_monthly_label"
											onCheckedChange={() => {
												if ($params.monthly?.includes(valueAn)) {
													$params.monthly = $params.monthly.filter((item) => {
														return item !== valueAn;
													});
												} else if ($params.monthly) {
													$params.monthly.push(valueAn);
													$params.monthly = $params.monthly;
												}
											}}
										/>

										<Label
											id="{valueAn}_monthly_label"
											for="{valueAn}_monthly"
											class="ml-[0.42rem]  cursor-pointer truncate py-[0.1rem]">Anomaly</Label
										>
									</div>
								</div>
							</div>
						{/if}
					{/each}
					{#if i === 2}
						<div class="flex gap-3">
							<div class="w-1/2">Wind Gusts (10 m)</div>
							<div class="flex w-1/2 gap-2">
								<div class="group ml-[75px] flex items-center" title="Wind Gusts (10 m) Anomaly">
									<Checkbox
										id="wind_gusts_10m_anomaly_monthly"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										value="wind_gusts_10m_anomaly"
										checked={$params.monthly?.includes('wind_gusts_10m_anomaly')}
										aria-labelledby="wind_gusts_10m_anomaly_monthly_label"
										onCheckedChange={() => {
											if ($params.monthly?.includes('wind_gusts_10m_anomaly')) {
												$params.monthly = $params.monthly.filter((item) => {
													return item !== 'wind_gusts_10m_anomaly';
												});
											} else if ($params.monthly) {
												$params.monthly.push('wind_gusts_10m_anomaly');
												$params.monthly = $params.monthly;
											}
										}}
									/>

									<Label
										id="wind_gusts_10m_anomaly_monthly_label"
										for="wind_gusts_10m_anomaly_monthly"
										class="ml-[0.42rem]  cursor-pointer truncate py-[0.1rem]">Anomaly</Label
									>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6"><LicenceSelector /></div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultPreview
		{params}
		{defaultParameters}
		type="seasonal"
		action="seasonal"
		sdk_type="ensemble_api"
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<p>
			This API provides data from the ECMWF EC46 and SEAS5 seasonal weather forecast model. SEAS5 produces
			forecasts up to 7 months ahead and EC46 and is run as an ensemble system (51 members). Each member
			starts from slightly different initial conditions, which allows SEAS5 to estimate both the
			most likely future climate and the uncertainty around it. Updates are only published once per
			month on the 5th. EC46 runs daily and provides forecasts for up to 46 days.
		</p>
		<p>
			For short-term forecasting consider using the <a href="/en/docs/ecmwf-api"
				>15-days ECMWF forecast</a
			>
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 mt-2 w-full min-w-[1240px] caption-bottom text-left md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
								href="https://www.ecmwf.int/en/forecasts/about-our-forecasts/sub-seasonal-range-forecasts"
								target="_blank">EC46</a
							></th
						>
						<td>Global</td>
						<td>36 km (O320 grid)</td>
						<td>6-hourly</td>
						<td>46 days</td>
						<td>Daily at 22:00Z</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://confluence.ecmwf.int/display/FCST/Implementation+of+Seasonal+Forecast+SEAS5"
								target="_blank">SEAS5 Surface Level</a
							></th
						>
						<td>Global</td>
						<td>36 km (O320 grid)</td>
						<td>6-hourly</td>
						<td>7 months</td>
						<td>Every month on the 5th</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://confluence.ecmwf.int/display/FCST/Implementation+of+Seasonal+Forecast+SEAS5"
								target="_blank">SEAS5 Atmospheric Levels</a
							></th
						>
						<td>Global</td>
						<td>62 km (N160 grid)</td>
						<td>12-hourly</td>
						<td>7 months</td>
						<td>Every month on the 5th</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<a href="#api_documentation"
		><h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2></a
	>
</div>

<!-- API DOCS - ERRORS -->
<div class="mt-6 md:mt-12">
	<a href="#errors"><h3 id="errors" class="text-xl md:text-2xl">Errors</h3></a>
	<div class="mt-2 md:mt-4">
		<p>
			For a detailed list of all available weather variables please refer to the general <a
				href={'/en/docs'}>Weather Forecast API</a
			>. Only notable remarks are listed below
		</p>
		<ul class="ml-6 list-disc">
			<li>
				<strong>6-hourly resolution:</strong> Forecast data is provided at a native 6-hour interval.
				While it can be interpolated to 3-hourly or 1-hourly steps, this does not increase forecast accuracy.
				However, using 1-hourly resolution may be practical for applications such as solar PV modeling.
			</li>
			<li>
				<strong>Monthly anomalies</strong> are calculated by comparing forecast values against a
				long-term model climatology (a baseline of past simulations from the same forecasting
				system). ECMWF runs past forecasts (typically covering the last 20–30+ years) using the same
				SEAS5 model configuration. These hindcasts build a model-consistent climatology. For each
				forecast, the anomaly is obtained by subtracting the model climatology from the forecast
				value:
				<mark>Anomaly = Forecast - Model Climatology</mark>
			</li>
			<li>
				<strong>Solar Radiation:</strong> SEAS5 only contains global solar radiation data and does
				not offer direct or diffuse solar radiation. Open-Meteo applies the separation model from
				<a
					href="https://www.ise.fraunhofer.de/content/dam/ise/de/documents/publications/conference-paper/36-eupvsec-2019/Guzman_5CV31.pdf"
					>Razo, Müller Witwer</a
				> to calculate direct radiation from shortwave solar radiation.
			</li>
			<li>
				<strong>Bias correction:</strong> The dataset is currently provided without bias adjustment.
				Future versions of the API will include bias-corrected and downscaled outputs.
			</li>
		</ul>
	</div>
</div>

<div class="mt-6">
	<p>
		This service is based on data and products of the European Centre for Medium-Range Weather
		Forecasts (ECMWF). Source <a href="https://www.ecmwf.int">www.ecmwf.int</a>. ECMWF does not
		accept any liability whatsoever for any error or omission in the data, their availability, or
		for any loss or damage arising from their use.
	</p>
</div>

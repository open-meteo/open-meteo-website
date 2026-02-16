<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';

	import { resolve } from '$app/paths';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { countVariables } from '$lib/utils/meteo';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
	import TimeSelector from '$lib/components/time/time-selector.svelte';

	import { gridCellSelectionOptions, pastDaysOptions } from '../options';
	import {
		additionalMonthly,
		additionalWeekly,
		daily,
		defaultParameters,
		forecastDaysOptions,
		hourly,
		models,
		monthly,
		solarVariables,
		temporalResolutionOptions,
		weekly,
		weeklySpecial
	} from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		daily: ['temperature_2m_max']
	});

	if ($params.forecast_days === '7') {
		$params.forecast_days = '183';
	}

	let temporalResolution = $derived(
		temporalResolutionOptions.find((tro) => String(tro.value) == $params.temporal_resolution)
	);
	let cellSelection = $derived(
		gridCellSelectionOptions.find((gcso) => String(gcso.value) == $params.cell_selection)
	);

	onMount(() => {
		if (
			$params.hourly &&
			(temporalResolution ? temporalResolution.value !== 'hourly_6' : false) &&
			!accordionValues.includes('additional-variables')
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
	let lastDate = new SvelteDate();
	lastDate.setDate(lastDate.getDate() + 274);

	let accordionValues: string[] = $state([]);
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
			This API provides seasonal ECMWF SEAS5 and sub-seasonal ECMWF EC46 forecasts at a 36 km
			resolution with 51 ensemble members. The data are not bias-corrected and may not accurately
			reflect local conditions. They should be interpreted as area forecasts, giving an indication
			of whether the coming months are likely to be warmer, colder, wetter, or drier than average.
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
					{#each group as { value, label, EC46Only } (value)}
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
								class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]"
								>{label}{@html EC46Only ? '<sup class="ml-0.75">*</sup>' : ''}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
	<small class="text-muted-foreground"> * Only available for 46 days, based on ECMWF EC46. </small>

	<!-- ADDITIONAL VARIABLES -->
	<div class="mt-6">
		<Accordion.Root
			type="multiple"
			class="border-border rounded-lg border"
			bind:value={accordionValues}
		>
			<AccordionItem id="additional-variables" title="Additional Options">
				<div class=" mt-2 grid grid-cols-1 gap-3 md:mt-4 md:grid-cols-4 md:gap-6">
					<div class="relative">
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
					<div class="relative">
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
			<AccordionItem id="spread-variables" title="Ensemble Spread Variables">
				<div
					class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
				>
					{#each hourly as group, i (i)}
						<div>
							{#each group as { value, label, EC46Only } (value)}
								{@const valueSpread = `${value}_spread`}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{valueSpread}_hourly"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										value="valueSpread"
										checked={$params.hourly?.includes(valueSpread)}
										aria-labelledby="{valueSpread}_hourly_label"
										onCheckedChange={() => {
											if ($params.hourly?.includes(valueSpread)) {
												$params.hourly = $params.hourly.filter((item: string) => {
													return item !== valueSpread;
												});
											} else if ($params.hourly) {
												$params.hourly.push(valueSpread);
												$params.hourly = $params.hourly;
											}
										}}
									/>
									<Label
										id="{valueSpread}_hourly_label"
										for="{valueSpread}_hourly"
										class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]"
										>{label}{@html EC46Only ? '<sup class="ml-0.75">*</sup>' : ''}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>
				<p>
					<small class="text-muted-foreground"
						>Note: You need to select an <mark>Ensemble Mean</mark> in the model selection below to retrieve
						ensemble spread data. Selecting an Ensemble Mean model will also return the ensemble mean
						value for hourly data instead of values for each individual member.</small
					>
				</p>
			</AccordionItem>
			<AccordionItem id="models" title="Models" count={countVariables(models, $params.models)}>
				<div class="mt-2 grid sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2">
					{#each models as group, i (i)}
						<div>
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
					<small class="text-muted-foreground"
						>Note: The default <mark>ECMWF Seasonal Seamless</mark> uses all 51 members from EC46 for
						the first 46 days and switches to SEAS5 afterwards. Some weather variables may only be available
						for either weather model.</small
					>
				</p>
				<p>
					<small class="text-muted-foreground"
						>Note: If an <mark>Ensemble Mean</mark> model is selected, the API will return the mean value
						of all ensemble members instead of individual members. Ensemble mean values are stored for
						a longer period of time.
					</small>
				</p></AccordionItem
			>
		</Accordion.Root>
	</div>

	<!-- DAILY -->
	<div class="mt-6 md:mt-12">
		<a href="#daily_weather_variables"
			><h2 id="daily_weather_variables" class="text-2xl md:text-3xl">Daily Weather Variables</h2></a
		>
		<div
			class="mt-2 grid grid-flow-row gap-x-4 gap-y-4 md:gap-x-8 md:gap-y-8 lg:grid-cols-1 xl:grid-cols-2"
		>
			{#each daily as group, i (i)}
				<div>
					{#each group as { value, label, EC46Only, aggregations } (label)}
						<div class="flex w-full">
							<div class="highlight-row -mx-2 -mb-1 flex items-center gap-3 rounded px-2 py-0.5">
								<div class="highlight-row-label w-[46vw] md:w-[36vw] lg:w-[35vw] xl:w-[20vw]">
									{label}{@html EC46Only ? '<sup class="ml-0.75">*</sup>' : ''}
								</div>
								<div class="flex gap-2">
									{#each aggregations as { value: ag_value, label: ag_label } (ag_value)}
										<div class="group flex items-center" title="{label} {ag_label}">
											<Checkbox
												id="{value}{ag_value}_daily"
												class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
												value="{value}min"
												checked={$params.daily?.includes(`${value}${ag_value}`)}
												aria-labelledby="{value}{ag_value}daily_label"
												onCheckedChange={() => {
													if ($params.daily?.includes(`${value}${ag_value}`)) {
														$params.daily = $params.daily.filter((item: string) => {
															return item !== `${value}${ag_value}`;
														});
													} else if ($params.daily) {
														$params.daily.push(`${value}${ag_value}`);
														$params.daily = $params.daily;
													}
												}}
											/>
											<Label
												id="{value}{ag_value}_daily_label"
												for="{value}{ag_value}_daily"
												class="cursor-pointer  truncate py-[0.1rem] pl-[0.42rem]">{ag_label}</Label
											>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
	<small class="text-muted-foreground"> * Only available for 46 days, based on ECMWF EC46. </small>

	<!-- WEEKLY -->
	<div class="mt-6 md:mt-12">
		<a href="#weekly_weather_variables"
			><h2 id="weekly_weather_variables" class="text-2xl md:text-3xl">
				Weekly Weather Variables
			</h2></a
		>
		<div
			class="mt-2 grid grid-flow-row gap-x-4 gap-y-4 md:gap-x-8 md:gap-y-8 lg:grid-cols-1 xl:grid-cols-2"
		>
			{#each weekly as group, i (i)}
				<div>
					{#each group as { value, label } (value)}
						<div class="flex w-full">
							<div class="highlight-row -mx-2 -mb-1 flex items-center gap-3 rounded px-2 py-0.5">
								<div class="highlight-row-label w-[46vw] md:w-[36vw] lg:w-[35vw] xl:w-[20vw]">
									{label}
								</div>
								<div class="flex gap-2">
									<div class="group flex items-center" title="{label} Mean">
										<Checkbox
											id="{value}_mean_weekly"
											class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
											value="{value}_mean"
											checked={$params.weekly?.includes(`${value}_mean`)}
											aria-labelledby="{value}_mean_weekly_label"
											onCheckedChange={() => {
												if ($params.weekly?.includes(`${value}_mean`)) {
													$params.weekly = $params.weekly.filter((item: string) => {
														return item !== `${value}_mean`;
													});
												} else if ($params.weekly) {
													$params.weekly.push(`${value}_mean`);
													$params.weekly = $params.weekly;
												}
											}}
										/>
										<Label
											id="{value}_mean_weekly_label"
											for="{value}_mean_weekly"
											class="cursor-pointer  truncate py-[0.1rem] pl-[0.42rem]">Mean</Label
										>
									</div>
									<div class="group flex items-center" title="{label} Anomaly">
										<Checkbox
											id="{value}_anomaly_weekly"
											class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
											value="{value}_anomaly"
											checked={$params.weekly?.includes(`${value}_anomaly`)}
											aria-labelledby="{value}_anomaly_weekly_label"
											onCheckedChange={() => {
												if ($params.weekly?.includes(`${value}_anomaly`)) {
													$params.weekly = $params.weekly.filter((item: string) => {
														return item !== `${value}_anomaly`;
													});
												} else if ($params.weekly) {
													$params.weekly.push(`${value}_anomaly`);
													$params.weekly = $params.weekly;
												}
											}}
										/>

										<Label
											id="{value}_anomaly_weekly_label"
											for="{value}_anomaly_weekly"
											class="cursor-pointer  truncate py-[0.1rem] pl-[0.42rem]">Anomaly</Label
										>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- Additional Weekly -->
	<div class="mt-6">
		<Accordion.Root
			type="multiple"
			class="border-border rounded-lg border"
			bind:value={accordionValues}
		>
			<AccordionItem
				id="additionalWeekly-variables"
				title="Additional Weekly Variables"
				count={countVariables(additionalWeekly, $params.weekly)}
			>
				<div class="grid xl:grid-cols-2">
					{#each additionalWeekly as group, i (i)}
						<div>
							{#each group as { value, label } (value)}
								<div class="flex w-full">
									<div
										class="highlight-row -mx-2 -mb-1 flex items-center gap-3 rounded px-2 py-0.5"
									>
										<div class="highlight-row-label w-[46vw] md:w-[36vw] lg:w-[35vw] xl:w-[20vw]">
											{label}
										</div>
										<div class="flex gap-2">
											<div class="group flex items-center" title="{label} Mean">
												<Checkbox
													id="{value}_mean_weekly"
													class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
													value="{value}_mean"
													checked={$params.weekly?.includes(`${value}_mean`)}
													aria-labelledby="{value}_mean_weekly_label"
													onCheckedChange={() => {
														if ($params.weekly?.includes(`${value}_mean`)) {
															$params.weekly = $params.weekly.filter((item: string) => {
																return item !== `${value}_mean`;
															});
														} else if ($params.weekly) {
															$params.weekly.push(`${value}_mean`);
															$params.weekly = $params.weekly;
														}
													}}
												/>
												<Label
													id="{value}_mean_weekly_label"
													for="{value}_mean_weekly"
													class="cursor-pointer  truncate py-[0.1rem] pl-[0.42rem]">Mean</Label
												>
											</div>
											<div class="group flex items-center" title="{label} Anomaly">
												<Checkbox
													id="{value}_anomaly_weekly"
													class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
													value="{value}_anomaly"
													checked={$params.weekly?.includes(`${value}_anomaly`)}
													aria-labelledby="{value}_anomaly_weekly_label"
													onCheckedChange={() => {
														if ($params.weekly?.includes(`${value}_anomaly`)) {
															$params.weekly = $params.weekly.filter((item: string) => {
																return item !== `${value}_anomaly`;
															});
														} else if ($params.weekly) {
															$params.weekly.push(`${value}_anomaly`);
															$params.weekly = $params.weekly;
														}
													}}
												/>

												<Label
													id="{value}_anomaly_weekly_label"
													for="{value}_anomaly_weekly"
													class="cursor-pointer  truncate py-[0.1rem] pl-[0.42rem]">Anomaly</Label
												>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/each}
				</div></AccordionItem
			>

			<AccordionItem
				id="weeklySpecial-variables"
				title="Anomaly Probabilities, Extreme Forecast Index (EFI) & Shift of tails (SOT)"
				count={countVariables(weeklySpecial, $params.weekly)}
			>
				<div class="grid md:grid-cols-2">
					{#each weeklySpecial as group, i (i)}
						<div>
							{#each group as { value, label } (value)}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{value}_weekly"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										{value}
										checked={$params.weekly?.includes(value)}
										aria-labelledby="{value}_label"
										onCheckedChange={() => {
											console.log(value);
											if (value && $params.weekly?.includes(value)) {
												$params.weekly = $params.weekly.filter((item: string) => {
													return item !== value;
												});
											} else if (value && $params.weekly) {
												$params.weekly.push(value);
												$params.weekly = $params.weekly;
											}
										}}
									/>
									<Label
										id="{value}_label"
										for="{value}_weekly"
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

	<!-- MONTHLY -->
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
						<div class="flex w-full">
							<div class="highlight-row -mx-2 -mb-1 flex items-center gap-3 rounded px-2 py-0.5">
								<div class="highlight-row-label w-[46vw] md:w-[36vw] lg:w-[35vw] xl:w-[20vw]">
									{label}
								</div>
								<div class="flex gap-2">
									{#if value != 'wind_gusts_10m'}
										<div class="group flex items-center" title="{label} Mean">
											<Checkbox
												id="{value}_mean_monthly"
												class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
												value="{value}_mean"
												checked={$params.monthly?.includes(`${value}_mean`)}
												aria-labelledby="{value}_mean_monthly_label"
												onCheckedChange={() => {
													if ($params.monthly?.includes(`${value}_mean`)) {
														$params.monthly = $params.monthly.filter((item: string) => {
															return item !== `${value}_mean`;
														});
													} else if ($params.monthly) {
														$params.monthly.push(`${value}_mean`);
														$params.monthly = $params.monthly;
													}
												}}
											/>
											<Label
												id="{value}_mean_monthly_label"
												for="{value}_mean_monthly"
												class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">Mean</Label
											>
										</div>
										<div class="group flex items-center" title="{label} Anomaly">
											<Checkbox
												id="{value}_anomaly_monthly"
												class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
												value="{value}_anomaly"
												checked={$params.monthly?.includes(`${value}_anomaly`)}
												aria-labelledby="{value}_anomaly_monthly_label"
												onCheckedChange={() => {
													if ($params.monthly?.includes(`${value}_anomaly`)) {
														$params.monthly = $params.monthly.filter((item: string) => {
															return item !== `${value}_anomaly`;
														});
													} else if ($params.monthly) {
														$params.monthly.push(`${value}_anomaly`);
														$params.monthly = $params.monthly;
													}
												}}
											/>

											<Label
												id="{value}_anomaly_monthly_label"
												for="{value}_anomaly_monthly"
												class="cursor-pointer  truncate py-[0.1rem] pl-[0.42rem]">Anomaly</Label
											>
										</div>
									{:else}
										<div class="flex w-1/2 gap-2">
											<div
												class="group ml-[75px] flex items-center"
												title="Wind Gusts (10 m) Anomaly"
											>
												<Checkbox
													id="wind_gusts_10m_anomaly_monthly"
													class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
													value="wind_gusts_10m_anomaly"
													checked={$params.monthly?.includes('wind_gusts_10m_anomaly')}
													aria-labelledby="wind_gusts_10m_anomaly_monthly_label"
													onCheckedChange={() => {
														if ($params.monthly?.includes('wind_gusts_10m_anomaly')) {
															$params.monthly = $params.monthly.filter((item: string) => {
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
													class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">Anomaly</Label
												>
											</div>
										</div>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- Additional Monthly -->
	<div class="mt-6">
		<Accordion.Root
			type="multiple"
			class="border-border rounded-lg border"
			bind:value={accordionValues}
		>
			<AccordionItem
				id="additionalMonthly-variables"
				title="Additional Monthly Variables"
				count={countVariables(additionalMonthly, $params.weekly)}
			>
				<div class="grid md:grid-cols-2">
					{#each additionalMonthly as group, i (i)}
						<div>
							{#each group as { value, label } (value)}
								<div class="flex gap-3">
									<div class="w-1/2">
										{label}
									</div>
									<div class="flex w-1/2 gap-2">
										<div class="group flex items-center" title="{label} Mean">
											<Checkbox
												id="{value}_mean_monthly"
												class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
												value="{value}_mean"
												checked={$params.monthly?.includes(`${value}_mean`)}
												aria-labelledby="{value}_mean_monthly_label"
												onCheckedChange={() => {
													if ($params.monthly?.includes(`${value}_mean`)) {
														$params.monthly = $params.monthly.filter((item: string) => {
															return item !== `${value}_mean`;
														});
													} else if ($params.monthly) {
														$params.monthly.push(`${value}_mean`);
														$params.monthly = $params.monthly;
													}
												}}
											/>
											<Label
												id="{value}_mean_monthly_label"
												for="{value}_mean_monthly"
												class="cursor-pointer  truncate py-[0.1rem] pl-[0.42rem]">Mean</Label
											>
										</div>
										<div class="group flex items-center" title="{label} Anomaly">
											<Checkbox
												id="{value}_anomaly_monthly"
												class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
												value="{value}_anomaly"
												checked={$params.monthly?.includes(`${value}_anomaly`)}
												aria-labelledby="{value}_anomaly_monthly_label"
												onCheckedChange={() => {
													if ($params.monthly?.includes(`${value}_anomaly`)) {
														$params.monthly = $params.monthly.filter((item: string) => {
															return item !== `${value}_anomaly`;
														});
													} else if ($params.monthly) {
														$params.monthly.push(`${value}_anomaly`);
														$params.monthly = $params.monthly;
													}
												}}
											/>

											<Label
												id="{value}_anomaly_monthly_label"
												for="{value}_anomaly_monthly"
												class="cursor-pointer  truncate py-[0.1rem] pl-[0.42rem]">Anomaly</Label
											>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/each}
				</div></AccordionItem
			>
		</Accordion.Root>
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6"><LicenceSelector requires_professional_plan={true} /></div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultsPreview
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
			This API provides data from the ECMWF EC46 and SEAS5 seasonal forecast models. SEAS5 generates
			forecasts up to 7 months in advance, EC46 provides forecasts for up to 46 days ahead. Both
			models are ensemble forecast systems with 51 members, each initialized with slightly different
			starting conditions. This approach allows the models to estimate not only the most likely
			future weather but also the range of possible outcomes and their associated uncertainties.
		</p>
		<p>
			In addition to the 51 individual member forecasts, Open-Meteo also provides ensemble mean and
			spread values. If an <mark>Ensemble Mean model</mark> is selected in the model selection above,
			the API returns the ensemble mean instead of individual member forecasts. Ensemble mean and spread
			values are stored for a longer period of time and can be used for bias correction later on. Forecasts
			for all 51 individual members are only kept for one month.
		</p>
		<p>
			Forecasts from EC46 for the next 46 days are updated every day at around 20:30 GMT+0. Seasonal
			SEAS5 forecast update every month on the 5th.
		</p>
		<p>
			For short-term forecasting consider using the <a href={resolve('/en/docs/ecmwf-api', {})}
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
						<td>Daily at 20:30Z</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://confluence.ecmwf.int/display/FCST/Implementation+of+Seasonal+Forecast+SEAS5"
								target="_blank">SEAS5</a
							></th
						>
						<td>Global</td>
						<td>36 km (O320 grid)</td>
						<td>6-hourly</td>
						<td>7 months</td>
						<td>Every month on the 5th</td>
					</tr>
					<!-- <tr>
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
					</tr> -->
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
	<div class="mt-2 md:mt-4">
		<p>
			For a detailed list of all available weather variables please refer to the general <a
				href={resolve('/en/docs', {})}>Weather Forecast API</a
			>. Only notable remarks are listed below
		</p>
		<ul class="ml-6 list-disc">
			<li>
				<strong>6-hourly resolution:</strong> Forecast data is provided at a native 6-hour interval. While
				it can be interpolated to 3-hourly or 1-hourly steps, this does not increase forecast accuracy.
				However, using 1-hourly resolution may be practical for applications such as solar PV modeling.
			</li>
			<li>
				Data is available for <strong>51 ensemble member</strong>s, which can be useful for
				applications such as running pest or energy production models using each member individually
				and averaging the results. Although EC46 generates 100 ensemble members, providing 51 offers
				a good balance between data volume and accuracy and is sufficient for most use cases.
			</li>
			<li>
				<strong>Solar Radiation:</strong> SEAS5 only contains global solar radiation data and does
				not offer direct or diffuse solar radiation. Open-Meteo applies the separation model from
				<a
					class="text-link underline"
					href="https://www.ise.fraunhofer.de/content/dam/ise/de/documents/publications/conference-paper/36-eupvsec-2019/Guzman_5CV31.pdf"
					>Razo, Müller Witwer</a
				> to calculate direct radiation from shortwave solar radiation. EC46 used for the first 46 days
				directly models direct and diffuse solar radiation.
			</li>
			<li>
				<strong>Weekly and monthly data</strong> are computed directly by the ECMWF SEAS5 and EC46 models.
				Monthly data is available from SEAS5 for up to 7 months ahead, based on 51 ensemble members, while
				weekly data is available from EC46 for up to 6 weeks ahead, using 100 ensemble members.
			</li>
			<li>
				<strong>Anomalies</strong> are calculated by comparing forecast values against a long-term
				model climatology (a baseline of past simulations from the same forecasting system). ECMWF
				runs past forecasts (typically covering the last 20–30+ years) using the same model
				configuration. These hindcasts build a model-consistent climatology. For each forecast, the
				anomaly is obtained by subtracting the model climatology from the forecast value:
				<mark>Anomaly = Forecast - Model Climatology</mark>
			</li>
			<li>
				<strong>The Extreme Forecast Index (EFI)</strong> highlights potential extreme events in
				temperature or precipitation relative to the expected climate. Rather than showing absolute
				values, the EFI expresses how unusual a forecast is compared to the model climate. For
				temperature, EFI values near +1 indicate a high likelihood of much warmer-than-normal
				conditions, while values near –1 suggest much colder-than-normal conditions. For
				precipitation, EFI values close to +1 point to much wetter-than-normal conditions, and those
				near –1 indicate much drier-than-normal conditions.
				<a
					class="text-link underline"
					href="https://confluence.ecmwf.int/display/FUG/Section+8.1.9.2+Extreme+Forecast+Index+-+EFI"
					title="Extreme Forecast Index - EFI">More information in the ECMWF documentation</a
				>.
			</li>
			<li>
				The <strong>Shift of Tails (SOT)</strong> is a complementary metric to the Extreme Forecast
				Index (EFI) that indicates how extreme an event could potentially become. While the EFI is
				limited by the historical extremes of the model climate, the SOT examines the outer tails of
				the forecast distribution — capturing rare, exceptional events that may exceed anything
				previously simulated by the model. The SOT is computed for the 10th and 90th percentiles
				across all 100 EC46 ensemble members.
				<a
					class="text-link underline"
					href="https://confluence.ecmwf.int/display/FUG/Section+8.1.9.3+Calculating+the+Shift+of+Tails+-+SOT"
					title="Calculating the Shift of Tails - SOT"
					>More information in the ECMWF documentation</a
				>.
			</li>
			<li>
				<strong>Bias correction:</strong> The dataset is currently provided without bias adjustment. Future
				versions of the API may include bias-corrected and downscaled outputs for improved local accuracy.
				Parameters such as anomalies, EFI, and SOT are expressed relative to the model climate, which
				inherently reduces some systematic biases.
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

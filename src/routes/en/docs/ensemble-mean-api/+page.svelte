<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { fade, slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { sliceIntoChunks } from '$lib/utils';
	import {
		altitudeAboveSeaLevelMeters,
		countPressureVariables,
		countVariables
	} from '$lib/utils/meteo';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
	import TimeSelector from '$lib/components/time/time-selector.svelte';

	import {
		forecastHoursOptions,
		gridCellSelectionOptions,
		pastHoursOptions,
		temporalResolutionOptions
	} from '../options';
	import {
		additionalVariables,
		availableVariables,
		daily,
		defaultParameters,
		forecastDaysOptions,
		hourly,
		levels,
		models,
		noSpreadVariables,
		pastDaysOptions,
		pressureVariables,
		solarVariables
	} from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['temperature_2m', 'temperature_2m_spread'],
		models: ['dwd_icon_eps_ensemble_mean_seamless']
	});

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
	let pressureVariablesTab = $state('temperature');
	onMount(() => {
		if (
			(countVariables(additionalVariables, $params.hourly).active ||
				forecastHours?.value ||
				pastHours?.value ||
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
			$params.hourly &&
			countPressureVariables(pressureVariables, levels, $params.hourly).active &&
			!accordionValues.includes('pressure-variables')
		) {
			accordionValues.push('pressure-variables');
		}
	});

	const availableVariablesMap = availableVariables as Record<string, string[]>;

	function isAvailable(variable: string, models: string[] | undefined): boolean {
		// no model selected
		if (!models || models.length == 0) {
			return true;
		}
		for (const model of models) {
			if (!availableVariablesMap[model]) {
				continue;
			}
			if (availableVariablesMap[model].includes(variable)) {
				return true;
			}
		}
		return false;
	}

	function isDailyAvailable(variable: string, models: string[] | undefined): boolean {
		// remove last '_part' of variable, that they can be checked with the hourly variables
		let variableSplit = variable.split('_');
		if (
			['max', 'mean', 'min', 'sum', 'hours', 'dominant'].includes(
				variableSplit[variableSplit.length - 1]
			)
		) {
			variableSplit.pop();
		}
		let variableBase = variableSplit.join('_');

		// no model selected
		if (!models || models.length == 0) {
			return true;
		}
		for (const model of models) {
			if (!availableVariablesMap[model]) {
				continue;
			}
			if (availableVariablesMap[model].includes(variableBase)) {
				return true;
			}
		}
		return false;
	}

	let beginDate = new Date('2023-04-01');

	let lastDate = new SvelteDate();
	lastDate.setDate(lastDate.getDate() + 35);

	let timezoneInvalid = $derived(
		$params.timezone == 'UTC' && ($params.daily ? $params.daily.length > 0 : false)
	);
</script>

<svelte:head>
	<title>Ensemble Mean API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/ensemble-mean-api" />
</svelte:head>

<form method="get" action="https://ensemble-api.open-meteo.com/v1/ensemble">
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

	<!-- ENSEMBLE -->
	<div class="mt-6 md:mt-12">
		<a href="#ensemble_models">
			<h2 id="ensemble_models" class="text-2xl md:text-3xl">Ensemble Models</h2>
		</a>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each models as group, i (i)}
				<div>
					{#each group as { value, label } (value)}
						<div class="group flex items-center" title={label}>
							<Checkbox
								id="{value}_models"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								{value}
								checked={$params.models?.includes(value)}
								aria-labelledby="{value}_model_label"
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
								for="{value}_models"
								class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
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
			class="mt-2 grid grid-flow-row gap-x-4 gap-y-4 md:gap-x-8 md:gap-y-8 lg:grid-cols-1 xl:grid-cols-2"
		>
			{#each hourly as group, i (i)}
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
											id="{value}_hourly"
											class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
											{value}
											disabled={!isAvailable(value, $params.models)}
											checked={$params.hourly?.includes(value)}
											aria-labelledby="{value}_hourly_mean_label"
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
											id="{value}_hourly_mean_label"
											for="{value}_hourly"
											class="cursor-pointer  truncate py-[0.1rem] pl-[0.42rem]">Mean</Label
										>
									</div>
									{#if !noSpreadVariables.includes(value)}
										<div class="group flex items-center" title="{label} Spread">
											<Checkbox
												id="{value}_hourly_spread"
												class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
												value={value + '_spread'}
												disabled={!isAvailable(value, $params.models)}
												checked={$params.hourly?.includes(value + '_spread')}
												aria-labelledby="{value}_hourly_spread_label"
												onCheckedChange={() => {
													if ($params.hourly?.includes(value + '_spread')) {
														$params.hourly = $params.hourly.filter((item: string) => {
															return item !== value + '_spread';
														});
													} else if ($params.hourly) {
														$params.hourly.push(value + '_spread');
														$params.hourly = $params.hourly;
													}
												}}
											/>

											<Label
												id="{value}_hourly_spread_label"
												for="{value}_hourly_spread"
												class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">Spread</Label
											>
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
													id="{value}_hourly"
													class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
													{value}
													disabled={!isAvailable(value, $params.models)}
													checked={$params.hourly?.includes(value)}
													aria-labelledby="{value}_hourly_mean_label"
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
													id="{value}_hourly_mean_label"
													for="{value}_hourly"
													class="cursor-pointer  truncate py-[0.1rem] pl-[0.42rem]">Mean</Label
												>
											</div>
											{#if !noSpreadVariables.includes(value)}
												<div class="group flex items-center" title="{label} Spread">
													<Checkbox
														id="{value}_hourly_spread"
														class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
														value={value + '_spread'}
														disabled={!isAvailable(value, $params.models)}
														checked={$params.hourly?.includes(value + '_spread')}
														aria-labelledby="{value}_hourly_spread_label"
														onCheckedChange={() => {
															if ($params.hourly?.includes(value + '_spread')) {
																$params.hourly = $params.hourly.filter((item: string) => {
																	return item !== value + '_spread';
																});
															} else if ($params.hourly) {
																$params.hourly.push(value + '_spread');
																$params.hourly = $params.hourly;
															}
														}}
													/>

													<Label
														id="{value}_hourly_spread_label"
														for="{value}_hourly_spread"
														class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">Spread</Label
													>
												</div>
											{/if}
										</div>
									</div>
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
				id="solar-variables"
				title="Solar Radiation Variables"
				count={countVariables(solarVariables, $params.hourly)}
			>
				<div class="grid md:grid-cols-2">
					{#each solarVariables as group, i (i)}
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
													id="{value}_hourly"
													class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
													{value}
													disabled={!isAvailable('shortwave_radiation', $params.models)}
													checked={$params.hourly?.includes(value)}
													aria-labelledby="{value}_hourly_mean_label"
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
													id="{value}_hourly_mean_label"
													for="{value}_hourly"
													class="cursor-pointer  truncate py-[0.1rem] pl-[0.42rem]">Mean</Label
												>
											</div>
											{#if !noSpreadVariables.includes(value)}
												<div class="group flex items-center" title="{label} Spread">
													<Checkbox
														id="{value}_hourly_spread"
														class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
														value={value + '_spread'}
														disabled={!isAvailable('shortwave_radiation', $params.models)}
														checked={$params.hourly?.includes(value + '_spread')}
														aria-labelledby="{value}_hourly_spread_label"
														onCheckedChange={() => {
															if ($params.hourly?.includes(value + '_spread')) {
																$params.hourly = $params.hourly.filter((item: string) => {
																	return item !== value + '_spread';
																});
															} else if ($params.hourly) {
																$params.hourly.push(value + '_spread');
																$params.hourly = $params.hourly;
															}
														}}
													/>

													<Label
														id="{value}_hourly_spread_label"
														for="{value}_hourly_spread"
														class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">Spread</Label
													>
												</div>
											{/if}
										</div>
									</div>
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
				id="pressure-levels"
				title="Pressure Level Variables"
				count={countPressureVariables(pressureVariables, levels, $params.hourly)}
			>
				<div class="flex flex-col gap-3 md:flex-row md:gap-6">
					<div class="w-full md:w-[227px]">
						<ToggleGroup.Root type="single" bind:value={pressureVariablesTab}>
							<div class="border-border flex flex-col rounded-lg border">
								{#each pressureVariables as variable, i (i)}
									<ToggleGroup.Item
										value={variable.value}
										class="min-h-12 w-[225px] cursor-pointer rounded-none py-1.5 !opacity-100 lg:min-h-[unset] {i ===
										0
											? 'rounded-t-md !rounded-b-none'
											: ''} {i === pressureVariables.length - 1
											? '!rounded-t-none rounded-b-md'
											: ''}"
										disabled={pressureVariablesTab === variable.value}
										onclick={() => (pressureVariablesTab = variable.value)}
										><div class="flex w-full items-center justify-between gap-2 text-left">
											{variable.label}
											<span class="text-xs">
												{levels.filter((level) =>
													$params.hourly?.includes(`${variable.value}_${level}hPa`)
												).length
													? '(' +
														levels.filter((level) =>
															$params.hourly?.includes(`${variable.value}_${level}hPa`)
														).length +
														'/' +
														levels.length +
														')'
													: ''}
											</span>
										</div>
									</ToggleGroup.Item>
								{/each}
							</div>
						</ToggleGroup.Root>
					</div>
					<div class="w-full">
						{#each pressureVariables as variable, i (i)}
							{#if pressureVariablesTab === variable.value}
								<div class="mb-3">{variable.label}</div>
								<div>
									<div class="grid grid-cols-1">
										{#each sliceIntoChunks(levels, levels.length / 3 + 1) as chunk, j (j)}
											<div>
												{#each chunk as level, k (k)}
													<div class="flex w-full">
														<div
															class="highlight-row -mx-2 -mb-1 flex items-center gap-3 rounded px-2 py-0.5"
														>
															<div
																class="highlight-row-label w-[46vw] md:w-[36vw] lg:w-[35vw] xl:w-[20vw]"
															>
																{level} hPa ({altitudeAboveSeaLevelMeters(level)})
															</div>
															<div class="flex gap-2">
																<div
																	class="group flex items-center"
																	title="{level} hPa {altitudeAboveSeaLevelMeters(level)} Mean"
																>
																	<Checkbox
																		id="{variable.value}_{level}hPa_mean"
																		class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
																		value={variable.value + '_' + level + 'hPa'}
																		disabled={!isAvailable(
																			`${variable.value}_${level}hPa`,
																			$params.models
																		)}
																		checked={$params.hourly?.includes(
																			`${variable.value}_${level}hPa`
																		)}
																		aria-labelledby="{variable.value}_{level}hPa_mean_label"
																		onCheckedChange={() => {
																			if (
																				$params.hourly?.includes(`${variable.value}_${level}hPa`)
																			) {
																				$params.hourly = $params.hourly.filter((item: string) => {
																					return item !== `${variable.value}_${level}hPa`;
																				});
																			} else if ($params.hourly) {
																				$params.hourly.push(`${variable.value}_${level}hPa`);
																				$params.hourly = $params.hourly;
																			}
																		}}
																	/>
																	<Label
																		id="{variable.value}_{level}hPa_mean_label"
																		for="{variable.value}_{level}hPa_mean"
																		class="cursor-pointer  truncate py-[0.1rem] pl-[0.42rem]"
																		>Mean</Label
																	>
																</div>
																{#if !noSpreadVariables.includes(`${variable.value}_${level}hPa`)}
																	<div
																		class="group flex items-center"
																		title="{level} hPa {altitudeAboveSeaLevelMeters(level)} Spread"
																	>
																		<Checkbox
																			id="{variable.value}_{level}hPa_spread"
																			class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
																			value={variable.value + '_' + level + 'hPa_spread'}
																			disabled={!isAvailable(
																				`${variable.value}_${level}hPa`,
																				$params.models
																			)}
																			checked={$params.hourly?.includes(
																				`${variable.value}_${level}hPa_spread`
																			)}
																			aria-labelledby="{variable.value}_{level}hPa_spread_label"
																			onCheckedChange={() => {
																				if (
																					$params.hourly?.includes(
																						`${variable.value}_${level}hPa_spread`
																					)
																				) {
																					$params.hourly = $params.hourly.filter((item: string) => {
																						return item !== `${variable.value}_${level}hPa_spread`;
																					});
																				} else if ($params.hourly) {
																					$params.hourly.push(
																						`${variable.value}_${level}hPa_spread`
																					);
																					$params.hourly = $params.hourly;
																				}
																			}}
																		/>

																		<Label
																			id="{variable.value}_{level}hPa_spread_label"
																			for="{variable.value}_{level}hPa_spread"
																			class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]"
																			>Spread</Label
																		>
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
							{/if}
						{/each}
					</div>
				</div>
				<div class="mt-3 lg:ml-[249px]">
					<small class="text-muted-foreground"
						>Note: Altitudes are approximate and in meters <strong> above sea level</strong>
						(not above ground). Use <mark>geopotential_height</mark> to get precise altitudes above sea
						level.</small
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
			class="mt-2 grid grid-flow-row gap-x-4 gap-y-4 md:gap-x-8 md:gap-y-8 lg:grid-cols-1 xl:grid-cols-2"
		>
			{#each daily as group, i (i)}
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
											id="{value}_daily_mean"
											class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
											{value}
											disabled={!isDailyAvailable(value, $params.models)}
											checked={$params.daily?.includes(value)}
											aria-labelledby="{value}_daily_mean_label"
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
											id="{value}_daily_mean_label"
											for="{value}_daily_mean"
											class="cursor-pointer  truncate py-[0.1rem] pl-[0.42rem]">Mean</Label
										>
									</div>
									<!-- PZ Disabled daily spread variables for now, because not yet implemented in the API -->
									<!-- {#if !noSpreadVariables.includes(value)}
										<div class="group flex items-center" title="{label} Spread">
											<Checkbox
												id="{value}_daily_spread"
												class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
												value={value + '_spread'}
												disabled={!isDailyAvailable(value, $params.models)}
												checked={$params.daily?.includes(value + '_spread')}
												aria-labelledby="{value}_daily_spread_label"
												onCheckedChange={() => {
													if ($params.daily?.includes(value + '_spread')) {
														$params.daily = $params.daily.filter((item: string) => {
															return item !== value + '_spread';
														});
													} else if ($params.daily) {
														$params.daily.push(value + '_spread');
														$params.daily = $params.daily;
													}
												}}
											/>

											<Label
												id="{value}_daily_spread_label"
												for="{value}_daily_spread"
												class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">Spread</Label
											>
										</div>
									{/if} -->
								</div>
							</div>
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
		type="ensemble"
		action="ensemble"
		sdk_type="ensemble_api"
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Documentation</h2></a>
	<div class="mt-2 md:mt-4">
		<p>
			The Ensemble Mean API offers access to mean and spread (standard deviation) directly
			calculated from ensemble models using individual members. These ensemble means are stored for
			an extended period, with most available since March 2026. Individual ensemble members,
			however, are only stored for up to three days.
		</p>
		<p>
			The Ensemble Mean API uses the same data sources as the regular Ensemble API. Please refer to
			the <a href="/en/docs/ensemble-api" title="Ensemble API" class="text-link underline"
				>Ensemble API</a
			> for a detailed list of ensemble models.
		</p>
	</div>
</div>

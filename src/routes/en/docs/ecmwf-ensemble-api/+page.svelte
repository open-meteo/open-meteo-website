<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { sliceIntoChunks } from '$lib/utils';
	import { countPressureVariables, countVariables } from '$lib/utils/meteo';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
	import TimeSelector from '$lib/components/time/time-selector.svelte';
	import VariableCheckboxGroups from '$lib/components/variables/variable-checkbox-groups.svelte';

	import {
		forecastHoursOptions,
		gridCellSelectionOptions,
		pastDaysOptions,
		pastHoursOptions,
		temporalResolutionOptions
	} from '../options';
	import {
		additionalVariables,
		daily,
		defaultParameters,
		ensembleSpreadVariables,
		forecastDaysOptions,
		hourly,
		levels,
		models,
		pressureVariables
	} from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['temperature_2m']
	});

	let timezoneInvalid = $derived(
		$params.timezone == 'UTC' && ($params.daily ? $params.daily.length > 0 : false)
	);

	let spreadWithoutMeanModel = $derived(
		($params.hourly?.some((v: string) => v.endsWith('_spread')) ?? false) &&
			!$params.models?.some((m: string) => m.endsWith('_ensemble_mean'))
	);

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
				(pastHours ? pastHours.value : false) ||
				(cellSelection ? cellSelection.value : false) ||
				(forecastHours ? forecastHours.value : false) ||
				(temporalResolution ? temporalResolution.value : false)) &&
			!accordionValues.includes('additional-variables')
		) {
			accordionValues.push('additional-variables');
		}

		if (
			$params.hourly &&
			countPressureVariables(pressureVariables, levels, $params.hourly).active &&
			!accordionValues.includes('pressure-levels')
		) {
			accordionValues.push('pressure-levels');
		}

		if (
			countVariables(ensembleSpreadVariables, $params.hourly).active &&
			!accordionValues.includes('ensemble-spread-variables')
		) {
			accordionValues.push('ensemble-spread-variables');
		}

		if (countVariables(models, $params.models).active > 1 && !accordionValues.includes('models')) {
			accordionValues.push('models');
		}
	});

	let beginDate = new SvelteDate();
	beginDate.setMonth(beginDate.getMonth() - 3);

	let lastDate = new SvelteDate();
	lastDate.setDate(lastDate.getDate() + 15);
</script>

<svelte:head>
	<title>ECMWF Ensemble API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/ecmwf-ensemble-api" />
	<meta
		name="description"
		content="ECMWF IFS and AIFS ensemble forecasts with 51 members each, pressure-level data and ensemble spread through the Open-Meteo API."
	/>
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
	<!-- HOURLY -->
	<div class="mt-6 md:mt-12">
		<a href="#hourly_weather_variables"
			><h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">
				Hourly Weather Variables
			</h2></a
		>
		<VariableCheckboxGroups
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
			groups={hourly}
			bind:values={$params.hourly}
			idSuffix="hourly"
		/>
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
				<VariableCheckboxGroups
					class="grid md:grid-cols-2"
					groups={additionalVariables}
					bind:values={$params.hourly}
					idSuffix="hourly"
				/>

				<small class="text-muted-foreground mt-1">
					Note: You can further adjust the forecast time range for hourly weather variables using <mark
						>&forecast_hours=</mark
					>
					and <mark>&past_hours=</mark> as shown below.
				</small>
				<div class=" mt-2 grid grid-cols-1 gap-3 md:mt-4 md:grid-cols-4 md:gap-6">
					<div class="relative">
						<Select.Root name="forecast_hours" type="single" bind:value={$params.forecast_hours}>
							<Select.Trigger class="data-placeholder:text-foreground h-12 cursor-pointer pt-6"
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
							<Select.Trigger class="data-placeholder:text-foreground h-12 cursor-pointer pt-6"
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
							<Select.Trigger class="data-placeholder:text-foreground h-12 cursor-pointer pt-6"
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
							<Select.Trigger class="data-placeholder:text-foreground h-12 cursor-pointer pt-6"
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
				id="pressure-levels"
				title="Pressure Level Variables"
				count={countPressureVariables(pressureVariables, levels, $params.hourly)}
			>
				<div class="flex flex-col gap-3 md:flex-row md:gap-6">
					<div class="w-full md:w-56.75">
						<ToggleGroup.Root type="single" bind:value={pressureVariablesTab}>
							<div class="border-border flex flex-col rounded-lg border">
								{#each pressureVariables as variable, i (i)}
									<ToggleGroup.Item
										value={variable.value}
										class="min-h-12 w-56.25 cursor-pointer rounded-none py-1.5 opacity-100! lg:min-h-[unset] {i ===
										0
											? 'rounded-t-md rounded-b-none!'
											: ''} {i === pressureVariables.length - 1
											? 'rounded-t-none! rounded-b-md'
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
										</div></ToggleGroup.Item
									>
								{/each}
							</div>
						</ToggleGroup.Root>
					</div>
					<div class="w-full">
						{#each pressureVariables as variable, i (i)}
							{#if pressureVariablesTab === variable.value}
								<div class="mb-3">{variable.label}</div>
								<div class="grid grid-cols-1 lg:grid-cols-3">
									{#each sliceIntoChunks(levels, levels.length / 3 + 1) as chunk, j (j)}
										<div>
											{#each chunk as level, k (k)}
												<div class="group flex items-center">
													<Checkbox
														id="{variable.value}_{level}hPa"
														class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-current"
														value="{variable.value}_{level}hPa"
														checked={$params.hourly?.includes(`${variable.value}_${level}hPa`)}
														aria-labelledby="{variable.value}_{level}hPa_label"
														onCheckedChange={() => {
															const value = `${variable.value}_${level}hPa`;
															if ($params.hourly?.includes(value)) {
																$params.hourly = $params.hourly.filter(
																	(item: string) => item !== value
																);
															} else if ($params.hourly) {
																$params.hourly.push(value);
																$params.hourly = $params.hourly;
															}
														}}
													/>
													<Label
														id="{variable.value}_{level}hPa_label"
														for="{variable.value}_{level}hPa"
														class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]"
														>{level} hPa</Label
													>
												</div>
											{/each}
										</div>
									{/each}
								</div>
							{/if}
						{/each}
					</div>
				</div>
			</AccordionItem>
			<AccordionItem
				id="ensemble-spread-variables"
				title="Ensemble Spread Variables"
				count={countVariables(ensembleSpreadVariables, $params.hourly)}
			>
				<VariableCheckboxGroups
					class="mt-2 grid sm:grid-cols-2"
					groups={ensembleSpreadVariables}
					bind:values={$params.hourly}
					idSuffix="hourly"
				/>
				{#if spreadWithoutMeanModel}
					<div transition:slide>
						<Alert.Root variant="warning" class="mt-2 md:mt-4 mb-2">
							<Alert.Description>
								Ensemble spread variables are only available from the "ECMWF IFS Ensemble Mean" and
								"ECMWF AIFS Ensemble Mean" models. Please also select one of them in the weather
								models section below.
							</Alert.Description>
						</Alert.Root>
					</div>
				{/if}
				<div>
					<small class="text-muted-foreground"
						>Note: Ensemble spread variables are calculated by Open-Meteo.
					</small>
				</div>
			</AccordionItem>
			<AccordionItem
				id="models"
				title="Weather models"
				count={countVariables(models, $params.models)}
			>
				<VariableCheckboxGroups
					class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
					groupClass="mb-3"
					groups={models}
					bind:values={$params.models}
					idSuffix="model"
				/>
				<div>
					<small class="text-muted-foreground"
						>Note: Mean values are calculated by Open-Meteo.
					</small>
				</div>
			</AccordionItem>
		</Accordion.Root>
	</div>

	<!-- DAILY -->
	<div class="mt-6 md:mt-12">
		<a href="#daily_weather_variables"
			><h2 id="daily_weather_variables" class="text-2xl md:text-3xl">Daily Weather Variables</h2></a
		>
		<VariableCheckboxGroups
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
			groups={daily}
			bind:values={$params.daily}
			idSuffix="daily"
		/>
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
		model_default="ecmwf_ifs025_ensemble"
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<p>
			ECMWF produces two global ensemble forecasts that are distributed as
			<a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" target="_blank"
				>ECMWF open data</a
			>
			on a regular 0.25° latitude-longitude grid. Each ensemble consists of 51 members, one control run
			and 50 perturbed runs, describing a range of possible weather developments that can be used to estimate
			forecast uncertainty and the risk of less likely events.
		</p>
		<ul class="mt-2 ml-6 list-disc">
			<li>
				The IFS ensemble (ENS) is the physics-based ensemble of the Integrated Forecasting System.
				The model runs at a native resolution of 9 km; the open data distribution is regridded to
				0.25°. Forecast steps are 3-hourly up to 144 hours and 6-hourly afterwards. The 00 and 12
				UTC runs extend to 15 days, the 06 and 18 UTC runs to 6 days.
			</li>
			<li>
				The AIFS ensemble (AIFS ENS) is the ensemble of ECMWF's artificial intelligence weather
				model. All runs provide 6-hourly forecast steps up to 15 days. More details about AIFS can
				be found on the
				<a href="https://www.ecmwf.int/en/about/media-centre/aifs-blog" target="_blank">AIFS blog</a
				>.
			</li>
		</ul>
		<p class="mt-2">
			Both ensembles are initialized every 6 hours at 00, 06, 12 and 18 UTC and Open-Meteo processes
			all four runs. ECMWF publishes the data with a delay of roughly 7 to 8 hours after
			initialization. Open-Meteo additionally calculates ensemble mean and spread models from all 51
			members while downloading. Regional cutouts for Europe preserve the native model resolution: a
			9 km IFS ensemble on the O1280 grid and a 31 km AIFS ensemble on the N320 grid. The Europe
			models provide a reduced set of surface variables and no pressure-level data.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<caption>
					You can find Open-Meteo's current update timings in the <a
						class="text-link underline"
						href="/en/docs/model-updates">model updates documentation</a
					>.
				</caption>
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
						<th scope="row">ECMWF IFS 0.25° Ensemble</th>
						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[26px] shrink-0 items-center gap-2">
									<div class="flex h-[26px] w-[26px] items-center justify-center text-[23px]">
										🌍
									</div>
								</div>
								Global
							</div>
						</td>
						<td>0.25° (~25 km)</td>
						<td>3-hourly, <small class="text-muted-foreground">6-hourly after 144 hours</small></td>
						<td
							>15 days <small class="text-muted-foreground">(6 days for 06 and 18 UTC runs)</small
							></td
						>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row">ECMWF AIFS 0.25° Ensemble</th>
						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[26px] shrink-0 items-center gap-2">
									<div class="flex h-[26px] w-[26px] items-center justify-center text-[23px]">
										🌍
									</div>
								</div>
								Global
							</div>
						</td>
						<td>0.25° (~28 km)</td>
						<td>6-hourly</td>
						<td>15 days</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row">ECMWF IFS 9 km (O1280) Europe Ensemble</th>
						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[26px] shrink-0 items-center gap-2">
									<img
										height="26"
										width="26"
										src="/images/country-flags/european_union.svg"
										alt="European Union"
										title="European Union"
									/>
								</div>
								Europe
							</div>
						</td>
						<td>9 km (native O1280)</td>
						<td
							>1-hourly, <small class="text-muted-foreground"
								>3-hourly after 90 hours, 6-hourly after 144 hours</small
							></td
						>
						<td>15 days <small class="text-muted-foreground">(6 days for the 06 UTC run)</small></td
						>
						<td>Only 00 and 06 UTC runs</td>
					</tr>
					<tr>
						<th scope="row">ECMWF AIFS 31 km (N320) Europe Ensemble</th>
						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[26px] shrink-0 items-center gap-2">
									<img
										height="26"
										width="26"
										src="/images/country-flags/european_union.svg"
										alt="European Union"
										title="European Union"
									/>
								</div>
								Europe
							</div>
						</td>
						<td>31 km (native N320)</td>
						<td>6-hourly</td>
						<td>15 days</td>
						<td>Every 6 hours</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- NATIVE VARIABLES -->
<div class="mt-6 md:mt-12">
	<a href="#native_model_variables"
		><h2 id="native_model_variables" class="text-2xl md:text-3xl">Native Model Variables</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			IFS ENS and AIFS ENS directly predict the fields listed below for every ensemble member.
			Open-Meteo retains these fields or uses them to calculate more convenient API variables. In
			particular, ECMWF provides 2 m dew point rather than relative humidity, and wind as U and V
			components. The IFS ensemble offers additional surface fields that are not part of the AIFS
			ensemble.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<thead>
					<tr>
						<th scope="col">Native ECMWF field</th>
						<th scope="col">Level</th>
						<th scope="col">Models</th>
						<th scope="col">Use in the Open-Meteo API</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">2 m temperature</th>
						<td>2 m above ground</td>
						<td>IFS &amp; AIFS</td>
						<td><mark>temperature_2m</mark></td>
					</tr>
					<tr>
						<th scope="row">2 m dew point</th>
						<td>2 m above ground</td>
						<td>IFS &amp; AIFS</td>
						<td>Relative humidity and dew point at 2 m</td>
					</tr>
					<tr>
						<th scope="row">Mean sea-level pressure</th>
						<td>Mean sea level</td>
						<td>IFS &amp; AIFS</td>
						<td><mark>pressure_msl</mark> and derived surface pressure</td>
					</tr>
					<tr>
						<th scope="row">Total precipitation and snowfall water equivalent</th>
						<td>Surface</td>
						<td>IFS &amp; AIFS</td>
						<td><mark>precipitation</mark>, <mark>rain</mark> and snowfall</td>
					</tr>
					<tr>
						<th scope="row">U and V wind components</th>
						<td>10 m and 100 m above ground</td>
						<td>IFS &amp; AIFS</td>
						<td>Wind speed and direction at 10 and 100 m height above ground</td>
					</tr>
					<tr>
						<th scope="row">Total cloud cover</th>
						<td>Surface</td>
						<td>IFS &amp; AIFS</td>
						<td
							><mark>cloud_cover</mark>. AIFS additionally provides native low, mid and high cloud
							layers; for IFS the layers are derived from relative humidity.</td
						>
					</tr>
					<tr>
						<th scope="row">Global solar radiation</th>
						<td>Surface</td>
						<td>IFS &amp; AIFS</td>
						<td><mark>shortwave_radiation</mark> and derived sunshine duration</td>
					</tr>
					<tr>
						<th scope="row">Skin temperature, soil temperature and moisture</th>
						<td>Surface, soil layers</td>
						<td>IFS &amp; AIFS</td>
						<td
							>Surface temperature and upper soil layers. IFS provides four soil layers, AIFS only
							the upper layers.</td
						>
					</tr>
					<tr>
						<th scope="row"
							>CAPE, wind gusts, min/max temperature, precipitation type, snow depth, runoff and
							total column water vapour</th
						>
						<td>Surface</td>
						<td>IFS only</td>
						<td
							>Additional surface variables. These return null values when the AIFS ensemble is
							selected.</td
						>
					</tr>
					<tr>
						<th scope="row">Temperature</th>
						<td>13 pressure levels</td>
						<td>IFS &amp; AIFS</td>
						<td>Pressure-level temperature and humidity-related variables</td>
					</tr>
					<tr>
						<th scope="row">Relative humidity (IFS), specific humidity (AIFS)</th>
						<td>13 pressure levels</td>
						<td>IFS &amp; AIFS</td>
						<td>Pressure-level relative humidity, dew point and estimated cloud cover</td>
					</tr>
					<tr>
						<th scope="row">Geopotential</th>
						<td>13 pressure levels</td>
						<td>IFS &amp; AIFS</td>
						<td>Geopotential height</td>
					</tr>
					<tr>
						<th scope="row">U and V wind components</th>
						<td>13 pressure levels</td>
						<td>IFS &amp; AIFS</td>
						<td>Pressure-level wind speed and direction</td>
					</tr>
					<tr>
						<th scope="row">Vertical velocity (omega)</th>
						<td>13 pressure levels</td>
						<td>IFS &amp; AIFS</td>
						<td>Geometric vertical velocity</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="mt-2">
			The pressure levels are 1000, 925, 850, 700, 600, 500, 400, 300, 250, 200, 150, 100 and 50
			hPa. See the
			<a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" target="_blank"
				>ECMWF open data documentation</a
			>
			for the original dataset layout.
		</p>
	</div>
</div>

<!-- DERIVED VARIABLES -->
<div class="mt-6 md:mt-12">
	<a href="#derived_variables"
		><h2 id="derived_variables" class="text-2xl md:text-3xl">Derived Variables</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			Several convenient API variables are not direct model output. Open-Meteo derives them from the
			native fields for every ensemble member and forecast step.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<thead>
					<tr>
						<th scope="col">Derived Variable</th>
						<th scope="col">How it is derived?</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">Relative humidity and dew point</th>
						<td>
							ECMWF publishes 2 m dew point rather than relative humidity. Relative humidity at 2 m
							is calculated from temperature and dew point. On AIFS pressure levels, relative
							humidity is derived from native specific humidity, temperature and pressure; IFS
							provides it natively. Pressure-level dew point is calculated from temperature and
							relative humidity.
						</td>
					</tr>
					<tr>
						<th scope="row">Low, mid and high cloud cover (IFS only)</th>
						<td>
							The IFS ensemble open data does not include cloud layers. Low cloud cover is derived
							from relative humidity at 1000, 925 and 850 hPa, mid from 700, 600, 500 and 400 hPa
							and high from 300 to 50 hPa. AIFS provides these layers natively. Total cloud cover is
							native model output for both models.
						</td>
					</tr>
					<tr>
						<th scope="row">Pressure-level cloud cover</th>
						<td>
							Estimated from pressure-level relative humidity following Sundqvist et al. (1989).
						</td>
					</tr>
					<tr>
						<th scope="row">Wind speed and direction</th>
						<td>
							Calculated from the native U and V wind components at 10 m, 100 m and on all pressure
							levels.
						</td>
					</tr>
					<tr>
						<th scope="row">Snowfall and rain</th>
						<td>
							Snowfall converts the native snowfall water equivalent with 0.7 cm per mm. Rain is
							total precipitation minus snowfall water equivalent.
						</td>
					</tr>
					<tr>
						<th scope="row">Snow depth (IFS only)</th>
						<td>Calculated from native snow depth water equivalent and snow density.</td>
					</tr>
					<tr>
						<th scope="row">Vertical velocity</th>
						<td>
							ECMWF publishes vertical velocity as omega in Pa/s. It is converted to geometric
							velocity in m/s using the temperature at each pressure level.
						</td>
					</tr>
					<tr>
						<th scope="row">Weather code</th>
						<td>
							Computed from cloud cover, precipitation, snowfall and CAPE. CAPE is only available
							for the IFS ensemble.
						</td>
					</tr>
					<tr>
						<th scope="row">Surface pressure</th>
						<td>Calculated from mean sea-level pressure, 2 m temperature and terrain elevation.</td>
					</tr>
					<tr>
						<th scope="row">Ensemble mean and spread</th>
						<td>
							The "Ensemble Mean" models are calculated by Open-Meteo as the average of all 51
							members while downloading. The corresponding <mark>_spread</mark> variables contain the
							standard deviation across all members.
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="text-muted-foreground mt-2">
			For the IFS ensemble, low, mid and high cloud cover are estimates based on the vertical
			humidity profile rather than native cloud fraction forecasts.
		</p>
	</div>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<a href="#api_documentation"
		><h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			Use the endpoint <mark>/v1/ensemble</mark> with
			<mark>models=ecmwf_ifs025_ensemble</mark> or <mark>models=ecmwf_aifs025_ensemble</mark>. The
			high-resolution Europe cutouts are available as <mark>ecmwf_ifs_europe_ensemble</mark> and
			<mark>ecmwf_aifs_europe_ensemble</mark>. Every model has an ensemble mean counterpart with the
			suffix <mark>_mean</mark>, for example <mark>ecmwf_ifs025_ensemble_mean</mark>. The tables
			below describe the variables specific to these models. Refer to the general
			<a href="/en/docs/ensemble-api">Ensemble API documentation</a>
			for URL parameters, response formats and the naming of individual ensemble members.
		</p>

		<a href="#hourly_parameter_definition"
			><h3 id="hourly_parameter_definition" class="mt-6 text-xl md:text-2xl">
				Hourly Parameter Definition
			</h3></a
		>
		<p class="mt-2">
			The API uses the common <mark>&hourly=</mark> parameter name. The table describes the default
			hourly output. The IFS ensemble provides native values every 3 hours (6 hours after day 6),
			the AIFS ensemble every 6 hours. The API interpolates all data to hourly time steps. Set
			<mark>temporal_resolution=native</mark> to return only the original model intervals. At native resolution,
			precipitation is the accumulated sum of the preceding 3 or 6 hours; for hourly output, this total
			is distributed over the corresponding hourly intervals while preserving the sum.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
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
						<th scope="row">temperature_2m<br />relative_humidity_2m<br />dew_point_2m</th>
						<td>Indicated hour</td>
						<td>°C (°F) / %</td>
						<td
							>Air temperature, relative humidity and dew point 2 m above ground, interpolated from
							the native model values.</td
						>
					</tr>
					<tr>
						<th scope="row">pressure_msl<br />surface_pressure</th>
						<td>Indicated hour</td>
						<td>hPa</td>
						<td
							>Pressure at mean sea level and estimated pressure at the selected surface elevation,
							based on interpolated model values.</td
						>
					</tr>
					<tr>
						<th scope="row">precipitation</th>
						<td>Preceding hour sum</td>
						<td>mm (inch)</td>
						<td
							>Total liquid and frozen precipitation. Each native 3- or 6-hour accumulation is
							distributed over the corresponding hourly intervals.</td
						>
					</tr>
					<tr>
						<th scope="row">rain<br />snowfall<br />snowfall_water_equivalent</th>
						<td>Preceding hour sum</td>
						<td>mm or cm (inch)</td>
						<td
							>Rain and snowfall components. Snowfall water equivalent is native model output; rain
							is total precipitation minus snowfall water equivalent.</td
						>
					</tr>
					<tr>
						<th scope="row"
							>cloud_cover<br />cloud_cover_low<br />cloud_cover_mid<br />cloud_cover_high</th
						>
						<td>Indicated hour</td>
						<td>%</td>
						<td
							>Total cloud cover is native model output. For IFS, the low, mid and high layers are
							derived from relative humidity; AIFS provides them natively.</td
						>
					</tr>
					<tr>
						<th scope="row">wind_speed_10m<br />wind_speed_100m</th>
						<td>Indicated hour</td>
						<td>km/h (m/s, mph, knots)</td>
						<td>Wind speed derived after interpolating the native U and V components.</td>
					</tr>
					<tr>
						<th scope="row">wind_direction_10m<br />wind_direction_100m</th>
						<td>Indicated hour</td>
						<td>°</td>
						<td>Wind direction derived after interpolating the native U and V components.</td>
					</tr>
					<tr>
						<th scope="row">cape<br />wind_gusts_10m</th>
						<td>Indicated hour / preceding hour maximum</td>
						<td>J/kg / km/h (m/s, mph, knots)</td>
						<td
							>Convective available potential energy and wind gusts at 10 m. Only available for the
							IFS ensemble.</td
						>
					</tr>
					<tr>
						<th scope="row">weather_code<br />is_day</th>
						<td>Indicated hour</td>
						<td>WMO code / boolean</td>
						<td
							>Weather code is derived from the hourly weather fields. Day-or-night status is
							calculated directly for every requested timestamp.</td
						>
					</tr>
				</tbody>
			</table>
		</div>

		<a href="#pressure_level_parameter_definition"
			><h3 id="pressure_level_parameter_definition" class="mt-6 text-xl md:text-2xl">
				Pressure-Level Parameter Definition
			</h3></a
		>
		<p class="mt-2">
			Append a supported pressure level to the variable name, for example
			<mark>temperature_500hPa</mark> or <mark>relative_humidity_850hPa</mark>. Native
			pressure-level fields are available at 3-hour (IFS) or 6-hour (AIFS) intervals and are
			interpolated for the default hourly output.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<thead>
					<tr>
						<th scope="col">Variable pattern</th>
						<th scope="col">Unit</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">temperature_*hPa</th>
						<td>°C (°F)</td>
						<td>Air temperature interpolated from the native pressure-level values.</td>
					</tr>
					<tr>
						<th scope="row">relative_humidity_*hPa<br />dew_point_*hPa</th>
						<td>% / °C (°F)</td>
						<td
							>Relative humidity is native model output for IFS and derived from specific humidity
							for AIFS. Dew point is calculated from hourly temperature and relative humidity.</td
						>
					</tr>
					<tr>
						<th scope="row">cloud_cover_*hPa</th>
						<td>%</td>
						<td>Estimated for each hour from the interpolated relative humidity.</td>
					</tr>
					<tr>
						<th scope="row">wind_speed_*hPa<br />wind_direction_*hPa</th>
						<td>km/h (m/s, mph, knots) / °</td>
						<td>Wind speed and direction derived after interpolating native U and V components.</td>
					</tr>
					<tr>
						<th scope="row">vertical_velocity_*hPa</th>
						<td>km/h (m/s, mph, knots)</td>
						<td
							>Geometric vertical velocity, converted from the native omega values using
							temperature.</td
						>
					</tr>
					<tr>
						<th scope="row">geopotential_height_*hPa</th>
						<td>m</td>
						<td>
							Height of the selected pressure surface above mean sea level, interpolated from the
							native values.</td
						>
					</tr>
				</tbody>
			</table>
		</div>

		<a href="#daily_parameter_definition"
			><h3 id="daily_parameter_definition" class="mt-6 text-xl md:text-2xl">
				Daily Parameter Definition
			</h3></a
		>
		<p class="mt-2">
			Daily values are calculated from the hourly forecast steps within the selected timezone. The
			available parameters include mean, minimum and maximum 2 m temperature; precipitation, rain
			and snowfall sums; precipitation hours; mean, minimum and maximum wind speed at 10 m and 100
			m; dominant wind direction; mean, minimum and maximum cloud cover; and mean, minimum and
			maximum mean-sea-level and surface pressure. Select a timezone when requesting daily data so
			that the aggregation matches the intended local calendar day.
		</p>
	</div>
</div>

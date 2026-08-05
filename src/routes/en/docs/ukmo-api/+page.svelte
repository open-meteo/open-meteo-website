<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';

	import InfoIcon from '@lucide/svelte/icons/info';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { sliceIntoChunks } from '$lib/utils';
	import { countHeightVariables, countPressureVariables, countVariables } from '$lib/utils/meteo';
	import { slide } from '$lib/utils/transitions';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import ApiModeDescription from '$lib/components/api-mode/api-mode-description.svelte';
	import ApiModeSelector from '$lib/components/api-mode/api-mode-selector.svelte';
	import ApiModeTimeSelector from '$lib/components/api-mode/api-mode-time-selector.svelte';
	import { apiModeFormAction } from '$lib/components/api-mode/utils';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import ZoomableImage from '$lib/components/media/zoomable-image.svelte';
	import PressureVariablesSelector from '$lib/components/pressure/pressure-variables-selector.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import AdditionalOptionsSelects from '$lib/components/select/additional-options-selects.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
	import TiltAzimuthInputs from '$lib/components/variables/tilt-azimuth-inputs.svelte';
	import VariableCheckboxGroups from '$lib/components/variables/variable-checkbox-groups.svelte';

	import {
		current,
		forecastHoursOptions,
		gridCellSelectionOptions,
		pastDaysOptions,
		pastHoursOptions,
		solarVariables,
		temporalResolutionOptions
	} from '../options';
	import {
		additionalVariables,
		daily,
		defaultParameters,
		forecastDaysOptions,
		heightVariables,
		heights,
		hourly,
		levels,
		models,
		pressureVariables
	} from './options';

	const params = urlHashStore({
		latitude: [51.5085],
		longitude: [-0.1257],
		...defaultParameters,
		api_mode: 'forecast',
		run: '',
		hourly: ['temperature_2m']
	});

	let timezoneInvalid = $derived(
		$params.timezone == 'UTC' && ($params.daily ? $params.daily.length > 0 : false)
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
	let heightVariablesTab = $state('temperature');

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

		if (
			(countVariables(solarVariables, $params.hourly).active ||
				($params.tilt ? Number($params.tilt) > 0 : false) ||
				($params.azimuth ? Number($params.azimuth) > 0 : false)) &&
			!accordionValues.includes('solar-variables')
		) {
			accordionValues.push('solar-variables');
		}

		if (
			countPressureVariables(heightVariables, heights, $params.hourly).active &&
			!accordionValues.includes('height-variables')
		) {
			accordionValues.push('height-variables');
		}

		if (
			countPressureVariables(pressureVariables, levels, $params.hourly).active &&
			!accordionValues.includes('pressure-variables')
		) {
			accordionValues.push('pressure-variables');
		}

		if (countVariables(models, $params.models).active && !accordionValues.includes('models')) {
			accordionValues.push('models');
		}
	});

	let beginDate = new SvelteDate();
	beginDate.setMonth(beginDate.getMonth() - 3);

	let lastDate = new SvelteDate();
	lastDate.setDate(lastDate.getDate() + 14);
</script>

<svelte:head>
	<title>UK Met Office API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/ukmo-api" />
	<meta
		name="description"
		content="UK Met Office UKV 2 km and global 10 km weather forecasts for the United Kingdom and worldwide. Free weather API for non-commercial use, no key required."
	/>
</svelte:head>

<Alert.Root variant="info" class="mb-4"
	><InfoIcon />
	<Alert.Description>
		UK Met Office data is provided under the <a
			class="text-link underline"
			href="https://creativecommons.org/licences/by-sa/4.0/deed.en">CC BY-SA 4.0</a
		>
		licence. Therefore, any derived products from this data should also be redistributed under the same
		or a compatible licence. Typically, Open-Meteo provides data under
		<a class="text-link underline" href="https://creativecommons.org/licences/by/4.0/deed.en"
			>CC BY 4.0</a
		>.
	</Alert.Description>
</Alert.Root>

<form
	method="get"
	action={apiModeFormAction($params.api_mode, 'https://api.open-meteo.com/v1/forecast')}
>
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- API MODE & TIME -->
	<div class="mt-6 grid items-start gap-x-6 gap-y-4 lg:grid-cols-2">
		<div>
			<ApiModeSelector bind:params={$params} />
			<ApiModeTimeSelector
				bind:params={$params}
				{beginDate}
				{lastDate}
				{pastDaysOptions}
				{forecastDaysOptions}
			/>
		</div>
		<ApiModeDescription bind:params={$params} {forecastDaysOptions} />
	</div>

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
				<AdditionalOptionsSelects
					bind:params={$params}
					{forecastHoursOptions}
					{pastHoursOptions}
					{temporalResolutionOptions}
					{gridCellSelectionOptions}
				/>
			</AccordionItem>
			<AccordionItem
				id="solar-variables"
				title="Solar Radiation Variables"
				count={countVariables(solarVariables, $params.hourly)}
			>
				<VariableCheckboxGroups
					class="grid md:grid-cols-2"
					groups={solarVariables}
					bind:values={$params.hourly}
					idSuffix="hourly"
				/>

				<small class="text-muted-foreground mt-1">
					Note: Solar radiation is averaged over the past hour. Use
					<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI please
					specify Tilt and Azimuth below.
				</small>

				<TiltAzimuthInputs bind:params={$params} />
			</AccordionItem>
			<AccordionItem
				id="height-levels"
				title="Height Level Variables"
				count={countHeightVariables(heightVariables, heights, $params.hourly)}
			>
				<div class="flex gap-3 md:gap-6">
					<div class="md:min-w-37.5">
						<ToggleGroup.Root
							type="single"
							bind:value={heightVariablesTab}
							class="justify-start gap-0"
						>
							<div class="border-border flex flex-col rounded-lg border">
								{#each heightVariables as variable, i (i)}
									<ToggleGroup.Item
										value={variable.value}
										class="min-h-12 w-56.25 cursor-pointer rounded-none opacity-100! lg:min-h-[unset] {i ===
										0
											? 'rounded-t-md'
											: ''} {i === heightVariables.length - 1 ? 'rounded-b-md' : ''}"
										disabled={heightVariablesTab === variable.value}
										onclick={() => (heightVariablesTab = variable.value)}
										><div class="flex w-full items-center justify-between gap-2 text-left">
											{variable.label}
											<span class="text-xs">
												{heights.filter((height) =>
													$params.hourly?.includes(`${variable.value}_${height}m`)
												).length
													? '(' +
														heights.filter((height) =>
															$params.hourly?.includes(`${variable.value}_${height}m`)
														).length +
														'/' +
														heights.length +
														')'
													: ''}
											</span>
										</div>
									</ToggleGroup.Item>
								{/each}
							</div>
						</ToggleGroup.Root>
					</div>
					<div>
						{#each heightVariables as variable (variable.value)}
							{#if heightVariablesTab === variable.value}
								<div class="mb-3">{variable.label}</div>
								<div>
									<div class="grid grid-cols-1 lg:grid-cols-3">
										{#each sliceIntoChunks(heights, heights.length / 3 + 1) as chunk, ci (ci)}
											<div>
												{#each chunk as level, k (k)}
													<div class="group flex items-center" title={String(level)}>
														<Checkbox
															id="{variable.value}_{level}m"
															class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-current"
															value="{variable.value}_{level}m"
															checked={$params.hourly?.includes(`${variable.value}_${level}m`)}
															aria-labelledby="{variable.value}_{level}m"
															onCheckedChange={() => {
																if ($params.hourly?.includes(`${variable.value}_${level}m`)) {
																	$params.hourly = $params.hourly.filter((item: string) => {
																		return item !== `${variable.value}_${level}m`;
																	});
																} else {
																	$params.hourly?.push(`${variable.value}_${level}m`);
																	$params.hourly = $params.hourly;
																}
															}}
														/>
														<Label
															for="{variable.value}_{level}m"
															class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]"
															>{level} m
														</Label>
													</div>
												{/each}
											</div>
										{/each}
									</div>
								</div>
							{/if}
						{/each}
						<div class="mt-3">
							<small class="text-muted-foreground"
								>Note: Altitudes are approximate and in meters <strong> above sea level</strong>
								(not above ground). Use <mark>geopotential_height</mark> to get precise altitudes above
								sea level.</small
							>
						</div>
					</div>
				</div>
			</AccordionItem>
			<AccordionItem
				id="pressure-levels"
				title="Pressure Level Variables"
				count={countPressureVariables(pressureVariables, levels, $params.hourly)}
			>
				<PressureVariablesSelector {pressureVariables} {levels} bind:values={$params.hourly} />
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

	<!-- CURRENT -->
	<div class="mt-6 md:mt-12">
		<a href="#current_weather"
			><h2 id="current_weather" class="text-2xl md:text-3xl">Current Weather</h2></a
		>
		<VariableCheckboxGroups
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
			groups={current}
			bind:values={$params.current}
			idSuffix="current"
		/>
		<div class="text-muted-foreground mt-1">
			Note: Current conditions are based on 15-minutely weather model data. Every weather variable
			available in hourly data, is available as current condition as well.
		</div>
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6">
		<LicenceSelector requires_professional_plan={$params.api_mode !== 'forecast'} />
	</div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<ResultsPreview
		{params}
		{defaultParameters}
		model_default="ukmo_seamless"
		defaultTimeParameters={false}
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<p>
			This API uses global UKMO Global 10 km weather forecasts and combines them with
			high-resolution UKV 2 km model for the United Kingdom and Ireland. Information about UKMO
			weather models is available <a
				href="https://www.metoffice.gov.uk/services/data/external-data-channels"
				target="_blank">here</a
			>. For UKMO Global, values are interpolated from 3-hourly to 1-hourly after 54 hours and from
			6-hourly data after 144 hours.
		</p>
		<p>
			Note: UKMO open-data has an additional delay of 4 hours. The forecast is therefore not as
			accurate as it could be.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-250">
				<caption
					>You can find the update timings in the <a
						class="text-link undeline"
						href="/en/docs/model-updates">model updates documentation</a
					>.</caption
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
						<th scope="row">UKMO Global</th>
						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[60px] shrink-0 items-center gap-2">
									<div class="flex h-[26px] w-[26px] items-center justify-center text-[23px]">
										🌍
									</div>
								</div>
								Global
							</div>
						</td>
						<td>0.09° (~10 km)</td>
						<td
							>Hourly<small class="text-muted-foreground"
								>, 3-hourly after 54 hours, 6-hourly after 144 hours</small
							></td
						>
						<td>7 days</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row">UKMO UKV</th>
						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[60px] shrink-0 items-center gap-2">
									<img
										height="26"
										width="26"
										src="/images/country-flags/gb.svg"
										alt="United Kingdom"
										title="United Kingdom"
									/>
									<img
										height="26"
										width="26"
										src="/images/country-flags/ie.svg"
										alt="Ireland"
										title="Ireland"
									/>
								</div>
								UK and Ireland
							</div>
						</td>
						<td>2 km</td>
						<td>Hourly</td>
						<td>2 days</td>
						<td>Every hour</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<ZoomableImage
		figureClass="mt-6"
		src="/images/models/ukmo_uk_deterministic_2km.webp"
		alt="UKMO UKV 2km model area covering UK and Ireland"
	>
		{#snippet caption()}
			UKMO UKV 2km model covering UK and Ireland. Source: UK Met Office.
		{/snippet}
	</ZoomableImage>
</div>

<!-- NATIVE VARIABLES -->
<div class="mt-6 md:mt-12">
	<a href="#native_model_variables"
		><h2 id="native_model_variables" class="text-2xl md:text-3xl">Native Model Variables</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			The UK Met Office directly predicts the fields listed below. Open-Meteo retains these fields
			or uses them to calculate more convenient API variables. Unusually, UKMO provides wind as
			speed and direction, and relative humidity and direct radiation natively.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<thead>
					<tr>
						<th scope="col">Native UKMO field</th>
						<th scope="col">Level</th>
						<th scope="col">Use in the Open-Meteo API</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">Temperature</th>
						<td>2 m, height levels (UKV), pressure levels</td>
						<td><mark>temperature_2m</mark> and upper-level temperature</td>
					</tr>
					<tr>
						<th scope="row">Relative humidity</th>
						<td>2 m, pressure levels</td>
						<td>Relative humidity, dew point and pressure-level cloud cover</td>
					</tr>
					<tr>
						<th scope="row">Wind speed and direction</th>
						<td>10 m, height levels (UKV), pressure levels</td>
						<td><mark>wind_speed_10m</mark>, <mark>wind_direction_10m</mark></td>
					</tr>
					<tr>
						<th scope="row">Wind gusts</th>
						<td>10 m</td>
						<td><mark>wind_gusts_10m</mark></td>
					</tr>
					<tr>
						<th scope="row">Mean sea-level pressure</th>
						<td>Mean sea level</td>
						<td><mark>pressure_msl</mark> and derived surface pressure</td>
					</tr>
					<tr>
						<th scope="row">Precipitation, rain, snowfall, hail (UKV)</th>
						<td>Surface</td>
						<td><mark>precipitation</mark>, <mark>rain</mark>, snowfall, <mark>hail</mark></td>
					</tr>
					<tr>
						<th scope="row">Shortwave and direct solar radiation</th>
						<td>Surface</td>
						<td>Global, direct, diffuse radiation, DNI and GTI</td>
					</tr>
					<tr>
						<th scope="row">Cloud cover total, low, mid, high and fog fraction</th>
						<td>Surface</td>
						<td><mark>cloud_cover</mark>, layers and <mark>cloud_cover_2m</mark></td>
					</tr>
					<tr>
						<th scope="row">CAPE, convective inhibition, visibility, UV index (UKV)</th>
						<td>Surface</td>
						<td>Corresponding API variables and weather-code inputs</td>
					</tr>
					<tr>
						<th scope="row">Geopotential and vertical velocity</th>
						<td>Pressure levels</td>
						<td><mark>geopotential_height</mark>, <mark>vertical_velocity</mark></td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="mt-2">
			Height-level variables, hail, freezing level and UV index are only available in the UKV 2 km
			model. Convective inhibition and pressure-level vertical velocity are only in the Global 10 km
			model.
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
			UKMO publishes unusually complete fields: wind is provided directly as speed and direction (no
			U/V components), relative humidity and direct solar radiation are native, and the UKV model
			adds rain, snowfall and hail as separate fields. The remaining API variables are derived by
			Open-Meteo.
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
						<th scope="row">Weather code</th>
						<td>
							Computed from cloud cover, precipitation, snowfall, wind gusts, CAPE, convective
							inhibition and visibility. UKMO's own significant-weather symbol is not used.
						</td>
					</tr>
					<tr>
						<th scope="row">Snowfall and rain</th>
						<td>
							On UKV, snowfall water equivalent and rain are native. On the Global 10 km model,
							precipitation is counted as snow below 0°C and rain is the remainder. Snowfall uses
							0.7 cm per mm of water.
						</td>
					</tr>
					<tr>
						<th scope="row">Solar radiation averaging</th>
						<td>
							UKMO publishes instantaneous radiation fluxes. Open-Meteo converts them to hourly
							backwards-averaged values during download. Diffuse radiation is the difference of
							global and native direct radiation; DNI, GTI and instant values follow from solar
							geometry.
						</td>
					</tr>
					<tr>
						<th scope="row">Dew point, vapour pressure deficit and wet bulb temperature</th>
						<td>Calculated from native 2 m temperature and relative humidity.</td>
					</tr>
					<tr>
						<th scope="row">Surface pressure</th>
						<td>Calculated from mean sea-level pressure, 2 m temperature and terrain elevation.</td>
					</tr>
					<tr>
						<th scope="row">Sunshine duration</th>
						<td>
							Seconds per hour with direct normal irradiance above the WMO threshold of 120 W/m².
						</td>
					</tr>
					<tr>
						<th scope="row">Apparent temperature and reference evapotranspiration ET₀</th>
						<td>
							Combine temperature, humidity, wind speed and solar radiation. ET₀ follows the FAO-56
							Penman-Monteith equation.
						</td>
					</tr>
					<tr>
						<th scope="row">Pressure-level cloud cover</th>
						<td>Estimated from native pressure-level relative humidity.</td>
					</tr>
					<tr>
						<th scope="row">Freezing level height (UKV)</th>
						<td>
							Native field converted from height above ground to height above sea level using the
							model orography.
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="text-muted-foreground mt-2">
			Sunrise, sunset, daylight duration and the day-or-night flag are astronomical calculations.
			Daily values are aggregated from hourly data.
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
			For a detailed list of all available weather variables please refer to the general <a
				href="/en/docs">Weather Forecast API</a
			>. Only notable remarks are listed below
		</p>
		<ul class="ml-6 list-disc">
			<li>
				<strong>Solar radiation:</strong>UKMO supplies shortwave radiation as instantaneous values.
				Open-Meteo transforms these into backward-averaged radiation to align with the definition
				used by other weather models. However, in the global domain, data shifts to 6-hour
				intervals, rendering instantaneous values useless at that temporal resolution. As a result,
				solar radiation forecasts are only offered for a 2-day forecast horizon, where 1-hourly data
				remains available.
			</li>
			<li>
				<strong>Direct Solar Radiation:</strong> UKMO provides direct solar radiation. Many other weather
				models only provide global solar radiation and direct solar radiation must be calculated user
				separation models.
			</li>
			<li>
				<strong>Wind, temperature and cloud forecasts on height levels 100m and above:</strong> Forecasts
				at different levels above ground are only available for the 2 km UKV model.
			</li>
			<li>
				<strong>Cloud Cover (2m):</strong> UKMO UKV 2 km provides cloud cover at 2 metre above ground
				which can be interpreted as fog. This is remarkable, because only very weather models are capable
				of modeling low level cloud cover and fog with a good degree of accuracy.
			</li>
		</ul>
	</div>
</div>

<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import {
		altitudeAboveSeaLevelMeters,
		countPressureVariables,
		countVariables
	} from '$lib/utils/meteo';
	import { slide } from '$lib/utils/transitions';

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
	import ZoomableImage from '$lib/components/media/zoomable-image.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
	import TimeSelector from '$lib/components/time/time-selector.svelte';
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
		hourly,
		levels,
		models,
		pressureVariables
	} from './options';

	const params = urlHashStore({
		latitude: [41.89],
		longitude: [12.51],
		...defaultParameters,
		hourly: ['temperature_2m']
	});

	let timezoneInvalid = $derived(
		$params.timezone == 'UTC' && ($params.daily ? $params.daily.length > 0 : false)
	);

	// Additional variable settings
	let forecastHours = $derived(
		forecastHoursOptions.find((fho) => String(fho.value) == $params.forecast_hours)
	);
	let pastHours = $derived(pastHoursOptions.find((pho) => String(pho.value) == $params.past_hours));
	let temporalResolution = $derived(
		temporalResolutionOptions.find((tro) => String(tro.value) == $params.temporal_resolution)
	);
	let cellSelection = $derived(
		gridCellSelectionOptions.find((gcso) => String(gcso.value) == $params.cell_selection)
	);
	let pressureVariablesTab = $state('temperature');

	let accordionValues: string[] = $state([]);
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
	lastDate.setDate(lastDate.getDate() + 8);
</script>

<svelte:head>
	<title>ItaliaMeteo ARPAE ICON-2i | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/italia-meteo-arpae-api" />
	<meta
		name="description"
		content="Weather forecasts from ItaliaMeteo ARPAE ICON-2i at 2 km resolution for Italy and the Mediterranean. Free API for non-commercial use, no key required."
	/>
</svelte:head>

<form method="get" action="https://api.open-meteo.com/v1/forecast">
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<TimeSelector
		bind:params={$params}
		{beginDate}
		{lastDate}
		{pastDaysOptions}
		{forecastDaysOptions}
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
					<div class="w-full md:w-56.75">
						<ToggleGroup.Root
							type="single"
							bind:value={pressureVariablesTab}
							class="justify-start gap-0"
						>
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
								<div class="grid grid-cols-1">
									{#each levels as level, j (j)}
										<div class="group flex items-center" title={String(level)}>
											<Checkbox
												id="{variable.value}_{level}hPa"
												class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-current"
												value="{variable.value}_{level}hPa"
												checked={$params.hourly?.includes(`${variable.value}_${level}hPa`)}
												aria-labelledby="{variable.value}_{level}hPa"
												onCheckedChange={() => {
													if ($params.hourly?.includes(`${variable.value}_${level}hPa`)) {
														$params.hourly = $params.hourly.filter((item: string) => {
															return item !== `${variable.value}_${level}hPa`;
														});
													} else {
														$params.hourly?.push(`${variable.value}_${level}hPa`);
														$params.hourly = $params.hourly;
													}
												}}
											/>
											<Label
												for="{variable.value}_{level}hPa"
												class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]"
												>{level} hPa
												<small class="text-muted-foreground"
													>({altitudeAboveSeaLevelMeters(level)})</small
												></Label
											>
										</div>
									{/each}
								</div>
							{/if}
						{/each}
					</div>
				</div>
				<div class="mt-3 lg:ml-62.25">
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
			Note: Current conditions are based on 1 hourly weather model data. Every weather variable
			available in hourly data, is available as current condition as well.
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
	<ResultsPreview
		{params}
		{defaultParameters}
		model_default="italia_meteo_arpae_icon_2i"
		defaultTimeParameters={false}
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<p>This API provides access to the ICON-2I model from ItaliaMeteo-ARPAE.</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-250">
				<caption
					>You can find the update timings in the <a
						class="text-link underline"
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
						<th scope="row">ICON 2I</th>
						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[26px] shrink-0 items-center gap-2">
									<img
										height="26"
										width="26"
										src="/images/country-flags/it.svg"
										alt="Italy"
										title="Italy"
									/>
								</div>
								Southern Europe
							</div>
						</td>
						<td>0.02° (~2 km)</td>
						<td>Hourly</td>
						<td>3 days</td>
						<td>Every 12 hours</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:gap-6 lg:grid-cols-2">
			<ZoomableImage
				figureClass="w-full"
				class="w-full"
				src="/images/models/italia_meteo_arpae_icon_2i.webp"
				alt="Italia Meteo ARPAE ICON 2I Model Area"
			>
				{#snippet caption()}
					Italia Meteo ARPAE ICON 2I Model Area. Source:
					<a href="https://maps.open-meteo.com/?domain=italia_meteo_arpae_icon_2i#4.5/41.76/12.51"
						>Open-Meteo</a
					>.
				{/snippet}
			</ZoomableImage>
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
			ICON-2I directly predicts the fields listed below. Open-Meteo retains these fields or uses
			them to calculate more convenient API variables. ICON-2I provides native weather codes, direct
			solar radiation and dew point rather than relative humidity.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<thead>
					<tr>
						<th scope="col">Native ICON-2I field</th>
						<th scope="col">Level</th>
						<th scope="col">Use in the Open-Meteo API</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">Temperature and dew point</th>
						<td>2 m, pressure levels</td>
						<td><mark>temperature_2m</mark>, relative humidity and dew point</td>
					</tr>
					<tr>
						<th scope="row">U and V wind components</th>
						<td>10 m, pressure levels</td>
						<td>Wind speed and direction</td>
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
						<th scope="row">Total, grid-scale and convective rain and snow</th>
						<td>Surface</td>
						<td><mark>precipitation</mark>, <mark>rain</mark>, <mark>showers</mark>, snowfall</td>
					</tr>
					<tr>
						<th scope="row">Direct solar radiation</th>
						<td>Surface</td>
						<td>Global, direct, diffuse radiation, DNI and GTI</td>
					</tr>
					<tr>
						<th scope="row">Cloud cover total, low, mid and high</th>
						<td>Surface</td>
						<td><mark>cloud_cover</mark> and the individual layers</td>
					</tr>
					<tr>
						<th scope="row">Weather code (WW)</th>
						<td>Surface</td>
						<td><mark>weather_code</mark> (with temperature-based corrections)</td>
					</tr>
					<tr>
						<th scope="row"
							>CAPE, convective inhibition, lightning potential, freezing level, snow depth</th
						>
						<td>Surface</td>
						<td>Corresponding API variables and weather-code inputs</td>
					</tr>
					<tr>
						<th scope="row">Geopotential, vertical velocity and relative humidity</th>
						<td>Pressure levels</td>
						<td>
							<mark>geopotential_height</mark>, <mark>vertical_velocity</mark>, pressure-level cloud
							cover
						</td>
					</tr>
					<tr>
						<th scope="row">Soil temperature and moisture</th>
						<td>Multiple depths</td>
						<td>Soil temperature and moisture variables</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="mt-2">Visibility is not available for this model.</p>
	</div>
</div>

<!-- DERIVED VARIABLES -->
<div class="mt-6 md:mt-12">
	<a href="#derived_variables"
		><h2 id="derived_variables" class="text-2xl md:text-3xl">Derived Variables</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			ICON-2I publishes native weather codes, direct solar radiation, wind gusts, cloud cover
			layers, CAPE, convective inhibition and lightning potential. Open-Meteo derives the remaining
			API variables from these native fields.
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
						<th scope="row">Wind speed and direction</th>
						<td>
							Calculated from the native U and V wind components at 10 m and on all pressure levels.
						</td>
					</tr>
					<tr>
						<th scope="row">Relative humidity and dew point</th>
						<td>
							ICON-2I publishes dew point; relative humidity is computed from temperature and dew
							point, and dew point is then recomputed on request.
						</td>
					</tr>
					<tr>
						<th scope="row">Weather code corrections</th>
						<td>
							The native ICON WW code is adjusted so precipitation codes without precipitation fall
							back to cloud cover, and snow and rain codes swap based on temperature and snow line.
						</td>
					</tr>
					<tr>
						<th scope="row">Rain, showers and snowfall</th>
						<td>
							Split from the native grid-scale and convective rain and snow fields. Snowfall
							converts the water equivalent with 0.7 cm per mm.
						</td>
					</tr>
					<tr>
						<th scope="row">Diffuse radiation</th>
						<td>
							Global minus native direct radiation. DNI, GTI and instant values follow from solar
							geometry. No radiation separation model is required.
						</td>
					</tr>
					<tr>
						<th scope="row">Surface pressure</th>
						<td>Calculated from mean sea-level pressure, 2 m temperature and terrain elevation.</td>
					</tr>
					<tr>
						<th scope="row">Vertical velocity</th>
						<td>
							Native omega in Pa/s converted to geometric velocity in m/s using the temperature at
							each pressure level.
						</td>
					</tr>
					<tr>
						<th scope="row">Pressure-level cloud cover</th>
						<td>Estimated from native pressure-level relative humidity.</td>
					</tr>
					<tr>
						<th scope="row"
							>Apparent temperature, ET₀, sunshine duration and wet bulb temperature</th
						>
						<td>
							Combine temperature, humidity, wind speed and solar radiation. ET₀ follows the FAO-56
							Penman-Monteith equation; sunshine duration counts time with DNI above 120 W/m².
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
			>.
		</p>
	</div>
</div>

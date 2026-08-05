<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';

	import InfoIcon from '@lucide/svelte/icons/info';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { countPressureVariables, countVariables } from '$lib/utils/meteo';
	import { slide } from '$lib/utils/transitions';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import PressureVariablesSelector from '$lib/components/pressure/pressure-variables-selector.svelte';
	import ResultsPreview from '$lib/components/response/results-preview.svelte';
	import AdditionalOptionsSelects from '$lib/components/select/additional-options-selects.svelte';
	import LabeledSelect from '$lib/components/select/labeled-select.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
	import TiltAzimuthInputs from '$lib/components/variables/tilt-azimuth-inputs.svelte';
	import VariableCheckboxGroups from '$lib/components/variables/variable-checkbox-groups.svelte';

	import {
		daily,
		forecastDaysOptions,
		forecastHoursOptions,
		forecastMinutely15Options,
		gridCellSelectionOptions,
		minutely_15,
		models,
		pastHoursOptions,
		pastMinutely15Options,
		solarVariables,
		temporalResolutionOptions
	} from '../options';
	import {
		additionalDaily,
		additionalVariables,
		defaultParameters,
		hourly,
		levels,
		pressureVariables
	} from './options';

	let d = new SvelteDate();
	d.setUTCDate(d.getUTCDate() - 1);
	d.setUTCHours(0);
	d.setUTCMinutes(0);
	d.setUTCSeconds(0);
	d.setUTCMilliseconds(0);

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		run: d.toISOString().replace(':00.000Z', ''),
		...defaultParameters,
		models: ['ecmwf_ifs'],
		hourly: ['temperature_2m']
	});

	let forecastDays = $derived(
		forecastDaysOptions.find((fco) => fco.value == $params.forecast_days)
	);

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
	let forecastMinutely15 = $derived(
		forecastMinutely15Options.find((fmo) => String(fmo.value) == $params.forecast_minutely_15)
	);
	let pastMinutely15 = $derived(
		pastMinutely15Options.find((pmo) => String(pmo.value) == $params.past_minutely_15)
	);

	let accordionValues: string[] = $state([]);
	onMount(() => {
		if (
			$params.hourly &&
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
			(countVariables(solarVariables, $params.hourly).active ||
				($params.tilt ? Number($params.tilt) > 0 : false) ||
				($params.azimuth ? Number($params.azimuth) > 0 : false)) &&
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

		if (
			$params.models &&
			countVariables(models, $params.models).active &&
			!accordionValues.includes('models')
		) {
			accordionValues.push('models');
		}

		if (
			$params.minutely_15 &&
			(countVariables(minutely_15, $params.minutely_15).active +
				countVariables(solarVariables, $params.minutely_15).active >
				0 ||
				(pastMinutely15 ? pastMinutely15.value : false) ||
				(forecastMinutely15 ? forecastMinutely15.value : false)) &&
			!accordionValues.includes('minutely_15')
		) {
			accordionValues.push('minutely_15');
		}
	});
</script>

<svelte:head>
	<title>Single Runs API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/single-runs-api" />
	<meta
		name="description"
		content="Retrieve the full forecast horizon of any individual model run by initialisation time. ECMWF IFS 9 km from March 2024, all other models from 2nd of April 2026."
	/>
</svelte:head>

<Alert.Root variant="info" class="mb-4"
	><InfoIcon />
	<Alert.Description>
		Retrieve the full forecast horizon of any individual model run using the <mark>&run=</mark>
		parameter (e.g. <mark>&run=2025-09-01T00:00</mark>). Most models are archived from 2nd of April
		2026. ECMWF IFS HRES at 9 km is available from March 2024.
	</Alert.Description>
</Alert.Root>

<form method="get" action="https://single-runs-api.open-meteo.com/v1/forecast">
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<div class="mt-3 md:mt-6">
		<div class="grid gap-3 md:gap-6 lg:grid-cols-2">
			<div class="grid gap-3 sm:grid-cols-2 md:gap-6">
				<div class="relative">
					<Input
						id="run"
						type="text"
						class="h-12 cursor-pointer pt-6"
						name="run"
						bind:value={$params.run}
					/>
					<Label
						class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
						for="run">Run (yyyy-mm-ddThh:mm)</Label
					>
				</div>
				<div class="relative">
					<Select.Root name="forecast_days" type="single" bind:value={$params.forecast_days}>
						<Select.Trigger
							aria-label="Forecast days input"
							class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{forecastDays?.label}</Select.Trigger
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
			<AccordionItem
				id="minutely_15"
				title="15-Minutely Weather Variables"
				count={{
					active:
						countVariables(solarVariables, $params.minutely_15).active +
						countVariables(minutely_15, $params.minutely_15).active,
					total:
						countVariables(solarVariables, $params.minutely_15).total +
						countVariables(minutely_15, $params.minutely_15).total
				}}
			>
				<VariableCheckboxGroups
					class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
					groups={minutely_15}
					bind:values={$params.minutely_15}
					idSuffix="minutely_15"
				/>

				<VariableCheckboxGroups
					class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
					groups={solarVariables}
					bind:values={$params.minutely_15}
					idSuffix="minutely_15"
				/>

				<div>
					<small class="text-muted-foreground"
						>Note: Only available in Central Europe and North America. Other regions use
						interpolated hourly data. Solar radiation is averaged over the 15 minutes. Use
						<mark>instant</mark> for radiation at the indicated time.</small
					>
				</div>
				<div>
					<small class="text-muted-foreground"
						>Note: You can further adjust the forecast time range for 15-minutely weather variables
						using <mark>&forecast_minutely_15=</mark> and <mark>&past_minutely_15=</mark> as shown below.
					</small>
				</div>
				<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-2 md:gap-6">
					<LabeledSelect
						name="forecast_minutely_15"
						label="Forecast Minutely 15"
						options={forecastMinutely15Options}
						bind:value={$params.forecast_minutely_15}
					/>
					<LabeledSelect
						name="past_minutely_15"
						label="Past Minutely 15"
						options={pastMinutely15Options}
						bind:value={$params.past_minutely_15}
					/>
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

		<Accordion.Root type="single" class="border-border mt-3 rounded-lg border md:mt-6">
			<AccordionItem
				id="additional-daily-variables"
				title="Additional Daily Variables"
				count={countVariables(additionalDaily, $params.daily)}
			>
				<VariableCheckboxGroups
					class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
					groups={additionalDaily}
					bind:values={$params.daily}
					idSuffix="daily"
				/>
			</AccordionItem>
		</Accordion.Root>
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6"><LicenceSelector requires_professional_plan={true} /></div>
</form>

<!-- RESULTS -->
<div class="mt-6 md:mt-12">
	<ResultsPreview {params} {defaultParameters} type="single-runs" useStockChart={true} />
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<div class="grid gap-4 md:gap-6 lg:grid-cols-2">
			<p>
				Weather models are initialised and computed multiple times per day. Each run ingests the
				latest observations — radiosondes, weather stations, aircraft, satellites, and ocean buoys —
				and produces a complete forecast out to the model's full horizon (typically 7–16 days). The
				operational Open-Meteo Forecast API stitches the most recent run of each model into a
				seamless, continuously updated time-series. That approach is ideal for end-user applications
				but discards the individual run structure required for research, post-processing, and
				backtesting workflows.
			</p>
			<p>
				The Single Runs API preserves this structure. Each run is stored and retrievable
				independently, so you can request the exact forecast issued at a specific initialisation
				time. The <mark>&run=</mark> parameter identifies the run by its UTC initialisation
				datetime, e.g. <mark>&run=2025-09-01T00:00</mark>.
			</p>
			<p>
				The <mark>&run=</mark> parameter specifies the model's <strong>initialisation time</strong>
				— the UTC reference time at which the observations are taken — not the time at which the forecast
				output becomes publicly available. After initialisation, the model requires additional computation
				time before results are distributed: typically 4–6 hours for global models (e.g. ECMWF IFS, GFS)
				and 1–3 hours for regional models. This means a run initialised at 00 UTC is generally accessible
				from approximately 04–06 UTC onwards. The exact availability times for each model are listed on
				the
				<a class="text-link underline" href="/en/docs/model-updates">model updates page</a>.
			</p>
			<p>
				Archival runs are available from <strong>2nd of April 2026</strong> for most models.
				<strong>ECMWF IFS HRES at native 9 km resolution</strong>
				is available from
				<strong>March 14, 2024</strong> (IFS Cycle 49R1 hindcasts). From May 12, 2026 06 UTC, runs
				use the updated <strong>IFS Cycle 50R1</strong>. ECMWF IFS HRES is the highest-quality
				global weather model and the backbone of the
				<a class="text-link underline" href="/en/docs/historical-weather-api"
					>Open-Meteo Historical Weather API</a
				>. Access to individual ECMWF runs is particularly valuable for renewable energy
				forecasting, where the full forecast horizon from a single run drives production scheduling
				and trading decisions.
			</p>
		</div>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<thead>
					<tr>
						<th scope="col">Weather Provider</th>
						<th scope="col">Model</th>
						<th scope="col">Region</th>
						<th scope="col">Resolution</th>
						<th scope="col">Temporal Resolution</th>
						<th scope="col">Forecast Horizon</th>
						<th scope="col">Run Frequency</th>
						<th scope="col">Available From</th>
					</tr>
				</thead>
				<tbody class="[&_a]:text-link [&_a]:underline [&_a]:underline-offset-3">
					<tr>
						<th scope="row">ECMWF</th>
						<td><a href="/en/docs/ecmwf-api">IFS HRES 9 km</a></td>
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
						<td>9 km (O1280 grid)</td>
						<td>Hourly</td>
						<td>10 days</td>
						<td>4× daily (00, 06, 12, 18 UTC)</td>
						<td>2024-03-14</td>
					</tr>
					<tr>
						<th scope="row">Others</th>
						<td>-</td>
						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[26px] shrink-0 items-center gap-2">
									<div class="flex h-[26px] w-[26px] items-center justify-center text-[23px]">
										🌍
									</div>
								</div>
								Global & Regional
							</div>
						</td>
						<td>up to 1 km</td>
						<td>up to 15 minutely</td>
						<td>up to 16 days</td>
						<td>-</td>
						<td>2026-04-02</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- API ENDPOINT -->
<div class="mt-6 md:mt-12">
	<a href="#api_endpoint">
		<h2 id="api_endpoint" class="text-2xl md:text-3xl">API Endpoint</h2>
	</a>
	<div class="mt-2 md:mt-4">
		<p>
			The API endpoint <mark>https://single-runs-api.open-meteo.com/v1/forecast</mark> accepts the
			same parameters as the
			<a class="text-link underline" href="/en/docs">Weather Forecast API</a>, with one additional
			required parameter: <mark>run</mark>. All weather variables, units, and output formats
			available in the Forecast API are supported. Data is served from a dedicated archive storage
			system, so response times may be higher than the real-time forecast API.
		</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-200">
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
						<th scope="row">run</th>
						<td>ISO 8601 datetime</td>
						<td>Yes</td>
						<td></td>
						<td
							>The initialisation date and time of the model run to retrieve. Must be provided in
							ISO 8601 format without seconds, e.g. <mark>&run=2024-06-01T00:00</mark>. The time
							must correspond to a valid run cycle for the selected model (e.g. 00, 06, 12, 18 UTC
							for most global models). Runs that are not available will return an error.</td
						>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="mt-3 md:mt-6">
			All other parameters from the Forecast API — including <mark>latitude</mark>,
			<mark>longitude</mark>, <mark>hourly</mark>, <mark>daily</mark>, and others — are also
			accepted unchanged. Please refer to the
			<a class="text-link underline" href="/en/docs">Weather Forecast API documentation</a> for a complete
			parameter reference.
		</p>
	</div>
</div>

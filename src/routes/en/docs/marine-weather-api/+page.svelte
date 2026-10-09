<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';

	import { urlHashStore } from '#lib/stores/url-hash-store.js';

	import { isAvailable, isDailyAvailable } from '#lib/utils/index.js';
	import { countVariables } from '#lib/utils/meteo.js';
	import { slide } from '#lib/utils/transitions.js';

	import MarineObject from '#lib/components/code/docs/marine-object.svx';
	import WeatherForecastError from '#lib/components/code/docs/weather-forecast-error.svx';

	import * as Accordion from '#lib/components/ui/accordion/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import { Checkbox } from '#lib/components/ui/checkbox/index.js';
	import { Label } from '#lib/components/ui/label/index.js';

	import AccordionItem from '#lib/components/accordion/accordion-item.svelte';
	import ApiModeDescription from '#lib/components/api-mode/api-mode-description.svelte';
	import ApiModeSelector from '#lib/components/api-mode/api-mode-selector.svelte';
	import ApiModeTimeSelector from '#lib/components/api-mode/api-mode-time-selector.svelte';
	import { apiModeFormAction } from '#lib/components/api-mode/utils.js';
	import ApiParameterTable from '#lib/components/docs/api-parameter-table.svelte';
	import {
		apiParameters,
		recentPastDaysDescription
	} from '#lib/components/docs/api-parameters.svelte';
	import ApiResponseParameterTable from '#lib/components/docs/api-response-parameter-table.svelte';
	import { apiResponseParameters } from '#lib/components/docs/api-response-parameters.svelte';
	import LicenceSelector from '#lib/components/licence/licence-selector.svelte';
	import LocationSelection from '#lib/components/location/location-selection.svelte';
	import ZoomableImageGallery from '#lib/components/media/zoomable-image-gallery.svelte';
	import ZoomableImage from '#lib/components/media/zoomable-image.svelte';
	import ResultsPreview from '#lib/components/response/results-preview.svelte';
	import AdditionalOptionsSelects from '#lib/components/select/additional-options-selects.svelte';
	import LabeledSelect from '#lib/components/select/labeled-select.svelte';
	import Settings from '#lib/components/settings/settings.svelte';
	import VariableCheckboxGroups from '#lib/components/variables/variable-checkbox-groups.svelte';

	import {
		forecastHoursOptions,
		forecastMinutely15Options,
		pastDaysOptions,
		pastHoursOptions,
		pastMinutely15Options,
		temporalResolutionOptions
	} from '../options';
	import {
		additionalVariables,
		availableVariables,
		daily,
		defaultParameters,
		forecastDaysOptions,
		gridCellSelectionOptions,
		hourly,
		minutely_15,
		models
	} from './options';

	const params = urlHashStore({
		latitude: [54.544587],
		longitude: [10.227487],
		...defaultParameters,
		api_mode: 'forecast',
		run: '',
		hourly: ['wave_height'],
		// move to options
		minutely_15: [],
		past_minutely_15: '',
		forecast_minutely_15: ''
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
	let forecastMinutely15 = $derived(
		forecastMinutely15Options.find((fmo) => String(fmo.value) == $params.forecast_minutely_15)
	);
	let pastMinutely15 = $derived(
		pastMinutely15Options.find((pmo) => String(pmo.value) == $params.past_minutely_15)
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

		if (
			(countVariables(minutely_15, $params.minutely_15).active ||
				(pastMinutely15 ? pastMinutely15.value : false) ||
				(forecastMinutely15 ? forecastMinutely15.value : false)) &&
			!accordionValues.includes('minutely_15')
		) {
			accordionValues.push('minutely_15');
		}
	});

	let beginDate = new Date('1940-01-01');

	let lastDate = new SvelteDate();
	lastDate.setDate(lastDate.getDate() + 16);
</script>

<svelte:head>
	<title>🌊 Marine Weather API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/marine-weather-api" />
	<meta
		name="description"
		content="Marine Weather API with ocean wave forecasts. Free access for non-commercial use. Access detailed ocean wave forecasts generated by local and global models. Stay informed about wave conditions and make well-informed decisions for your marine activities. Enhance safety and optimize your maritime operations with accurate and reliable marine weather data."
	/>
</svelte:head>

<form
	method="get"
	action={apiModeFormAction($params.api_mode, 'https://marine-api.open-meteo.com/v1/marine')}
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
		<a href="#hourly_weather_variables">
			<h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">Hourly Marine Variables</h2>
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
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-current"
								{value}
								disabled={!isAvailable(value, $params.models, availableVariables)}
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
		<div class="mb-3">
			<p>
				<small class="text-muted-foreground"
					>Note: Tides and ocean currents are computed at 0.08° (~8 km) resolution using numerical
					models. Accuracy at coastal areas is limited. This is not suitable for coastal navigation
					and does not replace your nautical almanac. Use with caution!
				</small>
			</p>
			<p>
				<small class="text-muted-foreground"
					>Note: Secondary swell components are only available for some models. Tertiary components
					are only available for the GFS wave models.
				</small>
			</p>
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
				id="models"
				title="Weather models"
				count={countVariables(models, $params.models)}
			>
				<VariableCheckboxGroups
					class="mt-2 grid sm:grid-cols-2"
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
				count={countVariables(minutely_15, $params.minutely_15)}
			>
				<VariableCheckboxGroups
					class="mt-2 grid"
					groups={minutely_15}
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
		<a href="#daily_weather_variables">
			<h2 id="daily_weather_variables" class="text-2xl md:text-3xl">Daily Marine Variables</h2>
		</a>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each daily as group, i (i)}
				<div>
					{#each group as { value, label } (value)}
						<div class="group flex items-center" title={label}>
							<Checkbox
								id="{value}_daily"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-current"
								{value}
								checked={$params.daily?.includes(value)}
								disabled={!isDailyAvailable(value, $params.models, availableVariables)}
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

	<!-- CURRENT -->
	<div class="mt-6 md:mt-12">
		<a href="#current_weather">
			<h2 id="current_weather" class="text-2xl md:text-3xl">Current Conditions</h2>
		</a>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each hourly as group, i (i)}
				<div>
					{#each group as { value, label } (value)}
						<div class="group flex items-center" title={label}>
							<Checkbox
								id="{value}_current"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-current"
								{value}
								checked={$params.current?.includes(value)}
								disabled={!isAvailable(value, $params.models, availableVariables)}
								aria-labelledby="{value}_current_label"
								onCheckedChange={() => {
									if ($params.current?.includes(value)) {
										$params.current = $params.current.filter((item: string) => {
											return item !== value;
										});
									} else if ($params.current) {
										$params.current.push(value);
										$params.current = $params.current;
									}
								}}
							/>
							<Label
								id="{value}_current_label"
								for="{value}_current"
								class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
		<div class="text-muted-foreground mt-1">
			Note: Current conditions are based on 15-minutely weather model data. Every weather variable
			available in hourly data, is available as current condition as well.
		</div>
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} visible={['length', 'velocity', 'timeformat']} />
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
		useStockChart
		type="marine"
		action="marine"
		sdk_type="marine_api"
		model_default={$params.api_mode === 'forecast' ? '' : 'marine_best_match'}
		defaultTimeParameters={false}
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<p>The Marine API combines wave models from different sources.</p>
		<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
			<table class="docs-table w-full min-w-300">
				<caption
					>You can find the update timings in the <a
						class="text-link underline"
						href="/en/docs/model-updates">model updates documentation</a
					>.</caption
				>
				<thead>
					<tr>
						<th scope="col">Data Set</th>
						<th scope="col">Region</th>
						<th scope="col"></th>
						<th scope="col">Spatial Resolution</th>
						<th scope="col">Temporal Resolution</th>
						<th scope="col">Data Availability</th>
						<th scope="col">Update frequency</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row"
							><a
								href="https://data.marine.copernicus.eu/product/GLOBAL_ANALYSISFORECAST_WAV_001_027/description"
								>MeteoFrance MFWAM</a
							>
						</th>
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
						<td
							><a
								href="https://data.marine.copernicus.eu/viewer/expert?view=viewer&crs=epsg%3A4326&z=0&center=-23.399717243797422%2C42.59188729714914&zoom=10.52284658362573&layers=W3sib3BhY2l0eSI6MSwiaWQiOiJ0ZW1wMSIsImxheWVySWQiOiJHTE9CQUxfQU5BTFlTSVNGT1JFQ0FTVF9XQVZfMDAxXzAyNy9jbWVtc19tb2RfZ2xvX3dhdl9hbmZjXzAuMDgzZGVnX1BUM0gtaV8yMDIzMTEvVkhNMCIsInpJbmRleCI6MCwiaXNFeHBsb3JpbmciOnRydWUsImxvZ1NjYWxlIjpmYWxzZX1d&basemap=dark"
								target="_blank"
								title="Visualize as map">Map</a
							></td
						>
						<td>0.08° (~8 km)</td>
						<td>3-Hourly</td>
						<td>October 2021 with 10 day forecast</td>
						<td>Every 12 hours</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://data.marine.copernicus.eu/product/GLOBAL_ANALYSISFORECAST_PHY_001_024/services"
								>MeteoFrance SMOC Currents, Tides</a
							>
						</th>
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
						<td
							><a
								href="https://data.marine.copernicus.eu/viewer/expert?view=viewer&crs=epsg%3A4326&z=-0.49402499198913574&center=-12.433872193277338%2C42.88370285999325&zoom=11.872305323411199&layers=W3sib3BhY2l0eSI6MSwiaWQiOiJ0ZW1wMSIsImxheWVySWQiOiJHTE9CQUxfQU5BTFlTSVNGT1JFQ0FTVF9QSFlfMDAxXzAyNC9jbWVtc19tb2RfZ2xvX3BoeV9hbmZjX21lcmdlZC11dl9QVDFILWlfMjAyMjExL3VvIiwiekluZGV4IjowLCJpc0V4cGxvcmluZyI6dHJ1ZSwibG9nU2NhbGUiOmZhbHNlfV0%3D&basemap=dark"
								target="_blank"
								title="Visualize as map">Map</a
							></td
						>
						<td>0.08° (~8 km)</td>
						<td>Hourly</td>
						<td>January 2022 with 10 day forecast</td>
						<td>Every 24 hours</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://data.marine.copernicus.eu/product/GLOBAL_ANALYSISFORECAST_PHY_001_024/services"
								>MeteoFrance Sea Surface Temperature</a
							>
						</th>
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
						<td
							><a
								href="https://data.marine.copernicus.eu/viewer/expert?view=viewer&crs=epsg%3A4326&t=1771934400000&z=-0.49402499198913574&center=-12.433872193277338%2C42.88370285999325&zoom=11.872305323411199&layers=H4sIADIPnGkAAyWOywqDMBRE._Wu_0gflJKdFVsFqVLdSCmXYK4PiEaiBa34703pdpiZc54z6KEi42ptZA98XlZQS_AwUNPtYAVKTGSCX3ILo4sTonN3wiwJkmv08FwnSTH2M2Rsh2x.3OYNNT02WmKpNHbVtLbng9Ao2iJHtmHng6QS4.Tkr2vc2wk7bf8Vy.oEraQROLMOvTd2Spu6LYEP5k3WRJdJLhQBL4TqaXl9AaUlKFe8AAAA&basemap=dark"
								target="_blank"
								title="Visualize as map">Map</a
							></td
						>
						<td>0.08° (~8 km)</td>
						<td>6-Hourly</td>
						<td>January 2022 with 10 day forecast</td>
						<td>Every 24 hours</td>
					</tr>
					<tr>
						<th scope="row"
							><a href="https://www.ecmwf.int/en/elibrary/79883-wave-model">ECMWF WAM</a>
						</th>
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
						<td></td>
						<td>9 km</td>
						<td>Hourly</td>
						<td>November 2025 with 15 day forecast</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row"
							><a href="https://www.ecmwf.int/en/elibrary/79883-wave-model">ECMWF WAM 0.25</a>
						</th>
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
						<td></td>
						<td>0.25° (~25 km)</td>
						<td>3-Hourly</td>
						<td>March 2024 with 15 day forecast</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row"
							><a href="https://polar.ncep.noaa.gov/waves/index.php">NCEP GFS Wave</a>
						</th>
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
						<td></td>
						<td>0.25° (~25 km)</td>
						<td>Hourly</td>
						<td>June 2024 with 16 day forecast</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row"
							><a href="https://polar.ncep.noaa.gov/waves/index.php">NCEP GFS Wave</a>
						</th>
						<td>
							<div class="flex items-center gap-2">
								<div class="flex w-[26px] shrink-0 items-center gap-2">
									<div class="flex h-[26px] w-[26px] items-center justify-center text-[23px]">
										🌍
									</div>
								</div>
								Latitude 52.5°N - 15°S
							</div>
						</td>
						<td></td>
						<td>0.16° (~16 km)</td>
						<td>Hourly</td>
						<td>October 2024 with 16 day forecast</td>
						<td>Every 6 hours</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://www.dwd.de/EN/specialusers/shipping/seegangsvorhersagesystem_en.html"
								>DWD EWAM</a
							>
						</th>
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
						<td></td>
						<td>0.05° (~5 km)</td>
						<td>Hourly</td>
						<td>August 2022 with 8 day forecast</td>
						<td>Every 12 hours</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://www.dwd.de/EN/specialusers/shipping/seegangsvorhersagesystem_en.html"
								>DWD GWAM</a
							>
						</th>
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
						<td></td>
						<td>0.25° (~25 km)</td>
						<td>Hourly</td>
						<td>August 2022 with 4 day forecast</td>
						<td>Every 12 hours</td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels?tab=overview"
								>ERA5-Ocean</a
							>
						</th>
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
						<td></td>
						<td>0.5° (~50 km)</td>
						<td>Hourly</td>
						<td>1940 to present</td>
						<td>Daily with 5 days delay</td>
					</tr>
				</tbody>
			</table>
		</div>
		<ZoomableImageGallery class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:gap-6 lg:grid-cols-2">
			<ZoomableImage src="/images/models/ncep_gfswave016.webp" alt="NCEP GFS Wave Wave 0.16°">
				{#snippet caption()}
					NCEP GFS Wave 0.16° Model Area. Source:
					<a
						href="https://maps.open-meteo.com/?domain=ncep_gfswave016&variable=wave_height#2/13.2/-0.8"
						>Open-Meteo</a
					>.
				{/snippet}
			</ZoomableImage>

			<ZoomableImage src="/images/models/dwd_ewam.webp" alt="DWD EWAM Model Area">
				{#snippet caption()}
					DWD EWAM Wave Model Area. Source:
					<a href="https://maps.open-meteo.com/?domain=dwd_ewam#3.1/51.43/15.80">Open-Meteo</a>.
				{/snippet}
			</ZoomableImage>
		</ZoomableImageGallery>
	</div>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<a href="#api_documentation"
		><h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2></a
	>
	<div class="mt-2 md:mt-4">
		<p>
			The API endpoint <mark>/v1/marine</mark> accepts a geographical coordinate, a list of marine variables
			and responds with a JSON hourly marine weather forecast for 7 days. Time always starts at 0:00 today.
			All URL parameters are listed below:
		</p>
		{#snippet lengthUnitDescription()}
			Options <mark>metric</mark> and <mark>imperial</mark>
		{/snippet}
		<ApiParameterTable
			parameters={[
				apiParameters.coordinates,
				apiParameters.hourly,
				apiParameters.daily,
				{ ...apiParameters.current, description: 'A list of variables to get current conditions.' },
				apiParameters.timeformat,
				apiParameters.timezone,
				{
					...apiParameters.past_days,
					format: 'Integer (0-92)',
					description: recentPastDaysDescription
				},
				{
					...apiParameters.forecast_days,
					format: 'Integer (0-8)',
					defaultValue: '5',
					description: 'Per default, 7 days are returned. Up to 8 days of forecast are possible.'
				},
				apiParameters.forecast_hours,
				apiParameters.start_date,
				apiParameters.start_hour,
				{
					name: 'length_unit',
					format: 'String',
					required: false,
					defaultValue: 'metric',
					description: lengthUnitDescription
				},
				{ ...apiParameters.cell_selection, defaultValue: 'sea' },
				apiParameters.apikey
			]}
		/>
	</div>
	<p class="text-muted-foreground mt-2">
		Additional optional URL parameters will be added. For API stability, no required parameters will
		be added in the future!
	</p>
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
			from the preceding hour as an average or sum.
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
						<th scope="row"
							>wave_height<br />wind_wave_height<br />swell_wave_height<br
							/>secondary_swell_wave_height<br />tertiary_swell_wave_height</th
						>
						<td>Instant</td>
						<td>Meter</td>
						<td
							>Wave height of significant mean, wind and swell waves. Wave directions are always
							reported as the direction the waves come from. 0° = From north towards south; 90° =
							From east</td
						>
					</tr>
					<tr>
						<th scope="row"
							>wave_direction<br />wind_wave_direction<br />swell_wave_direction<br
							/>secondary_swell_wave_direction<br />tertiary_swell_wave_direction</th
						>
						<td>Instant</td>
						<td>°</td>
						<td>Mean direction of mean, wind and swell waves</td>
					</tr>
					<tr>
						<th scope="row"
							>wave_period<br />wind_wave_period<br />swell_wave_period<br
							/>secondary_swell_wave_period<br />tertiary_swell_wave_period</th
						>
						<td>Instant</td>
						<td>Seconds</td>
						<td>Period between mean, wind and swell waves.</td>
					</tr>
					<tr>
						<th scope="row">wind_wave_peak_period<br />swell_wave_peak_period</th>
						<td>Instant</td>
						<td>Seconds</td>
						<td>Peak period between wind and swell waves.</td>
					</tr>
					<tr>
						<th scope="row">ocean_current_velocity</th>
						<td>Instant</td>
						<td>km/h (mph, m/s, knots)</td>
						<td>Velocity of ocean current considering Eulerian, Waves and Tides.</td>
					</tr>
					<tr>
						<th scope="row">ocean_current_direction</th>
						<td>Instant</td>
						<td>°</td>
						<td
							>Direction following the flow of the current. E.g. where the current is heading
							towards. 0° = Going north; 90° = Towards east.</td
						>
					</tr>
					<tr>
						<th scope="row">sea_surface_temperature</th>
						<td>Instant</td>
						<td>Celsius</td>
						<td>The sea surface temperature close to the water surface</td>
					</tr>
					<tr>
						<th scope="row">sea_level_height_msl</th>
						<td>Instant</td>
						<td>metre</td>
						<td
							>The sea level height accounts for ocean tides, the inverted barometer effect, sea
							surface height, global mean steric variation, and global mean mass volume variation.
							The reference (datum) height is the global mean sea level, not the lowest astronomical
							tide. Accuracy is limited in coastal areas—while it can be reasonably accurate near
							unobstructed coasts, it may be completely unreliable further inland. This data is not
							suitable for coastal navigation.</td
						>
					</tr>
					<tr>
						<th scope="row">invert_barometer_height</th>
						<td>Instant</td>
						<td>metre</td>
						<td
							>Invert barometer effect is the height low and high pressure systems effect the sea
							level height. This is already considered in <mark>sea_level_height_msl</mark></td
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
			<table class="docs-table w-full min-w-200">
				<thead>
					<tr>
						<th scope="col">Variable</th>
						<th scope="col">Unit</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">wave_height_max<br />wind_wave_height_max<br />swell_wave_height_max</th
						>
						<td>Meter</td>
						<td>Maximum wave height on a given day for mean, wind and swell waves</td>
					</tr>
					<tr>
						<th scope="row"
							>wave_direction_dominant<br />wind_wave_direction_dominant<br
							/>swell_wave_direction_dominant
						</th>
						<td>°</td>
						<td>Dominant wave direction of mean, wind and swell waves</td>
					</tr>
					<tr>
						<th scope="row">wave_period_max<br />wind_wave_period_max<br />swell_wave_period_max</th
						>
						<td>Seconds</td>
						<td>Maximum wave period of mean, wind and swell</td>
					</tr>
					<tr>
						<th scope="row">wind_wave_peak_period_max<br />swell_wave_peak_period_max</th>
						<td>Seconds</td>
						<td>Maximum peak period between wind and swell waves.</td>
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
			<MarineObject />
		</div>
		<ApiResponseParameterTable
			parameters={[
				apiResponseParameters.coordinates,
				apiResponseParameters.generationtime_ms,
				apiResponseParameters.utc_offset_seconds,
				apiResponseParameters.timezone,
				apiResponseParameters.hourly,
				apiResponseParameters.hourly_units,
				apiResponseParameters.daily,
				apiResponseParameters.daily_units
			]}
		/>
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
		<h2 id="citation">Citation & Acknowledgement</h2>
		<p>
			Generated using ICON Wave forecast from the <a
				href="https://www.dwd.de/EN/service/copyright/copyright_node.html"
				target="_blank">German Weather Service DWD</a
			>.
		</p>
		<p>
			All users of Open-Meteo data must provide a clear attribution to DWD as well as a reference to
			Open-Meteo.
		</p>
	</div>
</div>

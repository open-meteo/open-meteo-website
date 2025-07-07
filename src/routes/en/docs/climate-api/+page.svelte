<script lang="ts">
	import { onMount } from 'svelte';

	import { countVariables } from '$lib/utils/meteo';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import * as Alert from '$lib/components/ui/alert';
	import * as Accordion from '$lib/components/ui/accordion';

	import Settings from '$lib/components/settings/settings.svelte';
	import DatePicker from '$lib/components/date/date-picker.svelte';
	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import ResultPreview from '$lib/components/highcharts/result-preview.svelte';
	import LicenseSelector from '$lib/components/license/license-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';

	import ClimateError from '$lib/components/code/docs/climate-error.svx';
	import ClimateObject from '$lib/components/code/docs/climate-object.svx';

	import { daily, models, defaultParameters } from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		start_date: '1950-01-01',
		end_date: '2050-12-31',
		models: [
			'CMCC_CM2_VHR4',
			'FGOALS_f3_H',
			'HiRAM_SIT_HR',
			'MRI_AGCM3_2_S',
			'EC_Earth3P_HR',
			'MPI_ESM1_2_XR',
			'NICAM16_8S'
		],
		...defaultParameters,
		daily: ['temperature_2m_max']
	});

	let accordionValues: string[] = $state([]);
	onMount(() => {
		if (
			countVariables(models, $params.models).active < models[0].length &&
			!accordionValues.includes('models')
		) {
			accordionValues.push('models');
		}
	});

	let begin_date = new Date('1950-01-01');
	let last_date = new Date('2050-12-31');
</script>

<svelte:head>
	<title>🌡️ Climate API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/climate-api" />
	<meta
		name="description"
		content="Downscaled IPCC climate predictions specifically tailored to a 10 km resolution, going beyond the limitations of continental-scale data. Explore high-resolution IPCC climate models, downscale predictions, and access daily climate projections up to 2050. Analyze climate change trends with control data dating back to 1950. Stay informed and make data-driven decisions for a sustainable future."
	/>
</svelte:head>

<Alert.Root class="border-border mb-4">
	<Alert.Description>
		Read the <a
			class="text-link underline"
			href="https://openmeteo.substack.com/p/climate-change-api">blog article</a
		> with more information about climate models and how data is downscaled to 10 km resolution.
	</Alert.Description>
</Alert.Root>

<form method="get" action="https://climate-api.open-meteo.com/v1/climate">
	<LocationSelection bind:params={$params} />

	<!-- TIME -->
	<div class="mt-6 flex flex-col gap-4 lg:flex-row">
		<div class="mb-3 lg:w-1/2">
			<DatePicker
				bind:start_date={$params.start_date}
				bind:end_date={$params.end_date}
				{begin_date}
				{last_date}
			/>
		</div>
		<div class="mb-3 lg:w-1/2">
			<p>Past weather forecasts from 2022 onwards are available.</p>
			<div class="flex flex-wrap items-center gap-2">
				Quick:
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={(e) => {
						$params.start_date = '1950-01-01';
						$params.end_date = '2050-12-31';
					}}>1950-2050</Button
				>
				<Button
					variant="outline"
					class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
					onclick={(e) => {
						$params.start_date = '2015-01-01';
						$params.end_date = '2050-12-31';
					}}>2015-2050</Button
				>
			</div>
		</div>
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

	<!-- CLIMATE MODELS -->
	<div class="mt-6">
		<Accordion.Root class="border-border rounded-lg border" bind:value={accordionValues}>
			<AccordionItem
				id="models"
				title="Climate models"
				count={countVariables(models, $params.models)}
			>
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
		type="climate"
		action="climate"
		sdk_type="climate_api"
		useStockChart={true}
	/>
</div>

<!-- DATA SOURCES -->
<div class="mt-6 md:mt-12">
	<a href="#data_sources"><h2 id="data_sources" class="text-2xl md:text-3xl">Data Sources</h2></a>
	<div class="mt-2 md:mt-4">
		<p>
			This API utilizes regional downscaled climate models with up to 20 kilometer resolution from
			the <a href="https://hrcm.ceda.ac.uk/research/cmip6-highresmip/" title="CMIP6 HighResMIP"
				>HighResMip working group</a
			>, which are part of the IPCC CMIP6 project.
		</p>
		<p>
			The API offers climate data at a regional, rather than continental, level by downsizing it to
			a 10 km resolution. This allows for direct comparison of various climate models to identify
			vulnerable regions to climate change impacts or assessing the impact of climate change on
			specific sectors, such as agriculture or public health. The reference point used is ERA5-Land,
			which is accessible through the <a
				href="/en/docs/historical-weather-api"
				title="Historical Weather Information via API">Historical Weather API</a
			>.
		</p>
		<p>
			With typical weather variables in daily resolution data from 1950 to 2050 data allows
			estimation of common climate parameters like the number of days with temperatures exceeding
			30°C or duration and frequency of droughts. Furthermore, daily data enables running of models
			to predict crop yield, pest infestation, and water balance.
		</p>

		<p>
			While the data from past and recent years is available, it should not be mistaken for actual
			measurements, as it serves the purpose of model validation rather than showing actual past
			weather.
		</p>
		<p>
			Projections beyond 2050 are highly dependent on different emission scenarios. The high
			resolution climate models are as close to RCP8.5 as possible within CMIP6. While other models
			consider different emission scenarios, the variations in these scenarios are less noticeable
			until 2050. Projections until 2100 are not part of this API.
		</p>
		<p>
			The climate models available in this API vary in their accuracy and level of uncertainty, and
			depending on the analysis, some models may be more suitable than others. It is not possible to
			provide a general recommendation on which model is better. It is recommended to run analyses
			with multiple models and evaluate their performance afterward.
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1240px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<thead>
					<tr>
						<th scope="col">Climate Model</th>
						<th scope="col">Origin</th>
						<th scope="col">Run by</th>
						<th scope="col">Resolution</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row"
							><a
								href="https://www.wdc-climate.de/ui/cmip6?input=CMIP6.HighResMIP.CMCC.CMCC-CM2-VHR4"
								>CMCC-CM2-VHR4</a
							>
						</th>
						<td>Italy</td>
						<td>Fondazione Centro Euro-Mediterraneo sui Cambiamenti Climatici, Lecce (CMCC)</td>
						<td>30&nbsp;km</td>
						<td></td>
					</tr>
					<tr>
						<th scope="row"
							><a href="https://www.wdc-climate.de/ui/cmip6?input=CMIP6.HighResMIP.CAS.FGOALS-f3-H"
								>FGOALS_f3_H</a
							>
						</th>
						<td>China</td>
						<td>Chinese Academy of Sciences, Beijing (CAS)</td>
						<td>28&nbsp;km</td>
						<td
							><a href="https://link.springer.com/content/pdf/10.1007/s00376-022-2030-5.pdf"
								>Model</a
							></td
						>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://www.wdc-climate.de/ui/cmip6?input=CMIP6.HighResMIP.AS-RCEC.HiRAM-SIT-HR"
								>HiRAM_SIT_HR</a
							>
						</th>
						<td>Taiwan</td>
						<td
							>Research Center for Environmental Changes, Academia Sinica, Nankang, Taipei (AS-RCEC)</td
						>
						<td>25&nbsp;km</td>
						<td></td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://www.wdc-climate.de/ui/cmip6?input=CMIP6.HighResMIP.MRI.MRI-AGCM3-2-S.highresSST-present"
								>MRI_AGCM3_2_S</a
							>
						</th>
						<td>Japan</td>
						<td>Meteorological Research Institute, Tsukuba, Ibaraki (MRI) </td>
						<td>20&nbsp;km</td>
						<td></td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://www.wdc-climate.de/ui/cmip6?input=CMIP6.HighResMIP.EC-Earth-Consortium.EC-Earth3P-HR"
								>EC_Earth3P_HR</a
							>
						</th>
						<td>Europe</td>
						<td
							>EC-Earth consortium, Rossby Center, Swedish Meteorological and Hydrological
							Institute/SMHI, Norrkoping, Sweden</td
						>
						<td>29&nbsp;km</td>
						<td><a href="https://gmd.copernicus.org/articles/13/3507/2020/">Model</a></td>
					</tr>
					<tr>
						<th scope="row"
							><a
								href="https://www.wdc-climate.de/ui/cmip6?input=CMIP6.HighResMIP.MPI-M.MPI-ESM1-2-XR"
								>MPI_ESM1_2_XR</a
							>
						</th>
						<td>Germany</td>
						<td>Max Planck Institute for Meteorology, Hamburg 20146, Germany</td>
						<td>51&nbsp;km</td>
						<td><a href="https://gmd.copernicus.org/articles/12/3241/2019/">Model</a></td>
					</tr>
					<tr>
						<th scope="row"
							><a href="https://www.wdc-climate.de/ui/cmip6?input=CMIP6.HighResMIP.MIROC.NICAM16-8S"
								>NICAM16_8S</a
							>
						</th>
						<td>Japan</td>
						<td
							>Japan Agency for Marine-Earth Science and Technology, Kanagawa 236-0001, Japan
							(MIROC)</td
						>
						<td>31&nbsp;km</td>
						<td><a href="https://gmd.copernicus.org/articles/14/795/2021/">Model</a></td>
					</tr>
				</tbody>
			</table>
		</div>

		<p>
			Some weather variables may not be available in all climate models. Notably, soil moisture is
			only available in
			<mark>MRI-AGCM3-2-S</mark> and <mark>EC_Earth3P_HR</mark>. Additionally, some models may not
			provide certain aggregations, such as maximum relative humidity. However, mean relative
			humidity is generally available. The table below outlines the weather variables that are
			available in each model:
		</p>

		<div class="overflow-auto overflow-y-hidden -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1040px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<caption class="text-muted-foreground mt-2 table-caption text-left"
					>&#x26a0;&#xfe0f; = Only daily <mark>mean</mark> values available. No daily minima or maxima.</caption
				>
				<thead>
					<tr>
						<th scope="col" style="width: 22%">Model</th>
						<th scope="col" style="width: 13%">Temperature</th>
						<th scope="col" style="width: 13%">Relative<br />Humidity</th>
						<th scope="col" style="width: 13%">Wind</th>
						<th scope="col" style="width: 13%">Precipitation</th>
						<th scope="col" style="width: 13%">Snowfall,<br />Solar Radiation &<br />Clouds</th>
						<th scope="col" style="width: 13%">Soil moisture</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">CMCC-CM2-VHR4</th>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x274c;</td>
						<td>&#x274c;</td>
					</tr>
					<tr>
						<th scope="row">FGOALS-f3-H</th>
						<td>&#x2705;</td>
						<td>&#x26a0;&#xfe0f;</td>
						<td>&#x26a0;&#xfe0f;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x274c;</td>
					</tr>
					<tr>
						<th scope="row">HiRAM-SIT-HR</th>
						<td>&#x2705;</td>
						<td>&#x26a0;&#xfe0f;</td>
						<td>&#x26a0;&#xfe0f;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x274c;</td>
					</tr>
					<tr>
						<th scope="row">MRI-AGCM3-2-S</th>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
					</tr>
					<tr>
						<th scope="row">EC_Earth3P_HR</th>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
					</tr>
					<tr>
						<th scope="row">MPI_ESM1_2_XR</th>
						<td>&#x2705;</td>
						<td>&#x26a0;&#xfe0f;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x274c;</td>
					</tr>
					<tr>
						<th scope="row">NICAM16_8S</th>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x2705;</td>
						<td>&#x274c;</td>
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
	<div class="mt-2 md:mt-4">
		<p>
			The API endpoint <mark>/v1/climate</mark> allows users to retrieve climate weather data from multiple
			climate models. To use this endpoint, you can specify a geographical coordinate, a time interval,
			and a list of weather variables that they are interested in. It is recommended to use the full
			time range of 1950 to 2050.
		</p>
		<p>All URL parameters are listed below:</p>
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
						<th scope="row">latitude<br />longitude</th>
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
						<th scope="row">start_date<br />end_date</th>
						<td>String (yyyy-mm-dd)</td>
						<td>Yes</td>
						<td></td>
						<td
							>The time interval to get weather data. A day must be specified as an ISO8601 date
							(e.g.
							<mark>2022-12-31</mark>). Data is available from <mark>1950-01-01</mark> until
							<mark>2050-01-01</mark>.
						</td>
					</tr>
					<tr>
						<th scope="row">models</th>
						<td>String array</td>
						<td>Yes</td>
						<td></td>
						<td
							>A list of climate models separated by comma. 7 climate models are available <mark
								>CMCC_CM2_VHR4</mark
							>,
							<mark>FGOALS_f3_H</mark>, <mark>HiRAM_SIT_HR</mark> <mark>MRI_AGCM3_2_S</mark>,
							<mark>EC_Earth3P_HR</mark>, <mark>MPI_ESM1_2_XR</mark>, and <mark>NICAM16_8S</mark> are
							supported.</td
						>
					</tr>
					<tr>
						<th scope="row">daily</th>
						<td>String array</td>
						<td>Yes</td>
						<td></td>
						<td
							>A list of daily weather variable aggregations which should be returned. Values can be
							comma separated, or multiple <mark>&daily=</mark> parameter in the URL can be used.</td
						>
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
							epoch time in seconds. Please note that all time is then in GMT+0! For daily values
							with unix timestamp, please apply
							<mark>utc_offset_seconds</mark> again to get the correct date.
						</td>
					</tr>
					<tr>
						<th scope="row">disable_bias_correction</th>
						<td>Bool</td>
						<td>No</td>
						<td><mark>false</mark></td>
						<td
							>Setting <mark>disable_bias_correction</mark> to <mark>true</mark> disables statistical
							downscaling and bias correction onto ERA5-Land. By default, all data is corrected using
							linear bias correction, and coefficients have been calculated for each month over a 50-year
							time series. The climate change signal is not affected by linear bias correction.
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
							<a href="/en/pricing" title="Pricing information to use the weather API commercially"
								>pricing</a
							> for more information.</td
						>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<p class="text-muted-foreground mt-2">
		Additional optional URL parameters may be added. For API stability, no required parameters will
		be added in the future!
	</p>
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
			The climate data in this API is presented as daily aggregations. Multiple weather variables
			can be retrieved at once. The parameter <mark>&daily=</mark> accepts the following values as comma
			separated list:
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1240px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<thead>
					<tr>
						<th scope="col">Variable</th>
						<th scope="col">Unit</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">temperature_2m_max<br />temperature_2m_min<br />temperature_2m_mean</th>
						<td>°C (°F)</td>
						<td
							>Maximum, minimum and mean daily air temperature at 2 meters above ground.
							Additionally, temperature is downscaled using a 90-meter digital elevation model.
							Climate models are not perfect, and they have inherent uncertainties and biases that
							can affect the accuracy of their temperature predictions. However, the temperature
							anomaly over a long period of time is a good indicator the future Earth's climate. The
							following paper analyses the <a
								href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2020EF001667"
								>robustness of CMIP6 temperature predictions</a
							>.</td
						>
					</tr>
					<tr>
						<th scope="row">cloud_cover_mean</th>
						<td>%</td>
						<td
							>Mean cloud cover on a given day. Cloud cover in climate models is generally
							represented through simplified parameterizations that estimate the cloud amount,
							height, and thickness based on atmospheric conditions such as temperature, humidity,
							and wind speed. These parameterizations have been shown to provide reasonable
							estimates of global cloud cover but they can have significant uncertainties and biases
							on regional and local scales. Systematic biases have been corrected using the weather
							reanalysis ERA5.</td
						>
					</tr>
					<tr>
						<th scope="row"
							>relative_humidity_2m_max<br />relative_humidity_2m_min<br
							/>relative_humidity_2m_mean</th
						>
						<td>%</td>
						<td
							>Maximum, minimum and mean daily relative humidity at 2 meters above ground. While
							systematic biases in relative humidity have been removed through bias correction,
							caution should still be exercised when using relative humidity data as raw data shows
							larger differences between different climate models.</td
						>
					</tr>
					<tr>
						<th scope="row">soil_moisture_0_to_10cm_mean</th>
						<td>m³/m³</td>
						<td
							>Daily mean soil moisture fraction within 0-10 cm. Soil moisture data is only
							available by <mark>MRI_AGCM3_2_S</mark> and <mark>EC_Earth3P_HR</mark>. Due to the
							limited number of climate models that provide soil moisture data, it is not possible
							to make a general statement about their accuracy. As a result, it may be advisable to
							conduct your own water balance modeling.</td
						>
					</tr>
					<tr>
						<th scope="row">precipitation_sum</th>
						<td>mm</td>
						<td
							>Sum of daily precipitation (including rain, showers and snowfall). Climate models
							have been able to capture some of the large-scale patterns of precipitation and
							associated droughts and extreme precipitation events, particularly over longer time
							scales. However, there are still uncertainties associated with the representation of
							precipitation at smaller geographical scales including thunderstorm. Please compare
							different climate models for drought duration or extreme precipitation events. The
							following papers analyze <a
								href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2021EF002196"
								>extreme precipitation</a
							>
							and
							<a href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2021EF002150"
								>droughts in CMIP6 models</a
							>.</td
						>
					</tr>
					<tr>
						<th scope="row">rain_sum</th>
						<td>mm</td>
						<td>Sum of daily liquid rain, excluding snow.</td>
					</tr>
					<tr>
						<th scope="row">snowfall_sum</th>
						<td>cm</td>
						<td
							>Sum of daily snowfall. Please note that snowfall data may have larger biases in
							complex terrain, as it is not adjusted for different terrain elevations. Use this data
							with caution to estimate how mountainous regions will be effected by reduced snowfall.</td
						>
					</tr>
					<tr>
						<th scope="row">wind_speed_10m_mean<br />wind_speed_10m_max</th>
						<td>km/h (mph, m/s, knots)</td>
						<td
							>Mean and maximum wind speed 10 meter above ground on a day. Simulations of winds and
							pressure systems in climate models are greatly influenced by the resolution used to
							model the terrain. Without bias correction, wind speed can vary significantly between
							different climate models, particularly in complex terrain. Although, data is bias
							corrected with ERA5, it might not accurately represent local conditions.</td
						>
					</tr>
					<tr>
						<th scope="row">pressure_msl_mean</th>
						<td>hPa</td>
						<td>Daily mean air pressure reduced to mean sea level.</td>
					</tr>
					<tr>
						<th scope="row">shortwave_radiation_sum</th>
						<td>MJ/m²</td>
						<td
							>The sum of solar radiation on a given day in Megajoules. Shortwave radiation
							predictions are impacted by aerosols and clouds present in the atmosphere. The future
							composition of gases in the atmosphere is a key area of study in climate modeling. As
							there are uncertainties associated with aerosols and clouds, it is important to take
							these into account when using shortwave radiation data.</td
						>
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
			class="code-numbered overflow-auto bg-[#FAFAFA] rounded-lg dark:bg-[#212121] -mx-6 md:ml-0 lg:mx-0 mt-2 md:mt-4"
		>
			<ClimateObject />
		</div>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[940px] w-full caption-bottom text-left md:mt-4 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
				<thead>
					<tr>
						<th scope="col">Parameter</th>
						<th scope="col">Format</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">latitude, longitude</th>
						<td>Floating point</td>
						<td
							>WGS84 of the center of the weather grid-cell which was used to generate this
							forecast. This coordinate might be a few kilometers away from the requested
							coordinate.</td
						>
					</tr>
					<tr>
						<th scope="row">generationtime_ms</th>
						<td>Floating point</td>
						<td
							>Generation time of the weather forecast in milliseconds. This is mainly used for
							performance monitoring and improvements.</td
						>
					</tr>
					<tr>
						<th scope="row">utc_offset_seconds</th>
						<td>Integer</td>
						<td>Applied timezone offset from the <mark>&timezone=</mark> parameter.</td>
					</tr>
					<tr>
						<th scope="row">timezone<br />timezone_abbreviation</th>
						<td>String</td>
						<td
							>Timezone identifier (e.g. <mark>Europe/Berlin</mark>) and abbreviation (e.g.
							<mark>CEST</mark>)</td
						>
					</tr>
					<tr>
						<th scope="row">daily</th>
						<td>Object</td>
						<td
							>For each selected daily weather variable, data will be returned as a floating point
							array. Additionally a <mark>time</mark> array will be returned with ISO8601 timestamps.</td
						>
					</tr>
					<tr>
						<th scope="row">daily_units</th>
						<td>Object</td>
						<td>For each selected daily weather variable, the unit will be listed here.</td>
					</tr>
				</tbody>
			</table>
		</div>
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
			class="mt-2 md:mt-4 bg-[#FAFAFA] rounded-lg dark:bg-[#212121] overflow-auto -mx-6 md:ml-0 lg:mx-0"
		>
			<ClimateError />
		</div>
	</div>
</div>

<!-- CITATION -->
<div class="mt-6 md:mt-12">
	<a href="#citation"
		><h2 id="citation" class="text-2xl md:text-3xl">Citation & Acknowledgement</h2></a
	>
	<div class="mt-3 md:mt-6">
		<p>
			CMIP6 model data is licensed under a Creative Commons Attribution 4.0 International License (<a
				href="https://creativecommons.org/licenses/">CC BY 4.0</a
			>). Consult
			<a href="https://pcmdi.llnl.gov/CMIP6/TermsOfUse">https://pcmdi.llnl.gov/CMIP6/TermsOfUse</a> for
			terms of use governing CMIP6 output, including citation requirements and proper acknowledgment.
			The data producers and data providers make no warranty, either express or implied, including, but
			not limited to, warranties of merchantability and fitness for a particular purpose. All liabilities
			arising from the supply of the information (including any liability arising in negligence) are
			excluded to the fullest extent permitted by law.
		</p>

		<p>
			All users of Open-Meteo data must provide a clear attribution to the CMIP6 program as well as
			a reference to Open-Meteo.
		</p>
	</div>
</div>

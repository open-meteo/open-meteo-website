<script lang="ts">
	import LicenseSelector from '$lib/components/license/license-selector.svelte';
	import { api_key_preferences } from '$lib/stores/settings';

	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';

	async function fetchMeta(model: String, type: String, api_key_preferences: any) {
		let serverPrefix = type == 'forecast' ? 'api' : `${type}-api`;
		let url: string;

		switch (api_key_preferences.use) {
			case 'commercial':
				url = `https://customer-${serverPrefix}.open-meteo.com/data/${model}/static/meta.json`;
				break;
			case 'self_hosted':
				url = `${api_key_preferences.self_host_server}/data/${model}/static/meta.json`;
				break;
			default:
				url = `https://${serverPrefix}.open-meteo.com/data/${model}/static/meta.json`;
				break;
		}

		const result = await fetch(url);
		if (!result.ok) {
			throw new Error(await result.text());
		}
		const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
		const utcYYYYMMDD = (date: Date) =>
			`${date.getUTCFullYear()}-${zeroPad(date.getUTCMonth() + 1, 2)}-${zeroPad(date.getUTCDate(), 2)}`;

		const json = await result.json();
		const init = new Date(json.last_run_initialisation_time * 1000);
		const now = Date.now() / 1000;

		const initFormated = `${utcYYYYMMDD(init)} ${zeroPad(init.getUTCHours(), 2)}z`;

		const avail = new Date(json.last_run_availability_time * 1000);
		const availHHMM = `${zeroPad(avail.getUTCHours(), 2)}:${zeroPad(avail.getUTCMinutes(), 2)}z`;
		const availYYYMMDD = `${utcYYYYMMDD(avail)}`;
		const availFormated =
			now - json.last_run_availability_time < 18 * 3600
				? `${availHHMM}`
				: `${availYYYMMDD} ${availHHMM}`;
		const isReallyLate =
			json.last_run_availability_time + 2 * json.update_interval_seconds + 20 * 60 < now;
		const isLate =
			!isReallyLate &&
			json.last_run_availability_time + json.update_interval_seconds + 20 * 60 < now;

		return {
			url: url,
			data_end_time: json.data_end_time,
			last_run_availability_time: availFormated,
			last_run_initialisation_time: initFormated,
			last_run_modification_time: json.last_run_modification_time,
			temporal_resolution_seconds: json.temporal_resolution_seconds,
			update_interval_seconds: json.update_interval_seconds,
			area: json.area,
			is_late: isLate,
			is_really_late: isReallyLate
		};
	}

	function getData(api_key_preferences: any) {
		let forecastModels = [
			{
				provider: 'ItaliaMeteo ARPAE',
				url: '/en/docs/italia-meteo-arpae-api',
				models: [
					{
						name: 'ICON 2I',
						area: ['it'],
						meta: fetchMeta('italia_meteo_arpae_icon_2i', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'BOM',
				url: '/en/docs/bom-api',
				models: [
					{
						name: 'ACCESS-G 0.15°',
						area: [],
						meta: fetchMeta('bom_access_global', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'CMA',
				url: '/en/docs/cma-api',
				models: [
					{
						name: 'GFS Grapes 0.125°',
						area: [],
						meta: fetchMeta('cma_grapes_global', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'Canadian Weather Service',
				url: '/en/docs/gem-api',
				models: [
					{
						name: 'GDPS 0.125°',
						area: [],
						meta: fetchMeta('cmc_gem_gdps', 'forecast', api_key_preferences)
					},
					{
						name: 'RDPS',
						area: ['ca', 'us'],
						meta: fetchMeta('cmc_gem_rdps', 'forecast', api_key_preferences)
					},
					{
						name: 'HRDPS',
						area: ['ca'],
						meta: fetchMeta('cmc_gem_hrdps', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'DMI',
				url: '/en/docs/dmi-api',
				models: [
					{
						name: 'Harmonie AROME Europe',
						area: ['european_union'],
						meta: fetchMeta('dmi_harmonie_arome_europe', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'DWD',
				url: '/en/docs/dwd-api',
				models: [
					{
						name: 'ICON',
						area: [],
						meta: fetchMeta('dwd_icon', 'forecast', api_key_preferences)
					},
					{
						name: 'ICON-EU',
						area: ['european_union'],
						meta: fetchMeta('dwd_icon_eu', 'forecast', api_key_preferences)
					},
					{
						name: 'ICON-D2',
						area: ['de', 'ch', 'at'],
						meta: fetchMeta('dwd_icon_d2', 'forecast', api_key_preferences)
					},
					{
						name: 'ICON-D2 15min',
						area: ['de', 'ch', 'at'],
						meta: fetchMeta('dwd_icon_d2_15min', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'ECMWF',
				url: '/en/docs/ecmwf-api',
				models: [
					{
						name: 'AIFS 0.25° Single',
						area: [],
						meta: fetchMeta('ecmwf_aifs025_single', 'forecast', api_key_preferences)
					},
					{
						name: 'IFS 0.25°',
						area: [],
						meta: fetchMeta('ecmwf_ifs025', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'JMA',
				url: '/en/docs/jma-api',
				models: [
					{
						name: 'GSM 0.5°',
						area: [],
						meta: fetchMeta('jma_gsm', 'forecast', api_key_preferences)
					},
					{
						name: 'MSM 0.05°',
						area: ['jp'],
						meta: fetchMeta('jma_msm', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'KMA Korea',
				url: '/en/docs/kma-api',
				models: [
					{
						name: 'KMA GDPS 0.13°',
						area: [],
						meta: fetchMeta('kma_gdps', 'forecast', api_key_preferences)
					},
					{
						name: 'KMA LDPS 1.5km',
						area: ['kr'],
						meta: fetchMeta('kma_ldps', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'KNMI',
				url: '/en/docs/knmi-api',
				models: [
					{
						name: 'Harmonie AROME Europe',
						area: ['european_union'],
						meta: fetchMeta('knmi_harmonie_arome_europe', 'forecast', api_key_preferences)
					},
					{
						name: 'Harmonie AROME Netherlands',
						area: ['nl', 'be'],
						meta: fetchMeta('knmi_harmonie_arome_netherlands', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'Météo-France',
				url: '/en/docs/meteofrance-api',
				models: [
					{
						name: 'ARPEGE World 0.25°',
						area: [],
						meta: fetchMeta('meteofrance_arpege_world025', 'forecast', api_key_preferences)
					},
					{
						name: 'ARPEGE Europe 0.1°',
						area: ['european_union'],
						meta: fetchMeta('meteofrance_arpege_europe', 'forecast', api_key_preferences)
					},
					{
						name: 'ARPEGE Europe 0.1° Probabilities',
						area: ['european_union'],
						meta: fetchMeta(
							'meteofrance_arpege_europe_probabilities',
							'forecast',
							api_key_preferences
						)
					},
					{
						name: 'AROME France 0.01 HD°',
						area: ['fr'],
						meta: fetchMeta('meteofrance_arome_france_hd', 'forecast', api_key_preferences)
					},
					{
						name: 'AROME France 0.01 HD 15min',
						area: ['fr'],
						meta: fetchMeta('meteofrance_arome_france_hd_15min', 'forecast', api_key_preferences)
					},
					{
						name: 'AROME France 0.025°',
						area: ['fr'],
						meta: fetchMeta('meteofrance_arome_france0025', 'forecast', api_key_preferences)
					},
					{
						name: 'AROME France 0.025° 15min',
						area: ['fr'],
						meta: fetchMeta('meteofrance_arome_france0025_15min', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'MET Norway',
				url: '/en/docs/metno-api',
				models: [
					{
						name: 'MET Nordic PP',
						area: ['no', 'se', 'dk'],
						meta: fetchMeta('metno_nordic_pp', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'NOAA NCEP',
				url: '/en/docs/gfs-api',
				models: [
					{
						name: 'GFS 0.11°',
						area: [],
						meta: fetchMeta('ncep_gfs013', 'forecast', api_key_preferences)
					},
					{
						name: 'GFS 0.25°',
						area: [],
						meta: fetchMeta('ncep_gfs025', 'forecast', api_key_preferences)
					},
					{
						name: 'GFS GraphCast 0.25°',
						area: [],
						meta: fetchMeta('ncep_gfs_graphcast025', 'forecast', api_key_preferences)
					},
					{
						name: 'NBM Conus',
						area: ['us', 'ca'],
						meta: fetchMeta('ncep_nbm_conus', 'forecast', api_key_preferences)
					},
					{
						name: 'HRRR Conus',
						area: ['us', 'ca'],
						meta: fetchMeta('ncep_hrrr_conus', 'forecast', api_key_preferences)
					},
					{
						name: 'HRRR Conus 15min',
						area: ['us', 'ca'],
						meta: fetchMeta('ncep_hrrr_conus_15min', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'UK Met Office',
				url: '/en/docs/ukmo-api',
				models: [
					{
						name: 'UKMO Global Deterministic 0.09°',
						area: [],
						meta: fetchMeta('ukmo_global_deterministic_10km', 'forecast', api_key_preferences)
					},
					{
						name: 'UKMO UKV',
						area: ['gb'],
						meta: fetchMeta('ukmo_uk_deterministic_2km', 'forecast', api_key_preferences)
					}
				]
			}
		];

		let historicalModels = [
			{
				provider: 'Copernicus',
				url: '/en/docs/historical-weather-api',
				models: [
					{
						name: 'ERA5 0.25°',
						area: [],
						meta: fetchMeta('copernicus_era5', 'archive', api_key_preferences)
					},
					{
						name: 'ERA5-Land 0.1°',
						area: [],
						meta: fetchMeta('copernicus_era5_land', 'archive', api_key_preferences)
					},
					{
						name: 'ERA5-Ensemble 0.25°',
						area: [],
						meta: fetchMeta('copernicus_era5_ensemble', 'archive', api_key_preferences)
					}
				]
			},
			{
				provider: 'ECMWF',
				url: '/en/docs/historical-weather-api',
				models: [
					{
						name: 'IFS HRES 9km',
						area: [],
						meta: fetchMeta('ecmwf_ifs', 'archive', api_key_preferences)
					},
					{
						name: 'IFS Analysis Long-Window 4D',
						area: [],
						meta: fetchMeta('ecmwf_ifs_analysis_long_window', 'archive', api_key_preferences)
					}
				]
			}
		];

		let ensembleModels = [
			{
				provider: 'BOM',
				url: '/en/docs/bom-api',
				models: [
					{
						name: 'ACCESS-GE 0.4°',
						area: [],
						meta: fetchMeta('bom_access_global_ensemble', 'ensemble', api_key_preferences)
					}
				]
			},
			{
				provider: 'Canadian Weather Service',
				url: '/en/docs/gem-api',
				models: [
					{
						name: 'GDPS 0.25° Ensemble',
						area: [],
						meta: fetchMeta('cmc_gem_geps', 'ensemble', api_key_preferences)
					}
				]
			},
			{
				provider: 'DWD',
				url: '/en/docs/dwd-api',
				models: [
					{
						name: 'ICON-EPS',
						area: [],
						meta: fetchMeta('dwd_icon_eps', 'ensemble', api_key_preferences)
					},
					{
						name: 'ICON-EU-EPS',
						area: ['european_union'],
						meta: fetchMeta('dwd_icon_eu_eps', 'ensemble', api_key_preferences)
					},
					{
						name: 'ICON-D2-EPS',
						area: ['de', 'ch', 'at'],
						meta: fetchMeta('dwd_icon_d2_eps', 'ensemble', api_key_preferences)
					}
				]
			},
			{
				provider: 'ECMWF',
				url: '/en/docs/ecmwf-api',
				models: [
					{
						name: 'IFS 0.25° Ensemble',
						area: [],
						meta: fetchMeta('ecmwf_ifs025_ensemble', 'ensemble', api_key_preferences)
					}
				]
			},
			{
				provider: 'NOAA NCEP',
				url: '/en/docs/gfs-api',
				models: [
					{
						name: 'GFS 0.25 Ensemble',
						area: [],
						meta: fetchMeta('ncep_gefs025', 'ensemble', api_key_preferences)
					},
					{
						name: 'GFS 0.5° Ensemble',
						area: [],
						meta: fetchMeta('ncep_gefs05', 'ensemble', api_key_preferences)
					}
				]
			}
		];

		let airQualityModels = [
			{
				provider: 'CAMS',
				url: '/en/docs/air-quality-api',
				models: [
					{
						name: 'CAMS GLOBAL 0.4°',
						area: [],
						meta: fetchMeta('cams_global', 'air-quality', api_key_preferences)
					},
					{
						name: 'CAMS Europe 0.1°',
						area: ['european_union'],
						meta: fetchMeta('cams_europe', 'air-quality', api_key_preferences)
					},
					{
						name: 'CAMS Global Greenhouse Gases 0.1°',
						area: ['european_union'],
						meta: fetchMeta('cams_global_greenhouse_gases', 'air-quality', api_key_preferences)
					}
				]
			}
		];

		let marineModels = [
			{
				provider: 'Météo-France',
				url: '/en/docs/marine-weather-api',
				models: [
					{
						name: 'MFWAM 0.08°',
						area: [],
						meta: fetchMeta('meteofrance_wave', 'marine', api_key_preferences)
					},
					{
						name: 'SMOC Currents 0.08°',
						area: [],
						meta: fetchMeta('meteofrance_currents', 'marine', api_key_preferences)
					}
				]
			},
			{
				provider: 'ECMWF',
				url: '/en/docs/marine-weather-api',
				models: [
					{
						name: 'WAM 0.25°',
						area: [],
						meta: fetchMeta('ecmwf_wam025', 'marine', api_key_preferences)
					}
				]
			},
			{
				provider: 'NOAA NCEP',
				url: '/en/docs/marine-weather-api',
				models: [
					{
						name: 'GFS Wave 0.25°',
						area: [],
						meta: fetchMeta('ncep_gfswave025', 'marine', api_key_preferences)
					},
					{
						name: 'GFS Wave 0.16',
						area: [],
						meta: fetchMeta('ncep_gfswave016', 'marine', api_key_preferences)
					}
				]
			},
			/*{
				provider: 'DWD',
				url: '/en/docs/marine-weather-api',
				models: [
					{
						name: 'GWAM',
						meta: fetchMeta('dwd_gwam', 'marine', api_key_preferences)
					},
					{
						name: 'EWAM',
						meta: fetchMeta('dwd_ewam', 'marine', api_key_preferences)
					}
				]
			},*/

			{
				provider: 'Copernicus',
				url: '/en/docs/marine-weather-api',
				models: [
					{
						name: 'ERA5-Ocean',
						area: [],
						meta: fetchMeta('copernicus_era5_ocean', 'marine', api_key_preferences)
					}
				]
			}
		];

		/*let floodModels = [
			{
				provider: 'GloFAS',
				url: '/en/docs/flood-api',
				models: [
					{
						name: 'GloFAS v4 Forecast',
						meta: fetchMeta('glofas_seasonal_v4', 'flood', api_key_preferences)
					},
					{
						name: 'GloFAS v4 Seasonal Forecast',
						meta: fetchMeta('glofas_forecast_v4', 'flood', api_key_preferences)
					}
				]
			}
		];*/

		return [
			{ name: 'Forecast API', providers: forecastModels },
			{ name: 'Historical Weather API', providers: historicalModels },
			{ name: 'Ensemble API', providers: ensembleModels },
			{ name: 'Air Quality API', providers: airQualityModels },
			{ name: 'Marine API', providers: marineModels }
			//{ name: 'Flood API', providers: floodModels },
		];
	}

	let showGlobalModels = $state(true);
	let showEuropeanModels = $state(true);
	let showNorthAmericanModels = $state(true);
	let showAsianModels = $state(true);

	let sectionsAll = $derived(getData($api_key_preferences));
	let sections = $derived(
		sectionsAll.map((e) => {
			return {
				name: e.name,
				providers: e.providers.map((e) => {
					return {
						url: e.url,
						provider: e.provider,
						models: e.models.filter((e) => {
							let isNorthAmerica = e.area.includes('ca') || e.area.includes('us');
							let isGlobal = e.area.length == 0;
							let isAsian = e.area.includes('jp') || e.area.includes('kr');
							let isEuropean = !isGlobal && !isNorthAmerica && !isAsian;
							return (
								(showGlobalModels && isGlobal) ||
								(showNorthAmericanModels && isNorthAmerica) ||
								(showEuropeanModels && isEuropean) ||
								(showAsianModels && isAsian)
							);
						})
					};
				})
			};
		})
	);
</script>

<svelte:head>
	<title>API Production Status | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/status" />
</svelte:head>

<div>
	<h2 id="model_updates" class="text-2xl md:text-3xl">Model Updates</h2>

	<div class="mt-2 grid grid-cols-1 gap-3 md:mt-4 md:grid-cols-2 lg:gap-x-6">
		<p>
			This page offers a brief overview of all models integrated into Open-Meteo. These models are
			typically updated every few hours. Open-Meteo aims to download and process the data as soon as
			it becomes available, immediately after it is released by national weather services.
		</p>

		<p>
			Open-Meteo operates with geographically distributed and redundant servers. Data across all
			Open-Meteo servers is <a
				title="Wikipedia: Eventual consistency"
				href="https://en.wikipedia.org/wiki/Eventual_consistency">eventually consistent</a
			>, meaning there may be instances where the API indicates a weather model has been updated,
			but not all servers have been fully updated yet. If you need access to the most recent
			forecast, it's recommended to wait an additional 10 minutes after the forecast update has been
			applied.
		</p>

		<p>
			Models with a delay exceeding 20 minutes are highlighted in yellow. If multiple weather model
			updates are missed, the model is marked in red. Minor delays are fairly common.
		</p>

		<p>
			To report a model issue, please open a ticket on <a
				title="GitHub Open-Meteo Repository"
				href="https://github.com/open-meteo/open-meteo/issues">GitHub</a
			>. Commercial clients can contact us directly via email.
		</p>
	</div>

	<div class="mt-3">
		<p>
			The free and commercial API services of Open-Meteo operate on different servers, leading to
			slight variations in update times. Please choose the appropriate type below. Note that API
			calls to the metadata API are not counted toward daily or monthly request limits.
		</p>
		<div class="mt-6">
			<LicenseSelector />
		</div>
	</div>

	<div class="mt-6">
		<div class="flex items-center gap-2">
			<Switch id="global_models" name="globalWeatherModels" bind:checked={showGlobalModels} />
			<Label for="global_models" class="mb-[2px] cursor-pointer text-lg"
				>Global Weather Models</Label
			>
		</div>
		<div class="flex items-center gap-2">
			<Switch id="european_models" name="europeanModels" bind:checked={showEuropeanModels} />
			<Label for="european_models" class="mb-[2px]  cursor-pointer text-lg"
				>Local European Models</Label
			>
			<img
				height="26"
				width="26"
				src="/images/country-flags/european_union.svg"
				alt="european_union"
			/>
		</div>
		<div class="flex items-center gap-2">
			<Switch
				id="north_american_models"
				name="northAmericanModel"
				bind:checked={showNorthAmericanModels}
			/>
			<Label for="north_american_models" class="mb-[2px] cursor-pointer text-lg"
				>Local North American Models</Label
			>
			<img height="26" width="26" src="/images/country-flags/us.svg" alt="us" />
			<img height="26" width="26" src="/images/country-flags/ca.svg" alt="ca" />
		</div>
		<div class="flex items-center gap-2">
			<Switch id="asian_models" name="asianModels" bind:checked={showAsianModels} />
			<Label for="asian_models" class="mb-[2px] cursor-pointer text-lg">Local Asian Models</Label>
			<img height="26" width="26" src="/images/country-flags/jp.svg" alt="jp" />
		</div>
	</div>
	{#each sections as section}
		<div class="mt-6">
			<h2 class="text-2xl md:text-3xl">{section.name}</h2>

			<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
				<table
					class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1140px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
				>
					<thead>
						<tr>
							<th scope="col">Provider</th>
							<th scope="col">Weather Model</th>
							<th>Area</th>
							<th scope="col">Last Model Run</th>
							<th scope="col">Update Available</th>
							<th scope="col">Temporal Resolution</th>
							<th scope="col">Update frequency</th>
							<th scope="col">API</th>
						</tr>
					</thead>
					<tbody>
						{#each section.providers as provider}
							{#each provider.models as model, index}
								<tr>
									{#if index == 0}
										<td rowspan={provider.models.length}>{provider.provider}</td>
									{/if}
									<td>{model.name}</td>
									<td>
										{#each model.area as area}
											<img
												height="26"
												width="26"
												src="/images/country-flags/{area}.svg"
												alt={area}
												title={area}
											/>
										{/each}
									</td>
									{#await model.meta}
										<td colspan="6">Loading</td>
									{:then meta}
										<td
											class="{meta.is_late ? 'bg-amber-200/75' : ''} {meta.is_really_late
												? 'bg-red-400/75'
												: ''}">{meta.last_run_initialisation_time}</td
										>
										<td
											class="{meta.is_late ? 'bg-amber-200/75' : ''} {meta.is_really_late
												? 'bg-red-400/75'
												: ''}">{meta.last_run_availability_time}</td
										>
										<td>{meta.temporal_resolution_seconds / 3600} hourly</td>
										<td>Every {meta.update_interval_seconds / 3600} h</td>
										<td><a href={meta.url} class="text-link underline" target="_blank">Link</a></td>
									{:catch error}
										<td colspan="5" class="bg-red">{error}</td>
									{/await}
								</tr>
							{/each}
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/each}
	<div class="mt-6 md:mt-12">
		<h2 class="text-2xl md:text-3xl">Metadata API Documentation</h2>
		<div class="mt-2 md:mt-4">
			<p>
				You can retrieve the update times for each individual model via the API. However, these
				times do not directly correlate with the update times in the Forecast API, as Open-Meteo
				automatically selects the most appropriate weather model for each location (referred to as
				"Best Match"). The table above provides an API link for each model, returning a JSON object
				with the following fields:
			</p>
			<ul class="ml-6 list-disc">
				<li>
					<strong>last_run_initialisation_time:</strong> The model's initialization time or reference
					time represented as a Unix timestamp (e.g., 1724796000 for Tue Aug 27, 2024, 22:00:00 GMT+0000).
				</li>
				<li>
					<strong>last_run_modification_time:</strong> The time when the data download and conversion
					were completed, which does not indicate when the data became available on the API.
				</li>
				<li>
					<strong>last_run_availability_time:</strong> The time when the data is actually accessible
					on the API server. Important: Open-Meteo utilizes multiple redundant API servers, so there
					may be slight differences between them while the data is being copied. To ensure all API calls
					use the most recent data, please wait 10 minutes after the availability time.
				</li>
				<li>
					<strong>temporal_resolution_seconds:</strong> The temporal resolution of the model in seconds.
					By default, the API interpolates the data to a 1-hour resolution. However, the underlying model
					may only provide data in 3 or 6-hourly steps. A value of 3600 indicates that the data is 1-hourly.
				</li>
				<li>
					<strong>update_interval_seconds:</strong> The typical time interval between model updates,
					such as 3600 seconds for a model that updates every hour.
				</li>
			</ul>
			<p class="mt-2">
				Additional attributes, such as spatial resolution, area, grid systems, and more, will be
				added in the future.
			</p>
		</div>
	</div>
</div>

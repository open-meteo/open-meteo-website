<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';

	import { apiKeyPreferences } from '$lib/stores/settings';

	import { pad } from '$lib/utils';

	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';

	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';

	import type { APIKeyPreferences } from '$lib/docs';

	async function fetchMeta(model: string, type: string, apiKeyPreferences: APIKeyPreferences) {
		const now = new Date();
		let serverPrefix = type == 'forecast' ? 'api' : `${type}-api`;
		let url: string;

		switch (apiKeyPreferences.use) {
			case 'commercial':
				url = `https://customer-${serverPrefix}.open-meteo.com/data/${model}/static/meta.json`;
				break;
			case 'self_hosted':
				url = `${apiKeyPreferences.self_host_server}/data/${model}/static/meta.json`;
				break;
			default:
				url = `https://${serverPrefix}.open-meteo.com/data/${model}/static/meta.json`;
				break;
		}

		const result = await fetch(`${url}?cache_buster=${now.getTime()}`);
		if (!result.ok) {
			throw new Error(await result.text());
		}
		const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
		const utcYYYYMMDD = (date: Date) =>
			`${date.getUTCFullYear()}-${zeroPad(date.getUTCMonth() + 1, 2)}-${zeroPad(date.getUTCDate(), 2)}`;

		const json = await result.json();
		const init = new Date(json.last_run_initialisation_time * 1000);

		const initFormated = `${utcYYYYMMDD(init)} ${zeroPad(init.getUTCHours(), 2)}Z`;

		const avail = new Date(json.last_run_availability_time * 1000);
		const availHHMM = `${zeroPad(avail.getUTCHours(), 2)}:${zeroPad(avail.getUTCMinutes(), 2)}Z`;
		const availYYYMMDD = `${utcYYYYMMDD(avail)}`;
		const availFormated =
			now.getTime() / 1000 - json.last_run_availability_time < 18 * 3600
				? `${availHHMM}`
				: `${availYYYMMDD} ${availHHMM}`;
		const isReallyLate =
			json.last_run_availability_time + 2 * json.update_interval_seconds + 20 * 60 <
			now.getTime() / 1000;
		const isLate =
			!isReallyLate &&
			json.last_run_availability_time + json.update_interval_seconds + 20 * 60 <
				now.getTime() / 1000;

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

	function getData(apiKeyPreferences: APIKeyPreferences) {
		let forecastModels = [
			{
				provider: 'ItaliaMeteo ARPAE',
				url: '/en/docs/italia-meteo-arpae-api',
				models: [
					{
						name: 'ICON 2I',
						area: ['it'],
						meta: fetchMeta('italia_meteo_arpae_icon_2i', 'forecast', apiKeyPreferences)
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
						meta: fetchMeta('bom_access_global', 'forecast', apiKeyPreferences)
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
						meta: fetchMeta('cma_grapes_global', 'forecast', apiKeyPreferences)
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
						meta: fetchMeta('cmc_gem_gdps', 'forecast', apiKeyPreferences)
					},
					{
						name: 'RDPS',
						area: ['ca', 'us'],
						meta: fetchMeta('cmc_gem_rdps', 'forecast', apiKeyPreferences)
					},
					{
						name: 'HRDPS',
						area: ['ca'],
						meta: fetchMeta('cmc_gem_hrdps', 'forecast', apiKeyPreferences)
					},
					{
						name: 'HRDPS West',
						area: ['ca'],
						meta: fetchMeta('cmc_gem_hrdps_west', 'forecast', apiKeyPreferences)
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
						meta: fetchMeta('dmi_harmonie_arome_europe', 'forecast', apiKeyPreferences)
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
						meta: fetchMeta('dwd_icon', 'forecast', apiKeyPreferences)
					},
					{
						name: 'ICON-EU',
						area: ['european_union'],
						meta: fetchMeta('dwd_icon_eu', 'forecast', apiKeyPreferences)
					},
					{
						name: 'ICON-D2',
						area: ['de', 'ch', 'at'],
						meta: fetchMeta('dwd_icon_d2', 'forecast', apiKeyPreferences)
					},
					{
						name: 'ICON-D2 15min',
						area: ['de', 'ch', 'at'],
						meta: fetchMeta('dwd_icon_d2_15min', 'forecast', apiKeyPreferences)
					}
				]
			},
			{
				provider: 'ECMWF',
				url: '/en/docs/ecmwf-api',
				models: [
					{
						name: 'IFS HRES 9km',
						area: [],
						meta: fetchMeta('ecmwf_ifs', 'forecast', apiKeyPreferences)
					},
					{
						name: 'AIFS 0.25° Single',
						area: [],
						meta: fetchMeta('ecmwf_aifs025_single', 'forecast', apiKeyPreferences)
					},
					{
						name: 'IFS 0.25°',
						area: [],
						meta: fetchMeta('ecmwf_ifs025', 'forecast', apiKeyPreferences)
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
						meta: fetchMeta('jma_gsm', 'forecast', apiKeyPreferences)
					},
					{
						name: 'MSM 0.05°',
						area: ['jp'],
						meta: fetchMeta('jma_msm', 'forecast', apiKeyPreferences)
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
						meta: fetchMeta('kma_gdps', 'forecast', apiKeyPreferences)
					},
					{
						name: 'KMA LDPS 1.5km',
						area: ['kr'],
						meta: fetchMeta('kma_ldps', 'forecast', apiKeyPreferences)
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
						meta: fetchMeta('knmi_harmonie_arome_europe', 'forecast', apiKeyPreferences)
					},
					{
						name: 'Harmonie AROME Netherlands',
						area: ['nl', 'be'],
						meta: fetchMeta('knmi_harmonie_arome_netherlands', 'forecast', apiKeyPreferences)
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
						meta: fetchMeta('meteofrance_arpege_world025', 'forecast', apiKeyPreferences)
					},
					{
						name: 'ARPEGE Europe 0.1°',
						area: ['european_union'],
						meta: fetchMeta('meteofrance_arpege_europe', 'forecast', apiKeyPreferences)
					},
					{
						name: 'ARPEGE Europe 0.1° Probabilities',
						area: ['european_union'],
						meta: fetchMeta(
							'meteofrance_arpege_europe_probabilities',
							'forecast',
							apiKeyPreferences
						)
					},
					{
						name: 'AROME France 0.01 HD°',
						area: ['fr'],
						meta: fetchMeta('meteofrance_arome_france_hd', 'forecast', apiKeyPreferences)
					},
					{
						name: 'AROME France 0.01 HD 15min',
						area: ['fr'],
						meta: fetchMeta('meteofrance_arome_france_hd_15min', 'forecast', apiKeyPreferences)
					},
					{
						name: 'AROME France 0.025°',
						area: ['fr'],
						meta: fetchMeta('meteofrance_arome_france0025', 'forecast', apiKeyPreferences)
					},
					{
						name: 'AROME France 0.025° 15min',
						area: ['fr'],
						meta: fetchMeta('meteofrance_arome_france0025_15min', 'forecast', apiKeyPreferences)
					}
				]
			},
			{
				provider: 'MeteoSwiss',
				url: '/en/docs/meteoswiss-api',
				models: [
					{
						name: 'ICON CH1',
						area: ['ch'],
						meta: fetchMeta('meteoswiss_icon_ch1', 'forecast', apiKeyPreferences)
					},
					{
						name: 'ICON CH2',
						area: ['ch'],
						meta: fetchMeta('meteoswiss_icon_ch2', 'forecast', apiKeyPreferences)
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
						meta: fetchMeta('metno_nordic_pp', 'forecast', apiKeyPreferences)
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
						meta: fetchMeta('ncep_gfs013', 'forecast', apiKeyPreferences)
					},
					{
						name: 'GFS 0.25°',
						area: [],
						meta: fetchMeta('ncep_gfs025', 'forecast', apiKeyPreferences)
					},
					{
						name: 'GFS GraphCast 0.25°',
						area: [],
						meta: fetchMeta('ncep_gfs_graphcast025', 'forecast', apiKeyPreferences)
					},
					{
						name: 'NBM Conus',
						area: ['us', 'ca'],
						meta: fetchMeta('ncep_nbm_conus', 'forecast', apiKeyPreferences)
					},
					{
						name: 'HRRR Conus',
						area: ['us', 'ca'],
						meta: fetchMeta('ncep_hrrr_conus', 'forecast', apiKeyPreferences)
					},
					{
						name: 'HRRR Conus 15min',
						area: ['us', 'ca'],
						meta: fetchMeta('ncep_hrrr_conus_15min', 'forecast', apiKeyPreferences)
					},
					{
						name: 'NAM Conus',
						area: ['us', 'ca'],
						meta: fetchMeta('ncep_nam_conus', 'forecast', apiKeyPreferences)
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
						meta: fetchMeta('ukmo_global_deterministic_10km', 'forecast', apiKeyPreferences)
					},
					{
						name: 'UKMO UKV',
						area: ['gb'],
						meta: fetchMeta('ukmo_uk_deterministic_2km', 'forecast', apiKeyPreferences)
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
						meta: fetchMeta('copernicus_era5', 'archive', apiKeyPreferences)
					},
					{
						name: 'ERA5-Land 0.1°',
						area: [],
						meta: fetchMeta('copernicus_era5_land', 'archive', apiKeyPreferences)
					},
					{
						name: 'ERA5-Ensemble 0.25°',
						area: [],
						meta: fetchMeta('copernicus_era5_ensemble', 'archive', apiKeyPreferences)
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
						meta: fetchMeta('ecmwf_ifs', 'archive', apiKeyPreferences)
					},
					{
						name: 'IFS Analysis Long-Window 4D',
						area: [],
						meta: fetchMeta('ecmwf_ifs_analysis_long_window', 'archive', apiKeyPreferences)
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
						meta: fetchMeta('bom_access_global_ensemble', 'ensemble', apiKeyPreferences)
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
						meta: fetchMeta('cmc_gem_geps', 'ensemble', apiKeyPreferences)
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
						meta: fetchMeta('dwd_icon_eps', 'ensemble', apiKeyPreferences)
					},
					{
						name: 'ICON-EU-EPS',
						area: ['european_union'],
						meta: fetchMeta('dwd_icon_eu_eps', 'ensemble', apiKeyPreferences)
					},
					{
						name: 'ICON-D2-EPS',
						area: ['de', 'ch', 'at'],
						meta: fetchMeta('dwd_icon_d2_eps', 'ensemble', apiKeyPreferences)
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
						meta: fetchMeta('ecmwf_ifs025_ensemble', 'ensemble', apiKeyPreferences)
					},
					{
						name: 'AIFS 0.25° Ensemble',
						area: [],
						meta: fetchMeta('ecmwf_aifs025_ensemble', 'ensemble', apiKeyPreferences)
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
						meta: fetchMeta('ncep_gefs025', 'ensemble', apiKeyPreferences)
					},
					{
						name: 'GFS 0.5° Ensemble',
						area: [],
						meta: fetchMeta('ncep_gefs05', 'ensemble', apiKeyPreferences)
					}
				]
			},
			{
				provider: 'MeteoSwiss',
				url: '/en/docs/meteoswiss-api',
				models: [
					{
						name: 'ICON CH1',
						area: ['ch'],
						meta: fetchMeta('meteoswiss_icon_ch1_ensemble', 'ensemble', apiKeyPreferences)
					},
					{
						name: 'ICON CH2',
						area: ['ch'],
						meta: fetchMeta('meteoswiss_icon_ch2_ensemble', 'ensemble', apiKeyPreferences)
					}
				]
			},
			{
				provider: 'UK Met Office',
				url: '/en/docs/ukmo-api',
				models: [
					{
						name: 'UKMO UK Ensemble 2 km',
						area: ['gb'],
						meta: fetchMeta('ukmo_uk_ensemble_2km', 'ensemble', apiKeyPreferences)
					},
					{
						name: 'UKMO Global Ensemble 20 km',
						area: [],
						meta: fetchMeta('ukmo_global_ensemble_20km', 'ensemble', apiKeyPreferences)
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
						meta: fetchMeta('cams_global', 'air-quality', apiKeyPreferences)
					},
					{
						name: 'CAMS Europe 0.1°',
						area: ['european_union'],
						meta: fetchMeta('cams_europe', 'air-quality', apiKeyPreferences)
					},
					{
						name: 'CAMS Global Greenhouse Gases 0.1°',
						area: ['european_union'],
						meta: fetchMeta('cams_global_greenhouse_gases', 'air-quality', apiKeyPreferences)
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
						meta: fetchMeta('meteofrance_wave', 'marine', apiKeyPreferences)
					},
					{
						name: 'SMOC Currents 0.08°',
						area: [],
						meta: fetchMeta('meteofrance_currents', 'marine', apiKeyPreferences)
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
						meta: fetchMeta('ecmwf_wam025', 'marine', apiKeyPreferences)
					},
					{
						name: 'WAM HRES',
						area: [],
						meta: fetchMeta('ecmwf_wam', 'marine', apiKeyPreferences)
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
						meta: fetchMeta('ncep_gfswave025', 'marine', apiKeyPreferences)
					},
					{
						name: 'GFS Wave 0.16',
						area: [],
						meta: fetchMeta('ncep_gfswave016', 'marine', apiKeyPreferences)
					}
				]
			},
			{
				provider: 'DWD',
				url: '/en/docs/marine-weather-api',
				models: [
					{
						name: 'GWAM',
						area: [],
						meta: fetchMeta('dwd_gwam', 'marine', apiKeyPreferences)
					},
					{
						name: 'EWAM',
						area: ['european_union'],
						meta: fetchMeta('dwd_ewam', 'marine', apiKeyPreferences)
					}
				]
			},
			{
				provider: 'Copernicus',
				url: '/en/docs/marine-weather-api',
				models: [
					{
						name: 'ERA5-Ocean',
						area: [],
						meta: fetchMeta('copernicus_era5_ocean', 'marine', apiKeyPreferences)
					}
				]
			}
		];

		let floodModels = [
			{
				provider: 'GloFAS',
				url: '/en/docs/flood-api',
				models: [
					{
						name: 'GloFAS v4 Forecast',
						area: [],
						meta: fetchMeta('glofas_forecast_v4', 'flood', apiKeyPreferences)
					},
					{
						name: 'GloFAS v4 Seasonal Forecast',
						area: [],
						meta: fetchMeta('glofas_seasonal_v4', 'flood', apiKeyPreferences)
					}
				]
			}
		];

		return [
			{ name: 'Forecast API', providers: forecastModels },
			{ name: 'Historical Weather API', providers: historicalModels },
			{ name: 'Ensemble API', providers: ensembleModels },
			{ name: 'Air Quality API', providers: airQualityModels },
			{ name: 'Marine API', providers: marineModels },
			{ name: 'Flood API', providers: floodModels }
		];
	}

	let showGlobalModels = $state(true);
	let showEuropeanModels = $state(true);
	let showNorthAmericanModels = $state(true);
	let showAsianModels = $state(true);

	let sectionsAll = $derived(getData($apiKeyPreferences));
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

	let today = new SvelteDate();
	today.setTime(0);
	let mount = new SvelteDate();
	let lastRefresh = $state('00:00');
	let refreshTickerInterval: ReturnType<typeof setInterval> | undefined;
	onMount(() => {
		mount = new SvelteDate();
		refreshTickerInterval = setInterval(() => {
			const now = new SvelteDate();
			const difference = Math.round(now.getTime() - mount.getTime());
			today.setTime(difference);
			if (today.getUTCHours() > 0) {
				lastRefresh = '>59:59';
			} else {
				lastRefresh = `${pad(today.getUTCMinutes())}:${pad(today.getUTCSeconds())}`;
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(refreshTickerInterval);
	});
</script>

<svelte:head>
	<title>API Production Status | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/status" />
</svelte:head>

<div>
	<a href="#model_updates">
		<h2 id="model_updates" class="text-2xl md:text-3xl">Model Updates</h2>
	</a>

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
			<LicenceSelector />
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
	<div class="flex mt-3 gap-3 items-center" id="refresh">
		<Button
			onclick={() => {
				sectionsAll = getData($apiKeyPreferences);
				mount = new SvelteDate();
			}}
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
				class="lucide lucide-refresh-cw-icon lucide-refresh-cw"
				><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path
					d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
				/><path d="M8 16H3v5" /></svg
			> Refresh</Button
		> last refresh: {lastRefresh}
	</div>
	{#each sections as section, i (i)}
		<div class="mt-6">
			<a href={`#${section.name.toLowerCase().replaceAll(' ', '_')}`}>
				<h2 id={section.name.toLowerCase().replaceAll(' ', '_')} class="text-2xl md:text-3xl">
					{section.name}
				</h2>
			</a>

			<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
				<table
					class="[&_tr]:border-border mx-6 mt-2 w-full min-w-[1140px] caption-bottom text-left md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
						{#each section.providers as provider, i (i)}
							{#each provider.models as model, index (index)}
								<tr>
									{#if index == 0}
										<td rowspan={provider.models.length}>{provider.provider}</td>
									{/if}
									<td>{model.name}</td>
									<td>
										{#each model.area as area, i (i)}
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
		<a href="#metadata_api_documentation">
			<h2 id="metadata_api_documentation" class="text-2xl md:text-3xl">
				Metadata API Documentation
			</h2>
		</a>
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
					<strong>last_run_availability_time:</strong> The time when the data is actually accessible on
					the API server. Important: Open-Meteo utilises multiple redundant API servers, so there may
					be slight differences between them while the data is being copied. To ensure all API calls use
					the most recent data, please wait 10 minutes after the availability time.
				</li>
				<li>
					<strong>temporal_resolution_seconds:</strong> The temporal resolution of the model in seconds.
					By default, the API interpolates the data to a 1-hour resolution. However, the underlying model
					may only provide data in 3 or 6-hourly steps. A value of 3600 indicates that the data is 1-hourly.
				</li>
				<li>
					<strong>update_interval_seconds:</strong> The typical time interval between model updates, such
					as 3600 seconds for a model that updates every hour.
				</li>
			</ul>
			<p class="mt-2">
				Additional attributes, such as spatial resolution, area, grid systems, and more, will be
				added in the future.
			</p>
		</div>
	</div>
</div>

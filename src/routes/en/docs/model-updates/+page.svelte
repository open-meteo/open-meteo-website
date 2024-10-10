<script lang="ts">
	import LicenseSelector from '../LicenseSelector.svelte';
	import { api_key_preferences } from '$lib/stores';

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
			is_late: isLate,
			is_really_late: isReallyLate
		};
	}
	function getData(api_key_preferences: any) {
		let forecastModels = [
			{
				provider: 'AM ARPAE ARPAP',
				url: '',
				models: [
					{
						name: 'COSMO 2i',
						meta: fetchMeta('arpae_cosmo_2i', 'forecast', api_key_preferences)
					},
					{
						name: 'COSMO 5m',
						meta: fetchMeta('arpae_cosmo_5m', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'BOM',
				url: '/en/docs/bom-api',
				models: [
					{
						name: 'ACCESS-G 0.15°',
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
						meta: fetchMeta('cmc_gem_gdps', 'forecast', api_key_preferences)
					},
					{
						name: 'HRDPS',
						meta: fetchMeta('cmc_gem_hrdps', 'forecast', api_key_preferences)
					},
					{
						name: 'RDPS',
						meta: fetchMeta('cmc_gem_rdps', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'DMI',
				url: '/en/docs/dmi-api',
				models: [
					{
						name: 'Harmonie AROME Europe',
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
						meta: fetchMeta('dwd_icon', 'forecast', api_key_preferences)
					},
					{
						name: 'ICON-D2',
						meta: fetchMeta('dwd_icon_d2', 'forecast', api_key_preferences)
					},
					{
						name: 'ICON-D2 15min',
						meta: fetchMeta('dwd_icon_d2_15min', 'forecast', api_key_preferences)
					},
					{
						name: 'ICON-EU',
						meta: fetchMeta('dwd_icon_eu', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'ECMWF',
				url: '/en/docs/ecmwf-api',
				models: [
					{
						name: 'AIFS 0.25°',
						meta: fetchMeta('ecmwf_aifs025', 'forecast', api_key_preferences)
					},
					{
						name: 'IFS 0.25°',
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
						meta: fetchMeta('jma_gsm', 'forecast', api_key_preferences)
					},
					{
						name: 'MSM 0.05°',
						meta: fetchMeta('jma_msm', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'KNMI',
				url: '/en/docs/knmi-api',
				models: [
					{
						name: 'Harmonie AROME Europe',
						meta: fetchMeta('knmi_harmonie_arome_europe', 'forecast', api_key_preferences)
					},
					{
						name: 'Harmonie AROME Netherlands',
						meta: fetchMeta('knmi_harmonie_arome_netherlands', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'Météo-France',
				url: '/en/docs/meteofrance-api',
				models: [
					{
						name: 'AROME France 0.025°',
						meta: fetchMeta('meteofrance_arome_france0025', 'forecast', api_key_preferences)
					},
					{
						name: 'AROME France 0.025° 15min',
						meta: fetchMeta('meteofrance_arome_france0025_15min', 'forecast', api_key_preferences)
					},
					{
						name: 'AROME France 0.01 HD°',
						meta: fetchMeta('meteofrance_arome_france_hd', 'forecast', api_key_preferences)
					},
					{
						name: 'AROME France 0.01 HD 15min',
						meta: fetchMeta('meteofrance_arome_france_hd_15min', 'forecast', api_key_preferences)
					},
					{
						name: 'ARPEGE Europe 0.1°',
						meta: fetchMeta('meteofrance_arpege_europe', 'forecast', api_key_preferences)
					},
					{
						name: 'ARPEGE World 0.25°',
						meta: fetchMeta('meteofrance_arpege_world025', 'forecast', api_key_preferences)
					}
				]
			},
			{
				provider: 'MET Norway',
				url: '/en/docs/metno-api',
				models: [
					{
						name: 'MET Nordic PP',
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
						meta: fetchMeta('ncep_gfs013', 'forecast', api_key_preferences)
					},
					{
						name: 'GFS 0.25°',
						meta: fetchMeta('ncep_gfs025', 'forecast', api_key_preferences)
					},
					{
						name: 'GFS GraphCast 0.25°',
						meta: fetchMeta('ncep_gfs_graphcast025', 'forecast', api_key_preferences)
					},
					{
						name: 'HRRR Conus',
						meta: fetchMeta('ncep_hrrr_conus', 'forecast', api_key_preferences)
					},
					{
						name: 'NBM Conus',
						meta: fetchMeta('ncep_nbm_conus', 'forecast', api_key_preferences)
					},
					{
						name: 'HRRR Conus 15min',
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
						meta: fetchMeta('ukmo_global_deterministic_10km', 'forecast', api_key_preferences)
					},
					{
						name: 'UKMO UKV',
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
						meta: fetchMeta('copernicus_era5', 'archive', api_key_preferences)
					},
					{
						name: 'ERA5-Land 0.1°',
						meta: fetchMeta('copernicus_era5_land', 'archive', api_key_preferences)
					},
					{
						name: 'ERA5-Ensemble 0.25°',
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
						meta: fetchMeta('ecmwf_ifs', 'archive', api_key_preferences)
					},
					{
						name: 'IFS Analysis Long-Window 4D',
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
						meta: fetchMeta('cmc_gem_geps', 'ensemble', api_key_preferences)
					}
				]
			},
			{
				provider: 'DWD',
				url: '/en/docs/dwd-api',
				models: [
					{
						name: 'ICON-D2-EPS',
						meta: fetchMeta('dwd_icon_d2_eps', 'ensemble', api_key_preferences)
					},
					{
						name: 'ICON-EPS',
						meta: fetchMeta('dwd_icon_eps', 'ensemble', api_key_preferences)
					},
					{
						name: 'ICON-EU-EPS',
						meta: fetchMeta('dwd_icon_eu_eps', 'ensemble', api_key_preferences)
					}
				]
			},
			{
				provider: 'ECMWF',
				url: '/en/docs/ecmwf-api',
				models: [
					{
						name: 'IFS 0.25° Ensemble',
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
						meta: fetchMeta('ncep_gefs025', 'ensemble', api_key_preferences)
					},
					{
						name: 'GFS 0.25° Ensemble',
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
						meta: fetchMeta('cams_global', 'air-quality', api_key_preferences)
					},
					{
						name: 'CAMS Europe 0.1°',
						meta: fetchMeta('cams_europe', 'air-quality', api_key_preferences)
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
						meta: fetchMeta('meteofrance_wave', 'marine', api_key_preferences)
					},
					{
						name: 'SMOC Currents 0.08°',
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
						meta: fetchMeta('ncep_gfswave025', 'marine', api_key_preferences)
					},
					{
						name: 'GFS Wave 0.16',
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
	$: sections = getData($api_key_preferences);
</script>

<svelte:head>
	<title>API Production Status | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/status" />
</svelte:head>

<div class="col-12">
	<h2>Model Updates</h2>
	<div class="row">
		<div class="col-6">
			<p>
				This page offers a brief overview of all models integrated into Open-Meteo. These models are
				typically updated every few hours. Open-Meteo aims to download and process the data as soon
				as it becomes available, immediately after it is released by national weather services.
			</p>
		</div>
		<div class="col-6">
			<p>
				Open-Meteo operates with geographically distributed and redundant servers. Data across all
				Open-Meteo servers is <a
					title="Wikipedia: Eventual consistency"
					href="https://en.wikipedia.org/wiki/Eventual_consistency">eventually consistent</a
				>, meaning there may be instances where the API indicates a weather model has been updated,
				but not all servers have been fully updated yet. If you need access to the most recent
				forecast, it's recommended to wait an additional 10 minutes after the forecast update has
				been applied.
			</p>
		</div>
	</div>
	<div class="row">
		<div class="col-6">
			<p>
				Models with a delay exceeding 20 minutes are highlighted in yellow. If multiple weather
				model updates are missed, the model is marked in red. Minor delays are fairly common.
			</p>
		</div>
		<div class="col-6">
			<p>
				To report a model issue, please open a ticket on <a
					title="GitHub Open-Meteo Repository"
					href="https://github.com/open-meteo/open-meteo/issues">GitHub</a
				>. Commercial clients can contact us directly via email.
			</p>
		</div>

		<div class="col-12">
			<p>
				The free and commercial API services of Open-Meteo operate on different servers, leading to
				slight variations in update times. Please choose the appropriate type below. Note that API
				calls to the metadata API are not counted toward daily or monthly request limits.
			</p>
			<LicenseSelector />
		</div>
	</div>
	{#each sections as section}
		<h2>{section.name}</h2>

		<div class="table-responsive">
			<table class="table">
				<thead>
					<tr>
						<th scope="col">Provider</th>
						<th scope="col">Weather Model</th>
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
								{#await model.meta}
									<td colspan="5">Loading</td>
								{:then meta}
									<td class:table-warning={meta.is_late} class:table-danger={meta.is_really_late}
										>{meta.last_run_initialisation_time}</td
									>
									<td class:table-warning={meta.is_late} class:table-danger={meta.is_really_late}
										>{meta.last_run_availability_time}</td
									>
									<td>{meta.temporal_resolution_seconds / 3600} hourly</td>
									<td>Every {meta.update_interval_seconds / 3600} h</td>
									<td><a href={meta.url} target="_blank">Link</a></td>
								{:catch error}
									<td colspan="5" class="table-danger">{error}</td>
								{/await}
							</tr>
						{/each}
					{/each}
				</tbody>
			</table>
		</div>
	{/each}
	<h2>Metadata API Documentation</h2>
	<p>
		You can retrieve the update times for each individual model via the API. However, these times do
		not directly correlate with the update times in the Forecast API, as Open-Meteo automatically
		selects the most appropriate weather model for each location (referred to as "Best Match"). The
		table above provides an API link for each model, returning a JSON object with the following
		fields:
	</p>
	<ul>
		<li>
			<strong>last_run_initialisation_time:</strong> The model's initialization time or reference time
			represented as a Unix timestamp (e.g., 1724796000 for Tue Aug 27, 2024, 22:00:00 GMT+0000).
		</li>
		<li>
			<strong>last_run_modification_time:</strong> The time when the data download and conversion were
			completed, which does not indicate when the data became available on the API.
		</li>
		<li>
			<strong>last_run_availability_time:</strong> The time when the data is actually accessible on the
			API server. Important: Open-Meteo utilizes multiple redundant API servers, so there may be slight
			differences between them while the data is being copied. To ensure all API calls use the most recent
			data, please wait 10 minutes after the availability time.
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
	<p>
		Additional attributes, such as spatial resolution, area, grid systems, and more, will be added
		in the future.
	</p>
</div>

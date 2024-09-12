<script lang="ts">
	async function fetchMeta(model: String, apiPrefix: String = '') {
		const url = `https://${apiPrefix}api.open-meteo.com/data/${model}/static/meta.json`;
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
			json.last_run_availability_time + 2 * json.update_interval_seconds + 10 * 60 < now;
		const isLate =
			!isReallyLate &&
			json.last_run_availability_time + json.update_interval_seconds + 10 * 60 < now;

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

	export let forecastModels = [
		{
			provider: 'AM ARPAE ARPAP',
			url: '',
			models: [
				{
					name: 'COSMO 2i',
					meta: fetchMeta('arpae_cosmo_2i')
				},
				{
					name: 'COSMO 2i RUC',
					meta: fetchMeta('arpae_cosmo_2i_ruc')
				},
				{
					name: 'COSMO 5m',
					meta: fetchMeta('arpae_cosmo_5m')
				}
			]
		},
		{
			provider: 'BOM',
			url: '/en/docs/bom-api',
			models: [
				{
					name: 'ACCESS-G 0.15°',
					meta: fetchMeta('bom_access_global')
				}
			]
		},
		{
			provider: 'CMA',
			url: '/en/docs/cma-api',
			models: [
				{
					name: 'GFS Grapes 0.125°',
					meta: fetchMeta('cma_grapes_global')
				}
			]
		},
		{
			provider: 'Canadian Weather Service',
			url: '/en/docs/gem-api',
			models: [
				{
					name: 'GDPS 0.125°',
					meta: fetchMeta('cmc_gem_gdps')
				},
				{
					name: 'HRDPS',
					meta: fetchMeta('cmc_gem_hrdps')
				},
				{
					name: 'RDPS',
					meta: fetchMeta('cmc_gem_rdps')
				}
			]
		},
		{
			provider: 'DMI',
			url: '/en/docs/dmi-api',
			models: [
				{
					name: 'Harmonie AROME Europe',
					meta: fetchMeta('dmi_harmonie_arome_europe')
				}
			]
		},
		{
			provider: 'DWD',
			url: '/en/docs/dwd-api',
			models: [
				{
					name: 'ICON',
					meta: fetchMeta('dwd_icon')
				},
				{
					name: 'ICON-D2',
					meta: fetchMeta('dwd_icon_d2')
				},
				{
					name: 'ICON-D2 15min',
					meta: fetchMeta('dwd_icon_d2_15min')
				},
				{
					name: 'ICON-EU',
					meta: fetchMeta('dwd_icon_eu')
				}
			]
		},
		{
			provider: 'ECMWF',
			url: '/en/docs/ecmwf-api',
			models: [
				{
					name: 'AIFS 0.25°',
					meta: fetchMeta('ecmwf_aifs025')
				},
				{
					name: 'IFS 0.25°',
					meta: fetchMeta('ecmwf_ifs025')
				}
			]
		},
		{
			provider: 'JMA',
			url: '/en/docs/jma-api',
			models: [
				{
					name: 'GSM 0.5°',
					meta: fetchMeta('jma_gsm')
				},
				{
					name: 'MSM 0.05°',
					meta: fetchMeta('jma_msm')
				}
			]
		},
		{
			provider: 'KNMI',
			url: '/en/docs/knmi-api',
			models: [
				{
					name: 'Harmonie AROME Europe',
					meta: fetchMeta('knmi_harmonie_arome_europe')
				},
				{
					name: 'Harmonie AROME Netherlands',
					meta: fetchMeta('knmi_harmonie_arome_netherlands')
				}
			]
		},
		{
			provider: 'Météo-France',
			url: '/en/docs/meteofrance-api',
			models: [
				{
					name: 'AROME France 0.025°',
					meta: fetchMeta('meteofrance_arome_france0025')
				},
				{
					name: 'AROME France 0.025° 15min',
					meta: fetchMeta('meteofrance_arome_france0025_15min')
				},
				{
					name: 'AROME France 0.01 HD°',
					meta: fetchMeta('meteofrance_arome_france_hd')
				},
				{
					name: 'AROME France 0.01 HD 15min',
					meta: fetchMeta('meteofrance_arome_france_hd_15min')
				},
				{
					name: 'ARPEGE Europe 0.1°',
					meta: fetchMeta('meteofrance_arpege_europe')
				},
				{
					name: 'ARPEGE World 0.25°',
					meta: fetchMeta('meteofrance_arpege_world025')
				}
			]
		},
		{
			provider: 'MET Norway',
			url: '/en/docs/metno-api',
			models: [
				{
					name: 'MET Nordic PP',
					meta: fetchMeta('metno_nordic_pp')
				}
			]
		},
		{
			provider: 'NOAA NCEP',
			url: '/en/docs/gfs-api',
			models: [
				{
					name: 'GFS 0.11°',
					meta: fetchMeta('ncep_gfs013')
				},
				{
					name: 'GFS 0.25°',
					meta: fetchMeta('ncep_gfs025')
				},
				{
					name: 'GFS GraphCast 0.25°',
					meta: fetchMeta('ncep_gfs_graphcast025')
				},
				{
					name: 'HRRR Conus',
					meta: fetchMeta('ncep_hrrr_conus')
				},
				{
					name: 'HRRR Conus 15min',
					meta: fetchMeta('ncep_hrrr_conus_15min')
				}
			]
		},
		{
			provider: 'UK Met Office',
			url: '/en/docs/ukmo-api',
			models: [
				{
					name: 'UKMO Global Deterministic 0.09°',
					meta: fetchMeta('ukmo_global_deterministic_10km')
				},
				{
					name: 'UKMO UKV',
					meta: fetchMeta('ukmo_uk_deterministic_2km')
				}
			]
		}
	];

	export let historicalModels = [
		{
			provider: 'Copernicus',
			url: '/en/docs/historical-weather-api',
			models: [
				{
					name: 'ERA5 0.25°',
					meta: fetchMeta('copernicus_era5', 'archive-')
				},
				{
					name: 'ERA5-Land 0.1°',
					meta: fetchMeta('copernicus_era5_land', 'archive-')
				}
				,
				{
					name: 'ERA5-Ensemble 0.25°',
					meta: fetchMeta('copernicus_era5_ensemble', 'archive-')
				}
			]
		},
		{
			provider: 'ECMWF',
			url: '/en/docs/historical-weather-api',
			models: [
				{
					name: 'IFS HRES 9km',
					meta: fetchMeta('ecmwf_ifs', 'archive-')
				},
				{
					name: 'IFS Analysis Long-Window 4D',
					meta: fetchMeta('ecmwf_ifs_analysis_long_window', 'archive-')
				}
			]
		},
		
	];

	export let ensembleModels = [
		{
			provider: 'BOM',
			url: '/en/docs/bom-api',
			models: [
				{
					name: 'ACCESS-GE 0.4°',
					meta: fetchMeta('bom_access_global_ensemble', 'ensemble-')
				}
			]
		},
		{
			provider: 'Canadian Weather Service',
			url: '/en/docs/gem-api',
			models: [
				{
					name: 'GDPS 0.25° Ensemble',
					meta: fetchMeta('cmc_gem_geps', 'ensemble-')
				}
			]
		},
		{
			provider: 'DWD',
			url: '/en/docs/dwd-api',
			models: [
				{
					name: 'ICON-D2-EPS',
					meta: fetchMeta('dwd_icon_d2_eps', 'ensemble-')
				},
				{
					name: 'ICON-EPS',
					meta: fetchMeta('dwd_icon_eps', 'ensemble-')
				},
				{
					name: 'ICON-EU-EPS',
					meta: fetchMeta('dwd_icon_eu_eps', 'ensemble-')
				}
			]
		},
		{
			provider: 'ECMWF',
			url: '/en/docs/ecmwf-api',
			models: [
				{
					name: 'IFS 0.25° Ensemble',
					meta: fetchMeta('ecmwf_ifs025_ensemble', 'ensemble-')
				}
			]
		},
		{
			provider: 'NOAA NCEP',
			url: '/en/docs/gfs-api',
			models: [
				{
					name: 'GFS 0.25 Ensemble',
					meta: fetchMeta('ncep_gefs025', 'ensemble-')
				},
				{
					name: 'GFS 0.25° Ensemble',
					meta: fetchMeta('ncep_gefs05', 'ensemble-')
				}
			]
		}
	];


	export let airQualityModels = [
		{
			provider: 'CAMS',
			url: '/en/docs/air-quality-api',
			models: [
				{
					name: 'CAMS GLOBAL 0.4°',
					meta: fetchMeta('cams_global', 'air-quality-')
				},
				{
					name: 'CAMS Europe 0.1°',
					meta: fetchMeta('cams_europe', 'air-quality-')
				}
			]
		}
	];

	export let marineModels = [
		{
			provider: 'Météo-France',
			url: '/en/docs/marine-weather-api',
			models: [
				{
					name: 'MFWAM 0.08°',
					meta: fetchMeta('meteofrance_wave', 'marine-')
				},
				{
					name: 'SMOC Currents 0.08°',
					meta: fetchMeta('meteofrance_currents', 'marine-')
				}
			]
		},
		{
			provider: 'ECMWF',
			url: '/en/docs/marine-weather-api',
			models: [
				{
					name: 'WAM 0.25°',
					meta: fetchMeta('ecmwf_wam025', 'marine-')
				},
			]
		},
		{
			provider: 'NOAA NCEP',
			url: '/en/docs/marine-weather-api',
			models: [
				{
					name: 'GFS Wave 0.25°',
					meta: fetchMeta('ncep_gfswave025', 'marine-')
				},
			]
		},
		{
			provider: 'DWD',
			url: '/en/docs/marine-weather-api',
			models: [
				{
					name: 'GWAM',
					meta: fetchMeta('dwd_gwam', 'marine-')
				},
				{
					name: 'EWAM',
					meta: fetchMeta('dwd_ewam', 'marine-')
				}
			]
		},

		{
			provider: 'Copernicus',
			url: '/en/docs/marine-weather-api',
			models: [
				{
					name: 'ERA5-Ocean',
					meta: fetchMeta('copernicus_era5_ocean', 'marine-')
				}
			]
		}
	];

	export let floodModels = [
		{
			provider: 'GloFAS',
			url: '/en/docs/flood-api',
			models: [
				{
					name: 'GloFAS v4 Forecast',
					meta: fetchMeta('glofas_seasonal_v4', 'flood-')
				},
				{
					name: 'GloFAS v4 Seasonal Forecast',
					meta: fetchMeta('glofas_forecast_v4', 'flood-')
				}
			]
		}
	];

	let sections = [
		{ name: 'Forecast API', providers: forecastModels },
		{ name: 'Historical Weather API', providers: historicalModels },
		{ name: 'Ensemble API', providers: ensembleModels },
		{ name: 'Air Quality API', providers: airQualityModels },
		{ name: 'Marine API', providers: marineModels },
		{ name: 'Flood API', providers: floodModels },
	];
</script>

<svelte:head>
	<title>API Production Status | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/status" />
</svelte:head>

<div class="col-12">
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
</div>

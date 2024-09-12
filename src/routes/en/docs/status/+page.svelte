<script lang="ts">
	async function fetchMeta(model: String) {
		const url = `https://api.open-meteo.com/data/${model}/static/meta.json`;
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
				},
				{
					name: 'ACCESS-GE 0.4°',
					meta: fetchMeta('bom_access_global_ensemble')
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
					name: 'GDPS 0.25° Ensemble',
					meta: fetchMeta('cmc_gem_geps')
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
					name: 'ICON-D2-EPS',
					meta: fetchMeta('dwd_icon_d2_eps')
				},
				{
					name: 'ICON-EPS',
					meta: fetchMeta('dwd_icon_eps')
				},
				{
					name: 'ICON-EU',
					meta: fetchMeta('dwd_icon_eu')
				},
				{
					name: 'ICON-EU-EPS',
					meta: fetchMeta('dwd_icon_eu_eps')
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
				},
				{
					name: 'IFS 0.25° Ensemble',
					meta: fetchMeta('ecmwf_ifs025_ensemble')
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
					name: 'GFS 0.25 Ensemble',
					meta: fetchMeta('ncep_gefs025')
				},
				{
					name: 'GFS 0.25° Ensemble',
					meta: fetchMeta('ncep_gefs05')
				},
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
</script>

<svelte:head>
	<title>API Production Status | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/status" />
</svelte:head>

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
			{#each forecastModels as provider, pindex}
				{#each provider.models as model, index}
					<tr>
						{#if index == 0}
							<td rowspan={provider.models.length}>{provider.provider}</td>
						{/if}
						<td>{model.name}</td>
						{#await model.meta}
							<td colspan="4">Loading</td>
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
							<td colspan="4">{error}</td>
						{/await}
					</tr>
				{/each}
			{/each}
		</tbody>
	</table>
</div>

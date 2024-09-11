<script lang="ts">
	async function fetchMeta(model: String) {
		const result = await fetch(`https://api.open-meteo.com/data/${model}/static/meta.json`);
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
					meta: fetchMeta('arpae_cosmo_2i'),
					spatial_resolution: '2 km',
					region: 'Italy'
				},
				{
					name: 'COSMO 2i RUC',
					meta: fetchMeta('arpae_cosmo_2i_ruc'),
					spatial_resolution: '2 km',
					region: 'Italy'
				},
				{
					name: 'COSMO 5m',
					meta: fetchMeta('arpae_cosmo_5m'),
					spatial_resolution: '5 km',
					region: 'Mediterranean Sea'
				}
			]
		},
		{
			provider: 'Australian Bureau of Meteorology (BOM)',
			url: '/en/docs/bom-api',
			models: [
				{
					name: 'ACCESS-G 0.15°',
					meta: fetchMeta('bom_access_global'),
					spatial_resolution: '15 km',
					region: 'Global'
				},
				{
					name: 'ACCESS-GE 0.4°',
					meta: fetchMeta('bom_access_global_ensemble'),
					spatial_resolution: '40 km',
					region: 'Global'
				}
			]
		},
		{
			provider: 'China Meteorological Administration (CMA)',
			url: '/en/docs/cma-api',
			models: [
				{
					name: 'GFS Grapes 0.125°',
					meta: fetchMeta('cma_grapes_global'),
					spatial_resolution: '15 km',
					region: 'Global'
				}
			]
		},
		{
			provider: 'Canadian Weather Service',
			url: '/en/docs/gem-api',
			models: [
				{
					name: 'GDPS 0.125°',
					meta: fetchMeta('cmc_gem_gdps'),
					spatial_resolution: '15 km',
					region: 'Global'
				},
				{
					name: 'GDPS 0.25° Ensemble',
					meta: fetchMeta('cmc_gem_geps'),
					spatial_resolution: '25 km',
					region: 'Global'
				},
				{
					name: 'HRDPS',
					meta: fetchMeta('cmc_gem_hrdps'),
					spatial_resolution: '2.5 km',
					region: 'Canada, Nothern US'
				},
				{
					name: 'RDPS',
					meta: fetchMeta('cmc_gem_rdps'),
					spatial_resolution: '10 km',
					region: 'North America, North Pole'
				}
			]
		},
		{
			provider: 'DMI',
			url: '/en/docs/dmi-api',
			models: [
				{
					name: 'Harmonie AROME Europe',
					meta: fetchMeta('dmi_harmonie_arome_europe'),
					spatial_resolution: '2 km',
					region: 'Central & Northern Europe'
				}
			]
		},
		{
			provider: 'Deutscher Wetterdienst (DWD)',
			url: '/en/docs/dwd-api',
			models: [
				{
					name: 'ICON',
					meta: fetchMeta('dwd_icon'),
					spatial_resolution: '11 km',
					region: 'Global'
				},
				{
					name: 'ICON-D2',
					meta: fetchMeta('dwd_icon_d2'),
					spatial_resolution: '2 km',
					region: 'Central Europe'
				},
				{
					name: 'ICON-D2 15min',
					meta: fetchMeta('dwd_icon_d2_15min'),
					spatial_resolution: '2 km',
					region: 'Central Europe'
				},
				{
					name: 'ICON-D2-EPS',
					meta: fetchMeta('dwd_icon_d2_eps'),
					spatial_resolution: '2 km',
					region: 'Central Europe'
				},
				{
					name: 'ICON-EPS',
					meta: fetchMeta('dwd_icon_eps'),
					spatial_resolution: '26 km',
					region: 'Global'
				},
				{
					name: 'ICON-EU',
					meta: fetchMeta('dwd_icon_eu'),
					spatial_resolution: '7 km',
					region: 'Europe'
				},
				{
					name: 'ICON-EU-EPS',
					meta: fetchMeta('dwd_icon_eu_eps'),
					spatial_resolution: '13 km',
					region: 'Europe'
				}
			]
		},
		{
			provider: 'ECMWF',
			url: '/en/docs/ecmwf-api',
			models: [
				{
					name: 'AIFS 0.25°',
					meta: fetchMeta('ecmwf_aifs025'),
					spatial_resolution: '25 km',
					region: 'Global'
				},
				{
					name: 'IFS 0.25°',
					meta: fetchMeta('ecmwf_ifs025'),
					spatial_resolution: '25 km',
					region: 'Global'
				},
				{
					name: 'IFS 0.25° Ensemble',
					meta: fetchMeta('ecmwf_ifs025_ensemble'),
					spatial_resolution: '25 km',
					region: 'Global'
				}
			]
		},
		{
			provider: 'JMA',
			url: '/en/docs/jma-api',
			models: [
				{
					name: 'GSM 0.5°',
					meta: fetchMeta('jma_gsm'),
					spatial_resolution: '55 km',
					region: 'Global'
				},
				{
					name: 'MSM 0.05°',
					meta: fetchMeta('jma_msm'),
					spatial_resolution: '5 km',
					region: 'Japan'
				}
			]
		},
		{
			provider: 'KNMI',
			url: '/en/docs/knmi-api',
			models: [
				{
					name: 'Harmonie AROME Europe',
					meta: fetchMeta('knmi_harmonie_arome_europe'),
					spatial_resolution: '5.5 km',
					region: 'Central & Northern Europe up to Iceland'
				},
				{
					name: 'Harmonie AROME Netherlands',
					meta: fetchMeta('knmi_harmonie_arome_netherlands'),
					spatial_resolution: '2 km',
					region: 'Netherlands, Belgium'
				}
			]
		},
		{
			provider: 'Météo-France',
			url: '/en/docs/meteofrance-api',
			models: [
				{
					name: 'AROME France 0.025°',
					meta: fetchMeta('meteofrance_arome_france0025'),
					spatial_resolution: '2.5 km',
					region: 'France'
				},
				{
					name: 'AROME France 0.025° 15min',
					meta: fetchMeta('meteofrance_arome_france0025_15min'),
					spatial_resolution: '2.5 km',
					region: 'France'
				},
				{
					name: 'AROME France 0.01 HD°',
					meta: fetchMeta('meteofrance_arome_france_hd'),
					spatial_resolution: '1 km',
					region: 'France'
				},
				{
					name: 'AROME France 0.01 HD 15min',
					meta: fetchMeta('meteofrance_arome_france_hd_15min'),
					spatial_resolution: '1 km',
					region: 'France'
				},
				{
					name: 'ARPEGE EUROPE 0.1°',
					meta: fetchMeta('meteofrance_arpege_europe'),
					spatial_resolution: '11 km',
					region: 'Europe'
				},
				{
					name: 'ARPEGE WORLD 0.25°',
					meta: fetchMeta('meteofrance_arpege_world025'),
					spatial_resolution: '25 km',
					region: 'Global'
				}
			]
		},
		{
			provider: 'MET Norway',
			url: '/en/docs/metno-api',
			models: [
				{
					name: 'MET Nordic PP',
					meta: fetchMeta('metno_nordic_pp'),
					spatial_resolution: '1 km',
					region: 'Norway, Denmark, Sweden, Finland'
				}
			]
		},
		{
			provider: 'NOAA NCEP',
			url: '/en/docs/gfs-api',
			models: [
				{
					name: 'GFS 0.25 Ensemble',
					meta: fetchMeta('ncep_gefs025'),
					spatial_resolution: '25 km',
					region: 'Global'
				},
				{
					name: 'GFS 0.25° Ensemble',
					meta: fetchMeta('ncep_gefs05'),
					spatial_resolution: '25 km',
					region: 'Global'
				},
				{
					name: 'GFS 0.11°',
					meta: fetchMeta('ncep_gfs013'),
					spatial_resolution: '13 km',
					region: 'Global'
				},
				{
					name: 'GFS 0.25°',
					meta: fetchMeta('ncep_gfs025'),
					spatial_resolution: '25 km',
					region: 'Global'
				},
				{
					name: 'GFS GraphCast 0.25°',
					meta: fetchMeta('ncep_gfs_graphcast025'),
					spatial_resolution: '25 km',
					region: 'Global'
				},
				{
					name: 'HRRR Conus',
					meta: fetchMeta('ncep_hrrr_conus'),
					spatial_resolution: '3 km',
					region: 'U.S. Conus'
				},
				{
					name: 'HRRR Conus 15min',
					meta: fetchMeta('ncep_hrrr_conus_15min'),
					spatial_resolution: '3 km',
					region: 'U.S. Conus'
				}
			]
		},
		{
			provider: 'UK Met Office',
			url: '/en/docs/ukmo-api',
			models: [
				{
					name: 'UKMO Global Deterministic 0.09°',
					meta: fetchMeta('ukmo_global_deterministic_10km'),
					spatial_resolution: '10 km',
					region: 'Global'
				},
				{
					name: 'UKMO UKV',
					meta: fetchMeta('ukmo_uk_deterministic_2km'),
					spatial_resolution: '2 km',
					region: 'UK and Ireland'
				}
			]
		}
	];
</script>

<div class="table-responsive">
	<table class="table">
		<thead>
			<tr>
				<th scope="col">Provider</th>
				<th scope="col">Weather Model</th>
				<th scope="col">Region</th>
				<th scope="col">Resolution</th>
				<th scope="col">Last Model Run</th>
				<th scope="col">Update Available</th>
				<th scope="col">Temporal Resolution</th>
				<th scope="col">Update frequency</th>
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
                        <td>{model.region}</td>
                        <td>{model.spatial_resolution}</td>
						{#await model.meta}
							<td colspan="4">Loading</td>
						{:then meta}
							<td>{meta.last_run_initialisation_time}</td>
							<td class:table-warning={meta.is_late} class:table-danger={meta.is_really_late}
								>{meta.last_run_availability_time}</td
							>
							<td>{meta.temporal_resolution_seconds / 3600} hourly</td>
							<td>Every {meta.update_interval_seconds / 3600} h</td>
						{:catch error}
							<td colspan="4">{error}</td>
						{/await}
					</tr>
				{/each}
			{/each}
		</tbody>
	</table>
</div>

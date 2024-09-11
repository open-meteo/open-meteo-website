<script lang="ts">
	async function fetchMeta(model: String) {
		const result = await fetch(`https://api.open-meteo.com/data/${model}/static/meta.json`);
		if (!result.ok) {
			throw new Error(await result.text());
		}
		const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')
		const utcYYYYMMDD = (date: Date) => `${date.getUTCFullYear()}-${zeroPad(date.getUTCMonth()+1,2)}-${zeroPad(date.getUTCDate()+1,2)}`
		
		const json = await result.json();
		const init = new Date(json.last_run_initialisation_time * 1000)
		const now = Date.now() / 1000

		const initFormated = `${utcYYYYMMDD(init)} ${zeroPad(init.getUTCHours(),2)}z`

		const avail = new Date(json.last_run_availability_time * 1000)
		const availHHMM = `${zeroPad(avail.getUTCHours(),2)}:${zeroPad(avail.getUTCMinutes(),2)}z`
		const availYYYMMDD = `${utcYYYYMMDD(avail)}`
		const availFormated = ((now-json.last_run_availability_time) < 18*3600) ? `${availHHMM}` : `${availYYYMMDD} ${availHHMM}`
		const isReallyLate = (json.last_run_availability_time + 2 * json.update_interval_seconds + 10*60) < now
		const isLate = !isReallyLate && (json.last_run_availability_time + json.update_interval_seconds + 10*60) < now
		

		return {
			data_end_time: json.data_end_time,
			last_run_availability_time: availFormated,
			last_run_initialisation_time: initFormated,
			last_run_modification_time: json.last_run_modification_time,
			temporal_resolution_seconds: json.temporal_resolution_seconds,
			update_interval_seconds: json.update_interval_seconds,
			is_late: isLate,
			is_really_late: isReallyLate
		}
	}
	
	let forecastModels = [
		{
			provider: 'ARPAE',
			models: [
				{ name: 'arpae_cosmo_2i', meta: fetchMeta('arpae_cosmo_2i') },
				{ name: 'arpae_cosmo_2i_ruc', meta: fetchMeta('arpae_cosmo_2i_ruc') },
				{ name: 'arpae_cosmo_5m', meta: fetchMeta('arpae_cosmo_5m') }
			]
		},
		{
			provider: 'BOM',
			models: [
				{ name: 'bom_access_global', meta: fetchMeta('bom_access_global') },
				{ name: 'bom_access_global_ensemble', meta: fetchMeta('bom_access_global_ensemble') }
			]
		},
		{
			provider: 'CMA',
			models: [{ name: 'cma_grapes_global', meta: fetchMeta('cma_grapes_global') }]
		},
		{
			provider: 'CMC',
			models: [
				{ name: 'cmc_gem_gdps', meta: fetchMeta('cmc_gem_gdps') },
				{ name: 'cmc_gem_geps', meta: fetchMeta('cmc_gem_geps') },
				{ name: 'cmc_gem_hrdps', meta: fetchMeta('cmc_gem_hrdps') },
				{ name: 'cmc_gem_rdps', meta: fetchMeta('cmc_gem_rdps') }
			]
		},
		{
			provider: 'DMI',
			models: [{ name: 'dmi_harmonie_arome_europe', meta: fetchMeta('dmi_harmonie_arome_europe') }]
		},
		{
			provider: 'DWD',
			models: [
				{ name: 'dwd_icon', meta: fetchMeta('dwd_icon') },
				{ name: 'dwd_icon_d2', meta: fetchMeta('dwd_icon_d2') },
				{ name: 'dwd_icon_d2_15min', meta: fetchMeta('dwd_icon_d2_15min') },
				{ name: 'dwd_icon_d2_eps', meta: fetchMeta('dwd_icon_d2_eps') },
				{ name: 'dwd_icon_eps', meta: fetchMeta('dwd_icon_eps') },
				{ name: 'dwd_icon_eu', meta: fetchMeta('dwd_icon_eu') },
				{ name: 'dwd_icon_eu_eps', meta: fetchMeta('dwd_icon_eu_eps') }
			]
		},
		{
			provider: 'ECMWF',
			models: [
				{ name: 'ecmwf_aifs025', meta: fetchMeta('ecmwf_aifs025') },
				{ name: 'ecmwf_ifs025', meta: fetchMeta('ecmwf_ifs025') },
				{ name: 'ecmwf_ifs025_ensemble', meta: fetchMeta('ecmwf_ifs025_ensemble') },
				{ name: 'ecmwf_ifs04', meta: fetchMeta('ecmwf_ifs04') }
			]
		},
		{
			provider: 'JMA',
			models: [
				{ name: 'jma_gsm', meta: fetchMeta('jma_gsm') },
				{ name: 'jma_msm', meta: fetchMeta('jma_msm') }
			]
		},
		{
			provider: 'KNMI',
			models: [
				{ name: 'knmi_harmonie_arome_europe', meta: fetchMeta('knmi_harmonie_arome_europe') },
				{
					name: 'knmi_harmonie_arome_netherlands',
					meta: fetchMeta('knmi_harmonie_arome_netherlands')
				}
			]
		},
		{
			provider: 'MeteoFrance',
			models: [
				{ name: 'meteofrance_arome_france0025', meta: fetchMeta('meteofrance_arome_france0025') },
				{
					name: 'meteofrance_arome_france0025_15min',
					meta: fetchMeta('meteofrance_arome_france0025_15min')
				},
				{ name: 'meteofrance_arome_france_hd', meta: fetchMeta('meteofrance_arome_france_hd') },
				{
					name: 'meteofrance_arome_france_hd_15min',
					meta: fetchMeta('meteofrance_arome_france_hd_15min')
				},
				{ name: 'meteofrance_arpege_europe', meta: fetchMeta('meteofrance_arpege_europe') },
				{ name: 'meteofrance_arpege_world025', meta: fetchMeta('meteofrance_arpege_world025') }
			]
		},
		{
			provider: 'MetNo',
			models: [{ name: 'metno_nordic_pp', meta: fetchMeta('metno_nordic_pp') }]
		},
		{
			provider: 'NOAA NCEP',
			models: [
				{ name: 'ncep_gefs025', meta: fetchMeta('ncep_gefs025') },
				{ name: 'ncep_gefs05', meta: fetchMeta('ncep_gefs05') },
				{ name: 'ncep_gfs013', meta: fetchMeta('ncep_gfs013') },
				{ name: 'ncep_gfs025', meta: fetchMeta('ncep_gfs025') },
				{ name: 'ncep_gfs_graphcast025', meta: fetchMeta('ncep_gfs_graphcast025') },
				{ name: 'ncep_hrrr_conus', meta: fetchMeta('ncep_hrrr_conus') },
				{ name: 'ncep_hrrr_conus_15min', meta: fetchMeta('ncep_hrrr_conus_15min') }
			]
		},
		{
			provider: 'UKMO',
			models: [
				{
					name: 'ukmo_global_deterministic_10km',
					meta: fetchMeta('ukmo_global_deterministic_10km')
				},
				{ name: 'ukmo_uk_deterministic_2km/', meta: fetchMeta('ukmo_uk_deterministic_2km') }
			]
		}
	];
</script>

<svelte:head>
	<title>UK Met Office API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/status" />
</svelte:head>

<div class="col-12 py-5">
	<h2 id="data-sources">Forecast Models</h2>
	<p>Model updates times of all forecast models</p>
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
				</tr>
			</thead>
			<tbody>
				{#each forecastModels as provider}
					{#each provider.models as model, index}
						<tr>
							{#if index == 0}
								<td rowspan={provider.models.length}>{provider.provider}</td>
							{/if}
							<td>{model.name}</td>
							{#await model.meta}
								<td colspan="4">Loading</td>
							{:then meta}
								<td>{meta.last_run_initialisation_time}</td>
								<td class:table-warning={meta.is_late} class:table-danger={meta.is_really_late}>{meta.last_run_availability_time}</td>
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
</div>

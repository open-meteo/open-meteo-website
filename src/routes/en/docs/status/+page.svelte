<script lang="ts">
	async function fetchMeta(model: String) {
		const result = await fetch(`https://api.open-meteo.com/data/${model}/static/meta.json`);
		if (!result.ok) {
			throw new Error(await result.text());
		}
		const json = await result.json();
		return json;
	}
	let forecastModels = [
		{ provider: 'DWD', models: [
			{ name: 'dwd_icon_eu', meta: fetchMeta('dwd_icon_eu') },
			{ name: 'dwd_icon_d2', meta: fetchMeta('dwd_icon_d2') }
		] }
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
					<th scope="col">Last Update available</th>
					<th scope="col">Temporal Resolution</th>
					<th scope="col">Update frequency</th>
				</tr>
			</thead>
			<tbody>
				{#each forecastModels as provider}
					{#each provider.models as model, index}
						<tr>
							{#if index == 0}
							<td rowspan="{provider.models.length}">{provider.provider}</td>
							{/if}
							<td>{model.name}</td>
							{#await model.meta}
								<td colspan="2">Loading</td>
							{:then meta}
								<td>{new Date(meta.last_run_initialisation_time * 1000).toISOString()}</td>
								<td>{new Date(meta.last_run_availability_time * 1000).toISOString()}</td>
								<td>{meta.temporal_resolution_seconds / 3600} hourly</td>
								<td>Every {meta.update_interval_seconds / 3600} h</td>
							{:catch error}
								<td colspan="2">{error.message}</td>
							{/await}
						</tr>
					{/each}
				{/each}
			</tbody>
		</table>
	</div>
</div>

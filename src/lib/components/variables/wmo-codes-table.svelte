<script lang="ts">
	import WmoCodesJson from '$lib/components/code/docs/wmo-codes-json.svx';

	// The exact code subset the API emits: the WeatherCode enum in
	// open-meteo/Sources/App/Helper/WeatherCode.swift (a WMO 4677 subset).
	const weatherCodes: { code: number; description: string }[] = [
		{ code: 0, description: 'Clear sky' },
		{ code: 1, description: 'Mainly clear' },
		{ code: 2, description: 'Partly cloudy' },
		{ code: 3, description: 'Overcast' },
		{ code: 45, description: 'Fog' },
		{ code: 48, description: 'Depositing rime fog' },
		{ code: 51, description: 'Light drizzle' },
		{ code: 53, description: 'Moderate drizzle' },
		{ code: 55, description: 'Dense drizzle' },
		{ code: 56, description: 'Light freezing drizzle' },
		{ code: 57, description: 'Dense freezing drizzle' },
		{ code: 61, description: 'Slight rain' },
		{ code: 63, description: 'Moderate rain' },
		{ code: 65, description: 'Heavy rain' },
		{ code: 66, description: 'Light freezing rain' },
		{ code: 67, description: 'Heavy freezing rain' },
		{ code: 71, description: 'Slight snowfall' },
		{ code: 73, description: 'Moderate snowfall' },
		{ code: 75, description: 'Heavy snowfall' },
		{ code: 77, description: 'Snow grains' },
		{ code: 80, description: 'Slight rain showers' },
		{ code: 81, description: 'Moderate rain showers' },
		{ code: 82, description: 'Violent rain showers' },
		{ code: 85, description: 'Slight snow showers' },
		{ code: 86, description: 'Heavy snow showers' },
		{ code: 95, description: 'Thunderstorm' },
		{ code: 96, description: 'Thunderstorm with slight hail *' },
		{ code: 97, description: 'Heavy thunderstorm' },
		{ code: 99, description: 'Thunderstorm with heavy hail *' }
	];
</script>

<div class="mt-3 md:mt-6">
	<h3 class="text-xl md:text-2xl">WMO Weather interpretation codes (WW)</h3>
	<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
		<table class="docs-table min-w-100">
			<thead>
				<tr>
					<th scope="col">Code</th>
					<th scope="col">Description</th>
				</tr>
			</thead>
			<tbody>
				{#each weatherCodes as { code, description } (code)}
					<tr>
						<th scope="row">{code}</th>
						<td>{description}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p class="text-muted-foreground mt-2">
		(*) Codes 96 and 99 are only reported by models with an explicit hail forecast, such as DWD ICON
		or UKMO. All other models derive thunderstorms from instability parameters and report codes 95
		and 97.
	</p>
	<h4 class="mt-3 text-lg md:mt-6 md:text-xl">Weather code descriptions as JSON</h4>
	<p class="mt-2">
		The API only returns numeric weather codes. To display descriptions, map the codes on the
		client. The mapping below can be copied directly, including translations in German, Spanish,
		French and Italian.
	</p>
	<div class="mt-2 [&_pre]:max-h-96 [&_pre]:overflow-auto">
		<WmoCodesJson />
	</div>
</div>

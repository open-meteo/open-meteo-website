<script lang="ts">
	import WmoCodesJson from '$lib/components/code/docs/wmo-codes-json.svx';

	import { Button } from '$lib/components/ui/button';

	let jsonContainer: HTMLDivElement | undefined = $state();
	let jsonCopied = $state(false);

	const copyJson = () => {
		const pre = jsonContainer?.querySelector('pre');
		navigator.clipboard.writeText(pre?.textContent ?? '').catch(() => {});
		jsonCopied = true;
		setTimeout(() => {
			jsonCopied = false;
		}, 1250);
	};

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
		client. The mapping below can be copied directly.
	</p>
	<div bind:this={jsonContainer} class="group relative mt-2">
		<WmoCodesJson />
		<div
			class="pointer-events-none absolute top-2 right-2 opacity-0 duration-300 group-hover:pointer-events-auto group-hover:opacity-100"
		>
			<Button title="Copy to clipboard" onclick={copyJson}
				>{#if jsonCopied}<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg
					>{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.4"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-clipboard-copy-icon lucide-clipboard-copy"
						><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path
							d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
						/><path d="M16 4h2a2 2 0 0 1 2 2v4" /><path d="M21 14H11" /><path
							d="m15 10-4 4 4 4"
						/></svg
					>{/if}</Button
			>
		</div>
	</div>
</div>

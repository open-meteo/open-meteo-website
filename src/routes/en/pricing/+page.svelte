<script lang="ts">
	import MapPinned from 'lucide-svelte/icons/map-pinned';

	import { mode } from 'mode-watcher';
</script>

<svelte:head>
	<title>💰 Pricing | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/pricing" />
	<meta
		name="description"
		content="Open-Meteo offers a pricing structure that caters to both non-commercial and commercial users. Non-commercial use is free, with fair usage guidelines and attribution required. Commercial clients enjoy dedicated API servers, personalized support, and a commercial use license. The API price includes millions of API calls, with options to adjust the quantity based on your needs. Our API boasts excellent uptime, low latency, and flexible payment options. We provide transparent pricing, predictable costs, and flexible cancellation options for your convenience."
	/>
</svelte:head>

<div class="container mt-4">
	<div id="plans">
		<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
		{#if $mode === 'dark'}
			<stripe-pricing-table
				pricing-table-id="prctbl_1NL5gcLNZMSyEuRUSx6dv3vF"
				publishable-key="pk_live_51MJeWDLNZMSyEuRU9z4cAidPizoNKshAoYEoTCcD6f94ShOpnqwpShwYfgpPMfISmiXFLNWWM8u769epiIwaMeV900ZFxKd8rR"
			></stripe-pricing-table>
		{:else}
			<stripe-pricing-table
				class="row"
				pricing-table-id="prctbl_1MJg0iLNZMSyEuRUvpoeTHOb"
				publishable-key="pk_live_51MJeWDLNZMSyEuRU9z4cAidPizoNKshAoYEoTCcD6f94ShOpnqwpShwYfgpPMfISmiXFLNWWM8u769epiIwaMeV900ZFxKd8rR"
			></stripe-pricing-table>
		{/if}
	</div>

	<div class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-gradient-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<MapPinned size="36" strokeWidth={1.2} />
				</div>

				<h3 class="pl-3 text-2xl">Local And Global Models</h3>
			</div>

			<p class="mb-3">
				Open-Meteo brings together cutting-edge local (1 km resolution) and global (11 km) weather
				models sourced from renowned national weather services. This means you have access to the
				most accurate forecast for any location worldwide.
			</p>
			<p>
				National weather services include Deutscher Wetter Dienst (DWD), National Oceanic and
				Atmospheric Administration (NOAA), Meteofrance and Canadian Meteorological Center (CMC).
			</p>
		</div>
	</div>
</div>

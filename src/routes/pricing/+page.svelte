<script lang="ts">
	import MapPinned from 'lucide-svelte/icons/map-pinned';

	import { i18n } from '$lib/i18n';

	import Logo from '$lib/assets/icons/snow.svelte';

	import * as m from '$lib/paraglide/messages.js';

	import Button from '$lib/components/ui/button/button.svelte';

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

<div class="h-[500px]">
	<div
		class="absolute -z-10 h-full w-full"
		style="
          background-image: url('/images/snowy.webp');
          background-size: cover;
          background-position: center;
          height: 500px;
		  {$mode === 'dark' ? 'opacity: 0.80;' : ''}
        "
	></div>
	<div class="container flex h-full flex-col items-center justify-center gap-6 text-white">
		<Logo width="96" height="96" shadow={true} />
		<h1 class="text-shadow text-3xl font-light shadow-[rgba(0,0,0,0.7)] md:text-5xl">
			{m.pricing()}
		</h1>
		<div class="flex flex-col items-center justify-center gap-6 md:w-1/2">
			<p class="text-shadow text-center text-lg font-light shadow-[rgba(0,0,0,0.7)]">
				{m.pricing_description()}
			</p>
			<div class="mt-2 flex gap-4">
				<Button variant="default" href="#plans">API Plans</Button>
				<Button variant="outline-white" href={i18n.route('/docs')}>{m.docs()}</Button>
			</div>
		</div>
	</div>
</div>

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

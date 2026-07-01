<script lang="ts">
	import { mode } from 'mode-watcher';

	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	import Sun from '$lib/assets/icons/sun.svelte';

	import { additionalDaily, daily, hourly, minutely_15, models } from '../docs/options';
	import { timeSelectionOptions } from './options';

	let timeInput = $state('14');
	let variablesInput = $state(10);
	let modelsInput = $state(1);
	let locationsInput = $state(1);

	let timeSelection = $derived(timeSelectionOptions.find((fco) => fco.value == timeInput));

	let modelsFlat = models.flat();
	let variablesFlat = [
		...hourly.flat(),
		...daily.flat(),
		...additionalDaily.flat(),
		...minutely_15.flat()
	];

	let callWeight = $state(1.0);

	$effect(() => {
		/// Calculate adjusted weight
		const nVariablesModels = Number(variablesInput) * Math.max(Number(modelsInput), 1.0);
		const timeWeight = Number(timeInput) / 14.0;
		const variablesWeight = nVariablesModels / 10.0;
		const variableTimeWeight = Math.max(variablesWeight, timeWeight * variablesWeight);
		callWeight = Math.max(1.0, variableTimeWeight) * Number(locationsInput);
	});
</script>

<svelte:head>
	<title>💰 Pricing | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/pricing" />
	<meta
		name="description"
		content="Open-Meteo offers a pricing structure that caters to both non-commercial and commercial users. Non-commercial use is free, with fair usage guidelines and attribution required. Commercial clients enjoy dedicated API servers, personalized support, and a commercial use licence. The API price includes millions of API calls, with options to adjust the quantity based on your needs. Our API boasts excellent uptime, low latency, and flexible payment options. We provide transparent pricing, predictable costs, and flexible cancellation options for your convenience."
	/>
</svelte:head>

<div class="container mt-4 mb-12">
	<div id="plans" class="-mx-6 min-h-176.75 lg:mx-0">
		<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
		{#if mode.current === 'dark'}
			<stripe-pricing-table
				pricing-table-id="prctbl_1NL5gcLNZMSyEuRUSx6dv3vF"
				publishable-key="pk_live_51MJeWDLNZMSyEuRU9z4cAidPizoNKshAoYEoTCcD6f94ShOpnqwpShwYfgpPMfISmiXFLNWWM8u769epiIwaMeV900ZFxKd8rR"
			></stripe-pricing-table>
		{:else}
			<stripe-pricing-table
				pricing-table-id="prctbl_1MJg0iLNZMSyEuRUvpoeTHOb"
				publishable-key="pk_live_51MJeWDLNZMSyEuRU9z4cAidPizoNKshAoYEoTCcD6f94ShOpnqwpShwYfgpPMfISmiXFLNWWM8u769epiIwaMeV900ZFxKd8rR"
			></stripe-pricing-table>
		{/if}
	</div>

	<div class="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<svg
						class="lucide lucide-map-pinned"
						xmlns="http://www.w3.org/2000/svg"
						width="34"
						height="34"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.4"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path
							d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0"
						/>
						<circle cx="12" cy="8" r="2" />
						<path
							d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712"
						/>
					</svg>
				</div>

				<h3 class="pl-3 text-2xl">30+ Weather Models</h3>
			</div>

			<p>
				Weather models from ECMWF, DWD, NOAA, Météo-France, JMA, KMA, KNMI, DMI, MeteoSwiss, UK Met
				Office, BOM, CMA, GeoSphere Austria, and more. The <mark>best_match</mark> option automatically
				selects the highest-resolution model for any coordinates.
			</p>
			<p>
				Resolution ranges from 1–2 km (regional mesoscale) to 9–11 km (global). All output is
				normalised to hourly resolution.
			</p>
		</div>

		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<svg
						class="lucide lucide-zap"
						xmlns="http://www.w3.org/2000/svg"
						width="36"
						height="36"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path
							d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
						/>
					</svg>
				</div>

				<h3 class="pl-3 text-2xl">Commercial Use Licence</h3>
			</div>
			<p>
				A subscription grants a commercial use licence and an API key for the dedicated customer
				endpoint at <mark>customer-api.open-meteo.com</mark>. The API syntax is identical to the
				free tier — only the domain and key parameter differ.
			</p>
			<p>
				Use the free tier for evaluation and prototyping. For custom volume requirements or
				enterprise contracts, contact <a href="mailto:info@open-meteo.com">info@open-meteo.com</a>.
			</p>
		</div>
		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<svg
						class="lucide lucide-watch"
						xmlns="http://www.w3.org/2000/svg"
						width="36"
						height="36"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="6" />
						<polyline points="12 10 12 12 13 13" />
						<path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
						<path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
					</svg>
				</div>

				<h3 class="pl-3 text-2xl">High-Volume Usage</h3>
			</div>
			<p>
				Plans are priced on a monthly call budget, not per individual request. Standard: 1M
				calls/month. Professional: 5M calls/month. Enterprise: 50M+ calls/month.
			</p>
			<p>
				For workloads in the billions, self-hosting the open-source server is the practical path.
				Contact us for guidance on deployment and infrastructure sizing.
			</p>
		</div>
		<div class="feature col">
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<svg
						class="lucide lucide-archive"
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.4"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect width="20" height="5" x="2" y="3" rx="1" />
						<path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
						<path d="M10 12h4" />
					</svg>
				</div>

				<h3 class="pl-3 text-2xl">Uptime and Latency</h3>
			</div>
			<p>
				Paid plans run on reserved server instances with a 99.9% uptime target. Live status and
				incident history are at <a href="https://status.open-meteo.com/">status.open-meteo.com</a>.
			</p>
			<p>
				Servers are located in Europe and North America for low-latency access across both regions.
			</p>
		</div>
		<div class="feature col">
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<svg
						class="lucide lucide-waves"
						xmlns="http://www.w3.org/2000/svg"
						width="34"
						height="34"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.4"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path
							d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"
						/>
						<path
							d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"
						/>
						<path
							d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"
						/>
					</svg>
				</div>

				<h3 class="pl-3 text-2xl">Payment Options</h3>
			</div>
			<p>
				Payments via credit card, Apple Pay, Google Pay, SOFORT, or SEPA — processed through Stripe.
				A PDF invoice is issued on each billing cycle. Subscription details and payment method are
				managed in the <a href="https://dashboard.open-meteo.com/login">customer portal</a>.
			</p>
		</div>
		<div class="feature col">
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<svg
						class="lucide lucide-mountain-snow"
						xmlns="http://www.w3.org/2000/svg"
						width="34"
						height="34"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.3"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="m8 3 4 8 5-5 5 15H2L8 3z" />
						<path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" />
					</svg>
				</div>

				<h3 class="pl-3 text-2xl">Predictable Pricing</h3>
			</div>
			<p>
				Fixed monthly price — no per-call overages or surprise charges. Upgrade or downgrade at any
				time via the <a href="https://dashboard.open-meteo.com/login">customer portal</a>.
				Cancellation takes effect at the end of the current billing period.
			</p>
		</div>
	</div>

	<div class="mt-12 -mx-6 overflow-auto overflow-y-hidden md:ml-0 lg:mx-0">
		<table
			class="[&_tr]:border-border mx-6 mt-2 w-full min-w-260 caption-bottom text-left md:ml-0 lg:mx-0 [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
		>
			<thead>
				<tr>
					<th scope="col" style="width: 20%"> </th>
					<th scope="col" style="width: 20%">Free / Open-Access</th>
					<th scope="col" style="width: 20%">API Standard</th>
					<th scope="col" style="width: 20%">API Professional</th>
					<th scope="col" style="width: 20%">API Enterprise</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">Commercial use</th>
					<td>&#x274c;</td>
					<td>&#x2705;</td>
					<td>&#x2705; </td>
					<td>&#x2705; </td>
				</tr>
				<tr>
					<th scope="row">Minutely Limit</th>
					<td>&#x26a0;&#xfe0f; 600 calls / min</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
				</tr>
				<tr>
					<th scope="row">Hourly Limit</th>
					<td>&#x26a0;&#xfe0f; 5.000 calls / hour</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
				</tr>
				<tr>
					<th scope="row">Daily Limit</th>
					<td>&#x26a0;&#xfe0f; 10.000 calls / day</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
				</tr>
				<tr>
					<th scope="row">Monthly Limit</th>
					<td>&#x26a0;&#xfe0f; 300.000 calls / month</td>
					<td>&#x26a0;&#xfe0f; 1M calls / month</td>
					<td>&#x26a0;&#xfe0f; 5M calls / month</td>
					<td>&#x2705; >50M calls / month</td>
				</tr>
				<tr>
					<th scope="row"
						>Air Quality API<br />Elevation API<br />Flood API<br />Geocoding API<br />Marine API</th
					>
					<td>&#x2705;</td>
					<td>&#x2705;</td>
					<td>&#x2705;</td>
					<td>&#x2705;</td>
				</tr>
				<tr>
					<th scope="row"
						>Satellite Radiation API<br />Climate API<br />Seasonal Forecast API<br />Ensemble
						Weather API<br />Historical Weather API<br />Historical Forecast API<br />Previous Model
						Runs API<br />Single Runs API</th
					>
					<td>&#x2705;</td>
					<td>&#x274c;</td>
					<td>&#x2705;</td>
					<td>&#x2705;</td>
				</tr>
				<tr>
					<th scope="row">Reserved Servers With Higher Reliability</th>
					<td>&#x274c;</td>
					<td>&#x2705;</td>
					<td>&#x2705; </td>
					<td>&#x2705; </td>
				</tr>
				<tr>
					<th scope="row">Custom Solutions</th>
					<td>&#x274c;</td>
					<td>&#x274c;</td>
					<td>&#x274c; </td>
					<td>&#x2705; </td>
				</tr>
				<tr>
					<th scope="row">Priority Support</th>
					<td>&#x274c;</td>
					<td>&#x274c;</td>
					<td>&#x274c; </td>
					<td>&#x2705; </td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="mt-12 md:mt-24">
		<a href="#faq">
			<h2 id="faq" class="clickable text-center text-3xl font-light md:text-5xl">
				Frequently Asked Questions
			</h2>
		</a>
		<div class="mt-6 grid gap-x-2 gap-y-6 md:mt-12 md:grid-cols-2">
			<div>
				<h4 class="mb-3 text-2xl">How does the subscription process work?</h4>
				<p>
					Click a plan above to subscribe via Stripe. After checkout, an API key and PDF invoice are
					issued immediately. The key grants access to
					<mark>customer-api.open-meteo.com</mark>. Cancel, upgrade, or update payment details at
					any time in the
					<a href="https://dashboard.open-meteo.com/login">customer portal</a>.
				</p>
			</div>

			<div>
				<h4 class="mb-3 text-2xl">What happens if I exceed my monthly call volume?</h4>
				<p>
					Email alerts are sent at 80%, 90%, and 100% of your monthly budget. A usage dashboard is
					in development — until it is live, no hard cutoffs are enforced.
				</p>

				<Alert.Root variant="warning">
					<Alert.Description>
						A usage statistics portal is under development. Until it is available, monthly limits
						are not enforced.
					</Alert.Description>
				</Alert.Root>
			</div>

			<div>
				<h4 class="mb-3 text-2xl">What sets apart the free API from the customer API?</h4>
				<p>
					The free API is for non-commercial use, rate-limited to 10,000 calls/day, and carries no
					uptime guarantee. The customer API runs on dedicated servers, has no daily rate limit, and
					includes a commercial use licence.
				</p>
				<p>
					The customer endpoint is <mark>customer-api.open-meteo.com</mark>; requests include
					<mark>&apikey=abc123</mark>. All parameters and response formats are otherwise identical
					to the free API.
				</p>
			</div>

			<div>
				<h4 class="mb-3 text-2xl">
					Using the <mark>Standard API Plan</mark> can I use historical, climate and ensemble data?
				</h4>
				<p>
					Historical, climate, ensemble, and satellite radiation APIs require the <mark
						>Professional API Plan</mark
					>
					or higher. Upgrade via the
					<a href="https://dashboard.open-meteo.com/login">customer portal</a>.
				</p>
			</div>

			<div>
				<h4 class="mb-3 text-2xl">How is one API call defined?</h4>
				<p>
					Typically, one API call corresponds to one HTTP API request. However, if you select 200
					weather variables simultaneously and make extensive use of the API, the number of API
					calls can increase. Requests for data covering more than 10 weather variables or extending
					over a period of more than 2 weeks for a single location are considered multiple API
					calls.
				</p>
				<p>
					To calculate the number of API calls accurately, fractional counts are used. For example,
					a request for 2 weeks of data with 15 weather variables will be calculated as 1.5 API
					calls, while 4 weeks of data equals 3.0 API calls.
				</p>
				<p>
					This distinction is crucial for developing future features such as APIs for multiple
					locations simultaneously.
				</p>
				<div id="api-calls-calculator" class="flex items-center gap-2">
					<span>
						A request with the parameters selected below will cost
						<strong> {callWeight.toFixed(1)}</strong> API
						{callWeight === 1 ? 'call' : 'calls'}</span
					>
				</div>
				<div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
					<div class="relative flex flex-col gap-2 duration-200">
						<Input
							class="h-12 pt-6"
							type="number"
							defaultValue="5"
							step="1"
							min="1"
							max={variablesFlat.length - 1}
							bind:value={variablesInput}
						/>
						<Label
							class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
							for="longitude">Variables</Label
						>
						{#if variablesInput > variablesFlat.length - 1}
							<span class="text-red-600"
								>There is a maximum of {variablesFlat.length - 1} variables</span
							>
						{/if}
					</div>
					<div class="relative">
						<Select.Root name="forecast_days" type="single" bind:value={timeInput}>
							<Select.Trigger
								aria-label="Forecast days input"
								class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{timeSelection?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each timeSelectionOptions as tso (tso.value)}
									<Select.Item class="cursor-pointer" value={tso.value}>{tso.label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
								>Time length</Label
							>
						</Select.Root>
					</div>
					<div class="relative flex flex-col gap-2 duration-200">
						<Input
							class="h-12 pt-6"
							type="number"
							defaultValue="1"
							step="1"
							min="1"
							max={modelsFlat.length - 1}
							bind:value={modelsInput}
						/>
						<Label
							class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
							for="longitude">Models</Label
						>

						{#if modelsInput > modelsFlat.length - 1}
							<span class="text-red-600">There is a maximum of {modelsFlat.length - 1} models</span>
						{/if}
					</div>
					<div class="relative flex flex-col gap-2 duration-200">
						<Input
							class="h-12 pt-6"
							type="number"
							defaultValue="1"
							step="1"
							min="1"
							bind:value={locationsInput}
						/>
						<Label
							class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
							for="longitude">Locations</Label
						>
					</div>
				</div>
			</div>

			<div>
				<h4 class="mb-3 text-2xl">Is it necessary to provide attribution to Open-Meteo?</h4>
				<p>
					Open-Meteo relies on open data that is licenced under <a
						href="https://creativecommons.org/licenses/by/4.0/"
						target="_blank">Attribution 4.0 International (CC BY 4.0)</a
					>. This licence mandates giving appropriate credit and indicating any modifications made
					to the data. While you are permitted to utilise and distribute the data, including for
					commercial purposes, attribution is a requirement under this licence. For more
					information, please refer to the <a href="/en/licence">licence page</a>.
				</p>
			</div>
		</div>
	</div>

	<div class="my-12 mb-24 flex flex-col items-center justify-center md:mx-auto md:w-2/3">
		<Sun width="92" height="92" shadow={false} />
		<h2 class="my-4 text-center text-3xl font-light md:text-5xl" id="contact">
			Unlock the Power of Open-Source Weather Data!
		</h2>
		<div class="text-center">
			<p class="text-lg font-light">
				Subscriptions fund the infrastructure, data ingestion pipelines, and ongoing development
				behind the API. The server code is open-source under AGPLv3; the weather data is CC BY 4.0.
			</p>
			<p>
				Commercial plans add a dedicated endpoint, an API key, and a 99.9% uptime target. For custom
				volume requirements or enterprise contracts, contact <a href="mailto:info@open-meteo.com"
					>info@open-meteo.com</a
				>.
			</p>
			<div class="mt-4 flex justify-center gap-4">
				<Button href="#plans" title="Newsletter Sign-Up">API Plans</Button>
				<Button variant="outline" href="mailto:info@open-meteo.com">Email us</Button>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { mode } from 'mode-watcher';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Alert from '$lib/components/ui/alert';

	import Sun from '$lib/assets/icons/sun.svelte';
</script>

<svelte:head>
	<title>💰 Pricing | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/pricing" />
	<meta
		name="description"
		content="Open-Meteo offers a pricing structure that caters to both non-commercial and commercial users. Non-commercial use is free, with fair usage guidelines and attribution required. Commercial clients enjoy dedicated API servers, personalized support, and a commercial use license. The API price includes millions of API calls, with options to adjust the quantity based on your needs. Our API boasts excellent uptime, low latency, and flexible payment options. We provide transparent pricing, predictable costs, and flexible cancellation options for your convenience."
	/>
</svelte:head>

<div class="container mb-12 mt-4">
	<div id="plans" class="-mx-6 min-h-[668px] lg:mx-0">
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

	<div class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
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

				<h3 class="pl-3 text-2xl">Local And Global Models</h3>
			</div>

			<p>
				Open-Meteo brings together cutting-edge local (1 km resolution) and global (11 km) weather
				models sourced from renowned national weather services. This means you have access to the
				most accurate forecast for any location worldwide.
			</p>
			<p>
				National weather services include Deutscher Wetter Dienst (DWD), National Oceanic and
				Atmospheric Administration (NOAA), Meteofrance and Canadian Meteorological Center (CMC).
			</p>
		</div>

		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
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

				<h3 class="pl-3 text-2xl">Commercial Use License</h3>
			</div>
			<p>
				Commercial clients enjoy the advantages of dedicated API servers and personalized support.
				If you have any inquiries or require assistance, please feel free to reach out to us at <a
					href="mailto:info@open-meteo.com">info@open-meteo.com</a
				>.
			</p>
			<p>
				During the evaluation, prototyping, and development stages, we encourage you to utilize the
				free tier. However, for your production system, we will provide you with an API key to
				ensure that your application reliably receives weather data.
			</p>
		</div>
		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
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

				<h3 class="pl-3 text-2xl">Large API Call Volume</h3>
			</div>
			<p>
				The API price includes millions of API calls, and you will not be billed for each individual
				API call. We suggest updating the weather forecast API every hour to achieve optimal
				accuracy.
			</p>
			<p>
				If you anticipate a higher volume of API calls, you have the option to adjust the quantity
				of the API professional plan, doubling or even tripling the number of monthly API calls.
			</p>
			<p>
				If you anticipate billions or more API calls, we recommend self-hosting the API. Feel free
				to reach out to us, and we will provide assistance and support for your self-hosting needs!
			</p>
		</div>
		<div class="feature col">
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
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

				<h3 class="pl-3 text-2xl">Excellent Uptime, Low Latency</h3>
			</div>
			<p>
				Our API is built with top-tier servers and redundant data centers to ensure exceptional
				availability, reaching 99.9% uptime. You can monitor the real-time statistics at:
				<a href="https://status.open-meteo.com/">https://status.open-meteo.com/</a>.
			</p>
			<p>
				To provide low latency and increased redundancy, our servers are strategically located in
				Europe and North America. We are also planning to introduce additional servers in Asia soon.
			</p>
		</div>
		<div class="feature col">
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
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

				<h3 class="pl-3 text-2xl">Flexible Payment Options</h3>
			</div>
			<p>
				We offer a range of payment methods to suit your preferences. You can make payments using
				credit cards, Apple Pay, Google Pay, SOFORT, or SEPA. Once you complete the purchase, you
				will receive a PDF invoice, and you have the freedom to cancel your subscription at any
				time. All payment transactions and subscriptions are securely processed through Stripe, and
				you can conveniently manage your subscription details in the <a
					href="https://billing.stripe.com/p/login/00gbIQ79OcpM9eEbII">customer portal</a
				>.
			</p>
		</div>
		<div class="feature col">
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
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

				<h3 class="pl-3 text-2xl">Transparent Pricing, Flexible Cancellation</h3>
			</div>
			<p>
				Our API subscription comes with a predictable cost, ensuring that you won't encounter any
				unexpected overcharges. The subscription price remains fixed throughout your usage. If you
				require additional API calls, you have the freedom to upgrade your API subscription at any
				time through the <a href="https://billing.stripe.com/p/login/00gbIQ79OcpM9eEbII"
					>customer portal</a
				>. We strive to provide you with complete control and flexibility over your subscription.
			</p>
		</div>
	</div>

	<div class="mt-6 md:mt-12 overflow-auto overflow-y-hidden -mx-6 md:ml-0 lg:mx-0">
		<table
			class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1040px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
				<!-- <tr>
					<th scope="row">Concurrency</th>
					<td>&#x26a0;&#xfe0f; 5 max.</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
				</tr> -->
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
						>Satellite Radiation API<br />Climate API<br />Ensemble Weather API<br />Historical
						Weather API<br />Historical Forecast API<br />Previous Model Runs API</th
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

	<div class="mt-12 md:mt-24" id="faq">
		<h2 id="faq" class="text-center text-5xl font-light">Frequently Asked Questions</h2>

		<div class="mt-6 grid gap-x-2 gap-y-6 md:mt-12 md:grid-cols-2">
			<div>
				<h4 class="mb-3 text-2xl">How does the subscription process work?</h4>
				<p>
					To subscribe, you can sign up using a credit card by clicking on the subscription button
					above. Once you complete the subscription, you will immediately receive an API key and a
					PDF invoice. This API key allows you to access the dedicated API instances for customers.
					If you ever wish to cancel your subscription, you can do so at any time through the <a
						href="https://billing.stripe.com/p/login/00gbIQ79OcpM9eEbII">customer portal</a
					>.
				</p>
			</div>

			<div>
				<h4 class="mb-3 text-2xl">What happens if I exceed my monthly call volume?</h4>
				<p>
					If you approach 80%, 90%, or 100% of your monthly call volume, you will receive email
					notifications to keep you informed. However, due to the ample number of API calls
					provided, it is unlikely that you will reach this limit.
				</p>

				<Alert.Root variant="warning">
					<Alert.Description>
						🚧 👷 Please note that a web portal with API usage statistics is currently under
						development. Until it is available, you will not face any limitations on your usage.
					</Alert.Description>
				</Alert.Root>
			</div>

			<div>
				<h4 class="mb-3 text-2xl">What sets apart the free API from the customer API?</h4>
				<p>
					The free API is accessible to everyone for non-commercial purposes and does not come with
					any service guarantees. On the other hand, the customer API is specifically designed for
					commercial use, offering dedicated API server instances to ensure sufficient resources and
					reliable API performance.
				</p>
				<p>
					To differentiate between the two, the customer API uses distinct domains such as <mark
						>customer-api.open-meteo.com</mark
					>
					and includes API keys in the URL, denoted as <mark>&apikey=abc123</mark>. Apart from these
					variations, the syntax of the customer API remains identical to the free API.
				</p>
			</div>

			<div>
				<h4 class="mb-3 text-2xl">
					Using the <mark>Standard API Plan</mark> can I use historical, climate and ensemble data?
				</h4>
				<p>
					Access to historical, climate, and ensemble data is limited to the <mark
						>Professional API Plan</mark
					>. If you are interested in utilizing this data, you can easily upgrade your subscription
					by visiting the
					<a href="https://billing.stripe.com/p/login/00gbIQ79OcpM9eEbII">customer portal</a>
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
			</div>

			<div>
				<h4 class="mb-3 text-2xl">Is it necessary to provide attribution to Open-Meteo?</h4>
				<p>
					Open-Meteo relies on open data that is licensed under <a
						href="https://creativecommons.org/licenses/by/4.0/"
						target="_blank">Attribution 4.0 International (CC BY 4.0)</a
					>. This license mandates giving appropriate credit and indicating any modifications made
					to the data. While you are permitted to utilize and distribute the data, including for
					commercial purposes, attribution is a requirement under this license. For more
					information, please refer to the <a href="/en/license">license page</a>.
				</p>
			</div>
		</div>
	</div>

	<div class="my-12 mb-24 flex flex-col items-center justify-center md:mx-auto md:w-2/3">
		<Sun width="92" height="92" shadow={false} />
		<h2 class="my-4 text-4xl font-light" id="contact">
			Unlock the Power of Open-Source Weather Data!
		</h2>
		<div class="text-center">
			<p>
				Subscribe to our open-source API service and be a part of a thriving community that promotes
				development, innovation, and collaboration. By joining us, you contribute to the ongoing
				maintenance and enhancement of our service, ensuring its availability for everyone.
			</p>
			<p>
				With access to comprehensive open-data weather forecasts, you can fuel your projects,
				research endeavors, and educational initiatives with accurate and reliable information. Our
				commitment to an open-source ecosystem allows you to explore, modify, and build upon our
				API, fostering endless possibilities and empowering your creativity.
			</p>
			<p>
				By subscribing, you directly support the continuous development of our service, enabling us
				to invest in cutting-edge technologies and expand our data sources. Together, we can push
				the boundaries of weather prediction, drive advancements in various industries, and make a
				positive impact on the world.
			</p>
			<p>
				Join us now and embrace the power of open-source. Together, let's create a future where
				knowledge is freely shared, collaboration thrives, and innovation knows no bounds. Subscribe
				today and be part of this exciting journey!
			</p>
			<div class="mt-4 flex justify-center gap-4">
				<Button href="#plans" title="Newsletter Sign-Up">API Plans</Button>
				<Button variant="outline" href="mailto:info@open-meteo.com">Email us</Button>
			</div>
		</div>
	</div>
</div>

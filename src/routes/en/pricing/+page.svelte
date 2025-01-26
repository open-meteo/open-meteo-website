<script lang="ts">
	import { mode } from 'mode-watcher';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Alert from '$lib/components/ui/alert';

	import Zap from 'lucide-svelte/icons/zap';
	import Watch from 'lucide-svelte/icons/watch';
	import Waves from 'lucide-svelte/icons/waves';
	import Archive from 'lucide-svelte/icons/archive';
	import MapPinned from 'lucide-svelte/icons/map-pinned';
	import MountainSnow from 'lucide-svelte/icons/mountain-snow';

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
						class="absolute h-14 w-14 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
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

		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<Zap size="32" strokeWidth={1.1} />
				</div>

				<h3 class="pl-3 text-2xl">Commercial Use License</h3>
			</div>
			<p class="mb-3">
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
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<Watch size="36" strokeWidth={1.2} />
				</div>

				<h3 class="pl-3 text-2xl">Large API Call Volume</h3>
			</div>
			<p class="mb-3">
				The API price includes millions of API calls, and you will not be billed for each individual
				API call. We suggest updating the weather forecast API every hour to achieve optimal
				accuracy.
			</p>
			<p class="mb-3">
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
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<Archive size="34" strokeWidth={1.3} />
				</div>

				<h3 class="pl-3 text-2xl">Excellent Uptime, Low Latency</h3>
			</div>
			<p class="mb-3">
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
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<Waves size="34" strokeWidth={1.4} />
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
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<MountainSnow size="34" strokeWidth={1.3} />
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

	<div class="mt-12 md:mt-24" id="faq">
		<h2 id="weathervariables" class="text-center text-5xl font-light">
			Frequently Asked Questions
		</h2>

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
				<p class="mb-3">
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
					calls can increase. Therefore, API queries that involve more than 10 weather variables or
					more than 7 days of data are considered more than just one API call.
				</p>
				<p>
					To calculate the number of API calls accurately, fractional counts are used. For example,
					15 weather variables count as 1.5 API calls, while 4 weeks of weather data count as 3.0
					API calls.
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
			<p class="mb-3">
				Subscribe to our open-source API service and be a part of a thriving community that promotes
				development, innovation, and collaboration. By joining us, you contribute to the ongoing
				maintenance and enhancement of our service, ensuring its availability for everyone.
			</p>
			<p class="mb-3">
				With access to comprehensive open-data weather forecasts, you can fuel your projects,
				research endeavors, and educational initiatives with accurate and reliable information. Our
				commitment to an open-source ecosystem allows you to explore, modify, and build upon our
				API, fostering endless possibilities and empowering your creativity.
			</p>
			<p class="mb-3">
				By subscribing, you directly support the continuous development of our service, enabling us
				to invest in cutting-edge technologies and expand our data sources. Together, we can push
				the boundaries of weather prediction, drive advancements in various industries, and make a
				positive impact on the world.
			</p>
			<p class="mb-3">
				Join us now and embrace the power of open-source. Together, let's create a future where
				knowledge is freely shared, collaboration thrives, and innovation knows no bounds. Subscribe
				today and be part of this exciting journey!
			</p>
			<div class="mt-4 flex justify-center gap-4">
				<Button href="#plans" title="Newsletter Sign-Up">API Plans</Button>
				<Button variant="outline-grey" href="mailto:info@open-meteo.com">Email us</Button>
			</div>
		</div>
	</div>
</div>

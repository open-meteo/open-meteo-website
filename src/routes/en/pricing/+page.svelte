<svelte:head>
	<title>Pricing | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/pricing" />
</svelte:head>

<div
	class="px-4 py-5 text-center text-white"
	style="
            background-image: url('/images/snowy.webp');
            background-size: cover;
            background-position: center;
            height: 500px;
          "
>
	<svg
		style="filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7));"
		xmlns="http://www.w3.org/2000/svg"
		width="96"
		height="96"
		fill="currentColor"
		class="bi bi-cloud-rain mb-4"
		viewBox="0 0 16 16"
	>
		<path
			d="M2.625 11.5a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm2.75 2a.25.25 0 0 1 .25.25v.57l.5-.287a.25.25 0 0 1 .249.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm5.5 0a.25.25 0 0 1 .25.25v.57l.5-.287a.25.25 0 0 1 .249.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 0 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm-2.75-2a.25.25 0 0 1 .25.25v.57l.5-.287a.25.25 0 0 1 .249.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm5.5 0a.25.25 0 0 1 .25.25v.57l.5-.287a.25.25 0 0 1 .249.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 0 1-.5 0v-.57l-.501.287a.25.25 0 1 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25zm-.22-7.223a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10.25H13a3 3 0 0 0 .405-5.973z"
		/>
	</svg>
	<h1 class="display-5" style="text-shadow: 3px 3px 2px rgba(0, 0, 0, .7);">Pricing</h1>
	<div class="col-lg-6 mx-auto">
		<p class="lead mb-4" style="text-shadow: 3px 3px 2px rgba(0, 0, 0, .7);">
			Commercial use license, support and dedicated API capacity
		</p>
		<div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
			<a href="#plans" class="btn button btn-primary btn-lg px-4 me-sm-3">API Plans</a>
			<a href="#faq" class="btn btn-outline-light btn-lg px-4">FAQ</a>
		</div>
	</div>
</div>

<div class="container px-4 py-3" id="plans">
	<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
	<stripe-pricing-table
		class="row"
		pricing-table-id="prctbl_1MJg0iLNZMSyEuRUvpoeTHOb"
		publishable-key="pk_live_51MJeWDLNZMSyEuRU9z4cAidPizoNKshAoYEoTCcD6f94ShOpnqwpShwYfgpPMfISmiXFLNWWM8u769epiIwaMeV900ZFxKd8rR"
	/>
</div>

<div class="container px-4 py-2">
	<div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
		<div class="feature col">
			<div class="feature-icon bg-primary bg-gradient">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="currentColor"
					class="bi bi-pin-map"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8l3-4z"
					/>
					<path
						fill-rule="evenodd"
						d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"
					/>
				</svg>
			</div>
			<h2>Free for non-commercial</h2>
			<p>
				Open-Meteo APIs are free for non-commercial use. We do not restrict access, but ask for fair
				use and attribution.
			</p>
			<p>
				Kindly ensure that your daily requests remain below 10,000. Please note that we retain the
				right to block applications and IP addresses that misuse our service. For additional
				information, please refer to the <a href="/en/terms">terms and conditions</a>.
			</p>
		</div>
		<div class="feature col">
			<div class="feature-icon bg-primary bg-gradient">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="currentColor"
					class="bi bi-lightning"
					viewBox="0 0 16 16"
				>
					<path
						d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5zM6.374 1 4.168 8.5H7.5a.5.5 0 0 1 .478.647L6.78 13.04 11.478 7H8a.5.5 0 0 1-.474-.658L9.306 1H6.374z"
					/>
				</svg>
			</div>
			<h2>Commercial Use License</h2>
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
		<div class="feature col">
			<div class="feature-icon bg-primary bg-gradient">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="currentColor"
					class="bi bi-watch"
					viewBox="0 0 16 16"
				>
					<path d="M8.5 5a.5.5 0 0 0-1 0v2.5H6a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V5z" />
					<path
						d="M5.667 16C4.747 16 4 15.254 4 14.333v-1.86A5.985 5.985 0 0 1 2 8c0-1.777.772-3.374 2-4.472V1.667C4 .747 4.746 0 5.667 0h4.666C11.253 0 12 .746 12 1.667v1.86a5.99 5.99 0 0 1 1.918 3.48.502.502 0 0 1 .582.493v1a.5.5 0 0 1-.582.493A5.99 5.99 0 0 1 12 12.473v1.86c0 .92-.746 1.667-1.667 1.667H5.667zM13 8A5 5 0 1 0 3 8a5 5 0 0 0 10 0z"
					/>
				</svg>
			</div>
			<h2>Large API Call Volume</h2>
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
			<div class="feature-icon bg-primary bg-gradient">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="currentColor"
					class="bi bi-archive"
					viewBox="0 0 16 16"
				>
					<path
						d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"
					/>
				</svg>
			</div>
			<h2>Excellent Uptime, Low Latency</h2>
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
			<div class="feature-icon bg-primary bg-gradient">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="currentColor"
					class="bi bi-tsunami"
					viewBox="0 0 16 16"
				>
					<path
						d="M.036 12.314a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.757-.703a.5.5 0 0 1-.278-.65zm0 2a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.757-.703a.5.5 0 0 1-.278-.65zM2.662 8.08c-.456 1.063-.994 2.098-1.842 2.804a.5.5 0 0 1-.64-.768c.652-.544 1.114-1.384 1.564-2.43.14-.328.281-.68.427-1.044.302-.754.624-1.559 1.01-2.308C3.763 3.2 4.528 2.105 5.7 1.299 6.877.49 8.418 0 10.5 0c1.463 0 2.511.4 3.179 1.058.67.66.893 1.518.819 2.302-.074.771-.441 1.516-1.02 1.965a1.878 1.878 0 0 1-1.904.27c-.65.642-.907 1.679-.71 2.614C11.076 9.215 11.784 10 13 10h2.5a.5.5 0 0 1 0 1H13c-1.784 0-2.826-1.215-3.114-2.585-.232-1.1.005-2.373.758-3.284L10.5 5.06l-.777.388a.5.5 0 0 1-.447 0l-1-.5a.5.5 0 0 1 .447-.894l.777.388.776-.388a.5.5 0 0 1 .447 0l1 .5a.493.493 0 0 1 .034.018c.44.264.81.195 1.108-.036.328-.255.586-.729.637-1.27.05-.529-.1-1.076-.525-1.495-.426-.42-1.19-.77-2.477-.77-1.918 0-3.252.448-4.232 1.123C5.283 2.8 4.61 3.738 4.07 4.79c-.365.71-.655 1.433-.945 2.16-.15.376-.301.753-.463 1.13z"
					/>
				</svg>
			</div>
			<h2>Flexible Payment Options</h2>
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
			<div class="feature-icon bg-primary bg-gradient">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="currentColor"
					class="bi bi-cloud-haze2"
					viewBox="0 0 512 512"
				>
					<path
						d="M503 394L280 44C275 36 265 32 256 32C247 32 237 36 232 44L9 394C-2 411 -3 433 7 451C17 469 36 480 56 480H456C476 480 495 469 505 451C515 433 514 411 503 394ZM256 66L347 208H256C251 208 246 210 243 214L208 261L173 214C171 212 168 210 165 209L256 66ZM477 436C473 443 465 448 456 448H56C47 448 39 443 35 436C31 428 31 418 36 411L145 240H152L195 298C198 302 203 304 208 304S218 302 221 298L264 240H367L476 411C481 418 481 428 477 436Z"
					/>
				</svg>
			</div>
			<h2>Transparent Pricing, Flexible Cancellation</h2>
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
</div>

<div class="container px-4 py-5 mt-5" id="faq">
	<h2 id="weathervariables" class="text-center pb-2 display-5">Frequently Asked Questions</h2>

	<div class="row row-cols-1 row-cols-lg-2 g-4 py-5">
		<div class="col d-flex align-items-start">
			<div>
				<h3 class="mb-0">How does the subscription process work?</h3>
				<p>
					To subscribe, you can sign up using a credit card by clicking on the subscription button
					above. Once you complete the subscription, you will immediately receive an API key and a
					PDF invoice. This API key allows you to access the dedicated API instances for customers.
					If you ever wish to cancel your subscription, you can do so at any time through the <a
						href="https://billing.stripe.com/p/login/00gbIQ79OcpM9eEbII">customer portal</a
					>.
				</p>
			</div>
		</div>
		<div class="col d-flex align-items-start">
			<div>
				<h3 class="mb-0">What happens if I exceed my monthly call volume?</h3>
				<p>
					If you approach 80%, 90%, or 100% of your monthly call volume, you will receive email
					notifications to keep you informed. However, due to the ample number of API calls
					provided, it is unlikely that you will reach this limit.
				</p>
				<!--<p>To get more calls, you can upgrade your API subscription in the <a
                        href="https://billing.stripe.com/p/login/00gbIQ79OcpM9eEbII">customer portal</a>. For high
                    volume API quotas, please get in touch!</p>-->
				<div class="alert alert-warning" role="alert">
					🚧 👷 Please note that a web portal with API usage statistics is currently under
					development. Until it is available, you will not face any limitations on your usage.
				</div>
			</div>
		</div>
		<div class="col d-flex align-items-start">
			<div>
				<h3 class="mb-0">What sets apart the free API from the customer API?</h3>
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
		</div>
		<div class="col d-flex align-items-start">
			<div>
				<h3 class="mb-0">
					Using the <mark>Standard API Plan</mark> can I use historical, climate and ensemble data?
				</h3>
				<p>
					Access to historical, climate, and ensemble data is limited to the <mark
						>Professional API Plan</mark
					>. If you are interested in utilizing this data, you can easily upgrade your subscription
					by visiting the
					<a href="https://billing.stripe.com/p/login/00gbIQ79OcpM9eEbII">customer portal</a>
				</p>
			</div>
		</div>
		<div class="col d-flex align-items-start">
			<div>
				<h3 class="mb-0">How is one API call defined?</h3>
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
		</div>

		<div class="col d-flex align-items-start">
			<div>
				<h3 class="mb-0">Is it necessary to provide attribution to Open-Meteo?</h3>
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
</div>

<div class="px-4 py-3 text-center">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="128"
		height="128"
		fill="currentColor"
		class="bi bi-cloud-sun mb-4"
		viewBox="0 0 16 16"
	>
		<path
			d="M7 8a3.5 3.5 0 0 1 3.5 3.555.5.5 0 0 0 .624.492A1.503 1.503 0 0 1 13 13.5a1.5 1.5 0 0 1-1.5 1.5H3a2 2 0 1 1 .1-3.998.5.5 0 0 0 .51-.375A3.502 3.502 0 0 1 7 8zm4.473 3a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 16h8.5a2.5 2.5 0 0 0 0-5h-.027z"
		/>
		<path
			d="M10.5 1.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1zm3.743 1.964a.5.5 0 1 0-.707-.707l-.708.707a.5.5 0 0 0 .708.708l.707-.708zm-7.779-.707a.5.5 0 0 0-.707.707l.707.708a.5.5 0 1 0 .708-.708l-.708-.707zm1.734 3.374a2 2 0 1 1 3.296 2.198c.199.281.372.582.516.898a3 3 0 1 0-4.84-3.225c.352.011.696.055 1.028.129zm4.484 4.074c.6.215 1.125.59 1.522 1.072a.5.5 0 0 0 .039-.742l-.707-.707a.5.5 0 0 0-.854.377zM14.5 6.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"
		/>
	</svg>

	<div class="col-lg-6 mx-auto">
		<h3 id="contact" class="display-5">Unlock the Power of Open-Source Weather Data!</h3>
		<p class="lead mb-4">
			Subscribe to our open-source API service and be a part of a thriving community that promotes
			development, innovation, and collaboration. By joining us, you contribute to the ongoing
			maintenance and enhancement of our service, ensuring its availability for everyone.
		</p>
		<p>
			With access to comprehensive open-data weather forecasts, you can fuel your projects, research
			endeavors, and educational initiatives with accurate and reliable information. Our commitment
			to an open-source ecosystem allows you to explore, modify, and build upon our API, fostering
			endless possibilities and empowering your creativity.
		</p>
		<p>
			By subscribing, you directly support the continuous development of our service, enabling us to
			invest in cutting-edge technologies and expand our data sources. Together, we can push the
			boundaries of weather prediction, drive advancements in various industries, and make a
			positive impact on the world.
		</p>
		<p>
			Join us now and embrace the power of open-source. Together, let's create a future where
			knowledge is freely shared, collaboration thrives, and innovation knows no bounds. Subscribe
			today and be part of this exciting journey!
		</p>
		<div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
			<a class="btn btn-primary btn-lg px-4 gap-3" href="#plans">API Plans</a>
			<a href="mailto:info@open-meteo.com" class="btn btn-outline-secondary btn-lg px-4">Email us</a
			>
		</div>
	</div>
</div>

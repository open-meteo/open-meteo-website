<script lang="ts">
	import { fade } from 'svelte/transition';

	import Github from 'simple-icons/icons/github.svg?raw';

	import { Button } from '$lib/components/ui/button';

	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

	import WeatherApiCodeBlock from '$lib/components/code/home/weather-api.svx';
	import WeatherApiCurlBlock from '$lib/components/code/home/weather-api-curl.svx';

	import Last10DaysCodeBlock from '$lib/components/code/home/last-10-days.svx';
	import Last10DaysCurlBlock from '$lib/components/code/home/last-10-days-curl.svx';

	import HistoricalWeatherCodeBlock from '$lib/components/code/home/historical-weather.svx';
	import HistoricalWeatherCurlBlock from '$lib/components/code/home/historical-weather-curl.svx';

	let tabSelected = $state('weather-api');
</script>

<svelte:head>
	<title>🌤️ Free Open-Source Weather API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/" />
	<meta
		name="description"
		content="Open-Source ☀️️️️️️️️️️️️️️️️️️️️️️️️️️️️️ Weather API with free access for non-commercial use. No API Key required ✅. Accurate weather forecasts for any location. Open-Meteo provides high-resolution open data ranging from 1 to 11 kilometers from national weather services. With a user-friendly JSON API, integrating weather data has never been easier. Experience the precision and convenience of Open-Meteo's Forecast API for reliable and comprehensive weather information worldwide."
	/>
</svelte:head>

<div class="container mt-8 lg:mt-16">
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<h2 class="mb-3 text-3xl font-light md:mb-5 lg:text-5xl">
				Accurate Weather Forecasts for Any Location
			</h2>
			<p>
				Open-Meteo partners with national weather services to bring you open data with high
				resolution, ranging from 1 to 11 kilometers. Our powerful APIs intelligently select the most
				suitable weather models for your specific location, ensuring accurate and reliable
				forecasts.
			</p>
			<p>
				With our user-friendly JSON API, accessing weather data has never been easier. Whether
				you're developing an application or seeking weather information for personal use, our APIs
				provide seamless integration and deliver the data you need in a simple and accessible
				format.
			</p>
			<p>
				Experience the precision and convenience of Open-Meteo's Forecast API, providing
				comprehensive weather information worldwide. Stay informed and make informed decisions with
				our reliable weather forecasts.
			</p>
			<div class="mt-4 flex gap-4">
				<Button
					variant="default"
					class="bg-linear-to-t dark:bg-linear-to-b bg-primary from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
					href="/en/features">See features</Button
				>
				<Button variant="outline" href="/en/docs">Read the docs</Button>
			</div>
		</div>

		<div class="-mx-6 md:mx-0 rounded-lg bg-[#FAFAFA] p-6 duration-200 dark:bg-[#212121]">
			<ToggleGroup.Root
				type="single"
				bind:value={tabSelected}
				class="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start justify-start gap-0"
			>
				<ToggleGroup.Item
					value="weather-api"
					class="opacity-100! truncate min-h-12 cursor-pointer sm:rounded-e-none lg:min-h-[unset]"
					aria-label="Toggle bold"
					disabled={tabSelected === 'weather-api'}
				>
					Forecast & Current
				</ToggleGroup.Item>
				<ToggleGroup.Item
					value="last-10-days"
					class="opacity-100! truncate min-h-12 cursor-pointer sm:rounded-none lg:min-h-[unset]"
					aria-label="Toggle italic"
					disabled={tabSelected === 'last-10-days'}
				>
					Last 10 days
				</ToggleGroup.Item>
				<ToggleGroup.Item
					value="historical-weather"
					class="opacity-100! truncate min-h-12 cursor-pointer sm:rounded-s-none lg:min-h-[unset]"
					aria-label="Toggle strikethrough"
					disabled={tabSelected === 'historical-weather'}
				>
					Historical data
				</ToggleGroup.Item>
			</ToggleGroup.Root>
			<div class="relative min-h-[530px] overflow-auto lg:min-h-[495px]">
				{#if tabSelected === 'weather-api'}
					<div in:fade class="group w-full">
						<Button
							variant="ghost"
							class="curl h-[96px] p-0 !bg-transparent mt-2 md:mt-4 [&_span]:bg-transparent!"
							href="https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
						>
							<WeatherApiCurlBlock />
						</Button>
						<div class="code-numbered -mx-4 md:mx-0 mt-4 md:mt-6 [&_.shiki]:pt-0!">
							<WeatherApiCodeBlock />
						</div>
					</div>
				{:else if tabSelected === 'last-10-days'}
					<div in:fade class="group w-full">
						<Button
							variant="ghost"
							class="curl h-[96px] p-0 !bg-transparent mt-2 md:mt-4 [&_span]:bg-transparent!"
							href="https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&past_days=10&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
						>
							<Last10DaysCurlBlock />
						</Button>
						<div class="code-numbered -mx-4 md:mx-0 mt-4 md:mt-6 [&_.shiki]:pt-0!">
							<Last10DaysCodeBlock />
						</div>
					</div>
				{:else if tabSelected === 'historical-weather'}
					<div in:fade class="group w-full">
						<Button
							variant="ghost"
							class="curl h-[96px] p-0 !bg-transparent mt-2 md:mt-4 [&_span]:bg-transparent!"
							href="https://archive-api.open-meteo.com/v1/era5?latitude=52.52&longitude=13.41&start_date=2021-01-01&end_date=2021-12-31&hourly=temperature_2m"
						>
							<HistoricalWeatherCurlBlock />
						</Button>

						<div class="code-numbered -mx-4 md:mx-0 mt-4 md:mt-6 [&_.shiki]:pt-0!">
							<HistoricalWeatherCodeBlock />
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div id="featured">
		<div class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
					>
						<div
							class="bg-linear-to-t dark:bg-linear-to-b absolute h-12 w-12 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:to-[rgba(0,0,0,0.2)]"
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

					<h3 class="pl-3 text-2xl">High Resolution</h3>
				</div>

				<p>
					Open-Meteo leverages a powerful combination of global (11 km) and mesoscale (1 km) weather
					models from esteemed national weather services, providing comprehensive forecasts with
					remarkable precision. No matter where you are in the world, you can access the most
					reliable and accurate weather predictions available.
				</p>
				<p>
					Our weather data is presented in hourly resolution, allowing you to plan your activities
					with confidence. The initial days of the forecast benefit from localized weather models,
					offering highly detailed and accurate information. Subsequently, global weather models
					provide forecasts for up to 16 days. Through seamless integration, our APIs deliver a
					straightforward and reliable hourly weather forecast experience.
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
					>
						<div
							class="bg-linear-to-t dark:bg-linear-to-b absolute h-12 w-12 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:to-[rgba(0,0,0,0.2)]"
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

					<h3 class="pl-3 text-2xl">Rapid Updates</h3>
				</div>
				<p>
					At Open-Meteo, we understand the importance of having the most up-to-date weather
					information. That's why our local weather models are updated every hour, ensuring that our
					forecasts reflect the latest changes in conditions, including updates from rain radars.
				</p>
				<p>
					Our weather models rely on a wealth of real-time data, including measurements from various
					sources such as airplanes, buoys, radar systems, and satellites. By incorporating this
					diverse and comprehensive data, our numerical weather predictions provide a deeper
					analysis than traditional weather stations, resulting in more accurate forecasts.
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
					>
						<div
							class="bg-linear-to-t dark:bg-linear-to-b absolute h-12 w-12 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:to-[rgba(0,0,0,0.2)]"
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

					<h3 class="pl-3 text-2xl">80 Years Historical Data</h3>
				</div>

				<p>
					Explore the past with our comprehensive <a
						href="/en/docs/historical-weather-api"
						title="Historical weather data via API">Historical Weather API</a
					>. With over 80 years of hourly weather data available at a 10 kilometer resolution, you
					can dive into the climate of any location. Behind the scenes, this extensive dataset,
					comprising 50 TB of information, enables you to access temperature records spanning eight
					decades in an instant.
				</p>
				<p>
					Moreover, our 1 kilometer weather models continuously archive recent data, ensuring that
					you can seamlessly retrieve the latest forecasts alongside historical information from
					previous weeks. This functionality opens up possibilities for training machine learning
					applications and gaining valuable insights from the combination of present and past
					weather data. Discover the power of our historical weather API and unlock a treasure trove
					of weather information.
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
					>
						<div
							class="bg-linear-to-t dark:bg-linear-to-b absolute h-12 w-12 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:to-[rgba(0,0,0,0.2)]"
						></div>
						<div class="absolute h-8 w-8 fill-white">{@html Github}</div>
					</div>

					<h3 class="pl-3 text-2xl">Open-Source</h3>
				</div>
				<p>
					We believe in the power of open-source software. That's why the entire codebase of
					Open-Meteo is accessible on <a
						href="https://github.com/open-meteo/open-meteo"
						title="Open-Meteo GitHub respository">GitHub</a
					>, released under the
					<a href="https://github.com/open-meteo/open-meteo/blob/main/LICENSE">AGPLv3 licence</a>.
					This means you can explore, use, modify, and contribute to the code.
				</p>
				<p>
					If you wish to take it a step further, we're here to support you in setting up your own
					API instances. This allows you to have complete control and enjoy practically unlimited
					API calls, making it ideal for demanding applications like machine learning or large
					language models.
				</p>
				<p>
					In addition, our data is licensed under <a
						href="https://creativecommons.org/licenses/by/4.0/"
						title="CC BY 4.0 Licence Information">Attribution 4.0 International (CC BY 4.0)</a
					>. This means you are free to share and adapt the data, even for commercial purposes. We
					believe in fostering an open ecosystem that encourages transparency, collaboration and
					innovation.
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
					>
						<div
							class="bg-linear-to-t dark:bg-linear-to-b absolute h-12 w-12 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:to-[rgba(0,0,0,0.2)]"
						></div>
						<svg
							class="lucide lucide-key-round"
							xmlns="http://www.w3.org/2000/svg"
							width="30"
							height="30"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
							/>
							<circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
						</svg>
					</div>

					<h3 class="pl-3 text-2xl">Free API</h3>
				</div>
				<p>
					Open-Meteo offers free access to its APIs for non-commercial use, making it convenient for
					individuals and developers to explore and integrate weather data into their projects. The
					best part is that no API key, registration, or credit card is required to enjoy this
					service.
				</p>

				<p>
					We trust our users to utilize the free API responsibly and kindly request appropriate
					credit for the data used. While there are no strict access restrictions, we encourage fair
					usage of the service. If you require commercial usage or anticipate exceeding 10'000 API
					calls per day, we recommend considering our <a
						href="/en/pricing"
						title="Pricing for our paid API subscription">API subscription</a
					> for enhanced features and support.
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
					>
						<div
							class="bg-linear-to-t dark:bg-linear-to-b absolute h-12 w-12 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:to-[rgba(0,0,0,0.2)]"
						></div>
						<svg
							class="lucide lucide-lightbulb"
							xmlns="http://www.w3.org/2000/svg"
							width="33"
							height="33"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
							/>
							<path d="M9 18h6" />
							<path d="M10 22h4" />
						</svg>
					</div>

					<h3 class="pl-3 text-2xl">Easy to Use</h3>
				</div>
				<p>
					We've designed our APIs to be incredibly user-friendly. They are based on the widely
					adopted HTTP protocol and utilize the simplicity of JSON data format. All you need to get
					started is a basic understanding of geographic coordinates, making HTTP requests, and
					working with JSON data.
				</p>
				<p>
					To assist you in seamlessly integrating our APIs into your projects, we provide
					comprehensive <a href="/en/docs" title="Weather API Technical Documentation"
						>documentation</a
					>. It includes detailed explanations of all parameters and their usage. Whether you're
					using Python, R, Julia, PHP, JavaScript, React, Flutter, Java, or any other programming
					language, our APIs are designed to work effortlessly with your application.
				</p>
			</div>
		</div>
	</div>

	<div class="my-12 mb-24 flex flex-col items-center justify-center">
		<svg
			class="lucide lucide-mailbox"
			xmlns="http://www.w3.org/2000/svg"
			width="72"
			height="72"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.35"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
			<polyline points="15,9 18,9 18,11" />
			<path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2" />
			<line x1="6" x2="7" y1="10" y2="10" />
		</svg>
		<h2 class="mb-4 text-4xl font-bold" id="contact">Stay up to date!</h2>
		<div class="text-center">
			<p>
				We're constantly evolving and expanding. We're dedicated to providing you with the <a
					href="/en/features"
					title="All Features of the Weather API">latest features</a
				>, weather variables, and data sources. If you want to stay in the loop and be the first to
				know about our exciting updates, we invite you to subscribe to our
				<a href="https://openmeteo.substack.com/archive?sort=new" target="_blank">blog</a>
				or follow us on <a href="https://x.com/open_meteo" target="_blank">X</a>. By doing so,
				you'll never miss out on the latest developments and enhancements in our services.
			</p>
			<div class="mt-4 flex justify-center gap-4">
				<Button
					class="bg-linear-to-t dark:bg-linear-to-b bg-primary from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
					href="https://openmeteo.substack.com/subscribe?utm_source=landingpage&simple=true&next=https%3A%2F%2Fopenmeteo.substack.com%2F"
					title="Newsletter Sign-Up">Subscribe to the Newsletter</Button
				>
				<Button variant="outline" href={'/en/features#available-apis'} title="APIs & Features"
					>Available APIs</Button
				>
			</div>
		</div>
	</div>
</div>

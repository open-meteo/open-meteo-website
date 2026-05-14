<script lang="ts">
	import { fade } from 'svelte/transition';

	import Github from 'simple-icons/icons/github.svg?raw';

	import HistoricalWeatherCurlBlock from '$lib/components/code/home/historical-weather-curl.svx';
	import HistoricalWeatherCodeBlock from '$lib/components/code/home/historical-weather.svx';
	import Last10DaysCurlBlock from '$lib/components/code/home/last-10-days-curl.svx';
	import Last10DaysCodeBlock from '$lib/components/code/home/last-10-days.svx';
	import WeatherApiCurlBlock from '$lib/components/code/home/weather-api-curl.svx';
	import WeatherApiCodeBlock from '$lib/components/code/home/weather-api.svx';

	import { Button } from '$lib/components/ui/button';

	let tabSelected = $state('weather-api');
</script>

<svelte:head>
	<title>🌤️ Free Open-Source Weather API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/" />
	<meta
		name="description"
		content="Open-Source ☀️️️️️️️️️️️️️️️️️️️️️️️️️️️️️ Weather API with free access for non-commercial use. No API Key required ✅. Accurate weather forecasts for any location. Open-Meteo provides high-resolution open data ranging from 1 to 11 kilometres from national weather services. With a user-friendly JSON API, integrating weather data has never been easier. Experience the precision and convenience of Open-Meteo's Forecast API for reliable and comprehensive weather information worldwide."
	/>
</svelte:head>

<div class="container mt-8 lg:mt-16">
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<h2 class="mb-3 text-3xl font-light md:mb-5 md:text-5xl">
				Free weather API — forecasts to archives, no sign-up
			</h2>
			<ul class="mt-1 list-disc pl-5 text-base">
				<li>
					<strong>30+ NWP models</strong> from ECMWF, NOAA, DWD, Météo-France, JMA, KMA, KNMI, DMI, MeteoSwiss,
					UK Met Office, BOM, CMA, and more — globally, up to 1 km resolution
				</li>
				<li>
					<strong>ERA5 reanalysis</strong> from January 1940, hourly, spatially complete — no missing
					values
				</li>
				<li>
					<strong>Historical forecast archive</strong> from 2021 — identical format to the live Forecast
					API, ready for bias-correction pipelines
				</li>
				<li>
					<strong>Archived individual model runs</strong> by init time — for ML post-processing without
					look-ahead bias; ECMWF IFS HRES available from March 2024
				</li>
				<li>Simple JSON API — HTTP GET, no authentication, CC BY 4.0 data licence</li>
			</ul>
			<div class="mt-4 flex gap-4">
				<Button
					variant="default"
					class="bg-primary bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					href="/en/features">See features</Button
				>
				<Button variant="outline" href="/en/docs">Read the docs</Button>
			</div>
		</div>

		<div class="-mx-6 rounded-lg bg-[#FAFAFA] p-6 duration-200 md:mx-0 dark:bg-[#212121]">
			<div class="flex">
				<div class="border-border flex flex-col rounded-md border lg:flex-row">
					<Button
						variant="ghost"
						class="items-center gap-1 rounded-b-none opacity-100! duration-300 lg:rounded-e-none lg:rounded-t {tabSelected ===
						'weather-api'
							? 'bg-accent cursor-not-allowed'
							: ''}"
						disabled={tabSelected === 'weather-api'}
						onclick={() => {
							tabSelected = 'weather-api';
						}}
					>
						Forecast & Current
					</Button>
					<Button
						variant="ghost"
						class="items-center gap-1 rounded-none opacity-100! duration-300 {tabSelected ===
						'last-10-days'
							? 'bg-accent cursor-not-allowed'
							: ''}"
						disabled={tabSelected === 'last-10-days'}
						onclick={() => {
							tabSelected = 'last-10-days';
						}}
					>
						Last 10 Days
					</Button>
					<Button
						variant="ghost"
						class="items-center gap-1 rounded-t-none opacity-100! duration-300 lg:rounded-s-none lg:rounded-e  {tabSelected ===
						'historical-weather'
							? 'bg-accent cursor-not-allowed'
							: ''}"
						disabled={tabSelected === 'historical-weather'}
						onclick={() => {
							tabSelected = 'historical-weather';
						}}
					>
						Historical Data
					</Button>
				</div>
			</div>

			<div class="pregenerated-code relative min-h-[530px] overflow-auto lg:min-h-[495px]">
				{#if tabSelected === 'weather-api'}
					<div in:fade class="group w-full">
						<Button
							variant="ghost"
							class="curl mt-2 h-[96px] !bg-transparent p-0 md:mt-4 [&_span]:bg-transparent!"
							href="https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
						>
							<WeatherApiCurlBlock />
						</Button>
						<div class="code-numbered -mx-4 mt-4 md:mx-0 md:mt-6 [&_pre]:pt-0!">
							<WeatherApiCodeBlock />
						</div>
					</div>
				{:else if tabSelected === 'last-10-days'}
					<div in:fade class="group w-full">
						<Button
							variant="ghost"
							class="curl mt-2 h-[96px] !bg-transparent p-0 md:mt-4 [&_span]:bg-transparent!"
							href="https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&past_days=10&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
						>
							<Last10DaysCurlBlock />
						</Button>
						<div class="code-numbered -mx-4 mt-4 md:mx-0 md:mt-6 [&_pre]:pt-0!">
							<Last10DaysCodeBlock />
						</div>
					</div>
				{:else if tabSelected === 'historical-weather'}
					<div in:fade class="group w-full">
						<Button
							variant="ghost"
							class="curl mt-2 h-[96px] !bg-transparent p-0 md:mt-4 [&_span]:bg-transparent!"
							href="https://archive-api.open-meteo.com/v1/era5?latitude=52.52&longitude=13.41&start_date=2021-01-01&end_date=2021-12-31&hourly=temperature_2m"
						>
							<HistoricalWeatherCurlBlock />
						</Button>

						<div class="code-numbered -mx-4 mt-4 md:mx-0 md:mt-6 [&_pre]:pt-0!">
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
							class="absolute h-12 w-12 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
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
					NWP models from over 15 national weather services — ECMWF, DWD, NOAA, Météo-France, JMA,
					KMA, KNMI, DMI, MeteoSwiss, UK Met Office, BOM, CMA, and GeoSphere Austria. The
					<mark>best_match</mark> option automatically picks the highest-resolution model for any location.
					Individual models can be selected directly for model comparisons or model-specific pipelines.
				</p>
				<p>
					Resolution ranges from 1–2 km (regional mesoscale models) to 9–11 km (global models). All
					output is normalised to hourly resolution and optimised to the requested coordinates.
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
					>
						<div
							class="absolute h-12 w-12 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
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

					<h3 class="pl-3 text-2xl">Frequent Updates</h3>
				</div>
				<p>
					Most global models update every 6 hours. High-resolution regional models such as ICON-D2,
					HRRR, and AROME update every 1–3 hours. Each update ingests the latest observations from
					weather stations, radiosondes, aircraft, radar, and satellites.
				</p>
				<p>
					15-minutely data is available for Central Europe and North America, interpolated from
					hourly model output elsewhere.
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
					>
						<div
							class="absolute h-12 w-12 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
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

					<h3 class="pl-3 text-2xl">Multiple Historical Data Layers</h3>
				</div>

				<p>Four complementary historical datasets — each suited to a different use case:</p>
				<ul class="mt-1 list-disc pl-5">
					<li>
						<strong><a href="/en/docs/historical-weather-api" class="text-link underline">ERA5 reanalysis</a></strong> — 1940 to present,
						0.1–0.25°, gap-free global grid. For climate baselines and long-range ML training.
					</li>
					<li>
						<strong
							><a href="/en/docs/historical-forecast-api" class="text-link underline">Historical Forecast archive</a></strong
						> — from 2021, same format as the live Forecast API. For bias-correction and post-processing
						pipelines.
					</li>
					<li>
						<strong><a href="/en/docs/previous-runs-api" class="text-link underline">Previous Runs API</a></strong> — continuous time
						series at a fixed lead-time offset of 1–7 days, from January 2024. For lead-time-stratified
						skill analysis.
					</li>
					<li>
						<strong><a href="/en/docs/single-runs-api" class="text-link underline">Single Runs API</a></strong> — archived individual
						runs by exact init time. ECMWF IFS HRES from March 2024. For ML post-processing without look-ahead
						bias and operational backtesting.
					</li>
				</ul>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
					>
						<div
							class="absolute h-12 w-12 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
						></div>
						<div class="absolute h-8 w-8 fill-white">{@html Github}</div>
					</div>

					<h3 class="pl-3 text-2xl">Open-Source</h3>
				</div>
				<p>
					The full server codebase is on <a
						href="https://github.com/open-meteo/open-meteo"
						title="Open-Meteo GitHub Repository">GitHub</a
					>
					under the
					<a href="https://github.com/open-meteo/open-meteo/blob/main/LICENSE">AGPLv3 licence</a>.
					You can self-host your own instance for unlimited API calls — useful for high-volume ML
					workloads or air-gapped environments.
				</p>
				<p>
					All data served by the API is licenced under <a
						href="https://creativecommons.org/licenses/by/4.0/"
						title="CC BY 4.0 Licence">CC BY 4.0</a
					> — free to use and redistribute, including for commercial purposes, with attribution.
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
					>
						<div
							class="absolute h-12 w-12 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
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
					No API key, no sign-up, no credit card. Non-commercial use up to 10,000 daily API calls is
					free. Attribution is required under the CC BY 4.0 data licence.
				</p>
				<p>
					For commercial use or higher call volumes, <a
						href="/en/pricing"
						title="API subscription plans">subscription plans</a
					> are available with rate-limit increases and priority support.
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
					>
						<div
							class="absolute h-12 w-12 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
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

					<h3 class="pl-3 text-2xl">Simple JSON API</h3>
				</div>
				<p>
					All APIs use plain HTTP GET requests with query parameters and return JSON. No SDK or
					authentication is required for non-commercial use. Parameters are consistent across
					forecast and historical weather APIs — the same variable names, unit options, and output
					formats work everywhere.
				</p>
				<p>
					CSV and XLSX output formats are also available. Multiple locations can be queried in a
					single request by providing comma-separated coordinate lists. Full parameter reference is
					in the <a href="/en/docs" title="Weather API Technical Documentation">documentation</a>.
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
		<h2 class="mb-4 text-3xl font-bold md:text-5xl" id="contact">Stay informed</h2>
		<div class="text-center">
			<p class="text-lg font-light">
				New models, variables, and APIs are announced on the
				<a href="https://openmeteo.substack.com/archive?sort=new" target="_blank">blog</a>
				and <a href="https://x.com/open_meteo" target="_blank">X</a>. Subscribe to get release notes
				and changelog updates.
			</p>
			<div class="mt-4 flex justify-center gap-4">
				<Button
					class="bg-primary bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					href="https://openmeteo.substack.com/subscribe?utm_source=landingpage&simple=true&next=https%3A%2F%2Fopenmeteo.substack.com%2F"
					title="Newsletter Sign-Up">Subscribe to the Newsletter</Button
				>
				<Button variant="outline" href="/en/features#available_apis" title="APIs & Features"
					>Available APIs</Button
				>
			</div>
		</div>
	</div>
</div>

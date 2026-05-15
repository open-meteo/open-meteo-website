<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<svelte:head>
	<title>⚡️ Features | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/features" />
	<meta
		name="description"
		content="Open-Meteo provides free weather forecast and historical weather APIs with global coverage, up to 1 km resolution, and 80+ years of reanalysis data. Includes specialised APIs for historical forecasts, individual model runs, ensembles, climate projections, marine, air quality, and floods."
	/>
</svelte:head>

<div class="container my-12">
	<div class="mt-6 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-2 xl:grid-cols-3">
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
				Open-Meteo integrates numerical weather prediction models from over 15 national weather
				services, including ECMWF, DWD, NOAA, Météo-France, JMA, KMA, KNMI, DMI, MeteoSwiss, UK Met
				Office, BOM, CMA, and GeoSphere Austria.
			</p>
			<p>
				The <mark>best_match</mark> option automatically selects the most suitable high-resolution model
				for any location. Individual models can also be selected directly, enabling model-specific workflows
				and comparisons.
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

				<h3 class="pl-3 text-2xl">Up to 1 km Resolution</h3>
			</div>

			<p>
				The API selects the highest-resolution model available for each location. In Central Europe,
				France, Switzerland, the UK, and North America, high-resolution models at 1–2 km are used
				for the first few days of the forecast. Global models at 9–11 km cover the remainder of the
				forecast horizon worldwide.
			</p>
			<p>
				All data is optimised to the requested coordinates and normalised to a consistent hourly
				time step, regardless of the native model resolution or output interval.
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

				<h3 class="pl-3 text-2xl">Frequent Updates</h3>
			</div>
			<p>
				Most global models are updated every 6 hours. High-resolution regional models such as
				ICON-D2, HRRR, and AROME update every 1–3 hours. Each update ingests the latest observations
				from weather stations, radiosondes, aircraft, radar, and satellites.
			</p>
			<p>
				15-minutely data is available for Central Europe and North America, interpolated from hourly
				model output elsewhere.
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
			<p>
				Open-Meteo provides four distinct historical data products, each suited to different use
				cases:
			</p>
			<ul class="mt-1 list-disc pl-5">
				<li>
					<strong>Weather reanalysis</strong> back to 1940 — climate analysis and long-range baselines
				</li>
				<li>
					<strong>Historical Forecast archive</strong> from ~2021 — seamless weather model time series
					matching the live forecast API
				</li>
				<li>
					<strong>Previous Runs API</strong> — continuous time series at a fixed lead-time offset of 1–7
					days, from January 2024
				</li>
				<li>
					<strong>Single Runs API</strong> — archived individual runs from September 2025 (ECMWF IFS HRES
					from March 2024)
				</li>
			</ul>
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

				<h3 class="pl-3 text-2xl">Specialised Forecasts</h3>
			</div>
			<p>
				Beyond standard surface variables, the APIs provide: solar radiation (including global
				tilted irradiance for arbitrary panel orientation), wind at multiple altitudes (10 m to 300
				m+), pressure levels (1000–10 hPa), soil moisture and temperature at multiple depths, ocean
				waves, air quality with pollen, and ensemble probabilistic forecasts.
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
						class="lucide lucide-calendar-range"
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
						<rect width="18" height="18" x="3" y="4" rx="2" />
						<path d="M16 2v4" />
						<path d="M3 10h18" />
						<path d="M8 2v4" />
						<path d="M17 14h-6" />
						<path d="M13 18H7" />
					</svg>
				</div>

				<h3 class="pl-3 text-2xl">Seasonal Forecasts</h3>
			</div>
			<p>
				The <a href="/en/docs/seasonal-forecast-api">Seasonal Forecast API</a> provides ECMWF SEAS5 forecasts
				out to 9 months and sub-seasonal ECMWF EC46 forecasts out to 6 weeks, both at 36 km resolution
				with 51 ensemble members.
			</p>
			<p>
				The ensemble spread represents uncertainty at these extended horizons. Data are not
				bias-corrected and should be interpreted as probabilistic area guidance — whether the coming
				weeks or months are likely to be warmer, colder, wetter, or drier than the climatological
				average.
			</p>
		</div>
	</div>

	<!-- HISTORICAL DATA FOR AI -->
	<div class="mt-16">
		<a href="#historical_data">
			<h2 id="historical_data" class="clickable mb-8 text-center text-3xl font-light md:text-5xl">
				Historical Weather Data for AI and Research
			</h2>
		</a>
		<p class="text-center text-lg font-light">
			Training weather post-processing models, backtesting energy forecasts, and measuring weather
			model skill all require different types of historical data. Open-Meteo provides four
			complementary APIs covering distinct use cases.
		</p>

		<div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="border-border rounded-lg border p-6">
				<h3 class="mb-1 text-2xl font-bold">
					<a href="/en/docs/historical-weather-api">Weather Reanalysis — back to 1940</a>
				</h3>
				<p class="text-muted-foreground mb-3 text-sm">Historical Weather API</p>
				<p>
					ERA5 and ERA5-Land reanalysis data from the European Centre for Medium-Range Weather
					Forecasts (ECMWF) covers the globe at 9–25 km resolution with hourly data from January
					1940 to the present. Unlike weather station data, reanalysis provides spatially complete,
					consistent coverage with no missing values.
				</p>
				<p class="mt-2">
					This is the standard dataset for climate baselines, anomaly detection, long-range
					correlations, and training models where decades of labelled examples are needed. The API
					delivers data lightning-fast — a multi-decade time series for a single location returns in
					under 100 ms.
				</p>
			</div>

			<div class="border-border rounded-lg border p-6">
				<h3 class="mb-1 text-2xl font-bold">
					<a href="/en/docs/historical-forecast-api">Historical Forecast Archive — from 2021</a>
				</h3>
				<p class="text-muted-foreground mb-3 text-sm">Historical Forecast API</p>
				<p>
					The Historical Forecast API archives the initial hours of each weather model update into a
					seamless, continuously updated time series — the same data structure as the live Forecast
					API. This makes it directly comparable to real operational forecasts.
				</p>
				<p class="mt-2">
					This is the right dataset when you need weather model output that is consistent with the
					live forecast for training bias-correction and post-processing models: the historical
					archive and real-time forecast use the same variables, units, and time alignment. Data is
					available for all models supported by the Forecast API.
				</p>
			</div>

			<div class="border-border rounded-lg border p-6">
				<h3 class="mb-1 text-2xl font-bold">
					<a href="/en/docs/previous-runs-api">Previous Model Runs — from January 2024</a>
				</h3>
				<p class="text-muted-foreground mb-3 text-sm">Previous Runs API</p>
				<p>
					The Previous Runs API provides time-series data at a fixed lead-time offset from 1 to 7
					days. Instead of returning individual runs in full, it returns a continuous time series
					where each value was forecast exactly N days in advance — e.g. a `_previous_day2` series
					contains only values taken from the run initialised 48 hours before valid time. Data is
					available from January 2024.
				</p>
				<p class="mt-2">
					This makes it straightforward to compute systematic forecast error (bias) at each lead
					time, compare model skill across offsets, and build training datasets where the forecast
					horizon is a controlled variable.
				</p>
			</div>

			<div class="border-border rounded-lg border p-6">
				<h3 class="mb-1 text-2xl font-bold">
					<a href="/en/docs/single-runs-api">Single Runs Archive — from September 2025</a>
				</h3>
				<p class="text-muted-foreground mb-3 text-sm">Single Runs API</p>
				<p>
					The Single Runs API provides access to archived individual model runs, selected by their
					exact initialisation time via the <mark>run=</mark> parameter. Each run covers the full forecast
					horizon, typically 7–10 days. ECMWF IFS HRES at native 9 km resolution is available from March
					2024 via hindcasts.
				</p>
				<p class="mt-2">
					This is the correct dataset for: training weather post-processing models without
					look-ahead bias (each training sample is a single run paired with verifying observations);
					reconstructing the exact forecast available at a past decision time for energy trading or
					grid operation backtests; and run-level model intercomparison across providers.
				</p>
			</div>
		</div>
	</div>

	<!-- AVAILABLE APIS -->
	<div class="mt-16">
		<a href="#available_apis">
			<h2 id="available_apis" class="clickable mb-8 text-center text-3xl font-light md:text-5xl">
				Available APIs
			</h2>
		</a>
		<p class="text-center text-lg font-light">
			All APIs share the same JSON format and parameter conventions. Switching between them requires
			only a change of hostname or endpoint.
		</p>

		<div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs">Forecast API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">Up to 16-day forecast</h4>
				<p>
					Hourly and daily weather forecasts for any global location. Returns temperature, wind,
					precipitation, solar radiation, soil variables, and more. Supports multiple models or
					automatic best-match selection. Past days parameter provides seamless access to recent
					history without switching endpoints.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs/historical-weather-api">Historical Weather API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">ERA5 reanalysis since 1940</h4>
				<p>
					ERA5 and ERA5-Land data at hourly resolution from January 1940 to present. Global coverage
					at 9–25 km with no missing data. Used for climate analysis, anomaly detection, and as
					ground truth for training machine learning models.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs/historical-forecast-api">Historical Forecast API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">Weather archive from 2021</h4>
				<p>
					Seamless archive of weather forecast model output, built by continuously storing the
					initial-hours data from each model update. The format is identical to the live Forecast
					API, making it the standard dataset for training bias-correction and post-processing
					pipelines.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs/previous-runs-api">Previous Runs API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">
					Fixed lead-time series from January 2024
				</h4>
				<p>
					Returns a continuous time series where every value was forecast at a fixed lead-time
					offset of 1–7 days. Available from January 2024. Suited for systematic bias analysis,
					lead-time-stratified ML training, and operational forecast skill assessment.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs/single-runs-api">Single Runs API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">Archived runs from Sept 2025</h4>
				<p>
					Access any individual archived model run by its initialisation time using the
					<mark>run=</mark> parameter. ECMWF IFS HRES at 9 km is available from March 2024. Required for
					bias-free ML training on (forecast, observation) pairs and for backtesting operational decision
					workflows.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs/ensemble-api">Ensemble API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">Probabilistic forecasts</h4>
				<p>
					Access ensemble forecasts from ECMWF IFS ENS, GFS ENS, ICON EPS, GEM EPS, and others, with
					up to 51 members and a 35-day horizon. Returns each member individually, enabling
					probability distributions, percentiles, and spread calculations.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs/climate-api">Climate Change API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">CMIP6 projections to 2050</h4>
				<p>
					CMIP6 climate model output downscaled to 10 km resolution and statistically bias-corrected
					against ERA5. Daily resolution from 1950 to 2050 under multiple emissions scenarios.
					Suitable for long-range climate risk assessment and adaptation planning.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs/marine-weather-api">Marine Weather API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">Ocean wave forecasts</h4>
				<p>
					Wave height, period, and direction from global and regional ocean wave models. Covers open
					ocean and coastal areas, with forecasts updated every 6 hours.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs/air-quality-api">Air Quality API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">Pollution and pollen</h4>
				<p>
					Hourly forecasts for PM2.5, PM10, NO₂, O₃, SO₂, CO, dust, UV index, and pollen (grass,
					birch, alder) from the Copernicus Atmosphere Monitoring Service (CAMS) with global and
					European coverage.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs/flood-api">Flood API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">River discharge forecasts</h4>
				<p>
					Ensemble river discharge forecasts from the Global Flood Awareness System (GloFAS),
					providing probabilistic flood guidance for rivers worldwide up to 30 days ahead.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs/seasonal-forecast-api">Seasonal Forecast API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">ECMWF SEAS5 out to 9 months</h4>
				<p>
					ECMWF SEAS5 seasonal forecasts to 9 months and EC46 sub-seasonal forecasts to 6 weeks,
					both at 36 km resolution with 51 ensemble members. Data are not bias-corrected and should
					be interpreted as probabilistic area guidance for anomaly direction, not as precise local
					values.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs/satellite-radiation-api">Satellite Radiation API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">
					Observed solar radiation from 1983
				</h4>
				<p>
					Shortwave and direct radiation derived from geostationary satellite imagery rather than
					weather models. Sources include EUMETSAT CM SAF SARAH3 (Europe, Africa, South America,
					from 1983), JMA Himawari-9 (Asia, Australia, from 2015), and DWD MTG (Europe, Africa, from
					February 2026) at 2.5–5 km resolution with 10–30 minute intervals. Suited for solar energy
					yield analysis and forecast bias assessment.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs/geocoding-api">Geocoding API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">Place name to coordinates</h4>
				<p>
					Resolves city and place names to WGS84 coordinates, country, timezone, and elevation.
					Supports partial name search in multiple languages with ranked results.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">
					<a href="/en/docs/elevation-api">Elevation API</a>
				</h3>
				<h4 class="mb-3 text-lg font-light text-muted-foreground">
					Terrain height from coordinates
				</h4>
				<p>
					Returns terrain elevation in metres for any set of WGS84 coordinates using a 90 m
					resolution digital elevation model. Accepts batches of up to 100 coordinate pairs per
					request.
				</p>
			</div>
		</div>
	</div>

	<div class="mt-16">
		<a href="#technical">
			<h2 id="technical" class="clickable mb-8 text-center text-3xl font-light md:text-5xl">
				Technical Properties
			</h2>
		</a>
	</div>

	<div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-12 min-w-12 items-center justify-center rounded-xl text-white md:h-14 md:min-w-14"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<svg
						class="lucide lucide-gauge"
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
						<path d="m12 14 4-4" />
						<path d="M3.34 19a10 10 0 1 1 17.32 0" />
					</svg>
				</div>

				<h3 class="pl-3 text-2xl">Low Latency</h3>
			</div>
			<p>
				Weather data is stored on NVMe disks in columnar time-series format. A typical forecast
				request for a single location returns in under 10 ms. Historical requests spanning decades
				return in under 100 ms. Servers operate in Europe and North America.
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
				authentication is required for non-commercial use. Parameters are consistent across all
				endpoints: the same variable names, unit options, and output formats work everywhere.
			</p>
			<p>
				CSV and XLSX output formats are also available. Multiple locations can be queried in a
				single request by providing comma-separated coordinate lists.
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
						class="lucide lucide-file-check"
						xmlns="http://www.w3.org/2000/svg"
						width="34"
						height="34"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
						<path d="M14 2v4a2 2 0 0 0 2 2h4" />
						<path d="m9 15 2 2 4-4" />
					</svg>
				</div>

				<h3 class="pl-3 text-2xl">Stable API</h3>
			</div>
			<p>
				APIs follow semantic versioning. Breaking changes are introduced only as new major versions,
				with the previous version kept available for a transition period. All changes are documented
				in the
				<a href="https://github.com/open-meteo/open-meteo" target="_blank" rel="noopener noreferrer"
					>GitHub repository</a
				>.
			</p>
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
		<h2 class="mb-4 text-3xl font-bold md:text-5xl" id="contact">Get started</h2>
		<div class="text-center">
			<p class="mb-4 text-lg font-light">
				The <a href="/en/docs">API documentation</a> covers all parameters with examples. For
				commercial use, see the
				<a href="/en/pricing" title="API Subscription Plans">subscription plans</a>. Bug reports and
				feature requests go through the
				<a
					href="https://github.com/open-meteo/open-meteo"
					title="GitHub Repository"
					target="_blank"
					rel="noopener noreferrer">GitHub repository</a
				>.
			</p>
			<div class="mt-4 flex justify-center gap-4">
				<Button href="/en/pricing" title="API Pricing">API Pricing</Button>
				<Button variant="outline" href="mailto:info@open-meteo.com">Email us</Button>
			</div>
		</div>
	</div>
</div>

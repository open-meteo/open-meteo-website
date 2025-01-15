<script lang="ts">
	import Zap from 'lucide-svelte/icons/zap';
	import Watch from 'lucide-svelte/icons/watch';
	import MapPinned from 'lucide-svelte/icons/map-pinned';

	import { mode } from 'mode-watcher';

	import { i18n } from '$lib/i18n';

	import Logo from '$lib/assets/icons/rain.svelte';

	import * as m from '$lib/paraglide/messages.js';

	import Button from '$lib/components/ui/button/button.svelte';
</script>

<svelte:head>
	<title>⚡️ Features | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/features" />
	<meta
		name="description"
		content="Open-Meteo offers feature rich and simple JSON APIs with global coverage and up to 1 km resolution. Get started today and access the most accurate weather forecasts worldwide. Our APIs combine cutting-edge local and global models from renowned national weather services. Stay up-to-date with hourly updates and utilize 80 years of historical weather data. Experience specialized forecasts for solar radiation, winds, and more. Easily resolve city names to coordinates, retrieve accurate elevation data, and manage timezones seamlessly."
	/>
</svelte:head>

<div class="h-[500px]">
	<div
		class="absolute -z-10 h-full w-full"
		style="
		  background-image: url('/images/features_background.webp');
          background-size: cover;
          background-position: center;
          height: 500px;
		  {$mode === 'dark' ? 'opacity: 0.80;' : ''}
        "
	></div>
	<div class="container flex h-full flex-col items-center justify-center gap-6 text-white">
		<Logo width="96" height="96" shadow={true} />
		<h1 class="text-shadow text-3xl font-light shadow-[rgba(0,0,0,0.7)] md:text-5xl">
			{m.features()}
		</h1>
		<div class="flex flex-col items-center justify-center gap-6 md:w-1/2">
			<p class="text-shadow text-center text-lg font-light shadow-[rgba(0,0,0,0.7)]">
				{m.features_description()}
			</p>
			<div class="mt-2 flex gap-4">
				<Button variant="default" href="#available-apis">Available APIs</Button>
				<Button variant="outline-white" href={i18n.route('/pricing')}>{m.pricing()}</Button>
			</div>
		</div>
	</div>
</div>

<div class="container mt-16">
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
		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-gradient-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<Zap size="36" strokeWidth={1.2} />
				</div>

				<h3 class="pl-3 text-2xl">High Resolution</h3>
			</div>

			<p class="mb-3">
				Open-Meteo APIs are designed to provide you with the most precise weather information for
				your location. We select the highest resolution weather models available, ensuring detailed
				forecasts for your specific area. If you're in Europe or the US, we utilize impressive 1-2
				km high resolution models for even greater accuracy.
			</p>
			<p>
				Our APIs deliver hourly weather data for a 7-day forecast. The first 2-3 days of the
				forecast are calculated using high resolution models, offering you detailed predictions.
				After that, global weather models take over. This seamless integration results in a simple
				and reliable hourly forecast for the week ahead.
			</p>
		</div>
		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="absolute h-14 w-14 rounded-lg bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-gradient-to-b dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<Watch size="36" strokeWidth={1.2} />
				</div>

				<h3 class="pl-3 text-2xl">Hourly Updates</h3>
			</div>
			<p class="mb-3">
				At Open-Meteo, we understand the importance of up-to-date weather information. That's why
				our local 1 km resolution models are updated every hour, ensuring that our forecasts are
				always current and accurate.
			</p>
			<p>
				To provide you with reliable predictions, our weather models incorporate real-time
				measurements, airplane data, buoys, rain radar, and satellite observations. These sources of
				information contribute to the precision of our numerical weather forecasts, giving you the
				most reliable data for your location.
			</p>
		</div>
		<div>
			<div>
				<div>
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
				<h2 class="ps-3">80 Years Historical Data</h2>
			</div>
			<p class="mb-3">
				With our <a href={i18n.route('/docs/historical-weather-api')}>Historical Weather API</a>,
				you have access to over 80 years of hourly weather data, covering any location on earth, all
				at a 10-kilometer resolution. This extensive dataset allows you to delve into the past and
				analyze historical weather patterns.
			</p>
			<p>
				Not only that, but our APIs continuously archive data, ensuring that you can seamlessly
				retrieve the most recent forecast while also accessing multiple weeks of past data. This is
				especially valuable for training machine learning applications and gaining insights from
				historical weather trends.
			</p>
		</div>
		<div>
			<div>
				<div>
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
				<h2 class="ps-3">Specialised Forecasts</h2>
			</div>
			<p class="mb-3">
				At Open-Meteo, we go beyond standard weather forecasts. In addition to providing predictions
				for temperature, clouds, and rain, we offer detailed forecasts for a range of specialized
				factors. These include solar radiation, winds at higher altitude, transpiration, soil
				moisture, soil temperature, waves, and air quality.
			</p>
			<p>
				Whether you're planning a solar energy project, assessing wind conditions, or monitoring
				environmental factors, our specialized forecasts have got you covered. Gain insights into
				specific aspects of the weather that matter most to you.
			</p>
		</div>
		<div>
			<div>
				<div>
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
				<h2 class="fs-4 ps-3">Geocoding, Elevation, Timezones</h2>
			</div>
			<p class="mb-3">
				With our collection of utility APIs, you can effortlessly handle various tasks. Need to find
				the precise coordinates for a city name? Our geocoding API can help you resolve city names
				to coordinates.
			</p>
			<p class="mb-3">
				Want to know the elevation of a specific point? Our elevation API provides you with accurate
				elevation data, allowing you to plan activities or analyze terrain with ease.
			</p>
			<p>
				And when it comes to managing timezones, our API can automatically resolve coordinates to
				their respective timezones. Say goodbye to timezone-related headaches and ensure that your
				applications and systems are always synchronized.
			</p>
		</div>
	</div>

	<div class="mt-16" id="available-apis">
		<h2 id="weathervariables" class="mb-5 text-center text-5xl font-light">Available APIs</h2>
		<p class="text-center">
			Open-Meteo offers a diverse range of APIs that go beyond traditional weather forecasting.
			Explore a world of possibilities with our APIs for past weather data, ocean data, air quality,
			ensemble forecasts, climate forecasts based on IPCC predictions, and even floods. Whatever
			your weather-related needs may be, Open-Meteo has got you covered.
		</p>

		<div class="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<div>
				<div>
					<h3 class="text-3xl font-bold">Forecast API</h3>
					<h4 class="mb-3 text-xl font-light">Your Go-To Solution for Weather Forecasts!</h4>
					<p class="mb-3">
						Experience the simplicity and power of our <a
							href={i18n.route('/docs')}
							title="Weather Forecast API Documentation">Forecast API</a
						>, designed to provide you with accurate weather forecasts for up to 14 days. Gain
						access to a comprehensive set of weather variables, such as temperature, wind, clouds,
						and precipitation, all delivered in an easy-to-use JSON format.
					</p>
					<p class="mb-3">
						Our Forecast API combines the best weather models from national weather services,
						allowing you to compare them directly. Stay informed about the weather conditions and
						make informed decisions based on the most reliable and up-to-date forecasts available.
					</p>
					<p class="mb-3">
						But that's not all! With our "Past Days" feature, you can also access historical weather
						data from the past months. Analyze trends, study weather patterns, and unlock valuable
						insights using this valuable feature.
					</p>
					<p>
						Rest assured, our Forecast API is not only incredibly fast but also highly reliable.
						Count on its seamless performance to provide you with the weather information you need,
						when you need it.
					</p>
				</div>
			</div>
			<div>
				<div>
					<h3 class="text-3xl font-bold">Historical Weather API</h3>
					<h4 class="mb-3 text-xl font-light">Unlock the Past Weather!</h4>
					<!-- <p class="mb-3">
						Step back in time and explore the weather history with our <a
							href="/en/docs/historical-weather-api"
							title="Historical weather API Documentation">Historical Weather API</a
						>. Access past weather data from as far back as 1940, with hourly resolution available
						for any location on earth.
					</p> -->
					<p class="mb-3">
						Harnessing the power of 50TB of reanalysis weather data, our Historical Weather API
						offers a wealth of information for your analysis and research needs. Benefit from global
						coverage without any missing data, ensuring a comprehensive view of weather patterns
						over the years.
					</p>
					<p>
						With our lightning-fast API, you can retrieve decades worth of data in less than a
						second. Dive deep into the historical weather records, uncover trends, and gain valuable
						insights with ease.
					</p>
				</div>
			</div>
			<div>
				<div>
					<h3 class="text-3xl font-bold">Ensemble Models API</h3>
					<h4 class="mb-3 text-xl font-light">Harness the Power of Many!</h4>
					<!-- <p class="mb-3">
						Why settle for a single weather forecast when you can tap into the collective wisdom of
						over 200 individual forecasts? With our <a
							href="/en/docs/ensemble-api"
							title="Ensemble Forecast API Documentation">Ensemble Models API</a
						>, you can access a wealth of weather predictions and estimate the likelihood of
						different outcomes for the next 4 weeks. 
					</p>-->
					<p class="mb-3">
						Experience the ultimate forecasting accuracy with our API, which combines the insights
						of 7 different ensemble models from renowned institutes. With just one API call, you
						gain access to a diverse range of perspectives and can make informed decisions based on
						the most reliable predictions available.
					</p>
					<p>
						Unlock the raw power of up to 35 days of weather forecasts, provided in hourly
						resolution. Our API offers an extensive selection of weather variables, including
						specialized data like wind at 120-meter elevation and solar radiation, allowing you to
						estimate renewable energy production with precision.
					</p>
				</div>
			</div>
			<div>
				<div>
					<h3 class="text-3xl font-bold">Climate Change API</h3>
					<h4 class="mb-3 text-xl font-light">Explore the Future of Your Region!</h4>
					<!-- <p class="mb-3">
						Curious about the impact of climate change on your area? Our <a
							href="/en/docs/climate-api"
							title="Climate Change API Documentation">Climate Change API</a
						> provides valuable insights by delivering downscaled IPCC climate predictions specifically
						tailored to a 10 km resolution, going beyond the limitations of continental-scale data.
					</p> -->
					<p>
						Harness the power of high-resolution IPCC climate models, carefully downscaled and
						statistically corrected to provide accurate forecasts at a local level. With this API,
						you can access climate projections in daily resolution, extending all the way up to the
						year 2050. Additionally, you can explore control data dating back to 1950, allowing for
						in-depth analysis of climate change.
					</p>
				</div>
			</div>
			<div>
				<div>
					<h3 class="text-3xl font-bold">Marine, Air Quality, and Floods</h3>
					<h4 class="mb-3 text-xl font-light">Comprehensive Environmental Analysis!</h4>
					<!-- <p class="mb-3">
						Dive into the world of marine weather with our <a
							href="/en/docs/marine-weather-api"
							title="Marine Weather API Documentation">Marine Weather API</a
						>, providing detailed ocean wave forecasts generated by both local and global models.
						Stay informed about wave conditions and make informed decisions for marine activities.
					</p>
					<p class="mb-3">
						Monitor the quality of the air you breathe using our <a
							href="/en/docs/air-quality-api"
							title="Air Quality API Documentation">Air Quality API</a
						>, which delivers air pollution forecasts encompassing particles, gases, and even
						pollen. Stay ahead of potential health concerns and plan your outdoor activities
						accordingly.
					</p>
					<p class="mb-3">
						Stay prepared and informed about potential floods with our <a
							href="/en/docs/flood-api"
							title="Flood API Documentation">Flood API</a
						>. Access ensemble flood forecasts that estimate the volume of water discharged by
						rivers worldwide. This invaluable information allows for the prediction of potential
						flood events and aids in proactive measures for flood preparedness.
					</p> -->
				</div>
			</div>
			<div>
				<div>
					<h3 class="text-3xl font-bold">Geocoding, and Elevation</h3>
					<h4 class="mb-3 text-xl font-light">Disclose Location Insights!</h4>
					<!-- <p class="mb-3">
						Discover any city or town worldwide with our <a
							href="/en/docs/geocoding-api"
							title="Geocoding API Documentation">Geocoding API</a
						>. It supports multiple languages, making it easier than ever to search for specific
						locations. Seamlessly resolve location names to geographic coordinates and seamlessly
						transition to accessing weather forecasts for those locations.
					</p>
					<p>
						Explore the <a href="/en/docs/elevation-api" title="Elevation API Documentation"
							>Elevation API</a
						> to unlock the power of elevation data. Resolve any set of coordinates to their corresponding
						elevation using our digital elevation model with impressive resolution, up to 90 meters.
						Enhance your understanding of terrain and elevation variations for various geographic points.
					</p> -->
				</div>
			</div>
		</div>
	</div>
</div>

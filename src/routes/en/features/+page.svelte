<script lang="ts">
	import Zap from 'lucide-svelte/icons/zap';
	import Gauge from 'lucide-svelte/icons/gauge';
	import Watch from 'lucide-svelte/icons/watch';
	import Waves from 'lucide-svelte/icons/waves';

	import Mailbox from 'lucide-static/icons/mailbox.svg';

	import Archive from 'lucide-svelte/icons/archive';
	import Lightbulb from 'lucide-svelte/icons/lightbulb';
	import FileCheck from 'lucide-svelte/icons/file-check';
	import MapPinned from 'lucide-svelte/icons/map-pinned';
	import MountainSnow from 'lucide-svelte/icons/mountain-snow';

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

<div class="container my-12">
	<div class="mt-6 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-2 xl:grid-cols-3">
		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<MapPinned size="36" strokeWidth={1.2} />
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
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<Zap size="36" strokeWidth={1.2} />
				</div>

				<h3 class="pl-3 text-2xl">High Resolution</h3>
			</div>

			<p>
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
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<Watch size="36" strokeWidth={1.2} />
				</div>

				<h3 class="pl-3 text-2xl">Hourly Updates</h3>
			</div>
			<p>
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
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<Archive size="34" strokeWidth={1.3} />
				</div>

				<h3 class="pl-3 text-2xl">80 Years Historical Data</h3>
			</div>
			<p>
				With our <a href={'/en/docs/historical-weather-api'}>Historical Weather API</a>, you have
				access to over 80 years of hourly weather data, covering any location on earth, all at a
				10-kilometer resolution. This extensive dataset allows you to delve into the past and
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
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<Waves size="34" strokeWidth={1.4} />
				</div>

				<h3 class="pl-3 text-2xl">Specialised Forecasts</h3>
			</div>
			<p>
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
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<MountainSnow size="34" strokeWidth={1.3} />
				</div>

				<h3 class="pl-3 text-2xl">Geocoding, Elevation, Timezones</h3>
			</div>
			<p>
				With our collection of utility APIs, you can effortlessly handle various tasks. Need to find
				the precise coordinates for a city name? Our geocoding API can help you resolve city names
				to coordinates.
			</p>
			<p>
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
		<h2 id="available_apis" class="mb-5 text-center text-5xl font-light">Available APIs</h2>
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
					<p>
						Experience the simplicity and power of our <a
							href={'/en/docs'}
							title="Weather Forecast API Documentation">Forecast API</a
						>, designed to provide you with accurate weather forecasts for up to 14 days. Gain
						access to a comprehensive set of weather variables, such as temperature, wind, clouds,
						and precipitation, all delivered in an easy-to-use JSON format.
					</p>
					<p>
						Our Forecast API combines the best weather models from national weather services,
						allowing you to compare them directly. Stay informed about the weather conditions and
						make informed decisions based on the most reliable and up-to-date forecasts available.
					</p>
					<p>
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
					<p>
						Step back in time and explore the weather history with our <a
							href="/en/docs/historical-weather-api"
							title="Historical weather API Documentation">Historical Weather API</a
						>. Access past weather data from as far back as 1940, with hourly resolution available
						for any location on earth.
					</p>
					<p>
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
					<p>
						Why settle for a single weather forecast when you can tap into the collective wisdom of
						over 200 individual forecasts? With our <a
							href="/en/docs/ensemble-api"
							title="Ensemble Forecast API Documentation">Ensemble Models API</a
						>, you can access a wealth of weather predictions and estimate the likelihood of
						different outcomes for the next 4 weeks.
					</p>
					<p>
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
					<p>
						Curious about the impact of climate change on your area? Our <a
							href="/en/docs/climate-api"
							title="Climate Change API Documentation">Climate Change API</a
						> provides valuable insights by delivering downscaled IPCC climate predictions specifically
						tailored to a 10 km resolution, going beyond the limitations of continental-scale data.
					</p>
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
					<p>
						Dive into the world of marine weather with our <a
							href="/en/docs/marine-weather-api"
							title="Marine Weather API Documentation">Marine Weather API</a
						>, providing detailed ocean wave forecasts generated by both local and global models.
						Stay informed about wave conditions and make informed decisions for marine activities.
					</p>
					<p>
						Monitor the quality of the air you breathe using our <a
							href="/en/docs/air-quality-api"
							title="Air Quality API Documentation">Air Quality API</a
						>, which delivers air pollution forecasts encompassing particles, gases, and even
						pollen. Stay ahead of potential health concerns and plan your outdoor activities
						accordingly.
					</p>
					<p>
						Stay prepared and informed about potential floods with our <a
							href="/en/docs/flood-api"
							title="Flood API Documentation">Flood API</a
						>. Access ensemble flood forecasts that estimate the volume of water discharged by
						rivers worldwide. This invaluable information allows for the prediction of potential
						flood events and aids in proactive measures for flood preparedness.
					</p>
				</div>
			</div>
			<div>
				<div>
					<h3 class="text-3xl font-bold">Geocoding, and Elevation</h3>
					<h4 class="mb-3 text-xl font-light">Disclose Location Insights!</h4>
					<p>
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
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<Gauge size="34" strokeWidth={1.4} />
				</div>

				<h3 class="pl-3 text-2xl">Lightning Fast APIs</h3>
			</div>
			<p>
				Open-Meteo has designed its APIs to deliver lightning-fast performance and scalability.
				Weather data is stored on high-speed NVMe disks in optimized time-series formats. API
				requests typically have a response time of under 10 milliseconds.
			</p>
			<p>
				To ensure reliability and low latency, Open-Meteo operates servers in Europe and North
				America. Additionally, we offer the flexibility to add API servers to local points of
				presence in any cloud provider or hosting center. If performance is crucial for your needs,
				feel free to reach out to us.
			</p>
		</div>
		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<Lightbulb size="34" strokeWidth={1.4} />
				</div>

				<h3 class="pl-3 text-2xl">User-Friendly APIs</h3>
			</div>

			<p>
				Our JSON-based APIs are incredibly easy to use. All you need is a basic understanding of
				geographic coordinates (e.g., <mark>52.52°N 13.405°E</mark> for Berlin), how to make HTTP requests,
				and work with JSON data.
			</p>
			<p>
				We provide <a href="/en/docs">comprehensive API documentation</a> with detailed explanations
				and all the necessary parameters, making it simple for you to integrate our APIs into your projects.
			</p>
		</div>
		<div>
			<div class="mb-3 flex items-center">
				<div
					class="bg-primary relative flex h-14 w-14 items-center justify-center rounded-xl text-white"
				>
					<div
						class="bg-linear-to-t dark:bg-linear-to-b absolute h-14 w-14 rounded-lg from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
					></div>
					<FileCheck size="34" strokeWidth={1.2} />
				</div>

				<h3 class="pl-3 text-2xl">Reliable APIs</h3>
			</div>
			<p>
				We understand the importance of API stability. Rest assured, we are committed to maintaining
				the stability of our APIs. Any modifications will adhere to semantic versioning, and
				breaking changes will be introduced as new major versions.
			</p>
			<p>
				To keep you informed, all API changes will be documented and logged in our GitHub
				repository. This ensures transparency and allows you to stay updated on any modifications
				made to our APIs.
			</p>
		</div>
	</div>

	<div class="my-12 mb-24 flex flex-col items-center justify-center">
		<div class="[&_svg]:h-20 [&_svg]:w-20 [&_svg]:stroke-[1.2]">
			{@html Mailbox}
		</div>
		<h2 class="mb-4 text-4xl font-bold" id="contact">Next steps</h2>
		<div class="text-center">
			<p class="lead mb-4">
				Our <a href="/en/docs">documentation</a> provides a good start to help you integrate weather
				forecast into you application. For commercial applications, we recommend exploring our
				<a href="/en/pricing" title="API Subscription Plans">API subscriptions</a>. Should you
				require any assistance, have suggestions for improvements, or need to report a bug, we
				encourage you to reach out to us through our
				<a href="https://github.com/open-meteo/open-meteo" title="GitHub Repository" target="_blank"
					>GitHub repository</a
				>. Alternatively, you can also contact us directly via email. We're here to support you
				every step of the way.
			</p>
			<div class="mt-4 flex justify-center gap-4">
				<Button href={'/en/pricing'} title="Newsletter Sign-Up">API Pricing</Button>
				<Button variant="outline" href="mailto:info@open-meteo.com">Email us</Button>
			</div>
		</div>
	</div>
</div>

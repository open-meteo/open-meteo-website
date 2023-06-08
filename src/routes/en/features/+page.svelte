<svelte:head>
	<title>⚡️ Features | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/features" />
	<meta
		name="description"
		content="Open-Meteo offers feature rich and simple JSON APIs with global coverage and up to 1 km resolution. Get started today and access the most accurate weather forecasts worldwide. Our APIs combine cutting-edge local and global models from renowned national weather services. Stay up-to-date with hourly updates and utilize 80 years of historical weather data. Experience specialized forecasts for solar radiation, winds, and more. Easily resolve city names to coordinates, retrieve accurate elevation data, and manage timezones seamlessly."
	/>
</svelte:head>

<div
	class="px-4 py-5 text-center text-white"
	style="
            background-image: url('/images/features_background.webp');
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
			d="M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-1 3a.5.5 0 0 1-.948-.316l1-3a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-1 3a.5.5 0 1 1-.948-.316l1-3a.5.5 0 0 1 .632-.317zm.247-6.998a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 11H13a3 3 0 0 0 .405-5.973zM8.5 2a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 2z"
		/>
	</svg>
	<h1 class="display-5" style="text-shadow: 3px 3px 2px rgba(0, 0, 0, .7);">Features</h1>
	<div class="col-lg-6 mx-auto">
		<p class="lead mb-4" style="text-shadow: 3px 3px 2px rgba(0, 0, 0, .7);">
			Simple JSON APIs. Global coverage. Up to 1 km resolution. Get started today!
		</p>
		<div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
			<a href="#available-apis" class="btn button btn-primary btn-lg px-4 me-sm-3">Available APIs</a
			>
			<a href="/en/pricing" class="btn btn-outline-light btn-lg px-4">Pricing</a>
		</div>
	</div>
</div>

<div class="container px-4 py-5" id="featured-3">
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
			<h2>Local And Global Models</h2>
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
			<h2>High Resolution</h2>
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
			<h2>Hourly Updates</h2>
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
			<h2>80 Years Historical Data</h2>
			<p>
				With our <a href="/en/docs/historical-weather-api">Historical Weather API</a>, you have
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
			<h2>Specialised Forecasts</h2>
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
			<h2>Geocoding, Elevation, Timezones</h2>
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
</div>

<div class="container px-4 py-5" id="available-apis">
	<h2 id="weathervariables" class="pb-2 text-center display-5">Available APIs</h2>
	<p class="lead text-center">
		Open-Meteo offers a diverse range of APIs that go beyond traditional weather forecasting.
		Explore a world of possibilities with our APIs for past weather data, ocean data, air quality,
		ensemble forecasts, climate forecasts based on IPCC predictions, and even floods. Whatever your
		weather-related needs may be, Open-Meteo has got you covered.
	</p>

	<div class="row row-cols-1 row-cols-lg-3 g-4 py-5">
		<div class="col d-flex align-items-start">
			<div>
				<h3 class="fw-bold mb-0">Forecast API</h3>
				<p class="lead">Your Go-To Solution for Weather Forecasts!</p>
				<p>
					Experience the simplicity and power of our <a
						href="/en/docs"
						title="Weather Forecast API Documentation">Forecast API</a
					>, designed to provide you with accurate weather forecasts for up to 14 days. Gain access
					to a comprehensive set of weather variables, such as temperature, wind, clouds, and
					precipitation, all delivered in an easy-to-use JSON format.
				</p>
				<p />
				<p>
					Our Forecast API combines the best weather models from national weather services, allowing
					you to compare them directly. Stay informed about the weather conditions and make informed
					decisions based on the most reliable and up-to-date forecasts available.
				</p>
				<p>
					But that's not all! With our "Past Days" feature, you can also access historical weather
					data from the past months. Analyze trends, study weather patterns, and unlock valuable
					insights using this valuable feature.
				</p>
				<p>
					Rest assured, our Forecast API is not only incredibly fast but also highly reliable. Count
					on its seamless performance to provide you with the weather information you need, when you
					need it.
				</p>
			</div>
		</div>
		<div class="col d-flex align-items-start">
			<div>
				<h3 class="fw-bold mb-0">Historical Weather API</h3>
				<p class="lead">Unlock the Past Weather!</p>
				<p>
					Step back in time and explore the weather history with our <a
						href="/en/docs/historical-weather-api"
						title="Historical weather API Documentation">Historical Weather API</a
					>. Access past weather data from as far back as 1940, with hourly resolution available for
					any location on earth.
				</p>
				<p>
					Harnessing the power of 50TB of reanalysis weather data, our Historical Weather API offers
					a wealth of information for your analysis and research needs. Benefit from global coverage
					without any missing data, ensuring a comprehensive view of weather patterns over the
					years.
				</p>
				<p>
					With our lightning-fast API, you can retrieve decades worth of data in less than a second.
					Dive deep into the historical weather records, uncover trends, and gain valuable insights
					with ease.
				</p>
			</div>
		</div>
		<div class="col d-flex align-items-start">
			<div>
				<h3 class="fw-bold mb-0">Ensemble Models API</h3>
				<p class="lead">Harness the Power of Many!</p>
				<p>
					Why settle for a single weather forecast when you can tap into the collective wisdom of
					over 200 individual forecasts? With our <a
						href="/en/docs/ensemble-api"
						title="Ensemble Forecast API Documentation">Ensemble Models API</a
					>, you can access a wealth of weather predictions and estimate the likelihood of different
					outcomes for the next 4 weeks.
				</p>
				<p>
					Experience the ultimate forecasting accuracy with our API, which combines the insights of
					7 different ensemble models from renowned institutes. With just one API call, you gain
					access to a diverse range of perspectives and can make informed decisions based on the
					most reliable predictions available.
				</p>
				<p>
					Unlock the raw power of up to 35 days of weather forecasts, provided in hourly resolution.
					Our API offers an extensive selection of weather variables, including specialized data
					like wind at 120-meter elevation and solar radiation, allowing you to estimate renewable
					energy production with precision.
				</p>
			</div>
		</div>
		<div class="col d-flex align-items-start">
			<div>
				<h3 class="fw-bold mb-0">Climate Change API</h3>
				<p class="lead">Explore the Future of Your Region!</p>
				<p>
					Curious about the impact of climate change on your area? Our <a
						href="/en/docs/climate-api"
						title="Climate Change API Documentation">Climate Change API</a
					> provides valuable insights by delivering downscaled IPCC climate predictions specifically
					tailored to a 10 km resolution, going beyond the limitations of continental-scale data.
				</p>
				<p>
					Harness the power of high-resolution IPCC climate models, carefully downscaled and
					statistically corrected to provide accurate forecasts at a local level. With this API, you
					can access climate projections in daily resolution, extending all the way up to the year
					2050. Additionally, you can explore control data dating back to 1950, allowing for
					in-depth analysis of climate change.
				</p>
			</div>
		</div>
		<div class="col d-flex align-items-start">
			<div>
				<h3 class="fw-bold mb-0">Marine, Air Quality, and Floods</h3>
				<p class="lead">Comprehensive Environmental Analysis!</p>
				<p>
					Dive into the world of marine weather with our <a
						href="/en/docs/marine-weather-api"
						title="Marine Weather API Documentation">Marine Weather API</a
					>, providing detailed ocean wave forecasts generated by both local and global models. Stay
					informed about wave conditions and make informed decisions for marine activities.
				</p>
				<p>
					Monitor the quality of the air you breathe using our <a
						href="/en/docs/air-quality-api"
						title="Air Quality API Documentation">Air Quality API</a
					>, which delivers air pollution forecasts encompassing particles, gases, and even pollen.
					Stay ahead of potential health concerns and plan your outdoor activities accordingly.
				</p>
				<p>
					Stay prepared and informed about potential floods with our <a
						href="/en/docs/flood-api"
						title="Flood API Documentation">Flood API</a
					>. Access ensemble flood forecasts that estimate the volume of water discharged by rivers
					worldwide. This invaluable information allows for the prediction of potential flood events
					and aids in proactive measures for flood preparedness.
				</p>
			</div>
		</div>
		<div class="col d-flex align-items-start">
			<div>
				<h3 class="fw-bold mb-0">Geocoding, and Elevation</h3>
				<p class="lead">Disclose Location Insights!</p>
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
					elevation using our digital elevation model with impressive resolution, up to 90 meters. Enhance
					your understanding of terrain and elevation variations for various geographic points.
				</p>
			</div>
		</div>
	</div>
</div>

<div class="container px-4 py-5">
	<div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
		<div class="feature col">
			<div class="feature-icon bg-primary bg-gradient">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="currentColor"
					class="bi bi-speedometer2"
					viewBox="0 0 16 16"
				>
					<path
						d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z"
					/>
					<path
						fill-rule="evenodd"
						d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3z"
					/>
				</svg>
			</div>
			<h2 id="fast">Lightning Fast APIs</h2>
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
		<div class="feature col">
			<div class="feature-icon bg-primary bg-gradient">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="currentColor"
					class="bi bi-lightbulb"
					viewBox="0 0 16 16"
				>
					<path
						d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z"
					/>
				</svg>
			</div>
			<h2>User-Friendly APIs</h2>

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
		<div class="feature col">
			<div class="feature-icon bg-primary bg-gradient">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="currentColor"
					class="bi bi-file-earmark-diff"
					viewBox="0 0 16 16"
				>
					<path
						d="M8 5a.5.5 0 0 1 .5.5V7H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V8H6a.5.5 0 0 1 0-1h1.5V5.5A.5.5 0 0 1 8 5zm-2.5 6.5A.5.5 0 0 1 6 11h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"
					/>
					<path
						d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"
					/>
				</svg>
			</div>
			<h2>Reliable APIs</h2>
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
</div>

<div class="px-4 py-5 my-5 text-center">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="72"
		height="72"
		fill="currentColor"
		class="bi bi-mailbox"
		viewBox="0 0 16 16"
	>
		<path
			d="M4 4a3 3 0 0 0-3 3v6h6V7a3 3 0 0 0-3-3zm0-1h8a4 4 0 0 1 4 4v6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V7a4 4 0 0 1 4-4zm2.646 1A3.99 3.99 0 0 1 8 7v6h7V7a3 3 0 0 0-3-3H6.646z"
		/>
		<path
			d="M11.793 8.5H9v-1h5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.354-.146l-.853-.854zM5 7c0 .552-.448 0-1 0s-1 .552-1 0a1 1 0 0 1 2 0z"
		/>
	</svg>
	<h1 id="contact" class="display-5 fw-bold">Next steps</h1>
	<div class="col-lg-6 mx-auto">
		<p class="lead mb-4">
			Our <a href="/en/docs">documentation</a> provides a good start to help you integrate weather
			forecast into you application. For commercial applications, we recommend exploring our
			<a href="/en/pricing" title="API Subscription Plans">API subscriptions</a>. Should you require
			any assistance, have suggestions for improvements, or need to report a bug, we encourage you
			to reach out to us through our
			<a href="https://github.com/open-meteo/open-meteo" title="GitHub Repository" target="_blank"
				>GitHub repository</a
			>. Alternatively, you can also contact us directly via email. We're here to support you every
			step of the way.
		</p>
		<div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
			<a class="btn btn-primary btn-lg px-4 gap-3" href="/en/pricing" title="API Subscription Plans"
				>API Pricing</a
			>
			<a href="mailto:info@open-meteo.com" class="btn btn-outline-secondary btn-lg px-4">Email us</a
			>
		</div>
	</div>
</div>

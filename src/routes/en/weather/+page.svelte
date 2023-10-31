<script lang="ts">
	import { fetchWeatherApi } from 'openmeteo';
	import LocationSearch from '../docs/LocationSearch.svelte';
	import { defaultLocation, type GeoLocation } from '$lib/stores';

	// Sequence generator function (commonly referred to as "range", e.g. Clojure, PHP, etc.)
	const range = (start: number, stop: number, step: number) =>
		Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

	const weatherCodes = {
		0: 'fair',
		1: 'mainly clear',
		2: 'partly cloudy',
		3: 'overcast',
		45: 'fog',
		48: 'depositing rime fog',
		51: 'light drizzle',
		53: 'moderate drizzle',
		55: 'dense drizzle',
		56: 'light freezing drizzle',
		57: 'dense freezing drizzle',
		61: 'slight rain',
		63: 'moderate rain',
		65: 'heavy rain',
		66: 'light freezing rain',
		67: 'heavy freezing rain',
		71: 'slight snow fall',
		73: 'moderate snow fall',
		75: 'heavy snow fall',
		77: 'snow grains',
		80: 'slight rain showers',
		81: 'moderate rain showers',
		82: 'heavy rain showers',
		85: 'slight snow showers',
		86: 'heavy snow showers',
		95: 'slight to moderate thunderstorm',
		96: 'thunderstorm with slight hail',
		99: 'thunderstorm with heavy hail'
	};

	let location: GeoLocation = defaultLocation;

	$: weather = (async (location: GeoLocation) => {
		const params = {
			latitude: location.latitude,
			longitude: location.longitude,
			elevation: location.elevation,
			timezone: location.timezone,
			//hourly: ['temperature_2m', 'precipitation'],
			current: 'temperature_2m,weather_code,windspeed_10m,winddirection_10m',
			daily:
				'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant'
		};
		const url = 'https://api.open-meteo.com/v1/forecast';
		const responses = await fetchWeatherApi(url, params);
		const response = responses[0];
		const current = response.current()!;
		const utcOffsetSeconds = response.utcOffsetSeconds();

		const daily = response.daily()!;
		const dailyTime = range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
			(t) => new Date((t + utcOffsetSeconds) * 1000)
		);

		return {
			current: {
				time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
				temperature_2m: current.variables(0)!.value(),
				weather_code: current.variables(1)!.value(),
				windspeed_10m: current.variables(2)!.value(),
				winddirection_10m: current.variables(3)!.value()
			},
			daily: {
				time: dailyTime,
				weather_code: daily.variables(0)!,
				temperature_2m_max: daily.variables(1)!,
				temperature_2m_min: daily.variables(2)!,
				sunrise: daily.variables(3)!,
				sunset: daily.variables(4)!,
				precipitation_sum: daily.variables(5)!,
				windspeed_10m_max: daily.variables(6)!,
				windgusts_10m_max: daily.variables(7)!,
				winddirection_10m_dominant: daily.variables(8)!
			}
		};
	})(location);
</script>

<svelte:head>
	<title>Weather | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/weather" />
	<meta name="description" content="segseg" />
</svelte:head>

<div
	class="px-4 py-5 text-center text-white"
	style="
            background-image: url('/images/features_background.webp');
            background-size: cover;
            background-position: center;
            height: 300px;
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
	<h1 class="display-5" style="text-shadow: 3px 3px 2px rgba(0, 0, 0, .7);">
		Weather {location.name}
	</h1>
	<h5>{location.admin1}, {location.country}</h5>
</div>

<div class="container px-4 py-5">
	<div class="row">
		<div class="col-md-2 mb-3">
			<LocationSearch on:location={(event) => (location = event.detail)} label="Search Location" />
		</div>
	</div>
	{#await weather}
		<p>Loading weather data</p>
	{:then weather}
		<h2>Current weahter</h2>
		<p>Current time {weather.current.time.toISOString()}</p>
		<p>Current temperature {weather.current.temperature_2m.toFixed(1)}°C</p>
		<p>Current weather: {weatherCodes[weather.current.weather_code]}</p>
		<p>Current wind: {weather.current.windspeed_10m.toFixed(1)} m/s {weather.current.winddirection_10m.toFixed()}°</p>
		<h2>Daily weather</h2>
		{#each weather.daily.time as time, index}
			<p>
				{time.toISOString()}
				{weatherCodes[weather.daily.weather_code.values(index)]}
				Tmax={weather.daily.temperature_2m_max.values(index)?.toFixed(1)}°C Tmin={weather.daily.temperature_2m_min
					.values(index)
					?.toFixed(1)}°C precip={weather.daily.precipitation_sum.values(index)?.toFixed(1)} mm wind={weather.daily.windspeed_10m_max
					.values(index)
					?.toFixed(1)} m/s gusts={weather.daily.windgusts_10m_max.values(index)?.toFixed(1)} m/s direction={weather.daily.winddirection_10m_dominant
					.values(index)
					?.toFixed()}°
			</p>
		{/each}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

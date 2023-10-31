<script lang="ts">
	import { fetchWeatherApi } from 'openmeteo';
	import LocationSearch from '../docs/LocationSearch.svelte';
	import { defaultLocation, units, type GeoLocation } from '$lib/stores';
	import { convertUnit, getWeatherCode, range } from '$lib/meteo';

	let location: GeoLocation = defaultLocation;
	let weatherModel = "best_match";

	$: weather = (async (location: GeoLocation) => {
		const params = {
			latitude: location.latitude,
			longitude: location.longitude,
			elevation: location.elevation,
			timezone: location.timezone,
			models: weatherModel,
			//hourly: ['temperature_2m', 'precipitation'],
			minutely_15: 'precipitation,temperature_2m,windspeed_10m',
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
		const minutely = response.minutely15()!;

		return {
			current: {
				time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
				temperature_2m: current.variables(0)!.value(),
				weather_code: current.variables(1)!.value(),
				windspeed_10m: current.variables(2)!.value(),
				winddirection_10m: current.variables(3)!.value()
			},
			minutely: {
				time: range(Number(minutely.time()), Number(minutely.timeEnd()), minutely.interval()).map(
					(t) => new Date((t + utcOffsetSeconds) * 1000)
				),
				precipitation: minutely.variables(0)!,
				temperature_2m: minutely.variables(1)!,
				windspeed_10m: minutely.variables(2)!,
			},
			daily: {
				time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
					(t) => new Date((t + utcOffsetSeconds) * 1000)
				),
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
		<div class="col-md-3 mb-3">
			<LocationSearch on:location={(event) => (location = event.detail)} label="Search Location" />
		</div>
		<div class="col-md-3 mb-3">
			<input type="radio" class="btn-check" name="temperatureUnit" id="celsius" value="celsius" bind:group={$units.temperature}>
			<label class="btn" for="celsius">°C</label>
			<input type="radio" class="btn-check" name="temperatureUnit" id="fahrenheit" value="fahrenheit" bind:group={$units.temperature}>
			<label class="btn" for="fahrenheit">°F</label>
		</div>
		<div class="col-md-3 mb-3">
			<input type="radio" class="btn-check" name="windSpeedUnit" id="kph" value="kph" bind:group={$units.windSpeed}>
			<label class="btn" for="kph">km/h</label>
			<input type="radio" class="btn-check" name="windSpeedUnit" id="mph" value="mph" bind:group={$units.windSpeed}>
			<label class="btn" for="mph">mph</label>
			<input type="radio" class="btn-check" name="windSpeedUnit" id="kn" value="kn" bind:group={$units.windSpeed}>
			<label class="btn" for="kn">knots</label>
		</div>
		<div class="col-md-12 mb-3">
			<input type="radio" class="btn-check" name="weatherModel" id="best_match" value="best_match" bind:group={weatherModel}>
			<label class="btn" for="best_match">Best Match</label>
			<input type="radio" class="btn-check" name="weatherModel" id="icon_seamless" value="icon_seamless" bind:group={weatherModel}>
			<label class="btn" for="icon_seamless">DWD</label>
			<input type="radio" class="btn-check" name="weatherModel" id="gfs_seamless" value="gfs_seamless" bind:group={weatherModel}>
			<label class="btn" for="gfs_seamless">NOAA</label>
			<input type="radio" class="btn-check" name="weatherModel" id="meteofrance_seamless" value="meteofrance_seamless" bind:group={weatherModel}>
			<label class="btn" for="meteofrance_seamless">MeteoFrance</label>
			<input type="radio" class="btn-check" name="weatherModel" id="ecmwf_ifs04" value="ecmwf_ifs04" bind:group={weatherModel}>
			<label class="btn" for="ecmwf_ifs04">ECMWF</label>
			<input type="radio" class="btn-check" name="weatherModel" id="jma_seamless" value="jma_seamless" bind:group={weatherModel}>
			<label class="btn" for="jma_seamless">JMA</label>
			<input type="radio" class="btn-check" name="weatherModel" id="gem_seamless" value="gem_seamless" bind:group={weatherModel}>
			<label class="btn" for="gem_seamless">GEM</label>
			<!--<input type="radio" class="btn-check" name="weatherModel" id="metno_nordic" value="metno_nordic" bind:group={weatherModel}>
			<label class="btn" for="metno_nordic">MetNo</label>-->
		</div>
	</div>
	{#await weather}
		<p>Loading weather data</p>
	{:then weather}
		<h2>Current weather</h2>
		<p>Current time {weather.current.time.toISOString()}</p>
		<p>Current temperature {convertUnit(weather.current.temperature_2m, $units.temperature)} {$units.temperature}</p>
		<p>Current weather: {getWeatherCode(weather.current.weather_code)}</p>
		<p>Current wind: {convertUnit(weather.current.windspeed_10m, $units.windSpeed)} {$units.windSpeed} {weather.current.winddirection_10m.toFixed()}°</p>

		<h2>Daily weather</h2>
		{#each weather.daily.time as time, index}
			<p>
				{time.toISOString()}
				{getWeatherCode(weather.daily.weather_code.values(index))}
				Tmax={convertUnit(weather.daily.temperature_2m_max.values(index), $units.temperature)} {$units.temperature} Tmin={convertUnit(weather.daily.temperature_2m_min
					.values(index), $units.temperature)} {$units.temperature} precip={weather.daily.precipitation_sum.values(index)?.toFixed(1)} mm wind={convertUnit(weather.daily.windspeed_10m_max
					.values(index), $units.windSpeed)} {$units.windSpeed} gusts={convertUnit(weather.daily.windgusts_10m_max.values(index), $units.windSpeed)} {$units.windSpeed} direction={weather.daily.winddirection_10m_dominant
					.values(index)
					?.toFixed()}°
			</p>
		{/each}

		<h2>15 Minutely weather</h2>
		{#each weather.minutely.time as time, index}
			<p>
				{time.toISOString()}
				{convertUnit(weather.minutely.temperature_2m.values(index), $units.temperature)} {$units.temperature} precip={weather.minutely.precipitation.values(index)?.toFixed(1)} mm wind={convertUnit(weather.minutely.windspeed_10m
					.values(index), $units.windSpeed)}
			</p>
		{/each}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

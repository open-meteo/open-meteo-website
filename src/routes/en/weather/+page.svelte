<script lang="ts">
	import { fetchWeatherApi } from 'openmeteo';
	import LocationSearch from '../docs/LocationSearch.svelte';
	import { defaultLocation, type GeoLocation } from '$lib/stores';

	let location: GeoLocation = defaultLocation

	$: weather = (async (location: GeoLocation) => {
		const params = {
			latitude: location.latitude,
			longitude: location.longitude,
			elevation: location.elevation,
			timezone: location.timezone,
			//hourly: ['temperature_2m', 'precipitation'],
			current: ['temperature_2m', 'weather_code']
		};
		const url = 'https://api.open-meteo.com/v1/forecast';
		const responses = await fetchWeatherApi(url, params);
		return responses[0];
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
	<h1 class="display-5" style="text-shadow: 3px 3px 2px rgba(0, 0, 0, .7);">Weather {location.name}</h1>
	<h5>{location.admin1}, {location.country}</h5>
</div>

<div class="container px-4 py-5">
	<div class="row">
		<div class="col-md-2 mb-3">Search location:</div>
		<div class="col-md-2 mb-3">
			<LocationSearch on:location={(event) => location = event.detail} label="Search" />
		</div>
	</div>
	{#await weather}
		<p>Loading weather data</p>
	{:then weather}
		<p>Current time {new Date((Number(weather.current()?.time()) + weather.utcOffsetSeconds()) * 1000).toISOString()}</p>
		<p>Current temperature {weather.current()?.variables(0)?.value()}°C</p>
		<p>Current weather code {weather.current()?.variables(1)?.value()}</p>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}

</div>

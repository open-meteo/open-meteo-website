<script lang="ts">
	import { fetchWeatherApi } from 'openmeteo';
	import LocationSearch from '../docs/LocationSearch.svelte';
	import { defaultLocation, units, type GeoLocation } from '$lib/stores';
	import { convertUnit, getWeatherCode, range } from '$lib/meteo';
	import colorScale from './color-scale';

	let location: GeoLocation = defaultLocation;
	let weatherModel = 'icon_seamless';

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
				windspeed_10m: minutely.variables(2)!
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

	let selectedDay = new Date();

	const switchDay = (date: Date) => {
		selectedDay = date;
	};

	const getIconClass = (code: string, time: Date) => {
		let morning = new Date(time.getTime());
		morning.setHours(6, 0, 0, 0);
		let evening = new Date(time.getTime());
		evening.setHours(19, 0, 0, 0);
		let dayTime = false;
		if (time > morning && time < evening) {
			dayTime = true;
		}

		return `${dayTime ? 'day' : 'night'}-${'x'}`;
	};
</script>

<svelte:head>
	<title>Weather | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/weather" />
	<meta name="description" content="segseg" />
</svelte:head>

<div class="pb-5">
	<div class="row">
		<div class="col-md-4 mb-3">
			<LocationSearch
				class="p-0"
				style="height: 40px"
				on:location={(event) => (location = event.detail)}
				label="Search Location"
			/>
		</div>
		<div class="col-md-2 mb-3">
			<input
				type="radio"
				class="btn-check"
				name="temperatureUnit"
				id="celsius"
				value="celsius"
				bind:group={$units.temperature}
			/>
			<label class="btn" for="celsius">°C</label>
			<input
				type="radio"
				class="btn-check"
				name="temperatureUnit"
				id="fahrenheit"
				value="fahrenheit"
				bind:group={$units.temperature}
			/>
			<label class="btn" for="fahrenheit">°F</label>
		</div>
		<div class="col-md-4 mb-3">
			<input
				type="radio"
				class="btn-check"
				name="windSpeedUnit"
				id="kph"
				value="kph"
				bind:group={$units.windSpeed}
			/>
			<label class="btn" for="kph">km/h</label>
			<input
				type="radio"
				class="btn-check"
				name="windSpeedUnit"
				id="mph"
				value="mph"
				bind:group={$units.windSpeed}
			/>
			<label class="btn" for="mph">mph</label>
			<input
				type="radio"
				class="btn-check"
				name="windSpeedUnit"
				id="kn"
				value="kn"
				bind:group={$units.windSpeed}
			/>
			<label class="btn" for="kn">knots</label>
		</div>
		<div class="col-md-12 mb-3">
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="best_match"
				value="best_match"
				bind:group={weatherModel}
			/>
			<label class="btn" for="best_match">Best Match</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="icon_seamless"
				value="icon_seamless"
				bind:group={weatherModel}
			/>
			<label class="btn" for="icon_seamless">DWD</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="gfs_seamless"
				value="gfs_seamless"
				bind:group={weatherModel}
			/>
			<label class="btn" for="gfs_seamless">NOAA</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="meteofrance_seamless"
				value="meteofrance_seamless"
				bind:group={weatherModel}
			/>
			<label class="btn" for="meteofrance_seamless">Météo-France</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="ecmwf_ifs04"
				value="ecmwf_ifs04"
				bind:group={weatherModel}
			/>
			<label class="btn" for="ecmwf_ifs04">ECMWF</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="jma_seamless"
				value="jma_seamless"
				bind:group={weatherModel}
			/>
			<label class="btn" for="jma_seamless">JMA</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="gem_seamless"
				value="gem_seamless"
				bind:group={weatherModel}
			/>
			<label class="btn" for="gem_seamless">GEM</label>
			<!--<input type="radio" class="btn-check" name="weatherModel" id="metno_nordic" value="metno_nordic" bind:group={weatherModel}>
			<label class="btn" for="metno_nordic">MetNo</label>-->
		</div>
	</div>

	<div class="weather-content" style="min-height: 50vh">
		{#await weather}
			<!-- <div class="flex justify-center">
			<h2>Loading weather data</h2>
		</div> -->
		{:then weather}
			<div class="weather-week">
				{#each weather.daily.time as time, index}
					{@const rawCode = weather.daily.weather_code.values(index)}

					{@const code = getWeatherCode(weather.daily.weather_code.values(index))
						.split(' ')
						.join('-')}
					{@const selected = time.getDate() === selectedDay.getDate()}
					<div
						class="weather-week-item"
						on:click={() => {
							switchDay(time);
						}}
						class:selected
					>
						<div class="weather-week-date">
							<b>{time.getDate()} - {time.getMonth() + 1}</b>
						</div>

						{time.toLocaleDateString('en-GB', { weekday: 'long' })}
						<!-- {time.toISOString()} -->

						<div class="weather-week-icon">
							<i class={`wi wi-wmo4680-${rawCode}`}></i>
						</div>
						<!-- {code} -->
						<div
							class="weather-temp-max"
							style={`background-color: ${colorScale[weather.daily.temperature_2m_max.values(index).toFixed(0)]}; mix-blend-mode: difference`}
						>
							{weather.daily.temperature_2m_max.values(index).toFixed(1)} °C
						</div>
						<br />
						<div
							class="weather-temp-min"
							style={`background: ${colorScale[weather.daily.temperature_2m_min.values(index).toFixed(0)]}`}
						>
							{weather.daily.temperature_2m_min.values(index).toFixed(1)} °C
						</div>

						<br />
						<!-- {time} -->
					</div>
				{/each}
			</div>
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</div>
</div>

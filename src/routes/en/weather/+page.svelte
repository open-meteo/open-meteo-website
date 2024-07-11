<script lang="ts">
	import { fetchWeatherApi } from 'openmeteo';

	import { onDestroy, onMount } from 'svelte';

	import LocationSearch from '../docs/LocationSearch.svelte';
	import { defaultLocation, units, type GeoLocation } from '$lib/stores';
	import { convertUnit, getWeatherCode, range } from '$lib/meteo';
	import HighchartContainer from '$lib/Elements/HighchartContainer.svelte';

	import colorScale from './color-scale';

	let location: GeoLocation = defaultLocation;
	let weatherModel = 'icon_seamless';

	$: weather = (async (location: GeoLocation) => {
		const paramsWeather = {
			latitude: location.latitude,
			longitude: location.longitude,
			elevation: location.elevation,
			timezone: location.timezone,
			models: weatherModel,
			hourly: 'precipitation,precipitation_probability,windspeed_10m',
			minutely_15: 'precipitation,precipitation_probability,windspeed_10m',
			current: 'temperature_2m,weather_code,windspeed_10m,winddirection_10m',
			daily:
				'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant',
			forecast_days: 6,
			past_days: 1
		};
		const url = 'https://api.open-meteo.com/v1/forecast';
		const responses = await fetchWeatherApi(url, paramsWeather);
		const response = responses[0];
		const current = response.current()!;
		const utcOffsetSeconds = response.utcOffsetSeconds();
		const daily = response.daily()!;
		const hourly = response.hourly()!;
		const minutely = response.minutely15()!;

		const paramsPrevious = {
			latitude: location.latitude,
			longitude: location.longitude,
			elevation: location.elevation,
			timezone: location.timezone,
			hourly:
				'temperature_2m,temperature_2m_previous_day1,temperature_2m_previous_day2,temperature_2m_previous_day3,temperature_2m_previous_day4,temperature_2m_previous_day5',
			models: 'ecmwf_ifs025,ecmwf_aifs025,icon_seamless,gem_seamless,meteofrance_seamless',
			past_days: 7
		};

		const urlPrev = 'https://api.open-meteo.com/v1/forecast';
		const responsesPrev = await fetchWeatherApi(url, paramsPrevious);
		const responsePrev = responsesPrev[0];
		const hourlyPrev = response.hourly()!;

		return {
			current: {
				time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
				temperature_2m: current.variables(0)!.value(),
				weather_code: current.variables(1)!.value(),
				windspeed_10m: current.variables(2)!.value(),
				winddirection_10m: current.variables(3)!.value()
			},
			hourly: {
				time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
					(t) => new Date((t + utcOffsetSeconds) * 1000)
				),
				precipitation: hourly.variables(0)!,
				temperature_2m: hourly.variables(1)!,
				windspeed_10m: hourly.variables(2)!
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
			},
			chartWeather: {
				chart: {
					zoomType: 'x',
					className: 'opm-higcharts',
					marginLeft: 35,
					marginRight: 110,
					scrollablePlotArea: {
						minWidth: 1000,
						scrollPositionX: 0
					},
					resetZoomButton: {}
				},
				yAxis: [
					{
						// visible: false,
						title: '',
						min: 0,
						max: 100,
						opposite: true,
						labels: {
							format: '{value}%'
						}
					},
					{
						// visible: false,
						title: '',
						minRange: 1.8,
						min: 0,
						opposite: true,
						labels: {
							text: '',
							format: '{value}mm'
						}
					}
				],
				xAxis: {
					type: 'datetime',
					crosshair: true,
					labels: {
						overflow: 'justify'
					},
					// minutely
					// min: Date.now() - 60 * 60 * 1000,
					// max: Date.now() + 2 * 60 * 60 * 1000,
					// hourly
					min: Date.now() - 5 * 60 * 60 * 1000,
					max: Date.now() + 24 * 60 * 60 * 1000,
					plotLines: [
						{
							// now
							value: Date.now(),
							zIndex: 5
						},
						{
							// begin today
							value: new Date().setUTCHours(0, 0, 0, 0)
						},
						{
							// begin tomorrow
							value: new Date(new Date().setUTCHours(0, 0, 0, 0)).setDate(new Date().getDate() + 1)
						}
					]
				},
				plotOptions: {
					series: {
						pointStart: Number(hourly.time()) * 1000,
						pointInterval: hourly.interval() * 1000,
						pointWidth: 4,
						states: {
							hover: {
								lineWidth: 5
							}
						}
					}
				},
				credits: {
					enabled: false
				},
				series: [
					{
						// precip-prop
						name: 'Precipitation Probability',
						data: hourly.variables(1)?.valuesArray(),
						type: 'area',
						color: '#ff22ff',
						tooltip: {
							valueSuffix: '%'
						}
					},
					{
						// precip
						data: hourly.variables(0)?.valuesArray(),
						type: 'column',
						name: 'Precipitation',
						yAxis: 1,
						tooltip: {
							valueDecimals: 1,
							valueSuffix: 'mm'
						}
					}
				],
				legend: {
					enabled: false
				},
				title: {
					text: ''
				},
				tooltip: {
					// backgroundColor: 'rgba(255, 255, 255, 0)',
					// className: 'tooltip-wrapper',
					// useHTML: true,
					outside: true,
					shadow: false,
					shared: true,
					appendTo: 'body',
					positioner: function () {
						return { x: 30, y: 400 };
					}
				}
			},
			chartPrev: {
				chart: {
					type: 'bar',
					className: 'opm-higcharts',
					marginLeft: 35,
					marginRight: 110,
					scrollablePlotArea: {
						minWidth: 1000,
						scrollPositionX: 0
					},
					resetZoomButton: {}
				},
				yAxis: [
					{
						// visible: false,
						title: '',
						min: 0,
						max: 100
						// opposite: true
					}
				],
				xAxis: [
					{
						visible: false
					}
				],

				credits: {
					enabled: false
				},
				plotOptions: {
					bar: {
						borderRadius: '50%'
					}
				},
				series: [
					{
						name: 'Model accuracy',
						data: [
							['DWD', 93],
							['Icon', 66],
							['WTF', 22],
							['DWD', 93],
							['ECMWF', 85],
							['Meteofrance', 22]
						],
						tooltip: {
							valueSuffix: '%'
						},
						dataLabels: {
							enabled: true,
							inside: true,
							format: '{point.x point.y:.1f}' // one decimal
						}
					}
				],
				legend: {
					enabled: false
				},
				title: {
					text: ''
				},
				tooltip: {
					outside: true,
					shared: true,
					hideDelay: 100000,
					appendTo: 'body'
				}
			}
		};
	})(location);

	let highchartsObjectWeather;
	let highchartsObjectPrev;

	let selectedDay = new Date();

	//rm after
	onMount(() => {
		let tooltip = document.querySelector('highcharts-tooltip-container');

		setTimeout(() => {
			let credits = document.querySelector('.highcharts-credits');
			credits?.remove();
		}, 500);
	});

	const switchDay = (date: Date, updateProp = 'xAxis') => {
		highchartsObjectWeather.updateChart({
			min: date.getTime() - 5 * 60 * 60 * 1000,
			max: date.getTime() + 24 * 60 * 60 * 1000
		});
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

<!-- Unit and location selection -->
<div class="container">
	<div class="row">
		<div class="col-md-4 mb-3">
			<LocationSearch
				class="p-1"
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

	<!-- Weather week tabs -->
	{#await weather then weather}
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
						style={`color: ${colorScale[weather.daily.temperature_2m_max.values(index).toFixed(0)]}`}
					>
						{weather.daily.temperature_2m_max.values(index).toFixed(1)} °C
					</div>
					<br />
					<div
						class="weather-temp-min"
						style={`color: ${colorScale[weather.daily.temperature_2m_min.values(index).toFixed(0)]}`}
					>
						{weather.daily.temperature_2m_min.values(index).toFixed(1)} °C
					</div>

					<br />
					<!-- {time} -->
				</div>
			{/each}
		</div>

		<!-- Weather graph -->
		<HighchartContainer
			bind:this={highchartsObjectWeather}
			className={'highcharts-scrollable'}
			options={weather.chartWeather}
			style={'height: 300px;'}
		/>
		<div class="weather-quality">
			<h2>Weather Model Comparison for {location.name}</h2>
			<HighchartContainer
				bind:this={highchartsObjectPrev}
				className={'highcharts-scrollable'}
				options={weather.chartPrev}
				style={'height: 300px;'}
			/>
		</div>
	{/await}

	<div class="row">
		{#await weather}
			<div class="col px-5 py-5 text-center">
				<span class="spinner-border spinner-border-lg" role="status" aria-hidden="true" />
			</div>
		{:then weather}
			<h2>Current weather</h2>
			<p>Current time {weather.current.time.toISOString()}</p>
			<p>
				Current temperature {convertUnit(weather.current.temperature_2m, $units.temperature)}
				{$units.temperature}
			</p>
			<p>Current weather: {getWeatherCode(weather.current.weather_code)}</p>
			<p>
				Current wind: {convertUnit(weather.current.windspeed_10m, $units.windSpeed)}
				{$units.windSpeed}
				{weather.current.winddirection_10m.toFixed()}°
			</p>

			<h2>Daily weather</h2>
			{#each weather.daily.time as time, index}
				<p>
					{time.toISOString()}
					{getWeatherCode(weather.daily.weather_code.values(index))}
					Tmax={convertUnit(weather.daily.temperature_2m_max.values(index), $units.temperature)}
					{$units.temperature} Tmin={convertUnit(
						weather.daily.temperature_2m_min.values(index),
						$units.temperature
					)}
					{$units.temperature} precip={weather.daily.precipitation_sum.values(index)?.toFixed(1)} mm
					wind={convertUnit(weather.daily.windspeed_10m_max.values(index), $units.windSpeed)}
					{$units.windSpeed} gusts={convertUnit(
						weather.daily.windgusts_10m_max.values(index),
						$units.windSpeed
					)}
					{$units.windSpeed} direction={weather.daily.winddirection_10m_dominant
						.values(index)
						?.toFixed()}°
				</p>
			{/each}

			<h2>15 Minutely weather</h2>
			{#each weather.minutely.time as time, index}
				<p>
					{time.toISOString()}
					{convertUnit(weather.minutely.temperature_2m.values(index), $units.temperature)}
					{$units.temperature} precip={weather.minutely.precipitation.values(index)?.toFixed(1)} mm wind={convertUnit(
						weather.minutely.windspeed_10m.values(index),
						$units.windSpeed
					)}
				</p>
			{/each}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</div>
</div>

<style lang="scss">
	@import './weather.scss';

	/** Tooltip styles, for when outside is true */
	:global(:root) {
		--highcharts-tooltip-color: var(--bs-body-bg);
	}

	:global(.highcharts-tooltip text) {
		color: var(--bs-body-color);
		fill: var(--bs-body-color);
	}

	:global(.highcharts-graph) {
		stroke-width: 3px;
	}

	:global(.highcharts-color-0) {
		fill: rgb(23, 88, 186);
		stroke: rgb(23, 88, 186);
	}

	:global(.highcharts-plot-line) {
		fill: none;
		stroke: #cecece;
		stroke-width: 2;
	}

	:global(.highcharts-plot-line:first-of-type) {
		stroke: red;
		stroke-width: 3px;
		stroke-dasharray: 8px 4px;
	}

	:global(.highcharts-credits) {
		display: none;
	}

	:global(.highcharts-scrollable) {
		position: relative;
		margin: 2em 0;
		margin-left: -1.5em;
		margin-right: -1.5em;
		width: calc(100% + 3rem) !important;
		margin-bottom: 5em;
	}

	:global(.weather-week) {
		display: flex;
		align-items: flex-start;
		gap: 0.4em;
		flex-direction: row;
		margin-top: 1.5em;
		padding-bottom: 1.5em;
	}
	:global(.weather-week-item) {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: calc(100% / 7);
		padding: 1em 0;
		transition: 200ms;
		cursor: pointer;
	}
	:global(.weather-week-item.selected) {
		background-color: var(--bs-primary-border-subtle);
		border-radius: 5px;
		transform: scale(1.075);
	}

	:global(.weather-week-icon) {
		display: flex;
		justify-content: center;
		width: 100%;
		min-height: 40px;
	}

	:global(.weather-week-icon i) {
		width: 60px;
		height: 60px;
		margin-top: 18px;
		margin-bottom: 8px;

		text-align: center;
	}

	:global(.weather-week-icon i::before) {
		font-size: 50px;
		color: var(--bs-primary-text-emphasis);
		font-weight: 100;
	}

	:global(.weather-temp-max) {
		font-weight: 900;
	}

	:global(.weather-temp-min) {
		font-weight: 900;
	}

	:global(.weather-week-date) {
		font-size: 18px;
		font-weight: 900;
	}
</style>

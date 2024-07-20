<script lang="ts">
	import { fetchWeatherApi } from 'openmeteo';
	import LocationSearch from '../docs/LocationSearch.svelte';
	import { defaultLocation, units, themeIsDark, type GeoLocation } from '$lib/stores';
	import { convertUnit, getWeatherCode, range } from '$lib/meteo';

	import { onDestroy, onMount } from 'svelte';

	import colorScale from './color-scale';
	import weatherCodes from './weather-codes';

	function throttle(callback, limit) {
		var waiting = false;
		return function () {
			if (!waiting) {
				callback.apply(this, arguments);
				waiting = true;
				setTimeout(function () {
					waiting = false;
				}, limit);
			}
		};
	}

	let location: GeoLocation = defaultLocation;
	let weatherModel = 'icon_seamless';
	let weatherCodesHourly;

	let canvasElement: HTMLCanvasElement | null;

	const today = new Date();
	let selectedDay = new Date();

	$: weather = (async (location: GeoLocation) => {
		const params = {
			latitude: location.latitude,
			longitude: location.longitude,
			elevation: location.elevation,
			timezone: location.timezone,
			models: weatherModel,
			hourly:
				'precipitation,precipitation_probability,temperature_2m,weather_code,windspeed_10m,winddirection_10m,cloud_cover',
			daily:
				'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant',
			forecast_days: 6,
			past_days: 1
		};
		const url = 'https://api.open-meteo.com/v1/forecast';
		const responses = await fetchWeatherApi(url, params);
		const response = responses[0];
		const utcOffsetSeconds = response.utcOffsetSeconds();
		const daily = response.daily()!;
		const hourly = response.hourly()!;

		weatherCodesHourly = hourly.variables(3)?.valuesArray();
		let cloudCover = hourly.variables(6)?.valuesArray();

		const entries = 2;

		const hourlyPrecip = hourly.variables(0)?.valuesArray();
		const hourlyTemps = hourly.variables(2)?.valuesArray();

		const maxX = 10000;
		const maxY = 500 - 27 * entries * 2;
		const deltaX = 10000 / hourly.variables(0)?.valuesArray()?.length;

		const ctx: CanvasRenderingContext2D = canvasElement?.getContext('2d');
		ctx.clearRect(0, 0, maxX, maxY);

		const minTemp = Math.min(...hourly.variables(2)?.valuesArray());
		const maxTemp = Math.max(...hourly.variables(2)?.valuesArray());
		const diffTemp = maxTemp - minTemp;

		const hourlyTime = range(
			Number(hourly.time()),
			Number(hourly.timeEnd()),
			hourly.interval()
		).map((t) => new Date((t + utcOffsetSeconds) * 1000));

		let lastY = maxY;

		const indexes = [];

		for (const [index, value] of hourlyTime.entries()) {
			if (value.getHours() > 6 && value.getHours() < 21) {
				ctx.beginPath(); // Start a new path
				ctx.moveTo(index * deltaX, maxY);
				ctx.lineTo(index * deltaX, 0);
				ctx.lineTo((index + 1) * deltaX, 0);
				ctx.lineTo((index + 1) * deltaX, maxY);
				ctx.closePath();
				ctx.fillStyle = '#f4ff001a';
				ctx.fill();
			}
		}

		for (const [index, value] of hourlyTemps.entries()) {
			indexes.push(index);
			ctx.beginPath();
			ctx.moveTo(index * deltaX, 0);
			ctx.lineTo(index * deltaX, maxY);
			if (hourlyTime[index].getHours() === 0) {
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 3;
			} else if (
				hourlyTime[index].getDate() === today.getDate() &&
				hourlyTime[index].getHours() === today.getHours()
			) {
				ctx.stroke();
				ctx.closePath();
				ctx.beginPath();
				ctx.strokeStyle = 'red';
				ctx.lineWidth = 5;
				let minutes = today.getMinutes();
				ctx.moveTo(index * deltaX + (deltaX / 60) * minutes, 0);
				ctx.lineTo(index * deltaX + (deltaX / 60) * minutes, maxY);
				ctx.stroke();
				ctx.closePath();
				ctx.strokeStyle = '#d3d3d3';
				ctx.lineWidth = 1;
			} else {
				ctx.strokeStyle = '#d3d3d3';
				ctx.lineWidth = 1;
			}
			ctx.stroke();
			ctx.closePath();
		}

		ctx.beginPath();
		ctx.moveTo(0, maxY / 1.5);
		for (const [index, value] of hourlyTemps.entries()) {
			let indexDiffTemp = maxTemp - value;
			let indexDiffTempNext = maxTemp - hourlyTemps[index + 1];

			ctx.strokeStyle = '#d3d3d3';
			ctx.lineWidth = 4;

			let xc = (index * deltaX + 0.5 * deltaX + (index * deltaX + 1.5 * deltaX)) / 2;
			let yc =
				(0.2 * maxY +
					(indexDiffTemp / diffTemp) * 0.6 * maxY +
					(0.2 * maxY + (indexDiffTempNext / diffTemp) * 0.6 * maxY)) /
				2;

			ctx.quadraticCurveTo(
				index * deltaX + 0.5 * deltaX,
				0.2 * maxY + (indexDiffTemp / diffTemp) * 0.6 * maxY,
				xc,
				yc
			);
			ctx.stroke();
			lastY = 0.2 * maxY + (indexDiffTemp / diffTemp) * 0.6 * maxY;
		}
		ctx.closePath();

		ctx.beginPath();
		ctx.moveTo(0, 35);
		for (const [index, value] of cloudCover.entries()) {
			ctx.strokeStyle = '#444';
			ctx.lineWidth = 0.1;
			let nextValue = cloudCover[index + 1];

			let xc = (index * deltaX + 0.5 * deltaX + (index * deltaX + 1.5 * deltaX)) / 2;
			let yc = (35 + (value ** 1.5 / 1000) * 30 + 35 + (nextValue ** 1.5 / 1000) * 30) / 2;

			ctx.quadraticCurveTo(index * deltaX + 0.5 * deltaX, 35 + (value ** 1.5 / 1000) * 30, xc, yc);
		}

		ctx.quadraticCurveTo(
			maxX,
			35,
			(cloudCover.length * deltaX + 0.5 * deltaX + (cloudCover.length * deltaX + 1.5 * deltaX)) / 2,
			(35 + (cloudCover[cloudCover.length - 1] ** 1.5 / 1000) * 30 + 35) / 2
		);

		for (const [ind, v] of cloudCover.entries()) {
			let index = cloudCover.length - 1 - ind;
			let value = cloudCover[index];
			let nextValue = cloudCover[index - 1];

			ctx.strokeStyle = '#444';
			ctx.lineWidth = 0.1;

			let xc = (index * deltaX + 0.5 * deltaX + (index * deltaX - 0.5 * deltaX)) / 2;
			let yc = (35 - (value ** 2 / 10000) * 30 + (35 - (nextValue ** 2 / 10000) * 30)) / 2;

			ctx.quadraticCurveTo(index * deltaX + 0.5 * deltaX, 35 - (value ** 2 / 10000) * 30, xc, yc);
		}
		ctx.closePath();
		//to fill the space in the shape
		ctx.fillStyle =
			getComputedStyle(canvasElement).getPropertyValue('--bs-dark-border-subtle') + '66';
		ctx.fill();

		for (const [index, value] of hourlyPrecip.entries()) {
			ctx.beginPath();
			ctx.moveTo(index * deltaX + 0.5 * deltaX, maxY);
			ctx.strokeStyle =
				getComputedStyle(canvasElement).getPropertyValue('--bs-primary-text-emphasis') + 'cc';
			ctx.lineWidth = 12;

			ctx.lineTo(index * deltaX + 0.5 * deltaX, maxY - value * 20);
			ctx.stroke();
			ctx.closePath();
		}

		return {
			daily: {
				time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
					(t) => new Date((t + utcOffsetSeconds) * 1000)
				),
				weather_code: daily.variables(0)!,
				temperature_2m_max: daily.variables(1)!,
				temperature_2m_min: daily.variables(2)!,
				sunrise: daily.variables(3)!.valuesArray()!,
				sunset: daily.variables(4)!.valuesArray()!,
				precipitation_sum: daily.variables(5)!,
				windspeed_10m_max: daily.variables(6)!,
				windgusts_10m_max: daily.variables(7)!,
				winddirection_10m_dominant: daily.variables(8)!
			},
			entries: [
				{
					id: 0,
					name: 'temperature_2m',
					title: 'Temperature',
					values: hourly.variables(2)?.valuesArray()
				},
				{
					id: 1,
					name: 'cloud_cover',
					title: 'Cloud cover',
					values: hourly.variables(6)?.valuesArray()
				}
			],
			entriesLength: hourly.variables(0)?.valuesArray()?.length,
			hourlyTime: hourlyTime,
			indexes: indexes
		};
	})(location);

	let scrollDiv;
	let tableCells;
	let manualScrolling = false;

	const switchDay = (date: Date) => {
		manualScrolling = true;
		selectedDay = date;

		tableCells = document.querySelectorAll('td');

		for (let tableCell of tableCells) {
			if (Number(tableCell.dataset['date']) === selectedDay.getDate()) {
				scrollDiv.scrollTo({ left: tableCell.offsetLeft - 110, behavior: 'smooth' });
				break;
			}
		}
		scrollDiv.addEventListener(
			'scrollend',
			() => {
				manualScrolling = false;
			},
			{ once: true }
		);
	};

	onMount(() => {
		scrollDiv.addEventListener(
			'scroll',
			throttle(() => {
				if (!manualScrolling) {
					tableCells = document.querySelectorAll('td');
					for (let tableCell of tableCells) {
						if (scrollDiv.scrollLeft < tableCell.offsetLeft - 110) {
							if (Number(tableCell.dataset['date']) !== selectedDay.getDate()) {
								let newDate = new Date();
								newDate.setDate(Number(tableCell.dataset['date']));
								selectedDay = newDate;
							}
							break;
						}
					}
				}
			}, 80)
		);

		setTimeout(() => {
			tableCells = document.querySelectorAll('td');
			for (let tableCell of tableCells) {
				if (Number(tableCell.dataset['date']) === selectedDay.getDate()) {
					scrollDiv.scrollTo({ left: tableCell.offsetLeft - 110 });
					break;
				}
			}
		}, 150);
	});

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
			<div class="weather-week d-flex flex-col gap-2 mb-4">
				{#each weather.daily.time as time, index}
					{@const selected = time.getDate() === selectedDay.getDate()}
					<div
						style="transition: 300ms; min-width: 13%; {selected ? 'transform: scale(1.075)' : ''}"
						class="weather-week-item pointer-cursor align-items-center d-flex flex-column rounded pt-4 gap-1 px-3 {selected
							? 'bg-info-subtle'
							: ''}"
						role="button"
						on:click={() => {
							switchDay(time);
						}}
					>
						<div class="weather-week-date">
							<b>{time.getDate()} - {time.getMonth() + 1}</b>
						</div>

						<div class={selected ? 'fw-bold' : ''}>
							{time.toLocaleDateString('en-GB', { weekday: 'long' })}
						</div>

						<div class="weather-week-icon pe-none py-2">
							<svg style="fill: var(--bs-body-color)" width="60px" height="60px">
								<use
									xlink:href="/images/weather-icons/wi-day-{weatherCodes[
										weather.daily.weather_code.values(index)
									]}.svg#Layer_1"
								></use>
							</svg>
						</div>
						<!-- {code} -->
						<div
							class="d-flex p-1 justify-content-center weather-temp-max rounded"
							style={`background-color: ${colorScale[weather.daily.temperature_2m_max.values(index).toFixed(0)]}; color: ${weather.daily.temperature_2m_max.values(index) > 26 ? 'white' : 'black'}; ${$themeIsDark ? 'filter: opacity(0.85)' : ''}`}
						>
							{weather.daily.temperature_2m_max.values(index).toFixed(1)} °C
						</div>
						<div
							class="d-flex p-1 justify-content-center weather-temp-min rounded"
							style={`background: ${colorScale[weather.daily.temperature_2m_min.values(index).toFixed(0)]}; color: ${weather.daily.temperature_2m_min.values(index) > 26 ? 'white' : 'black'}; ${$themeIsDark ? 'filter: opacity(0.85)' : ''}`}
						>
							{weather.daily.temperature_2m_min.values(index).toFixed(1)} °C
						</div>

						<br />
						<!-- {time} -->
					</div>
				{/each}
			</div>
			<div>
				<h3>{selectedDay.toLocaleDateString('en-GB', { weekday: 'long' })}</h3>
			</div>
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
		<div
			bind:this={scrollDiv}
			style="position:relative; height: 285px; margin-left:-110px;  overflow-x: scroll; overflow-y: hidden; scrollbar-width: none;"
			class="weather-canvas-container w-full"
		>
			<canvas
				bind:this={canvasElement}
				id="weather_week_canvas"
				style="margin-top: 25px;margin-left: 110px; width: 5000px; height: 250px; border:1px solid #d3d3d3;"
				height="500px"
				width="10000px"
			></canvas>
			{#await weather then weather}
				<table style="position: absolute; bottom: 10px; border-bottom:1px solid #d3d3d3;">
					<tr>
						<th
							style="color: transparent; padding-left: 4px;  background: transparent; left: 0px; min-width: 110px; max-width: 110px; position: sticky;"
							>Time</th
						>
						{#each weather.indexes as index}
							<td
								class={weather.hourlyTime[index].getDate() === new Date().getDate() &&
								weather.hourlyTime[index].getHours() === new Date().getHours()
									? 'now'
									: ''}
								data-date={weather.hourlyTime[index].getDate()}
								data-time={weather.hourlyTime[index].getHours() + ':00'}
								style="font-size: 11px;position: absolute; bottom: {250}px; left:{111 +
									(5000 / weather.entriesLength) * index}px; text-align: center; min-width: {5000 /
									weather.entriesLength}px; max-width: {5000 / weather.entriesLength}px;"
								>{weather.hourlyTime[index].getHours() < 10 ? '0' : ''}{weather.hourlyTime[
									index
								].getHours()}</td
							>
						{/each}
					</tr>
					<!-- icons -->
					<tr>
						<th
							style="color: transparent; padding-left: 4px;  background: transparent; left: 0px; min-width: 110px; max-width: 110px; position: sticky;"
							>Icons</th
						>
						{#each weather.indexes as index}
							<td
								class={weather.hourlyTime[index].getDate() === new Date().getDate() &&
								weather.hourlyTime[index].getHours() === new Date().getHours()
									? 'now'
									: ''}
								data-date={weather.hourlyTime[index].getDate()}
								data-time={weather.hourlyTime[index].getHours() + ':00'}
								style="position: absolute; bottom: {138 -
									(20 - weather.entries[0].values[index]) * 6.4}px; left:{111 +
									(5000 / weather.entriesLength) * index}px; text-align: center; min-width: {5000 /
									weather.entriesLength}px; max-width: {5000 / weather.entriesLength}px;"
								><svg style="fill: var(--bs-body-color)" width="20px" height="20px">
									<use
										xlink:href="/images/weather-icons/wi-{weather.hourlyTime[index].getHours() >
											6 && weather.hourlyTime[index].getHours() < 21
											? 'day'
											: 'night'}-{weatherCodes[weatherCodesHourly[index]]}.svg#Layer_1"
									></use>
								</svg></td
							>
						{/each}
					</tr>
					{#each weather.entries as entry}
						<tr style="border-top:1px solid #d3d3d3;">
							<th
								style="padding-left: 4px;  background: var(--bs-body-bg); left: 0px; min-width: 110px; max-width: 110px; position: sticky;"
								>{entry.title}</th
							>

							{#each weather.indexes as index}
								<td
									class={weather.hourlyTime[index].getDate() === new Date().getDate() &&
									weather.hourlyTime[index].getHours() === new Date().getHours()
										? 'now'
										: ''}
									data-date={weather.hourlyTime[index].getDate()}
									data-time={weather.hourlyTime[index].getHours() + ':00'}
									style="text-align: center; border-right:1px solid #d3d3d3; min-width: {5000 /
										weather.entriesLength}px; max-width: {5000 / weather.entriesLength}px;
										{entry.name === 'temperature_2m'
										? 'background: ' + colorScale[weather.entries[0].values[index].toFixed()]
										: ''};
										{entry.name === 'temperature_2m'
										? 'color: ' + (weather.entries[0].values[index] > 27 ? 'white' : 'black')
										: ''}">{entry.values[index].toFixed(0)}</td
								>
							{/each}
						</tr>
					{/each}
				</table>
			{/await}
		</div>
	</div>
</div>

<style>
	.now {
		font-weight: bold;
	}

	td {
		font-size: 13px;
	}

	.now svg {
		transform: scale(1.35);
	}
</style>

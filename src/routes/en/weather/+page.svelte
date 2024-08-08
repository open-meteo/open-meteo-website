<script lang="ts">
	import { fetchWeatherApi } from 'openmeteo';
	import LocationSearch from '../docs/LocationSearch.svelte';
	import {
		defaultLocation,
		storedLocation,
		units,
		model,
		themeIsDark,
		type GeoLocation
	} from '$lib/stores';
	import { convertUnit, getWeatherCode, range } from '$lib/meteo';

	import { onDestroy, onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	import colorScale from './utils/color-scale';
	import weatherCodes from './utils/weather-codes';

	import throttle from './utils/throttle';

	import daylight from './canvas/daylight';
	import raster from './canvas/raster';
	import tempGradient from './canvas/temp-gradient';
	import cloudCover from './canvas/cloud-cover';
	import precip from './canvas/precip';

	let location = $storedLocation;
	storedLocation.subscribe((value) => {
		location = value;
	});
	let weatherModel = $model;
	model.subscribe((value) => {
		weatherModel = value;
	});
	let temperature = $units.temperature;
	let windSpeed = $units.windSpeed;
	let precipitation = $units.precipitation;
	units.subscribe((value) => {
		temperature = value.temperature;
		windSpeed = value.windSpeed;
		precipitation = value.precipitation;
	});

	let diffTemp: number;
	let maxTemp: number;

	let weatherCodesHourly: Float32Array | null | undefined;
	let canvasElement: HTMLCanvasElement | null;

	const today = new Date();
	let selectedDay = new Date();

	let entries = 0;

	$: weather = (async (location: GeoLocation) => {
		const params = {
			latitude: location.latitude,
			longitude: location.longitude,
			elevation: location.elevation,
			// timezone: location.timezone, ???
			models: weatherModel,
			hourly:
				'precipitation,precipitation_probability,temperature_2m,weather_code,windspeed_10m,winddirection_10m,cloud_cover,relative_humidity_2m,cape',
			daily:
				'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant',
			forecast_days: 6,
			past_days: 1,
			temperature_unit: temperature ? temperature : 'celsius',
			wind_speed_unit: windSpeed ? windSpeed : 'kmh',
			precipitation_unit: precipitation ? precipitation : 'mm'
		};
		const url = 'https://api.open-meteo.com/v1/forecast';
		const responses = await fetchWeatherApi(url, params);
		const response = responses[0];
		const utcOffsetSeconds = response.utcOffsetSeconds();
		const daily = response.daily()!;
		const hourly = response.hourly()!;

		weatherCodesHourly = hourly.variables(3)?.valuesArray();

		const hourlyTime = range(
			Number(hourly.time()),
			Number(hourly.timeEnd()),
			hourly.interval()
		).map((t) => new Date((t + utcOffsetSeconds) * 1000));
		const hourlyTemps = hourly.variables(2)?.valuesArray();
		const hourlyCloudCover = hourly.variables(6)?.valuesArray();
		const hourlyPrecip = hourly.variables(0)?.valuesArray();
		const indexes = [];
		for (const [index, _] of hourlyTemps.entries()) {
			indexes.push(index);
		}

		const maxX = 10000;
		const maxY = 500;
		const deltaX = 10000 / hourly.variables(0)?.valuesArray()?.length;

		const ctx = canvasElement?.getContext('2d');
		if (ctx) {
			ctx.clearRect(0, 0, maxX, maxY);

			const minTemp = Math.min(
				...hourly
					.variables(2)
					?.valuesArray()
					.filter((t) => !isNaN(t))
			);
			maxTemp = Math.max(
				...hourly
					.variables(2)
					?.valuesArray()
					.filter((t) => !isNaN(t))
			);
			diffTemp = maxTemp - minTemp;

			const config: ConfigInterface = {
				maxX: maxX,
				maxY: maxY,
				deltaX: deltaX,
				minTemp: minTemp,
				maxTemp: maxTemp,
				diffTemp: diffTemp
			};

			// create canvas
			daylight(ctx, config, hourlyTime);
			raster(ctx, config, hourlyTime, today);
			tempGradient(ctx, config, hourlyTemps);
			cloudCover(ctx, config, hourlyCloudCover, canvasElement);
			precip(ctx, config, hourlyPrecip, canvasElement);
		}

		return {
			daily: {
				time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
					(t) => new Date((t + utcOffsetSeconds) * 1000)
				),
				weather_code: daily.variables(0)!,
				temperature_2m_max: daily.variables(1)!,
				temperature_2m_min: daily.variables(2)!,
				sunrise: daily.variables(3)!.valuesInt64()!,
				sunset: daily.variables(4)!.valuesInt64()!,
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
					values: hourly
						.variables(2)
						?.valuesArray()
						?.map((t) => t.toFixed(0))
				},
				{
					id: 1,
					name: 'precipitation',
					title: 'Precipitation',
					values: hourly
						.variables(0)
						?.valuesArray()
						?.map((p) => p.toFixed(1))
				},
				{
					id: 2,
					name: 'precipitation_probability',
					title: 'Precip Prob.',
					values: hourly
						.variables(1)
						?.valuesArray()
						?.map((p) => p.toFixed(0))
				},
				{
					id: 3,
					name: 'windspeed_10m',
					title: 'Wind',
					values: hourly
						.variables(4)
						?.valuesArray()
						?.map((p) => p.toFixed(0))
				},
				// {
				// 	id: 5,
				// 	name: 'winddirection_10m',
				// 	title: 'Wind Dir.',
				// 	values: hourly
				// 		.variables(5)
				// 		?.valuesArray()
				// 		?.map((p) => p.toFixed(0))
				// },
				{
					id: 4,
					name: 'relative_humidity_2m',
					title: 'Rel. Hum.',
					values: hourly
						.variables(7)
						?.valuesArray()
						?.map((p) => p.toFixed(0))
				}
			],
			entriesLength: hourly.variables(0)?.valuesArray()?.length,
			hourlyTime: hourlyTime,
			windDirections: hourly.variables(5)?.valuesArray(),
			indexes: indexes
		};
	})(location);

	let winddir = true;
	entries = 6;

	let scrollDiv: HTMLElement;
	let tableCells;
	let manualScrolling = false;

	const switchDay = (date: Date) => {
		manualScrolling = true;
		selectedDay = date;

		tableCells = document.querySelectorAll('td.time');

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
					tableCells = document.querySelectorAll('td.time');
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
			tableCells = document.querySelectorAll('td.time');
			for (let tableCell of tableCells) {
				if (Number(tableCell.dataset['date']) === selectedDay.getDate()) {
					scrollDiv.scrollTo({ left: tableCell.offsetLeft - 110 });
					break;
				}
			}
		}, 150);

		document.onkeydown = (e) => {
			if (!scrollDiv === document.activeElement || !scrollDiv.contains(document.activeElement)) {
				if (e.key === 'ArrowLeft') {
					if (selectedDay.getDate() >= today.getDate()) {
						let newDate = new Date();
						newDate.setDate(selectedDay.getDate() - 1);
						switchDay(newDate);
					}
				}
				if (e.key === 'ArrowRight') {
					if (selectedDay.getDate() <= today.getDate() + 4) {
						let newDate = new Date();
						newDate.setDate(selectedDay.getDate() + 1);
						switchDay(newDate);
					}
				}
			}
		};
	});

	const changeUnits = (unit: string, value: string) => {
		if (unit === 'temperature') {
			units.set({
				temperature: value,
				windSpeed: windSpeed,
				precipitation: precipitation
			});
		} else if (unit === 'windSpeed') {
			units.set({
				temperature: temperature,
				windSpeed: value,
				precipitation: precipitation
			});
		} else if (unit === 'precipitation') {
			units.set({
				temperature: temperature,
				windSpeed: windSpeed,
				precipitation: value
			});
		}
	};
</script>

<svelte:head>
	<title>Weather | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/weather" />
	<meta name="description" content="segseg" />
</svelte:head>

<div class="pb-5">
	<div class="row">
		<div class="col-md-3 mb-3">
			<LocationSearch
				class="p-0"
				style="height: 40px"
				on:location={(event) => storedLocation.set(event.detail)}
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
				on:click={(event) => {
					changeUnits('temperature', event.target?.value);
				}}
				bind:group={temperature}
			/>
			<label class="btn" for="celsius">°C</label>
			<input
				type="radio"
				class="btn-check"
				name="temperatureUnit"
				id="fahrenheit"
				value="fahrenheit"
				on:click={(event) => {
					changeUnits('temperature', event.target?.value);
				}}
				bind:group={temperature}
			/>
			<label class="btn" for="fahrenheit">°F</label>
		</div>
		<div class="col-md-4 mb-3">
			<input
				type="radio"
				class="btn-check"
				name="windSpeedUnit"
				id="kmh"
				value="kmh"
				on:click={(event) => {
					changeUnits('windSpeed', event.target?.value);
				}}
				bind:group={windSpeed}
			/>
			<label class="btn" for="kmh">km/h</label>
			<input
				type="radio"
				class="btn-check"
				name="windSpeedUnit"
				id="ms"
				value="ms"
				on:click={(event) => {
					changeUnits('windSpeed', event.target?.value);
				}}
				bind:group={windSpeed}
			/>
			<label class="btn" for="ms">m/s</label>
			<input
				type="radio"
				class="btn-check"
				name="windSpeedUnit"
				id="mph"
				value="mph"
				on:click={(event) => {
					changeUnits('windSpeed', event.target?.value);
				}}
				bind:group={windSpeed}
			/>
			<label class="btn" for="mph">mph</label>
			<input
				type="radio"
				class="btn-check"
				name="windSpeedUnit"
				id="kn"
				value="kn"
				on:click={(event) => {
					changeUnits('windSpeed', event.target?.value);
				}}
				bind:group={windSpeed}
			/>
			<label class="btn" for="kn">knots</label>
		</div>
		<div class="col-md-2 mb-3">
			<input
				type="radio"
				class="btn-check"
				name="precipitation"
				id="mm"
				value="mm"
				on:click={(event) => {
					changeUnits('precipitation', event.target?.value);
				}}
				bind:group={precipitation}
			/>
			<label class="btn" for="mm">mm</label>
			<input
				type="radio"
				class="btn-check"
				name="precipitation"
				id="inch"
				value="inch"
				on:click={(event) => {
					changeUnits('precipitation', event.target?.value);
				}}
				bind:group={precipitation}
			/>
			<label class="btn" for="inch">Inches</label>
		</div>
		<div class="col-md-12 mb-3">
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="best_match"
				value="best_match"
				on:click={(event) => {
					model.set(event.target?.value);
				}}
				bind:group={weatherModel}
			/>
			<label class="btn" for="best_match">Best Match</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="icon_seamless"
				value="icon_seamless"
				on:click={(event) => {
					model.set(event.target?.value);
				}}
				bind:group={weatherModel}
			/>
			<label class="btn" for="icon_seamless">DWD</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="gfs_seamless"
				value="gfs_seamless"
				on:click={(event) => {
					model.set(event.target?.value);
				}}
				bind:group={weatherModel}
			/>
			<label class="btn" for="gfs_seamless">NOAA (GFS)</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="meteofrance_seamless"
				value="meteofrance_seamless"
				on:click={(event) => {
					model.set(event.target?.value);
				}}
				bind:group={weatherModel}
			/>
			<label class="btn" for="meteofrance_seamless">Météo-France</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="ecmwf_ifs04"
				value="ecmwf_ifs04"
				on:click={(event) => {
					model.set(event.target?.value);
				}}
				bind:group={weatherModel}
			/>
			<label class="btn" for="ecmwf_ifs04">ECMWF</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="jma_seamless"
				value="jma_seamless"
				on:click={(event) => {
					model.set(event.target?.value);
				}}
				bind:group={weatherModel}
			/>
			<label class="btn" for="jma_seamless">JMA</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="gem_seamless"
				value="gem_seamless"
				on:click={(event) => {
					model.set(event.target?.value);
				}}
				bind:group={weatherModel}
			/>
			<label class="btn" for="gem_seamless">GEM</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="arpae_cosmo_seamless"
				value="arpae_cosmo_seamless"
				on:click={(event) => {
					model.set(event.target?.value);
				}}
				bind:group={weatherModel}
			/>
			<label class="btn" for="arpae_cosmo_seamless">COSMO</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="metno_seamless"
				value="metno_seamless"
				on:click={(event) => {
					model.set(event.target?.value);
				}}
				bind:group={weatherModel}
			/>
			<label class="btn" for="metno_seamless">MET No</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="knmi_seamless"
				value="knmi_seamless"
				on:click={(event) => {
					model.set(event.target?.value);
				}}
				bind:group={weatherModel}
			/>
			<label class="btn" for="knmi_seamless">KNMI</label>
			<input
				type="radio"
				class="btn-check"
				name="weatherModel"
				id="dmi_seamless"
				value="dmi_seamless"
				on:click={(event) => {
					model.set(event.target?.value);
				}}
				bind:group={weatherModel}
			/>
			<label class="btn" for="dmi_seamless">DMI</label>
		</div>
	</div>

	<div class="weather-content" style="min-height: 50vh">
		<div
			in:fade
			out:fade
			style="min-height: 256px"
			class="weather-week d-flex flex-column flex-md-row gap-md-2 mb-4"
		>
			{#await weather then weather}
				{#each weather.daily.time as time, index}
					{@const selected = time.getDate() === selectedDay.getDate()}
					<div
						style="transition: 300ms; min-width: 13%; {selected ? 'transform: scale(1.025)' : ''}"
						class="weather-week-item pointer-cursor align-items-center d-flex flex-row flex-md-column justify-content-between justify-md-content-center rounded pt-md-4 pb-md-3 gap-md-1 px-3 {selected
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
						<div
							class="d-flex p-1 justify-content-center weather-temp-max rounded"
							style={`background-color: ${colorScale[weather.daily.temperature_2m_max.values(index).toFixed(0)]}; color: ${weather.daily.temperature_2m_max.values(index) > 30 ? 'white' : 'black'}; ${$themeIsDark ? 'filter: opacity(0.85)' : ''}`}
						>
							{weather.daily.temperature_2m_max.values(index).toFixed(1)} °C
						</div>
						<div
							class="d-flex p-1 justify-content-center weather-temp-min rounded"
							style={`background: ${colorScale[weather.daily.temperature_2m_min.values(index).toFixed(0)]}; color: ${weather.daily.temperature_2m_min.values(index) > 30 ? 'white' : 'black'}; ${$themeIsDark ? 'filter: opacity(0.85)' : ''}`}
						>
							{weather.daily.temperature_2m_min.values(index).toFixed(1)} °C
						</div>
					</div>
				{/each}
			{:catch error}
				<p style="color: red">{error.message}</p>
			{/await}
		</div>
		<div>
			<h3>
				{selectedDay.toLocaleDateString('en-GB', { weekday: 'long' })}
				<small>
					{selectedDay.getDate() === new Date(today.getTime() - 24 * 60 * 60 * 1000).getDate()
						? ' (Yesterday)'
						: ''}
					{selectedDay.getDate() === today.getDate() ? ' (Today)' : ''}
					{selectedDay.getDate() === new Date(today.getTime() + 24 * 60 * 60 * 1000).getDate()
						? ' (Tomorrow)'
						: ''}
				</small>
			</h3>
		</div>
		<div
			bind:this={scrollDiv}
			style="position:relative; height: {234 +
				entries *
					27}px; margin-left:-110px;  overflow-x: scroll; overflow-y: hidden; scrollbar-width: none;"
			class="weather-canvas-container w-full"
		>
			<canvas
				bind:this={canvasElement}
				id="weather_week_canvas"
				style="margin-top: 25px;margin-left: 110px; width: 5000px; height: 200px; border:1px solid #d3d3d3;"
				height="500px"
				width="10000px"
			></canvas>
			<table in:fade style="position: absolute; bottom: 10px; border-bottom:1px solid #d3d3d3;">
				{#await weather then weather}
					<caption style="display:none"> Weather Week {location.name} </caption>

					<tr>
						<th
							scope="row"
							class="time"
							style="color: transparent; padding-left: 4px;  background: transparent; left: 0px; min-width: 110px; max-width: 110px; position: sticky;"
							>Time</th
						>
						{#each weather.indexes as index}
							<td
								class="time {weather.hourlyTime[index].getDate() === today.getDate() &&
								weather.hourlyTime[index].getHours() === today.getHours()
									? 'now'
									: ''}"
								data-date={weather.hourlyTime[index].getDate()}
								data-time={weather.hourlyTime[index].getHours() + ':00'}
								style="font-size: 11px;position: absolute; bottom: {200 +
									27 * entries}px; left:{111 +
									(5000 / weather.entriesLength) * index}px; min-width: {5000 /
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
							scope="row"
							style="color: transparent; padding-left: 4px;  background: transparent; left: 0px; min-width: 110px; max-width: 110px; position: sticky;"
							>Icons</th
						>
						{#each weather.indexes as index}
							<td
								class={weather.hourlyTime[index].getDate() === today.getDate() &&
								weather.hourlyTime[index].getHours() === today.getHours()
									? 'now'
									: ''}
								style="position: absolute; bottom: {27.5 * entries -
									10 +
									0.8 * 200 -
									0.55 *
										200 *
										((maxTemp - weather.entries[0].values[index]) / diffTemp)}px; left:{111 +
									(5000 / weather.entriesLength) * index}px; min-width: {5000 /
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

					<!-- min / max -->
					<tr>
						<th
							scope="row"
							style="color: transparent; padding-left: 4px;  background: transparent; left: 0px; min-width: 110px; max-width: 110px; position: sticky;"
							>Temp graph</th
						>
						{#each weather.indexes as index}
							{@const temp = weather.entries[0].values[index]}

							{#if !isNaN(temp)}
								<td
									class={weather.hourlyTime[index].getDate() === today.getDate() &&
									weather.hourlyTime[index].getHours() === today.getHours()
										? 'now'
										: ''}
									style="position: absolute; bottom: {27.5 * entries -
										42 +
										0.8 * 200 -
										0.55 * 200 * ((maxTemp - temp) / diffTemp)}px; left:{111 +
										(5000 / weather.entriesLength) * index}px; min-width: {5000 /
										weather.entriesLength}px; max-width: {5000 / weather.entriesLength}px;"
									>{temp}</td
								>
							{/if}
						{/each}
					</tr>
					{#each weather.entries as entry}
						<tr style="border-top:1px solid #d3d3d3;">
							<th
								scope="row"
								style="padding-left: 4px;  background: var(--bs-body-bg); left: 0px; min-width: 110px; max-width: 110px; position: sticky;"
								>{entry.title}</th
							>

							{#each weather.indexes as index}
								{#if !isNaN(entry.values[index])}
									<td
										class={weather.hourlyTime[index].getDate() === today.getDate() &&
										weather.hourlyTime[index].getHours() === today.getHours()
											? 'now'
											: ''}
										style="border-right:1px solid #d3d3d3; min-width: {5000 /
											weather.entriesLength}px; max-width: {5000 / weather.entriesLength}px;
											{entry.name === 'temperature_2m'
											? 'background: ' + colorScale[weather.entries[0].values[index].toFixed()]
											: ''};
											{entry.name === 'temperature_2m'
											? 'color: ' + (weather.entries[0].values[index] > 30 ? 'white' : 'black')
											: ''};
											{entry.name === 'precipitation_probability'
											? 'background: rgba(0, 0, 230,' + weather.entries[2].values[index] / 120 + ')'
											: ''};
											{entry.name === 'precipitation_probability'
											? 'color: ' + (weather.entries[2].values[index] > 50 ? 'white' : 'black')
											: ''};
											{entry.name === 'relative_humidity_2m'
											? 'background: rgba(0, 240, 240,' +
												weather.entries[4].values[index] ** 3.8 / 10 ** 8.2 +
												')'
											: ''};"
										>{entry.name === 'precipitation'
											? entry.values[index].toFixed(1)
											: entry.values[index]}</td
									>
								{/if}
							{/each}
						</tr>
					{/each}
					{#if winddir}
						<!-- winddir -->
						<tr style="border-top:1px solid #d3d3d3;">
							<th
								scope="row"
								style="z-index: 20; padding-left: 4px;  background: var(--bs-body-bg); left: 0px; min-width: 110px; max-width: 110px; position: sticky;"
								>Wind Dir.</th
							>
							{#each weather.indexes as index}
								{#if !isNaN(weather.windDirections[index])}
									<td
										class={weather.hourlyTime[index].getDate() === today.getDate() &&
										weather.hourlyTime[index].getHours() === today.getHours()
											? 'now'
											: ''}
										style="border-right:1px solid #d3d3d3; transform: rotate({weather
											.windDirections[index]}deg);min-width: {5000 /
											weather.entriesLength}px; max-width: {5000 / weather.entriesLength}px;"
										><svg style="fill: var(--bs-body-color)" width="25px" height="25px">
											<use xlink:href="/images/weather-icons/wi-direction-down.svg#Layer_1"></use>
										</svg></td
									>
								{/if}
							{/each}
						</tr>
					{/if}
				{/await}
			</table>
		</div>
	</div>
</div>

<style>
	@media screen and (max-width: 768px) {
		.weather-canvas-container {
			margin-right: -2rem;
			/* transform: scaleY(0.9); */
		}
	}

	.now {
		font-weight: bold;
	}

	td {
		text-align: center;
		font-size: 13px;
	}

	.now svg {
		transform: scale(1.35);
	}
</style>

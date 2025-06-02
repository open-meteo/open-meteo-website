<script lang="ts">
	import { onMount } from 'svelte';

	import { fade } from 'svelte/transition';

	import { mode } from 'mode-watcher';

	import { debounce } from '$lib/utils/meteo';

	import { fetchWeatherApi } from 'openmeteo';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { storedLocation, model, themeIsDark, type GeoLocation } from '$lib/stores/settings';

	import { pad, range } from '$lib/utils/meteo';

	import { Label } from '$lib/components/ui/label';

	import * as Select from '$lib/components/ui/select';

	import Settings from '$lib/components/settings/settings.svelte';
	import LocationSearch from '$lib/components/location/location-search.svelte';

	import { getColor } from './utils/colors';
	import weatherCodes from './utils/weather-codes';

	import daylight from './canvas/daylight';
	import raster from './canvas/raster';
	import tempGradient from './canvas/temp-gradient';
	import cloudCover from './canvas/cloud-cover';
	import precip from './canvas/precip';

	import { defaultParameters, models } from './options';

	const params = urlHashStore({
		latitude: [$storedLocation.latitude],
		longitude: [$storedLocation.longitude],
		models: 'best_match',
		...defaultParameters
	});

	let location = $state($storedLocation);
	storedLocation.subscribe((value) => {
		location = value;
	});

	let weatherModel = $state($model);
	model.subscribe((value) => {
		weatherModel = value;
	});

	let diffTemp: number = $state();
	let maxTemp: number = $state();

	let weatherCodesHourly: Float32Array | null | undefined = $state();
	let canvasElement: HTMLCanvasElement | null = $state();

	const today = new Date();
	let selectedDay = $state(new Date());
	let selectedDayIndex = $state(1);

	let entries = $state(0);

	let weather = $derived(
		(async (location: GeoLocation) => {
			const reqParams = {
				latitude: location.latitude,
				longitude: location.longitude,
				elevation: location.elevation,
				// timezone: location.timezone, ???
				models: [$params.models],
				hourly: [
					'precipitation',
					'precipitation_probability',
					'temperature_2m',
					'weather_code',
					'windspeed_10m',
					'winddirection_10m',
					'cloud_cover',
					'relative_humidity_2m'
				].join(','),
				forecast_days: 6,
				past_days: 1,
				temperature_unit: $params.temperature_unit,
				wind_speed_unit: $params.wind_speed_unit,
				precipitation_unit: $params.precipitation_unit
			};
			const url = 'https://api.open-meteo.com/v1/forecast';
			const responses = await fetchWeatherApi(url, reqParams);
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
				raster(ctx, config, hourlyTime, today, canvasElement);
				tempGradient(ctx, config, hourlyTemps, $params.temperature_unit);
				cloudCover(ctx, config, hourlyCloudCover, canvasElement);
				precip(ctx, config, hourlyPrecip, canvasElement);
			}

			return {
				entries: [
					{
						id: 0,
						name: 'temperature_2m',
						title: 'Temperature',
						values: hourly
							.variables(2)
							?.valuesArray()
							?.map((t) => t.toFixed(1))
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
		})(location)
	);

	let weatherDaily = $derived(
		(async (location: GeoLocation) => {
			const reqParams = {
				latitude: location.latitude,
				longitude: location.longitude,
				elevation: location.elevation,
				// timezone: location.timezone, ???
				models: [$params.models],
				daily: [
					'weather_code',
					'temperature_2m_max',
					'temperature_2m_min',
					'sunrise',
					'sunset',
					'sunshine_duration',
					'precipitation_sum',
					'windspeed_10m_max',
					'windgusts_10m_max',
					'winddirection_10m_dominant'
				].join(','),
				forecast_days: 6,
				past_days: 1,
				temperature_unit: $params.temperature_unit,
				wind_speed_unit: $params.wind_speed_unit,
				precipitation_unit: $params.precipitation_unit
			};
			const url = 'https://api.open-meteo.com/v1/forecast';
			const responses = await fetchWeatherApi(url, reqParams);
			const response = responses[0];
			const utcOffsetSeconds = response.utcOffsetSeconds();
			const daily = response.daily()!;

			return {
				daily: {
					time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
						(t) => new Date((t + utcOffsetSeconds) * 1000)
					),
					weather_code: daily.variables(0)!,
					temperature_2m_max: daily.variables(1)!,
					temperature_2m_min: daily.variables(2)!,
					sunrise: daily.variables(3)!,
					sunset: daily.variables(4)!,
					sunshine_duration: daily.variables(5)!,
					precipitation_sum: daily.variables(6)!,
					windspeed_10m_max: daily.variables(7)!,
					windgusts_10m_max: daily.variables(8)!,
					winddirection_10m_dominant: daily.variables(9)!
				}
			};
		})(location)
	);

	let winddir = true;
	entries = 6;

	let scrollDiv: HTMLElement = $state();
	let tableCells;
	let manualScrolling = false;

	const switchDay = (date: Date, index: number) => {
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
		selectedDayIndex = index;
	};

	onMount(() => {
		scrollDiv.addEventListener(
			'scroll',
			debounce(() => {
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

	let modelSelected = $derived(models.find((mo) => String(mo.value) === $params.models));
	// let modelSelectedValue = $derived($params.models[0]);
	//
</script>

<svelte:head>
	<title>Weather | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/weather" />
	<meta name="description" content="segseg" />
</svelte:head>

<div class="">
	<div class="weather-content" style="min-height: 50vh">
		<div
			in:fade
			out:fade
			style="min-height: 256px"
			class="weather-week flex flex-col md:flex-row gap-md-2 mb-4"
		>
			{#await weatherDaily then wd}
				{#each wd.daily.time as time, index}
					{@const selected = time.getDate() === selectedDay.getDate()}
					{#if !isNaN(wd.daily.temperature_2m_max.values(index).toFixed(1))}
						<button
							style="transition: 300ms; min-width: 13%; {selected ? 'transform: scale(1.025)' : ''}"
							class="cursor-pointer"
							onclick={() => {
								switchDay(time, index);
							}}
						>
							<div
								class="items-center flex flex-row md:flex-col justify-center md:justify-center rounded-xl p-1 md:p-3 gap-md-1 {selected
									? 'bg-accent'
									: ''}"
							>
								<div class="weather-week-date">
									<b>{time.getDate()} - {time.getMonth() + 1}</b>
								</div>

								<div
									data-text={time.toLocaleDateString('en-GB', { weekday: 'long' })}
									class="inline-flex relative grow-text flex-col mx-auto {selected
										? 'font-bold'
										: ''}"
								>
									{time.toLocaleDateString('en-GB', { weekday: 'long' })}
								</div>

								<div class="weather-week-icon pe-none py-2">
									<svg class="fill-foreground" width="60px" height="60px">
										<use
											xlink:href="/images/weather-icons/wi-day-{weatherCodes[
												wd.daily.weather_code.values(index)
											]}.svg#Layer_1"
										></use>
									</svg>
								</div>
								<div
									class="weather-temp-max flex p-1 justify-center rounded-t text-sm min-w-[65px]"
									style={`background-color: ${getColor(wd.daily.temperature_2m_max.values(index).toFixed(0), $params.temperature_unit)}; color: ${wd.daily.temperature_2m_min.values(index) < ($params.temperature_unit === 'celsius' ? -13 : 7) || wd.daily.temperature_2m_min.values(index) >= ($params.temperature_unit === 'celsius' ? 40 : 104) ? 'white' : 'black'}; ${$themeIsDark ? 'filter: opacity(0.85)' : ''}`}
								>
									{wd.daily.temperature_2m_max.values(index).toFixed(1)}
									{$params.temperature_unit === 'celsius' ? '°C' : '°F'}
								</div>
								<div
									class="weather-temp-min flex p-1 justify-center rounded-b text-sm min-w-[65px]"
									style={`background: ${getColor(wd.daily.temperature_2m_min.values(index).toFixed(0), $params.temperature_unit)}; color: ${wd.daily.temperature_2m_min.values(index) < ($params.temperature_unit === 'celsius' ? -13 : 7) || wd.daily.temperature_2m_min.values(index) >= ($params.temperature_unit === 'celsius' ? 40 : 104) ? 'white' : 'black'}; ${$themeIsDark ? 'filter: opacity(0.85)' : ''}`}
								>
									{wd.daily.temperature_2m_min.values(index).toFixed(1)}
									{$params.temperature_unit === 'celsius' ? '°C' : '°F'}
								</div>
								<div class="flex items-center justify-center mt-2 gap-1">
									<div class="relative h-6 w-6 flex justify-center items-center">
										<div class="absolute">
											<svg class="fill-foreground" width="26px" height="26px">
												<use
													class="stroke-2"
													xlink:href="/images/weather-icons/wi-day-sunny.svg#Layer_1"
												></use>
											</svg>
										</div>
									</div>

									{Number(wd.daily.sunshine_duration.values(index) / 3600).toFixed(0)}h
								</div>
								<div class="flex items-center justify-center mt-1">
									<div class="relative h-6 w-6 flex justify-center items-center">
										<div class="absolute">
											<svg class="fill-foreground" width="28px" height="28px">
												<use
													class="stroke-2"
													xlink:href="/images/weather-icons/wi-raindrop.svg#Layer_1"
												></use>
											</svg>
										</div>
									</div>
									{Number(wd.daily.precipitation_sum.values(index)).toFixed(
										1
									)}{$params.precipitation_unit === 'mm' ? 'mm' : "'"}
								</div>
							</div>
						</button>
					{/if}
				{/each}
			{:catch error}
				<p style="color: red">{error.message}</p>
			{/await}
		</div>
		<div class="ml-22 md:ml-0">
			<h3 class="text-xl font-bold">
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
			style=" height: {218 + entries * 27.5}px; "
			class="relative w-ful -mx-5 md:-ml-[110px] overflow-x-scroll overflow-y-hidden"
		>
			<canvas
				bind:this={canvasElement}
				id="weather_week_canvas"
				class="border border-border"
				style="margin-top: 24px; margin-left: 110px; width: 5000px; height: 200px; "
				height="500px"
				width="10000px"
			></canvas>
			<table in:fade class="absolute bottom-0 border-b border-border">
				<caption style="display:none"> Weather Week {location.name} </caption>
				<tbody>
					{#await weather then weather}
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
									style="font-size: 11px; position: absolute; bottom: {188 +
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
								{@const now =
									weather.hourlyTime[index].getDate() === today.getDate() &&
									weather.hourlyTime[index].getHours() === today.getHours()}
								<td
									style="position: absolute; bottom: {27.5 * entries -
										24 +
										0.8 * 200 -
										0.54 *
											200 *
											((maxTemp - weather.entries[0].values[index]) / diffTemp)}px; left:{116 +
										(5000 / weather.entriesLength) * index}px; min-width: {5000 /
										weather.entriesLength}px; max-width: {5000 / weather.entriesLength}px;"
									><svg class="fill-foreground {now ? 'scale-125' : ''}" width="20px" height="20px">
										<use
											class="stroke-2"
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
											49 +
											0.8 * 200 -
											0.55 * 200 * ((maxTemp - temp) / diffTemp)}px; left:{111 +
											(5000 / weather.entriesLength) * index}px; min-width: {5000 /
											weather.entriesLength}px; max-width: {5000 / weather.entriesLength}px;"
										>{temp.toFixed(0)}</td
									>
								{/if}
							{/each}
						</tr>
						{#each weather.entries as entry}
							<tr class="border-t border-border">
								<th
									scope="row"
									class="bg-background text-left"
									style="left: 0px; min-width: 110px; max-width: 110px; position: sticky;"
									>{entry.title}</th
								>

								{#each weather.indexes as index}
									{#if !isNaN(entry.values[index])}
										<td
											class="border-r border-border {weather.hourlyTime[index].getDate() ===
												today.getDate() && weather.hourlyTime[index].getHours() === today.getHours()
												? 'now'
												: ''}"
											style="min-width: {5000 / weather.entriesLength}px; max-width: {5000 /
												weather.entriesLength}px;
											{entry.name === 'temperature_2m'
												? 'background: ' +
													getColor(
														weather.entries[0].values[index].toFixed(0),
														$params.temperature_unit
													)
												: ''};
											{entry.name === 'temperature_2m'
												? 'color: ' +
													(weather.entries[0].values[index] <
														($params.temperature_unit === 'celsius' ? -13 : 7) ||
													weather.entries[0].values[index] >=
														($params.temperature_unit === 'celsius' ? 40 : 104)
														? 'white'
														: 'black')
												: ''};
											{entry.name === 'precipitation_probability'
												? 'background: rgba(0, 0, 230,' +
													weather.entries[2].values[index] / 120 +
													')'
												: ''};
											{entry.name === 'precipitation_probability'
												? 'color: ' +
													(weather.entries[2].values[index] > 50
														? 'white'
														: 'hsl(var(--foreground)')
												: ''};
											{entry.name === 'relative_humidity_2m'
												? 'background: rgba(0, 240, 240,' +
													weather.entries[4].values[index] ** 3.8 / 10 ** 8.2 +
													')'
												: ''};"
											>{entry.name === 'precipitation' || entry.name === 'temperature_2m'
												? entry.values[index].toFixed(1)
												: entry.values[index]}</td
										>
									{/if}
								{/each}
							</tr>
						{/each}
						{#if winddir}
							<!-- winddir -->
							<tr class="border-t border-border">
								<th
									scope="row"
									class="bg-background text-left"
									style="z-index: 20; left: 0px; min-width: 110px; max-width: 110px; position: sticky;"
									>Wind Dir.</th
								>
								{#each weather.indexes as index}
									{#if !isNaN(weather.windDirections[index])}
										<td
											class="border-r border-border {weather.hourlyTime[index].getDate() ===
												today.getDate() && weather.hourlyTime[index].getHours() === today.getHours()
												? 'now'
												: ''}"
											style="transform: rotate({weather.windDirections[
												index
											]}deg);min-width: {5000 / weather.entriesLength}px; max-width: {5000 /
												weather.entriesLength}px;"
											><svg class="fill-foreground" width="25px" height="25px">
												<use xlink:href="/images/weather-icons/wi-direction-down.svg#Layer_1"></use>
											</svg></td
										>
									{/if}
								{/each}
							</tr>
						{/if}
					{/await}
				</tbody>
			</table>
		</div>
	</div>
	{#await weather then weather}
		{@const sunrise = new Date(Number(weather.daily.sunrise.valuesInt64(selectedDayIndex)) * 1000)}
		{@const sunset = new Date(Number(weather.daily.sunset.valuesInt64(selectedDayIndex)) * 1000)}
		<div class="mt-6">
			<div class="flex gap-1 items-center">
				<svg class="fill-foreground" width="28px" height="28px">
					<use class="stroke-2" xlink:href="/images/weather-icons/wi-sunrise.svg#Layer_1"></use>
				</svg>Sunrise: {pad(sunrise.getHours())}:{pad(sunrise.getMinutes())}
			</div>
			<div class="flex gap-1 items-center">
				<svg class="fill-foreground" width="28px" height="28px">
					<use class="stroke-2" xlink:href="/images/weather-icons/wi-sunset.svg#Layer_1"></use>
				</svg>
				Sunset: {pad(sunset.getHours())}:{pad(sunset.getMinutes())}
			</div>
		</div>
	{/await}
	<div>
		<div class="mt-6 md:mt-12 flex gap-6">
			<div class="relative w-1/2">
				<Select.Root name="model_selection" type="single" bind:value={$params.models}>
					<Select.Trigger
						aria-label="Forecast days input"
						class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{modelSelected?.label}</Select.Trigger
					>
					<Select.Content preventScroll={false} class="border-border">
						{#each models as mo}
							<Select.Item class="cursor-pointer" value={mo.value}>{mo.label}</Select.Item>
						{/each}
					</Select.Content>
					<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
						>Weather model</Label
					>
				</Select.Root>
			</div>
			<div class="relative w-1/2">
				<LocationSearch
					style="height: 40px"
					on:location={(event) => storedLocation.set(event.detail)}
					label="Search Location"
				/>
			</div>
		</div>
	</div>
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<div class="mb-6 mt-6">
		<h2 class="text-2xl md:text-3xl">Color scale example</h2>
		<div class="mt-3 md:mt-6 grid grid-cols-4">
			{#if $params.temperature_unit == 'celsius'}
				{#each [...Array(101).keys()].map((i) => -40 + i) as temp}
					<div
						class="flex p-1 justify-center weather-temp-max rounded min-w-[70px]"
						style={`background-color: ${getColor(temp, $params.temperature_unit)}; color: ${temp <= ($params.temperature_unit === 'celsius' ? -13 : 7) || temp >= ($params.temperature_unit === 'celsius' ? 40 : 104) ? 'white' : 'black'}; ${$themeIsDark ? 'filter: opacity(0.85)' : ''}`}
					>
						{temp} °C <br />
						{getColor(temp, $params.temperature_unit)}
					</div>
				{/each}
			{:else}
				{#each [...Array(91).keys()].map((i) => -40 + i * 2) as temp}
					<div
						class="flex p-1 justify-center weather-temp-max rounded min-w-[70px]"
						style={`background-color: ${getColor(temp, $params.temperature_unit)}; color: ${temp <= ($params.temperature_unit === 'celsius' ? -13 : 7) || temp >= ($params.temperature_unit === 'celsius' ? 40 : 104) ? 'white' : 'black'}; ${$themeIsDark ? 'filter: opacity(0.85)' : ''}`}
					>
						{temp}
						{$params.temperature_unit === 'celsius' ? '°C' : '°F'}<br />
						{getColor(temp, $params.temperature_unit)}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style>
	.now {
		font-weight: bold;
	}

	td {
		text-align: center;
		font-size: 13px;
	}
</style>

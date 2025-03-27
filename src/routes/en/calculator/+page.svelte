<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { api_key_preferences } from '$lib/stores/settings';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import Clock from 'lucide-svelte/icons/clock';
	import Calendar from 'lucide-svelte/icons/calendar-cog';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	import { Textarea } from '$lib/components/ui/textarea';

	import * as Select from '$lib/components/ui/select';

	import DatePicker from '$lib/components/date/date-picker.svelte';

	import { pastDaysOptions, defaultParameters, forecastDaysOptions } from './options';

	let model_default = '';
	let type = 'forecast';
	let action = 'historical-forecast-api';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['temperature_2m', 'wind_speed_10m', 'cloud_cover']
	});

	let server = $derived(
		((api_key_preferences: any) => {
			let serverPrefix = type == 'forecast' ? 'api' : `${type}-api`;
			switch (api_key_preferences.use) {
				case 'commercial':
					return `https://customer-${serverPrefix}.open-meteo.com/v1/${action}`;
				case 'self_hosted':
					return `${api_key_preferences.self_host_server}/v1/${action}`;
				default:
					return `https://${serverPrefix}.open-meteo.com/v1/${action}`;
			}
		})($api_key_preferences)
	);

	const getUrl = (server: string, params: any) => {
		return `${server}?${new URLSearchParams({ ...params, ...params })}`.replaceAll('%2C', ',');
	};

	let url = $state(
		'https://api.open-meteo.com/v1/historical-forecast-api?latitude=52.52&longitude=13.41&hourly=temperature_2m,wind_speed_10m,cloud_cover'
	);

	$effect(() => {
		url = getUrl(server, parsedParams);
	});

	let sdk_type = $state('weather_api');

	$effect(() => {});

	// Only considers keys of the first object. Ignores nulls and empty strings
	function objectDifference<T extends Record<string, any>>(a: T, b: T): Partial<T> {
		const diff: Partial<T> = {};
		for (const key in a) {
			if (a[key] && a[key] != '' && a[key] !== b[key]) {
				diff[key] = a[key];
			}
		}
		return diff;
	}

	/// Parsed params that resolved CSV fields
	let parsedParams = $derived(
		((p: any, api_key_preferences: any) => {
			const params = { ...p };
			if ('time_mode' in params) {
				if (params.time_mode == 'forecast_days') {
					delete params['start_date'];
					delete params['end_date'];
				}
				if (params.time_mode == 'time_interval') {
					delete params['forecast_days'];
					delete params['past_days'];
				}
				delete params['csv_time_intervals'];
				delete params['time_mode'];
			}
			if ('location_mode' in params) {
				if (params.location_mode == 'csv_coordinates' && params['csv_coordinates']) {
					let lats: number[] = [];
					let lons: number[] = [];
					let elevation: number[] = [];
					let timezone: string[] = [];
					let start_date: string[] = [];
					let end_date: string[] = [];
					let csv: string = params['csv_coordinates'];
					csv.split(/\r?\n/).forEach((row) => {
						if (row.length < 4) {
							return;
						}
						let parts = row.split(/[;,\t]/);
						if (parts.length < 2) {
							return;
						}
						lats.push(parseFloat(parts[0]));
						lons.push(parseFloat(parts[1]));
						if (parts.length > 2 && parts[2].length > 0) {
							elevation.push(parseFloat(parts[2]));
						}
						if (parts.length > 3 && parts[3].length > 0) {
							timezone.push(parts[3]);
						}
						if (parts.length > 5 && parts[4].length > 0 && parts[5].length > 0) {
							start_date.push(parts[4]);
							end_date.push(parts[5]);
						}
					});
					params['latitude'] = lats;
					params['longitude'] = lons;
					if (elevation.length > 0) {
						params['elevation'] = elevation;
					}
					if (timezone.length > 0) {
						params['timezone'] = timezone;
					}
					if (start_date.length > 0) {
						params['start_date'] = start_date;
						params['end_date'] = end_date;
						delete params['forecast_days'];
						delete params['past_days'];
					}
				}
				delete params['location_mode'];
				delete params['csv_coordinates'];
			}
			// Cast 1-element arrays to a scalar value
			for (const key in params) {
				if (Array.isArray(params[key]) && params[key].length == 1) {
					params[key] = params[key][0];
				}
			}

			if (model_default != '' && !('models' in params && params['models'] != '')) {
				params['models'] = model_default;
			}

			if (api_key_preferences.use == 'commercial') {
				params['apikey'] = api_key_preferences.apikey;
			}

			return objectDifference(params, defaultParameters);
		})($params, $api_key_preferences)
	);

	const defaultValues = JSON.parse(
		JSON.stringify({
			latitude: [52.52],
			longitude: [13.41],
			...defaultParameters,
			hourly: ['temperature_2m', 'wind_speed_10m', 'cloud_cover']
		})
	);
	const parseUrl = () => {
		const [, splitUrlParams] = url.split('?');
		const searchParams = new URLSearchParams(splitUrlParams);
		console.log(searchParams);
		for (const [key, value] of searchParams.entries()) {
			let defaultValue = defaultValues[key];

			if (defaultValue && defaultValue.constructor === Array) {
				if (JSON.stringify(defaultValue) !== JSON.stringify(value)) {
					$params[key] = value.split(/,|%2C/);
				}
			} else {
				let val: number | string = value;
				if (isNumeric(defaultValue)) {
					defaultValue = Number(defaultValue);
				}
				if (isNumeric(value)) {
					val = Number(value);
				}
				if (defaultValue !== val) {
					$params[key] = val;
				}
			}
		}
	};

	/// Adjusted call weight
	let callWeight = $derived(
		(($params) => {
			let nDays = 1;
			if ('start_date' in $params) {
				const start = new Date($params['start_date']).getTime();
				const end = new Date($params['end_date']).getTime();
				nDays = (end - start) / 1000 / 86400;
			} else {
				const forecast_days = $params['forecast_days'] ?? 7;
				const past_days = $params['past_days'] ?? 0;
				nDays = Number(forecast_days) + Number(past_days);
			}
			/// Number or models (including number of ensemble members)
			const nModels =
				sdk_type == 'ensemble_api'
					? ('models' in $params
							? Array.isArray($params['models'])
								? $params['models']
								: [$params['models']]
							: []
						).reduce((previous: number, model: string) => {
							return previous + (membersPerModel(model) ?? 1);
						}, 0)
					: ('models' in $params
							? Array.isArray($params['models'])
								? $params['models']
								: [$params['models']]
							: []
						).length;

			/// Number of weather variables for hourly, daily, current or minutely_15
			const nHourly =
				'hourly' in $params
					? Array.isArray($params['hourly'])
						? $params['hourly'].length
						: $params['hourly'].length > 1
							? 1
							: 0
					: 0;
			const nDaily =
				'daily' in $params
					? Array.isArray($params['daily'])
						? $params['daily'].length
						: $params['daily'].length > 1
							? 1
							: 0
					: 0;
			const nCurrent =
				'current' in $params
					? Array.isArray($params['current'])
						? $params['current'].length
						: $params['current'].length > 1
							? 1
							: 0
					: 0;
			const nMinutely15 =
				'minutely_15' in $params
					? Array.isArray($params['minutely_15'])
						? $params['minutely_15'].length
						: $params['minutely_15'].length > 1
							? 1
							: 0
					: 0;
			const nVariables = nHourly + nDaily + nCurrent + nMinutely15;

			/// Number of locations
			const nLocations = $params['latitude']?.length ?? 1.0;

			/// Calculate adjusted weight
			const nVariablesModels = nVariables * Math.max(nModels, 1.0);
			const timeWeight = nDays / 14.0;
			const variablesWeight = nVariablesModels / 10.0;
			const variableTimeWeight = Math.max(variablesWeight, timeWeight * variablesWeight);
			return Math.max(1.0, variableTimeWeight) * nLocations;
		})(parsedParams)
	);

	let forecastDays = $derived(
		forecastDaysOptions.find((fco) => fco.value == $params.forecast_days)
	);
	let pastDays = $derived(pastDaysOptions.find((pdo) => pdo.value == $params.past_days));

	let begin_date = new Date();
	begin_date.setMonth(begin_date.getMonth() - 3);

	let last_date = new Date();
	last_date.setDate(last_date.getDate() + 10);
</script>

<svelte:head>
	<title>🖩 API Calculator | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/calculator" />
	<meta name="description" content="" />
</svelte:head>

<div class="container my-6 lg:my-12">
	<h2 id="location_and_time" class="mb-3 text-2xl md:text-3xl">API URL</h2>

	<Textarea
		bind:value={url}
		onchange={() => {
			parseUrl();
		}}
	/>

	<div class="my-3 text-xl">
		Current call will cost
		<strong> {callWeight.toFixed(1)}</strong> API
		{callWeight === 1 ? 'call' : 'calls'}
	</div>
	<!-- TIME -->
	<div class="mt-6">
		<div class="mt-3 flex items-center gap-2">
			<div class="text-muted-foreground">Time:</div>

			<div class="border-border flex rounded-md border">
				<Button
					variant="ghost"
					class="rounded-e-none !opacity-100 {$params.time_mode === 'forecast_days'
						? 'bg-accent cursor-not-allowed'
						: ''}"
					disabled={$params.time_mode === 'forecast_days'}
					onclick={() => {
						$params.time_mode = 'forecast_days';
						$params.start_date = '';
						$params.end_date = '';
					}}
				>
					<Clock size={20} />Forecast Length
				</Button>
				<Button
					variant="ghost"
					class="rounded-md rounded-s-none !opacity-100 duration-300 {$params.time_mode ===
					'time_interval'
						? 'bg-accent'
						: ''}"
					disabled={$params.time_mode === 'time_interval'}
					onclick={() => {
						$params.time_mode = 'time_interval';
					}}
				>
					<Calendar size={20} />Time Interval
				</Button>
			</div>
		</div>

		<div class="mt-3 md:mt-4">
			{#if $params.time_mode === 'forecast_days'}
				<div in:fade class="grid gap-3 md:gap-6 lg:grid-cols-2">
					<div class="grid gap-3 sm:grid-cols-2 md:gap-6">
						<div class="relative">
							<Select.Root name="forecast_days" type="single" bind:value={$params.forecast_days}>
								<Select.Trigger
									aria-label="Forecast days input"
									class="h-12 cursor-pointer pt-6 [&_svg]:mb-3"
									>{forecastDays?.label}</Select.Trigger
								>
								<Select.Content preventScroll={false} class="border-border">
									{#each forecastDaysOptions as fdo}
										<Select.Item class="cursor-pointer" value={fdo.value}>{fdo.label}</Select.Item>
									{/each}
								</Select.Content>
								<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
									>Forecast days</Label
								>
							</Select.Root>
						</div>
						<div class="relative">
							<Select.Root name="past_days" type="single" bind:value={$params.past_days}>
								<Select.Trigger
									aria-label="Past days input"
									class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{pastDays?.label}</Select.Trigger
								>
								<Select.Content preventScroll={false} class="border-border">
									{#each pastDaysOptions as pdo}
										<Select.Item class="cursor-pointer" value={pdo.value}>{pdo.label}</Select.Item>
									{/each}
								</Select.Content>
								<Label
									class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
								>
									Past days</Label
								>
							</Select.Root>
						</div>
					</div>

					<div>
						<p>
							By default, we provide forecasts for 7 days, but you can access forecasts for up to 16
							days. If you're interested in past weather data, you can use the <mark>Past Days</mark
							>
							feature to access archived forecasts.
						</p>
					</div>
				</div>
			{/if}
			{#if $params.time_mode === 'time_interval'}
				<div in:fade class="flex flex-col gap-x-6 gap-y-4 lg:flex-row">
					<div class="mb-3 lg:w-1/2">
						<DatePicker
							bind:start_date={$params.start_date}
							bind:end_date={$params.end_date}
							{begin_date}
							{last_date}
						/>
						<div class="mt-3 md:mt-6">
							Quick:
							<Button
								variant="outline"
								class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
								onclick={(e) => {
									$params.start_date = '2022-01-01';
									$params.end_date = '2022-12-31';
								}}>Last year</Button
							>
							<Button
								variant="outline"
								class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
								onclick={(e) => {
									$params.start_date = '2023-01-01';
									$params.end_date = '2023-12-31';
								}}>Last 2 years</Button
							>
							<Button
								variant="outline"
								class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
								onclick={(e) => {
									$params.start_date = '2024-01-01';
									$params.end_date = '2024-12-31';
								}}>5 years</Button
							>
							<Button
								variant="outline"
								class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
								onclick={(e) => {
									$params.start_date = '2025-01-01';
									$params.end_date = endDateDefault;
								}}>2025</Button
							>
						</div>
					</div>
					<div class="mb-3 lg:w-1/2">
						<p>
							The <mark>Start Date</mark> and <mark>End Date</mark> options help you choose a range
							of dates more easily. Archived forecasts come from a series of weather model runs over
							time. You can access forecasts for up to 3 months and continuously archived in the
							<a href="/en/docs/historical-forecast-api">Historical Forecast API</a>. You can also
							check out our
							<a href="/en/docs/historical-weather-api">Historical Weather API</a>, which provides
							data going all the way back to 1940.
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

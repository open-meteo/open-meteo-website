<script lang="ts">
	import { api_key_preferences } from '$lib/stores/settings';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { Input } from '$lib/components/ui/input';

	import { defaultParameters } from './options';

	let model_default = '';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['temperature_2m', 'wind_speed_10m', 'cloud_cover']
	});

	let url = $state(
		'https://open-meteo.com/en/docs/historical-forecast-api?hourly=temperature_2m,wind_speed_10m,cloud_cover'
	);

	let apiCalls = $state(1);

	$effect(() => {});

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
</script>

<svelte:head>
	<title>🖩 API Calculator | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/calculator" />
	<meta name="description" content="" />
</svelte:head>

<div class="container my-6 lg:my-12">
	<Input bind:value={url} />

	<div class="">
		<strong> {apiCalls.toFixed(1)}</strong> API
		{apiCalls === 1 ? 'call' : 'calls'}

		<strong> {callWeight.toFixed(1)}</strong>
	</div>
</div>

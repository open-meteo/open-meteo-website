<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { api_key_preferences } from '$lib/stores/settings';

	import HighchartContainer from './highcharts-container.svelte';

	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import * as Alert from '$lib/components/ui/alert';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	import type { Writable } from 'svelte/store';
	import type { Parameters } from '$lib/docs';

	import './code-styles.css';

	interface Props {
		params: Writable<Parameters>;
		type?: String;
		action?: String;
		model_default?: String;
		sdk_type?: String;
		sdk_cache?: Number;
		defaultParameters: any;
		useStockChart?: boolean;
	}

	const int64Variables = ['sunrise', 'sunset'];

	let {
		params,
		type = 'forecast',
		action = 'forecast',
		model_default = '',
		sdk_type = 'weather_api',
		sdk_cache = 3600,
		defaultParameters,
		useStockChart = false
	}: Props = $props();

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

	/// `temperature_2m` to `Temperature2m`
	const titleCase = (s: string) =>
		s
			.replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
			.replace(/[-_]+(.)/g, (_, c) => c.toUpperCase());

	const camelCase = (s: string) => s.replace(/[-_]+(.)/g, (_, c) => c.toUpperCase());

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

	let previewUrl = $state('');
	$effect(() => {
		previewUrl = getUrl(server, parsedParams);
	});
	let xlsxUrl = $derived(getUrl(server, { ...parsedParams, format: 'xlsx' }));
	let csvUrl = $derived(getUrl(server, { ...parsedParams, format: 'csv' }));

	let sectionsWithData = $derived(
		['current', 'minutely_15', 'hourly', 'daily', 'six_hourly'].filter(
			(v) => v in $params && $params[v].length > 0
		)
	);
	let sectionsArrayWithData = $derived(
		['minutely_15', 'hourly', 'daily', 'six_hourly'].filter(
			(v) => v in $params && $params[v].length > 0
		)
	);

	const membersPerModel = (model: string): number => {
		switch (model) {
			case 'icon_seamless':
				return 40;
			case 'icon_global':
				return 40;
			case 'icon_eu':
				return 40;
			case 'icon_d2':
				return 20;
			case 'gfs_seamless':
				return 31;
			case 'gfs025':
				return 31;
			case 'ecmwf_ifs025':
				return 51;
			case 'gem_global':
				return 21;
		}
		return 1;
	};

	/// Adjusted call weight
	let callWeight = $derived(
		((params) => {
			let nDays = 1;
			if ('start_date' in params) {
				const start = new Date(params['start_date']).getTime();
				const end = new Date(params['end_date']).getTime();
				nDays = (end - start) / 1000 / 86400;
			} else {
				const forecast_days = params['forecast_days'] ?? 7;
				const past_days = params['past_days'] ?? 0;
				nDays = Number(forecast_days) + Number(past_days);
			}
			/// Number or models (including number of ensemble members)
			const nModels =
				sdk_type == 'ensemble_api'
					? ('models' in params
							? Array.isArray(params['models'])
								? params['models']
								: [params['models']]
							: []
						).reduce((previous: number, model: string) => {
							return previous + (membersPerModel(model) ?? 1);
						}, 0)
					: ('models' in params
							? Array.isArray(params['models'])
								? params['models']
								: [params['models']]
							: []
						).length;

			/// Number of weather variables for hourly, daily, current or minutely_15
			const nHourly =
				'hourly' in params
					? Array.isArray(params['hourly'])
						? params['hourly'].length
						: params['hourly'].length > 1
							? 1
							: 0
					: 0;
			const nDaily =
				'daily' in params
					? Array.isArray(params['daily'])
						? params['daily'].length
						: params['daily'].length > 1
							? 1
							: 0
					: 0;
			const nCurrent =
				'current' in params
					? Array.isArray(params['current'])
						? params['current'].length
						: params['current'].length > 1
							? 1
							: 0
					: 0;
			const nMinutely15 =
				'minutely_15' in params
					? Array.isArray(params['minutely_15'])
						? params['minutely_15'].length
						: params['minutely_15'].length > 1
							? 1
							: 0
					: 0;
			const nVariables = nHourly + nDaily + nCurrent + nMinutely15;

			/// Number of locations
			const nLocations = params['latitude']?.length ?? 1.0;

			/// Calculate adjusted weight
			const nVariablesModels = nVariables * Math.max(nModels, 1.0);
			const timeWeight = nDays / 14.0;
			const variablesWeight = nVariablesModels / 10.0;
			const variableTimeWeight = Math.max(variablesWeight, timeWeight * variablesWeight);
			return Math.max(1.0, variableTimeWeight) * nLocations;
		})(parsedParams)
	);

	function jsonToChart(data: any, downloadTime: number) {
		let yAxis: any = [];
		const codes = {
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

		let series: any = [];
		['hourly', 'six_hourly', 'three_hourly', 'daily', 'minutely_15'].forEach(
			function (section, index) {
				if (!(section in data)) {
					return;
				}
				Object.entries(data[section] || []).forEach(function (k) {
					if (k[0] == 'time' || k[0] == 'sunrise' || k[0] == 'sunset') {
						return;
					}
					let hourly_starttime = (data[section].time[0] + data.utc_offset_seconds) * 1000;
					let pointInterval = (data[section].time[1] - data[section].time[0]) * 1000;
					let unit = data[`${section}_units`][k[0]];
					let axisId = null;
					for (let i = 0; i < yAxis.length; i++) {
						if (yAxis[i].title.text == unit) {
							axisId = i;
						}
					}
					if (axisId == null) {
						yAxis.push({ title: { text: unit } });
						axisId = yAxis.length - 1;
					}
					let ser = {
						name: k[0],
						data: k[1],
						yAxis: axisId,
						pointStart: hourly_starttime,
						pointInterval: pointInterval,
						type:
							unit == 'mm' || unit == 'cm' || unit == 'inch' || unit == 'MJ/m²' ? 'column' : 'line',
						tooltip: {
							valueSuffix: ' ' + unit
						},
						dataGrouping: {
							groupPixelWidth: 8,
							units: [
								['minute', [1, 2, 5, 10, 15]],
								['hour', [1]],
								['day', [1]],
								['week', [1]],
								['month', [1, 3, 6]],
								['year', null]
							]
						}
						/*dataGrouping: {
                    enabled: true,
                    forced: true,
                    units: [['year',[1]]]
                }*/
					};

					if (k[0] == 'weather_code') {
						ser.tooltip.pointFormatter = function () {
							let condition = codes[this.y];
							return (
								'<span style="color:' +
								this.series.color +
								'">\u25CF</span> ' +
								this.series.name +
								': <b>' +
								condition +
								'</b> (' +
								this.y +
								' wmo)<br/>'
							);
						};
					}

					series.push(ser);
				});
			}
		);

		let plotBands: any = [];
		if ('daily' in data && 'sunrise' in data.daily && 'sunset' in data.daily) {
			let rise = data.daily.sunrise;
			let set = data.daily.sunset;
			plotBands = rise.map(function (r, i) {
				return {
					color: 'rgb(255, 255, 194)',
					from: (r + data.utc_offset_seconds) * 1000,
					to: (set[i] + data.utc_offset_seconds) * 1000
				};
			});
		}

		let latitude = data.latitude.toFixed(2);
		let longitude = data.longitude.toFixed(2);
		let title = `${latitude}°N ${longitude}°E`;

		if ('elevation' in data) {
			let elevation = data.elevation.toFixed(0);
			title = `${title} ${elevation}m above sea level`;
		}
		let generationtime_ms = data.generationtime_ms.toFixed(2);

		let utc_offset_sign = data.utc_offset_seconds < 0 ? '' : '+';

		let json = {
			title: {
				text: title
			},

			subtitle: {
				text: `Generated in ${generationtime_ms}ms, downloaded in ${downloadTime.toFixed(
					0
				)}ms, time in GMT${utc_offset_sign}${data.utc_offset_seconds / 3600}`
			},

			chart: {
				zoomType: 'x',
				zooming: {
					mouseWheel: {
						enabled: false
					}
				}
			},

			yAxis: yAxis,

			xAxis: {
				type: 'datetime',
				plotLines: [
					{
						value: Date.now() + data.utc_offset_seconds * 1000,
						color: 'red',
						width: 2
					}
				],
				plotBands: plotBands
			},

			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle'
			},

			plotOptions: {
				series: {
					label: {
						connectorAllowed: false
					}
				}
			},

			series: series,

			responsive: {
				rules: [
					{
						condition: {
							maxWidth: 800
						},
						chartOptions: {
							legend: {
								layout: 'horizontal',
								align: 'center',
								verticalAlign: 'bottom'
							}
						}
					}
				]
			},
			tooltip: {
				shared: series.length <= 5,
				animation: false
			}
		};
		return json;
	}

	let results: Promise<any> = $state(Promise.resolve(null));

	function reset() {
		results = Promise.resolve(null);
	}

	params.subscribe(reset);
	api_key_preferences.subscribe(reset);

	async function preview() {
		if (
			'latitude' in parsedParams &&
			Array.isArray(parsedParams.latitude) &&
			parsedParams.latitude.length > 5
		) {
			throw new Error('Can not preview more than 5 locations');
		}

		// Always set format=json to fetch data
		const fetchUrl = getUrl(server, {
			...parsedParams,
			format: 'json',
			timeformat: 'unixtime'
		});
		const t0 = performance.now();
		const result = await fetch(fetchUrl);

		if (!result.ok) {
			throw new Error(await result.text());
		}
		const json = await result.json();
		let tEnd = performance.now() - t0;
		if (Array.isArray(json)) {
			return json.map((x) => jsonToChart(x, tEnd));
		}

		return [jsonToChart(json, tEnd)];
	}

	function formatPrismVariableSelector(variable: string) {
		const regex =
			/(?<variable>[a-z_]+)_(((?<altitude>[0-9]+)m)|((?<pressure>[0-9]+)hPa)|((?<depth>[0-9]+)cm)|((?<depth_from>[0-9]+)_to_(?<depth_to>[0-9]+)cm))_?(?<aggregation>max|min|mean|p[0-9]{2}|dominant)?/;
		const matches = regex.exec(variable);
		if (matches == null || matches.groups == null) {
			return `x<span class="token punctuation">.</span>Variable<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> Variable<span class="token punctuation">.</span>${variable}`;
		}
		const groups = matches.groups;
		let results = [
			`x<span class="token punctuation">.</span>Variable<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> Variable<span class="token punctuation">.</span>${groups.variable}`
		];
		if (groups.altitude) {
			results.push(
				`x<span class="token punctuation">.</span>Altitude<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">${groups.altitude}</span>`
			);
		}
		if (groups.depth) {
			results.push(
				`x<span class="token punctuation">.</span>Depth<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">${groups.depth}</span>`
			);
		}
		if (groups.depth_from) {
			results.push(
				`x<span class="token punctuation">.</span>Depth<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">${groups.depth_from}</span>`
			);
			results.push(
				`x<span class="token punctuation">.</span>DepthTo<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">${groups.depth_to}</span>`
			);
		}
		if (groups.aggregation) {
			let aggregation = groups.aggregation;
			if (aggregation == 'max') {
				aggregation = 'maximum';
			}
			if (aggregation == 'min') {
				aggregation = 'minimum';
			}
			results.push(
				`x<span class="token punctuation">.</span>Aggregation<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> Aggregation<span class="token punctuation">.</span><span class="token number">${aggregation}</span>`
			);
		}
		return results.join(` <span class="token keyword">and</span> `);
	}

	function reload() {
		results = preview();
	}

	onMount(() => {
		reload();
	});

	/// Convert a given variable to syntax highlighted prism JS HTML
	function formatPrism(v: any): String {
		if (Array.isArray(v)) {
			const e = v.map(formatPrism).join(`<span class="token punctuation">,</span> `);
			return `<span class="token punctuation">[</span>${e}<span class="token punctuation">]</span>`;
		}
		if (typeof v == 'object') {
			const e = Object.entries(v)
				.map(
					([k, v]) =>
						`\n\t<span class="token string">"${k}"</span><span class="token punctuation">:</span> ${formatPrism(v)}`
				)
				.join(`<span class="token punctuation">,</span>`);
			return `<span class="token punctuation">&lbrace;</span>${e}\n<span class="token punctuation">&rbrace;</span>`;
		}
		if (!isNaN(v)) {
			return `<span class="token number">${v}</span>`;
		}
		return `<span class="token string">"${v}"</span>`;
	}

	let mode = $state('chart');
</script>

<h2 id="api_response" class="text-2xl md:text-3xl">API Response</h2>

<div class="mt-2 flex items-center md:mt-4">
	<div class="text-muted-foreground">Preview:</div>

	<ToggleGroup.Root type="single" bind:value={mode} class="justify-start gap-0">
		<div class="flex flex-wrap border-border ml-2 rounded-lg border">
			<ToggleGroup.Item
				value="chart"
				class="opacity-100! min-h-12 cursor-pointer rounded-e-none lg:min-h-[unset]"
				disabled={mode === 'chart'}
			>
				Chart & URL
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="python"
				class="opacity-100! min-h-12 cursor-pointer rounded-none lg:min-h-[unset]"
				disabled={mode === 'python'}
			>
				Python
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="typescript"
				class="opacity-100! min-h-12 cursor-pointer rounded-none lg:min-h-[unset]"
				disabled={mode === 'typescript'}
			>
				TypeScript
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="swift"
				class="opacity-100! min-h-12 cursor-pointer rounded-none lg:min-h-[unset]"
				disabled={mode === 'swift'}
			>
				Swift
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="other"
				class="opacity-100! min-h-12 cursor-pointer rounded-s-none lg:min-h-[unset]"
				disabled={mode === 'other'}
			>
				Other
			</ToggleGroup.Item>
		</div>
	</ToggleGroup.Root>
</div>

<div class="py-3">
	<!-- CHART -->
	{#if mode == 'chart'}
		<div
			in:fade
			style={useStockChart ? 'min-height: 500px' : 'min-height: 400px'}
			class="-mx-6 relative md:mx-0"
		>
			{#await results}
				<div
					class="border border-border rounded-lg bg-accent/25 absolute top-0 z-30 flex h-full w-full items-center justify-center"
					in:fade={{ delay: 400, duration: 400 }}
					out:fade={{ duration: 300 }}
				>
					<svg
						class="lucide lucide-loader-circle animate-spin"
						xmlns="http://www.w3.org/2000/svg"
						width="40"
						height="40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M21 12a9 9 0 1 1-6.219-8.56" />
					</svg>
					<span class="hidden">Loading...</span>
				</div>
			{:then results}
				{#if results}
					{#each results.slice(0, 10) as chart}
						<div transition:fade={{ duration: 300 }} class="w-full">
							<HighchartContainer
								options={chart}
								{useStockChart}
								style={useStockChart ? 'height: 500px' : 'height: 400px'}
							/>
						</div>
					{/each}
				{:else}
					<div
						transition:fade={{ duration: 300 }}
						style={useStockChart ? 'min-height: 500px' : 'min-height: 400px'}
					>
						<div
							class="border-border border rounded-lg absolute top-0 flex h-full w-full px-6 items-center justify-center"
						>
							<Alert.Root class="border-border my-auto w-[unset] md:!pl-8">
								<Alert.Description>
									<div class="flex items-center flex-col md:flex-row justify-center gap-2">
										<div class="text-muted-foreground flex items-center">
											<svg
												class="lucide lucide-info mr-2"
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<circle cx="12" cy="12" r="10" />
												<path d="M12 16v-4" />
												<path d="M12 8h.01" />
											</svg>
											Parameters have changed.
										</div>

										<Button variant="ghost" type="submit" class="flex !flex-row" onclick={reload}
											><svg
												class="lucide lucide-refresh-cw mr-1"
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
												<path d="M21 3v5h-5" />
												<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
												<path d="M8 16H3v5" />
											</svg>Reload Chart
										</Button>
									</div>
								</Alert.Description>
							</Alert.Root>
						</div>
					</div>
				{/if}
			{:catch error}
				<div
					transition:fade={{ duration: 300 }}
					class="border border-border rounded-lg bg-accent/25 absolute top-0 z-30 w-full"
					style={useStockChart ? 'height: 500px' : 'height: 400px'}
				>
					<div class="flex h-full w-full items-center justify-center px-6 dark:brightness-150">
						<Alert.Root variant="destructive" class="my-auto w-[unset] !pl-8">
							<Alert.Description>
								<div class="flex items-center justify-center gap-2">
									<div class="flex items-center">
										<svg
											class="lucide lucide-triangle-alert mr-2"
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path
												d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
											/>
											<path d="M12 9v4" />
											<path d="M12 17h.01" />
										</svg>

										{JSON.parse(error.message).reason}
									</div>

									<Button
										variant="outline"
										type="submit"
										class="border-red flex !flex-row"
										onclick={reload}
										><svg
											class="lucide lucide-refresh-cw mr-2"
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
											<path d="M21 3v5h-5" />
											<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
											<path d="M8 16H3v5" />
										</svg>Reload Chart
									</Button>
								</div>
							</Alert.Description>
						</Alert.Root>
					</div>
				</div>
			{/await}
		</div>
		<div class="mt-3 flex gap-3">
			<Button
				variant="outline"
				class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
				href={xlsxUrl}>Download XLSX</Button
			>
			<Button
				variant="outline"
				class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
				href={csvUrl}>Download CSV</Button
			>
		</div>

		<div class="mt-3 flex flex-col">
			<div>
				API URL
				<small class="text-muted-foreground"
					>(<a
						id="api_url_link"
						target="_blank"
						class="text-link underline underline-offset-2"
						href={previewUrl}>Open in new tab</a
					> or copy this URL into your application)</small
				>
			</div>
			{#if callWeight > 1}
				<p class="mt-2">
					Note: This API call is equivalent to <strong>{callWeight.toFixed(1)}</strong> calls because
					of factors like long time intervals, the number of locations, variables, or models involved.
				</p>
			{/if}
			<Input
				class="mt-2"
				type="text"
				id="api_url"
				readonly
				aria-label="Copy to clipboard"
				bind:value={previewUrl}
			/>
		</div>
	{/if}
	<!-- PYTHON -->

	{#if mode == 'python'}
		<div in:fade>
			<div>
				<p>
					The sample code automatically applies all the parameters selected above. It includes
					caching and the conversion to Pandas DataFrames. The use of DataFrames is entirely
					optional. You can find further details and examples in the <a
						href="https://pypi.org/project/openmeteo-requests/">Python API client</a
					> documentation.
				</p>
				<h4 class="text-xl md:text-2xl">Install</h4>
				<pre class=" my-2 overflow-auto rounded-lg py-2 md:my-4 -mx-6 md:ml-0 lg:mx-0">
pip install openmeteo-requests
pip install requests-cache retry-requests numpy pandas</pre>

				<h4 class="text-xl md:text-2xl">Usage</h4>
				<pre class=" my-2 overflow-auto rounded-lg py-2 md:my-4 -mx-6 md:ml-0 lg:mx-0"><code
						><span class="token keyword">import</span> openmeteo_requests
{#if sdk_type == 'ensemble_api'}
							<span class="token keyword">from</span> openmeteo_sdk.Variable <span
								class="token keyword">import</span
							> Variable
<span class="token keyword">from</span> openmeteo_sdk.Aggregation <span
								class="token keyword">import</span
							> Aggregation{/if}
<span class="token keyword">import</span> requests_cache
<span class="token keyword">import</span> pandas <span class="token keyword">as</span> pd
<span class="token keyword">from</span> retry_requests <span class="token keyword">import</span
						> retry

<span class="token comment"># Setup the Open-Meteo API client with cache and retry on error</span>
cache_session <span class="token operator">=</span> requests_cache<span class="token punctuation"
							>.</span
						>CachedSession<span class="token punctuation">(</span><span class="token string"
							>'.cache'</span
						><span class="token punctuation">,</span> expire_after <span class="token operator"
							>=</span
						> <span class="token number">{sdk_cache}</span><span class="token punctuation">)</span>
retry_session <span class="token operator">=</span> retry<span class="token punctuation">(</span
						>cache_session<span class="token punctuation">,</span> retries <span
							class="token operator">=</span
						> <span class="token number">5</span><span class="token punctuation">,</span
						> backoff_factor <span class="token operator">=</span> <span class="token number"
							>0.2</span
						><span class="token punctuation">)</span>
openmeteo <span class="token operator">=</span> openmeteo_requests<span class="token punctuation"
							>.</span
						>Client<span class="token punctuation">(</span>session <span class="token operator"
							>=</span
						> retry_session<span class="token punctuation">)</span>

<span class="token comment"># Make sure all required weather variables are listed here</span>
<span class="token comment"
							># The order of variables in hourly or daily is important to assign them correctly below</span
						>
url <span class="token operator">=</span> <span class="token string">"{server}"</span>
params <span class="token operator">=</span> {@html formatPrism(parsedParams)}
responses <span class="token operator">=</span> openmeteo<span class="token punctuation">.</span
						>weather_api<span class="token punctuation">(</span>url<span class="token punctuation"
							>,</span
						> params<span class="token operator">=</span>params<span class="token punctuation"
							>)</span
						>

<span class="token comment"
							># Process first location. Add a for-loop for multiple locations or weather models</span
						>
response <span class="token operator">=</span> responses<span class="token punctuation">[</span
						><span class="token number">0</span><span class="token punctuation">]</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span
							class="token string-interpolation"
							><span class="token string">f"Coordinates </span><span class="token interpolation"
								><span class="token punctuation">&lbrace;</span>response<span
									class="token punctuation">.</span
								>Latitude<span class="token punctuation">(</span><span class="token punctuation"
									>)</span
								><span class="token punctuation">&rbrace;</span></span
							><span class="token string">°N </span><span class="token interpolation"
								><span class="token punctuation">&lbrace;</span>response<span
									class="token punctuation">.</span
								>Longitude<span class="token punctuation">(</span><span class="token punctuation"
									>)</span
								><span class="token punctuation">&rbrace;</span></span
							><span class="token string">°E"</span></span
						><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span
							class="token string-interpolation"
							><span class="token string">f"Elevation </span><span class="token interpolation"
								><span class="token punctuation">&lbrace;</span>response<span
									class="token punctuation">.</span
								>Elevation<span class="token punctuation">(</span><span class="token punctuation"
									>)</span
								><span class="token punctuation">&rbrace;</span></span
							><span class="token string"> m asl"</span></span
						><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span
							class="token string-interpolation"
							><span class="token string">f"Timezone </span><span class="token interpolation"
								><span class="token punctuation">&lbrace;</span>response<span
									class="token punctuation">.</span
								>Timezone<span class="token punctuation">(</span><span class="token punctuation"
									>)</span
								><span class="token punctuation">&rbrace;</span></span
							><span class="token string"></span><span class="token interpolation"
								><span class="token punctuation">&lbrace;</span>response<span
									class="token punctuation">.</span
								>TimezoneAbbreviation<span class="token punctuation">(</span><span
									class="token punctuation">)</span
								><span class="token punctuation">&rbrace;</span></span
							><span class="token string">"</span></span
						><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span
							class="token string-interpolation"
							><span class="token string">f"Timezone difference to GMT+0 </span><span
								class="token interpolation"
								><span class="token punctuation">&lbrace;</span>response<span
									class="token punctuation">.</span
								>UtcOffsetSeconds<span class="token punctuation">(</span><span
									class="token punctuation">)</span
								><span class="token punctuation">&rbrace;</span></span
							><span class="token string"> s"</span></span
						><span class="token punctuation">)</span>
{#if 'current' in $params && $params.current.length > 0}<br /><span class="token comment"
								># Current values. The order of variables needs to be the same as requested.</span
							>
current <span class="token operator">=</span> response<span class="token punctuation"
								>.</span
							>Current<span class="token punctuation">(</span><span class="token punctuation"
								>)</span
							>
{#each $params['current'] as variable, index}current_{variable} <span
									class="token operator">=</span
								> current<span class="token punctuation">.</span>Variables<span
									class="token punctuation">(</span
								><span class="token number">{index}</span><span class="token punctuation">)</span
								><span class="token punctuation">.</span>Value<span class="token punctuation"
									>(</span
								><span class="token punctuation">)</span>{'\n'}{/each}
<span class="token keyword"
								>print</span
							><span class="token punctuation">(</span><span class="token string-interpolation"
								><span class="token string">f"Current time </span><span class="token interpolation"
									><span class="token punctuation">&lbrace;</span>current<span
										class="token punctuation">.</span
									>Time<span class="token punctuation">(</span><span class="token punctuation"
										>)</span
									><span class="token punctuation">&rbrace;</span></span
								><span class="token string">"</span></span
							><span class="token punctuation">)</span>
{#each $params.current as current}<span
									class="token keyword">print</span
								><span class="token punctuation">(</span><span class="token string-interpolation"
									><span class="token string">f"Current {current} </span><span
										class="token interpolation"
										><span class="token punctuation">&lbrace;</span>current_{current}<span
											class="token punctuation">&rbrace;</span
										></span
									><span class="token string">"</span></span
								><span class="token punctuation">)</span><br
								/>{/each}{/if}{#each sectionsArrayWithData as section}<br
							/>{#if sdk_type == 'ensemble_api'}
								<span class="token comment"># Process {section} data</span>
{section} <span
									class="token operator">=</span
								> response<span class="token punctuation">.</span>{titleCase(section)}<span
									class="token punctuation">(</span
								><span class="token punctuation">)</span>
{section}_variables <span
									class="token operator">=</span
								> <span class="token builtin">list</span><span class="token punctuation">(</span
								><span class="token builtin">map</span><span class="token punctuation">(</span><span
									class="token keyword">lambda</span
								> i<span class="token punctuation">:</span> {section}<span class="token punctuation"
									>.</span
								>Variables<span class="token punctuation">(</span>i<span class="token punctuation"
									>)</span
								><span class="token punctuation">,</span> <span class="token builtin">range</span
								><span class="token punctuation">(</span><span class="token number">0</span><span
									class="token punctuation">,</span
								> {section}<span class="token punctuation">.</span>VariablesLength<span
									class="token punctuation">(</span
								><span class="token punctuation">)</span><span class="token punctuation">)</span
								><span class="token punctuation">)</span><span class="token punctuation">)</span
								>
{#each $params[section] as variable}
									{section}_{variable} <span class="token operator">=</span> <span
										class="token builtin">filter</span
									><span class="token punctuation">(</span><span class="token keyword">lambda</span
									> x<span class="token punctuation">:</span> {@html formatPrismVariableSelector(
										variable
									)}<span class="token punctuation">,</span> {section}_variables<span
										class="token punctuation">)</span
									>{'\n'}
								{/each}{:else}<span class="token comment"
									># Process {section} data. The order of variables needs to be the same as requested.</span
								>
{section} <span class="token operator">=</span> response<span
									class="token punctuation">.</span
								>{titleCase(section)}<span class="token punctuation">(</span><span
									class="token punctuation">)</span
								>
{#each $params[section] as variable, index}{section}_{variable} <span
										class="token operator">=</span
									> {section}<span class="token punctuation">.</span>Variables<span
										class="token punctuation">(</span
									><span class="token number">{index}</span><span class="token punctuation"
									></span><span class="token punctuation">)</span><span class="token punctuation"
										>.</span
									>{int64Variables.includes(variable) ? 'ValuesInt64AsNumpy' : 'ValuesAsNumpy'}<span
										class="token punctuation">(</span
									><span class="token punctuation">)</span>{'\n'}{/each}{/if}
{section}_data <span
								class="token operator">=</span
							> <span class="token punctuation">&lbrace;</span><span class="token string"
								>"date"</span
							><span class="token punctuation">:</span> pd<span class="token punctuation">.</span
							>date_range<span class="token punctuation">(</span>
{'\t'}start <span
								class="token operator">=</span
							> pd<span class="token punctuation">.</span>to_datetime<span class="token punctuation"
								>(</span
							>{section}<span class="token punctuation">.</span>Time<span class="token punctuation"
								>(</span
							><span class="token punctuation">)</span><span class="token punctuation">,</span
							> unit <span class="token operator">=</span> <span class="token string">"s"</span
							><span class="token punctuation">,</span> utc <span class="token operator">=</span
							> <span class="token number">True</span><span class="token punctuation">)</span><span
								class="token punctuation">,</span
							>
{'\t'}end <span class="token operator">=</span> pd<span class="token punctuation"
								>.</span
							>to_datetime<span class="token punctuation">(</span>{section}<span
								class="token punctuation">.</span
							>TimeEnd<span class="token punctuation">(</span><span class="token punctuation"
								>)</span
							><span class="token punctuation">,</span> unit <span class="token operator">=</span
							> <span class="token string">"s"</span><span class="token punctuation">,</span
							> utc <span class="token operator">=</span> <span class="token number">True</span
							><span class="token punctuation">)</span><span class="token punctuation">,</span
							>
{'\t'}freq <span class="token operator">=</span> pd<span class="token punctuation"
								>.</span
							>Timedelta<span class="token punctuation">(</span>seconds <span class="token operator"
								>=</span
							> {section}<span class="token punctuation">.</span>Interval<span
								class="token punctuation">(</span
							><span class="token punctuation">)</span><span class="token punctuation">)</span><span
								class="token punctuation">,</span
							>
{'\t'}inclusive <span class="token operator">=</span> <span class="token string"
								>"left"</span
							>
<span class="token punctuation">)</span><span class="token punctuation"
								>&rbrace;</span
							>{#if sdk_type == 'ensemble_api'}
								<span class="token comment"># Process all members</span
								>{#each $params[section] as variable}<span class="token keyword">for</span
									> variable <span class="token keyword">in</span> {section}_{variable}<span
										class="token punctuation">:</span
									>
{'\t'}member <span class="token operator">=</span> variable<span
										class="token punctuation">.</span
									>EnsembleMember<span class="token punctuation">(</span><span
										class="token punctuation">)</span
									><span class="token punctuation"></span>
{'\t'}{section}_data<span
										class="token punctuation">[</span
									><span class="token string-interpolation"
										><span class="token string">f"{variable}_member</span><span
											class="token interpolation"
											><span class="token punctuation">&lbrace;</span>member<span
												class="token punctuation">&rbrace;</span
											></span
										><span class="token string">"</span></span
									><span class="token punctuation">]</span> <span class="token operator">=</span
									> variable<span class="token punctuation">.</span>ValuesAsNumpy<span
										class="token punctuation">(</span
									><span class="token punctuation">)</span>{'\n'}{/each}{:else}<br /><br
								/>{#each $params[section] as hourly}{section}_data<span class="token punctuation"
										>[</span
									><span class="token string-interpolation"
										><span class="token string">"{hourly}"</span></span
									><span class="token punctuation">]</span> <span class="token operator">=</span
									> {section}_{hourly}<br />{/each}{/if}
{section}_dataframe <span
								class="token operator">=</span
							> pd<span class="token punctuation">.</span>DataFrame<span class="token punctuation"
								>(</span
							>data <span class="token operator">=</span> {section}_data<span
								class="token punctuation">)</span
							>
<span class="token keyword">print</span><span class="token punctuation">(</span
							>{section}_dataframe<span class="token punctuation">)</span>{`\n`}{/each}
</code></pre>
			</div>
		</div>
	{/if}
	<!-- TYPESCRIPT -->
	{#if mode == 'typescript'}
		<div in:fade>
			<div>
				<p>
					The preview code applies all parameters above automatically and structures weather data
					into an easily usable object. More information and examples are available on <a
						href="https://www.npmjs.com/package/openmeteo">NPM</a
					>.
				</p>
				<p>
					Caveats: For the ensemble API, multiple members per variable are not correctly decoded.
					You will have to loop over `variables`.
				</p>
				<h4 class="text-xl md:text-2xl">Install</h4>
				<pre class=" my-2 overflow-auto rounded-lg py-2 md:my-4 -mx-6 md:ml-0 lg:mx-0"><code
						>npm install openmeteo</code
					></pre>
				<h4 class="text-xl md:text-2xl">Usage</h4>
				<pre class="my-2 overflow-auto rounded-lg py-2 md:my-4 -mx-6 md:ml-0 lg:mx-0">
<code
						><span class="token keyword">import</span> <span class="token punctuation"
							>&lbrace;</span
						> fetchWeatherApi <span class="token punctuation">&rbrace;</span> <span
							class="token keyword">from</span
						> <span class="token string">'openmeteo'</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> params <span class="token operator">=</span
						> {@html formatPrism(parsedParams)}<span class="token punctuation">;</span>
<span class="token keyword">const</span> url <span class="token operator">=</span> <span
							class="token string">"{server}"</span
						><span class="token punctuation">;</span>
<span class="token keyword">const</span> responses <span class="token operator">=</span> <span
							class="token keyword">await</span
						> <span class="token function">fetchWeatherApi</span><span class="token punctuation"
							>(</span
						>url<span class="token punctuation">,</span> params<span class="token punctuation"
							>)</span
						><span class="token punctuation">;</span>

<span class="token comment"
							>// Process first location. Add a for-loop for multiple locations or weather models</span
						>
<span class="token keyword">const</span> response <span class="token operator">=</span
						> responses<span class="token punctuation">[</span><span class="token number">0</span
						><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token comment">// Attributes for timezone and location</span>
<span class="token keyword">const</span> utcOffsetSeconds <span class="token operator">=</span
						> response<span class="token punctuation">.</span><span class="token function"
							>utcOffsetSeconds</span
						><span class="token punctuation">(</span><span class="token punctuation">)</span><span
							class="token punctuation">;</span
						>
<span class="token keyword">const</span> timezone <span class="token operator">=</span
						> response<span class="token punctuation">.</span><span class="token function"
							>timezone</span
						><span class="token punctuation">(</span><span class="token punctuation">)</span><span
							class="token punctuation">;</span
						>
<span class="token keyword">const</span> timezoneAbbreviation <span class="token operator">=</span
						> response<span class="token punctuation">.</span><span class="token function"
							>timezoneAbbreviation</span
						><span class="token punctuation">(</span><span class="token punctuation">)</span><span
							class="token punctuation">;</span
						>
<span class="token keyword">const</span> latitude <span class="token operator">=</span
						> response<span class="token punctuation">.</span><span class="token function"
							>latitude</span
						><span class="token punctuation">(</span><span class="token punctuation">)</span><span
							class="token punctuation">;</span
						>
<span class="token keyword">const</span> longitude <span class="token operator">=</span
						> response<span class="token punctuation">.</span><span class="token function"
							>longitude</span
						><span class="token punctuation">(</span><span class="token punctuation">)</span><span
							class="token punctuation">;</span
						>

{#each sectionsWithData as section}<span class="token keyword">const</span> {camelCase(
								section
							)} <span class="token operator">=</span> response<span class="token punctuation"
								>.</span
							><span class="token function">{camelCase(section)}</span><span
								class="token punctuation">(</span
							><span class="token punctuation">)</span><span class="token operator">!</span><span
								class="token punctuation">;</span
							>{'\n'}{/each}{#if $params.daily && ($params.daily.includes('sunrise') || $params.daily.includes('sunset'))}{#if $params.daily.includes('sunrise')}{'\n'}<span
									class="token keyword">const</span
								> sunrise <span class="token operator">=</span> daily<span class="token punctuation"
									>.</span
								><span class="token function">variables</span><span class="token punctuation"
									>(</span
								><span class="token number">{$params.daily.indexOf('sunrise')}</span><span
									class="token punctuation">)</span
								><span class="token operator">!</span><span class="token punctuation">;</span
								>{/if}{#if $params.daily.includes('sunset')}{'\n'}<span class="token keyword"
									>const</span
								> sunset <span class="token operator">=</span> daily<span class="token punctuation"
									>.</span
								><span class="token function">variables</span><span class="token punctuation"
									>(</span
								><span class="token number">{$params.daily.indexOf('sunset')}</span><span
									class="token punctuation">)</span
								><span class="token operator">!</span><span class="token punctuation">;</span
								>{/if}<br />{/if}<br /><span class="token comment"
							>// Note: The order of weather variables in the URL query and the indices below need to match!</span
						>
<span class="token keyword">const</span> weatherData <span class="token operator">=</span> <span
							class="token punctuation">&lbrace;</span
						>{#if 'current' in $params && $params.current.length > 0}<br />{'\t'}current<span
								class="token operator">:</span
							> <span class="token punctuation">&lbrace;</span>
{'\t'}{'\t'}time<span
								class="token operator">:</span
							> <span class="token keyword">new</span> <span class="token class-name">Date</span
							><span class="token punctuation">(</span><span class="token punctuation">(</span><span
								class="token function">Number</span
							><span class="token punctuation">(</span>current<span class="token punctuation"
								>.</span
							><span class="token function">time</span><span class="token punctuation">(</span><span
								class="token punctuation">)</span
							><span class="token punctuation">)</span> <span class="token operator">+</span
							> utcOffsetSeconds<span class="token punctuation">)</span> <span
								class="token operator">*</span
							> <span class="token number">1000</span><span class="token punctuation">)</span><span
								class="token punctuation">,</span
							>{#each $params.current as current, index}{'\n'}{'\t'}{'\t'}{camelCase(current)}<span
									class="token operator">:</span
								> current<span class="token punctuation">.</span><span class="token function"
									>variables</span
								><span class="token punctuation">(</span><span class="token number">{index}</span
								><span class="token punctuation">)</span><span class="token operator">!</span><span
									class="token punctuation">.</span
								><span class="token function">value</span><span class="token punctuation">(</span
								><span class="token punctuation">)</span><span class="token punctuation">,</span
								>{/each}
	<span class="token punctuation">&rbrace;</span><span
								class="token punctuation">,</span
							>{/if}{#each sectionsArrayWithData as section}<br />{'\t'}{camelCase(section)}<span
								class="token operator">:</span
							> <span class="token punctuation">&lbrace;</span>
{'\t'}{'\t'}<span class="line"
								>time<span class="token operator">:</span><span class="token punctuation"> [</span
								><span class="token operator">...</span><span class="token function">Array</span
								><span class="token punctuation">((</span><span class="token function">Number</span
								><span class="token punctuation">(</span><span>{section}</span><span
									class="token punctuation">.</span
								><span class="token function">timeEnd</span><span class="token punctuation"
									>()) </span><span class="token operator">-</span><span
									class="token function"> Number</span
								><span class="token punctuation">(</span><span>{section}</span><span
									class="token punctuation">.</span
								><span class="token function">time</span><span class="token punctuation"
									>())) </span><span class="token operator">/</span><span> {section}</span><span
									class="token punctuation">.</span
								><span class="token function">interval</span><span class="token punctuation"
									>())]</span
								><span class="token punctuation">.</span><span class="token function">map</span
								><span class="token punctuation">(</span></span
							><br /><span class="line"
								><span class="token punctuation">{'\t'}{'\t'}{'\t'}(</span><span
									style="font-style:italic;">_</span
								><span class="token punctuation">,</span><span style="font-style:italic"> i</span
								><span class="token punctuation">)</span><span> =&gt;</span><span
									class="token keyword"> new</span
								><span class="token class-name"> Date</span><span class="token punctuation">((</span
								><span class="token function">Number</span><span class="token punctuation">(</span
								><span>{section}</span><span class="token punctuation">.</span><span
									class="token function">time</span
								><span class="token punctuation">()) </span><span class="token operator">+</span
								><span> i </span><span class="token operator">*</span><span> {section}</span><span
									class="token punctuation">.</span
								><span class="token function">interval</span><span class="token punctuation"
									>() </span><span class="token operator">+</span><span> utcOffsetSeconds</span
								><span class="token punctuation">) </span><span class="token operator">*</span><span
									class="token number"> 1000</span
								><span class="token punctuation">)</span></span
							><br /><span class="token punctuation">		)</span><span class="token punctuation">,</span
							>{#each $params[section] as variable, index}{'\n'}{'\t'}{'\t'}{#if variable === 'sunrise' || variable === 'sunset'}<span
										class="line"
										>{variable}<span class="token operator">:</span><span
											class="token punctuation"> [</span
										><span class="token operator">...</span><span class="token function">Array</span
										><span class="token punctuation">(</span><span>{variable}</span><span
											class="token punctuation">.</span
										><span class="token function">valuesInt64Length</span><span
											class="token punctuation">())]</span
										><span class="token punctuation">.</span><span class="token function">map</span
										><span class="token punctuation">(</span></span
									><br /><span class="line"
										><span class="token punctuation">{'\t'}{'\t'}{'\t'}(</span><span
											style="font-style:italic;">_</span
										><span class="token punctuation">,</span><span
											style="font-style:italic"> i</span
										><span class="token punctuation">)</span><span> =&gt;</span><span
											class="token keyword"> new</span
										><span class="token class-name"> Date</span><span class="token punctuation"
											>((</span
										><span class="token function">Number</span><span class="token punctuation"
											>(</span
										><span>{variable}</span><span class="token punctuation">.</span><span
											class="token function">valuesInt64</span
										><span class="token punctuation">(i))</span><span
											class="token operator"> +</span
										><span> utcOffsetSeconds</span><span class="token punctuation">) </span><span
											class="token operator">*</span
										><span class="token number"> 1000</span><span class="token punctuation">)</span
										></span
									><br /><span class="token punctuation">		)</span><span class="token punctuation"
										>,</span
									>{:else}{camelCase(variable)}<span class="token operator">:</span> {camelCase(
										section
									)}<span class="token punctuation">.</span><span class="token function"
										>variables</span
									><span class="token punctuation">(</span><span class="token number">{index}</span
									><span class="token punctuation">)</span><span class="token operator">!</span
									><span class="token punctuation">.</span><span class="token function"
										>valuesArray</span
									><span class="token punctuation">(</span><span class="token punctuation">)</span
									><span class="token operator">!</span><span class="token punctuation">,</span
									>{/if}{/each}
{'\t'}<span class="token punctuation">&rbrace;</span><span
								class="token punctuation">,</span
							>{/each}
<span class="token punctuation">&rbrace;</span><span class="token punctuation">;</span>

<span class="token comment"
							>// `weatherData` now contains a simple structure with arrays for datetime and weather data</span
						>
{#each sectionsArrayWithData as section}<span class="token keyword">for</span> <span
								class="token punctuation">(</span
							><span class="token keyword">let</span> i <span class="token operator">=</span> <span
								class="token number">0</span
							><span class="token punctuation">;</span> i <span class="token operator">&lt;</span
							> weatherData<span class="token punctuation">.</span>{camelCase(section)}<span
								class="token punctuation">.</span
							>time<span class="token punctuation">.</span>length<span class="token punctuation"
								>;</span
							> i<span class="token operator">++</span><span class="token punctuation">)</span
							> <span class="token punctuation">&lbrace;</span>
{'\t'}<span class="token builtin"
								>console</span
							><span class="token punctuation">.</span><span class="token function">log</span><span
								class="token punctuation">(</span
							>
{'\t'}{'\t'}weatherData<span class="token punctuation">.</span>{camelCase(
								section
							)}<span class="token punctuation">.</span>time<span class="token punctuation">[</span
							>i<span class="token punctuation">]</span><span class="token punctuation">.</span
							><span class="token function">toISOString</span><span class="token punctuation"
								>(</span
							><span class="token punctuation">)</span>{#each $params[section] as variable}<span
									class="token punctuation">,</span
								>{'\n'}{'\t'}{'\t'}weatherData<span class="token punctuation">.</span>{camelCase(
									section
								)}<span class="token punctuation">.</span>{camelCase(variable)}<span
									class="token punctuation">[</span
								>i<span class="token punctuation">]</span
								>{#if variable === 'sunrise' || variable === 'sunset'}<span
										class="token punctuation">.</span
									><span class="token function">toISOString</span><span class="token punctuation"
										>(</span
									><span class="token punctuation">)</span>{/if}{/each}
{'\t'}<span
								class="token punctuation">)</span
							><span class="token punctuation">;</span>
<span class="token punctuation"
								>&rbrace;</span
							>{'\n'}{/each}
</code></pre>
			</div>
		</div>
	{/if}
	<!-- SWIFT -->
	{#if mode == 'swift'}
		<div in:fade>
			<div>
				<p>
					The preview code applies all parameters above automatically and structures weather data
					into an easily usable object. More information and examples are available on <a
						href="https://github.com/open-meteo/sdk/tree/main/swift">GitHub</a
					>.
				</p>
				<p>
					Caveats: For the ensemble API, multiple members per variable are not correctly decoded.
					You will have to loop over 'variables'.
				</p>
				<h4 class="text-xl md:text-2xl">Install</h4>
				<p class="my-3">Add OpenMeteoSdk as a dependency to your Package.swift</p>
				<pre class=" my-2 overflow-auto rounded-lg py-2 md:my-4 -mx-6 md:ml-0 lg:mx-0"><code
						>dependencies: [
{'\t'}.package(url: "https://github.com/open-meteo/sdk.git", from: "1.5.0")
],
targets: [
{'\t'}.target(name: "MyApp", dependencies: [
{'\t'}{'\t'}.product(name: "OpenMeteoSdk", package: "sdk"),
{'\t'}])
]</code
					></pre>
				<h4 class="text-xl md:text-2xl">Usage</h4>
				<pre class=" my-2 overflow-auto rounded-lg py-2 md:my-4 -mx-6 md:ml-0 lg:mx-0">
<code class="language-swift"
						><span class="token keyword">import</span> <span class="token class-name"
							>OpenMeteoSdk</span
						>

<span class="token comment">/// Make sure the URL contains `&format=flatbuffers`</span>
<span class="token keyword">let</span> url <span class="token operator">=</span> <span
							class="token function">URL</span
						><span class="token punctuation">(</span>string<span class="token punctuation">:</span
						> <span class="token string-literal"
							><span class="token string">"{previewUrl}&amp;format=flatbuffers"</span></span
						><span class="token punctuation">)</span><span class="token operator">!</span>
<span class="token keyword">let</span> responses <span class="token operator">=</span> <span
							class="token keyword">try</span
						> <span class="token keyword">await</span> <span class="token class-name"
							>WeatherApiResponse</span
						><span class="token punctuation">.</span><span class="token function">fetch</span><span
							class="token punctuation">(</span
						>url<span class="token punctuation">:</span> url<span class="token punctuation">)</span>

<span class="token comment"
							>/// Process first location. Add a for-loop for multiple locations or weather models</span
						>
<span class="token keyword">let</span> response <span class="token operator">=</span> responses<span
							class="token punctuation">[</span
						><span class="token number">0</span><span class="token punctuation">]</span>

<span class="token comment">/// Attributes for timezone and location</span>
<span class="token keyword">let</span> utcOffsetSeconds <span class="token operator">=</span
						> response<span class="token punctuation">.</span>utcOffsetSeconds
<span class="token keyword">let</span> timezone <span class="token operator">=</span> response<span
							class="token punctuation">.</span
						>timezone
<span class="token keyword">let</span> timezoneAbbreviation <span class="token operator">=</span
						> response<span class="token punctuation">.</span>timezoneAbbreviation
<span class="token keyword">let</span> latitude <span class="token operator">=</span> response<span
							class="token punctuation">.</span
						>latitude
<span class="token keyword">let</span> longitude <span class="token operator">=</span> response<span
							class="token punctuation">.</span
						>longitude <br /><br />{#each sectionsWithData as section, index}<span
								class="token keyword">let</span
							> {camelCase(section)} <span class="token operator">=</span> response<span
								class="token punctuation">.</span
							>{camelCase(section)}<span class="token operator">!</span><br />{/each}
<span class="token keyword">struct</span> <span class="token class-name">WeatherData</span> <span
							class="token punctuation">&lbrace;</span
						><br />{#each sectionsWithData as section, index}{'\t'}<span class="token keyword"
								>let</span
							> {camelCase(section)}<span class="token punctuation">:</span> <span
								class="token class-name">{titleCase(section)}</span
							><br />{/each}{#each sectionsWithData as section}<br />{'\t'}<span
								class="token keyword">struct</span
							> <span class="token class-name">{titleCase(section)}</span> <span
								class="token punctuation">&lbrace;</span
							>{#if section == 'current'}<br />{'\t'}{'\t'}<span class="token keyword">let</span
								> time<span class="token punctuation">:</span> <span class="token class-name"
									>Date</span
								>{#each $params[section] as variable}{'\n\t'}{'\t'}<span class="token keyword"
										>let</span
									> {camelCase(variable)}<span class="token punctuation">:</span> <span
										class="token class-name"
										>{int64Variables.includes(variable) ? 'Int64' : 'Float'}</span
									>{/each}{:else}<br />{'\t'}{'\t'}<span class="token keyword">let</span> time<span
									class="token punctuation">:</span
								> <span class="token punctuation">[</span><span class="token class-name">Date</span
								><span class="token punctuation">]</span>{#each $params[section] as variable}<br
									/>{'\t'}{'\t'}<span class="token keyword">let</span> {camelCase(variable)}<span
										class="token punctuation">:</span
									> <span class="token punctuation">[</span><span class="token class-name"
										>{int64Variables.includes(variable) ? 'Int64' : 'Float'}</span
									><span class="token punctuation">]</span>{/each}{/if}
{'\t'}<span
								class="token punctuation">&rbrace;</span
							>{/each}
<span class="token punctuation">&rbrace;</span>

<span class="token comment"
							>/// Note: The order of weather variables in the URL query and the `at` indices below need to match!</span
						>
<span class="token keyword">let</span> data <span class="token operator">=</span> <span
							class="token class-name">WeatherData</span
						><span class="token punctuation">(</span
						>{#each sectionsWithData as section, index}{#if index != 0}<span
									class="token punctuation">,</span
								>{/if}<br />{'\t'}{camelCase(section)}<span class="token punctuation">:</span> <span
								class="token punctuation">.</span
							><span class="token keyword">init</span><span class="token punctuation">(</span
							>{#if section == 'current'}<br />{'\t'}{'\t'}time<span class="token punctuation"
									>:</span
								> <span class="token class-name">Date</span><span class="token punctuation">(</span
								>timeIntervalSince1970<span class="token punctuation">:</span> <span
									class="token class-name">TimeInterval</span
								><span class="token punctuation">(</span>current<span class="token punctuation"
									>.</span
								>time <span class="token operator">+</span> <span class="token class-name"
									>Int64</span
								><span class="token punctuation">(</span>utcOffsetSeconds<span
									class="token punctuation">)</span
								><span class="token punctuation">)</span><span class="token punctuation">)</span
								>{#each $params[section] as variable, index}<span class="token punctuation">,</span
									>{'\n\t'}{'\t'}{camelCase(variable)}<span class="token punctuation">:</span
									> {camelCase(section)}<span class="token punctuation">.</span><span
										class="token function">variables</span
									><span class="token punctuation">(</span>at<span class="token punctuation">:</span
									> <span class="token number">{index}</span><span class="token punctuation">)</span
									><span class="token operator">!</span><span class="token punctuation">.</span
									>{int64Variables.includes(variable) ? 'valueInt64' : 'value'}{/each}
{'\t'}<span
									class="token punctuation">)</span
								>{:else}<br />{'\t'}{'\t'}time<span class="token punctuation">:</span> {camelCase(
									section
								)}<span class="token punctuation">.</span><span class="token function"
									>getDateTime</span
								><span class="token punctuation">(</span>offset<span class="token punctuation"
									>:</span
								> utcOffsetSeconds<span class="token punctuation">)</span
								>{#each $params[section] as variable, index}<span class="token punctuation">,</span
									>{'\n\t'}{'\t'}{camelCase(variable)}<span class="token punctuation">:</span
									> {camelCase(section)}<span class="token punctuation">.</span><span
										class="token function">variables</span
									><span class="token punctuation">(</span>at<span class="token punctuation">:</span
									> <span class="token number">{index}</span><span class="token punctuation">)</span
									><span class="token operator">!</span><span class="token punctuation">.</span
									>{int64Variables.includes(variable) ? 'valuesInt64' : 'values'}{/each}
{'\t'}<span
									class="token punctuation">)</span
								>{/if}{/each}
<span class="token punctuation">)</span>

<span class="token comment">/// Timezone `.gmt` is deliberately used. </span>
<span class="token comment">/// By adding `utcOffsetSeconds` before, local-time is inferred</span>
<span class="token keyword">let</span> dateFormatter <span class="token operator">=</span> <span
							class="token class-name">DateFormatter</span
						><span class="token punctuation">(</span><span class="token punctuation">)</span>
dateFormatter<span class="token punctuation">.</span>timeZone <span class="token operator">=</span
						> <span class="token punctuation">.</span>gmt
dateFormatter<span class="token punctuation">.</span>dateFormat <span class="token operator">=</span
						> <span class="token string-literal"
							><span class="token string">"yyyy-MM-dd HH:mm"</span></span
						>{#each sectionsArrayWithData as section}
							{'\n'}<span class="token keyword">for</span> <span class="token punctuation">(</span
							>i<span class="token punctuation">,</span> date<span class="token punctuation">)</span
							> <span class="token keyword">in</span> data<span class="token punctuation">.</span
							>{camelCase(section)}<span class="token punctuation">.</span>time<span
								class="token punctuation">.</span
							><span class="token function">enumerated</span><span class="token punctuation">(</span
							><span class="token punctuation">)</span> <span class="token punctuation"
								>&lbrace;</span
							>
{'\t'}<span class="token function">print</span><span class="token punctuation"
								>(</span
							>dateFormatter<span class="token punctuation">.</span><span class="token function"
								>string</span
							><span class="token punctuation">(</span>from<span class="token punctuation">:</span
							> date<span class="token punctuation">)</span><span class="token punctuation">)</span
							>{#each $params[section] as variable}{'\n\t'}<span class="token function">print</span
								><span class="token punctuation">(</span>data<span class="token punctuation">.</span
								>{camelCase(section)}<span class="token punctuation">.</span>{camelCase(
									variable
								)}<span class="token punctuation">[</span>i<span class="token punctuation">]</span
								><span class="token punctuation">)</span>{/each}
<span class="token punctuation"
								>&rbrace;</span
							>{/each}
</code></pre>
			</div>
		</div>
	{/if}
	<!-- OTHER -->
	{#if mode == 'other'}
		<div in:fade>
			<div>
				<p>
					Support for additional programming languages in our integrations may be available in the
					future. If your preferred programming language isn't currently supported, you can still
					use the JSON or CSV format, which should function in most programming languages.
				</p>
				<p>
					If you're interested in contributing and want to assist in creating integrations, you can
					refer to the <a href="https://github.com/open-meteo/sdk">Open-Meteo SDK</a> , which provides
					detailed instructions and the FlatBuffers schema files. You can also open a GitHub ticket to
					request integrations for a particular programming language.
				</p>
			</div>
		</div>
	{/if}
</div>

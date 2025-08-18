<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { objectDifference } from '$lib/utils';
	import { membersPerModel } from '$lib/utils/meteo';

	import { api_key_preferences } from '$lib/stores/settings';

	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import * as Alert from '$lib/components/ui/alert';

	import type { APIKeyPreferences, Parameters } from '$lib/docs';
	import type { UrlHashStore } from '$lib/stores/url-hash-store';

	import HighchartContainer from './highcharts/highcharts-container.svelte';

	import { jsonToChart } from './highcharts/json-to-chart';

	import { swiftCodeExample } from './code-examples/swift-code-example';
	import { pythonCodeExample } from './code-examples/python-code-example';
	import { typescriptCodeExample } from './code-examples/typescript-code-example';

	import { swiftInstallCode } from './installs/swift-install-code';
	import { pythonInstallCode } from './installs/python-install-code';
	import { typescriptInstallCode } from './installs/typescript-install-code';

	interface Props {
		params: UrlHashStore;
		type?: string;
		action?: string;
		model_default?: string;
		sdk_type?: string;
		sdk_cache?: number;
		defaultParameters: Parameters;
		useStockChart?: boolean;
	}

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

	/// Parsed params that resolved CSV fields
	let parsedParams = $derived(
		((p: Parameters, api_key_preferences: APIKeyPreferences) => {
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
					const lats: number[] = [];
					const lons: number[] = [];
					const elevation: number[] = [];
					const timezone: string[] = [];
					const start_date: string[] = [];
					const end_date: string[] = [];
					const csv: string = params['csv_coordinates'];
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
		((api_key_preferences: APIKeyPreferences) => {
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

	let csvUrl = $derived(
		`${server}?${new URLSearchParams({ ...parsedParams, format: 'csv' })}`.replaceAll('%2C', ',')
	);
	let xlsxUrl = $derived(
		`${server}?${new URLSearchParams({ ...parsedParams, format: 'xlsx' })}`.replaceAll('%2C', ',')
	);
	let previewUrl = $derived(
		`${server}?${new URLSearchParams(parsedParams)}`.replaceAll('%2C', ',')
	);

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
			let nLocations = 1;
			if (params['latitude'] && Array == params['latitude'].constructor) {
				nLocations = params['latitude']?.length ?? 1;
			}
			/// Calculate adjusted weight
			const nVariablesModels = nVariables * Math.max(nModels, 1.0);
			const timeWeight = nDays / 14.0;
			const variablesWeight = nVariablesModels / 10.0;
			const variableTimeWeight = Math.max(variablesWeight, timeWeight * variablesWeight);
			return Math.max(1.0, variableTimeWeight) * nLocations;
		})(parsedParams)
	);

	let results: Promise<any> = $state(Promise.resolve(null));

	function reset() {
		results = Promise.resolve(null);
	}

	params.subscribe(reset);
	api_key_preferences.subscribe(reset);

	async function preview() {
		if (
			('latitude' in parsedParams &&
				Array.isArray(parsedParams.latitude) &&
				parsedParams.latitude.length > 5) ||
			$params.location_mode === 'bounding_box'
		) {
			throw new Error('Can not preview more than 5 locations');
		}

		// Always set format=json to fetch data
		const fetchUrl =
			`${server}?${new URLSearchParams({ ...parsedParams, format: 'json', timeformat: 'unixtime' })}`.replaceAll(
				'%2C',
				','
			);
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

	function reload() {
		results = preview();
	}

	onMount(() => {
		reload();
	});

	const numberOfLocations = $derived.by(() => {
		if (
			parsedParams.latitude &&
			parsedParams.latitude.constructor === Array &&
			parsedParams.latitude.length > 1
		) {
			return parsedParams.latitude.length;
		} else if ($params.location_mode === 'bounding_box') {
			return 'bounding box';
		} else {
			return 0;
		}
	});

	const numberOfModels = $derived.by(() => {
		if (
			parsedParams.models &&
			parsedParams.models.constructor === Array &&
			parsedParams.models.length > 1
		) {
			return parsedParams.models.length;
		} else {
			return 0;
		}
	});

	const multipleLocationsOrModels = $derived.by(() => {
		if (numberOfLocations) {
			return true;
		} else if (numberOfModels) {
			return true;
		} else {
			return false;
		}
	});

	let pythonCode = $derived.by(() =>
		pythonCodeExample(
			parsedParams,
			multipleLocationsOrModels,
			numberOfLocations,
			numberOfModels,
			server,
			sdk_type,
			sdk_cache
		)
	);

	let typescriptCode = $derived.by(() =>
		typescriptCodeExample(
			parsedParams,
			multipleLocationsOrModels,
			numberOfLocations,
			numberOfModels,
			server,
			sdk_type
		)
	);

	let swiftCode = $derived.by(() =>
		swiftCodeExample(
			parsedParams,
			multipleLocationsOrModels,
			numberOfLocations,
			numberOfModels,
			server,
			sdk_type,
			previewUrl
		)
	);

	let mode = $state('chart');
</script>

<a href="#api_response">
	<h2 id="api_response" class="text-2xl md:text-3xl">API Response</h2>
</a>

<div class="mt-2 -mr-6 flex items-center gap-2 overflow-auto md:mt-4 md:mr-0">
	<div class="text-muted-foreground">Preview:</div>

	<div class="border-border flex rounded-md border">
		<Button
			variant="ghost"
			class="items-center gap-1 rounded-e-none !opacity-100 duration-300 {mode === 'chart'
				? 'bg-accent cursor-not-allowed'
				: ''}"
			disabled={mode === 'chart'}
			onclick={() => {
				mode = 'chart';
			}}
		>
			Chart & URL
		</Button>

		<Button
			variant="ghost"
			class="items-center gap-1 rounded-none !opacity-100 duration-300 {mode === 'python'
				? 'bg-accent cursor-not-allowed'
				: ''}"
			disabled={mode === 'python'}
			onclick={() => {
				mode = 'python';
			}}
		>
			Python
		</Button>
		<Button
			variant="ghost"
			class="items-center gap-1 rounded-none !opacity-100 duration-300 {mode === 'typescript'
				? 'bg-accent cursor-not-allowed'
				: ''}"
			disabled={mode === 'typescript'}
			onclick={() => {
				mode = 'typescript';
			}}
		>
			TypeScript
		</Button>
		<Button
			variant="ghost"
			class="items-center gap-1 rounded-none !opacity-100 duration-300 {mode === 'swift'
				? 'bg-accent cursor-not-allowed'
				: ''}"
			disabled={mode === 'swift'}
			onclick={() => {
				mode = 'swift';
			}}
		>
			Swift
		</Button>
		<Button
			variant="ghost"
			class="items-center gap-1 rounded-s-none !opacity-100 duration-300 {mode === 'other'
				? 'bg-accent cursor-not-allowed'
				: ''}"
			disabled={mode === 'other'}
			onclick={() => {
				mode = 'other';
			}}
		>
			Other
		</Button>
	</div>
</div>

<div class="py-3">
	<!-- CHART -->
	{#if mode == 'chart'}
		<div
			in:fade
			style={useStockChart ? 'min-height: 500px' : 'min-height: 400px'}
			class="relative -mx-6 md:mx-0"
		>
			{#await results}
				<div
					class="border-border bg-accent/25 absolute top-0 z-30 flex h-full w-full items-center justify-center rounded-lg border"
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
					{#each results.slice(0, 10) as chart, i (i)}
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
							class="border-border absolute top-0 flex h-full w-full items-center justify-center rounded-lg border px-6"
						>
							<Alert.Root class="border-border my-auto w-[unset] md:!pl-8">
								<Alert.Description>
									<div class="flex flex-col items-center justify-center gap-2 md:flex-row">
										<div class="text-muted-foreground flex items-center">
											<svg
												class="lucide lucide-info mr-2"
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
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
												class="lucide lucide-refresh-cw"
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
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
					class="border-border bg-accent/25 absolute top-0 z-30 w-full rounded-lg border"
					style={useStockChart ? 'height: 500px' : 'height: 400px'}
				>
					<div class="flex h-full w-full items-center justify-center px-6 dark:brightness-150">
						<Alert.Root variant="destructive" class="my-auto w-[unset] !pl-8">
							<Alert.Description>
								<div class="flex items-center justify-center gap-2">
									<div class="flex items-center">
										<svg
											class="lucide lucide-triangle-alert mr-2 min-w-[20px]"
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
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
											class="lucide lucide-refresh-cw"
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
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
				<div
					class="-mx-6 my-2 overflow-auto rounded-lg bg-[#FAFAFA] md:my-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
				>
					{@html pythonInstallCode}
				</div>

				<h4 class="text-xl md:text-2xl">Usage</h4>
				<div
					class="-mx-6 mt-2 overflow-auto rounded-lg bg-[#FAFAFA] md:mt-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
				>
					{@html pythonCode}
				</div>
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
				<h4 class="text-xl md:text-2xl">Install</h4>
				<div
					class="-mx-6 my-2 overflow-auto rounded-lg bg-[#FAFAFA] md:my-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
				>
					{@html typescriptInstallCode}
				</div>
				<h4 class="text-xl md:text-2xl">Usage</h4>
				<div
					class="-mx-6 mt-2 overflow-auto rounded-lg bg-[#FAFAFA] md:mt-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
				>
					{@html typescriptCode}
				</div>
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
				<h4 class="text-xl md:text-2xl">Install</h4>
				<p class="my-3">Add OpenMeteoSdk as a dependency to your Package.swift</p>
				<div
					class="-mx-6 my-2 overflow-auto rounded-lg bg-[#FAFAFA] md:my-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
				>
					{@html swiftInstallCode}
				</div>
				<h4 class="text-xl md:text-2xl">Usage</h4>
				<div
					class="-mx-6 mt-2 overflow-auto rounded-lg bg-[#FAFAFA] md:mt-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
				>
					{@html swiftCode}
				</div>
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

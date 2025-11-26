<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { apiKeyPreferences } from '$lib/stores/settings';

	import { objectDifference } from '$lib/utils';
	import { membersPerModel } from '$lib/utils/meteo';

	import * as Alert from '$lib/components/ui/alert';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	import { pythonCodeExample } from './code-examples/python-code-example';
	import { swiftCodeExample } from './code-examples/swift-code-example';
	import { typescriptCodeExample } from './code-examples/typescript-code-example';
	import HighchartContainer from './highcharts/highcharts-container.svelte';
	import { jsonToChart } from './highcharts/json-to-chart';
	import { pythonInstallCode } from './installs/python-install-code';
	import { swiftInstallCode } from './installs/swift-install-code';
	import { typescriptInstallCode } from './installs/typescript-install-code';

	import type { APIKeyPreferences, Parameters } from '$lib/docs';
	import type { UrlHashStore } from '$lib/stores/url-hash-store';
	import type { ChartOptions } from 'highcharts';

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
		((p: Parameters, apiKeyPreferences: APIKeyPreferences) => {
			const jsonParams = { ...p };
			if ('time_mode' in jsonParams) {
				if (jsonParams.time_mode == 'forecast_days') {
					delete jsonParams['start_date'];
					delete jsonParams['end_date'];
				}
				if (jsonParams.time_mode == 'time_interval') {
					delete jsonParams['forecast_days'];
					delete jsonParams['past_days'];
				}
				delete jsonParams['csv_time_intervals'];
				delete jsonParams['time_mode'];
			}
			if ('location_mode' in jsonParams) {
				if (jsonParams.location_mode == 'csv_coordinates' && jsonParams['csv_coordinates']) {
					const lats: number[] = [];
					const lons: number[] = [];
					const elevation: number[] = [];
					const timezone: string[] = [];
					const start_date: string[] = [];
					const end_date: string[] = [];
					const csv: string = jsonParams['csv_coordinates'];
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
					jsonParams['latitude'] = lats;
					jsonParams['longitude'] = lons;
					if (elevation.length > 0) {
						jsonParams['elevation'] = elevation;
					}
					if (timezone.length > 0) {
						jsonParams['timezone'] = timezone;
					}
					if (start_date.length > 0) {
						jsonParams['start_date'] = start_date;
						jsonParams['end_date'] = end_date;
						delete jsonParams['forecast_days'];
						delete jsonParams['past_days'];
					}
				}
				delete jsonParams['location_mode'];
				delete jsonParams['csv_coordinates'];
			}
			// Cast 1-element arrays to a scalar value
			for (const key in jsonParams) {
				if (Array.isArray(jsonParams[key]) && jsonParams[key].length == 1) {
					jsonParams[key] = jsonParams[key][0];
				}
			}

			if (model_default != '' && !('models' in jsonParams && jsonParams['models'] != '')) {
				jsonParams['models'] = model_default;
			}

			if (apiKeyPreferences.use == 'commercial') {
				jsonParams['apikey'] = apiKeyPreferences.apikey;
			}

			if ($params.location_mode !== 'bounding_box' && jsonParams.bounding_box) {
				delete jsonParams.bounding_box;
			}

			return objectDifference(jsonParams, defaultParameters);
		})($params, $apiKeyPreferences)
	);

	let server = $derived(
		((apiKeyPreferences: APIKeyPreferences) => {
			let serverPrefix = type == 'forecast' ? 'api' : `${type}-api`;
			switch (apiKeyPreferences.use) {
				case 'commercial':
					return `https://customer-${serverPrefix}.open-meteo.com/v1/${action}`;
				case 'self_hosted':
					return `${apiKeyPreferences.self_host_server}/v1/${action}`;
				default:
					return `https://${serverPrefix}.open-meteo.com/v1/${action}`;
			}
		})($apiKeyPreferences)
	);

	let csvUrl = $derived.by(() => {
		const urlParams = { ...parsedParams };
		urlParams.format = 'csv';
		return `${server}?${new URLSearchParams(urlParams)}`.replaceAll('%2C', ',');
	});
	let xlsxUrl = $derived.by(() => {
		const urlParams = { ...parsedParams };
		urlParams.format = 'xlsx';
		return `${server}?${new URLSearchParams(urlParams)}`.replaceAll('%2C', ',');
	});
	let previewUrl = $derived(
		`${server}?${new URLSearchParams(parsedParams)}`.replaceAll('%2C', ',')
	);

	/// Adjusted call weight
	let callWeight = $derived(
		((cwParams) => {
			let nDays = 1;
			if ('start_date' in cwParams) {
				const start = new Date(cwParams['start_date'] as string).getTime();
				const end = new Date(cwParams['end_date'] as string).getTime();
				nDays = (end - start) / 1000 / 86400;
			} else {
				const forecast_days = cwParams['forecast_days'] ?? 7;
				const past_days = cwParams['past_days'] ?? 0;
				nDays = Number(forecast_days) + Number(past_days);
			}
			/// Number or models (including number of ensemble members)
			const nModels = Number(
				sdk_type == 'ensemble_api'
					? (cwParams.models
							? Array.isArray(cwParams.models)
								? cwParams.models
								: [cwParams.models]
							: []
						).reduce((previous: number, model: string) => {
							return previous + (membersPerModel(model) ?? 1);
						}, 0)
					: (cwParams.models
							? Array.isArray(cwParams.models)
								? cwParams.models
								: [cwParams.models]
							: []
						).length
			);

			/// Number of weather variables for hourly, daily, current or minutely_15
			const nHourly = cwParams.hourly
				? Array.isArray(cwParams.hourly)
					? cwParams.hourly.length
					: cwParams.hourly.length > 1
						? 1
						: 0
				: 0;
			const nDaily = cwParams.daily
				? Array.isArray(cwParams.daily)
					? cwParams.daily.length
					: cwParams.daily.length > 1
						? 1
						: 0
				: 0;
			const nCurrent = cwParams.current
				? Array.isArray(cwParams.current)
					? cwParams.current.length
					: cwParams.current.length > 1
						? 1
						: 0
				: 0;
			const nMinutely15 = cwParams.minutely_15
				? Array.isArray(cwParams.minutely_15)
					? cwParams.minutely_15.length
					: cwParams.minutely_15.length > 1
						? 1
						: 0
				: 0;
			const nVariables = nHourly + nDaily + nCurrent + nMinutely15;

			/// Number of locations
			let nLocations = 1;
			if (cwParams['latitude'] && Array == cwParams['latitude'].constructor) {
				nLocations = cwParams['latitude']?.length ?? 1;
			}
			/// Calculate adjusted weight
			const nVariablesModels = nVariables * Math.max(nModels, 1.0);
			const timeWeight = nDays / 14.0;
			const variablesWeight = nVariablesModels / 10.0;
			const variableTimeWeight = Math.max(variablesWeight, timeWeight * variablesWeight);
			return Math.max(1.0, variableTimeWeight) * nLocations;
		})(parsedParams)
	);

	let error = $state('');
	let results: Promise<ChartOptions[] | null> = $state(new Promise((resolve) => resolve(null)));
	const reset = () => {
		error = '';
		results = new Promise((resolve) => resolve(null));
	};

	// reset results on variable changes
	params.subscribe(reset);
	apiKeyPreferences.subscribe(reset);

	const preview = async () => {
		if (
			'latitude' in parsedParams &&
			Array.isArray(parsedParams.latitude) &&
			parsedParams.latitude.length > 5
		) {
			throw new Error('Can not preview more than 5 locations');
		}

		if ($params.location_mode !== 'bounding_box') {
			delete $params.bounding_box;
		}

		const urlParams = { ...parsedParams };
		urlParams.format = 'json'; // Always set format=json to fetch data
		urlParams.timeformat = 'unixtime';

		const url = `${server}?${new URLSearchParams(urlParams)}`.replaceAll('%2C', ',');

		try {
			const t0 = performance.now();

			const result = await fetch(url);
			const json = await result.json();

			if (!result.ok) {
				throw new Error(json.reason);
			}
			let tEnd = performance.now() - t0;
			if (Array.isArray(json)) {
				return json.map((x) => jsonToChart(x, tEnd));
			} else {
				return [jsonToChart(json, tEnd)];
			}
		} catch (err) {
			if (err instanceof Error) error = err.message;
			return null;
		}
	};

	const reload = () => {
		results = preview();
	};

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

	let codeInstallCopied = $state(false);
	let codeExampleCopied = $state(false);
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
		{#if sdk_type != 'ensemble_api'}
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
		{/if}
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
			{#if error}
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

										{error}
									</div>

									<Button
										variant="outline"
										type="submit"
										class="border-red flex !flex-row"
										onclick={() => {
											setTimeout(() => {
												reload();
											}, 100);
										}}
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
			{:else}
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
						{#if results.length > 10}
							<Alert.Root variant="info" class="mt-2 md:mt-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-info-icon lucide-info"
									><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path
										d="M12 8h.01"
									/></svg
								>
								<Alert.Description>
									Only first 10/{results.length} locations are shown
								</Alert.Description>
							</Alert.Root>
						{/if}
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
				{/await}
			{/if}
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
					class="code-install group relative -mx-6 my-2 overflow-auto rounded-lg bg-[#FAFAFA] md:my-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
				>
					{@html pythonInstallCode}
					<div
						class="absolute duration-300 right-2 top-2 lg:right-4 lg:top-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
					>
						<Button
							onclick={() => {
								const query = document.querySelector('.code-install pre');
								if (query) {
									navigator.clipboard.writeText(query.textContent);
									codeInstallCopied = true;
									setTimeout(() => {
										codeInstallCopied = false;
									}, 1250);
								}
							}}
							>{#if codeInstallCopied}<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg
								>{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.4"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-clipboard-copy-icon lucide-clipboard-copy"
									><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path
										d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
									/><path d="M16 4h2a2 2 0 0 1 2 2v4" /><path d="M21 14H11" /><path
										d="m15 10-4 4 4 4"
									/></svg
								>{/if}</Button
						>
					</div>
				</div>

				<h4 class="text-xl md:text-2xl">Usage</h4>
				<div
					class="code-example relative group -mx-6 mt-2 overflow-auto rounded-lg bg-[#FAFAFA] md:mt-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
				>
					{@html pythonCode}
					<div
						class="absolute duration-300 right-2 top-2 lg:right-4 lg:top-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
					>
						<Button
							onclick={() => {
								const query = document.querySelector('.code-example pre');
								if (query) {
									navigator.clipboard.writeText(query.textContent);
									codeExampleCopied = true;
									setTimeout(() => {
										codeExampleCopied = false;
									}, 1250);
								}
							}}
							>{#if codeExampleCopied}<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg
								>{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.4"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-clipboard-copy-icon lucide-clipboard-copy"
									><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path
										d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
									/><path d="M16 4h2a2 2 0 0 1 2 2v4" /><path d="M21 14H11" /><path
										d="m15 10-4 4 4 4"
									/></svg
								>{/if}</Button
						>
					</div>
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
					class="code-install relative group -mx-6 my-2 overflow-auto rounded-lg bg-[#FAFAFA] md:my-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
				>
					{@html typescriptInstallCode}
					<div
						class="absolute duration-300 right-2 top-2 lg:right-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
					>
						<Button
							onclick={() => {
								const query = document.querySelector('.code-install pre');
								if (query) {
									navigator.clipboard.writeText(query.textContent);
									codeInstallCopied = true;
									setTimeout(() => {
										codeInstallCopied = false;
									}, 1250);
								}
							}}
							>{#if codeInstallCopied}<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg
								>{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.4"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-clipboard-copy-icon lucide-clipboard-copy"
									><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path
										d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
									/><path d="M16 4h2a2 2 0 0 1 2 2v4" /><path d="M21 14H11" /><path
										d="m15 10-4 4 4 4"
									/></svg
								>{/if}</Button
						>
					</div>
				</div>
				<h4 class="text-xl md:text-2xl">Usage</h4>
				<div
					class="code-example relative group -mx-6 mt-2 overflow-auto rounded-lg bg-[#FAFAFA] md:mt-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
				>
					{@html typescriptCode}
					<div
						class="absolute duration-300 right-2 top-2 lg:right-4 lg:top-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
					>
						<Button
							onclick={() => {
								const query = document.querySelector('.code-example pre');
								if (query) {
									navigator.clipboard.writeText(query.textContent);
									codeExampleCopied = true;
									setTimeout(() => {
										codeExampleCopied = false;
									}, 1250);
								}
							}}
							>{#if codeExampleCopied}<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg
								>{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.4"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-clipboard-copy-icon lucide-clipboard-copy"
									><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path
										d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
									/><path d="M16 4h2a2 2 0 0 1 2 2v4" /><path d="M21 14H11" /><path
										d="m15 10-4 4 4 4"
									/></svg
								>{/if}</Button
						>
					</div>
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
					class="code-install group relative -mx-6 my-2 overflow-auto rounded-lg bg-[#FAFAFA] md:my-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
				>
					{@html swiftInstallCode}
					<div
						class="absolute duration-300 right-2 top-2 lg:right-4 lg:top-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
					>
						<Button
							onclick={() => {
								const query = document.querySelector('.code-install pre');
								if (query) {
									navigator.clipboard.writeText(query.textContent);
									codeInstallCopied = true;
									setTimeout(() => {
										codeInstallCopied = false;
									}, 1250);
								}
							}}
							>{#if codeInstallCopied}<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg
								>{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.4"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-clipboard-copy-icon lucide-clipboard-copy"
									><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path
										d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
									/><path d="M16 4h2a2 2 0 0 1 2 2v4" /><path d="M21 14H11" /><path
										d="m15 10-4 4 4 4"
									/></svg
								>{/if}</Button
						>
					</div>
				</div>
				<h4 class="text-xl md:text-2xl">Usage</h4>
				<div
					class="code-example group relative -mx-6 mt-2 overflow-auto rounded-lg bg-[#FAFAFA] md:mt-4 md:ml-0 lg:mx-0 dark:bg-[#212121]"
				>
					{@html swiftCode}
					<div
						class="absolute duration-300 right-2 top-2 lg:right-4 lg:top-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
					>
						<Button
							onclick={() => {
								const query = document.querySelector('.code-example pre');
								if (query) {
									navigator.clipboard.writeText(query.textContent);
									codeExampleCopied = true;
									setTimeout(() => {
										codeExampleCopied = false;
									}, 1250);
								}
							}}
							>{#if codeExampleCopied}<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg
								>{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.4"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-clipboard-copy-icon lucide-clipboard-copy"
									><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path
										d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
									/><path d="M16 4h2a2 2 0 0 1 2 2v4" /><path d="M21 14H11" /><path
										d="m15 10-4 4 4 4"
									/></svg
								>{/if}</Button
						>
					</div>
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

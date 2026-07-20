<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';

	import { fade, fadeOutAbsolute } from '$lib/utils/transitions';

	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	import AnimateHeight from '$lib/components/animate-height/animate-height.svelte';
	import DatePicker from '$lib/components/date/date-picker.svelte';
	import TimeSelector from '$lib/components/time/time-selector.svelte';

	import { type Parameters } from '$lib/docs';

	interface Props {
		params: Parameters;
		forecastDaysOptions: { value: string; label: string }[];
		pastDaysOptions: { value: string; label: string }[];
		beginDate: Date;
		lastDate: Date;
	}

	let {
		params = $bindable(),
		forecastDaysOptions,
		pastDaysOptions,
		beginDate,
		lastDate
	}: Props = $props();

	// Historical Forecast mode: archive coverage instead of the forecast window
	const historicalBeginDate = new Date('2016-01-01');
	const historicalLastDate = new Date();

	const historicalEndDefault = (() => {
		const d = new SvelteDate();
		d.setDate(d.getDate() - 2);
		return d.toISOString().split('T')[0];
	})();

	const quickYears = (() => {
		const years = [];
		for (let year = 2022; year <= historicalLastDate.getFullYear(); year++) {
			years.push(year);
		}
		return years;
	})();

	let forecastDays = $derived(forecastDaysOptions.find((fdo) => fdo.value == params.forecast_days));
</script>

<AnimateHeight>
	{#if params.api_mode === 'historical_forecast'}
		<div
			in:fade={{ duration: 250, delay: 50 }}
			out:fadeOutAbsolute={{ duration: 200 }}
			class="mt-6"
		>
			<div class="flex flex-col gap-4 lg:flex-row">
				<div class="lg:w-1/2">
					<DatePicker
						bind:start_date={params.start_date}
						bind:end_date={params.end_date}
						beginDate={historicalBeginDate}
						lastDate={historicalLastDate}
					/>
				</div>
				<div class="lg:w-1/2">
					<p>Past weather forecasts from 2022 onwards are available.</p>
					<div class="flex flex-wrap items-center gap-2">
						Quick:
						{#each quickYears as year (year)}
							<Button
								variant="outline"
								class="border-primary text-primary hover:bg-primary hover:!text-white dark:text-[#3888ff]"
								onclick={() => {
									params.start_date = `${year}-01-01`;
									params.end_date =
										year === historicalLastDate.getFullYear()
											? historicalEndDefault
											: `${year}-12-31`;
								}}>{year}</Button
							>
						{/each}
					</div>
				</div>
			</div>
			<Alert.Root variant="info" class="mt-4">
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
					><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
				>
				<Alert.Description>
					Historical forecasts archived from this weather forecast API — same models, same
					parameters, same response format. Coverage starts around 2022, depending on the model.
					Each run's first few hours are stitched into a continuous hourly timeseries. Full details
					are available in the <a
						class="text-link underline"
						href="/en/docs/historical-forecast-api">Historical Forecast API documentation</a
					>.
				</Alert.Description>
			</Alert.Root>
		</div>
	{:else if params.api_mode === 'single_run'}
		<div
			in:fade={{ duration: 250, delay: 50 }}
			out:fadeOutAbsolute={{ duration: 200 }}
			class="mt-3 md:mt-6"
		>
			<div class="grid gap-3 md:gap-6 lg:grid-cols-2">
				<div class="grid gap-3 sm:grid-cols-2 md:gap-6">
					<div class="relative">
						<Input
							id="run"
							type="text"
							class="h-12 cursor-pointer pt-6"
							name="run"
							bind:value={params.run}
						/>
						<Label
							class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
							for="run">Run (yyyy-mm-ddThh:mm)</Label
						>
					</div>
					<div class="relative">
						<Select.Root name="forecast_days" type="single" bind:value={params.forecast_days}>
							<Select.Trigger
								aria-label="Forecast days input"
								class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{forecastDays?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each forecastDaysOptions as { value, label } (value)}
									<Select.Item class="cursor-pointer" {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
								>Forecast days</Label
							>
						</Select.Root>
					</div>
				</div>
				<div>
					<p>
						The <mark>Run</mark> option selects a model run by its UTC initialisation time. Runs are
						typically available 1–6 hours after initialisation, see the
						<a href="/en/docs/model-updates">model updates documentation</a> for exact timings.
					</p>
				</div>
			</div>
			<Alert.Root variant="info" class="mt-4">
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
					><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
				>
				<Alert.Description>
					Retrieve the full forecast horizon of any individual model run using the <mark>&run=</mark
					>
					parameter with the UTC initialisation time (e.g. <mark>&run=2026-07-16T00:00</mark>). Most
					models are archived from 2nd of April 2026, ECMWF IFS HRES at 9 km from March 2024. Full
					details are available in the
					<a class="text-link underline" href="/en/docs/single-runs-api"
						>Single Runs API documentation</a
					>.
				</Alert.Description>
			</Alert.Root>
		</div>
	{:else}
		<div in:fade={{ duration: 250, delay: 50 }} out:fadeOutAbsolute={{ duration: 200 }}>
			<TimeSelector bind:params {forecastDaysOptions} {pastDaysOptions} {beginDate} {lastDate} />
		</div>
	{/if}
</AnimateHeight>

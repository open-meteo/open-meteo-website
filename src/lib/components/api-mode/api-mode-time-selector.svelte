<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';

	import { fade, fadeOutAbsolute } from '$lib/utils/transitions';

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
			class="mt-6 flex flex-col gap-4 lg:flex-row"
		>
			<div class="mb-3 lg:w-1/2">
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
		</div>
	{:else}
		<div in:fade={{ duration: 250, delay: 50 }} out:fadeOutAbsolute={{ duration: 200 }}>
			<TimeSelector bind:params {forecastDaysOptions} {pastDaysOptions} {beginDate} {lastDate} />
		</div>
	{/if}
</AnimateHeight>

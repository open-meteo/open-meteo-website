<script lang="ts">
	import { fade, fadeOutAbsolute } from '$lib/utils/transitions';

	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';

	import AnimateHeight from '$lib/components/animate-height/animate-height.svelte';

	import { type Parameters } from '$lib/docs';

	import type { Snippet } from 'svelte';

	interface Props {
		params: Parameters;
		forecastAlert?: Snippet;
	}

	let { params = $bindable(), forecastAlert }: Props = $props();

	const modes = [
		{ value: 'forecast', label: 'Forecast' },
		{ value: 'historical_forecast', label: 'Historical Forecast' },
		{ value: 'single_run', label: 'Single Run' }
	];

	const isoDate = (daysAgo: number): string => {
		const d = new Date();
		d.setDate(d.getDate() - daysAgo);
		return d.toISOString().split('T')[0];
	};

	const defaultRun = (): string => {
		const d = new Date();
		d.setUTCDate(d.getUTCDate() - 1);
		d.setUTCHours(0, 0, 0, 0);
		return d.toISOString().replace(':00.000Z', '');
	};

	const setMode = (mode: string) => {
		params.api_mode = mode;
		if (mode === 'forecast') {
			params.time_mode = 'forecast_days';
			params.start_date = '';
			params.end_date = '';
			params.run = '';
		} else if (mode === 'historical_forecast') {
			params.time_mode = 'time_interval';
			params.run = '';
			if (!params.start_date) {
				params.start_date = isoDate(16);
			}
			if (!params.end_date) {
				params.end_date = isoDate(2);
			}
		} else if (mode === 'single_run') {
			params.time_mode = 'time_interval';
			params.start_date = '';
			params.end_date = '';
			if (!params.run) {
				params.run = defaultRun();
			}
		}
	};
</script>

<div class="-mx-6 mb-4 flex overflow-x-auto px-6 md:mx-0 md:px-0">
	<div class="border-border m-auto flex rounded-md border">
		{#each modes as { value, label }, i (value)}
			<Button
				variant="ghost"
				class="items-center gap-1 opacity-100! duration-300 {i === 0
					? 'rounded-e-none'
					: i === modes.length - 1
						? 'rounded-s-none'
						: 'rounded-none'} {params.api_mode === value ? 'bg-accent cursor-not-allowed' : ''}"
				disabled={params.api_mode === value}
				onclick={() => setMode(value)}
			>
				{label}
			</Button>
		{/each}
	</div>
</div>

<AnimateHeight>
	{#if params.api_mode === 'historical_forecast'}
		<div in:fade={{ duration: 250, delay: 50 }} out:fadeOutAbsolute={{ duration: 200 }}>
			<Alert.Root variant="info" class="mb-4">
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
		<div in:fade={{ duration: 250, delay: 50 }} out:fadeOutAbsolute={{ duration: 200 }}>
			<Alert.Root variant="info" class="mb-4">
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
	{:else if forecastAlert}
		<div in:fade={{ duration: 250, delay: 50 }} out:fadeOutAbsolute={{ duration: 200 }}>
			{@render forecastAlert()}
		</div>
	{/if}
</AnimateHeight>

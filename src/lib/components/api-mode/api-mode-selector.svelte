<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';

	import { Button } from '$lib/components/ui/button';

	import { type Parameters } from '$lib/docs';

	interface Props {
		params: Parameters;
	}

	let { params = $bindable() }: Props = $props();

	const modes = [
		{ value: 'forecast', label: 'Forecast' },
		{ value: 'historical_forecast', label: 'Historical Forecast' },
		{ value: 'single_run', label: 'Single Run' }
	];

	const isoDate = (daysAgo: number): string => {
		const d = new SvelteDate();
		d.setDate(d.getDate() - daysAgo);
		return d.toISOString().split('T')[0];
	};

	const defaultRun = (): string => {
		const d = new SvelteDate();
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

<div class="flex overflow-x-auto items-center gap-2 md:mx-0 md:px-0">
	<div class="text-muted-foreground w-22 shrink-0">API Mode:</div>

	<div class="border-border flex rounded-md border">
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

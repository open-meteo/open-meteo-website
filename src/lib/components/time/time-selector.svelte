<script lang="ts">
	import DatePicker from '$lib/components/date/date-picker.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select/index';
	import { type Parameters } from '$lib/docs';
	import { fade } from 'svelte/transition';

	interface Props {
		params: Parameters;
		forecastDaysOptions: { value: string; label: string }[];
		pastDaysOptions: { value: string; label: string }[];
		beginDate?: Date;
		lastDate?: Date;
	}

	let {
		params = $bindable(),
		forecastDaysOptions,
		pastDaysOptions,
		beginDate,
		lastDate
	}: Props = $props();

	let forecastDays = $derived(
		forecastDaysOptions?.find((fco) => fco.value == params.forecast_days)
	);
	let pastDays = $derived(pastDaysOptions?.find((pdo) => pdo.value == params.past_days));
</script>

<div class="mt-6">
	<div class="mt-3 -mr-6 flex items-center gap-2 overflow-auto md:mr-0">
		<div class="text-muted-foreground">Time:</div>

		<div class="border-border flex rounded-md border">
			<Button
				variant="ghost"
				class="items-center gap-1 rounded-e-none !opacity-100 duration-300 {params.time_mode ===
				'forecast_days'
					? 'bg-accent cursor-not-allowed'
					: ''}"
				disabled={params.time_mode === 'forecast_days'}
				onclick={() => {
					params.time_mode = 'forecast_days';
					params.start_date = '';
					params.end_date = '';
				}}
			>
				<svg
					class="lucide lucide-clock mr-[2px]"
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10" />
					<polyline points="12 6 12 12 16 14" />
				</svg>Forecast Length
			</Button>
			<Button
				variant="ghost"
				class="items-center gap-1 rounded-s-none !opacity-100 duration-300  {params.time_mode ===
				'time_interval'
					? 'bg-accent'
					: ''}"
				disabled={params.time_mode === 'time_interval'}
				onclick={() => {
					params.time_mode = 'time_interval';
				}}
			>
				<svg
					class="lucide lucide-calendar-cog mr-[2px]"
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m15.2 16.9-.9-.4" />
					<path d="m15.2 19.1-.9.4" />
					<path d="M16 2v4" />
					<path d="m16.9 15.2-.4-.9" />
					<path d="m16.9 20.8-.4.9" />
					<path d="m19.5 14.3-.4.9" />
					<path d="m19.5 21.7-.4-.9" />
					<path d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
					<path d="m21.7 16.5-.9.4" />
					<path d="m21.7 19.5-.9-.4" />
					<path d="M3 10h18" />
					<path d="M8 2v4" />
					<circle cx="18" cy="18" r="3" />
				</svg>Time Interval
			</Button>
		</div>
	</div>

	<div class="mt-3 md:mt-4">
		{#if params.time_mode === 'forecast_days'}
			<div in:fade class="grid gap-3 md:gap-6 lg:grid-cols-2">
				<div class="grid gap-3 sm:grid-cols-2 md:gap-6">
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
					<div class="relative">
						<Select.Root name="past_days" type="single" bind:value={params.past_days}>
							<Select.Trigger
								aria-label="Past days input"
								class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{pastDays?.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each pastDaysOptions as { value, label } (value)}
									<Select.Item class="cursor-pointer" {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs">
								Past days</Label
							>
						</Select.Root>
					</div>
				</div>

				<div>
					<p>
						By default, we provide forecasts for 7 days, but you can access forecasts for up to 16
						days. If you're interested in past weather data, you can use the <mark>Past Days</mark>
						feature to access archived forecasts.
					</p>
				</div>
			</div>
		{/if}
		{#if params.time_mode === 'time_interval'}
			<div in:fade class="flex flex-col gap-x-6 gap-y-4 lg:flex-row">
				<div class="mb-3 lg:w-1/2">
					<DatePicker
						bind:start_date={params.start_date}
						bind:end_date={params.end_date}
						{beginDate}
						{lastDate}
					/>
				</div>
				<div class="mb-3 lg:w-1/2">
					<p>
						The <mark>Start Date</mark> and <mark>End Date</mark> options help you choose a range of
						dates more easily. Archived forecasts come from a series of weather model runs over
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

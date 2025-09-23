<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import * as Select from '$lib/components/ui/select';

	import type { CheckboxOption, CheckboxOptions, Parameters } from '$lib/docs';

	interface Props {
		params: Parameters;
		minutely_15: CheckboxOptions;
		pastMinutely15: CheckboxOption | undefined;
		forecastMinutely15: CheckboxOption | undefined;
		pastMinutely15Options: CheckboxOption[];
		forecastMinutely15Options: CheckboxOption[];

		solarVariables?: CheckboxOptions;
	}

	let {
		params = $bindable(),
		minutely_15,
		pastMinutely15,
		forecastMinutely15,
		pastMinutely15Options,
		forecastMinutely15Options,

		solarVariables
	}: Props = $props();
</script>

<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
	{#each minutely_15 as group, i (i)}
		<div>
			{#each group as { value, label } (value)}
				<div class="group flex items-center" title={label}>
					<Checkbox
						id="{value}_minutely_15"
						class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
						value="{value}_minutely_15"
						checked={params.minutely_15?.includes(value)}
						aria-labelledby="{value}_minutely_15_label"
						onCheckedChange={() => {
							if (params.minutely_15?.includes(value)) {
								params.minutely_15 = params.minutely_15.filter((item) => {
									return item !== value;
								});
							} else if (params.minutely_15) {
								params.minutely_15.push(value);
								params.minutely_15 = params.minutely_15;
							}
						}}
					/>
					<Label
						id="{value}_minutely_15_label"
						for="{value}_minutely_15"
						class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
					>
				</div>
			{/each}
		</div>
	{/each}
</div>
{#if solarVariables}
	<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
		{#each solarVariables as group, i (i)}
			<div>
				{#each group as { value, label } (value)}
					<div class="group flex items-center" title={label}>
						<Checkbox
							id="{value}_minutely_15"
							class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
							value="{value}_minutely_15"
							checked={params.minutely_15?.includes(value)}
							aria-labelledby="{value}_minutely_15_label"
							onCheckedChange={() => {
								if (params.minutely_15?.includes(value)) {
									params.minutely_15 = params.minutely_15.filter((item) => {
										return item !== value;
									});
								} else if (params.minutely_15) {
									params.minutely_15.push(value);
									params.minutely_15 = params.minutely_15;
								}
							}}
						/>
						<Label
							id="{value}_minutely_15_label"
							for="{value}_minutely_15"
							class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
						>
					</div>
				{/each}
			</div>
		{/each}
	</div>
{/if}

<div class="text-muted-foreground mt-1">
	<small
		>Note: Only available in Central Europe and North America. Other regions use interpolated hourly
		data. {#if solarVariables}Solar radiation is averaged over the 15 minutes. Use
			<mark>instant</mark> for radiation at the indicated time.{/if}</small
	>
</div>
<div class="text-muted-foreground">
	<small
		>Note: You can further adjust the forecast time range for 15-minutely weather variables using <mark
			>&forecast_minutely_15=</mark
		>
		and <mark>&past_minutely_15=</mark> as shown below.
	</small>
</div>

<div class="mt-2 grid grid-cols-1 gap-2 md:mt-4 md:grid-cols-2 md:gap-4">
	<div class="relative">
		<Select.Root name="cell_selection" type="single" bind:value={params.forecast_minutely_15}>
			<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
				>{forecastMinutely15?.label}</Select.Trigger
			>
			<Select.Content preventScroll={false} class="border-border">
				{#each forecastMinutely15Options as { value, label } (value)}
					<Select.Item {value}>{label}</Select.Item>
				{/each}
			</Select.Content>
			<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
				>Forecast Minutely 15</Label
			>
		</Select.Root>
	</div>
	<div class="relative">
		<Select.Root name="cell_selection" type="single" bind:value={params.past_minutely_15}>
			<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
				>{pastMinutely15?.label}</Select.Trigger
			>
			<Select.Content preventScroll={false} class="border-border">
				{#each pastMinutely15Options as { value, label } (value)}
					<Select.Item {value}>{label}</Select.Item>
				{/each}
			</Select.Content>
			<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
				>Past Minutely 15</Label
			>
		</Select.Root>
	</div>
</div>

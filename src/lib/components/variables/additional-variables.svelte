<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import * as Select from '$lib/components/ui/select';

	import type { CheckboxOption, CheckboxOptions, Parameters } from '$lib/docs';

	interface Props {
		params: Parameters;
		pastHours: CheckboxOption | undefined;
		cellSelection: CheckboxOption | undefined;
		forecastHours: CheckboxOption | undefined;
		pastHoursOptions: CheckboxOption[];
		additionalVariables: CheckboxOptions;
		temporalResolution: CheckboxOption | undefined;
		forecastHoursOptions: CheckboxOption[];
		gridCellSelectionOptions: CheckboxOption[];
		temporalResolutionOptions: CheckboxOption[];
	}

	let {
		params = $bindable(),
		pastHours,
		cellSelection,
		forecastHours,
		pastHoursOptions,
		additionalVariables,
		temporalResolution,
		forecastHoursOptions,
		gridCellSelectionOptions,
		temporalResolutionOptions
	}: Props = $props();
</script>

<div class="grid md:grid-cols-2">
	{#each additionalVariables as group, i (i)}
		<div>
			{#each group as { value, label } (value)}
				<div class="group flex items-center" title={label}>
					<Checkbox
						id="{value}_hourly"
						class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
						{value}
						checked={params.hourly?.includes(value)}
						aria-labelledby="{value}_label"
						onCheckedChange={() => {
							if (value && params.hourly?.includes(value)) {
								params.hourly = params.hourly.filter((item) => {
									return item !== value;
								});
							} else if (value && params.hourly) {
								params.hourly.push(value);
								params.hourly = params.hourly;
							}
						}}
					/>
					<Label
						id="{value}_label"
						for="{value}_hourly"
						class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
					>
				</div>
			{/each}
		</div>
	{/each}
</div>
<div class="text-muted-foreground mt-1">
	<small>
		Note: You can further adjust the forecast time range for hourly weather variables using <mark
			>&forecast_hours=</mark
		>
		and <mark>&past_hours=</mark> as shown below.
	</small>
</div>

<div class="mt-2 grid grid-cols-1 gap-2 md:mt-4 md:grid-cols-4 md:gap-4">
	<div class="relative">
		<Select.Root name="forecast_hours" type="single" bind:value={params.forecast_hours}>
			<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
				>{forecastHours?.label}</Select.Trigger
			>
			<Select.Content preventScroll={false} class="border-border">
				{#each forecastHoursOptions as { value, label } (value)}
					<Select.Item {value}>{label}</Select.Item>
				{/each}
			</Select.Content>
			<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
				>Forecast Hours</Label
			>
		</Select.Root>
	</div>
	<div class="relative">
		<Select.Root name="past_hours" type="single" bind:value={params.past_hours}>
			<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
				>{pastHours?.label}</Select.Trigger
			>
			<Select.Content preventScroll={false} class="border-border">
				{#each pastHoursOptions as { value, label } (value)}
					<Select.Item {value}>{label}</Select.Item>
				{/each}
			</Select.Content>
			<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
				>Past Hours</Label
			>
		</Select.Root>
	</div>

	<div class="relative md:col-span-2">
		<Select.Root name="temporal_resolution" type="single" bind:value={params.temporal_resolution}>
			<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
				>{temporalResolution?.label}</Select.Trigger
			>
			<Select.Content preventScroll={false} class="border-border">
				{#each temporalResolutionOptions as { value, label } (value)}
					<Select.Item {value}>{label}</Select.Item>
				{/each}
			</Select.Content>
			<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
				>Temporal Resolution For Hourly Data</Label
			>
		</Select.Root>
	</div>
	<div class="relative md:col-span-2">
		<Select.Root name="cell_selection" type="single" bind:value={params.cell_selection}>
			<Select.Trigger class="data-[placeholder]:text-foreground h-12 cursor-pointer pt-6"
				>{cellSelection?.label}</Select.Trigger
			>
			<Select.Content preventScroll={false} class="border-border">
				{#each gridCellSelectionOptions as { value, label } (value)}
					<Select.Item {value}>{label}</Select.Item>
				{/each}
			</Select.Content>
			<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
				>Grid Cell Selection</Label
			>
		</Select.Root>
	</div>
</div>

<script lang="ts">
	import LabeledSelect from '$lib/components/select/labeled-select.svelte';

	import { type Parameters } from '$lib/docs';

	type Options = { value: string; label: string }[];

	interface Props {
		params: Parameters;
		/** Omit to hide the forecast/past hours selects (e.g. historical pages) */
		forecastHoursOptions?: Options;
		pastHoursOptions?: Options;
		temporalResolutionOptions: Options;
		gridCellSelectionOptions: Options;
	}

	let {
		params = $bindable(),
		forecastHoursOptions,
		pastHoursOptions,
		temporalResolutionOptions,
		gridCellSelectionOptions
	}: Props = $props();
</script>

<div class="mt-2 grid grid-cols-1 gap-3 md:mt-4 md:grid-cols-4 md:gap-6">
	{#if forecastHoursOptions}
		<LabeledSelect
			name="forecast_hours"
			label="Forecast Hours"
			options={forecastHoursOptions}
			bind:value={params.forecast_hours}
		/>
	{/if}
	{#if pastHoursOptions}
		<LabeledSelect
			name="past_hours"
			label="Past Hours"
			options={pastHoursOptions}
			bind:value={params.past_hours}
		/>
	{/if}
	<LabeledSelect
		class="relative md:col-span-2"
		name="temporal_resolution"
		label="Temporal Resolution For Hourly Data"
		options={temporalResolutionOptions}
		bind:value={params.temporal_resolution}
	/>
	<LabeledSelect
		class="relative md:col-span-2"
		name="cell_selection"
		label="Grid Cell Selection"
		options={gridCellSelectionOptions}
		bind:value={params.cell_selection}
	/>
</div>

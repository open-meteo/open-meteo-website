<script lang="ts">
	import type { DateRange } from 'bits-ui';

	import { cn } from '$lib/utils/ui';

	import { slide, fade } from 'svelte/transition';

	import RangeCalendar from './range-calendar-custom.svelte';

	import Label from '$lib/components/ui/label/label.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';

	import CalendarIcon from 'lucide-svelte/icons/calendar';

	interface Props {
		start_date?: string;
		end_date?: string;
		begin_date?: Date;
		last_date?: Date;
	}

	let {
		start_date = $bindable(''),
		end_date = $bindable(''),
		begin_date = $bindable(''),
		last_date = $bindable('')
	}: Props = $props();

	$effect(() => {
		if (start_date === '') {
			let startDate = new Date();
			startDate.setDate(startDate.getDate() - 7);
			start_date = startDate.toISOString().split('T')[0];
		}

		if (end_date === '') {
			let endDate = new Date();
			endDate.setDate(endDate.getDate() + 7);

			end_date = endDate.toISOString().split('T')[0];
		}
	});
</script>

<div>
	<Popover.Root>
		<Popover.Trigger class="h-13 flex w-full cursor-pointer gap-6">
			<div class="border-border h-13 relative flex w-full rounded-md border px-3 pt-5 text-sm">
				<CalendarIcon class="mr-1 mt-1 size-3" />

				{#if start_date}
					{start_date}
				{:else}
					<span class="text-muted-foreground"> Pick a start date </span>
				{/if}
				<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
					>Start date</Label
				>
				{#if new Date(start_date).getTime() < begin_date.getTime()}
					<span in:fade class="top-13 absolute left-0 text-sm text-red-800">Start date invalid</span
					>
				{/if}
			</div>
			<div class="border-border h-13 relative flex w-full rounded-md border px-3 pt-5 text-sm">
				<CalendarIcon class="mr-1 mt-1 size-3" />

				{#if end_date}
					{end_date}
				{:else}
					<span class="text-muted-foreground"> Pick an end date </span>
				{/if}
				<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
					>End date</Label
				>
				{#if new Date(end_date).getTime() < begin_date.getTime() || new Date(end_date).getTime() > last_date.getTime()}
					<span in:fade class="top-13 absolute left-0 text-sm text-red-800">End date invalid</span>
				{:else if new Date(end_date).getTime() < new Date(start_date).getTime()}
					<span in:fade class="top-13 absolute left-0 text-sm text-red-800"
						>End date before Start date</span
					>
				{/if}
			</div>
		</Popover.Trigger>
		<Popover.Content
			class="border-border mt-6 w-auto min-w-[var(--bits-popover-anchor-width)] overflow-auto p-0"
			align="start"
		>
			<RangeCalendar bind:start_date bind:end_date bind:begin_date bind:last_date />
		</Popover.Content>
	</Popover.Root>
</div>

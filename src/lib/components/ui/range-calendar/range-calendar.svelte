<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
	import * as RangeCalendar from './index.js';
	import { cn } from '$lib/utils/ui.js';

	let {
		ref = $bindable(null),
		value = $bindable(),
		placeholder = $bindable(),
		weekdayFormat = 'short',
		class: className,
		...restProps
	}: WithoutChildrenOrChild<RangeCalendarPrimitive.RootProps> = $props();
</script>

<RangeCalendarPrimitive.Root
	bind:ref
	bind:value
	bind:placeholder
	{weekdayFormat}
	class={cn('p-3', className)}
	{...restProps}
>
	{#snippet children({ months, weekdays })}
		<RangeCalendar.Header>
			<RangeCalendar.PrevButton />
			<RangeCalendar.Heading />
			<RangeCalendar.NextButton />
		</RangeCalendar.Header>
		<RangeCalendar.Months>
			{#each months as month}
				<RangeCalendar.Grid>
					<RangeCalendar.GridHead>
						<RangeCalendar.GridRow class="flex">
							{#each weekdays as weekday}
								<RangeCalendar.HeadCell>
									{weekday.slice(0, 2)}
								</RangeCalendar.HeadCell>
							{/each}
						</RangeCalendar.GridRow>
					</RangeCalendar.GridHead>
					<RangeCalendar.GridBody>
						{#each month.weeks as weekDates}
							<RangeCalendar.GridRow class="mt-2 w-full">
								{#each weekDates as date}
									<RangeCalendar.Cell {date} month={month.value}>
										<RangeCalendar.Day />
									</RangeCalendar.Cell>
								{/each}
							</RangeCalendar.GridRow>
						{/each}
					</RangeCalendar.GridBody>
				</RangeCalendar.Grid>
			{/each}
		</RangeCalendar.Months>
	{/snippet}
</RangeCalendarPrimitive.Root>

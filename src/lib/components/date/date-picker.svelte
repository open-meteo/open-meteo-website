<script lang="ts">
	import { slide } from 'svelte/transition';

	import RangeCalendar from './range-calendar-custom.svelte';

	import { browser } from '$app/environment';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	import * as Popover from '$lib/components/ui/popover/index.js';

	import X from 'lucide-svelte/icons/x';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { onMount } from 'svelte';

	interface Props {
		start_date?: string;
		end_date?: string;
		begin_date?: Date;
		last_date?: Date;
	}

	const now = new Date();

	let {
		start_date = $bindable(),
		end_date = $bindable(),
		begin_date = new Date('1940-01-01'),
		last_date = new Date(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`)
	}: Props = $props();

	$effect(() => {
		if (!start_date) {
			let startDate = new Date();
			startDate.setDate(startDate.getDate() - 7);

			start_date = startDate.toISOString().split('T')[0];
		}

		if (!end_date) {
			let endDate = new Date();
			endDate.setDate(endDate.getDate() + 7);
			if (endDate.getTime() > last_date.getTime()) {
				endDate.setDate(last_date.getDate());
			}
			end_date = endDate.toISOString().split('T')[0];
		}

		if (!begin_date) {
			begin_date = new Date('1940-01-01');
		}
	});

	let inputDiv: HTMLElement | undefined = $state();
	let popoverOpen = $state(false);

	onMount(() => {
		if (browser) {
			var observer = new IntersectionObserver(
				() => {
					if (popoverOpen) {
						popoverOpen = false;
					}
				},
				{
					root: null,
					threshold: 0
				}
			);

			if (inputDiv) observer.observe(inputDiv);
		}
	});
</script>

<div>
	<Popover.Root bind:open={popoverOpen}>
		<Popover.Trigger class="flex w-full cursor-pointer flex-col gap-6 sm:flex-row">
			<div
				bind:this={inputDiv}
				class="border-border ring-offset-background h-13 relative flex w-full rounded-md border px-3 pt-6 {popoverOpen
					? 'ring-2 ring-ring ring-offset-2'
					: ''}"
			>
				<CalendarIcon class="mr-1 mt-1 size-3" />

				<Input
					class="!ring-0 !ring-offset-0 !bg-transparent m-0 -mt-2 h-[unset] border-none p-0 {popoverOpen
						? 'z-20'
						: ''}"
					type="text"
					bind:value={start_date}
					placeholder="Pick an end date"
					oninput={(e) => {
						console.log(e);
					}}
					onclick={(e) => {
						if (popoverOpen) {
							e.stopPropagation();
						}
					}}
				/>
				<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
					>Start date</Label
				>
				{#if start_date && new Date(start_date).getTime() < begin_date.getTime() - 24 * 60 * 60 * 1000}
					<span transition:slide class="top-14 absolute left-0 text-sm text-red-800"
						>Start date invalid</span
					>
				{/if}
			</div>
			<div
				class="border-border ring-offset-background h-13 relative flex w-full rounded-md border px-3 pt-6 {popoverOpen
					? 'ring-2 ring-ring ring-offset-2'
					: ''}"
			>
				<CalendarIcon class="mr-1 mt-1 size-3" />

				<Input
					class="!ring-0 !ring-offset-0 !bg-transparent m-0 -mt-2 h-[unset] border-none p-0   {popoverOpen
						? 'z-20'
						: ''}"
					type="text"
					value={end_date}
					placeholder="Pick an end date"
					oninput={(e) => {
						console.log(e);
					}}
					onclick={(e) => {
						if (popoverOpen) {
							e.stopPropagation();
						}
					}}
				/>
				<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
					>End date</Label
				>
				{#if (end_date && new Date(end_date).getTime() < begin_date.getTime()) || (end_date && new Date(end_date).getTime() > last_date.getTime() + 24 * 60 * 60 * 1000)}
					<span transition:slide class="top-14 absolute left-0 text-sm text-red-800"
						>End date invalid</span
					>
				{:else if end_date && start_date && new Date(end_date).getTime() < new Date(start_date).getTime()}
					<span transition:slide class="top-14 absolute left-0 text-sm text-red-800"
						>End date before Start date</span
					>
				{/if}
			</div>
		</Popover.Trigger>
		<Popover.Content
			onCloseAutoFocus={(e) => {
				e.preventDefault();
			}}
			class="border-border mt-2 w-auto min-w-[var(--bits-popover-anchor-width)] overflow-auto p-0 md:mt-5"
			align="start"
		>
			<RangeCalendar bind:start_date bind:end_date {begin_date} {last_date} />
			<Popover.Close
				class="ring-offset-background focus:ring-ring absolute right-4 top-6 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none md:top-8"
				><X size={16} /><span class="sr-only">Close</span></Popover.Close
			>
		</Popover.Content>
	</Popover.Root>
</div>

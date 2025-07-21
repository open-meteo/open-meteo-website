<script lang="ts">
	import { onMount } from 'svelte';

	import { slide } from 'svelte/transition';

	import { browser } from '$app/environment';

	import { debounce } from '$lib/utils';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	import * as Popover from '$lib/components/ui/popover/index.js';

	import RangeCalendar from './range-calendar-custom.svelte';

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
		last_date = new Date(`${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`)
	}: Props = $props();

	$effect(() => {
		if (!start_date) {
			let startDate = new Date();
			startDate.setUTCDate(startDate.getUTCDate() - 7);

			start_date = startDate.toISOString().split('T')[0];
		}

		if (!end_date) {
			let endDate = new Date();
			endDate.setUTCDate(endDate.getUTCDate() + 7);
			if (endDate.getTime() > last_date.getTime()) {
				endDate.setUTCDate(last_date.getUTCDate());
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
					rootMargin: window.innerWidth > 768 ? '100px' : '500px',
					threshold: 0
				}
			);

			if (inputDiv) observer.observe(inputDiv);
		}
	});

	let inputFields: HTMLElement | null = $state(null);
</script>

<div>
	<Popover.Root bind:open={popoverOpen}>
		<button
			bind:this={inputFields}
			class="relative flex w-full cursor-pointer flex-col gap-x-6 gap-y-3 md:flex-row"
			onclick={(e) => {
				e.preventDefault();
				if (!popoverOpen) {
					popoverOpen = true;
				}
			}}
		>
			<div
				bind:this={inputDiv}
				class="border-border ring-offset-background relative flex h-13 w-full rounded-md border px-3 pt-6 {popoverOpen
					? 'ring-ring ring-2 ring-offset-2'
					: ''}"
			>
				<svg
					class="lucide lucide-calendar mt-[1px] mr-1"
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.65"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M8 2v4" />
					<path d="M16 2v4" />
					<rect width="18" height="18" x="3" y="4" rx="2" />
					<path d="M3 10h18" />
				</svg>

				<Input
					id="start_date_input"
					class="m-0 -mt-2 h-[unset] border-none !bg-transparent p-0 !ring-0 !ring-offset-0 "
					type="text"
					value={start_date}
					oninput={debounce((e: InputEvent) => {
						let target = e.target as HTMLInputElement;
						if (
							target &&
							String(new Date(target.value)) !== 'Invalid Date' &&
							new Date(target.value).getUTCFullYear() > 1940
						) {
							start_date = new Date(target.value).toISOString().split('T')[0];
						}
					}, 700)}
					placeholder="Pick a start date"
				/>
				<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
					>Start date</Label
				>
			</div>
			{#if (start_date && new Date(start_date).getTime() < begin_date.getTime() - 24 * 60 * 60 * 1000) || (start_date && new Date(start_date).getTime() > last_date.getTime() + 24 * 60 * 60 * 1000)}
				<div
					transition:slide
					class="-my-1 flex text-sm text-red-800 md:absolute md:top-15 md:left-3"
				>
					Start date invalid
				</div>
			{/if}
			<div
				class="border-border ring-offset-background relative flex h-13 w-full rounded-md border px-3 pt-6 {popoverOpen
					? 'ring-ring ring-2 ring-offset-2'
					: ''}"
			>
				<svg
					class="lucide lucide-calendar mt-[1px] mr-1"
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.65"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M8 2v4" />
					<path d="M16 2v4" />
					<rect width="18" height="18" x="3" y="4" rx="2" />
					<path d="M3 10h18" />
				</svg>

				<Input
					id="end_date_input"
					class="m-0 -mt-2 h-[unset] border-none !bg-transparent p-0 !ring-0 !ring-offset-0  "
					type="text"
					value={end_date}
					oninput={debounce((e: InputEvent) => {
						let target = e.target as HTMLInputElement;
						if (
							target &&
							String(new Date(target.value)) !== 'Invalid Date' &&
							new Date(target.value).getUTCFullYear() > 1940
						) {
							end_date = new Date(target.value).toISOString().split('T')[0];
						}
					}, 700)}
					placeholder="Pick an end date"
				/>
				<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
					>End date</Label
				>
			</div>
			{#if (end_date && new Date(end_date).getTime() < begin_date.getTime()) || (end_date && new Date(end_date).getTime() > last_date.getTime() + 24 * 60 * 60 * 1000)}
				<div
					transition:slide
					class="-my-1 flex text-sm text-red-800 md:absolute md:top-15 md:left-[calc(50%+1.5rem)]"
				>
					End date invalid
				</div>
			{:else if end_date && start_date && new Date(end_date).getTime() < new Date(start_date).getTime()}
				<div
					transition:slide
					class="-my-1 flex text-sm text-red-800 md:absolute md:top-15 md:left-[calc(50%+1.5rem)]"
				>
					End date before Start date
				</div>
			{/if}
		</button>
		<Popover.Trigger class="h-0 w-0"></Popover.Trigger>
		<Popover.Content
			onCloseAutoFocus={(e) => {
				e.preventDefault();
			}}
			onInteractOutside={(e) => {
				if (inputFields && inputFields.contains(e.target as HTMLInputElement)) {
					e.preventDefault();
				}
			}}
			trapFocus={false}
			class="border-border w-auto min-w-[var(--bits-popover-anchor-width)] overflow-auto p-0 "
			align="start"
		>
			<RangeCalendar bind:start_date bind:end_date {begin_date} {last_date} />
			<Popover.Close
				class="ring-offset-background focus:ring-ring absolute top-6 right-4 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none md:top-8"
			>
				<svg
					class="lucide lucide-x"
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M18 6 6 18" />
					<path d="m6 6 12 12" />
				</svg>
				<span class="sr-only">Close</span></Popover.Close
			>
		</Popover.Content>
	</Popover.Root>
</div>

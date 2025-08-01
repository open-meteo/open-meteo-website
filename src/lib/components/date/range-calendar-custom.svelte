<script lang="ts">
	import { scale } from 'svelte/transition';

	import { pad } from '$lib/utils';

	import { Button } from '$lib/components/ui/button';

	interface Props {
		start_date?: string;
		end_date?: string;
		begin_date?: Date;
		last_date?: Date;
	}

	const now = new Date();

	let {
		start_date = $bindable(''),
		end_date = $bindable(''),
		begin_date = new Date('1940-01-01'),
		last_date = new Date(`${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`)
	}: Props = $props();

	let startDate = $state(new Date(start_date));
	let endDate = $state(new Date(end_date));

	$effect(() => {
		let newDate = new Date(start_date);
		startDate = newDate;
	});
	$effect(() => {
		let newDate = new Date(end_date);
		endDate = newDate;
	});

	let yearModeStart = $state(false);
	let monthModeStart = $state(false);
	let yearModeEnd = $state(false);
	let monthModeEnd = $state(false);

	const monthsForLocale = (localeName = 'en-US', monthFormat = 'long') => {
		const format = new Intl.DateTimeFormat(localeName, { month: monthFormat }).format;
		return [...Array(12).keys()].map((m) => format(new Date(now.getUTCFullYear(), m % 12)));
	};

	const getDatesInMonth = (year: number, month: number): Date[] => {
		let result: Date[] = [];
		for (let day = 1; day <= 32; day++) {
			const date = new Date(year, month - 1, day, parseInt(now.getTimezoneOffset() / 60));
			if (date.getUTCFullYear() === year && date.getUTCMonth() === month - 1) {
				result.push(date);
			}
		}
		return result;
	};

	const monthList = monthsForLocale();
	const yearList = [
		...Array(
			last_date.getUTCFullYear() -
				(begin_date.getUTCFullYear() > 1990
					? begin_date.getUTCFullYear() - 10
					: begin_date.getUTCFullYear()) +
				1
		).keys()
	].map(
		(y) =>
			y +
			(begin_date.getUTCFullYear() > 1990
				? begin_date.getUTCFullYear() - 10
				: begin_date.getUTCFullYear())
	);
	let startDates = $derived(
		getDatesInMonth(startDate.getUTCFullYear(), startDate.getUTCMonth() + 1)
	);
	let endDates = $derived(getDatesInMonth(endDate.getUTCFullYear(), endDate.getUTCMonth() + 1));

	const updateStartDate = (newDate: Date) => {
		start_date = newDate.toISOString().split('T')[0];
	};
	const updateEndDate = (newDate: Date) => {
		end_date = newDate.toISOString().split('T')[0];
	};

	const decreaseStart = () => {
		let newDate = new Date(startDate);
		newDate.setUTCMonth(newDate.getUTCMonth() - 1);
		start_date = newDate.toISOString().split('T')[0];
	};
	const increaseStart = () => {
		let newDate = new Date(startDate);
		newDate.setUTCMonth(newDate.getUTCMonth() + 1);
		start_date = newDate.toISOString().split('T')[0];
	};

	const decreaseEnd = () => {
		let newDate = new Date(endDate);
		if (monthModeEnd) {
			newDate.setUTCFullYear(newDate.getUTCFullYear() - 1);
		} else {
			newDate.setUTCMonth(newDate.getUTCMonth() - 1);
		}
		end_date = newDate.toISOString().split('T')[0];
	};
	const increaseEnd = () => {
		let newDate = new Date(endDate);
		if (monthModeEnd) {
			newDate.setUTCFullYear(newDate.getUTCFullYear() + 1);
		} else {
			newDate.setUTCMonth(newDate.getUTCMonth() + 1);
		}
		end_date = newDate.toISOString().split('T')[0];
	};

	let selectEndNext = $state(false);
</script>

<div
	class="border-border flex w-full flex-col items-stretch justify-between gap-3 overflow-auto border-b p-3 md:flex-row"
>
	<div class="flex w-full flex-col items-center gap-3">
		<div class="flex w-full justify-between">
			<Button variant="outline" class="px-3" onclick={decreaseStart}
				><svg
					class="lucide lucide-chevron-left"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m15 18-6-6 6-6" />
				</svg></Button
			>
			<Button
				variant="ghost"
				class="px-6 py-4"
				onclick={() => {
					if (monthModeStart) {
						yearModeStart = true;
						setTimeout(() => {
							document
								.getElementById('start_year_' + new Date(start_date).getUTCFullYear())
								?.scrollIntoView({ behavior: 'instant', inline: 'end' });
						}, 200);
					}
					monthModeStart = true;
				}}>{startDate.getUTCFullYear()} - {monthList[startDate.getUTCMonth()]}</Button
			>
			<Button variant="outline" class="mr-6 px-3 md:mr-0" onclick={increaseStart}
				><svg
					class="lucide lucide-chevron-right"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m9 18 6-6-6-6" />
				</svg>
			</Button>
		</div>
		<div class="flex max-h-[300px] min-h-[180px] min-w-[340px] justify-center overflow-y-auto">
			{#if yearModeStart}
				<div in:scale={{ start: 0.8, duration: 200 }} class="grid-d grid grid-cols-4">
					{#each yearList as year}
						<Button
							id="start_year_{year}"
							class={startDate.getUTCFullYear() === year ? 'bg-accent/75' : ''}
							variant="ghost"
							disabled={year < begin_date.getUTCFullYear()}
							onclick={() => {
								yearModeStart = false;
								let newDate = new Date(startDate);
								newDate.setUTCFullYear(year);
								updateStartDate(newDate);
							}}>{year}</Button
						>
					{/each}
				</div>
			{:else if monthModeStart}
				<div in:scale={{ start: 0.8, duration: 300 }} class="grid grid-cols-3 gap-1">
					{#each monthsForLocale() as month, i}
						<Button
							class={monthList[startDate.getUTCMonth()] === month ? 'bg-accent/75' : ''}
							variant="ghost"
							disabled={new Date(`${startDate.getUTCFullYear()}-${pad(i + 1)}-30`).getTime() <
								begin_date.getTime() ||
								new Date(`${startDate.getUTCFullYear()}-${pad(i + 1)}-01`).getTime() >
									last_date.getTime()}
							onclick={() => {
								monthModeStart = false;
								let newDate = new Date(startDate);
								newDate.setUTCMonth(i);
								updateStartDate(newDate);
							}}>{month}</Button
						>
					{/each}
				</div>
			{:else}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="min-h-[280px]">
					<div
						id="start_date_days"
						in:scale={{ start: 0.8, duration: 300 }}
						class="grid grid-cols-5"
						aria-roledescription="Date picker window"
						onmouseleave={() => (selectEndNext = false)}
					>
						{#each startDates as date}
							<Button
								class="duration-200 hover:rounded-md
								{date.toISOString().split('T')[0] === now.toISOString().split('T')[0] ? 'font-bold' : ''}
								{date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime()
									? 'bg-accent/50 rounded-none'
									: ''}
								{date.toISOString().split('T')[0] === startDate.toISOString().split('T')[0]
									? 'bg-accent rounded-s-md rounded-e-none'
									: ''} {date.toISOString().split('T')[0] === endDate.toISOString().split('T')[0]
									? 'bg-accent rounded-s-none rounded-e-md'
									: ''}"
								variant="ghost"
								disabled={date.getTime() < begin_date.getTime() - 11 * 60 * 60 * 1000 ||
									date.getTime() > last_date.getTime() + 11 * 60 * 60 * 1000}
								onclick={() => {
									if (selectEndNext) {
										let newDate = new Date(startDate);
										newDate.setUTCDate(date.getUTCDate());
										updateEndDate(newDate);
										selectEndNext = false;
									} else {
										let newDate = new Date(startDate);
										newDate.setUTCDate(date.getUTCDate());
										updateStartDate(newDate);
										selectEndNext = true;
									}
								}}>{date.getUTCDate()}</Button
							>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
	<div class="border-border border-r"></div>
	<div class="flex w-full flex-col items-center gap-3">
		<div class="flex w-full justify-between">
			<Button variant="outline" class="px-3" onclick={decreaseEnd}
				><svg
					class="lucide lucide-chevron-left"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m15 18-6-6 6-6" />
				</svg></Button
			>
			<Button
				variant="ghost"
				class="px-6 py-4"
				onclick={() => {
					if (monthModeEnd) {
						yearModeEnd = true;
						setTimeout(() => {
							document
								.getElementById('end_year_' + new Date(start_date).getUTCFullYear())
								?.scrollIntoView({ behavior: 'instant', inline: 'end' });
						}, 200);
					}
					monthModeEnd = true;
				}}>{endDate.getUTCFullYear()} - {monthList[endDate.getUTCMonth()]}</Button
			>
			<Button variant="outline" class="px-3 md:mr-8" onclick={increaseEnd}
				><svg
					class="lucide lucide-chevron-right"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m9 18 6-6-6-6" />
				</svg>
			</Button>
		</div>
		<div class="flex max-h-[300px] min-h-[180px] min-w-[340px] justify-center overflow-y-auto">
			{#if yearModeEnd}
				<div in:scale={{ start: 0.8, duration: 200 }} class="grid grid-cols-4">
					{#each yearList as year}
						<Button
							id="end_year_{year}"
							class={endDate.getUTCFullYear() === year ? 'bg-accent/75' : ''}
							variant="ghost"
							disabled={year < begin_date.getUTCFullYear()}
							onclick={() => {
								yearModeEnd = false;
								let newDate = new Date(endDate);
								newDate.setUTCFullYear(year);
								updateEndDate(newDate);
							}}>{year}</Button
						>
					{/each}
				</div>
			{:else if monthModeEnd}
				<div in:scale={{ start: 0.8, duration: 300 }} class="grid grid-cols-3 gap-1">
					{#each monthsForLocale() as month, i}
						<Button
							class={monthList[endDate.getUTCMonth()] === month ? 'bg-accent/75' : ''}
							variant="ghost"
							disabled={new Date(`${endDate.getUTCFullYear()}-${pad(i + 1)}-30`).getTime() <
								begin_date.getTime() ||
								new Date(`${endDate.getUTCFullYear()}-${pad(i + 1)}-01`).getTime() >
									last_date.getTime()}
							onclick={() => {
								monthModeEnd = false;
								let newDate = new Date(endDate);
								newDate.setUTCMonth(i);
								updateEndDate(newDate);
							}}>{month}</Button
						>
					{/each}
				</div>
			{:else}
				<div class="min-h-[280px]">
					<div in:scale={{ start: 0.8, duration: 300 }} class="grid grid-cols-5">
						{#each endDates as date}
							<Button
								class="duration-200 hover:rounded-md
								{date.toISOString().split('T')[0] === now.toISOString().split('T')[0] ? ' font-bold' : ''}
								{date.toISOString().split('T')[0] === endDate.toISOString().split('T')[0]
									? 'bg-accent rounded-s-none'
									: ''} {date.getTime() < endDate.getTime() && date.getTime() > startDate.getTime()
									? 'bg-accent/50 rounded-none'
									: ''} {date.toISOString().split('T')[0] === startDate.toISOString().split('T')[0]
									? 'bg-accent rounded-s-md rounded-e-none'
									: ''}"
								variant="ghost"
								disabled={date.getTime() < begin_date.getTime() - 11 * 60 * 60 * 1000 ||
									date.getTime() > last_date.getTime() + 11 * 60 * 60 * 1000}
								onclick={() => {
									let newDate = new Date(endDate);
									newDate.setUTCDate(date.getUTCDate());
									updateEndDate(newDate);
								}}>{date.getUTCDate()}</Button
							>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

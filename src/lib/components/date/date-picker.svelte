<script lang="ts">
	import SveltyPicker from 'svelty-picker';

	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	interface Props {
		start_date?: string;
		end_date?: string;
		startDate?: string;
		endDate?: string;
	}

	let {
		start_date = $bindable(''),
		end_date = $bindable(''),
		startDate = '',
		endDate = ''
	}: Props = $props();

	let time_interval = $state([start_date, end_date]);
	$effect(() => {
		((time_interval) => {
			if (!time_interval) {
				return;
			}
			start_date = time_interval[0];
			end_date = time_interval[1];
		})(time_interval);
	});

	function onManualChange() {
		if (!time_interval) {
			time_interval = [start_date, end_date];
		} else if (start_date != time_interval[0] || end_date != time_interval[1]) {
			time_interval = [start_date, end_date];
		}
	}
</script>

<div class="date-range-picker-wrapper">
	<SveltyPicker
		name="time_interval"
		pickerOnly={false}
		todayBtn={false}
		clearBtn={false}
		manualInput={true}
		isRange
		mode="date"
		{startDate}
		{endDate}
		bind:value={time_interval}
	>
		<svelte:fragment slot="inputs" let:displayValue let:onInputFocus let:onInputBlur let:onKeyDown>
			<div class="flex flex-col gap-4 md:flex-row">
				<div class="relative flex md:w-1/2">
					<Input
						class="h-13 pt-6"
						type="text"
						name="start_date"
						id="start_date"
						bind:value={start_date}
						onkeydown={onKeyDown}
						onfocus={onInputFocus}
						onblur={onInputBlur}
						onchange={onManualChange}
					/>
					<Label
						class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
						for="start_date">Start date</Label
					>
				</div>

				<div class="relative flex flex-row md:w-1/2">
					<Input
						class="h-13 pt-6"
						type="text"
						name="end_date"
						id="end_date"
						bind:value={end_date}
						onkeydown={onKeyDown}
						onfocus={onInputFocus}
						onblur={onInputBlur}
						onchange={onManualChange}
					/>
					<Label
						class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
						for="end_date">End date</Label
					>
				</div>
				<input type="hidden" name="time_interval" value={displayValue} />
			</div>
		</svelte:fragment>
	</SveltyPicker>
</div>

<script lang="ts">
	import SveltyPicker from 'svelty-picker';
	import './start-end-date.css';

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
	></SveltyPicker>
	<div class="date-range-picker-label">
		<label>Start Date - End Date</label>
	</div>
</div>

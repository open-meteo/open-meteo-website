<script lang="ts">
	import SveltyPicker from 'svelty-picker';

	export let start_date = '';
	export let end_date = '';
	export let startDate = '';
	export let endDate = '';

	let time_interval = [start_date, end_date];
	$: ((time_interval) => {
		if (!time_interval) {
			return;
		}
		start_date = time_interval[0];
		end_date = time_interval[1];
	})(time_interval);

	function onManualChange() {
		if (!time_interval) {
			time_interval = [start_date, end_date];
		} else if (start_date != time_interval[0] || end_date != time_interval[1]) {
			time_interval = [start_date, end_date];
		}
	}
</script>

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
	<svelte:fragment
		slot="inputs"
		let:value
		let:displayValue
		let:isDirty
		let:onInputFocus
		let:onInputBlur
		let:onKeyDown
	>
		<div class="row">
			<div class="col-md-6">
				<div class="form-floating">
					<input
						type="text"
						class="form-control"
						name="start_date"
						id="start_date"
						bind:value={start_date}
						on:keydown={onKeyDown}
						on:focus={onInputFocus}
						on:blur={onInputBlur}
						on:change={onManualChange}
					/>
					<label for="start_date">Start Date</label>
				</div>
			</div>
			<div class="col-md-6">
				<div class="form-floating">
					<input
						type="text"
						class="form-control"
						name="end_date"
						id="end_date"
						bind:value={end_date}
						on:keydown={onKeyDown}
						on:focus={onInputFocus}
						on:blur={onInputBlur}
						on:change={onManualChange}
					/>
					<label for="end_date">End Date</label>
				</div>
			</div>
			<input type="hidden" name="time_interval" value={displayValue} />
		</div>
	</svelte:fragment>
</SveltyPicker>

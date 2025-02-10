<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';

	const start = today(getLocalTimeZone());
	const end = start.add({ days: 7 });

	let value = $state({
		start,
		end
	});
</script>

<div>
	<RangeCalendar bind:value class="rounded-md border" />
</div>

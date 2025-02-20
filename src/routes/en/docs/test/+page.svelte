<script lang="ts">
	import { writable, type Writable } from 'svelte/store';

	import { Input } from '$lib/components/ui/input/';
	import SuperDebug from 'sveltekit-superforms';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { defaultParameters } from '../options';

	let inputState = $state(56.23);
	// let params = writable({
	// 	lat: 53.24
	// });

	const params: Writable<Parameters> = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],

		...defaultParameters,

		hourly: ['temperature_2m']
	});
</script>

<form method="get" action="https://api.open-meteo.com/v1/forecast">
	<Input
		type="number"
		class="h-12 cursor-pointer pt-6"
		name="tilt"
		step="1"
		min="0"
		max="90"
		bind:value={$params.latitude}
	/>
	<div>{$params.latitude}</div>
	<SuperDebug data={params} />
</form>

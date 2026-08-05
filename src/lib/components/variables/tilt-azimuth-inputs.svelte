<script lang="ts">
	import { slide } from '$lib/utils/transitions';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import { type Parameters } from '$lib/docs';

	interface Props {
		params: Parameters;
	}

	let { params = $bindable() }: Props = $props();

	let tiltInvalid = $derived(Number(params.tilt) < 0 || Number(params.tilt) > 90);
	let azimuthInvalid = $derived(Number(params.azimuth) < -180 || Number(params.azimuth) > 180);
</script>

<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-2 md:gap-6">
	<div class="relative">
		<Input
			id="tilt"
			type="number"
			class="h-12 cursor-pointer pt-6 {tiltInvalid ? 'text-red' : ''}"
			name="tilt"
			step="1"
			min="0"
			max="90"
			bind:value={params.tilt}
		/>
		<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs" for="tilt"
			>Panel Tilt (0° horizontal)</Label
		>
		{#if tiltInvalid}
			<div class="invalid-tooltip" transition:slide>Tilt must be between 0° and 90°</div>
		{/if}
	</div>

	<div class="relative">
		<Input
			type="number"
			class="h-12 cursor-pointer pt-6 {azimuthInvalid ? 'text-red' : ''}"
			name="azimuth"
			id="azimuth"
			step="1"
			min="-180"
			max="180"
			bind:value={params.azimuth}
		/>
		<Label
			class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
			for="azimuth">Panel Azimuth (0° S, -90° E, 90° W, ±180° N)</Label
		>
		{#if azimuthInvalid}
			<div class="invalid-tooltip" transition:slide>
				Azimuth must be between -180° (north) and 180° (north)
			</div>
		{/if}
	</div>
</div>

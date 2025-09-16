<script lang="ts">
	import { slide } from 'svelte/transition';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import type { CheckboxOptions, Parameters } from '$lib/docs';

	interface Props {
		params: Parameters;
		solarVariables: CheckboxOptions;
	}

	let { params = $bindable(), solarVariables }: Props = $props();
</script>

<div class="grid md:grid-cols-2">
	{#each solarVariables as group, i (i)}
		<div>
			{#each group as { value, label } (value)}
				<div class="group flex items-center" title={label}>
					<Checkbox
						id="{value}_hourly"
						class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
						{value}
						checked={params.hourly?.includes(value)}
						aria-labelledby="{value}_hourly_label"
						onCheckedChange={() => {
							if (params.hourly?.includes(value)) {
								params.hourly = params.hourly.filter((item) => {
									return item !== value;
								});
							} else if (params.hourly) {
								params.hourly.push(value);
								params.hourly = params.hourly;
							}
						}}
					/>
					<Label
						id="{value}_hourly_label"
						for="{value}_hourly"
						class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
					>
				</div>
			{/each}
		</div>
	{/each}
</div>

<small class="text-muted-foreground mt-1">
	Note: Solar radiation is averaged over the past hour. Use
	<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI please specify
	Tilt and Azimuth below.
</small>

<div class="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-2 md:gap-6">
	<div class="relative">
		<Input
			id="tilt"
			type="number"
			class="h-12 cursor-pointer pt-6 {Number(params.tilt) < 0 || Number(params.tilt) > 90
				? 'text-red'
				: ''}"
			name="tilt"
			step="1"
			min="0"
			max="90"
			bind:value={params.tilt}
		/>
		<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs" for="tilt"
			>Panel Tilt (0° horizontal)</Label
		>
		{#if Number(params.tilt) < 0 || Number(params.tilt) > 90}
			<div class="invalid-tooltip" transition:slide>Tilt must be between 0° and 90°</div>
		{/if}
	</div>

	<div class="relative">
		<Input
			type="number"
			class="h-12 cursor-pointer pt-6 {Number(params.azimuth) < -180 || Number(params.azimuth) > 180
				? 'text-red'
				: ''}"
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
		{#if Number(params.azimuth) < -180 || Number(params.azimuth) > 180}
			<div class="invalid-tooltip" transition:slide>
				Azimuth must be between -180° (north) and 180° (north)
			</div>
		{/if}
	</div>
</div>

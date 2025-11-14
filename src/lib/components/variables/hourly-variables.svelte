<script lang="ts">
	import { fade } from 'svelte/transition';

	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	import { type Parameters } from '$lib/docs';

	import { allHourly } from './all-hourly';

	interface Props {
		params: Parameters;
		hourly: { value: string; label: string }[][];
	}

	let { params = $bindable(), hourly }: Props = $props();

	let hourlyFlat = $derived(hourly.flat());
	let hourlyValues = $derived(hourlyFlat.map((h) => h.value));

	const getVariable = (variable: string) => {
		for (let h of allHourly) {
			if (variable === h.value) {
				return h;
			}
		}
		return null;
	};

	let notAvailable = $derived(
		params.hourly
			?.filter((h: string) => !hourlyValues?.includes(h))
			.map((nA: string) => getVariable(nA))
	);
</script>

<div
	in:fade
	class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
>
	{#each hourly as group, i (i)}
		<div>
			{#each group as { value, label } (value)}
				<div class="group flex items-center" title={label}>
					<Checkbox
						id="{value}_hourly"
						class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
						{value}
						checked={params.hourly?.includes(value)}
						aria-labelledby="{value}_label"
						onCheckedChange={() => {
							if (params.hourly?.includes(value)) {
								params.hourly = params.hourly.filter((item: string) => {
									return item !== value;
								});
							} else if (params.hourly) {
								params.hourly.push(value);
								params.hourly = params.hourly;
							}
						}}
					/>
					<Label
						id="{value}_label"
						for="{value}_hourly"
						class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
					>
				</div>
			{/each}
		</div>
	{/each}
	{#if notAvailable.length > 0}
		<div transition:fade>
			<div class="font-bold">Not available for selected model:</div>
			{#each notAvailable as { value, label } (value)}
				<div class="group flex items-center opacity-40" title={label}>
					<Checkbox
						id="{value}_hourly"
						class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
						{value}
						checked={params.hourly?.includes(value)}
						aria-labelledby="{value}_label"
						onclick={() => {
							if (params.hourly?.includes(value)) {
								params.hourly = params.hourly.filter((item) => {
									return item !== value;
								});
							}
						}}
					/>
					<Label
						id="{value}_label"
						for="{value}_hourly"
						class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
					>
				</div>
			{/each}
		</div>
	{/if}
</div>

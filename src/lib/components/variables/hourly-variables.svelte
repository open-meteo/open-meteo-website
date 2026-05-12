<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	import { type Parameters } from '$lib/docs';

	interface Props {
		params: Parameters;
		hourly: { value: string; label: string }[][];
	}

	let { params = $bindable(), hourly }: Props = $props();
</script>

<div class="mt-6 md:mt-12">
	<a href="#hourly_weather_variables"
		><h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">Hourly Weather Variables</h2></a
	>
	<div
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
	</div>
</div>

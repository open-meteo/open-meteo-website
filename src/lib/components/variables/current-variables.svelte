<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import type { CheckboxOptions, Parameters } from '$lib/docs';

	interface Props {
		params: Parameters;
		current: CheckboxOptions;
	}

	let { params = $bindable(), current }: Props = $props();
</script>

<div class="mt-6 md:mt-12">
	<a href="#current_weather"
		><h2 id="current_weather" class="text-2xl md:text-3xl">Current Weather</h2></a
	>
	<div
		class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
	>
		{#each current as group, i (i)}
			<div>
				{#each group as { value, label } (value)}
					<div class="group flex items-center" title={label}>
						<Checkbox
							id="{value}_current"
							class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
							{value}
							checked={params.current?.includes(value)}
							aria-labelledby="{value}_current_label"
							onCheckedChange={() => {
								if (params.current?.includes(value)) {
									params.current = params.current.filter((item) => {
										return item !== value;
									});
								} else if (params.current) {
									params.current.push(value);
									params.current = params.current;
								}
							}}
						/>
						<Label
							id="{value}_current_label"
							for="{value}_current"
							class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]">{label}</Label
						>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<small class="text-muted-foreground mt-1">
		Note: Current conditions are based on 15-minutely weather model data. Every weather variable
		available in hourly data, is available as current condition as well.
	</small>
</div>

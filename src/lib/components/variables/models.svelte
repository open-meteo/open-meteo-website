<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import { type CheckboxOptions, type Parameters } from '$lib/docs';

	interface Props {
		params: Parameters;
		models: CheckboxOptions;
	}

	let { params = $bindable(), models }: Props = $props();
</script>

<div class="">
	<div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
		{#each models as group, i (i)}
			<div class="mb-3">
				{#each group as { value, label } (value)}
					<div class="group flex items-center" title={label}>
						<Checkbox
							id="{value}_model"
							class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
							{value}
							checked={params.models?.includes(value)}
							aria-labelledby="{value}_label"
							onCheckedChange={() => {
								if (params.models?.includes(value)) {
									params.models = params.models.filter((item) => {
										return item !== value;
									});
								} else if (params.models) {
									params.models.push(value);
									params.models = params.models;
								}
							}}
						/>
						<Label
							id="{value}_model_label"
							for="{value}_model"
							class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
						>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div>
		<small class="text-muted-foreground"
			>Note: The default <mark>Best Match</mark> provides the best forecast for any given location
			worldwide. <mark>Seamless</mark> combines all models from a given provider into a seamless prediction.</small
		>
	</div>
</div>

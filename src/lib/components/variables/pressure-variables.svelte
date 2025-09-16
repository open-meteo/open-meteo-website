<script lang="ts">
	import { sliceIntoChunks } from '$lib/utils';

	import { altitudeAboveSeaLevelMeters } from '$lib/utils/meteo';

	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	import type { CheckboxOption, Parameters } from '$lib/docs';

	interface Props {
		params: Parameters;
		levels: number[];
		pressureVariables: CheckboxOption[];
	}

	let { params = $bindable(), levels, pressureVariables }: Props = $props();

	let pressureVariablesTab = $state('temperature');
</script>

<div class="flex flex-col gap-3 md:flex-row md:gap-6">
	<div class="w-full md:w-[227px]">
		<ToggleGroup.Root type="single" bind:value={pressureVariablesTab}>
			<div class="border-border flex flex-col rounded-lg border">
				{#each pressureVariables as variable, i (i)}
					<ToggleGroup.Item
						value={variable.value}
						class="min-h-12 w-[225px] cursor-pointer rounded-none py-1.5 !opacity-100 lg:min-h-[unset] {i ===
						0
							? 'rounded-t-md !rounded-b-none'
							: ''} {i === pressureVariables.length - 1 ? '!rounded-t-none rounded-b-md' : ''}"
						disabled={pressureVariablesTab === variable.value}
						onclick={() => (pressureVariablesTab = variable.value)}
						><div class="flex w-full items-center justify-between gap-2 text-left">
							{variable.label}
							<span class="text-xs">
								{levels.filter((level) => params.hourly?.includes(`${variable.value}_${level}hPa`))
									.length
									? '(' +
										levels.filter((level) =>
											params.hourly?.includes(`${variable.value}_${level}hPa`)
										).length +
										'/' +
										levels.length +
										')'
									: ''}
							</span>
						</div>
					</ToggleGroup.Item>
				{/each}
			</div>
		</ToggleGroup.Root>
	</div>
	<div class="w-full">
		{#each pressureVariables as variable, i (i)}
			{#if pressureVariablesTab === variable.value}
				<div class="mb-3">{variable.label}</div>
				<div>
					<div class="grid grid-cols-1 lg:grid-cols-3">
						{#each sliceIntoChunks(levels, levels.length / 3 + 1) as chunk, j (j)}
							<div>
								{#each chunk as level, k (k)}
									<div class="group flex items-center">
										<Checkbox
											id="{variable.value}_{level}hPa"
											class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
											value="{variable.value}_{level}hPa"
											checked={params.hourly?.includes(`${variable.value}_${level}hPa`)}
											aria-labelledby="{variable.value}_{level}hPa"
											onCheckedChange={() => {
												if (params.hourly?.includes(`${variable.value}_${level}hPa`)) {
													params.hourly = params.hourly.filter((item) => {
														return item !== `${variable.value}_${level}hPa`;
													});
												} else if (params.hourly) {
													params.hourly.push(`${variable.value}_${level}hPa`);
													params.hourly = params.hourly;
												}
											}}
										/>
										<Label
											for="{variable.value}_{level}hPa"
											class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]"
											>{level} hPa
											<small class="text-muted-foreground"
												>({altitudeAboveSeaLevelMeters(level)})</small
											></Label
										>
									</div>
								{/each}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>
<div class="mt-3 lg:ml-[249px]">
	<small class="text-muted-foreground"
		>Note: Altitudes are approximate and in meters <strong> above sea level</strong>
		(not above ground). Use <mark>geopotential_height</mark> to get precise altitudes above sea level.</small
	>
</div>

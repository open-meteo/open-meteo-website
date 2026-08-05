<script lang="ts">
	import { sliceIntoChunks } from '$lib/utils';
	import { altitudeAboveSeaLevelMeters } from '$lib/utils/meteo';

	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	interface Props {
		pressureVariables: { value: string; label: string }[];
		levels: number[];
		/** The bound selection array, e.g. `$params.hourly` */
		values: string[] | undefined;
		/** Number of level columns on large screens */
		columns?: 2 | 3;
		isDisabled?: (value: string) => boolean;
		/** Show the altitude approximation note below the selector */
		note?: boolean;
	}

	let {
		pressureVariables,
		levels,
		values = $bindable(),
		columns = 3,
		isDisabled,
		note = true
	}: Props = $props();

	let pressureVariablesTab = $state('temperature');

	// Same controlled checked/onCheckedChange approach as
	// variable-checkbox-groups.svelte: the bound array also changes externally
	// (URL hash restore, back navigation), so `checked` is derived from it.
	const toggle = (value: string) => {
		if (!values) return;
		values = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
	};

	const selectedCount = (variable: string) =>
		levels.filter((level) => values?.includes(`${variable}_${level}hPa`)).length;
</script>

<div class="flex flex-col gap-3 md:flex-row md:gap-6">
	<div class="w-full md:w-56.75">
		<ToggleGroup.Root type="single" bind:value={pressureVariablesTab} class="justify-start gap-0">
			<div class="border-border flex flex-col rounded-lg border">
				{#each pressureVariables as variable, i (variable)}
					<ToggleGroup.Item
						value={variable.value}
						class="min-h-12 w-56.25 cursor-pointer rounded-none py-1.5 opacity-100! lg:min-h-[unset] {i ===
						0
							? 'rounded-t-md rounded-b-none!'
							: ''} {i === pressureVariables.length - 1 ? 'rounded-t-none! rounded-b-md' : ''}"
						disabled={pressureVariablesTab === variable.value}
						onclick={() => (pressureVariablesTab = variable.value)}
						><div class="flex w-full items-center justify-between gap-2 text-left">
							{variable.label}
							<span class="text-xs">
								{selectedCount(variable.value)
									? '(' + selectedCount(variable.value) + '/' + levels.length + ')'
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
					<div class="grid grid-cols-1 {columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}">
						{#each sliceIntoChunks(levels, levels.length / columns + 1) as chunk, j (j)}
							<div>
								{#each chunk as level, k (k)}
									<div class="group flex items-center" title={String(level)}>
										<Checkbox
											id="{variable.value}_{level}hPa"
											class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-current"
											value="{variable.value}_{level}hPa"
											disabled={isDisabled?.(`${variable.value}_${level}hPa`) ?? false}
											checked={values?.includes(`${variable.value}_${level}hPa`)}
											aria-labelledby="{variable.value}_{level}hPa_label"
											onCheckedChange={() => toggle(`${variable.value}_${level}hPa`)}
										/>
										<Label
											id="{variable.value}_{level}hPa_label"
											for="{variable.value}_{level}hPa"
											class="cursor-pointer truncate py-[0.1rem] pl-[0.42rem]"
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
{#if note}
	<div class="mt-3 lg:ml-62.25">
		<small class="text-muted-foreground"
			>Note: Altitudes are approximate and in meters <strong> above sea level</strong>
			(not above ground). Use <mark>geopotential_height</mark> to get precise altitudes above sea level.</small
		>
	</div>
{/if}

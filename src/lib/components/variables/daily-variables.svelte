<script lang="ts">
	import { slide } from 'svelte/transition';

	import { countVariables } from '$lib/utils/meteo';

	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import * as Alert from '$lib/components/ui/alert';
	import * as Accordion from '$lib/components/ui/accordion';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';

	import type { CheckboxOptions, Parameters } from '$lib/docs';

	interface Props {
		params: Parameters;
		daily: CheckboxOptions;
		additionalDaily?: CheckboxOptions;
		timezoneInvalid?: boolean;
	}

	let { params = $bindable(), daily, additionalDaily, timezoneInvalid }: Props = $props();
</script>

<div class="mt-6 md:mt-12">
	<a href="#daily_weather_variables"
		><h2 id="daily_weather_variables" class="text-2xl md:text-3xl">Daily Weather Variables</h2></a
	>
	<div
		class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
	>
		{#each daily as group, i (i)}
			<div>
				{#each group as { value, label } (value)}
					<div class="group flex items-center" title={label}>
						<Checkbox
							id="{value}_daily"
							class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
							{value}
							checked={params.daily?.includes(value)}
							aria-labelledby="{value}_daily_label"
							onCheckedChange={() => {
								if (params.daily?.includes(value)) {
									params.daily = params.daily.filter((item) => {
										return item !== value;
									});
								} else if (params.daily) {
									params.daily.push(value);
									params.daily = params.daily;
								}
							}}
						/>
						<Label
							id="{value}_daily_label"
							for="{value}_daily"
							class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
						>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	{#if timezoneInvalid}
		<div transition:slide>
			<Alert.Root variant="warning" class="mt-2 md:mt-4">
				<Alert.Description>
					It is recommended to select a timezone for daily data. Per default the API will use GMT+0.
				</Alert.Description>
			</Alert.Root>
		</div>
	{/if}

	{#if additionalDaily}
		<Accordion.Root class="border-border mt-3 rounded-lg border md:mt-6">
			<AccordionItem
				id="additional-daily-variables"
				title="Additional Daily Variables"
				count={countVariables(additionalDaily, params.daily)}
			>
				<div
					class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
				>
					{#each additionalDaily as group, i (i)}
						<div>
							{#each group as { value, label } (value)}
								<div class="group flex items-center" title={label}>
									<Checkbox
										id="{value}_daily"
										class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
										{value}
										checked={params.daily?.includes(value)}
										aria-labelledby="{value}_daily_label"
										onCheckedChange={() => {
											if (params.daily?.includes(value)) {
												params.daily = params.daily.filter((item) => {
													return item !== value;
												});
											} else if (params.daily) {
												params.daily.push(value);
												params.daily = params.daily;
											}
										}}
									/>
									<Label
										id="{value}_daily_label"
										for="{value}_daily"
										class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
									>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</AccordionItem>
		</Accordion.Root>
	{/if}
</div>

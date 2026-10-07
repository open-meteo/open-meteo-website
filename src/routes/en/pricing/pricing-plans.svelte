<script lang="ts">
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';

	import { Button } from '#lib/components/ui/button/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';

	import { type Interval, type Plan, plans } from './plans';

	let interval: Interval = $state('month');
	/** Index of the selected volume option of the professional plan */
	let option = $state('0');

	const chf = (amount: number) => `CHF ${amount.toLocaleString('en')}`;
	const selected = (plan: Plan) => plan.options?.[Number(option)];
	const link = (plan: Plan) => (plan.options ? selected(plan)?.link : plan.link)?.[interval];
	const isRange = (plan: Plan) => {
		const units = selected(plan)?.units;
		return units !== undefined && units.upTo !== units.from;
	};
	/** How to fill in Stripe's quantity field for an option sold per 10 million calls */
	const quantityHint = (plan: Plan): string | undefined => {
		const units = selected(plan)?.units;
		if (!units) return undefined;
		const quantity =
			units.upTo === null
				? `${units.from} or more`
				: units.upTo === units.from
					? `${units.from}`
					: `${units.from} to ${units.upTo}`;
		return `At checkout, set the quantity to ${quantity} (10 million calls each).`;
	};
</script>

<div class="flex justify-center">
	<ToggleGroup.Root
		type="single"
		value={interval}
		onValueChange={(value: string) => {
			// A toggle group deselects on a second click; the interval always needs a value
			if (value) interval = value as Interval;
		}}
		class="bg-muted rounded-lg p-1"
	>
		<ToggleGroup.Item
			value="month"
			class="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground cursor-pointer rounded-md px-6"
			>Monthly</ToggleGroup.Item
		>
		<ToggleGroup.Item
			value="year"
			class="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground cursor-pointer rounded-md px-6"
			>Yearly</ToggleGroup.Item
		>
	</ToggleGroup.Root>
</div>

<div class="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
	{#each plans as plan (plan.name)}
		<!-- Each card spans four rows of the outer grid, so the prices, buttons and
		     feature lists of all cards sit on the same lines whatever their lengths -->
		<div class="row-span-4 grid grid-rows-subgrid gap-y-6">
			<div>
				<h3 class="text-xl font-semibold">{plan.name}</h3>
				<p class="text-muted-foreground mt-2 text-sm">{plan.description}</p>
			</div>

			<div class="self-end">
				{#if plan.options}
					<p class="text-muted-foreground text-sm">API calls per month</p>
					<Select.Root type="single" bind:value={option}>
						<Select.Trigger class="mt-1 w-full cursor-pointer" aria-label="API calls per month"
							>{selected(plan)?.label}</Select.Trigger
						>
						<Select.Content preventScroll={false} class="w-(--bits-select-anchor-width)">
							{#each plan.options as item, i (i)}
								<Select.Item class="cursor-pointer" value={String(i)} label={item.label}>
									<span class="font-semibold whitespace-nowrap">{item.label}</span>
									<span class="text-muted-foreground ml-auto whitespace-nowrap"
										>{item.units && item.units.upTo !== item.units.from ? 'from ' : ''}{chf(
											item.price[interval]
										)}</span
									>
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<p class="text-muted-foreground mt-4 text-sm">
						{isRange(plan) ? 'Starting at' : ''}&nbsp;
					</p>
					<p>
						<span class="text-4xl font-bold">{chf(selected(plan)?.price[interval] ?? 0)}</span>
						<span class="text-muted-foreground text-sm">per {interval}</span>
					</p>
				{:else if plan.price}
					<p>
						<span class="text-4xl font-bold">{chf(plan.price[interval])}</span>
						<span class="text-muted-foreground text-sm">per {interval}</span>
					</p>
				{/if}
			</div>

			<div>
				{#if plan.contact}
					<Button class="w-full" href={plan.contact}>Contact us</Button>
				{:else if link(plan)}
					<Button class="w-full" href={link(plan)}>Subscribe</Button>
				{:else}
					<Button class="w-full" disabled>Subscribe</Button>
				{/if}
				{#if quantityHint(plan)}
					<p class="text-muted-foreground mt-2 text-xs">{quantityHint(plan)}</p>
				{/if}
			</div>

			<div>
				{#if plan.features.length > 0}
					<p class="text-sm">This includes:</p>
					<ul class="mt-3 flex flex-col gap-3 text-sm">
						{#each plan.features as feature (feature)}
							<li class="flex gap-2">
								<CircleCheckIcon class="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
								{feature}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	{/each}
</div>

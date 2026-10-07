<script lang="ts">
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';

	import { Button } from '#lib/components/ui/button/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';

	import { type Interval, planTotal, plans } from './plans';

	let interval: Interval = $state('month');
	let quantity = $state('1');

	const chf = (amount: number) => `CHF ${amount.toLocaleString('en')}`;
	const quantityLabel = (q: number) => `${q * 10} million calls`;
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
		<ToggleGroup.Item value="month" class="cursor-pointer px-6">Monthly</ToggleGroup.Item>
		<ToggleGroup.Item value="year" class="cursor-pointer px-6">Yearly</ToggleGroup.Item>
	</ToggleGroup.Root>
</div>

<div class="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-4">
	{#each plans as plan (plan.name)}
		<!-- Each card spans four rows of the outer grid, so the prices, buttons and
		     feature lists of all cards sit on the same lines whatever their lengths -->
		<div class="row-span-4 grid grid-rows-subgrid gap-y-6">
			<div>
				<h3 class="text-xl font-semibold">{plan.name}</h3>
				<p class="text-muted-foreground mt-2 text-sm">{plan.description}</p>
			</div>

			<div class="self-end">
				{#if plan.price}
					{@const price = plan.price[interval]}
					<p>
						<span class="text-4xl font-bold"
							>{chf(planTotal(price, plan.maxQuantity ? Number(quantity) : 1))}</span
						>
						<span class="text-muted-foreground text-sm">per {interval}</span>
					</p>
					{#if plan.maxQuantity}
						<div class="mt-4">
							<Select.Root type="single" bind:value={quantity}>
								<Select.Trigger class="w-full cursor-pointer" aria-label="Quantity"
									>{quantityLabel(Number(quantity))}</Select.Trigger
								>
								<Select.Content preventScroll={false}>
									{#each { length: plan.maxQuantity } as _, i (i)}
										<Select.Item class="cursor-pointer" value={String(i + 1)}
											>{quantityLabel(i + 1)}</Select.Item
										>
									{/each}
								</Select.Content>
							</Select.Root>
							<p class="text-muted-foreground mt-2 text-xs">
								The quantity is confirmed again at checkout.
							</p>
						</div>
					{/if}
				{/if}
			</div>

			<div>
				{#if plan.contact}
					<Button class="w-full" href={plan.contact}>Contact us</Button>
				{:else if plan.link?.[interval]}
					<Button class="w-full" href={plan.link[interval]}>Subscribe</Button>
				{:else}
					<Button class="w-full" disabled>Subscribe</Button>
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

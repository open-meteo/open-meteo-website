<script lang="ts">
	import { fade } from 'svelte/transition';

	import * as Accordion from '$lib/components/ui/accordion';

	interface Props {
		id: string;
		title: string;
		count?: any;
		last?: boolean;

		children?: import('svelte').Snippet;
	}

	let { id, title, count = { active: 0, total: 0 }, last = false, children }: Props = $props();
</script>

<Accordion.Item class="accordion-item border-border {last ? 'border-none' : ''}" value={id}>
	<Accordion.Trigger
		class="border-border [[data-state=open]]:bg-accent flex cursor-pointer px-4 underline-offset-3 [[data-state=open]]:border-b"
	>
		<div class="flex">
			<h2 id="heading-{id} after:content-none">
				{title}
			</h2>
			{#if count.active > 0}
				<div transition:fade={{ duration: 200 }} class="relative">
					<div
						class="bg-secondary border-foreground/25 absolute -top-1 ml-2 rounded-full border-2 px-3 py-1 text-sm no-underline"
					>
						{count.active}{#if count.total > 0}&nbsp;/&nbsp;{count.total}{/if}
					</div>
				</div>
			{/if}
		</div>
	</Accordion.Trigger>
	<Accordion.Content class="p-4">
		{@render children?.()}
	</Accordion.Content>
</Accordion.Item>

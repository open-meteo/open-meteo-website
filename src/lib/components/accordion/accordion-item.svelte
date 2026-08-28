<script lang="ts">
	import { fade } from '$lib/utils/transitions';

	import * as Accordion from '$lib/components/ui/accordion';

	interface Props {
		id: string;
		title: string;
		count?: { active: number; total: number };
		last?: boolean;
		anchor?: string;

		children?: import('svelte').Snippet;
	}

	let {
		id,
		title,
		count = { active: 0, total: 0 },
		last = false,
		anchor,
		children
	}: Props = $props();
</script>

<Accordion.Item class="accordion-item border-border {last ? 'border-none' : ''}" value={id}>
	<Accordion.Trigger
		class="group border-border data-[state=open]:bg-accent flex cursor-pointer px-4 underline-offset-3 data-[state=open]:border-b xl:px-6 xl:py-5"
	>
		<div class="flex">
			<h2 id="heading-{id}" class="after:content-none">
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
			{#if anchor}
				<a
					href={anchor}
					aria-label="Link to {title}"
					class="ml-2 self-center opacity-0 duration-200 group-hover:opacity-100 focus-visible:opacity-100"
					onclick={(e) => e.stopPropagation()}
				>
					<img
						src="/images/logos/link.svg"
						alt=""
						height="18"
						width="18"
						class="rotate-90 dark:invert"
					/>
				</a>
			{/if}
		</div>
	</Accordion.Trigger>
	<Accordion.Content class="p-4 xl:p-6">
		{@render children?.()}
	</Accordion.Content>
</Accordion.Item>

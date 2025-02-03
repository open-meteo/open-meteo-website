<script lang="ts">
	import { fade } from 'svelte/transition';

	import * as Accordion from '$lib/components/ui/accordion';

	interface Props {
		id: string;
		title: string;
		count?: any;

		children?: import('svelte').Snippet;
	}

	let {
		id,
		title,
		count = { active: 0, total: 0 },

		children
	}: Props = $props();
</script>

<Accordion.Item class="border-border border-b" value={id}>
	<Accordion.Trigger
		class="underline-offset-3 border-border [[data-state=open]]:bg-accent [[data-state=open]]:border-b flex cursor-pointer px-4"
	>
		<div class="flex">
			<h2 id="heading-{id}">
				{title}
			</h2>
			{#if count.active > 0}
				<div in:fade class="bg-secondary ml-2 rounded-full px-3 py-1 text-sm no-underline">
					{count.active}{#if count.total > 0}&nbsp;/&nbsp;{count.total}{/if}
				</div>
			{/if}
		</div>
	</Accordion.Trigger>
	<Accordion.Content class="p-4">
		{@render children?.()}
	</Accordion.Content>
</Accordion.Item>

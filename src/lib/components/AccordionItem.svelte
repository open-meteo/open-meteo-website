<script lang="ts">
	import Button from './ui/button/button.svelte';
	import * as Accordion from '$lib/components/ui/accordion';

	interface Props {
		id: string;
		title: string;
		count?: any;
		open?: any;
		renderBody?: any;
		children?: import('svelte').Snippet;
	}

	let {
		id,
		title,
		count = { active: 0, total: 0 },
		open = $bindable(count.active > 0),
		renderBody = $bindable(open),
		children
	}: Props = $props();

	function toggle() {
		open = !open;
		// Once body has been added, keep it
		// It may contain checkboxes that have been checked
		renderBody = renderBody || open;
	}
</script>

<Accordion.Item value={id}>
	<Accordion.Trigger class="px-4"
		><h2 id="heading-{id}">
			{title}
			{#if count.active > 0}
				<span class="badge rounded-pill bg-secondary ms-2"
					>{count.active}{#if count.total > 0}&nbsp;/&nbsp;{count.total}{/if}</span
				>
			{/if}
		</h2></Accordion.Trigger
	>
	<Accordion.Content class="p-4">
		{@render children?.()}
	</Accordion.Content>
</Accordion.Item>

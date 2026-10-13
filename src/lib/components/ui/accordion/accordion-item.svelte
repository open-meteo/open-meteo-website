<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';

	import { cn } from '#lib/utils/ui.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AccordionPrimitive.ItemProps = $props();
</script>

<AccordionPrimitive.Item
	bind:ref
	data-slot="accordion-item"
	class={cn('not-last:border-b first-of-type:[&_button]:rounded-t-md', className)}
	{...restProps}
/>

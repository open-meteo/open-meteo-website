<script lang="ts">
	import { cn } from '$lib/utils/ui.js';
	import { Accordion as AccordionPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AccordionPrimitive.ItemProps = $props();
</script>

<AccordionPrimitive.Item
	bind:ref
	data-slot="accordion-item"
	class={cn('border-b last:border-b-0 first-of-type:[&_button]:rounded-t-md', className)}
	{...restProps}
/>

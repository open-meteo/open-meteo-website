<script lang="ts">
	import { Accordion as AccordionPrimitive, type WithoutChild } from 'bits-ui';
	import ChevronDown from 'lucide-static/icons/chevron-down.svg?component';
	import { cn } from '$lib/utils/ui.js';

	let {
		ref = $bindable(null),
		class: className,
		level = 3,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.TriggerProps> & {
		level?: AccordionPrimitive.HeaderProps['level'];
	} = $props();
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		bind:ref
		class={cn(
			'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		<ChevronDown
			width="18"
			height="18"
			viewBox="0 0 24 24"
			class="shrink-0 transition-transform duration-300"
		/>
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>

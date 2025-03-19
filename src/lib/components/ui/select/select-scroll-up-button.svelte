<script lang="ts">
	import ChevronUp from 'lucide-static/icons/chevron-up.svg?component';
	import { Select as SelectPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
	import { cn } from '$lib/utils/ui.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SelectPrimitive.ScrollUpButtonProps> = $props();
</script>

<SelectPrimitive.ScrollUpButton
	bind:ref
	class={cn('flex cursor-default items-center justify-center py-1', className)}
	{...restProps}
>
	<ChevronUp width="16" height="16" viewBox="0 0 24 24" />
</SelectPrimitive.ScrollUpButton>

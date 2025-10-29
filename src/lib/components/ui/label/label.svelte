<script lang="ts">
	import { cn } from '$lib/utils/ui.js';
	import { Label as LabelPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: LabelPrimitive.RootProps = $props();
</script>

<LabelPrimitive.Root
	bind:ref
	class={cn('truncate peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
	{...restProps}
/>

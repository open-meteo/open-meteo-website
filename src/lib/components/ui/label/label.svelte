<script lang="ts">
	import { Label as LabelPrimitive } from 'bits-ui';

	import { cn } from '#lib/utils/ui.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: LabelPrimitive.RootProps = $props();
</script>

<LabelPrimitive.Root
	bind:ref
	data-slot="label"
	class={cn(
		'truncate peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
		className
	)}
	{...restProps}
/>

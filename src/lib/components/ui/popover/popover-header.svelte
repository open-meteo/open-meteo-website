<script lang="ts">
	import { type WithElementRef, cn } from '#lib/utils/ui.js';

	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="popover-header"
	class={cn('flex flex-col gap-0.5 text-sm', className)}
	{...restProps}
>
	{@render children?.()}
</div>

<script lang="ts">
	import { type WithElementRef, cn } from '$lib/utils/ui.js';
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
	data-slot="alert-title"
	class={cn('col-start-2 line-clamp-1 min-h-4   tracking-tight', className)}
	{...restProps}
>
	{@render children?.()}
</div>

<script lang="ts">
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/ui.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	class={cn('mt-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4', className)}
	{...restProps}
>
	{@render children?.()}
</div>

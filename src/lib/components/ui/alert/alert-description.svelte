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
	data-slot="alert-description"
	class={cn('gap-1 [&_p]:leading-relaxed', className)}
	{...restProps}
>
	{@render children?.()}
</div>

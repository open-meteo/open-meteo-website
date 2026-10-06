<script lang="ts">
	import { type WithElementRef, cn } from '#lib/utils/ui.js';

	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="dropdown-menu-shortcut"
	class={cn('ml-auto text-xs tracking-widest opacity-60', className)}
	{...restProps}
>
	{@render children?.()}
</span>

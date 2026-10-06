<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	import { type WithoutChildrenOrChild, cn } from '#lib/utils/ui.js';

	import DropdownMenuPortal from './dropdown-menu-portal.svelte';

	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		align = 'start',
		alignOffset = -3,
		portalProps,
		...restProps
	}: DropdownMenuPrimitive.SubContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof DropdownMenuPortal>>;
	} = $props();
</script>

<DropdownMenuPortal {...portalProps}>
	<DropdownMenuPrimitive.SubContent
		bind:ref
		data-slot="dropdown-menu-sub-content"
		{align}
		{alignOffset}
		class={cn(
			'bg-popover text-popover-foreground z-50 min-w-32 origin-(--bits-dropdown-menu-content-transform-origin) rounded-md border p-1 shadow-lg focus:outline-none',
			className
		)}
		{...restProps}
	/>
</DropdownMenuPortal>

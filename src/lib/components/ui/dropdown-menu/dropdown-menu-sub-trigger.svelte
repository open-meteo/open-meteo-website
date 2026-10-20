<script lang="ts">
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	import { cn } from '#lib/utils/ui.js';

	let {
		ref = $bindable(null),
		class: className,
		inset,
		children,
		...restProps
	}: DropdownMenuPrimitive.SubTriggerProps & {
		inset?: boolean;
	} = $props();
</script>

<DropdownMenuPrimitive.SubTrigger
	bind:ref
	data-slot="dropdown-menu-sub-trigger"
	data-inset={inset}
	class={cn(
		'data-[highlighted]:bg-accent data-[state=open]:bg-accent flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 outline-none select-none data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0',
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronRightIcon class="cn-rtl-flip ml-auto" />
</DropdownMenuPrimitive.SubTrigger>

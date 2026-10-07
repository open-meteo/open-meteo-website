<script lang="ts">
	import CircleIcon from '@lucide/svelte/icons/circle';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	import { type WithoutChild, cn } from '#lib/utils/ui.js';

	let {
		ref = $bindable(null),
		class: className,
		children: childrenProp,
		closeOnSelect = false,
		...restProps
	}: WithoutChild<DropdownMenuPrimitive.RadioItemProps> = $props();
</script>

<DropdownMenuPrimitive.RadioItem
	bind:ref
	{closeOnSelect}
	data-slot="dropdown-menu-radio-item"
	class={cn(
		'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 outline-none select-none data-inset:pl-8 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<span
			class="absolute left-2 flex size-3.5 items-center justify-center"
			data-slot="dropdown-menu-radio-item-indicator"
		>
			{#if checked}
				<CircleIcon class="size-2 fill-current" />
			{/if}
		</span>
		{@render childrenProp?.({ checked })}
	{/snippet}
</DropdownMenuPrimitive.RadioItem>

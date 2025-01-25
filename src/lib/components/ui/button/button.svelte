<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { type Events, type Props, buttonVariants } from './index.js';
	import { cn } from '$lib/utils/ui';

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let highlight: $$Props['highlight'] = 'default';

	export let builders: $$Props['builders'] = [];
	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, highlight, className }))}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</ButtonPrimitive.Root>

<style>
	:global(.grow-text) {
		flex-direction: column;
	}

	:global(.grow-text::after) {
		content: attr(data-text);
		content: attr(data-text) / '';
		height: 0;
		visibility: hidden;
		overflow: hidden;
		user-select: none;
		pointer-events: none;
		font-weight: bold;
	}
</style>

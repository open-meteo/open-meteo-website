<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/ui.js';

	type $$Props = SelectPrimitive.LabelProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Label
	class={cn('py-1.5 pr-2 pl-8 text-sm font-semibold', className)}
	{...$$restProps}
>
	<slot />
</SelectPrimitive.Label>

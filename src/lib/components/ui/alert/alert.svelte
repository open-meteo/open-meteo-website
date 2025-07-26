<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	export const alertVariants = tv({
		base: 'relative flex items-start gap-y-0.5 rounded-lg border px-4 py-2.75 has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-2 [&>svg]:min-w-4.75 [&>svg]:max-w-4.75  [&>svg]:text-current',
		variants: {
			variant: {
				default: 'bg-card border-border text-card-foreground',
				destructive:
					'text-destructive bg-card *:data-[slot=alert-description]:text-destructive [&>svg]:text-current/75',
				warning:
					'text-warning-dark bg-warning border-warning-dark/25 *:data-[slot=alert-description]:text-warning-dark [&>svg]:text-current/75',
				info: 'text-secondary-foreground bg-secondary border-secondary-foreground/25  *:data-[slot=alert-description]:text-secondary-foreground [&>svg]:text-current/75'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type AlertVariant = VariantProps<typeof alertVariants>['variant'];
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils/ui.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: AlertVariant;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="alert"
	class={cn(alertVariants({ variant }), className)}
	{...restProps}
	role="alert"
>
	{@render children?.()}
</div>

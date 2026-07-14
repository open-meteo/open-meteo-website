<script lang="ts">
	import type { Snippet } from 'svelte';

	// Animates its own height to follow the measured height of its content, so
	// swapping children of different sizes (mode toggles, conditional blocks)
	// glides instead of jumping the page around.
	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: className }: Props = $props();

	let contentHeight = $state<number>();
	let animating = $state(false);
</script>

<div
	class="animate-height {className ?? ''}"
	class:animating
	style:height={contentHeight ? `${contentHeight}px` : 'auto'}
	ontransitionstart={(e) => {
		if (e.target === e.currentTarget && e.propertyName === 'height') animating = true;
	}}
	ontransitionend={(e) => {
		if (e.target === e.currentTarget && e.propertyName === 'height') animating = false;
	}}
	ontransitioncancel={(e) => {
		if (e.target === e.currentTarget && e.propertyName === 'height') animating = false;
	}}
>
	<div class="content" bind:clientHeight={contentHeight}>
		{@render children()}
	</div>
</div>

<style>
	@media (prefers-reduced-motion: no-preference) {
		.animate-height {
			transition: height 300ms ease;
		}

		/* only clip mid-animation, so focus rings are not cut at rest */
		.animate-height.animating {
			overflow: clip;
		}
	}

	/* flow-root keeps child margins inside the measured box; relative anchors
	   outgoing children absolutized by the fadeOutAbsolute transition */
	.content {
		display: flow-root;
		position: relative;
	}
</style>

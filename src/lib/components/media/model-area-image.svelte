<script lang="ts">
	import ZoomableImage from './zoomable-image.svelte';

	import type { ComponentProps } from 'svelte';

	// A model-area image from the maps `domain-screenshots` script. The script
	// writes each capture as a source set: `<name>.webp` at the capture's CSS width
	// and `<name>-<width>w.webp` at 2x, 3x and 4x of it, so the enlarged view
	// stays crisp on large, high-density screens.
	interface Props extends Omit<
		ComponentProps<typeof ZoomableImage>,
		'widths' | 'width' | 'height'
	> {
		/** CSS size the image was captured at (the size of the base file). */
		baseWidth?: number;
		baseHeight?: number;
	}

	let {
		baseWidth = 1025,
		baseHeight = 900,
		// the docs show these in a two-column grid on large screens
		sizes = '(min-width: 1024px) 50vw, 100vw',
		...rest
	}: Props = $props();

	const widths = $derived([1, 2, 3, 4].map((scale) => baseWidth * scale));
</script>

<ZoomableImage {...rest} {widths} {sizes} width={baseWidth} height={baseHeight} />

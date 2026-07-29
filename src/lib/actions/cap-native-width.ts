/**
 * Svelte action that stops an `<img>` from ever rendering wider than its native
 * resolution — model-area screenshots are only ~1025px (satellites ~1240px) wide, so on
 * large viewports a `w-full` image would upscale and look soft. Once the intrinsic size is
 * known we cap `max-width` at `min(100%, <naturalWidth>px)`: the image still shrinks to
 * fit narrow containers, but never scales past its own pixels.
 */
export function capNativeWidth(node: HTMLImageElement) {
	const apply = () => {
		if (node.naturalWidth) {
			node.style.maxWidth = `min(100%, ${node.naturalWidth}px)`;
		}
	};

	// `complete` is already true for cached/SSR-hydrated images that decoded before this ran.
	if (node.complete) apply();
	node.addEventListener('load', apply);

	return {
		destroy() {
			node.removeEventListener('load', apply);
		}
	};
}

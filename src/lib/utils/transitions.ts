import { fade } from 'svelte/transition';

import type { FadeParams, TransitionConfig } from 'svelte/transition';

/**
 * Fade out while removing the node from the layout flow, so the incoming
 * sibling takes its place immediately and the two cross-fade in the same spot
 * instead of stacking. The parent must be `position: relative`
 * (`AnimateHeight` provides this), which also animates the height difference.
 */
export const fadeOutAbsolute = (node: HTMLElement, params?: FadeParams): TransitionConfig => {
	node.style.position = 'absolute';
	node.style.top = '0';
	node.style.insetInline = '0';
	return fade(node, params);
};

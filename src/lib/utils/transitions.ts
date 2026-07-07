import { get } from 'svelte/store';
import {
	fade as svelteFade,
	scale as svelteScale,
	slide as svelteSlide
} from 'svelte/transition';

import { animationsDisabled } from '$lib/stores/settings';

import type { FadeParams, ScaleParams, SlideParams, TransitionConfig } from 'svelte/transition';

/**
 * Svelte transitions run from JS, so the global `html.no-animations` CSS
 * kill-switch cannot reach them. These wrappers make every transition
 * instant while the user has animations disabled — import them instead of
 * `svelte/transition`.
 */
const gated =
	<P>(transition: (node: HTMLElement, params?: P) => TransitionConfig) =>
	(node: HTMLElement, params?: P): TransitionConfig =>
		get(animationsDisabled) ? { duration: 0 } : transition(node, params);

export const fade = gated<FadeParams>(svelteFade);
export const slide = gated<SlideParams>(svelteSlide);
export const scale = gated<ScaleParams>(svelteScale);

/**
 * Fade out while removing the node from the layout flow, so the incoming
 * sibling takes its place immediately and the two cross-fade in the same spot
 * instead of stacking. The parent must be `position: relative`
 * (`AnimateHeight` provides this), which also animates the height difference.
 */
export const fadeOutAbsolute = (node: HTMLElement, params?: FadeParams): TransitionConfig => {
	if (get(animationsDisabled)) return { duration: 0 };
	node.style.position = 'absolute';
	node.style.top = '0';
	node.style.insetInline = '0';
	return svelteFade(node, params);
};

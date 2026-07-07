<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import type { Component } from 'svelte';

	interface Props {
		Logo: Component;
		heroImage: string;
		heroImagePosition?: string;
		heroTitle: string;
		heroHeight: number;
		heroDescription: string;
		heroPrimaryButtonPath: string;
		heroPrimaryButtonText: string;
		heroSecondaryButtonPath: string;
		heroSecondaryButtonText: string;
	}

	let {
		Logo,
		heroImage,
		heroImagePosition = 'center',
		heroHeight,
		heroTitle,
		heroDescription,
		heroPrimaryButtonPath,
		heroPrimaryButtonText,
		heroSecondaryButtonPath,
		heroSecondaryButtonText
	}: Props = $props();
</script>

<svelte:head>
	<link rel="preload" fetchpriority="high" as="image" href={heroImage} type="image/webp" />
</svelte:head>

<div style="height: {heroHeight}px;" class="hero-container relative flex items-center">
	<div class="absolute inset-0 -z-10">
		<!-- The background-color shows whenever the image is not painted yet
		     (slow connections, or Firefox briefly presenting the new page before
		     the view transition is ready), so the hero never flashes white. -->
		<div
			class="h-full w-full"
			style="
			  view-transition-name: hero-image;
			  background-color: #54718e;
			  background-image: url('{heroImage}');
			  background-size: cover;
			  background-position: {heroImagePosition};
			"
		></div>
	</div>
	<div
		style="view-transition-name: hero-content"
		class="container flex h-full flex-col items-center justify-center gap-6 text-white"
	>
		<Logo width="96" height="96" shadow={true} />
		<h1
			class="text-center text-3xl font-light [text-shadow:3px_3px_2px_rgba(0,0,0,.7)] md:text-5xl"
		>
			{heroTitle}
		</h1>
		<div class="flex flex-col items-center justify-center gap-6 md:w-1/2">
			{#if heroDescription}
				<p
					class="text-center min-h-16 text-xl font-light [text-shadow:3px_3px_2px_rgba(0,0,0,.7)] md:text-2xl"
				>
					{heroDescription}
				</p>
			{/if}
			{#if heroPrimaryButtonText}
				<div class="mt-2 flex gap-4">
					<Button
						variant="default"
						href={heroPrimaryButtonPath}
						class="bg-primary bg-linear-to-t from-transparent to-[rgba(255,255,255,0.2)] dark:bg-linear-to-b dark:to-[rgba(0,0,0,0.2)]"
						>{heroPrimaryButtonText}</Button
					>
					<Button
						variant="outline"
						class="bg-transparent text-white hover:bg-white/75 hover:text-black dark:border-white/75 dark:brightness-92"
						href={heroSecondaryButtonPath}>{heroSecondaryButtonText}</Button
					>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	@media (prefers-reduced-motion: no-preference) {
		/* The hero persists in the root layout, so a height change between pages
		   can animate for real. Content below the hero moves along with it. */
		.hero-container {
			transition: height 500ms ease;
		}

		/* animation: none makes the groups track the live element's geometry
		   every frame, so the snapshots follow the real height transition above
		   instead of running the browser-generated morph (which would scale the
		   snapshots and warp the text). */
		::view-transition-group(hero-image) {
			animation: none;
			overflow: clip;
		}

		/* Both snapshots always cover the animating box, so the image never
		   stretches or letterboxes while the height changes. Only the browser
		   cross-fade's duration is overridden — replacing the animation outright
		   would also drop the plus-lighter blending that keeps the pair fully
		   opaque mid-fade, letting the page background flash through. */
		::view-transition-old(hero-image),
		::view-transition-new(hero-image) {
			width: 100%;
			height: 100%;
			object-fit: cover;
			animation-duration: 500ms;
			animation-fill-mode: both;
		}

		/* Content rides along with the live-tracked group. */
		::view-transition-group(hero-content) {
			animation: none;
			overflow: clip;
		}

		/* The old snapshot is a static capture: keep it at natural size (never
		   stretched) and centered in the animating box, where the text of both
		   pages sits, so old and new stay superimposed during the cross-fade. */
		::view-transition-old(hero-content) {
			width: 100%;
			height: auto;
			inset: 0;
			margin: auto;
			animation-duration: 150ms;
			animation-fill-mode: both;
		}

		/* The new snapshot renders the live element, but its box is derived from
		   the geometry captured at the start of the transition — while the real
		   height animates, the live texture gets stretched into that stale box,
		   warping the text. Sizing it to the group (which tracks the live element
		   every frame) keeps box and texture identical, so nothing stretches. */
		::view-transition-new(hero-content) {
			width: 100%;
			height: 100%;
			animation-duration: 150ms;
			animation-fill-mode: both;
		}
	}
</style>

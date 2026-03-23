<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	import { getHeroImage } from '$lib/assets/backgrounds/index';

	interface Props {
		Logo: import('svelte').Snippet;
		heroImage: string;
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
		heroHeight,
		heroTitle,
		heroDescription,
		heroPrimaryButtonPath,
		heroPrimaryButtonText,
		heroSecondaryButtonPath,
		heroSecondaryButtonText
	}: Props = $props();

	const picture = $derived(getHeroImage(heroImage));
</script>

<svelte:head>
	{#if picture}
		{@const avifSrcset = picture.sources['avif']}
		{@const webpSrcset = picture.sources['webp']}
		{#if avifSrcset}
			<link
				rel="preload"
				fetchpriority="high"
				as="image"
				type="image/avif"
				imagesrcset={avifSrcset}
				imagesizes="100vw"
			/>
		{:else if webpSrcset}
			<link
				rel="preload"
				fetchpriority="high"
				as="image"
				type="image/webp"
				imagesrcset={webpSrcset}
				imagesizes="100vw"
			/>
		{/if}
	{/if}
</svelte:head>

<div style="height: {heroHeight}px" class="relative flex items-center">
	<div class="absolute inset-0 -z-10 overflow-hidden">
		{#if picture}
			<picture>
				{#each Object.entries(picture.sources) as [format, srcset]}
					<source {srcset} sizes="100vw" type="image/{format}" />
				{/each}
				<img
					src={picture.img.src}
					width={picture.img.w}
					height={picture.img.h}
					sizes="100vw"
					loading="eager"
					decoding="async"
					fetchpriority="high"
					class="h-full w-full object-cover object-center"
					style="view-transition-name: hero-image;"
					alt="Hero background"
				/>
			</picture>
		{/if}
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
						class="bg-transparent text-white hover:bg-white/75 hover:text-black dark:border-white/75 dark:brightness-[92%]"
						href={heroSecondaryButtonPath}>{heroSecondaryButtonText}</Button
					>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	@media (prefers-reduced-motion: no-preference) {
		::view-transition-group(hero-image) {
			animation-duration: 0s;
		}

		::view-transition-old(hero-image) {
			animation: hero-fade-out 250ms ease-out both;
		}

		::view-transition-new(hero-image) {
			animation: hero-fade-in 200ms ease-in 50ms both;
		}

		::view-transition-group(hero-content) {
			animation-duration: 0s;
		}

		::view-transition-old(hero-content) {
			animation: hero-fade-out 150ms ease-out both;
		}

		::view-transition-new(hero-content) {
			animation: hero-fade-in 150ms ease-in both;
		}
	}

	@keyframes hero-fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes hero-fade-in {
		from {
			opacity: 0;
		}
	}
</style>

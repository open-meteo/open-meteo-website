<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

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
</script>

<svelte:head>
	<link rel="preload" fetchpriority="high" as="image" href={heroImage} type="image/webp" />
</svelte:head>

<div style="height: {heroHeight}px;" class="relative flex items-center">
	<div class="absolute inset-0 -z-10">
		<div
			class="h-full w-full"
			style="
			  view-transition-name: hero-image;
			  background-image: url('{heroImage}');
			  background-size: cover;
			  background-position: center;
			"
		></div>
	</div>
	<div
		style="view-transition-name: hero-content"
		class="container flex h-full flex-col items-center justify-center gap-6 text-white"
	>
		<Logo width="96" height="96" shadow={true} />
		<h1
			class="text-center text-3xl font-light [text-shadow:_3px_3px_2px_rgba(0,0,0,.7)] md:text-5xl"
		>
			{heroTitle}
		</h1>
		<div class="flex flex-col items-center justify-center gap-6 md:w-1/2">
			{#if heroDescription}
				<p
					class="text-center min-h-16 text-xl font-light [text-shadow:_3px_3px_2px_rgba(0,0,0,.7)] md:text-2xl"
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
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		::view-transition-group(hero-image) {
			animation: none;
		}

		::view-transition-old(hero-image) {
			animation: fade-out 600ms ease both;
		}

		::view-transition-new(hero-image) {
			animation: fade-in 500ms ease both;
		}

		::view-transition-group(hero-content) {
			animation: none;
		}

		::view-transition-old(hero-content) {
			animation: fade-out 0ms ease both;
		}

		::view-transition-new(hero-content) {
			animation: fade-in 0ms ease both;
		}
	}
</style>

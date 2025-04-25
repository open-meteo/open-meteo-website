<script lang="ts">
	import { mode } from 'mode-watcher';

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

<!-- max-h-[300px] min-h-[300px] max-h-[400px] min-h-[400px] max-h-[500px] min-h-[500px] max-h-[600px] min-h-[600px] -->
<div class="max-h-[{heroHeight}px] min-h-[{heroHeight}px] relative flex items-center duration-200">
	<div
		class="absolute -z-10 h-full w-full duration-200"
		style="
          background-image: url('{heroImage}');
          background-size: cover;
          background-position: center;
          height: {heroHeight}px;
		  {mode.current === 'dark' ? 'opacity: 0.6;' : ''}
        "
	></div>
	<div class="container flex h-full flex-col items-center justify-center gap-6 text-white">
		<Logo width="96" height="96" shadow={true} />
		<h1
			class="text-center text-3xl font-light [text-shadow:_3px_3px_2px_rgba(0,0,0,.7)] md:text-5xl"
		>
			{heroTitle}
		</h1>
		<div class="flex flex-col items-center justify-center gap-6 md:w-1/2">
			{#if heroDescription}
				<p
					class="text-center text-xl font-light [text-shadow:_3px_3px_2px_rgba(0,0,0,.7)] md:text-2xl"
				>
					{heroDescription}
				</p>
			{/if}
			{#if heroPrimaryButtonText}
				<div class="mt-2 flex gap-4">
					<Button
						variant="default"
						href={heroPrimaryButtonPath}
						class="bg-linear-to-t dark:bg-linear-to-b bg-primary from-transparent to-[rgba(255,255,255,0.2)] dark:to-[rgba(0,0,0,0.2)]"
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

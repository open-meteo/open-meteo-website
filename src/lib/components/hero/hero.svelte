<script lang="ts">
	import { mode } from 'mode-watcher';

	import Button from '$lib/components/ui/button/button.svelte';

	import Logo from '$lib/assets/icons/sun.svelte';

	interface Props {
		heroImage: string;
		heroTitle: string;
		heroHeight: number;
		heroDescription: string;
		heroPrimaryButtonPath: string;
		heroPrimaryButtonText: string;
		heroSecondaryButtonPath: string;
		heroSecondaryButtonText: string;
		children?: import('svelte').Snippet;
	}

	let {
		heroImage,
		heroHeight,
		heroTitle,
		heroDescription,
		heroPrimaryButtonPath,
		heroPrimaryButtonText,
		heroSecondaryButtonPath,
		heroSecondaryButtonText,
		children
	}: Props = $props();
</script>

<!-- max-h-[400px] min-h-[400px] max-h-[500px] min-h-[500px] max-h-[600px] min-h-[600px] -->
<div class=" max-h-[{heroHeight}px] min-h-[{heroHeight}px] flex items-center">
	<div
		class="absolute top-[72px] -z-10 h-full w-full duration-200"
		style="
          background-image: url('{heroImage}');
          background-size: cover;
          background-position: center;
          height: {heroHeight}px;
		  {$mode === 'dark' ? 'opacity: 0.75;' : ''}
        "
	></div>
	<div class="container flex h-full flex-col items-center justify-center gap-6 text-white">
		<Logo width="96" height="96" shadow={true} />
		<h1 class="text-shadow text-3xl font-light shadow-[rgba(0,0,0,0.7)] md:text-5xl">
			{heroTitle}
		</h1>
		<div class="flex flex-col items-center justify-center gap-6 md:w-1/2">
			<p class="text-shadow text-center text-lg font-light shadow-[rgba(0,0,0,0.7)]">
				{heroDescription}
			</p>
			<div class="mt-2 flex gap-4">
				{#if heroPrimaryButtonText}
					<Button variant="default" href={heroPrimaryButtonPath}>{heroPrimaryButtonText}</Button>
				{/if}
				{#if heroSecondaryButtonText}
					<Button variant="outline-white" href={heroSecondaryButtonPath}
						>{heroSecondaryButtonText}</Button
					>
				{/if}
			</div>
		</div>
	</div>
</div>

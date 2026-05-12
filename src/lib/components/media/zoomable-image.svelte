<script lang="ts" module>
	let imageSequence = 0;
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import XIcon from '@lucide/svelte/icons/x';

	import * as Dialog from '$lib/components/ui/dialog';
	import { cn } from '$lib/utils/ui.js';
	import { getZoomableImageGalleryContext } from './zoomable-image-gallery-context.js';

	import type { Snippet } from 'svelte';

	interface Props {
		src: string;
		alt: string;
		description?: string;
		class?: string;
		figureClass?: string;
		dialogImageClass?: string;
		captionClass?: string;
		hint?: string;
		width?: number | string;
		height?: number | string;
		children?: Snippet;
		caption?: Snippet;
	}

	let {
		src,
		alt,
		description = alt,
		class: className,
		figureClass,
		dialogImageClass,
		captionClass,
		hint = 'Click to enlarge',
		width,
		height,
		children,
		caption
	}: Props = $props();

	const gallery = getZoomableImageGalleryContext();
	const imageId = `zoomable-image-${++imageSequence}`;

	$effect(() => {
		if (!gallery) {
			return;
		}

		return untrack(() =>
			gallery.registerImage({
				id: imageId,
				src,
				alt,
				description,
				dialogImageClass
			})
		);
	});
</script>

{#snippet preview()}
	{#if children}
		{@render children()}
	{:else}
		<img
			{src}
			{alt}
			{width}
			{height}
			loading="lazy"
			decoding="async"
			class={cn('block max-w-full rounded-lg', className)}
		/>
	{/if}
	<span
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-3 bottom-3 inline-flex w-fit max-w-[calc(100%-1.5rem)] rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
	>
		{hint}
	</span>
{/snippet}

{#if gallery}
	<figure class={cn('group', figureClass)}>
		<button
			type="button"
			aria-label={`Open full size image: ${alt}`}
			title={hint}
			onclick={() => gallery.openImage(imageId)}
			class="ring-offset-background focus-visible:ring-ring relative block w-full cursor-zoom-in overflow-hidden rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2"
		>
			{@render preview()}
		</button>

		{#if caption}
			<figcaption class={cn('mt-2 text-sm', captionClass ?? 'text-muted-foreground')}>
				{@render caption()}
			</figcaption>
		{/if}
	</figure>
{:else}
	<Dialog.Root>
		<figure class={cn('group', figureClass)}>
			<Dialog.Trigger
				aria-label={`Open full size image: ${alt}`}
				title={hint}
				class="ring-offset-background focus-visible:ring-ring relative block w-full cursor-zoom-in overflow-hidden rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2"
			>
				{@render preview()}
			</Dialog.Trigger>

			{#if caption}
				<figcaption class={cn('mt-2 text-sm', captionClass ?? 'text-muted-foreground')}>
					{@render caption()}
				</figcaption>
			{/if}
		</figure>

		<Dialog.Content
			aria-label={alt}
			showCloseButton={false}
			class="w-auto max-w-[96vw] gap-0 border-none bg-transparent p-0 shadow-none sm:max-w-[96vw] xl:max-w-2xl"
		>
			<div class="relative">
				<Dialog.Close
					class="focus-visible:ring-ring absolute top-3 right-3 z-10 inline-flex cursor-pointer items-center justify-center rounded-full bg-black/70 p-2 text-white transition hover:bg-black/85 focus-visible:outline-hidden focus-visible:ring-2"
					aria-label="Close image viewer"
				>
					<XIcon class="size-5" />
				</Dialog.Close>

				<img
					{src}
					{alt}
					loading="eager"
					decoding="async"
					class={cn(
						'block max-h-[88vh] w-auto max-w-[96vw] rounded-lg object-contain',
						dialogImageClass
					)}
				/>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
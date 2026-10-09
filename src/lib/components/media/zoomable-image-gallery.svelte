<script lang="ts">
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import XIcon from '@lucide/svelte/icons/x';

	import { cn } from '#lib/utils/ui.js';

	import * as Dialog from '#lib/components/ui/dialog/index.js';

	import { pinchZoom, zoomedSizes } from '#lib/actions/pinch-zoom.js';

	import {
		type ZoomableGalleryImage,
		setZoomableImageGalleryContext
	} from './zoomable-image-gallery-context.js';

	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: className,
		children,
		label = 'Image gallery',
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		label?: string;
	} = $props();

	let images = $state<ZoomableGalleryImage[]>([]);
	// Pinch-zoom level of the enlarged view, in half steps so `sizes` (and with it
	// the srcset candidate) only changes once the zoom has moved noticeably.
	let zoomScale = $state(1);
	let activeImageId = $state<string | null>(null);
	let open = $state(false);

	const registerImage = (image: ZoomableGalleryImage) => {
		const existingIndex = images.findIndex((item) => item.id === image.id);
		const existingImage = existingIndex === -1 ? null : images[existingIndex];

		if (existingIndex === -1) {
			images = [...images, image];
		} else if (
			existingImage?.src !== image.src ||
			existingImage.srcset !== image.srcset ||
			existingImage.alt !== image.alt ||
			existingImage.description !== image.description ||
			existingImage.dialogImageClass !== image.dialogImageClass
		) {
			const nextImages = [...images];
			nextImages[existingIndex] = image;
			images = nextImages;
		}

		return () => {
			images = images.filter((item) => item.id !== image.id);

			if (activeImageId === image.id) {
				activeImageId = null;
				open = false;
			}
		};
	};

	const openImage = (id: string) => {
		activeImageId = id;
		open = true;
	};

	const activeIndex = $derived.by(() => images.findIndex((item) => item.id === activeImageId));
	const activeImage = $derived.by(() => (activeIndex >= 0 ? images[activeIndex] : null));
	const hasPreviousImage = $derived(activeIndex > 0);
	const hasNextImage = $derived.by(() => activeIndex >= 0 && activeIndex < images.length - 1);

	const goToRelativeImage = (offset: number) => {
		if (activeIndex < 0) {
			return;
		}

		const nextIndex = activeIndex + offset;
		if (nextIndex < 0 || nextIndex >= images.length) {
			return;
		}

		activeImageId = images[nextIndex].id;
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			goToRelativeImage(-1);
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			goToRelativeImage(1);
		}
	};

	$effect(() => {
		if (!open) {
			activeImageId = null;
			return;
		}

		if (activeImageId === null || activeIndex === -1) {
			open = false;
		}
	});

	setZoomableImageGalleryContext({
		openImage,
		registerImage
	});
</script>

<div class={cn(className)} {...restProps}>
	{@render children?.()}
</div>

<Dialog.Root bind:open>
	<Dialog.Content
		aria-label={activeImage?.alt ?? label}
		showCloseButton={false}
		class="w-auto max-w-[96vw] gap-0 border-none bg-transparent p-0 shadow-none sm:max-w-[96vw]"
		onkeydown={handleKeydown}
	>
		{#if activeImage}
			<Dialog.Title class="sr-only">{activeImage.alt}</Dialog.Title>

			<!-- the zoomed image is viewed through this frame, so it never spills over
			     the chrome sitting on the frame's corners -->
			<div class="relative overflow-hidden rounded-lg">
				{#if images.length > 1}
					<div
						aria-hidden="true"
						class="absolute top-3 left-3 z-10 rounded-full bg-black/65 px-3 py-1 text-sm font-medium text-white"
					>
						{activeIndex + 1} / {images.length}
					</div>
				{/if}

				<Dialog.Close
					class="focus-visible:ring-ring absolute top-3 right-3 z-10 inline-flex cursor-pointer items-center justify-center rounded-full bg-black/70 p-2 text-white transition hover:bg-black/85 focus-visible:outline-hidden focus-visible:ring-2"
					aria-label="Close image viewer"
				>
					<XIcon class="size-5" />
				</Dialog.Close>

				{#if images.length > 1}
					<button
						type="button"
						onclick={() => goToRelativeImage(-1)}
						disabled={!hasPreviousImage}
						class="focus-visible:ring-ring absolute top-1/2 left-3 z-10 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/70 p-3 text-white transition hover:bg-black/85 focus-visible:outline-hidden focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
						aria-label="View previous image"
					>
						<ChevronLeftIcon class="size-6" />
					</button>

					<button
						type="button"
						onclick={() => goToRelativeImage(1)}
						disabled={!hasNextImage}
						class="focus-visible:ring-ring absolute top-1/2 right-3 z-10 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/70 p-3 text-white transition hover:bg-black/85 focus-visible:outline-hidden focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
						aria-label="View next image"
					>
						<ChevronRightIcon class="size-6" />
					</button>
				{/if}

				<div class="absolute inset-x-3 bottom-3 z-10 flex justify-center">
					<span
						aria-hidden="true"
						class="max-w-[min(42rem,calc(100%-1.5rem))] rounded-full bg-black/70 px-3 py-1 text-center text-sm font-medium text-white"
					>
						{activeImage.description}
					</span>
				</div>

				<div
					use:pinchZoom={{
						key: activeImage.id,
						onchange: (scale) => (zoomScale = Math.ceil(scale * 2) / 2)
					}}
				>
					<img
						src={activeImage.src}
						srcset={activeImage.srcset}
						sizes={zoomedSizes(activeImage.dialogSizes, zoomScale)}
						alt={activeImage.alt}
						loading="eager"
						decoding="async"
						draggable="false"
						class={cn(
							'block max-h-[88vh] w-auto max-w-[96vw] rounded-lg object-contain dark:hidden',
							activeImage.dialogImageClass
						)}
					/>
					<img
						src={activeImage.darkSrc}
						srcset={activeImage.darkSrcset}
						sizes={zoomedSizes(activeImage.dialogSizes, zoomScale)}
						alt={activeImage.alt}
						loading="eager"
						decoding="async"
						draggable="false"
						class={cn(
							'hidden max-h-[88vh] w-auto max-w-[96vw] rounded-lg object-contain dark:block',
							activeImage.dialogImageClass
						)}
					/>
				</div>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>

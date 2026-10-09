import { getContext, setContext } from 'svelte';

export interface ZoomableGalleryImage {
	id: string;
	src: string;
	darkSrc: string;
	/** Source sets of the two variants, when the image comes in several sizes. */
	srcset?: string;
	darkSrcset?: string;
	/** `sizes` for the enlarged view, when the image comes in several sizes. */
	dialogSizes?: string;
	alt: string;
	description: string;
	dialogImageClass?: string;
}

export interface ZoomableImageGalleryContext {
	openImage: (id: string) => void;
	registerImage: (image: ZoomableGalleryImage) => () => void;
}

const zoomableImageGalleryContextKey = Symbol('zoomable-image-gallery');

export function setZoomableImageGalleryContext(context: ZoomableImageGalleryContext) {
	setContext(zoomableImageGalleryContextKey, context);
}

export function getZoomableImageGalleryContext() {
	return getContext<ZoomableImageGalleryContext | undefined>(zoomableImageGalleryContextKey);
}

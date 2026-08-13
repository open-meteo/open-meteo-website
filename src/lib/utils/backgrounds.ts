import { BACKGROUND_VARIANTS } from '$lib/assets/background-variants';

/** The `src` a browser without srcset support (or with an unparsed set) falls
 *  back to. Big enough to look right on a laptop, small enough not to hurt. */
const FALLBACK_WIDTH = 1280;

const DIRECTORY = '/images/backgrounds/';

export interface ResponsiveBackground {
	src: string;
	/** Undefined when the background has no high-resolution master. */
	srcset?: string;
	width?: number;
	height?: number;
}

/**
 * Turn a background path from page data into the attributes for a responsive
 * `<img>`. Backgrounds with a high-resolution master (see
 * scripts/backgrounds.mjs) resolve to their generated width ladder; every other
 * one passes straight through as a single-size image, so a page can reference
 * any file in the directory without needing an entry here.
 */
export const responsiveBackground = (path: string): ResponsiveBackground => {
	const variants = path.startsWith(DIRECTORY)
		? BACKGROUND_VARIANTS[path.slice(DIRECTORY.length)]
		: undefined;
	if (!variants) return { src: path };

	const base = path.replace(/\.webp$/, '');
	const fallback = variants.widths.includes(FALLBACK_WIDTH)
		? FALLBACK_WIDTH
		: variants.widths[variants.widths.length - 1];
	return {
		src: `${base}-${fallback}.webp`,
		srcset: variants.widths.map((width) => `${base}-${width}.webp ${width}w`).join(', '),
		width: variants.width,
		height: variants.height
	};
};

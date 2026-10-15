/**
 * Svelte action for zooming the enlarged image view: a two-finger pinch scales
 * around the fingers' midpoint, the scroll wheel (or a trackpad pinch, which
 * browsers report as ctrl+wheel) zooms about the pointer, one finger (or the
 * mouse) pans while zoomed in, and a double tap or double click toggles between
 * fit and a close-up.
 * The element gets `touch-action: none` so the browser hands every touch to the
 * action instead of scrolling or page-zooming the dialog.
 *
 * Only a CSS transform is applied, so the element keeps its layout box and the
 * dialog chrome around it stays put. `onchange` reports the scale, which lets
 * the caller raise the image's `sizes` so `srcset` fetches a sharper candidate.
 */
export interface PinchZoomOptions {
	/** Largest scale factor (default 4, the largest source-set step). */
	maxScale?: number;
	/** Called whenever the scale changes; 1 means the image fits its box again. */
	onchange?: (scale: number) => void;
	/** Reset to fit whenever this changes (e.g. the gallery moves to another image). */
	key?: unknown;
}

const DOUBLE_TAP_SCALE = 2.5;
// Scale change per mouse wheel notch, which Chrome reports as 100 px; trackpads
// send far smaller deltas per event and so zoom smoothly through the same curve.
const WHEEL_NOTCH_PX = 100;
const WHEEL_NOTCH_FACTOR = 1.3;

export function pinchZoom(node: HTMLElement, options: PinchZoomOptions = {}) {
	let { maxScale = 4, onchange, key } = options;

	const pointers = new Map<number, { x: number; y: number }>();
	let scale = 1;
	let tx = 0;
	let ty = 0;
	let reported = 1;
	// The state when the current pinch or pan started, plus the fingers' midpoint
	// (or the single finger) at that moment.
	let gesture: {
		scale: number;
		tx: number;
		ty: number;
		distance: number;
		mid: { x: number; y: number };
	} | null = null;

	node.style.touchAction = 'none';
	node.style.transformOrigin = 'center';
	node.style.userSelect = 'none';

	const clamp = (value: number, limit: number) => Math.min(limit, Math.max(-limit, value));

	// Scaling about the centre and translating keeps centre + translation at the
	// current centre, so the untransformed box's centre is the current one minus
	// the translation.
	const restCenter = () => {
		const r = node.getBoundingClientRect();
		return { x: r.left + r.width / 2 - tx, y: r.top + r.height / 2 - ty };
	};

	const apply = () => {
		if (scale === 1) {
			tx = 0;
			ty = 0;
		} else {
			// Pan no further than bringing the image's far edge to the box edge.
			const r = node.getBoundingClientRect();
			tx = clamp(tx, ((r.width / scale) * (scale - 1)) / 2);
			ty = clamp(ty, ((r.height / scale) * (scale - 1)) / 2);
		}
		node.style.transform = scale === 1 ? '' : `translate(${tx}px, ${ty}px) scale(${scale})`;
		node.style.cursor = scale > 1 ? 'grab' : '';
		if (reported !== scale) {
			reported = scale;
			onchange?.(scale);
		}
	};

	// Change the scale so the content under `at` (viewport coordinates, as seen
	// with the `from` state) ends up under `to`.
	const zoom = (
		next: number,
		from: { scale: number; tx: number; ty: number },
		at: { x: number; y: number },
		to = at
	) => {
		const c = restCenter();
		next = Math.min(maxScale, Math.max(1, next));
		const px = (at.x - c.x - from.tx) / from.scale;
		const py = (at.y - c.y - from.ty) / from.scale;
		scale = next;
		tx = to.x - c.x - px * next;
		ty = to.y - c.y - py * next;
		apply();
	};

	const reset = () => {
		scale = 1;
		apply();
	};

	const points = () => [...pointers.values()];
	const midpoint = () => {
		const [a, b] = points();
		return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
	};
	const distance = () => {
		const [a, b] = points();
		return Math.hypot(a.x - b.x, a.y - b.y);
	};

	const startGesture = () => {
		const pinching = pointers.size >= 2;
		gesture = {
			scale,
			tx,
			ty,
			distance: pinching ? distance() : 0,
			mid: pinching ? midpoint() : points()[0]
		};
	};

	const onPointerDown = (event: PointerEvent) => {
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		try {
			node.setPointerCapture(event.pointerId);
		} catch {
			/* synthetic events have no capturable pointer */
		}
		pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
		if (pointers.size <= 2) startGesture();
	};

	const onPointerMove = (event: PointerEvent) => {
		if (!gesture || !pointers.has(event.pointerId)) return;
		pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
		if (pointers.size >= 2) {
			zoom(gesture.scale * (distance() / gesture.distance), gesture, gesture.mid, midpoint());
		} else if (scale > 1) {
			const p = points()[0];
			tx = gesture.tx + (p.x - gesture.mid.x);
			ty = gesture.ty + (p.y - gesture.mid.y);
			apply();
		}
	};

	const onPointerUp = (event: PointerEvent) => {
		if (!pointers.delete(event.pointerId)) return;
		if (pointers.size > 0) startGesture();
		else gesture = null;
	};

	const onDoubleClick = (event: MouseEvent) => {
		if (scale > 1) reset();
		else zoom(DOUBLE_TAP_SCALE, { scale, tx, ty }, { x: event.clientX, y: event.clientY });
	};

	// Wheel travel in pixels. The line and page delta modes only come from older
	// browsers, where a mouse wheel notch is three lines.
	const wheelPixels = (event: WheelEvent) => {
		if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return (event.deltaY * WHEEL_NOTCH_PX) / 3;
		if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * WHEEL_NOTCH_PX * 3;
		return event.deltaY;
	};

	const onWheel = (event: WheelEvent) => {
		// Consumed even at the scale limits, so a trackpad pinch never zooms the page.
		event.preventDefault();
		zoom(
			scale * WHEEL_NOTCH_FACTOR ** (-wheelPixels(event) / WHEEL_NOTCH_PX),
			{ scale, tx, ty },
			{ x: event.clientX, y: event.clientY }
		);
	};

	node.addEventListener('pointerdown', onPointerDown);
	node.addEventListener('pointermove', onPointerMove);
	node.addEventListener('pointerup', onPointerUp);
	node.addEventListener('pointercancel', onPointerUp);
	node.addEventListener('dblclick', onDoubleClick);
	node.addEventListener('wheel', onWheel, { passive: false });

	return {
		update(next: PinchZoomOptions = {}) {
			maxScale = next.maxScale ?? 4;
			onchange = next.onchange;
			if (next.key !== key) {
				key = next.key;
				pointers.clear();
				gesture = null;
				reset();
			}
		},
		destroy() {
			node.removeEventListener('pointerdown', onPointerDown);
			node.removeEventListener('pointermove', onPointerMove);
			node.removeEventListener('pointerup', onPointerUp);
			node.removeEventListener('pointercancel', onPointerUp);
			node.removeEventListener('dblclick', onDoubleClick);
			node.removeEventListener('wheel', onWheel);
		}
	};
}

/**
 * `sizes` for an image shown `scale` times larger than its layout box, so the
 * browser may pick a sharper `srcset` candidate once the user zooms in.
 */
export const zoomedSizes = (sizes: string | undefined, scale: number) =>
	sizes && scale > 1 ? `calc(${sizes} * ${scale})` : sizes;

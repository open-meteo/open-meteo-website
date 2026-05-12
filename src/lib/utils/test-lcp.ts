const LCP_SUB_PARTS = [
	'Time to first byte',
	'Resource load delay',
	'Resource load duration',
	'Element render delay'
];

new PerformanceObserver((list) => {
	const lcpEntry = list.getEntries().at(-1) as
		| (PerformanceEntry & { url?: string; element?: Element })
		| undefined;
	const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
	const lcpResEntry = performance
		.getEntriesByType('resource')
		.filter((e) => e.name === lcpEntry?.url)[0] as PerformanceResourceTiming | undefined;

	if (!lcpEntry) return;

	// Ignore LCP entries that aren't images to reduce DevTools noise.
	// Comment this line out if you want to include text entries.
	if (!lcpEntry.url) return;

	// Compute the start and end times of each LCP sub-part.
	// WARNING! If your LCP resource is loaded cross-origin, make sure to add
	// the `Timing-Allow-Origin` (TAO) header to get the most accurate results.
	const ttfb = navEntry.responseStart;
	const lcpRequestStart = Math.max(
		ttfb,
		// Prefer `requestStart` (if TOA is set), otherwise use `startTime`.
		lcpResEntry ? lcpResEntry.requestStart || lcpResEntry.startTime : 0
	);
	const lcpResponseEnd = Math.max(lcpRequestStart, lcpResEntry ? lcpResEntry.responseEnd : 0);
	const lcpRenderTime = Math.max(
		lcpResponseEnd,
		// Use LCP startTime (the final LCP time) because there are sometimes
		// slight differences between loadTime/renderTime and startTime
		// due to rounding precision.
		lcpEntry ? lcpEntry.startTime : 0
	);

	// Clear previous measures before making new ones.
	// Note: due to a bug, this doesn't work in Chrome DevTools.
	LCP_SUB_PARTS.forEach((part) => performance.clearMeasures(part));

	// Create measures for each LCP sub-part for easier
	// visualization in the Chrome DevTools Performance panel.
	const lcpSubPartMeasures = [
		performance.measure(LCP_SUB_PARTS[0], {
			start: 0,
			end: ttfb
		}),
		performance.measure(LCP_SUB_PARTS[1], {
			start: ttfb,
			end: lcpRequestStart
		}),
		performance.measure(LCP_SUB_PARTS[2], {
			start: lcpRequestStart,
			end: lcpResponseEnd
		}),
		performance.measure(LCP_SUB_PARTS[3], {
			start: lcpResponseEnd,
			end: lcpRenderTime
		})
	];

	// Log helpful debug information to the console.
	console.log('LCP value: ', lcpRenderTime);
	console.log('LCP element: ', lcpEntry.element, lcpEntry.url);
	console.table(
		lcpSubPartMeasures.map((measure) => ({
			'LCP sub-part': measure.name,
			'Time (ms)': measure.duration,
			'% of LCP': `${Math.round((1000 * measure.duration) / lcpRenderTime) / 10}%`
		}))
	);
}).observe({ type: 'largest-contentful-paint', buffered: true });

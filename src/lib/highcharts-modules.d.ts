// Ambient module declarations for Highcharts ES module internals.
// These are imported directly in highcharts-custom.ts for tree-shaking.
declare module 'highcharts/es-modules/*' {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const _: any;
	export = _;
}

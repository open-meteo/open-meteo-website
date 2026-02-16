// Ambient module declarations for Highcharts ES module internals.
// These are imported directly in highcharts-custom.ts for tree-shaking.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module 'highcharts/es-modules/*' {
	const value: any;
	export default value;
}

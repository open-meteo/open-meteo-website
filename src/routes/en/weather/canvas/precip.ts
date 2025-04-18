export default (
	ctx: CanvasRenderingContext2D | null | undefined,
	config: ConfigInterface,
	series: Float32Array | null | undefined,
	canvasElement: HTMLCanvasElement | null
): void => {
	if (ctx && series) {
		for (const [index, value] of series.entries()) {
			ctx.beginPath();
			ctx.moveTo(index * config.deltaX + 0.5 * config.deltaX, config.maxY);

			ctx.strokeStyle = `hsla(${getComputedStyle(canvasElement).getPropertyValue('--primary').split(' ').join(',')}, 1)`;
			ctx.lineWidth = 12;

			ctx.lineTo(index * config.deltaX + 0.5 * config.deltaX, config.maxY - value ** 0.55 * 45);
			ctx.stroke();
			ctx.closePath();
		}
	}
};

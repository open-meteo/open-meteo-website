export default (
	ctx: CanvasRenderingContext2D | null | undefined,
	config: ConfigInterface,
	series: Date[]
): void => {
	if (ctx) {
		for (const [index, value] of series.entries()) {
			if (value.getHours() > 6 && value.getHours() < 21) {
				ctx.beginPath();
				ctx.moveTo(index * config.deltaX, config.maxY);
				ctx.lineTo(index * config.deltaX, 0);
				ctx.lineTo((index + 1) * config.deltaX, 0);
				ctx.lineTo((index + 1) * config.deltaX, config.maxY);
				ctx.closePath();
				ctx.fillStyle = '#f4ff0014';
				ctx.fill();
			}
		}
	}
};

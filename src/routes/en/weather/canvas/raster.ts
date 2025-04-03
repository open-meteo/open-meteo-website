export default (
	ctx: CanvasRenderingContext2D | null | undefined,
	config: ConfigInterface,
	series: Date[],
	today: Date,
	canvasElement: HTMLCanvasElement | null
): void => {
	if (ctx && series) {
		for (const [index, _] of series.entries()) {
			ctx.beginPath();
			ctx.moveTo(index * config.deltaX, 0);
			ctx.lineTo(index * config.deltaX, config.maxY);
			if (series[index].getHours() === 0) {
				ctx.strokeStyle = `hsla(${getComputedStyle(canvasElement).getPropertyValue('--border').split(' ').join(',')}, 1)`;
				ctx.lineWidth = 3;
			} else if (
				series[index].getDate() === today.getDate() &&
				series[index].getHours() === today.getHours()
			) {
				// fill now line
				// TODO: update this line every minute
				ctx.stroke();
				ctx.closePath();
				ctx.beginPath();
				ctx.strokeStyle = 'red';
				ctx.lineWidth = 5;
				let minutes = today.getMinutes();
				ctx.moveTo(index * config.deltaX + (config.deltaX / 60) * minutes, 0);
				ctx.lineTo(index * config.deltaX + (config.deltaX / 60) * minutes, config.maxY);
				ctx.stroke();
				ctx.closePath();
				ctx.strokeStyle = `hsla(${getComputedStyle(canvasElement).getPropertyValue('--border').split(' ').join(',')}, 0.75)`;
				ctx.lineWidth = 1;
			} else {
				ctx.strokeStyle = `hsla(${getComputedStyle(canvasElement).getPropertyValue('--border').split(' ').join(',')}, 0.75)`;
				ctx.lineWidth = 1;
			}
			ctx.stroke();
			ctx.closePath();
		}
	}
};

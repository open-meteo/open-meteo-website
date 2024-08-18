export default (
	ctx: CanvasRenderingContext2D | null | undefined,
	config: ConfigInterface,
	series: Float32Array | null | undefined,
	canvasElement: HTMLCanvasElement
): void => {
	if (ctx && series) {
		ctx.beginPath();
		ctx.moveTo(0, 35 + (series[0] ** 1.5 / 1000) * 30);
		for (const [index, value] of series.entries()) {
			ctx.strokeStyle = '#444';
			ctx.lineWidth = 0.1;
			let nextValue = series[index + 1];

			let xc =
				(index * config.deltaX +
					0.5 * config.deltaX +
					(index * config.deltaX + 1.5 * config.deltaX)) /
				2;
			let yc = (35 + (value ** 1.5 / 1000) * 30 + 35 + (nextValue ** 1.5 / 1000) * 30) / 2;

			ctx.quadraticCurveTo(
				index * config.deltaX + 0.5 * config.deltaX,
				35 + (value ** 1.5 / 1000) * 30,
				xc,
				yc
			);
		}

		ctx.quadraticCurveTo(
			config.maxX,
			35 + (series[series.length - 1] ** 1.5 / 1000) * 30,
			config.maxX,
			35 + (series[series.length - 1] ** 1.5 / 1000) * 30
		);
		ctx.quadraticCurveTo(
			config.maxX,
			35 - (series[series.length - 1] ** 1.5 / 1000) * 30,
			config.maxX,
			35 - (series[series.length - 1] ** 1.5 / 1000) * 30
		);

		// same series but reversed
		for (const [ind, v] of series.entries()) {
			let index = series.length - 1 - ind;
			let value = series[index];
			let nextValue = series[index - 1];

			ctx.strokeStyle = '#444';
			ctx.lineWidth = 0.1;

			let xc =
				(index * config.deltaX +
					0.5 * config.deltaX +
					(index * config.deltaX - 0.5 * config.deltaX)) /
				2;
			let yc = (35 - (value ** 2 / 10000) * 30 + (35 - (nextValue ** 2 / 10000) * 30)) / 2;

			ctx.quadraticCurveTo(
				index * config.deltaX + 0.5 * config.deltaX,
				35 - (value ** 2 / 10000) * 30,
				xc,
				yc
			);
		}
		ctx.quadraticCurveTo(
			0.5 * config.deltaX,
			35 - (series[0] ** 1.5 / 1000) * 30,
			0,
			35 - (series[0] ** 1.5 / 1000) * 30
		);

		ctx.closePath();
		//to fill the space in the shape
		ctx.fillStyle =
			getComputedStyle(canvasElement).getPropertyValue('--bs-dark-border-subtle') + '66';
		ctx.fill();
	}
};

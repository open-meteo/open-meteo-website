import rgbToHex from '../utils/rgb-to-hex';
import colorScale from '../utils/color-scale';

export default (
	ctx: CanvasRenderingContext2D | null | undefined,
	config: ConfigInterface,
	series: Float32Array | null | undefined
): void => {
	if (ctx && series) {
		const tempGradientFill = ctx.createLinearGradient(0, 0, 0, config.maxY);
		tempGradientFill.addColorStop(
			0,
			'#' + rgbToHex(colorScale[Number(config.maxTemp.toFixed(0))]) + '5c'
		);
		tempGradientFill.addColorStop(
			0.25,
			'#' + rgbToHex(colorScale[Number(config.maxTemp.toFixed(0))]) + '5c'
		);
		tempGradientFill.addColorStop(
			0.85,
			'#' + rgbToHex(colorScale[Number(config.minTemp.toFixed(0))]) + '06'
		);
		tempGradientFill.addColorStop(
			1,
			'#' + rgbToHex(colorScale[Number(config.minTemp.toFixed(0))]) + '00'
		);

		ctx.beginPath();
		ctx.moveTo(
			0,
			0.25 * config.maxY + ((config.maxTemp - series[0]) / config.diffTemp) * 0.55 * config.maxY
		);
		for (const [index, value] of series?.filter((t) => !isNaN(t)).entries()) {
			let indexDiffTemp = config.maxTemp - value;
			let indexDiffTempNext = config.maxTemp - series[index + 1];

			ctx.strokeStyle = '#d3d3d3';
			ctx.lineWidth = 4;

			let xc =
				(index * config.deltaX +
					0.5 * config.deltaX +
					(index * config.deltaX + 1.5 * config.deltaX)) /
				2;
			let yc =
				(0.25 * config.maxY +
					(indexDiffTemp / config.diffTemp) * 0.55 * config.maxY +
					(0.25 * config.maxY + (indexDiffTempNext / config.diffTemp) * 0.55 * config.maxY)) /
				2;

			ctx.quadraticCurveTo(
				index * config.deltaX + 0.5 * config.deltaX,
				0.25 * config.maxY + (indexDiffTemp / config.diffTemp) * 0.55 * config.maxY,
				xc,
				yc
			);
		}
		ctx.quadraticCurveTo(
			config.maxX,
			0.25 * config.maxY +
				((config.maxTemp - series[series.length - 1]) / config.diffTemp) * 0.55 * config.maxY,
			(config.maxX + config.maxX + config.deltaX) / 2,
			0.25 * config.maxY +
				((config.maxTemp - series[series.length - 1]) / config.diffTemp) * 0.55 * config.maxY
		);
		ctx.lineTo(config.maxX, config.maxY);
		ctx.lineTo(0, config.maxY);
		ctx.closePath();
		ctx.fillStyle = tempGradientFill;
		ctx.fill();
	}
};

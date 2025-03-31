import colorScaleHex from './color-scale-hex';

function componentFromStr(numStr: string, percent: number) {
	let num = Math.max(0, parseInt(numStr, 10));
	return percent ? Math.floor((255 * Math.min(100, num)) / 100) : Math.min(255, num);
}

export function rgbToHex(rgb: string) {
	let rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
	let result,
		r,
		g,
		b,
		hex = '';
	if ((result = rgbRegex.exec(rgb))) {
		r = componentFromStr(result[1], result[2]);
		g = componentFromStr(result[3], result[4]);
		b = componentFromStr(result[5], result[6]);

		hex = (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}
	if (!rgb) {
		return '355522';
	}
	return hex;
}

export const getColor = (temp: number, unit = 'celsius'): string => {
	let index = 0;
	temp = Number(temp);
	if (unit === 'celsius') {
		if (temp <= -40) {
			index = 0;
		} else if (temp >= 60) {
			index = colorScaleHex.length - 1;
		} else {
			index = temp + 40;
		}
	} else {
		let tempInCelsius = Math.round(((temp - 32) * 5) / 9);
		if (tempInCelsius <= -40) {
			index = 0;
		} else if (tempInCelsius >= 60) {
			index = colorScaleHex.length - 1;
		} else {
			index = tempInCelsius + 40;
		}
	}

	return colorScaleHex[index];
};

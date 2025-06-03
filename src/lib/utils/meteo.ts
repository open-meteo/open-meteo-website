/// Generic helper functions

export const pad = (n: string | number) => {
	return ('0' + n).slice(-2);
};

export function debounce(func, timeout = 100) {
	let timer: NodeJS.Timeout;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
}

export const isNumeric = (num: string | number) =>
	(typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) &&
	!isNaN(num as number);

export const altitudeAboveSeaLevelMeters = (pressureLevelHpA: number): string => {
	let altitude = (-1 / 2.25577) * 10e4 * (Math.pow(pressureLevelHpA / 1013.25, 1 / 5.25588) - 1);
	if (altitude <= 500) {
		return `${Math.round(altitude / 10) * 10} m`;
	}
	if (altitude <= 2000) {
		return `${Math.round(altitude / 100) * 100} m`;
	}
	if (altitude <= 20000) {
		return `${Math.round(altitude / 100) / 10} km`;
	}
	return `${Math.round(altitude / 1000)} km`;
};

export const sliceIntoChunks = (arr: Array<T>, chunkSize: number): Array<Array<T>> => {
	const res = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		const chunk = arr.slice(i, i + chunkSize);
		res.push(chunk);
	}
	return res;
};

export const countVariables = (
	variables: { value: string; label: string }[][],
	params: string[] | undefined
) => {
	const flattenedVariables = variables.flat().map((v) => v.value);
	const overlap = params?.filter((p) => flattenedVariables.includes(p));
	return {
		total: flattenedVariables.length,
		active: overlap?.length ?? 0
	};
};

export const countPreviousVariables = (
	variables: { value: string; label: string }[][],
	params: string[]
) => {
	const flattenedVariables = variables.flat().map((v) => v.value);

	let active = 0;
	for (const p of params) {
		for (const fV of flattenedVariables) {
			if (p.startsWith(fV)) {
				active += 1;
			}
		}
	}

	return {
		total: flattenedVariables.length * 8,
		active: active
	};
};

export const countPressureVariables = (
	variables: { value: string; label: string }[],
	levels: number[],
	params: string[]
) => {
	const flattenedVariables = variables.flat().map((v) => v.value);

	let active = 0;
	for (const level of levels) {
		for (const fV of flattenedVariables) {
			if (params.includes(`${fV}_${level}hPa`)) {
				active += 1;
			}
		}
	}

	return {
		total: flattenedVariables.length * levels.length,
		active: active
	};
};

export const countHeightVariables = (
	variables: { value: string; label: string }[],
	levels: number[],
	params: string[]
) => {
	return {
		total: variables.length * levels.length,
		active: variables.reduce(
			(i, variable) =>
				i +
				levels.reduce(
					(i, level) => i + (params.includes(`${variable.value}_${level}m`) ? 1 : 0),
					0
				),
			0
		)
	};
};

export const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export function convertUnit(value: number | null, unit: string): string {
	if (value == null) {
		return '-';
	}
	if (unit == 'mph') {
		return (value * 0.621371).toFixed(1);
	}
	if (unit == 'kn') {
		return (value * 0.539957).toFixed(1);
	}
	if (unit == 'kph') {
		return value.toFixed(1);
	}
	if (unit == 'celsius') {
		return value.toFixed(1);
	}
	if (unit == 'fahrenheit') {
		return ((value * 9) / 5 + 32).toFixed(1);
	}
	return '-';
}

export function getWeatherCode(code: number | null): string {
	if (code == null) {
		return '-';
	}
	switch (code) {
		case 0:
			return 'fair';
		case 1:
			return 'mainly clear';
		case 2:
			return 'partly cloudy';
		case 3:
			return 'overcast';
		case 45:
			return 'fog';
		case 48:
			return 'depositing rime fog';
		case 51:
			return 'light drizzle';
		case 53:
			return 'moderate drizzle';
		case 55:
			return 'dense drizzle';
		case 56:
			return 'light freezing drizzle';
		case 57:
			return 'dense freezing drizzle';
		case 61:
			return 'slight rain';
		case 63:
			return 'moderate rain';
		case 65:
			return 'heavy rain';
		case 66:
			return 'light freezing rain';
		case 67:
			return 'heavy freezing rain';
		case 71:
			return 'slight snow fall';
		case 73:
			return 'moderate snow fall';
		case 75:
			return 'heavy snow fall';
		case 77:
			return 'snow grains';
		case 80:
			return 'slight rain showers';
		case 81:
			return 'moderate rain showers';
		case 82:
			return 'heavy rain showers';
		case 85:
			return 'slight snow showers';
		case 86:
			return 'heavy snow showers';
		case 95:
			return 'slight to moderate thunderstorm';
		case 96:
			return 'thunderstorm with slight hail';
		case 99:
			return 'thunderstorm with heavy hail';
	}
	return 'unknown code';
}

export const geoLocationNameToRoute = (name) => {
	const lowerCase = name.toLowerCase().replaceAll(' ', '-');
	return lowerCase.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const pad = (n: string | number) => {
	if (n === null || n === undefined) {
		return '';
	}
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

// Only considers keys of the first object. Ignores nulls and empty strings
export function objectDifference<T extends Record<string, any>>(a: T, b: T): Partial<T> {
	const diff: Partial<T> = {};
	for (const key in a) {
		if (a[key] && a[key] != '' && a[key] !== b[key]) {
			diff[key] = a[key];
		}
	}
	return diff;
}

/// `temperature_2m` to `Temperature2m`
export const titleCase = (s: string) =>
	s.replace(/^[-_]*(.)/, (_, c) => c.toUpperCase()).replace(/[-_]+(.)/g, (_, c) => c.toUpperCase());

export const camelCase = (s: string) => s.replace(/[-_]+(.)/g, (_, c) => c.toUpperCase());

export const sliceIntoChunks = (arr: Array<T>, chunkSize: number): Array<Array<T>> => {
	const res = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		const chunk = arr.slice(i, i + chunkSize);
		res.push(chunk);
	}
	return res;
};

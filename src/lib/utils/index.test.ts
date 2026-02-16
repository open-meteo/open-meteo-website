import { describe, expect, test, vi } from 'vitest';

import {
	camelCase,
	capitalizeFirstLetter,
	debounce,
	isNumeric,
	objectDifference,
	pad,
	sliceIntoChunks,
	titleCase
} from './';

describe('pad', () => {
	test('pads single digit number', () => {
		expect(pad(1)).toBe('01');
	});

	test('keeps two digit number unchanged', () => {
		expect(pad(10)).toBe('10');
	});

	test('pads single char string', () => {
		expect(pad('7')).toBe('07');
	});

	test('keeps two char string unchanged', () => {
		expect(pad('70')).toBe('70');
	});

	test('takes last two chars on overflow', () => {
		expect(pad('18276')).toBe('76');
	});

	test('returns empty string for null', () => {
		expect(pad(null as unknown as string)).toBe('');
	});

	test('returns empty string for undefined', () => {
		expect(pad(undefined as unknown as string)).toBe('');
	});
});

describe('isNumeric', () => {
	test('returns true for small number', () => {
		expect(isNumeric(5)).toBe(true);
	});

	test('returns true for negative number', () => {
		expect(isNumeric(-55)).toBe(true);
	});

	test('returns true for floating point number', () => {
		expect(isNumeric(5.55)).toBe(true);
	});

	test('returns true for large number', () => {
		expect(isNumeric(23598)).toBe(true);
	});

	test('returns true for scientific notation', () => {
		expect(isNumeric(1e21)).toBe(true);
	});

	test('returns true for numeric string', () => {
		expect(isNumeric('3')).toBe(true);
	});

	test('returns true for larger numeric string', () => {
		expect(isNumeric('153610')).toBe(true);
	});

	test('returns true for zero-prefixed numeric string', () => {
		expect(isNumeric('017')).toBe(true);
	});

	test('returns false for string with letters', () => {
		expect(isNumeric('01n7')).toBe(false);
	});

	test('returns false for alphabetic string', () => {
		expect(isNumeric('hello')).toBe(false);
	});

	test('returns false for null', () => {
		expect(isNumeric(null as unknown as string)).toBe(false);
	});

	test('returns false for undefined', () => {
		expect(isNumeric(undefined as unknown as string)).toBe(false);
	});

	test('returns false for empty string', () => {
		expect(isNumeric('')).toBe(false);
	});

	test('returns false for whitespace-only string', () => {
		expect(isNumeric('   ')).toBe(false);
	});

	test('returns true for zero', () => {
		expect(isNumeric(0)).toBe(true);
	});

	test('returns true for negative numeric string', () => {
		expect(isNumeric('-42')).toBe(true);
	});
});

describe('titleCase', () => {
	test('converts hyphenated name', () => {
		expect(titleCase('variable-name')).toBe('VariableName');
	});

	test('converts underscored name with number suffix', () => {
		expect(titleCase('temperature_2m')).toBe('Temperature2m');
	});

	test('converts multiple underscored segments', () => {
		expect(titleCase('wind_speed_10m')).toBe('WindSpeed10m');
	});

	test('handles single word', () => {
		expect(titleCase('hello')).toBe('Hello');
	});
});

describe('camelCase', () => {
	test('converts hyphenated name', () => {
		expect(camelCase('variable-name')).toBe('variableName');
	});

	test('converts underscored name with number suffix', () => {
		expect(camelCase('temperature_2m')).toBe('temperature2m');
	});

	test('converts multiple underscored segments', () => {
		expect(camelCase('wind_speed_10m')).toBe('windSpeed10m');
	});

	test('leaves single word lowercase', () => {
		expect(camelCase('hello')).toBe('hello');
	});
});

describe('capitalizeFirstLetter', () => {
	test('capitalizes lowercase word', () => {
		expect(capitalizeFirstLetter('hello')).toBe('Hello');
	});

	test('keeps already capitalized word unchanged', () => {
		expect(capitalizeFirstLetter('Hello')).toBe('Hello');
	});

	test('capitalizes single character', () => {
		expect(capitalizeFirstLetter('a')).toBe('A');
	});

	test('handles empty string', () => {
		expect(capitalizeFirstLetter('')).toBe('');
	});

	test('only capitalizes first letter of multi-word string', () => {
		expect(capitalizeFirstLetter('hello world')).toBe('Hello world');
	});
});

describe('debounce', () => {
	test('calls function after timeout', async () => {
		vi.useFakeTimers();
		const fn = vi.fn();
		const debounced = debounce(fn, 200);

		debounced();
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(200);
		expect(fn).toHaveBeenCalledTimes(1);

		vi.useRealTimers();
	});

	test('resets timer on repeated calls', () => {
		vi.useFakeTimers();
		const fn = vi.fn();
		const debounced = debounce(fn, 200);

		debounced();
		vi.advanceTimersByTime(100);
		debounced();
		vi.advanceTimersByTime(100);
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);

		vi.useRealTimers();
	});

	test('passes arguments to the original function', () => {
		vi.useFakeTimers();
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced('a', 'b');
		vi.advanceTimersByTime(100);

		expect(fn).toHaveBeenCalledWith('a', 'b');

		vi.useRealTimers();
	});

	test('uses default timeout of 100ms', () => {
		vi.useFakeTimers();
		const fn = vi.fn();
		const debounced = debounce(fn);

		debounced();
		vi.advanceTimersByTime(99);
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(fn).toHaveBeenCalledTimes(1);

		vi.useRealTimers();
	});
});

describe('sliceIntoChunks', () => {
	test('splits even array into equal chunks', () => {
		expect(sliceIntoChunks([1, 2, 3, 4, 5, 6], 2)).toStrictEqual([
			[1, 2],
			[3, 4],
			[5, 6]
		]);
	});

	test('splits uneven array with remainder chunk', () => {
		expect(sliceIntoChunks([1, 2, 3, 4, 5], 2)).toStrictEqual([[1, 2], [3, 4], [5]]);
	});

	test('splits pressure levels into 3 groups', () => {
		const levels = [
			30, 50, 70, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900, 925, 950, 975, 1000
		].reverse();
		expect(sliceIntoChunks(levels, levels.length / 3 + 1)).toStrictEqual([
			[1000, 975, 950, 925, 900, 850, 800],
			[700, 600, 500, 400, 300, 250, 200],
			[150, 100, 70, 50, 30]
		]);
	});

	test('returns single chunk when chunkSize >= array length', () => {
		expect(sliceIntoChunks([1, 2, 3], 5)).toStrictEqual([[1, 2, 3]]);
	});

	test('returns empty array for empty input', () => {
		expect(sliceIntoChunks([], 3)).toStrictEqual([]);
	});

	test('creates individual elements when chunkSize is 1', () => {
		expect(sliceIntoChunks(['a', 'b', 'c'], 1)).toStrictEqual([['a'], ['b'], ['c']]);
	});
});

describe('objectDifference', () => {
	test('returns keys with differing numeric values', () => {
		expect(objectDifference({ '1': 3, '2': 5 }, { '1': 4, '2': 5 })).toStrictEqual({ '1': 3 });
	});

	test('returns empty object when both are identical', () => {
		expect(objectDifference({ a: 'x', b: 'y' }, { a: 'x', b: 'y' })).toStrictEqual({});
	});

	test('returns all keys when nothing matches', () => {
		expect(objectDifference({ a: 'x', b: 'y' }, { a: 'p', b: 'q' })).toStrictEqual({
			a: 'x',
			b: 'y'
		});
	});

	test('ignores null values in first object', () => {
		expect(objectDifference({ a: null, b: 'y' }, { a: 'x', b: 'z' })).toStrictEqual({ b: 'y' });
	});

	test('ignores empty string values in first object', () => {
		expect(objectDifference({ a: '', b: 'y' }, { a: 'x', b: 'z' })).toStrictEqual({ b: 'y' });
	});

	test('treats numeric strings and numbers as equal', () => {
		expect(objectDifference({ a: '5' }, { a: 5 })).toStrictEqual({});
	});

	test('only considers keys from the first object', () => {
		expect(objectDifference({ a: '1' }, { a: '1', b: '2' })).toStrictEqual({});
	});

	test('includes numeric value from a when b has non-numeric', () => {
		expect(objectDifference({ a: 5 }, { a: 'hello' })).toStrictEqual({ a: 5 });
	});
});

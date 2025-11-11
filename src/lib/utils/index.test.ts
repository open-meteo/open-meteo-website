import { expect, test } from 'vitest';

import { camelCase, isNumeric, objectDifference, pad, sliceIntoChunks, titleCase } from './';

// --- pad ---
test('pad with 1 digit', () => {
	expect(pad(1)).toBe('01');
});

test('pad with 2 digit', () => {
	expect(pad(10)).toBe('10');
});

test('pad with 1 char string', () => {
	expect(pad('7')).toBe('07');
});

test('pad with 2 char strings', () => {
	expect(pad('70')).toBe('70');
});

test('pad with overflow string', () => {
	expect(pad('18276')).toBe('76');
});

test('pad with null', () => {
	expect(pad(null)).toBe('');
});

test('pad with undefined', () => {
	expect(pad(undefined)).toBe('');
});

// --- isNumeric ---
test('isNumeric for small number', () => {
	expect(isNumeric(5)).toBe(true);
});

test('isNumeric for a negative number', () => {
	expect(isNumeric(-55)).toBe(true);
});

test('isNumeric for a floating point number', () => {
	expect(isNumeric(5.55)).toBe(true);
});

test('isNumeric for a bigger number', () => {
	expect(isNumeric(23598)).toBe(true);
});

test('isNumeric for a biggest numbers', () => {
	expect(isNumeric(1e21)).toBe(true);
});

test('isNumeric for small number string', () => {
	expect(isNumeric('3')).toBe(true);
});

test('isNumeric for bigger number string', () => {
	expect(isNumeric('153610')).toBe(true);
});

test('isNumeric with a trailing 0', () => {
	expect(isNumeric('017')).toBe(true);
});

test('isNumeric with character in string', () => {
	expect(isNumeric('01n7')).toBe(false);
});

test('isNumeric with completer character string', () => {
	expect(isNumeric('hello')).toBe(false);
});

test('isNumeric with null', () => {
	expect(isNumeric(null)).toBe(false);
});

test('isNumeric with undefined', () => {
	expect(isNumeric(undefined)).toBe(false);
});

// --- titleCase ---
test("titleCase with 'variable-name'", () => {
	expect(titleCase('variable-name')).toBe('VariableName');
});

test("titleCase with 'temperature_2m'", () => {
	expect(titleCase('temperature_2m')).toBe('Temperature2m');
});

test("titleCase with 'wind_speed_10m'", () => {
	expect(titleCase('wind_speed_10m')).toBe('WindSpeed10m');
});

// --- camelCase ---
test("camelCase with 'variable-name'", () => {
	expect(camelCase('variable-name')).toBe('variableName');
});

test("camelCase with 'temperature_2m'", () => {
	expect(camelCase('temperature_2m')).toBe('temperature2m');
});

test("camelCase with 'wind_speed_10m'", () => {
	expect(camelCase('wind_speed_10m')).toBe('windSpeed10m');
});

// -- sliceIntoChunks --
test("sliceIntoChunks with '[1, 2, 3, 4, 5, 6]' split in 2", () => {
	expect(sliceIntoChunks([1, 2, 3, 4, 5, 6], 2)).toStrictEqual([
		[1, 2],
		[3, 4],
		[5, 6]
	]);
});

test("sliceIntoChunks with uneven array '[1, 2, 3, 4, 5]' split in 2", () => {
	expect(sliceIntoChunks([1, 2, 3, 4, 5], 2)).toStrictEqual([[1, 2], [3, 4], [5]]);
});

export const levels = [
	30, 50, 70, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900, 925, 950, 975, 1000
].reverse();

test(`sliceIntoChunks with levels '[${levels.join(', ')}]' split in 2`, () => {
	expect(sliceIntoChunks(levels, levels.length / 3 + 1)).toStrictEqual([
		[1000, 975, 950, 925, 900, 850, 800],
		[700, 600, 500, 400, 300, 250, 200],
		[150, 100, 70, 50, 30]
	]);
});

// -- objectDifference --
test("objectDifference with '{ '1': 3, '2': 5 }, { '1': 4, '2': 5 }'", () => {
	expect(objectDifference({ '1': 3, '2': 5 }, { '1': 4, '2': 5 })).toStrictEqual({ '1': 3 });
});

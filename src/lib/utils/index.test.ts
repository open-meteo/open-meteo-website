import { expect, test } from 'vitest';
import { pad, isNumeric, titleCase, camelCase, objectDifference } from './';

// --- pad ---
test('check pad with 1 digit', () => {
	expect(pad(1)).toBe('01');
});

test('check pad with 2 digit', () => {
	expect(pad(10)).toBe('10');
});

test('check pad with 1 char string', () => {
	expect(pad('7')).toBe('07');
});

test('check pad with 2 char strings', () => {
	expect(pad('70')).toBe('70');
});

test('check pad with overflow string', () => {
	expect(pad('18276')).toBe('76');
});

test('check pad with null', () => {
	expect(pad(null)).toBe('');
});

test('check pad with undefined', () => {
	expect(pad(undefined)).toBe('');
});

// --- isNumeric ---
test('check isNumeric for small number', () => {
	expect(isNumeric(5)).toBe(true);
});

test('check isNumeric for a negative number', () => {
	expect(isNumeric(-55)).toBe(true);
});

test('check isNumeric for a floating point number', () => {
	expect(isNumeric(5.55)).toBe(true);
});

test('check isNumeric for a bigger number', () => {
	expect(isNumeric(23598)).toBe(true);
});

test('check isNumeric for a biggest numbers', () => {
	expect(isNumeric(1e21)).toBe(true);
});

test('check isNumeric for small number string', () => {
	expect(isNumeric('3')).toBe(true);
});

test('check isNumeric for bigger number string', () => {
	expect(isNumeric('153610')).toBe(true);
});

test('check isNumeric with a trailing 0', () => {
	expect(isNumeric('017')).toBe(true);
});

test('check isNumeric with character in string', () => {
	expect(isNumeric('01n7')).toBe(false);
});

test('check isNumeric with completer character string', () => {
	expect(isNumeric('hello')).toBe(false);
});

test('check isNumeric with null', () => {
	expect(isNumeric(null)).toBe(false);
});

test('check isNumeric with undefined', () => {
	expect(isNumeric(undefined)).toBe(false);
});

// --- titleCase ---
test("check titleCase with 'variable-name'", () => {
	expect(titleCase('variable-name')).toBe('VariableName');
});

test("check titleCase with 'temperature_2m'", () => {
	expect(titleCase('temperature_2m')).toBe('Temperature2m');
});

test("check titleCase with 'wind_speed_10m'", () => {
	expect(titleCase('wind_speed_10m')).toBe('WindSpeed10m');
});

// --- camelCase ---
test("check camelCase with 'variable-name'", () => {
	expect(camelCase('variable-name')).toBe('variableName');
});

test("check camelCase with 'temperature_2m'", () => {
	expect(camelCase('temperature_2m')).toBe('temperature2m');
});

test("check camelCase with 'wind_speed_10m'", () => {
	expect(camelCase('wind_speed_10m')).toBe('windSpeed10m');
});

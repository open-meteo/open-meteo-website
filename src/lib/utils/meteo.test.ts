import { pad } from './meteo';

test('check pad with 1 digit', () => {
	expect(pad(1)).toBe('01');
});

test('check pad with 2 digit', () => {
	expect(pad(10)).toBe('10');
});

test('check pad with 1 string', () => {
	expect(pad('7')).toBe('07');
});

test('check pad with 2 strings', () => {
	expect(pad('70')).toBe('70');
});

test('check pad with null', () => {
	expect(pad(null)).toBe('');
});

test('check pad with undefined', () => {
	expect(pad(undefined)).toBe('');
});

import * as meteo from './meteo';

// --- pad ---
test('check pad with 1 digit', () => {
	expect(meteo.pad(1)).toBe('01');
});

test('check pad with 2 digit', () => {
	expect(meteo.pad(10)).toBe('10');
});

test('check pad with 1 char string', () => {
	expect(meteo.pad('7')).toBe('07');
});

test('check pad with 2 char strings', () => {
	expect(meteo.pad('70')).toBe('70');
});

test('check pad with overflow string', () => {
	expect(meteo.pad('18276')).toBe('76');
});

test('check pad with null', () => {
	expect(meteo.pad(null)).toBe('');
});

test('check pad with undefined', () => {
	expect(meteo.pad(undefined)).toBe('');
});

// --- isNumeric ---
test('check isNumeric for small number', () => {
	expect(meteo.isNumeric(5)).toBe(true);
});

test('check isNumeric for a negative number', () => {
	expect(meteo.isNumeric(-55)).toBe(true);
});

test('check isNumeric for a floating point number', () => {
	expect(meteo.isNumeric(5.55)).toBe(true);
});

test('check isNumeric for a bigger number', () => {
	expect(meteo.isNumeric(23598)).toBe(true);
});

test('check isNumeric for small number string', () => {
	expect(meteo.isNumeric('3')).toBe(true);
});

test('check isNumeric for bigger number string', () => {
	expect(meteo.isNumeric('153610')).toBe(true);
});

test('check isNumeric with a trailing 0', () => {
	expect(meteo.isNumeric('017')).toBe(true);
});

test('check isNumeric with character in string', () => {
	expect(meteo.isNumeric('01n7')).toBe(false);
});

test('check isNumeric with completer character string', () => {
	expect(meteo.isNumeric('hello')).toBe(false);
});

test('check isNumeric with null', () => {
	expect(meteo.isNumeric(null)).toBe(false);
});

test('check isNumeric with undefined', () => {
	expect(meteo.isNumeric(undefined)).toBe(false);
});

// --- altitudeAboveSeaLevelMeters ---
test('check altitudeAboveSeaLevelMeters with 1000hPa', () => {
	expect(meteo.altitudeAboveSeaLevelMeters(1000)).toBe('110 m');
});

test('check altitudeAboveSeaLevelMeters with 750hPa', () => {
	expect(meteo.altitudeAboveSeaLevelMeters(750)).toBe('2.5 km');
});

test('check altitudeAboveSeaLevelMeters with 500hPa', () => {
	expect(meteo.altitudeAboveSeaLevelMeters(500)).toBe('5.6 km');
});

test('check altitudeAboveSeaLevelMeters with 250hPa', () => {
	expect(meteo.altitudeAboveSeaLevelMeters(250)).toBe('10.4 km');
});

test('check altitudeAboveSeaLevelMeters with 0hPa', () => {
	expect(meteo.altitudeAboveSeaLevelMeters(0)).toBe('44 km');
});

test('check altitudeAboveSeaLevelMeters with negative pressure', () => {
	expect(meteo.altitudeAboveSeaLevelMeters(-250)).toBe('NaN km');
});

// appearently function also does below sea level :P
test('check altitudeAboveSeaLevelMeters with very big postive pressure', () => {
	expect(meteo.altitudeAboveSeaLevelMeters(25000)).toBe('-37250 m');
});

test('check altitudeAboveSeaLevelMeters with undefined', () => {
	expect(meteo.altitudeAboveSeaLevelMeters(undefined)).toBe('NaN km');
});

// --- geoLocationNameToRoute ---
test("check geoLocationNameToRoute with 'são-paolo'", () => {
	expect(meteo.geoLocationNameToRoute('são-paolo')).toBe('sao-paolo');
});

test("check geoLocationNameToRoute with 'xi'an'", () => {
	expect(meteo.geoLocationNameToRoute("xi'an")).toBe('xi-an');
});

test("check geoLocationNameToRoute with 'new taipei city'", () => {
	expect(meteo.geoLocationNameToRoute('new taipei city')).toBe('new-taipei-city');
});

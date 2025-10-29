import { expect, test } from 'vitest';

import { altitudeAboveSeaLevelMeters, geoLocationNameToRoute, getWeatherCode } from './meteo';

// --- altitudeAboveSeaLevelMeters ---
test('check altitudeAboveSeaLevelMeters with 1000hPa', () => {
	expect(altitudeAboveSeaLevelMeters(1000)).toBe('110 m');
});

test('check altitudeAboveSeaLevelMeters with 750hPa', () => {
	expect(altitudeAboveSeaLevelMeters(750)).toBe('2.5 km');
});

test('check altitudeAboveSeaLevelMeters with 500hPa', () => {
	expect(altitudeAboveSeaLevelMeters(500)).toBe('5.6 km');
});

test('check altitudeAboveSeaLevelMeters with 250hPa', () => {
	expect(altitudeAboveSeaLevelMeters(250)).toBe('10.4 km');
});

test('check altitudeAboveSeaLevelMeters with 0hPa', () => {
	expect(altitudeAboveSeaLevelMeters(0)).toBe('44 km');
});

test('check altitudeAboveSeaLevelMeters with negative pressure', () => {
	expect(altitudeAboveSeaLevelMeters(-250)).toBe('NaN km');
});

// appearently function also does below sea level :P
test('check altitudeAboveSeaLevelMeters with very big postive pressure', () => {
	expect(altitudeAboveSeaLevelMeters(25000)).toBe('-37250 m');
});

test('check altitudeAboveSeaLevelMeters with undefined', () => {
	expect(altitudeAboveSeaLevelMeters(undefined)).toBe('NaN km');
});

// --- getWeatherCode ---
test('check getWeatherCode for 1', () => {
	expect(getWeatherCode(1)).toBe('mainly clear');
});

test('check getWeatherCode for 82', () => {
	expect(getWeatherCode(82)).toBe('heavy rain showers');
});

test('check getWeatherCode unknown weather code', () => {
	expect(getWeatherCode(117)).toBe('unknown code');
});

test('check getWeatherCode for null', () => {
	expect(getWeatherCode(null)).toBe('-');
});

test('check getWeatherCode for undefined', () => {
	expect(getWeatherCode(undefined)).toBe('-');
});

// --- geoLocationNameToRoute ---
test("check geoLocationNameToRoute with 'são-paolo'", () => {
	expect(geoLocationNameToRoute('são-paolo')).toBe('sao-paolo');
});

test("check geoLocationNameToRoute with 'xi'an'", () => {
	expect(geoLocationNameToRoute("xi'an")).toBe('xi-an');
});

test("check geoLocationNameToRoute with 'new taipei city'", () => {
	expect(geoLocationNameToRoute('new taipei city')).toBe('new-taipei-city');
});

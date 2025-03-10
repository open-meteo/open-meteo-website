import { pad } from '$lib/utils/meteo';

// Settings
export const temperatureOptions = [
	{ value: 'celsius', label: 'Celsius °C' },
	{ value: 'fahrenheit', label: 'Fahrenheit °F' }
];

export const windSpeedOptions = [
	{ value: 'kmh', label: 'km/h' },
	{ value: 'ms', label: 'm/s' },
	{ value: 'mph', label: 'mph' },
	{ value: 'kn', label: 'Knots' }
];

export const precipitationOptions = [
	{ value: 'mm', label: 'Millimeter' },
	{ value: 'inch', label: 'Inch' }
];

export const timeFormatOptions = [
	{
		value: 'iso8601',
		label:
			'ISO 8601 (e.g. ' +
			new Date().getFullYear() +
			'-' +
			pad(new Date().getMonth() + 1) +
			'-' +
			pad(new Date().getDate()) +
			')'
	},
	{ value: 'unixtime', label: 'Unix timestamp' }
];

export const lengthOptions = [
	{ value: 'metric', label: 'Metric' },
	{ value: 'imperial', label: 'Imperial' }
];

export const domainOptions = [
	{ value: 'auto', label: 'Global + European' },
	{ value: 'cams_global', label: 'Global (40km)' },
	{ value: 'cams_europe', label: 'European (11km)' }
];

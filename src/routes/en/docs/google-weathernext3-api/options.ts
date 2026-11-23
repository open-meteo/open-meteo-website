import { dayOptions } from '../options';

export const model = {
	value: 'google_weathernext3_ensemble_mean',
	label: 'Google WeatherNext 3 Ensemble Mean'
};

export const forecastDaysOptions = dayOptions([1, 3, 7, 14, 15], 7);

export const fields = [
	{ value: 'temperature_2m', label: 'Temperature (2 m)', spread: true },
	{ value: 'dew_point_2m', label: 'Dewpoint (2 m)', spread: true },
	{ value: 'pressure_msl', label: 'Sea Level Pressure', spread: true },
	{ value: 'sea_surface_temperature', label: 'Sea Surface Temperature' },
	{ value: 'precipitation', label: 'Precipitation (rain + snow)' },
	{ value: 'cloud_cover', label: 'Cloud Cover Total' },
	{ value: 'cloud_cover_low', label: 'Cloud Cover Low' },
	{ value: 'cloud_cover_mid', label: 'Cloud Cover Mid' },
	{ value: 'cloud_cover_high', label: 'Cloud Cover High' },
	{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)', spread: true },
	{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)', percentiles: false },
	{
		value: 'wind_u_component_10m',
		label: 'Eastward Wind (10 m)',
		percentiles: false
	},
	{
		value: 'wind_v_component_10m',
		label: 'Northward Wind (10 m)',
		percentiles: false
	},
	{ value: 'wind_speed_100m', label: 'Wind Speed (100 m)', spread: true },
	{ value: 'wind_direction_100m', label: 'Wind Direction (100 m)', percentiles: false },
	{
		value: 'wind_u_component_100m',
		label: 'Eastward Wind (100 m)',
		percentiles: false
	},
	{
		value: 'wind_v_component_100m',
		label: 'Northward Wind (100 m)',
		percentiles: false
	},
	{ value: 'shortwave_radiation', label: 'Shortwave Solar Radiation GHI' },
	{ value: 'direct_radiation', label: 'Direct Solar Radiation' }
];

export const spreadVariables = fields.filter(({ spread }) => spread).map(({ value }) => value);

const percentiles = [10, 25, 50, 75, 90];
export const statisticLabels = ['Mean', 'Spread', ...percentiles.map((level) => `P${level}`)];

export const hourly = fields.map((field) => ({
	...field,
	statistics: [
		field.value,
		field.spread ? `${field.value}_spread` : null,
		...percentiles.map((level) => (field.percentiles === false ? null : `${field.value}_p${level}`))
	]
}));

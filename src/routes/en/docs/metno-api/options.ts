import { current, solarVariables } from '../options';

export { current, solarVariables };

export const defaultParameters = {
	hourly: [],
	models: [],
	current: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: undefined,

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: '3',

	past_hours: undefined,
	forecast_hours: undefined,
	cell_selection: undefined,
	temporal_resolution: undefined,

	end_date: undefined,
	start_date: undefined,

	tilt: '0',
	azimuth: '0',

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
};

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' }
	],
	[
		{ value: 'precipitation', label: 'Precipitation (rain + snow)' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'snowfall', label: 'Snowfall' }
	],
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'pressure_msl', label: 'Sea Level Pressure' },
		{ value: 'surface_pressure', label: 'Surface Pressure' },
		{ value: 'cloud_cover', label: 'Cloud Cover Total' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	]
];

export const additionalVariables = [
	[
		{ value: 'is_day', label: 'Is Day or Night' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
	]
];

export const models = [
	[
		{ value: 'metno_seamless', label: 'MET Norway Nordic Seamless (with ECMWF)' },
		{ value: 'metno_nordic', label: 'MET Norway Nordic' }
	]
];

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '3', label: '3 days (default)' },
	{ value: '5', label: '5 days' },
	{ value: '10', label: '10 days' },
	{ value: '15', label: '15 days' }
];

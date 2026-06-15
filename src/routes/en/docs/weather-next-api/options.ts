export const defaultParameters = {
	hourly: [],
	daily: [],
	location_mode: 'location_search',
	csv_coordinates: '',
	temperature_unit: 'celsius',
	wind_speed_unit: 'kmh',
	precipitation_unit: 'mm',
	timeformat: 'iso8601',
	timezone: 'UTC',
	past_days: '0',
	past_hours: '',
	past_minutely_15: '',
	forecast_days: '7',
	forecast_hours: '',
	forecast_minutely_15: '',
	temporal_resolution: '',
	start_date: '',
	end_date: '',
	tilt: '0',
	azimuth: '0',
	time_mode: 'forecast_days',
	models: ['google_weathernext2_ensemble'],
	cell_selection: ''
};

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'precipitation', label: 'Precipitation (6-hourly)' },
		{ value: 'sea_surface_temperature', label: 'Sea Surface Temperature' }
	],
	[
		{ value: 'cloud_cover', label: 'Cloud Cover Total' },
		{ value: 'cloud_cover_low', label: 'Cloud Cover Low' },
		{ value: 'cloud_cover_mid', label: 'Cloud Cover Mid' },
		{ value: 'cloud_cover_high', label: 'Cloud Cover High' }
	],
	[{ value: 'pressure_msl', label: 'Sea Level Pressure' }],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ value: 'wind_direction_100m', label: 'Wind Direction (100 m)' }
	]
];

export const daily = [
	[
		{ value: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ value: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' }
	],
	[{ value: 'precipitation_sum', label: 'Precipitation Sum' }],
	[
		{ value: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
		{ value: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' }
	]
];

export const additionalVariables: { value: string; label: string }[][] = [];

export const solarVariables: { value: string; label: string }[][] = [];

export const models = [
	[{ value: 'google_weathernext2_ensemble', label: 'Google WeatherNext 2 Ensemble' }]
];

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '3', label: '3 days' },
	{ value: '7', label: '7 days (default)' },
	{ value: '10', label: '10 days' },
	{ value: '15', label: '15 days' }
];

export { forecastDaysOptionsMax15Default3 as forecastDaysOptions } from '../options';

export { pressureVariablesWithDewpoint as pressureVariables } from '../options';

export { dailyWithUvIndex as daily } from '../options';

export const defaultParameters = {
	daily: [],
	hourly: [],
	models: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: '',

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: '3',

	end_date: '',
	start_date: '',

	past_hours: '',
	forecast_hours: '',
	cell_selection: '',
	past_minutely_15: '',
	forecast_minutely_15: '',
	temporal_resolution: '',

	tilt: '0',
	azimuth: '0',

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
};

export const levels = [300, 500, 700, 850, 925].reverse();

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'precipitation', label: 'Precipitation (rain + snow)' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'snow_depth_water_equivalent', label: 'Snow Depth Water Equivalent' }
	],
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'pressure_msl', label: 'Sea Level Pressure' },
		{ value: 'surface_pressure', label: 'Surface Pressure' },
		{ value: 'cloud_cover', label: 'Cloud Cover Total' },
		{ value: 'cloud_cover_low', label: 'Cloud Cover Low' },
		{ value: 'cloud_cover_mid', label: 'Cloud Cover Mid' },
		{ value: 'cloud_cover_high', label: 'Cloud Cover High' },
		{ value: 'visibility', label: 'Visibility' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_speed_50m', label: 'Wind Speed (50 m)' },
		{ value: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ value: 'wind_speed_200m', label: 'Wind Speed (200 m)' },
		{ value: 'wind_speed_300m', label: 'Wind Speed (300 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_50m', label: 'Wind Direction (50 m)' },
		{ value: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
		{ value: 'wind_direction_200m', label: 'Wind Direction (200 m)' },
		{ value: 'wind_direction_300m', label: 'Wind Direction (300 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	],
	[
		{ value: 'surface_temperature', label: 'Surface Temperature' },
		{ value: 'temperature_50m', label: 'Temperature (5 m)' },
		{ value: 'temperature_100m', label: 'Temperature (100 m)' },
		{ value: 'temperature_200m', label: 'Temperature (200 m)' },
		{ value: 'temperature_300m', label: 'Temperature (300 m)' }
	]
];

export const additionalVariables = [
	[
		{ value: 'is_day', label: 'Is Day or Night' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
	],
	[{ value: 'sunshine_duration', label: 'Sunshine Duration' }]
];

export const models = [
	[
		{ value: 'knmi_seamless', label: 'KNMI Seamless (with ECMWF)' },
		{ value: 'knmi_harmonie_arome_europe', label: 'KNMI Harmonie AROME Europe' },
		{ value: 'knmi_harmonie_arome_netherlands', label: 'KNMI Harmonie AROME Netherlands' }
	]
];

export { forecastDaysOptionsMax8 as forecastDaysOptions } from '../options';

export { pressureVariablesWithVerticalVelocity as pressureVariables } from '../options';

export { dailyBasic as daily } from '../options';

export const defaultParameters = {
	daily: [],
	hourly: [],
	models: [],
	current: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: undefined,

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: '7',

	end_date: undefined,
	start_date: undefined,

	past_hours: undefined,
	cell_selection: undefined,
	forecast_hours: undefined,
	temporal_resolution: undefined,

	tilt: '0',
	azimuth: '0',

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
};

export const levels = [
	10, 20, 30, 40, 50, 70, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 450, 500,
	550, 600, 650, 700, 750, 800, 850, 900, 925, 950, 975, 1000
].reverse();

export const heightVariables = [
	{ value: 'temperature', label: 'Temperature' },
	{ value: 'cloud_cover', label: 'Cloud Cover' },
	{ value: 'wind_speed', label: 'Wind Speed' },
	{ value: 'wind_direction', label: 'Wind Direction' }
];

export const heights = [
	20, 30, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 1000, 1250, 1500, 1750, 2000,
	2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4500, 5000, 5500, 6000
];

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'showers', label: 'Showers' }
	],
	[
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'hail', label: 'Hail' },
		{ value: 'snow_depth_water_equivalent', label: 'Snow Depth Water Equivalent' },
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'visibility', label: 'Visibility' },
		{ value: 'pressure_msl', label: 'Sea Level Pressure' },
		{ value: 'surface_pressure', label: 'Surface Pressure' }
	],
	[
		{ value: 'cloud_cover', label: 'Cloud Cover Total' },
		{ value: 'cloud_cover_low', label: 'Cloud Cover Low' },
		{ value: 'cloud_cover_mid', label: 'Cloud Cover Mid' },
		{ value: 'cloud_cover_high', label: 'Cloud Cover High' },
		{ value: 'cloud_cover_2m', label: 'Cloud Cover / Fog (2m)' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	]
];

export const additionalVariables = [
	[
		{ value: 'is_day', label: 'Is Day or Night' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
	],
	[
		{ value: 'cape', label: 'CAPE' },
		{ value: 'convective_inhibition', label: 'Convective Inhibition' },
		{ value: 'freezing_level_height', label: 'Freezing Level Height' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' }
	]
];

export const models = [
	[
		{ value: 'ukmo_seamless', label: 'UK Met Office Seamless' },
		{ value: 'ukmo_global_deterministic_10km', label: 'UK Met Office Global 10km' },
		{ value: 'ukmo_uk_deterministic_2km', label: 'UK Met Office UK 2km' }
	]
];

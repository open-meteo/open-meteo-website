export { forecastDaysOptionsMax8Default3 as forecastDaysOptions } from '../options';

export { pressureVariablesWithVerticalVelocity as pressureVariables } from '../options';

export { dailyBasic as daily } from '../options';

export const defaultParameters = {
	daily: [],
	hourly: [],
	models: [],
	current: [],
	minutely_15: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: undefined,

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: '3',

	end_date: undefined,
	start_date: undefined,

	past_hours: undefined,
	forecast_hours: undefined,
	past_minutely_15: undefined,
	forecast_minutely_15: undefined,

	tilt: '0',
	azimuth: '0',

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
};

export const levels = [250, 500, 700, 850, 925, 1000].reverse();

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'showers', label: 'Showers' },
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'snow_depth', label: 'Snow Depth' }
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
		{ value: 'evapotranspiration', label: 'Evapotranspiration' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	],
	[
		{ value: 'soil_temperature_0cm', label: 'Soil Temperature (0 cm)' },
		{ value: 'soil_temperature_6cm', label: 'Soil Temperature (6 cm)' },
		{ value: 'soil_temperature_18cm', label: 'Soil Temperature (18 cm)' },
		{ value: 'soil_temperature_54cm', label: 'Soil Temperature (54 cm)' },
		{ value: 'soil_temperature_162cm', label: 'Soil Temperature (162 cm)' },
		{ value: 'soil_temperature_486cm', label: 'Soil Temperature (486 cm)' },
		{ value: 'soil_temperature_1458cm', label: 'Soil Temperature (1458 cm)' },
		{ value: 'soil_moisture_0_to_1cm', label: 'Soil Moisture (0-1 cm)' },
		{ value: 'soil_moisture_1_to_3cm', label: 'Soil Moisture (1-3 cm)' },
		{ value: 'soil_moisture_3_to_9cm', label: 'Soil Moisture (3-9 cm)' },
		{ value: 'soil_moisture_9_to_27cm', label: 'Soil Moisture (9-27 cm)' },
		{ value: 'soil_moisture_27_to_81cm', label: 'Soil Moisture (27-81 cm)' },
		{ value: 'soil_moisture_81_to_243cm', label: 'Soil Moisture (81-243 cm)' },
		{ value: 'soil_moisture_243_to_729cm', label: 'Soil Moisture (243-729 cm)' },
		{ value: 'soil_moisture_729_to_2187cm', label: 'Soil Moisture (729-2187 cm)' }
	]
];

export const additionalVariables = [
	[
		{ value: 'is_day', label: 'Is Day or Night' },
		{ value: 'lightning_potential', label: 'Lightning Potential Index LPI (2)' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' },
		{ value: 'convective_inhibition', label: 'Convective Inhibition' }
	],
	[
		{ value: 'cape', label: 'CAPE' },
		{ value: 'freezing_level_height', label: 'Freezing Level Height' },
		{ value: 'snowfall_height', label: 'Snowfall Height (1)' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' }
	]
];

export const models = [
	[{ value: 'italia_meteo_arpae_icon_2i', label: 'ItaliaMeteo ARPAE ICON-2i' }]
];

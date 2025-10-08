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
	forecast_days: '7',

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

export const pressureVariables = [
	{ value: 'temperature', label: 'Temperature' },
	{ value: 'relative_humidity', label: 'Relative Humidity' },
	{ value: 'cloud_cover', label: 'Cloud Cover' },
	{ value: 'wind_speed', label: 'Wind Speed' },
	{ value: 'wind_direction', label: 'Wind Direction' },
	{ value: 'geopotential_height', label: 'Geopotential Height' }
];
export const levels = [
	30, 50, 70, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900, 925, 950, 975, 1000
].reverse();

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
		{ value: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
		{ value: 'wind_speed_120m', label: 'Wind Speed (120 m)' },
		{ value: 'wind_speed_180m', label: 'Wind Speed (180 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
		{ value: 'wind_direction_120m', label: 'Wind Direction (120 m)' },
		{ value: 'wind_direction_180m', label: 'Wind Direction (180 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ value: 'temperature_80m', label: 'Temperature (80 m)' },
		{ value: 'temperature_120m', label: 'Temperature (120 m)' },
		{ value: 'temperature_180m', label: 'Temperature (180 m)' }
	],
	[
		{ value: 'soil_temperature_0cm', label: 'Soil Temperature (0 cm)' },
		{ value: 'soil_temperature_6cm', label: 'Soil Temperature (6 cm)' },
		{ value: 'soil_temperature_18cm', label: 'Soil Temperature (18 cm)' },
		{ value: 'soil_temperature_54cm', label: 'Soil Temperature (54 cm)' },
		{ value: 'soil_moisture_0_to_1cm', label: 'Soil Moisture (0-1 cm)' },
		{ value: 'soil_moisture_1_to_3cm', label: 'Soil Moisture (1-3 cm)' },
		{ value: 'soil_moisture_3_to_9cm', label: 'Soil Moisture (3-9 cm)' },
		{ value: 'soil_moisture_9_to_27cm', label: 'Soil Moisture (9-27 cm)' },
		{ value: 'soil_moisture_27_to_81cm', label: 'Soil Moisture (27-81 cm)' }
	]
];

export const current = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'is_day', label: 'Is Day or Night' }
	],
	[
		{ value: 'precipitation', label: 'Precipitation' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'showers', label: 'Showers' },
		{ value: 'snowfall', label: 'Snowfall' }
	],
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'cloud_cover', label: 'Cloud Cover Total' },
		{ value: 'pressure_msl', label: 'Sea Level Pressure' },
		{ value: 'surface_pressure', label: 'Surface Pressure' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	]
];

export const minutely_15 = [
	[
		{ value: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'snowfall_height', label: 'Snowfall Height' },
		{ value: 'freezing_level_height', label: 'Freezing Level Height' }
	],
	[
		{ value: 'cape', label: 'CAPE' },
		{ value: 'lightning_potential', label: 'Lightning Potential Index LPI' },
		{ value: 'is_day', label: 'Is Day or Night' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' }
	]
];

export const daily = [
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ value: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ value: 'apparent_temperature_max', label: 'Maximum Apparent Temperature (2 m)' },
		{ value: 'apparent_temperature_min', label: 'Minimum Apparent Temperature (2 m)' }
	],
	[
		{ value: 'sunrise', label: 'Sunrise' },
		{ value: 'sunset', label: 'Sunset' },
		{ value: 'daylight_duration', label: 'Daylight Duration' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' }
	],
	[
		{ value: 'rain_sum', label: 'Rain Sum' },
		{ value: 'showers_sum', label: 'Showers Sum' },
		{ value: 'snowfall_sum', label: 'Snowfall Sum' },
		{ value: 'precipitation_sum', label: 'Precipitation Sum' },
		{ value: 'precipitation_hours', label: 'Precipitation Hours' },
		{ value: 'precipitation_probability_max', label: 'Precipitation Probability Max' }
	],
	[
		{ value: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
		{ value: 'wind_gusts_10m_max', label: 'Maximum Wind Gusts (10 m)' },
		{ value: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' },
		{ value: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' }
	]
];

export const additionalVariables = [
	[
		{ value: 'is_day', label: 'Is Day or Night' },
		{ value: 'lightning_potential', label: 'Lightning Potential Index LPI (2)' },
		{ value: 'updraft', label: 'Updraft (2)' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' },
		{ value: 'convective_cloud_base', label: 'Convective Cloud Base' },
		{ value: 'convective_cloud_top', label: 'Convective Cloud Top' }
	],
	[
		{ value: 'cape', label: 'CAPE' },
		{ value: 'freezing_level_height', label: 'Freezing Level Height' },
		{ value: 'snowfall_height', label: 'Snowfall Height (1)' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' }
	]
];

export const solarVariables = [
	[
		{ value: 'shortwave_radiation', label: 'Shortwave Solar Radiation GHI' },
		{ value: 'direct_radiation', label: 'Direct Solar Radiation' },
		{ value: 'diffuse_radiation', label: 'Diffuse Solar Radiation DHI' },
		{ value: 'direct_normal_irradiance', label: 'Direct Normal Irradiance DNI' },
		{ value: 'global_tilted_irradiance', label: 'Global Tilted Radiation GTI' },
		{ value: 'terrestrial_radiation', label: 'Terrestrial Solar Radiation' }
	],
	[
		{ value: 'shortwave_radiation_instant', label: 'Shortwave Solar Radiation GHI (Instant)' },
		{ value: 'direct_radiation_instant', label: 'Direct Solar Radiation (Instant)' },
		{ value: 'diffuse_radiation_instant', label: 'Diffuse Solar Radiation DHI (Instant)' },
		{ value: 'direct_normal_irradiance_instant', label: 'Direct Normal Irradiance DNI (Instant)' },
		{ value: 'global_tilted_irradiance_instant', label: 'Global Tilted Radiation GTI (Instant)' },
		{ value: 'terrestrial_radiation_instant', label: 'Terrestrial Solar Radiation (Instant)' }
	]
];

export const models = [
	[
		{ value: 'icon_seamless', label: 'DWD ICON Seamless' },
		{ value: 'icon_global', label: 'DWD ICON Global' },
		{ value: 'icon_eu', label: 'DWD ICON EU' },
		{ value: 'icon_d2', label: 'DWD ICON D2' }
	]
];

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '3', label: '3 days' },
	{ value: '5', label: '5 days' },
	{ value: '7', label: '7 days (default)' },
	{ value: '8', label: '8 days' }
];

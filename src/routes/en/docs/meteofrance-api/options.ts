export const defaultParameters = {
	current: [],
	hourly: [],
	daily: [],
	minutely_15: [],
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
	forecast_days: '4',
	forecast_hours: '',
	forecast_minutely_15: '',
	temporal_resolution: '',
	start_date: '',
	end_date: '',
	tilt: 0,
	azimuth: 0,
	time_mode: 'forecast_days',
	models: [],
	cell_selection: ''
};

export const minutely_15 = [
	[
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' },
		{ name: 'precipitation_probability', label: 'Precipitation Probability' },
		{ name: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ name: 'rain', label: 'Rain' },
		{ name: 'snowfall', label: 'Snowfall' }
	],
	[
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_speed_20m', label: 'Wind Speed (20 m)' },
		{ name: 'wind_speed_50m', label: 'Wind Speed (50 m)' },
		{ name: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ name: 'wind_direction_20m', label: 'Wind Direction (20 m)' },
		{ name: 'wind_direction_50m', label: 'Wind Direction (50 m)' },
		{ name: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
		{ name: 'cape', label: 'CAPE' },
		{ name: 'is_day', label: 'Is Day or Night' }
	]
];

export const pressureVariables = [
	{ name: 'temperature', label: 'Temperature' },
	{ name: 'dew_point', label: 'Dewpoint' },
	{ name: 'relative_humidity', label: 'Relative Humidity' },
	{ name: 'cloud_cover', label: 'Cloud cover' },
	{ name: 'wind_speed', label: 'Wind Speed' },
	{ name: 'wind_direction', label: 'Wind Direction' },
	{ name: 'geopotential_height', label: 'Geopotential Height' }
];

export const levels = [
	10, 20, 30, 50, 70, 100, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400, 450, 500, 550, 600,
	650, 700, 750, 800, 850, 900, 925, 950, 1000
].reverse();

export const hourly = [
	[
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' },
		{ name: 'precipitation', label: 'Precipitation (rain + snow)' },
		{ name: 'rain', label: 'Rain' },
		{ name: 'snowfall', label: 'Snowfall' }
	],
	[
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'pressure_msl', label: 'Sealevel Pressure' },
		{ name: 'surface_pressure', label: 'Surface Pressure' },
		{ name: 'cloud_cover', label: 'Cloud cover Total' },
		{ name: 'cloud_cover_low', label: 'Cloud cover Low' },
		{ name: 'cloud_cover_mid', label: 'Cloud cover Mid' },
		{ name: 'cloud_cover_high', label: 'Cloud cover High' },
		{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ name: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_speed_20m', label: 'Wind Speed (20 m)' },
		{ name: 'wind_speed_50m', label: 'Wind Speed (50 m)' },
		{ name: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ name: 'wind_speed_150m', label: 'Wind Speed (150 m)' },
		{ name: 'wind_speed_200m', label: 'Wind Speed (200 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ name: 'wind_direction_20m', label: 'Wind Direction (20 m)' },
		{ name: 'wind_direction_50m', label: 'Wind Direction (50 m)' },
		{ name: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
		{ name: 'wind_direction_150m', label: 'Wind Direction (150 m)' },
		{ name: 'wind_direction_200m', label: 'Wind Direction (200 m)' },
		{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	],
	[
		{ name: 'temperature_20m', label: 'Temperature (20 m)' },
		{ name: 'temperature_50m', label: 'Temperature (50 m)' },
		{ name: 'temperature_100m', label: 'Temperature (100 m)' },
		{ name: 'temperature_150m', label: 'Temperature (150 m)' },
		{ name: 'temperature_200m', label: 'Temperature (200 m)' }
	]
];

export const current = [
	[
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' },
		{ name: 'is_day', label: 'Is Day or Night' }
	],
	[
		{ name: 'precipitation', label: 'Precipitation' },
		{ name: 'rain', label: 'Rain' },
		{ name: 'showers', label: 'Showers' },
		{ name: 'snowfall', label: 'Snowfall' }
	],
	[
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'cloud_cover', label: 'Cloud cover Total' },
		{ name: 'pressure_msl', label: 'Sealevel Pressure' },
		{ name: 'surface_pressure', label: 'Surface Pressure' }
	],
	[
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	]
];

export const daily = [
	[
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ name: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ name: 'apparent_temperature_max', label: 'Maximum Apparent Temperature (2 m)' },
		{ name: 'apparent_temperature_min', label: 'Minimum Apparent Temperature (2 m)' },
		{ name: 'sunrise', label: 'Sunrise' },
		{ name: 'sunset', label: 'Sunset' },
		{ name: 'daylight_duration', label: 'Daylight Duration' },
		{ name: 'sunshine_duration', label: 'Sunshine Duration' },
		{ name: 'uv_index_max', label: 'UV Index' },
		{ name: 'uv_index_clear_sky_max', label: 'UV Index Clear Sky' }
	],
	[
		{ name: 'precipitation_sum', label: 'Precipitation Sum' },
		{ name: 'rain_sum', label: 'Rain Sum' },
		{ name: 'showers_sum', label: 'Showers Sum' },
		{ name: 'snowfall_sum', label: 'Snowfall Sum' },
		{ name: 'precipitation_hours', label: 'Precipitation Hours' },
		{ name: 'precipitation_probability_max', label: 'Precipitation Probability Max' },
		{ name: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
		{ name: 'wind_gusts_10m_max', label: 'Maximum Wind Gusts (10 m)' },
		{ name: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' },
		{ name: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' },
		{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' }
	]
];

export const additionalVariables = [
	[
		{ name: 'is_day', label: 'Is Day or Night' },
		{ name: 'sunshine_duration', label: 'Sunshine Duration' }
	],
	[
		{ name: 'cape', label: 'CAPE' },
		{ name: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
	]
];

export const solarVariables = [
	[
		{ name: 'shortwave_radiation', label: 'Shortwave Solar Radiation GHI' },
		{ name: 'direct_radiation', label: 'Direct Solar Radiation' },
		{ name: 'diffuse_radiation', label: 'Diffuse Solar Radiation DHI' },
		{ name: 'direct_normal_irradiance', label: 'Direct Normal Irradiance DNI' },
		{ name: 'global_tilted_irradiance', label: 'Global Tilted Radiation GTI' },
		{ name: 'terrestrial_radiation', label: 'Terrestrial Solar Radiation' }
	],
	[
		{ name: 'shortwave_radiation_instant', label: 'Shortwave Solar Radiation GHI (Instant)' },
		{ name: 'direct_radiation_instant', label: 'Direct Solar Radiation (Instant)' },
		{ name: 'diffuse_radiation_instant', label: 'Diffuse Solar Radiation DHI (Instant)' },
		{ name: 'direct_normal_irradiance_instant', label: 'Direct Normal Irradiance DNI (Instant)' },
		{ name: 'global_tilted_irradiance_instant', label: 'Global Tilted Radiation GTI' },
		{ name: 'terrestrial_radiation_instant', label: 'Terrestrial Solar Radiation (Instant)' }
	]
];

export const models = [
	[{ name: 'best_match', label: 'Best match' }],
	[
		{ name: 'arpege_seamless', label: 'ARPEGE Seamless' },
		{ name: 'arpege_world', label: 'ARPEGE World' },
		{ name: 'arpege_europe', label: 'ARPEGE Europe' }
	],
	[
		{ name: 'arome_seamless', label: 'AROME Seamless' },
		{ name: 'arome_france', label: 'AROME France' },
		{ name: 'arome_france_hd', label: 'AROME France HD' }
	]
];

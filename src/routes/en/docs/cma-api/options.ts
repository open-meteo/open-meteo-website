export const defaultParameters = {
	hourly: [],
	daily: [],
	location_mode: 'location_search',
	csv_coordinates: undefined,
	temperature_unit: 'celsius',
	wind_speed_unit: 'kmh',
	precipitation_unit: 'mm',
	timeformat: 'iso8601',
	timezone: 'UTC',
	past_days: '0',
	past_hours: undefined,
	past_minutely_15: undefined,
	forecast_days: '7',
	forecast_hours: undefined,
	forecast_minutely_15: undefined,
	temporal_resolution: undefined,
	start_date: undefined,
	end_date: undefined,
	tilt: '0',
	azimuth: '0',
	time_mode: 'forecast_days',
	models: [],
	cell_selection: undefined
};

export const pressureVariables = [
	{ value: 'temperature', label: 'Temperature' },
	{ value: 'dew_point', label: 'Dewpoint' },
	{ value: 'relative_humidity', label: 'Relative Humidity' },
	{ value: 'cloud_cover', label: 'Cloud cover' },
	{ value: 'wind_speed', label: 'Wind Speed' },
	{ value: 'wind_direction', label: 'Wind Direction' },
	{ value: 'vertical_velocity', label: 'Vertical Velocity' },
	{ value: 'geopotential_height', label: 'Geopotential Height' }
];
export const levels = [
	10, 20, 30, 50, 70, 100, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400, 450, 500, 550, 600,
	650, 700, 750, 800, 850, 900, 925, 950, 975, 1000
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
		{ value: 'pressure_msl', label: 'Sealevel Pressure' },
		{ value: 'surface_pressure', label: 'Surface Pressure' },
		{ value: 'cloud_cover', label: 'Cloud cover Total' },
		{ value: 'cloud_cover_low', label: 'Cloud cover Low' },
		{ value: 'cloud_cover_mid', label: 'Cloud cover Mid' },
		{ value: 'cloud_cover_high', label: 'Cloud cover High' },
		{ value: 'visibility', label: 'Visibility' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' },
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_speed_30m', label: 'Wind Speed (30 m)' },
		{ value: 'wind_speed_50m', label: 'Wind Speed (50 m)' }
	],
	[
		{ value: 'wind_speed_70m', label: 'Wind Speed (70 m)' },
		{ value: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ value: 'wind_speed_120m', label: 'Wind Speed (120 m)' },
		{ value: 'wind_speed_140m', label: 'Wind Speed (140 m)' },
		{ value: 'wind_speed_160m', label: 'Wind Speed (160 m)' },
		{ value: 'wind_speed_180m', label: 'Wind Speed (180 m)' },
		{ value: 'wind_speed_200m', label: 'Wind Speed (200 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_30m', label: 'Wind Direction (30 m)' },
		{ value: 'wind_direction_50m', label: 'Wind Direction (50 m)' },
		{ value: 'wind_direction_70m', label: 'Wind Direction (70 m)' },
		{ value: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
		{ value: 'wind_direction_120m', label: 'Wind Direction (120 m)' }
	],
	[
		{ value: 'wind_direction_140m', label: 'Wind Direction (140 m)' },
		{ value: 'wind_direction_160m', label: 'Wind Direction (160 m)' },
		{ value: 'wind_direction_180m', label: 'Wind Direction (180 m)' },
		{ value: 'wind_direction_200m', label: 'Wind Direction (200 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ value: 'surface_temperature', label: 'Surface Temperature' },
		{ value: 'soil_temperature_0_to_10cm', label: 'Soil Temperature (0-10 cm)' },
		{ value: 'soil_temperature_10_to_40cm', label: 'Soil Temperature (10-40 cm)' },
		{ value: 'soil_temperature_40_to_100cm', label: 'Soil Temperature (40-100 cm)' },
		{ value: 'soil_temperature_100_to_200cm', label: 'Soil Temperature (100-200 cm)' },
		{ value: 'soil_moisture_0_to_10cm', label: 'Soil Moisture (0-10 cm)' },
		{ value: 'soil_moisture_10_to_40cm', label: 'Soil Moisture (10-40 cm)' },
		{ value: 'soil_moisture_40_to_100cm', label: 'Soil Moisture (40-100 cm)' },
		{ value: 'soil_moisture_100_to_200cm', label: 'Soil Moisture (100-200 cm)' }
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
		{ value: 'sunshine_duration', label: 'Sunshine Duration' },
		{ value: 'uv_index_max', label: 'UV Index' },
		{ value: 'uv_index_clear_sky_max', label: 'UV Index Clear Sky' }
	],
	[
		{ value: 'precipitation_sum', label: 'Precipitation Sum' },
		{ value: 'rain_sum', label: 'Rain Sum' },
		{ value: 'showers_sum', label: 'Showers Sum' },
		{ value: 'snowfall_sum', label: 'Snowfall Sum' },
		{ value: 'precipitation_hours', label: 'Precipitation Hours' }
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
		{ value: 'sunshine_duration', label: 'Sunshine Duration' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
	],
	[
		{ value: 'cape', label: 'CAPE' },
		{ value: 'lifted_index', label: 'Lifted Index' },
		{ value: 'convective_inhibition', label: 'Convective Inhibition' }
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
		{ value: 'terrestrial_radiation_instant', label: 'Terrestrial Solar Radiation (Instant)' },
		{ value: 'global_tilted_irradiance_instant', label: 'Global Tilted Radiation GTI' }
	]
];

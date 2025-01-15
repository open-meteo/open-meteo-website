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
	tilt: 0,
	azimuth: 0,
	time_mode: 'forecast_days',
	models: [],
	cell_selection: ''
};

export const pressureVariables = [
	{ name: 'temperature', label: 'Temperature' },
	{ name: 'dew_point', label: 'Dewpoint' },
	{ name: 'relative_humidity', label: 'Relative Humidity' },
	{ name: 'cloud_cover', label: 'Cloud cover' },
	{ name: 'wind_speed', label: 'Wind Speed' },
	{ name: 'wind_direction', label: 'Wind Direction' },
	{ name: 'vertical_velocity', label: 'Vertical Velocity' },
	{ name: 'geopotential_height', label: 'Geopotential Height' }
];
export const levels = [
	10, 20, 30, 50, 70, 100, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400, 450, 500, 550, 600,
	650, 700, 750, 800, 850, 900, 925, 950, 975, 1000
].reverse();

export const hourly = [
	[
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' },
		{ name: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ name: 'rain', label: 'Rain' },
		{ name: 'showers', label: 'Showers' },
		{ name: 'snowfall', label: 'Snowfall' },
		{ name: 'snow_depth', label: 'Snow Depth' }
	],
	[
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'pressure_msl', label: 'Sealevel Pressure' },
		{ name: 'surface_pressure', label: 'Surface Pressure' },
		{ name: 'cloud_cover', label: 'Cloud cover Total' },
		{ name: 'cloud_cover_low', label: 'Cloud cover Low' },
		{ name: 'cloud_cover_mid', label: 'Cloud cover Mid' },
		{ name: 'cloud_cover_high', label: 'Cloud cover High' },
		{ name: 'visibility', label: 'Visibility' },
		{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ name: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_speed_30m', label: 'Wind Speed (30 m)' },
		{ name: 'wind_speed_50m', label: 'Wind Speed (50 m)' },
		{ name: 'wind_speed_70m', label: 'Wind Speed (70 m)' },
		{ name: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ name: 'wind_speed_120m', label: 'Wind Speed (120 m)' },
		{ name: 'wind_speed_140m', label: 'Wind Speed (140 m)' },
		{ name: 'wind_speed_160m', label: 'Wind Speed (160 m)' },
		{ name: 'wind_speed_180m', label: 'Wind Speed (180 m)' },
		{ name: 'wind_speed_200m', label: 'Wind Speed (200 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ name: 'wind_direction_30m', label: 'Wind Direction (30 m)' },
		{ name: 'wind_direction_50m', label: 'Wind Direction (50 m)' },
		{ name: 'wind_direction_70m', label: 'Wind Direction (70 m)' },
		{ name: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
		{ name: 'wind_direction_120m', label: 'Wind Direction (120 m)' },
		{ name: 'wind_direction_140m', label: 'Wind Direction (140 m)' },
		{ name: 'wind_direction_160m', label: 'Wind Direction (160 m)' },
		{ name: 'wind_direction_180m', label: 'Wind Direction (180 m)' },
		{ name: 'wind_direction_200m', label: 'Wind Direction (200 m)' },
		{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	],
	[
		{ name: 'surface_temperature', label: 'Surface Temperature' },
		{ name: 'soil_temperature_0_to_10cm', label: 'Soil Temperature (0-10 cm)' },
		{ name: 'soil_temperature_10_to_40cm', label: 'Soil Temperature (10-40 cm)' },
		{ name: 'soil_temperature_40_to_100cm', label: 'Soil Temperature (40-100 cm)' },
		{ name: 'soil_temperature_100_to_200cm', label: 'Soil Temperature (100-200 cm)' },
		{ name: 'soil_moisture_0_to_10cm', label: 'Soil Moisture (0-10 cm)' },
		{ name: 'soil_moisture_10_to_40cm', label: 'Soil Moisture (10-40 cm)' },
		{ name: 'soil_moisture_40_to_100cm', label: 'Soil Moisture (40-100 cm)' },
		{ name: 'soil_moisture_100_to_200cm', label: 'Soil Moisture (100-200 cm)' }
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
		{ name: 'sunshine_duration', label: 'Sunshine Duration' },
		{ name: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
	],
	[
		{ name: 'cape', label: 'CAPE' },
		{ name: 'lifted_index', label: 'Lifted Index' },
		{ name: 'convective_inhibition', label: 'Convective Inhibition' }
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

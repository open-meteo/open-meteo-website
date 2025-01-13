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
	forecast_days: '7',
	forecast_hours: '',
	forecast_minutely_15: '',
	temporal_resolution: '',
	tilt: 0,
	azimuth: 0,
	start_date: '',
	end_date: '',
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
	10, 15, 20, 30, 40, 50, 70, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425,
	450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900,
	925, 950, 975, 1000
].reverse();

export const hourly = [
	[
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' },
		{ name: 'precipitation_probability', label: 'Precipitation Probability' },
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
		{ name: 'evapotranspiration', label: 'Evapotranspiration' },
		{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ name: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ name: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
		{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ name: 'temperature_80m', label: 'Temperature (80 m)' }
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

export const minutely_15 = [
	[
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' },
		{ name: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ name: 'rain', label: 'Rain' },
		{ name: 'snowfall', label: 'Snowfall' },
		{ name: 'sunshine_duration', label: 'Sunshine Duration' }
	],
	[
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ name: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
		{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ name: 'visibility', label: 'Visibility' },
		{ name: 'cape', label: 'CAPE' },
		{ name: 'is_day', label: 'Is Day or Night' }
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
		{ name: 'uv_index', label: 'UV Index' },
		{ name: 'uv_index_clear_sky', label: 'UV Index Clear Sky' },
		{ name: 'is_day', label: 'Is Day or Night' },
		{ name: 'sunshine_duration', label: 'Sunshine Duration' },
		{ name: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' },
		{
			name: 'total_column_integrated_water_vapour',
			label: 'Total Column Integrated Water Vapour'
		}
	],
	[
		{ name: 'cape', label: 'CAPE' },
		{ name: 'lifted_index', label: 'Lifted Index' },
		{ name: 'convective_inhibition', label: 'Convective Inhibition' },
		{ name: 'freezing_level_height', label: 'Freezing Level Height' },
		{ name: 'boundary_layer_height', label: 'Boundary Layer Height PBL' },
		{ name: 'mass_density_8m', label: 'Mass Density (8 m)' }
	],
	[
		{ name: 'thunderstorm_probability', label: 'Thunderstorm Probability' },
		{ name: 'rain_probability', label: 'Rain Probability' },
		{ name: 'snowfall_probability', label: 'Snowfall Probability' },
		{ name: 'freezing_rain_probability', label: 'Freezing Rain Probability' },
		{ name: 'ice_pellets_probability', label: 'Ice Probability' },
		{ name: 'precipitation_probability', label: 'Precipitation Probability (>0.254 mm / 0.01")' }
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
	[
		{ name: 'gfs_seamless', label: 'GFS Seamless' },
		{ name: 'gfs_global', label: 'GFS Global 0.11°/0.25°' },
		{ name: 'gfs_hrrr', label: 'HRRR Conus' },
		{ name: 'ncep_nbm_conus', label: 'NBM Conus' },
		{ name: 'gfs_graphcast025', label: 'GFS GraphCast' }
	]
];

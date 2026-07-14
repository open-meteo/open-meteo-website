export const pressureVariables = [
	{ value: 'temperature', label: 'Temperature' },
	{ value: 'dew_point', label: 'Dewpoint' },
	{ value: 'relative_humidity', label: 'Relative Humidity' },
	{ value: 'cloud_cover', label: 'Cloud Cover' },
	{ value: 'wind_speed', label: 'Wind Speed' },
	{ value: 'wind_direction', label: 'Wind Direction' },
	{ value: 'vertical_velocity', label: 'Vertical Velocity' },
	{ value: 'geopotential_height', label: 'Geopotential Height' }
];

export const levels = [
	10, 15, 20, 30, 40, 50, 70, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425,
	450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900,
	925, 950, 975, 1000
].reverse();

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'precipitation_probability', label: 'Precipitation Probability' },
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
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ value: 'temperature_80m', label: 'Temperature (80 m)' }
	],
	[
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

export const minutely_15 = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' }
	],
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ value: 'visibility', label: 'Visibility' },
		{ value: 'cape', label: 'CAPE' },
		{ value: 'is_day', label: 'Is Day or Night' }
	]
];

export const additionalVariables = [
	[
		{ value: 'uv_index', label: 'UV Index' },
		{ value: 'uv_index_clear_sky', label: 'UV Index Clear Sky' },
		{ value: 'is_day', label: 'Is Day or Night' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' },
		{
			value: 'total_column_integrated_water_vapour',
			label: 'Total Column Integrated Water Vapour'
		}
	],
	[
		{ value: 'cape', label: 'CAPE' },
		{ value: 'lifted_index', label: 'Lifted Index' },
		{ value: 'convective_inhibition', label: 'Convective Inhibition' },
		{ value: 'freezing_level_height', label: 'Freezing Level Height' },
		{ value: 'boundary_layer_height', label: 'Boundary Layer Height PBL' },
		{ value: 'mass_density_8m', label: 'Mass Density (8 m)' }
	],
	[
		{ value: 'thunderstorm_probability', label: 'Thunderstorm Probability' },
		{ value: 'rain_probability', label: 'Rain Probability' },
		{ value: 'snowfall_probability', label: 'Snowfall Probability' },
		{ value: 'freezing_rain_probability', label: 'Freezing Rain Probability' },
		{ value: 'ice_pellets_probability', label: 'Ice Probability' },
		{ value: 'precipitation_probability', label: 'Precipitation Probability (>0.254 mm / 0.01")' }
	]
];

export const models = [
	[
		{ value: 'ncep_gfs_seamless', label: 'GFS Seamless' },
		{ value: 'ncep_gfs_global', label: 'GFS Global 0.11°/0.25°' },
		{ value: 'ncep_gfs_graphcast025', label: 'GFS GraphCast' },
		{ value: 'ncep_aigfs025', label: 'AIGFS 0.25°' },
		{ value: 'ncep_hgefs025_ensemble_mean', label: 'HGEFS 0.25° Ensemble Mean' }
	],
	[
		{ value: 'ncep_hrrr_conus', label: 'HRRR Conus' },
		{ value: 'ncep_hrrr_conus_15min', label: 'HRRR Conus 15 min' },
		{ value: 'ncep_nbm_conus', label: 'NBM Conus' },
		{ value: 'ncep_nam_conus', label: 'NAM Conus' }
	],
	[],
	[]
];

export const defaultParameters = {
	daily: [],
	hourly: [],
	models: [],

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
	precipitation_unit: 'mm',
	temperature_unit: 'celsius'
};

export const icon_global_variables = [
	'weather_code',
	'temperature_2m',
	'surface_pressure',
	'pressure_msl',
	'relative_humidity_2m',
	'dew_point_2m',
	'apparent_temperature',
	'precipitation',
	'snowfall',
	'cloud_cover',
	'et0_fao_evapotranspiration',
	'vapour_pressure_deficit',
	'wind_speed_10m',
	'wind_direction_10m',
	'rain',
	'shortwave_radiation'
];

export const icon_eu_variables = [
	'weather_code',
	'temperature_2m',
	'surface_pressure',
	'pressure_msl',
	'precipitation',
	'snowfall',
	'cloud_cover',
	'wind_speed_10m',
	'wind_direction_10m',
	'wind_gusts_10m',
	'wind_speed_80m',
	'wind_direction_80m',
	'temperature_80m',
	'rain',
	'cape',
	'shortwave_radiation'
];

export const icon_d2_variables = [
	'weather_code',
	'temperature_2m',
	'surface_pressure',
	'pressure_msl',
	'relative_humidity_2m',
	'dew_point_2m',
	'apparent_temperature',
	'precipitation',
	'snowfall',
	'cloud_cover',
	'et0_fao_evapotranspiration',
	'vapour_pressure_deficit',
	'wind_speed_10m',
	'wind_speed_80m',
	'wind_speed_180m',
	'wind_direction_10m',
	'wind_direction_80m',
	'wind_direction_180m',
	'wind_gusts_10m',
	'temperature_80m',
	'rain',
	'cape',
	'shortwave_radiation',
	'temperature_500hPa',
	'temperature_850hPa',
	'geopotential_height_500hPa',
	'geopotential_height_850hPa'
];

export const gfs025_variables = [
	'temperature_2m',
	'visibility',
	'wind_gusts_10m',
	'surface_pressure',
	'pressure_msl',
	'soil_temperature_0_to_10cm',
	'soil_moisture_0_to_10cm',
	'snow_depth',
	'relative_humidity_2m',
	'dew_point_2m',
	'wind_speed_10m',
	'wind_direction_10m',
	'precipitation',
	'snowfall',
	'cape',
	'cloud_cover',
	'apparent_temperature',
	'weather_code',
	'et0_fao_evapotranspiration',
	'vapour_pressure_deficit',
	'cape',
	'convective_inhibition',
	'rain',
	'shortwave_radiation'
];

export const gfs05_variables = [
	...gfs025_variables,
	'snow_depth',
	'wind_speed_80m',
	'wind_direction_80m',
	'wind_speed_100m',
	'wind_direction_100m',
	'wind_speed_120m',
	'wind_direction_120m',
	'soil_temperature_10_to_40cm',
	'soil_temperature_40_to_100cm',
	'soil_temperature_100_to_200cm',
	'soil_moisture_10_to_40cm',
	'soil_moisture_40_to_100cm',
	'soil_moisture_100_to_200cm',
	'uv_index',
	'uv_index_clear_sky',
	'cape',
	'freezing_level_height',
	'rain',
	'surface_temperature',
	'temperature_80m',
	'temperature_120m',
	'shortwave_radiation',
	'temperature_500hPa',
	'temperature_850hPa',
	'geopotential_height_500hPa',
	'geopotential_height_850hPa'
];

export const ecmwf_variables = [
	'temperature_2m',
	'precipitation',
	'rain',
	'snowfall',
	'relative_humidity_2m',
	'dew_point_2m',
	'apparent_temperature',
	'vapour_pressure_deficit',
	'weather_code',
	'surface_pressure',
	'pressure_msl',
	'cloud_cover',
	'cloud_cover_high',
	'cloud_cover_mid',
	'cloud_cover_low',
	'wind_speed_10m',
	'wind_direction_10m',
	'wind_speed_100m',
	'wind_direction_100m',
	'wind_gusts_10m',
	'surface_temperature',
	'rain',
	'soil_temperature_0_to_10cm',
	'temperature_500hPa',
	'temperature_850hPa',
	'geopotential_height_500hPa',
	'geopotential_height_850hPa',
	'et0_fao_evapotranspiration',
	'shortwave_radiation',
	'cape'
];

export const ukmo_variables = [
	'temperature_2m',
	'rain',
	'snowfall',
	'snow_depth',
	'precipitation',
	'et0_fao_evapotranspiration',
	'relative_humidity_2m',
	'dew_point_2m',
	'apparent_temperature',
	'vapour_pressure_deficit',
	'weather_code',
	'surface_pressure',
	'pressure_msl',
	'cloud_cover',
	'wind_speed_10m',
	'wind_direction_10m',
	'wind_gusts_10m',
	'surface_temperature',
	'visibility',
	'cape',
	'shortwave_radiation'
];

export const ukmo_2km_variables = [
	...ukmo_variables,
	'cloud_cover_high',
	'cloud_cover_mid',
	'cloud_cover_low',
];

export const gem_global_variables = [
	'temperature_2m',
	'surface_pressure',
	'snow_depth',
	'relative_humidity_2m',
	'dew_point_2m',
	'wind_speed_10m',
	'wind_direction_10m',
	'precipitation',
	'snowfall',
	'cape',
	'cloud_cover',
	'apparent_temperature',
	'weather_code',
	'pressure_msl',
	'et0_fao_evapotranspiration',
	'vapour_pressure_deficit',
	'cape',
	'rain',
	'shortwave_radiation',
	'temperature_500hPa',
	'temperature_850hPa',
	'geopotential_height_500hPa',
	'geopotential_height_850hPa'
];

export const bom_access_global_ensemble = [
	'temperature_2m',
	'surface_pressure',
	'snow_depth',
	'relative_humidity_2m',
	'dew_point_2m',
	'wind_speed_10m',
	'wind_gusts_10m',
	'wind_direction_10m',
	'precipitation',
	'snowfall',
	'cape',
	'cloud_cover',
	'apparent_temperature',
	'weather_code',
	'pressure_msl',
	'et0_fao_evapotranspiration',
	'vapour_pressure_deficit',
	'visibility',
	'sunshine_duration',
	'rain',
	'shortwave_radiation',
	'surface_temperature',
	'soil_temperature_0_to_10cm',
	'soil_temperature_10_to_40cm',
	'soil_temperature_40_to_100cm',
	'soil_temperature_100_to_200cm',
	'soil_moisture_0_to_10cm',
	'soil_moisture_10_to_40cm',
	'soil_moisture_40_to_100cm',
	'soil_moisture_100_to_200cm'
];

export const meteoswiss = [
	'temperature_2m',
	'surface_pressure',
	'snow_depth',
	'relative_humidity_2m',
	'dew_point_2m',
	'wind_speed_10m',
	'wind_gusts_10m',
	'wind_direction_10m',
	'precipitation',
	'snowfall',
	'convective_inhibition',
	'cape',
	'cloud_cover',
	'apparent_temperature',
	'weather_code',
	'pressure_msl',
	'et0_fao_evapotranspiration',
	'vapour_pressure_deficit',
	'sunshine_duration',
	'rain',
	'shortwave_radiation',
	'surface_temperature',
	'cloud_base',
	'cloud_cover_high',
	'cloud_cover_mid',
	'cloud_cover_low',
	'freezing_level_height',
	'snowfall_height'
];

export const availableVariables = {
	icon_seamless: icon_d2_variables,
	icon_global: icon_global_variables,
	icon_eu: icon_eu_variables,
	icon_d2: icon_d2_variables,
	gfs_seamless: gfs05_variables,
	gfs025: gfs025_variables,
	gfs05: gfs05_variables,
	ecmwf_ifs025: ecmwf_variables,
	ecmwf_aifs025: ecmwf_variables,
	ukmo_global_ensemble_20km: ukmo_variables,
	ukmo_uk_ensemble_2km: ukmo_2km_variables,
	gem_global: gem_global_variables,
	bom_access_global_ensemble: bom_access_global_ensemble,
	meteoswiss_icon_ch1: meteoswiss,
	meteoswiss_icon_ch2: meteoswiss
};

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'precipitation', label: 'Precipitation (rain + snow)' },
		{ value: 'rain', label: 'Rain' },
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
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
		{ value: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ value: 'wind_speed_120m', label: 'Wind Speed (120 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
		{ value: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
		{ value: 'wind_direction_120m', label: 'Wind Direction (120 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ value: 'temperature_80m', label: 'Temperature (80 m)' },
		{ value: 'temperature_120m', label: 'Temperature (120 m)' }
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
		{ value: 'soil_moisture_100_to_200cm', label: 'Soil Moisture (100-400 cm)' }
	]
];

export const daily = [
	[
		{ value: 'temperature_2m_mean', label: 'Mean Temperature (2 m)' },
		{ value: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ value: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ value: 'apparent_temperature_mean', label: 'Mean Apparent Temperature' },
		{ value: 'apparent_temperature_min', label: 'Minimum Apparent Temperature' },
		{ value: 'apparent_temperature_max', label: 'Maximum Apparent Temperature' },
		{ value: 'wind_speed_10m_mean', label: 'Mean Wind Speed (10 m)' },
		{ value: 'wind_speed_10m_min', label: 'Minimum Wind Speed (10 m)' },
		{ value: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
		{ value: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' }
	],
	[
		{ value: 'wind_gusts_10m_mean', label: 'Mean Wind Gusts (10 m)' },
		{ value: 'wind_gusts_10m_min', label: 'Minimum Wind Gusts (10 m)' },
		{ value: 'wind_gusts_10m_max', label: 'Maximum Wind Gusts (10 m)' },
		{ value: 'wind_speed_100m_mean', label: 'Mean Wind Speed (100 m)' },
		{ value: 'wind_speed_100m_min', label: 'Minimum Wind Speed (100 m)' },
		{ value: 'wind_speed_100m_max', label: 'Maximum Wind Speed (100 m)' },
		{ value: 'wind_direction_100m_dominant', label: 'Dominant Wind Direction (100m)' },
		{ value: 'cloud_cover_mean', label: 'Mean Cloud Cover' },
		{ value: 'cloud_cover_min', label: 'Minimum Cloud Cover' },
		{ value: 'cloud_cover_max', label: 'Maximum Cloud Cover' }
	],
	[
		{ value: 'precipitation_sum', label: 'Precipitation Sum' },
		{ value: 'precipitation_hours', label: 'Precipitation Hours' },
		{ value: 'rain_sum', label: 'Rain Sum' },
		{ value: 'snowfall_sum', label: 'Snowfall Sum' },
		{ value: 'pressure_msl_mean', label: 'Mean Sealevel Pressure' },
		{ value: 'pressure_msl_min', label: 'Minimum Sealevel Pressure' },
		{ value: 'pressure_msl_max', label: 'Maximum Sealevel Pressure' },
		{ value: 'surface_pressure_mean', label: 'Mean Surface Pressure' },
		{ value: 'surface_pressure_min', label: 'Minimum Surface Pressure' },
		{ value: 'surface_pressure_max', label: 'Maximum Surface Pressure' }
	],
	[
		{ value: 'relative_humidity_2m_mean', label: 'Mean Relative Humidity (2 m)' },
		{ value: 'relative_humidity_2m_min', label: 'Minimum Relative Humidity (2 m)' },
		{ value: 'relative_humidity_2m_max', label: 'Maximum Relative Humidity (2 m)' },
		{ value: 'cape_mean', label: 'Mean CAPE' },
		{ value: 'cape_min', label: 'Minimum CAPE' },
		{ value: 'cape_max', label: 'Maximum CAPE' },
		{ value: 'dew_point_2m_mean', label: 'Mean Dewpoint (2 m)' },
		{ value: 'dew_point_2m_min', label: 'Minimum Dewpoint (2 m)' },
		{ value: 'dew_point_2m_max', label: 'Maximum Dewpoint (2 m)' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' }
	]
];

export const additionalVariables = [
	[
		{ value: 'uv_index', label: 'UV Index' },
		{ value: 'uv_index_clear_sky', label: 'UV Index Clear Sky' },
		{ value: 'temperature_500hPa', label: 'Temperature (500 hPa)' },
		{ value: 'temperature_850hPa', label: 'Temperature (850 hPa)' },
		{ value: 'geopotential_height_500hPa', label: 'Geopotential Height (500 hPa)' },
		{ value: 'geopotential_height_850hPa', label: 'Geopotential Height (850 hPa)' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
	],
	[
		{ value: 'cape', label: 'CAPE' },
		{ value: 'convective_inhibition', label: 'Convective Inhibition (CIN)' },
		{ value: 'freezing_level_height', label: 'Freezing Level Height' },
		{ value: 'snowfall_height', label: 'Snowfall Height' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' }
	]
];

export const solarVariables = [
	[
		{ value: 'shortwave_radiation', label: 'Shortwave Solar Radiation GHI' },
		{ value: 'direct_radiation', label: 'Direct Solar Radiation' },
		{ value: 'diffuse_radiation', label: 'Diffuse Solar Radiation DHI' },
		{ value: 'direct_normal_irradiance', label: 'Direct Normal Irradiance DNI' },
		{ value: 'global_tilted_irradiance', label: 'Global Tilted Radiation GTI' }
	],
	[
		{ value: 'shortwave_radiation_instant', label: 'Shortwave Solar Radiation GHI (Instant)' },
		{ value: 'direct_radiation_instant', label: 'Direct Solar Radiation (Instant)' },
		{ value: 'diffuse_radiation_instant', label: 'Diffuse Solar Radiation DHI (Instant)' },
		{ value: 'direct_normal_irradiance_instant', label: 'Direct Normal Irradiance DNI (Instant)' },
		{ value: 'global_tilted_irradiance_instant', label: 'Global Tilted Radiation GTI (Instant)' }
	]
];

export const models = [
	[
		{ value: 'icon_seamless', label: 'DWD ICON EPS Seamless' },
		{ value: 'icon_global', label: 'DWD ICON EPS Global' },
		{ value: 'icon_eu', label: 'DWD ICON EPS EU' },
		{ value: 'icon_d2', label: 'DWD ICON EPS D2' }
	],
	[
		{ value: 'gfs_seamless', label: 'GFS Ensemble Seamless' },
		{ value: 'gfs025', label: 'GFS Ensemble 0.25' },
		{ value: 'gfs05', label: 'GFS Ensemble 0.5' }
	],
	[
		{ value: 'ecmwf_ifs025', label: 'ECMWF IFS 0.25° Ensemble' },
		{ value: 'ecmwf_aifs025', label: 'ECMWF AIFS 0.25° Ensemble' },
		{ value: 'gem_global', label: 'GEM Global Ensemble' },
		{ value: 'bom_access_global_ensemble', label: 'BOM ACCESS Global' }
	],
	[
		{ value: 'ukmo_global_ensemble_20km', label: 'UK MetOffice Global 20km' },
		{ value: 'ukmo_uk_ensemble_2km', label: 'UK MetOffice UK 2km' }
	],
	[
		{ value: 'meteoswiss_icon_ch1', label: 'MeteoSwiss ICON CH1' },
		{ value: 'meteoswiss_icon_ch2', label: 'MeteoSwiss ICON CH2' }
	]
];

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '3', label: '3 days' },
	{ value: '7', label: '7 days (default)' },
	{ value: '14', label: '14 days' },
	{ value: '16', label: '16 days' },
	{ value: '30', label: '30 days' },
	{ value: '35', label: '35 days' }
];

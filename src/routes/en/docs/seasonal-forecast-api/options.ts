export const defaultParameters = {
	daily: [],
	hourly: [],
	monthly: [],
	models: ['ecmwf_seas5_seamless'],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: '',

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: '7',

	start_date: '',
	end_date: '',

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
};

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'dew_point_2m', label: 'Dew Point (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature (2 m)' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' },
		{ value: 'soil_temperature_0_to_7cm', label: 'Soil Temperature (0-7 cm)' },
		{ value: 'weather_code', label: 'Weather Code' }
	],
	[
		{ value: 'pressure_msl', label: 'Sealevel Pressure' },
		{ value: 'cloud_cover', label: 'Total Cloud Cover' },
		{ value: 'precipitation', label: 'Total Precipitation' },
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'sea_surface_temperature', label: 'Sea Surface Temperature' },
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' }
	],
	[]
];

export const daily = [
	[
		{ value: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ value: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ value: 'temperature_2m_mean', label: 'Mean Temperature (2 m)' },
		{ value: 'apparent_temperature_max', label: 'apparent_temperature_max' },
		{ value: 'apparent_temperature_min', label: 'apparent_temperature_min' },
		{ value: 'apparent_temperature_mean', label: 'apparent_temperature_mean' },
		{ value: 'relative_humidity_2m_max', label: 'relative_humidity_2m_max' },
		{ value: 'relative_humidity_2m_min', label: 'relative_humidity_2m_min' },
		{ value: 'relative_humidity_2m_mean', label: 'relative_humidity_2m_mean' },
		{ value: 'dew_point_2m_max', label: 'dew_point_2m_max' },
		{ value: 'dew_point_2m_min', label: 'dew_point_2m_min' },
		{ value: 'dew_point_2m_mean', label: 'dew_point_2m_min' },
		{ value: 'pressure_msl_max', label: 'pressure_msl_max' },
		{ value: 'pressure_msl_min', label: 'pressure_msl_min' },
		{ value: 'pressure_msl_mean', label: 'pressure_msl_mean' },
		{ value: 'surface_pressure_max', label: 'surface_pressure_max' },
		{ value: 'surface_pressure_min', label: 'surface_pressure_min' },
		{ value: 'surface_pressure_mean', label: 'surface_pressure_mean' },
		{ value: 'wet_bulb_temperature_2m_max', label: 'wet_bulb_temperature_2m_max' },
		{ value: 'wet_bulb_temperature_2m_min', label: 'wet_bulb_temperature_2m_min' },
		{ value: 'wet_bulb_temperature_2m_mean', label: 'wet_bulb_temperature_2m_mean' }
	],
	[
		{ value: 'precipitation_sum', label: 'Precipitation Sum' },
		{ value: 'rain_sum', label: 'Rain Sum' },
		{ value: 'snowfall_sum', label: 'snowfall_sum' },
		{ value: 'snowfall_water_equivalent_sum', label: 'snowfall_water_equivalent_sum' },
		{ value: 'et0_fao_evapotranspiration_sum', label: 'et0_fao_evapotranspiration_sum' },
		{ value: 'vapour_pressure_deficit_max', label: 'vapour_pressure_deficit_max' },
		{ value: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' },
		{ value: 'cloud_cover_max', label: 'cloud_cover_max' },
		{ value: 'cloud_cover_min', label: 'cloud_cover_min' },
		{ value: 'cloud_cover_mean', label: 'cloud_cover_mean' },
		{ value: 'sunrise', label: 'sunrise' },
		{ value: 'sunset', label: 'sunset' },
		{ value: 'daylight_duration', label: 'daylight_duration' },
		{ value: 'sunshine_duration', label: 'Sunshine duration' },
		{ value: 'weather_code', label: 'weather_code' },
		{ value: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
		{ value: 'wind_speed_10m_min', label: 'wind_speed_10m_min' },
		{ value: 'wind_speed_10m_mean', label: 'wind_speed_10m_mean' },
		{ value: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' }
	],
	[
		{ value: 'sea_surface_temperature_max', label: 'sea_surface_temperature_max' },
		{ value: 'sea_surface_temperature_min', label: 'sea_surface_temperature_min' },
		{ value: 'sea_surface_temperature_mean', label: 'sea_surface_temperature_mean' },
		{ value: 'soil_temperature_0_to_7cm', label: 'Soil Temperature (0-7 cm)' },
		{ value: 'soil_temperature_7_to_28cm', label: 'Soil Temperature (7-28 cm)' },
		{ value: 'soil_temperature_28_to_100cm', label: 'Soil Temperature (28-100 cm)' },
		{ value: 'soil_temperature_100_to_255cm', label: 'Soil Temperature (100-255 cm)' },
		{ value: 'soil_moisture_0_to_7cm', label: 'Soil Moisture (0-7 cm)' },
		{ value: 'soil_moisture_7_to_28cm', label: 'Soil Moisture (7-28 cm)' },
		{ value: 'soil_moisture_28_to_100cm', label: 'Soil Moisture (28-100 cm)' },
		{ value: 'soil_moisture_100_to_255cm', label: 'Soil Moisture (100-255 cm)' }
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

export const monthly = [
	[
		{ value: 'temperature_2m_mean', label: 'temperature_2m_mean' },
		{ value: 'temperature_max24h_2m_mean', label: 'temperature_max24h_2m_mean' },
		{ value: 'temperature_min24h_2m_mean', label: 'temperature_min24h_2m_mean' },
		{ value: 'dew_point_2m_mean', label: 'dew_point_2m_mean' },
		{ value: 'pressure_msl_mean', label: 'pressure_msl_mean' },
		{ value: 'sea_surface_temperature_mean', label: 'sea_surface_temperature_mean' },
		{ value: 'cloud_cover_mean', label: 'cloud_cover_mean' },
		{ value: 'cloud_cover_low_mean', label: 'cloud_cover_low_mean' },
		{ value: 'precipitation_mean', label: 'precipitation_mean' },
		{ value: 'showers_mean', label: 'showers_mean' },
		{ value: 'runoff_mean', label: 'runoff_mean' },
		{ value: 'snow_density_mean', label: 'snow_density_mean' },
		{ value: 'snow_depth_mean', label: 'snow_depth_mean' },
		{ value: 'snowfall_mean', label: 'snowfall_mean' },
		{ value: 'snowfall_water_equivalent_mean', label: 'snowfall_water_equivalent_mean' },
		{
			value: 'total_column_integrated_water_vapour_mean',
			label: 'total_column_integrated_water_vapour_mean'
		},
		{ value: 'shortwave_radiation_mean', label: 'shortwave_radiation_mean' },
		{ value: 'albedo_mean', label: 'albedo_mean' },
		{ value: 'sunshine_duration_mean', label: 'sunshine_duration_mean' },
		{ value: 'sunshine_duration_anomaly', label: 'sunshine_duration_anomaly' },
		{ value: 'soil_temperature_0_to_7cm_mean', label: 'soil_temperature_0_to_7cm_mean' },
		{ value: 'soil_temperature_7_to_28cm_mean', label: 'soil_temperature_7_to_28cm_mean' },
		{ value: 'soil_temperature_28_to_100cm_mean', label: 'soil_temperature_28_to_100cm_mean' },
		{ value: 'soil_temperature_100_to_255cm_mean', label: 'soil_temperature_100_to_255cm_mean' },
		{
			value: 'soil_temperature_100_to_255cm_anomaly',
			label: 'soil_temperature_100_to_255cm_anomaly'
		},
		{ value: 'soil_moisture_0_to_7cm_mean', label: 'soil_moisture_0_to_7cm_mean' },
		{ value: 'soil_moisture_7_to_28cm_mean', label: 'soil_moisture_7_to_28cm_mean' },
		{ value: 'soil_moisture_28_to_100cm_mean', label: 'soil_moisture_28_to_100cm_mean' },
		{ value: 'soil_moisture_100_to_255cm_mean', label: 'soil_moisture_100_to_255cm_mean' },
		{ value: 'wind_speed_10m_mean', label: 'wind_speed_10m_mean' }
	],
	[
		{ value: 'temperature_2m_anomaly', label: 'temperature_2m_anomaly' },
		{ value: 'temperature_max24h_2m_anomaly', label: 'temperature_max24h_2m_anomaly' },
		{ value: 'temperature_min24h_2m_anomaly', label: 'temperature_min24h_2m_anomaly' },
		{ value: 'dew_point_2m_anomaly', label: 'dew_point_2m_anomaly' },
		{ value: 'pressure_msl_anomaly', label: 'pressure_msl_anomaly' },
		{ value: 'sea_surface_temperature_anomaly', label: 'sea_surface_temperature_anomaly' },
		{ value: 'cloud_cover_anomaly', label: 'cloud_cover_anomaly' },
		{ value: 'cloud_cover_low_anomaly', label: 'cloud_cover_low_anomaly' },
		{ value: 'precipitation_anomaly', label: 'precipitation_anomaly' },
		{ value: 'showers_anomaly', label: 'showers_anomaly' },
		{ value: 'runoff_anomaly', label: 'runoff_anomaly' },
		{ value: 'snow_density_anomaly', label: 'snow_density_anomaly' },
		{ value: 'snow_depth_anomaly', label: 'snow_depth_anomaly' },
		{ value: 'snowfall_anomaly', label: 'snowfall_anomaly' },
		{ value: 'snowfall_water_equivalent_anomaly', label: 'snowfall_water_equivalent_anomaly' },
		{
			value: 'total_column_integrated_water_vapour_anomaly',
			label: 'total_column_integrated_water_vapour_anomaly'
		},
		{ value: 'shortwave_radiation_anomaly', label: 'shortwave_radiation_anomaly' },
		{ value: 'albedo_anomaly', label: 'albedo_anomaly' },
		{ value: 'soil_temperature_0_to_7cm_anomaly', label: 'soil_temperature_0_to_7cm_anomaly' },
		{ value: 'soil_temperature_7_to_28cm_anomaly', label: 'soil_temperature_7_to_28cm_anomaly' },
		{
			value: 'soil_temperature_28_to_100cm_anomaly',
			label: 'soil_temperature_28_to_100cm_anomaly'
		},
		{ value: 'soil_moisture_0_to_7cm_anomaly', label: 'soil_moisture_0_to_7cm_anomaly' },
		{ value: 'soil_moisture_7_to_28cm_anomaly', label: 'soil_moisture_7_to_28cm_anomaly' },
		{ value: 'soil_moisture_28_to_100cm_anomaly', label: 'soil_moisture_28_to_100cm_anomaly' },
		{ value: 'soil_moisture_100_to_255cm_anomaly', label: 'soil_moisture_100_to_255cm_anomaly' },
		{ value: 'wind_speed_10m_anomaly', label: 'wind_speed_10m_anomaly' },
		{ value: 'wind_gusts_10m_anomaly', label: 'wind_gusts_10m_anomaly' }
	]
];

export const models = [
	[
		{ value: 'ecmwf_seas5_seamless', label: 'ECMWF SEAS5' },
		{ value: 'ecmwf_ifs_seas_seamless', label: 'ECMWF IFS SEAS' }
	]
];

export const temporalResolutionOptions = [
	{ value: '', label: '1 Hourly' },
	{ value: 'hourly_3', label: '3 Hourly' },
	{ value: 'hourly_6', label: '6 Hourly (default)' },
	{ value: 'hourly_12', label: '12 Hourly' },
	{ value: 'native', label: 'Native Model Resolution' }
];

export const forecastDaysOptions = [
	{ value: '7', label: '7 days' },
	{ value: '45', label: '45 days' },
	{ value: '92', label: '3 months' },
	{ value: '183', label: '6 months (default)' },
	{ value: '214', label: '7 months' }
];

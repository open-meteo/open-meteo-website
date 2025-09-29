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
		{ value: 'apparent_temperature', label: 'Apparent Temperature (2 m)' }
	],
	[
		{ value: 'weather_code', label: 'Weather Code' },
		{ value: 'precipitation', label: 'Total Precipitation' },
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'rain', label: 'Rain' }
	],
	[
		{ value: 'pressure_msl', label: 'Sealevel Pressure' },
		{ value: 'cloud_cover', label: 'Total Cloud Cover' },
		{ value: 'sea_surface_temperature', label: 'Sea Surface Temperature' },
		{ value: 'soil_temperature_0_to_7cm', label: 'Soil Temperature (0-7 cm)' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	]
];

export const daily = [
	[
		{ value: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ value: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ value: 'temperature_2m_mean', label: 'Mean Temperature (2 m)' },
		{ value: 'apparent_temperature_max', label: 'Apparent Temperature Max' },
		{ value: 'apparent_temperature_min', label: 'Apparent Temperature Min' },
		{ value: 'apparent_temperature_mean', label: 'Apparent Temperature Mean' },
		{ value: 'relative_humidity_2m_max', label: 'Relative Humidity (2 m) Max' },
		{ value: 'relative_humidity_2m_min', label: 'Relative Humidity (2 m) Min' },
		{ value: 'relative_humidity_2m_mean', label: 'Relative Humidity (2 m) Mean' },
		{ value: 'dew_point_2m_max', label: 'Dew Point (2 m) Max' },
		{ value: 'dew_point_2m_min', label: 'Dew Point (2 m) Min' },
		{ value: 'dew_point_2m_mean', label: 'Dew Point (2 m) Mean' },
		{ value: 'sunrise', label: 'Sunrise' },
		{ value: 'sunset', label: 'Sunset' }
	],
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'precipitation_sum', label: 'Precipitation Sum' },
		{ value: 'rain_sum', label: 'Rain Sum' },
		{ value: 'snowfall_sum', label: 'Snowfall Sum' },
		{ value: 'snowfall_water_equivalent_sum', label: 'Snowfall Water Equivalent Sum' },
		{ value: 'et0_fao_evapotranspiration_sum', label: 'Reference Evapotranspiration (ET₀) Sum' },
		{ value: 'vapour_pressure_deficit_max', label: 'Vapour Pressure Deficit Max' },
		{ value: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' },
		{ value: 'cloud_cover_max', label: 'Cloud cover Max' },
		{ value: 'cloud_cover_min', label: 'Cloud cover Min' },
		{ value: 'cloud_cover_mean', label: 'Cloud cover Mean' },

		{ value: 'daylight_duration', label: 'Daylight Duration' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' }
	],
	[
		{ value: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
		{ value: 'wind_speed_10m_min', label: 'Wind Speed (10 m) Min' },
		{ value: 'wind_speed_10m_mean', label: 'Wind Speed (10 m) Mean' },
		{ value: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' },
		{ value: 'pressure_msl_max', label: 'Sealevel Pressure Max' },
		{ value: 'pressure_msl_min', label: 'Sealevel Pressure Min' },
		{ value: 'pressure_msl_mean', label: 'Sealevel Pressure Mean' },
		{ value: 'surface_pressure_max', label: 'Surface Pressure Max' },
		{ value: 'surface_pressure_min', label: 'Surface Pressure Min' },
		{ value: 'surface_pressure_mean', label: 'Surface Pressure Mean' },
		{ value: 'wet_bulb_temperature_2m_max', label: 'Wet Bulb Temperature (2 m) Max' },
		{ value: 'wet_bulb_temperature_2m_min', label: 'Wet Bulb Temperature (2 m) Min' },
		{ value: 'wet_bulb_temperature_2m_mean', label: 'Wet Bulb Temperature (2 m) Mean' }
	],
	[
		{ value: 'sea_surface_temperature_max', label: 'Sea Surface Temperature Max' },
		{ value: 'sea_surface_temperature_min', label: 'Sea Surface Temperature Min' },
		{ value: 'sea_surface_temperature_mean', label: 'Sea Surface Temperature Mean' },
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
		{ value: 'temperature_2m_mean', label: ' Temperature (2 m) Mean' },
		{ value: 'temperature_max24h_2m_mean', label: 'Temperature (2 m) Max 24h Mean' },
		{ value: 'temperature_min24h_2m_mean', label: 'Temperature (2 m) Min 24h Mean' },
		{ value: 'dew_point_2m_mean', label: 'Dew Point (2 m) Mean' },
		{ value: 'cloud_cover_mean', label: 'Cloud cover Mean' },
		{ value: 'cloud_cover_low_mean', label: 'Cloud cover Low Mean' },
		{ value: 'precipitation_mean', label: 'Precipitation Mean' },
		{ value: 'showers_mean', label: 'Showers Mean' },
		{ value: 'runoff_mean', label: 'Runoff Mean' },
		{ value: 'snow_density_mean', label: 'Snow Density Mean' },
		{ value: 'snow_depth_mean', label: 'Snow Depth Mean' },
		{ value: 'snow_depth_water_equivalent_mean', label: 'Snow Depth Mean (Water Equivalent)' },
		{ value: 'snowfall_mean', label: 'Snowfall Mean' },
		{ value: 'snowfall_water_equivalent_mean', label: 'Snowfall Water Equivalent Mean' },
		{
			value: 'total_column_integrated_water_vapour_mean',
			label: 'Total Column Integrated Water Vapour Mean'
		},
		{ value: 'shortwave_radiation_mean', label: 'Shortwave Radiation Mean' },
		{ value: 'albedo_mean', label: 'Albedo Mean' }
	],
	[
		{ value: 'temperature_2m_anomaly', label: 'Temperature (2 m) Anomaly' },
		{ value: 'temperature_max24h_2m_anomaly', label: 'Temperature (2 m) Max 24h Anomaly' },
		{ value: 'temperature_min24h_2m_anomaly', label: 'Temperature (2 m) Min 24h Anomaly' },
		{ value: 'dew_point_2m_anomaly', label: 'Dew Point (2 m) Anomaly' },
		{ value: 'cloud_cover_anomaly', label: 'Cloud cover Anomaly' },
		{ value: 'cloud_cover_low_anomaly', label: 'Cloud cover Low Anomaly' },
		{ value: 'precipitation_anomaly', label: 'Precipitation Anomaly' },
		{ value: 'showers_anomaly', label: 'Showers Anomaly' },
		{ value: 'runoff_anomaly', label: 'Runoff Anomaly' },
		{ value: 'snow_density_anomaly', label: 'Snow Density Anomaly' },
		{ value: 'snow_depth_anomaly', label: 'Snow Depth Anomaly' },
		{ value: 'snow_depth_water_equivalent_anomaly', label: 'Snow Depth Anomaly (Water Equivalent)' },
		{ value: 'snowfall_anomaly', label: 'Snowfall Anomaly' },
		{ value: 'snowfall_water_equivalent_anomaly', label: 'Snowfall Water Equivalent Anomaly' },
		{
			value: 'total_column_integrated_water_vapour_anomaly',
			label: 'Total Column Integrated Water Vapour Anomaly'
		},
		{ value: 'shortwave_radiation_anomaly', label: 'Shortwave Radiation Anomaly' },
		{ value: 'albedo_anomaly', label: 'Albedo Anomaly' }
	],
	[
		{ value: 'sunshine_duration_mean', label: 'Sunshine Duration Mean' },
		{ value: 'sunshine_duration_anomaly', label: 'Sunshine Duration Anomaly' },
		{ value: 'wind_speed_10m_mean', label: 'Wind Speed (10 m) Mean' },
		{ value: 'wind_speed_10m_anomaly', label: 'Wind Speed (10 m) Anomaly' },
		{ value: 'wind_gusts_10m_anomaly', label: 'Wind Gusts (10 m) Anomaly' },
		{ value: 'sea_surface_temperature_mean', label: 'Sea Surface Temperature Mean' },
		{ value: 'sea_surface_temperature_anomaly', label: 'Sea Surface Temperature Anomaly' },
		{ value: 'pressure_msl_mean', label: 'Sealevel Pressure Mean' },
		{ value: 'pressure_msl_anomaly', label: 'Sealevel Pressure Anomaly' },

		{ value: 'soil_temperature_0_to_7cm_mean', label: 'Soil Temperature (0-7 cm) Mean' },
		{ value: 'soil_temperature_7_to_28cm_mean', label: 'Soil Temperature (7-28 cm) Mean' },
		{ value: 'soil_temperature_28_to_100cm_mean', label: 'Soil Temperature (28-100 cm) Mean' },
		{ value: 'soil_temperature_100_to_255cm_mean', label: 'Soil Temperature (100-255 cm) Mean' }
	],
	[
		{ value: 'soil_moisture_0_to_7cm_mean', label: 'Soil Moisture (0-7 cm) Mean' },
		{ value: 'soil_moisture_7_to_28cm_mean', label: 'Soil Moisture (7-28 cm) Mean' },
		{ value: 'soil_moisture_28_to_100cm_mean', label: 'Soil Moisture (28-100 cm) Mean' },
		{ value: 'soil_moisture_100_to_255cm_mean', label: 'Soil Moisture (100-255 cm) Mean' },
		{ value: 'soil_temperature_0_to_7cm_anomaly', label: 'Soil Temperature (0-7 cm) Anomaly' },
		{ value: 'soil_temperature_7_to_28cm_anomaly', label: 'Soil Temperature (7-28 cm) Anomaly' },
		{
			value: 'soil_temperature_28_to_100cm_anomaly',
			label: 'Soil Temperature (28-100 cm) Anomaly'
		},
		{
			value: 'soil_temperature_100_to_255cm_anomaly',
			label: 'Soil Temperature (100-255 cm) Anomaly'
		},
		{ value: 'soil_moisture_0_to_7cm_anomaly', label: 'Soil Moisture (0-7 cm) Anomaly' },
		{ value: 'soil_moisture_7_to_28cm_anomaly', label: 'Soil Moisture (7-28 cm) Anomaly' },
		{ value: 'soil_moisture_28_to_100cm_anomaly', label: 'Soil Moisture (28-100 cm) Anomaly' },
		{ value: 'soil_moisture_100_to_255cm_anomaly', label: 'Soil Moisture (100-255 cm) Anomaly' }
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

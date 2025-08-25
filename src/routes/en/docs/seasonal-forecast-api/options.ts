export const defaultParameters = {
	daily: [],
	hourly: [],
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
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' },
		{ value: 'soil_temperature_0_to_7cm', label: 'Soil Temperature (0-7 cm)' }
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
	[
		{ value: 'shortwave_radiation', label: 'Shortwave Solar Radiation GHI' },
		{ value: 'direct_radiation', label: 'Direct Solar Radiation' },
		{ value: 'diffuse_radiation', label: 'Diffuse Solar Radiation DHI' },
		{ value: 'direct_normal_irradiance', label: 'Direct Normal Irradiance DNI' },
		{ value: 'global_tilted_irradiance', label: 'Global Tilted Radiation GTI' },
		{ value: 'terrestrial_radiation', label: 'Terrestrial Solar Radiation' }
	]
];

export const daily = [
	[
		{ value: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ value: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ value: 'temperature_2m_mean', label: 'Mean Temperature (2 m)' },
		{ value: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' },
		{ value: 'sunshine_duration', label: 'Sunshine duration' }
	],
	[
		{ value: 'precipitation_sum', label: 'Precipitation Sum' },
		{ value: 'rain_sum', label: 'Rain Sum' },
		{ value: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
		{ value: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' }
	],
	[
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

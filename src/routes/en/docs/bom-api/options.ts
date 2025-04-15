export const defaultParameters = {
	daily: [],
	hourly: [],
	models: [],
	current: [],
	minutely_15: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: '',

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm',

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: '7',

	end_date: '',
	start_date: '',

	past_hours: '',
	forecast_hours: '',
	cell_selection: '',
	past_minutely_15: '',
	temporal_resolution: '',
	forecast_minutely_15: '',

	tilt: '0',
	azimuth: '0'
};

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
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_speed_40m', label: 'Wind Speed (40 m)' },
		{ value: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
		{ value: 'wind_speed_120m', label: 'Wind Speed (120 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_40m', label: 'Wind Direction (40 m)' },
		{ value: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
		{ value: 'wind_direction_120m', label: 'Wind Direction (120 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	],
	[
		{ value: 'surface_temperature', label: 'Surface Temperature' },
		{ value: 'soil_temperature_0_to_10cm', label: 'Soil Temperature (0-10 cm)' },
		{ value: 'soil_temperature_10_to_35cm', label: 'Soil Temperature (10-35 cm)' },
		{ value: 'soil_temperature_35_to_100cm', label: 'Soil Temperature (35-100 cm)' },
		{ value: 'soil_temperature_100_to_300cm', label: 'Soil Temperature (100-300 cm)' },
		{ value: 'soil_moisture_0_to_10cm', label: 'Soil Moisture (0-10 cm)' },
		{ value: 'soil_moisture_10_to_35cm', label: 'Soil Moisture (10-35 cm)' },
		{ value: 'soil_moisture_35_to_100cm', label: 'Soil Moisture (35-100 cm)' },
		{ value: 'soil_moisture_100_to_300cm', label: 'Soil Moisture (100-300 cm)' }
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
	[]
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

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '3', label: '3 days' },
	{ value: '5', label: '5 days' },
	{ value: '7', label: '7 days (default)' },
	{ value: '10', label: '10 days' }
];

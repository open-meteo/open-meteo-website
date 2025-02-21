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

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'precipitation', label: 'Precipitation (rain + snow)' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'snowfall', label: 'Snowfall' }
		//{ value: 'snow_depth', label: 'Snow Depth' } only snow_depth_water_equivalent
	],
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'pressure_msl', label: 'Sealevel Pressure' },
		{ value: 'surface_pressure', label: 'Surface Pressure' },
		{ value: 'cloud_cover', label: 'Cloud cover Total' },
		{ value: 'cloud_cover_low', label: 'Cloud cover Low' },
		{ value: 'cloud_cover_mid', label: 'Cloud cover Mid' },
		{ value: 'cloud_cover_high', label: 'Cloud cover High' },
		{ value: 'cloud_cover_2m', label: 'Cloud cover / Fog (2m)' },
		{ value: 'visibility', label: 'Visibility' },
		{ value: 'cloud_base', label: 'Cloud Base' },
		{ value: 'cloud_top', label: 'Cloud Top' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_speed_50m', label: 'Wind Speed (50 m)' },
		{ value: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ value: 'wind_speed_150m', label: 'Wind Speed (150 m)' },
		{ value: 'wind_speed_250m', label: 'Wind Speed (250 m)' },
		{ value: 'wind_speed_350m', label: 'Wind Speed (350 m)' },
		{ value: 'wind_speed_450m', label: 'Wind Speed (450 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_50m', label: 'Wind Direction (50 m)' },
		{ value: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
		{ value: 'wind_direction_150m', label: 'Wind Direction (150 m)' },
		{ value: 'wind_direction_250m', label: 'Wind Direction (250 m)' },
		{ value: 'wind_direction_350m', label: 'Wind Direction (350 m)' },
		{ value: 'wind_direction_450m', label: 'Wind Direction (450 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	],
	[
		{ value: 'surface_temperature', label: 'Surface Temperature' },
		{ value: 'temperature_50m', label: 'Temperature (50 m)' },
		{ value: 'temperature_100m', label: 'Temperature (100 m)' },
		{ value: 'temperature_150m', label: 'Temperature (150 m)' },
		{ value: 'temperature_250m', label: 'Temperature (250 m)' }
	]
];

export const daily = [
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ value: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ value: 'apparent_temperature_max', label: 'Maximum Apparent Temperature (2 m)' },
		{ value: 'apparent_temperature_min', label: 'Minimum Apparent Temperature (2 m)' },
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
		{ value: 'precipitation_hours', label: 'Precipitation Hours' },
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
		{ value: 'freezing_level_height', label: 'Freezing Level Height' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
	],
	[
		{ value: 'cape', label: 'CAPE' },
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
		{ value: 'global_tilted_irradiance_instant', label: 'Global Tilted Radiation GTI' },
		{ value: 'terrestrial_radiation_instant', label: 'Terrestrial Solar Radiation (Instant)' }
	]
];

export const models = [
	[
		{ value: 'dmi_seamless', label: 'DMI Seamless (with ECMWF)' },
		{ value: 'dmi_harmonie_arome_europe', label: 'DMI Harmonie Arome Europe' }
	]
];

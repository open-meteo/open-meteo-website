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
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' },
		{ name: 'precipitation', label: 'Precipitation (rain + snow)' },
		{ name: 'rain', label: 'Rain' },
		{ name: 'snowfall', label: 'Snowfall' }
		//{ name: 'snow_depth', label: 'Snow Depth' } only snow_depth_water_equivalent
	],
	[
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'pressure_msl', label: 'Sealevel Pressure' },
		{ name: 'surface_pressure', label: 'Surface Pressure' },
		{ name: 'cloud_cover', label: 'Cloud cover Total' },
		{ name: 'cloud_cover_low', label: 'Cloud cover Low' },
		{ name: 'cloud_cover_mid', label: 'Cloud cover Mid' },
		{ name: 'cloud_cover_high', label: 'Cloud cover High' },
		{ name: 'cloud_cover_2m', label: 'Cloud cover / Fog (2m)' },
		{ name: 'visibility', label: 'Visibility' },
		{ name: 'cloud_base', label: 'Cloud Base' },
		{ name: 'cloud_top', label: 'Cloud Top' },
		{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ name: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_speed_50m', label: 'Wind Speed (50 m)' },
		{ name: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ name: 'wind_speed_150m', label: 'Wind Speed (150 m)' },
		{ name: 'wind_speed_250m', label: 'Wind Speed (250 m)' },
		{ name: 'wind_speed_350m', label: 'Wind Speed (350 m)' },
		{ name: 'wind_speed_450m', label: 'Wind Speed (450 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ name: 'wind_direction_50m', label: 'Wind Direction (50 m)' },
		{ name: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
		{ name: 'wind_direction_150m', label: 'Wind Direction (150 m)' },
		{ name: 'wind_direction_250m', label: 'Wind Direction (250 m)' },
		{ name: 'wind_direction_350m', label: 'Wind Direction (350 m)' },
		{ name: 'wind_direction_450m', label: 'Wind Direction (450 m)' },
		{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	],
	[
		{ name: 'surface_temperature', label: 'Surface Temperature' },
		{ name: 'temperature_50m', label: 'Temperature (50 m)' },
		{ name: 'temperature_100m', label: 'Temperature (100 m)' },
		{ name: 'temperature_150m', label: 'Temperature (150 m)' },
		{ name: 'temperature_250m', label: 'Temperature (250 m)' }
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
		{ name: 'freezing_level_height', label: 'Freezing Level Height' },
		{ name: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
	],
	[
		{ name: 'cape', label: 'CAPE' },
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

export const models = [
	[
		{ name: 'dmi_seamless', label: 'DMI Seamless (with ECMWF)' },
		{ name: 'dmi_harmonie_arome_europe', label: 'DMI Harmonie Arome Europe' }
	]
];

export const defaultParameters = {
	current: [],
	hourly: [],
	location_mode: 'location_search',
	csv_coordinates: '',
	temperature_unit: 'celsius',
	wind_speed_unit: 'kmh',
	precipitation_unit: 'mm',
	timeformat: 'iso8601',
	timezone: 'UTC',
	past_days: '0',
	past_hours: '',
	forecast_days: '3',
	forecast_hours: '',
	temporal_resolution: '',
	start_date: '',
	end_date: '',
	tilt: 0,
	azimuth: 0,
	time_mode: 'forecast_days',
	cell_selection: ''
};

export const hourly = [
	[
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' }
	],
	[
		{ name: 'precipitation', label: 'Precipitation (rain + snow)' },
		{ name: 'rain', label: 'Rain' },
		{ name: 'snowfall', label: 'Snowfall' }
	],
	[
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'pressure_msl', label: 'Sealevel Pressure' },
		{ name: 'surface_pressure', label: 'Surface Pressure' },
		{ name: 'cloud_cover', label: 'Cloud cover Total' },
		{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ name: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
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

export const additionalVariables = [
	[
		{ name: 'is_day', label: 'Is Day or Night' },
		{ name: 'sunshine_duration', label: 'Sunshine Duration' },
		{ name: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
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
		{ name: 'metno_seamless', label: 'MET Norway Nordic Seamless (with ECMWF)' },
		{ name: 'metno_nordic', label: 'MET Norway Nordic' }
	]
];

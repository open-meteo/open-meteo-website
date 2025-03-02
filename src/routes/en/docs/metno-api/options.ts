export const defaultParameters = {
	hourly: [],
	models: [],
	current: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: '',

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: '3',

	past_hours: '',
	forecast_hours: '',
	cell_selection: '',
	temporal_resolution: '',

	end_date: '',
	start_date: '',

	tilt: '0',
	azimuth: '0',

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
};

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' }
	],
	[
		{ value: 'precipitation', label: 'Precipitation (rain + snow)' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'snowfall', label: 'Snowfall' }
	],
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'pressure_msl', label: 'Sealevel Pressure' },
		{ value: 'surface_pressure', label: 'Surface Pressure' },
		{ value: 'cloud_cover', label: 'Cloud cover Total' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	]
];

export const current = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'is_day', label: 'Is Day or Night' }
	],
	[
		{ value: 'precipitation', label: 'Precipitation' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'showers', label: 'Showers' },
		{ value: 'snowfall', label: 'Snowfall' }
	],
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'cloud_cover', label: 'Cloud cover Total' },
		{ value: 'pressure_msl', label: 'Sealevel Pressure' },
		{ value: 'surface_pressure', label: 'Surface Pressure' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	]
];

export const additionalVariables = [
	[
		{ value: 'is_day', label: 'Is Day or Night' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
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
		{ value: 'metno_seamless', label: 'MET Norway Nordic Seamless (with ECMWF)' },
		{ value: 'metno_nordic', label: 'MET Norway Nordic' }
	]
];

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '2', label: '2 days' },
	{ value: '3', label: '3 days (default)' }
];

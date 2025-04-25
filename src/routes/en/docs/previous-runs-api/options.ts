export const defaultParameters = {
	daily: [],
	hourly: [],
	models: [],
	current: [],
	minutely_15: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: undefined,

	time_mode: 'forecast_days',
	past_days: '7',
	forecast_days: '7',

	start_date: undefined,
	end_date: undefined,

	tilt: '0',
	azimuth: '0',

	past_hours: undefined,
	cell_selection: undefined,
	forecast_hours: undefined,
	past_minutely_15: undefined,
	temporal_resolution: undefined,
	forecast_minutely_15: undefined,

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
};

export const previousDay = [
	{ value: 'temperature_2m', label: 'Temperature (2 m)' },
	{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
	{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
	{ value: 'apparent_temperature', label: 'Apparent Temperature' },
	{ value: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
	{ value: 'rain', label: 'Rain' },
	{ value: 'showers', label: 'Showers' },
	{ value: 'snowfall', label: 'Snowfall' },
	{ value: 'weather_code', label: 'Weather code' },
	{ value: 'pressure_msl', label: 'Sealevel Pressure' },
	{ value: 'surface_pressure', label: 'Surface Pressure' },
	{ value: 'cloud_cover', label: 'Cloud cover Total' },
	{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
	{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' }
];

export const solarVariables = [
	{ value: 'shortwave_radiation', label: 'Shortwave Solar Radiation GHI' },
	{ value: 'direct_radiation', label: 'Direct Solar Radiation' },
	{ value: 'diffuse_radiation', label: 'Diffuse Solar Radiation DHI' },
	{ value: 'direct_normal_irradiance', label: 'Direct Normal Irradiance DNI' },
	{ value: 'global_tilted_irradiance', label: 'Global Tilted Radiation GTI' },

	{ value: 'shortwave_radiation_instant', label: 'Shortwave Solar Radiation GHI (Instant)' },
	{ value: 'direct_radiation_instant', label: 'Direct Solar Radiation (Instant)' },
	{ value: 'diffuse_radiation_instant', label: 'Diffuse Solar Radiation DHI (Instant)' },
	{ value: 'direct_normal_irradiance_instant', label: 'Direct Normal Irradiance DNI (Instant)' },
	{ value: 'global_tilted_irradiance_instant', label: 'Global Tilted Radiation GTI (Instant)' },
	{ value: 'terrestrial_radiation_instant', label: 'Terrestrial Solar Radiation (Instant)' }
];

export const windVariables = [
	{ value: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
	{ value: 'wind_speed_120m', label: 'Wind Speed (120 m)' },
	{ value: 'wind_speed_180m', label: 'Wind Speed (180 m)' },
	{ value: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
	{ value: 'wind_direction_120m', label: 'Wind Direction (120 m)' },
	{ value: 'wind_direction_180m', label: 'Wind Direction (180 m)' }
];

export const pastDaysOptions = [
	{ value: '0', label: '0 days' },
	{ value: '1', label: '1 day' },
	{ value: '2', label: '2 days' },
	{ value: '3', label: '3 days' },
	{ value: '5', label: '5 days' },
	{ value: '7', label: '1 week (default)' },
	{ value: '14', label: '2 weeks' },
	{ value: '31', label: '1 month' },
	{ value: '61', label: '2 months' },
	{ value: '92', label: '3 months' }
];

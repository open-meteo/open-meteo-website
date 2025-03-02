export const defaultParameters = {
	current: [],
	hourly: [],
	daily: [],
	location_mode: 'location_search',
	csv_coordinates: undefined,
	minutely_15: [],
	temperature_unit: 'celsius',
	wind_speed_unit: 'kmh',
	precipitation_unit: 'mm',
	timeformat: 'iso8601',
	timezone: 'UTC',
	past_days: '0',
	past_hours: undefined,
	past_minutely_15: undefined,
	forecast_days: '7',
	forecast_hours: undefined,
	forecast_minutely_15: undefined,
	temporal_resolution: undefined,
	start_date: undefined,
	end_date: undefined,
	tilt: '0',
	azimuth: '0',
	time_mode: 'forecast_days',
	models: [],
	cell_selection: undefined
};

export const pressureVariables = [
	{ name: 'temperature', label: 'Temperature' },
	{ name: 'relative_humidity', label: 'Relative Humidity' },
	{ name: 'cloud_cover', label: 'Cloud cover' },
	{ name: 'wind_speed', label: 'Wind Speed' },
	{ name: 'wind_direction', label: 'Wind Direction' },
	{ name: 'vertical_velocity', label: 'Vertical Velocity' },
	{ name: 'geopotential_height', label: 'Geopotential Height' }
];

export const levels = [
	10, 20, 30, 40, 50, 70, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 450, 500,
	550, 600, 650, 700, 750, 800, 850, 900, 925, 950, 975, 1000
].reverse();

export const heightVariables = [
	{ name: 'temperature', label: 'Temperature' },
	{ name: 'relative_humidity', label: 'Relative Humidity' },
	{ name: 'cloud_cover', label: 'Cloud cover' },
	{ name: 'wind_speed', label: 'Wind Speed' },
	{ name: 'wind_direction', label: 'Wind Direction' }
];

export const heights = [
	20, 30, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 1000, 1250, 1500, 1750, 2000,
	2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4500, 5000, 5500, 6000
];

export const hourly = [
	[
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' },
		//{ name: 'precipitation_probability', label: 'Precipitation Probability' },
		{ name: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ name: 'rain', label: 'Rain' },
		{ name: 'showers', label: 'Showers' },
		{ name: 'snowfall', label: 'Snowfall' },
		{ name: 'hail', label: 'Hail' }
		//{ name: 'snow_depth', label: 'Snow Depth' } // only water req
	],
	[
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'pressure_msl', label: 'Sealevel Pressure' },
		{ name: 'visibility', label: 'Visibility' },
		{ name: 'surface_pressure', label: 'Surface Pressure' },
		{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ name: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ name: 'cloud_cover', label: 'Cloud cover Total' },
		{ name: 'cloud_cover_low', label: 'Cloud cover Low' },
		{ name: 'cloud_cover_mid', label: 'Cloud cover Mid' },
		{ name: 'cloud_cover_high', label: 'Cloud cover High' },
		{ name: 'cloud_cover_2m', label: 'Cloud cover / Fog (2m)' },
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
		{ name: 'sunshine_duration', label: 'Sunshine Duration' }
	],
	[
		{ name: 'precipitation_sum', label: 'Precipitation Sum' },
		{ name: 'rain_sum', label: 'Rain Sum' },
		{ name: 'showers_sum', label: 'Showers Sum' },
		{ name: 'snowfall_sum', label: 'Snowfall Sum' },
		{ name: 'precipitation_hours', label: 'Precipitation Hours' },
		{ name: 'precipitation_probability_max', label: 'Precipitation Probability Max' },
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
		{ name: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
		//{ name: 'lightning_potential', label: 'Lightning Potential Index LPI (2)' },
		//{ name: 'updraft', label: 'Updraft (2)' }
	],
	[
		{ name: 'cape', label: 'CAPE' },
		{ name: 'convective_inhibition', label: 'Convective Inhibition' },
		{ name: 'freezing_level_height', label: 'Freezing Level Height' },
		//{ name: 'snowfall_height', label: 'Snowfall Height (1)' },
		{ name: 'sunshine_duration', label: 'Sunshine Duration' }
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
		{ name: 'ukmo_seamless', label: 'UK Met Office Seamless' },
		{ name: 'ukmo_global_deterministic_10km', label: 'UK Met Office Global 10km' },
		{ name: 'ukmo_uk_deterministic_2km', label: 'UK Met Office UK 2km' }
	]
];

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '3', label: '3 days' },
	{ value: '5', label: '5 days' },
	{ value: '7', label: '7 days (default)' },
	{ value: '8', label: '8 days' }
];

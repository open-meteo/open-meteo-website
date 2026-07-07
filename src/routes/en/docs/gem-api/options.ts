import { current, solarVariables } from '../options';

export { current, solarVariables };

export const defaultParameters = {
	daily: [],
	hourly: [],
	models: [],
	current: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: '',

	temperature_unit: 'celsius',
	wind_speed_unit: 'kmh',
	precipitation_unit: 'mm',
	timeformat: 'iso8601',
	past_days: '0',
	past_hours: '',
	forecast_days: '7',
	forecast_hours: '',
	temporal_resolution: '',
	start_date: '',
	end_date: '',
	tilt: '0',
	azimuth: '0',
	time_mode: 'forecast_days',
	cell_selection: ''
};

export const pressureVariables = [
	{ value: 'temperature', label: 'Temperature' },
	{ value: 'dew_point', label: 'Dewpoint' },
	{ value: 'relative_humidity', label: 'Relative Humidity' },
	{ value: 'cloud_cover', label: 'Cloud Cover' },
	{ value: 'wind_speed', label: 'Wind Speed' },
	{ value: 'wind_direction', label: 'Wind Direction' },
	{ value: 'geopotential_height', label: 'Geopotential Height' }
];

export const levels = [
	1015, 1000, 985, 970, 950, 925, 900, 875, 850, 800, 750, 700, 650, 600, 550, 500, 450, 400, 350,
	300, 275, 250, 225, 200, 175, 150, 100, 50, 30, 20, 10
].reverse();

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'showers', label: 'Showers' },
		{ value: 'snowfall', label: 'Snowfall' }
	],
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'pressure_msl', label: 'Sea Level Pressure' },
		{ value: 'surface_pressure', label: 'Surface Pressure' },
		{ value: 'cloud_cover', label: 'Cloud Cover Total' },
		{ value: 'cloud_cover_low', label: 'Cloud Cover Low' },
		{ value: 'cloud_cover_mid', label: 'Cloud Cover Mid' },
		{ value: 'cloud_cover_high', label: 'Cloud Cover High' },
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
		{ value: 'temperature_40m', label: 'Temperature (40 m)' },
		{ value: 'temperature_80m', label: 'Temperature (80 m)' },
		{ value: 'temperature_120m', label: 'Temperature (120 m)' },
		{ value: 'soil_temperature_0_to_10cm', label: 'Soil Temperature (0-10 cm)' },
		{ value: 'soil_moisture_0_to_10cm', label: 'Soil Moisture (0-10 cm)' }
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
		{ value: 'sunshine_duration', label: 'Sunshine Duration' }
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
		{ value: 'sunshine_duration', label: 'Sunshine Duration' }
	],
	[
		{ value: 'cape', label: 'CAPE' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
	]
];

export const models = [
	[
		{ value: 'cmc_gem_seamless', label: 'GEM Seamless' },
		{ value: 'cmc_gem_gdps', label: 'GEM Global' },
		{ value: 'cmc_gem_rdps', label: 'GEM Regional' },
		{ value: 'cmc_gem_hrdps', label: 'GEM HRDPS Continental' },
		{ value: 'cmc_gem_hrdps_west', label: 'GEM HRDPS West' }
	]
];

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '3', label: '3 days' },
	{ value: '5', label: '5 days' },
	{ value: '7', label: '7 days (default)' },
	{ value: '10', label: '10 days' }
];

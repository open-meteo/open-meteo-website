import { dev } from '$app/environment';

import { pad } from '$lib/utils/meteo';

export const defaultParameters = {
	hourly: [],
	daily: [],
	location_mode: 'location_search',
	time_mode: 'time_interval',
	csv_coordinates: '',
	temperature_unit: 'celsius',
	wind_speed_unit: 'kmh',
	precipitation_unit: 'mm',
	timeformat: 'iso8601',
	timezone: 'UTC',
	temporal_resolution: '',
	cell_selection: '',
	tilt: 0,
	azimuth: 0,
	models: []
};

export const hourly = [
	[
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' },
		{ name: 'precipitation', label: 'Precipitation (rain + snow)' },
		{ name: 'rain', label: 'Rain' },
		{ name: 'snowfall', label: 'Snowfall' },
		{ name: 'snow_depth', label: 'Snow depth' }
	],
	[
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'pressure_msl', label: 'Sealevel Pressure' },
		{ name: 'surface_pressure', label: 'Surface Pressure' },
		{ name: 'cloud_cover', label: 'Cloud cover Total' },
		{ name: 'cloud_cover_low', label: 'Cloud cover Low' },
		{ name: 'cloud_cover_mid', label: 'Cloud cover Mid' },
		{ name: 'cloud_cover_high', label: 'Cloud cover High' },
		{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ name: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ name: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
		{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	],
	[
		{ name: 'soil_temperature_0_to_7cm', label: 'Soil Temperature (0-7 cm)' },
		{ name: 'soil_temperature_7_to_28cm', label: 'Soil Temperature (7-28 cm)' },
		{ name: 'soil_temperature_28_to_100cm', label: 'Soil Temperature (28-100 cm)' },
		{ name: 'soil_temperature_100_to_255cm', label: 'Soil Temperature (100-255 cm)' },
		{ name: 'soil_moisture_0_to_7cm', label: 'Soil Moisture (0-7 cm)' },
		{ name: 'soil_moisture_7_to_28cm', label: 'Soil Moisture (7-28 cm)' },
		{ name: 'soil_moisture_28_to_100cm', label: 'Soil Moisture (28-100 cm)' },
		{ name: 'soil_moisture_100_to_255cm', label: 'Soil Moisture (100-255 cm)' }
	]
];
if (dev) {
	hourly.push([
		{ name: 'soil_temperature_0_to_100cm', label: 'Soil Temperature (0-100 cm)' },
		{ name: 'soil_moisture_0_to_100cm', label: 'Soil Moisture (0-100 cm)' },
		{ name: 'soil_moisture_index_0_to_7cm', label: 'Soil Moisture Index (0-7 cm)' },
		{ name: 'soil_moisture_index_7_to_28cm', label: 'Soil Moisture Index (7-28 cm)' },
		{ name: 'soil_moisture_index_28_to_100cm', label: 'Soil Moisture Index (28-100 cm)' },
		{ name: 'soil_moisture_index_0_to_100cm', label: 'Soil Moisture Index (0-100 cm)' }
	]);
}

export const daily = [
	[
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ name: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ name: 'temperature_2m_mean', label: 'Mean Temperature (2 m)' },
		{ name: 'apparent_temperature_max', label: 'Maximum Apparent Temperature (2 m)' },
		{ name: 'apparent_temperature_min', label: 'Minimum Apparent Temperature (2 m)' },
		{ name: 'apparent_temperature_mean', label: 'Mean Apparent Temperature (2 m)' },
		{ name: 'sunrise', label: 'Sunrise' },
		{ name: 'sunset', label: 'Sunset' },
		{ name: 'daylight_duration', label: 'Daylight Duration' },
		{ name: 'sunshine_duration', label: 'Sunshine Duration' }
	],
	[
		{ name: 'precipitation_sum', label: 'Precipitation Sum' },
		{ name: 'rain_sum', label: 'Rain Sum' },
		{ name: 'snowfall_sum', label: 'Snowfall Sum' },
		{ name: 'precipitation_hours', label: 'Precipitation Hours' },
		{ name: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
		{ name: 'wind_gusts_10m_max', label: 'Maximum Wind Gusts (10 m)' },
		{ name: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' },
		{ name: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' },
		{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' }
	]
];

if (dev) {
	daily.push([
		{ name: 'soil_temperature_0_to_100cm_mean', label: 'Mean Soil Temperature (0-100 cm)' },
		{ name: 'soil_moisture_0_to_100cm_mean', label: 'Mean Soil Moisture (0-100 cm)' },
		{ name: 'soil_moisture_index_0_to_100cm_mean', label: 'Mean Soil Moisture Index (0-100 cm)' },
		{ name: 'growing_degree_days_base_0_limit_50', label: 'Growing Degree Days Base 0 Limit 50' },
		{ name: 'leaf_wetness_probability_mean', label: 'Mean Leaf Wetness Probability' },
		{ name: 'vapour_pressure_deficit_max', label: 'Vapour Pressure Deficit Max' }
	]);
}

export const additionalVariables = [
	[
		{ name: 'boundary_layer_height', label: 'Boundary Layer Height PBL' },
		{ name: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' },
		{
			name: 'total_column_integrated_water_vapour',
			label: 'Total Column Integrated Water Vapour'
		}
	],
	[
		{ name: 'is_day', label: 'Is Day or Night' },
		{ name: 'sunshine_duration', label: 'Sunshine Duration' },
		{ name: 'albedo', label: 'Albedo (only CERRA)' },
		{ name: 'snow_depth_water_equivalent', label: 'Snow Depth Water Equivalent (only CERRA)' }
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

export const ensembleSpreadVariables = [
	[
		{ name: 'temperature_2m_spread', label: 'Temperature (2 m)' },
		{ name: 'dew_point_2m_spread', label: 'Dewpoint (2 m)' },
		{ name: 'precipitation_spread', label: 'Precipitation (rain + snow)' },
		{ name: 'snowfall_spread', label: 'Snowfall' },
		{ name: 'shortwave_radiation_spread', label: 'Shortwave Solar Radiation GHI' },
		{ name: 'direct_radiation_spread', label: 'Direct Solar Radiation' },
		{ name: 'pressure_msl_spread', label: 'Sealevel Pressure' },
		{ name: 'cloud_cover_low_spread', label: 'Cloud cover Low' },
		{ name: 'cloud_cover_mid_spread', label: 'Cloud cover Mid' },
		{ name: 'cloud_cover_high_spread', label: 'Cloud cover High' }
	],
	[
		{ name: 'wind_speed_10m_spread', label: 'Wind Speed (10 m)' },
		{ name: 'wind_speed_100m_spread', label: 'Wind Speed (100 m)' },
		{ name: 'wind_direction_10m_spread', label: 'Wind Direction (10 m)' },
		{ name: 'wind_direction_100m_spread', label: 'Wind Direction (100 m)' },
		{ name: 'wind_gusts_10m_spread', label: 'Wind Gusts (10 m)' },
		{ name: 'soil_temperature_0_to_7cm_spread', label: 'Soil Temperature (0-7 cm)' },
		{ name: 'soil_temperature_7_to_28cm_spread', label: 'Soil Temperature (7-28 cm)' },
		{ name: 'soil_temperature_28_to_100cm_spread', label: 'Soil Temperature (28-100 cm)' },
		{ name: 'soil_temperature_100_to_255cm_spread', label: 'Soil Temperature (100-255 cm)' },
		{ name: 'soil_moisture_0_to_7cm_spread', label: 'Soil Moisture (0-7 cm)' },
		{ name: 'soil_moisture_7_to_28cm_spread', label: 'Soil Moisture (7-28 cm)' },
		{ name: 'soil_moisture_28_to_100cm_spread', label: 'Soil Moisture (28-100 cm)' },
		{ name: 'soil_moisture_100_to_255cm_spread', label: 'Soil Moisture (100-255 cm)' }
	]
];

export const models = [
	[
		{ name: 'best_match', label: 'Best match', caption: 'ECMWF IFS & ERA5' },
		{ name: 'ecmwf_ifs', label: 'ECMWF IFS', caption: '9 km, Global, 2017 onwards' },
		{
			name: 'ecmwf_ifs_analysis_long_window',
			label: 'ECMWF IFS Analysis Long-Window',
			caption: '9 km, 6-Hourly Measurements'
		}
		//{ name: 'ecmwf_ifs_analysis', label: 'ECMWF IFS Analysis', caption: '9 km, 6-Hourly Measurements' },
		//{ name: 'ecmwf_ifs_long_window', label: 'ECMWF IFS Long-Window', caption: '9 km, 1-Hourly' }
	],
	[
		{ name: 'era5_seamless', label: 'ERA5-Seamless', caption: 'ERA5 & ERA5-Land combined' },
		{ name: 'era5', label: 'ERA5', caption: '25 km, Global' },
		{ name: 'era5_land', label: 'ERA5-Land', caption: '10 km, Global' },
		{ name: 'era5_ensemble', label: 'ERA5-Ensemble', caption: '0.5° ~55km, Global' },
		{ name: 'cerra', label: 'CERRA', caption: '5 km, Europe, 1985 to June 2021' }
	]
];

// Settings
export const temperatureOptions = [
	{ value: 'celsius', label: 'Celsius °C' },
	{ value: 'fahrenheit', label: 'Fahrenheit °F' }
];

export const windSpeedOptions = [
	{ value: 'kmh', label: 'km/h' },
	{ value: 'ms', label: 'm/s' },
	{ value: 'mph', label: 'mph' },
	{ value: 'kn', label: 'Knots' }
];

export const precipitationOptions = [
	{ value: 'mm', label: 'Millimeter' },
	{ value: 'inch', label: 'Inch' }
];

export const timeFormatOptions = [
	{
		value: 'iso8601',
		label:
			'ISO 8601 (e.g. ' +
			new Date().getFullYear() +
			'-' +
			pad(new Date().getMonth()) +
			'-' +
			pad(new Date().getDate()) +
			')'
	},
	{ value: 'unixtime', label: 'Unix timestamp' }
];

export const defaultParameters = {
	hourly: [],
	models: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: undefined,

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm',

	start_date: undefined,
	end_date: undefined,

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: '10',

	tilt: '0',
	azimuth: '0',

	past_hours: undefined,
	forecast_hours: undefined,
	cell_selection: undefined,
	temporal_resolution: undefined
};

export const pressureVariables = [
	{ value: 'temperature', label: 'Temperature' },
	{ value: 'relative_humidity', label: 'Relative Humidity' },
	{ value: 'cloud_cover', label: 'Cloud cover' },
	{ value: 'wind_speed', label: 'Wind Speed' },
	{ value: 'wind_direction', label: 'Wind Direction' },
	{ value: 'geopotential_height', label: 'Geopotential Height' }
];

export const levels = [1000, 925, 850, 700, 600, 500, 400, 300, 250, 200, 150, 100, 50];

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'precipitation', label: 'Precipitation (rain + snow + showers)' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'showers', label: 'Showers' },
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'runoff', label: 'Surface Water Runoff' },
		{ value: 'visibility', label: 'Visibility' },
		{ value: 'weather_code', label: 'Weather code' },
	],
	[
		
		{ value: 'pressure_msl', label: 'Sealevel Pressure' },
		{ value: 'surface_pressure', label: 'Surface Pressure' },
		{ value: 'cloud_cover', label: 'Cloud cover Total' },
		{ value: 'cloud_cover_low', label: 'Cloud cover Low' },
		{ value: 'cloud_cover_mid', label: 'Cloud cover Mid' },
		{ value: 'cloud_cover_high', label: 'Cloud cover High' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' },
		{ value: 'potential_evapotranspiration', label: 'Potential Evapotranspiration' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ value: 'wind_speed_200m', label: 'Wind Speed (200 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
		{ value: 'wind_direction_200m', label: 'Wind Direction (200 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		
		
		{ value: 'cape', label: 'CAPE' },
		{ value: 'convective_inhibition', label: 'Convective Inhibition' },
		
		{
			value: 'total_column_integrated_water_vapour',
			label: 'Total Column Integrated Water Vapour'
		}
	],
	[
		{ value: 'surface_temperature', label: 'Surface temperature' },
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
		{ value: 'ecmwf_ifs', label: 'ECMWF IFS HRES 9 km' },
		{ value: 'ecmwf_ifs025', label: 'ECMWF IFS 0.25°' },
		{ value: 'ecmwf_aifs025_single', label: 'ECMWF AIFS 0.25° Single' }
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
		{ value: 'global_tilted_irradiance_instant', label: 'Global Tilted Radiation GTI (Instant)' },
		{ value: 'terrestrial_radiation_instant', label: 'Terrestrial Solar Radiation (Instant)' }
	]
];

export const additionalVariables = [
	[
		{ value: 'is_day', label: 'Is Day or Night' },
		{ value: 'temperature_2m_min', label: 'Temperature 3-Hourly Minimum (2 m)' },
		{ value: 'temperature_2m_max', label: 'Temperature 3-Hourly Maximum (2 m)' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' },
		{ value: 'precipitation_type', label: 'Precipitation Type' },
	],
	[
		{ value: 'roughness_length', label: 'Roughness Length z₀' },
		{ value: 'albedo', label: 'Albedo' },
		{ value: 'k_index', label: 'K-Index' },
		{ value: 'snowfall_water_equivalent', label: 'Snowfall (Water Equivalent)' },
		{ value: 'snow_depth_water_equivalent', label: 'Snow Depth (Water Equivalent)' },
	]
];

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '3', label: '3 days' },
	{ value: '5', label: '5 days' },
	{ value: '7', label: '7 days' },
	{ value: '10', label: '10 days (default)' },
	{ value: '15', label: '15 days' }
];

export const defaultParameters = {
	hourly: [],
	location_mode: 'location_search',
	csv_coordinates: '',
	temperature_unit: 'celsius',
	wind_speed_unit: 'kmh',
	precipitation_unit: 'mm',
	timeformat: 'iso8601',
	past_days: '0',
	forecast_days: '10',
	start_date: '',
	end_date: '',
	time_mode: 'forecast_days',
	forecast_hours: '',
	past_hours: '',
	models: [],
	tilt: 0,
	azimuth: 0,
	temporal_resolution: '',
	cell_selection: ''
};

export const pressureVariables = [
	{ name: 'temperature', label: 'Temperature' },
	{ name: 'relative_humidity', label: 'Relative Humidity' },
	//{ name: 'specific_humidity', label: 'Specific Humidity' },
	{ name: 'cloud_cover', label: 'Cloud cover' },
	{ name: 'wind_speed', label: 'Wind Speed' },
	{ name: 'wind_direction', label: 'Wind Direction' },
	{ name: 'geopotential_height', label: 'Geopotential Height' }
	//{ name: 'atmosphere_relative_vorticity', label: 'Relative Vorticity' },
	//{ name: 'divergence_of_wind', label: 'Divergence of Wind' }
];
export const levels = [1000, 925, 850, 700, 600, 500, 400, 300, 250, 200, 150, 100, 50];

export const hourly = [
	[
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' },
		{ name: 'precipitation', label: 'Precipitation (rain + snow)' },
		{ name: 'rain', label: 'Rain' },
		{ name: 'snowfall', label: 'Snowfall' }
	],
	[
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'pressure_msl', label: 'Sealevel Pressure' },
		{ name: 'surface_pressure', label: 'Surface Pressure' },
		{ name: 'cloud_cover', label: 'Cloud cover Total' },
		{ name: 'cloud_cover_low', label: 'Cloud cover Low' },
		{ name: 'cloud_cover_mid', label: 'Cloud cover Mid' },
		{ name: 'cloud_cover_high', label: 'Cloud cover High' },
		{ name: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ name: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
		{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ name: 'surface_temperature', label: 'Surface temperature' },
		{ name: 'runoff', label: 'Surface Water Runoff' },
		{ name: 'cape', label: 'CAPE' },
		{
			name: 'total_column_integrated_water_vapour',
			label: 'Total Column Integrated Water Vapour'
		}
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

export const models = [
	[
		{ name: 'ecmwf_ifs04', label: 'ECMWF IFS 0.4°' },
		{ name: 'ecmwf_ifs025', label: 'ECMWF IFS 0.25°' },
		{ name: 'ecmwf_aifs025', label: 'ECMWF AIFS 0.25°' }
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

export const additionalVariables = [
	[
		{ name: 'is_day', label: 'Is Day or Night' },
		{ name: 'temperature_2m_min', label: 'Temperature 3-Hourly Minimum (2 m)' },
		{ name: 'temperature_2m_max', label: 'Temperature 3-Hourly Maximum (2 m)' },
		{ name: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' }
	],
	[
		{ name: 'sunshine_duration', label: 'Sunshine Duration' },
		{ name: 'precipitation_type', label: 'Precipitation Type' }
	]
];

import { dev } from '$app/environment';

export const defaultParameters = {
	daily: [],
	hourly: [],
	models: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: '',

	time_mode: 'time_interval',

	temperature_unit: 'celsius',
	wind_speed_unit: 'kmh',
	precipitation_unit: 'mm',
	timeformat: 'iso8601',

	temporal_resolution: '',
	cell_selection: '',

	tilt: '0',
	azimuth: '0'
};

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'precipitation', label: 'Precipitation (rain + snow)' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'snow_depth', label: 'Snow depth' }
	],
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'pressure_msl', label: 'Sealevel Pressure' },
		{ value: 'surface_pressure', label: 'Surface Pressure' },
		{ value: 'cloud_cover', label: 'Cloud cover Total' },
		{ value: 'cloud_cover_low', label: 'Cloud cover Low' },
		{ value: 'cloud_cover_mid', label: 'Cloud cover Mid' },
		{ value: 'cloud_cover_high', label: 'Cloud cover High' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' }
	],
	[
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
if (dev) {
	hourly.push([
		{ value: 'soil_temperature_0_to_100cm', label: 'Soil Temperature (0-100 cm)' },
		{ value: 'soil_moisture_0_to_100cm', label: 'Soil Moisture (0-100 cm)' },
		{ value: 'soil_moisture_index_0_to_7cm', label: 'Soil Moisture Index (0-7 cm)' },
		{ value: 'soil_moisture_index_7_to_28cm', label: 'Soil Moisture Index (7-28 cm)' },
		{ value: 'soil_moisture_index_28_to_100cm', label: 'Soil Moisture Index (28-100 cm)' },
		{ value: 'soil_moisture_index_0_to_100cm', label: 'Soil Moisture Index (0-100 cm)' }
	]);
}

export const daily = [
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ value: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ value: 'temperature_2m_mean', label: 'Mean Temperature (2 m)' },
		{ value: 'apparent_temperature_max', label: 'Maximum Apparent Temperature (2 m)' },
		{ value: 'apparent_temperature_min', label: 'Minimum Apparent Temperature (2 m)' },
		{ value: 'apparent_temperature_mean', label: 'Mean Apparent Temperature (2 m)' },
		{ value: 'sunrise', label: 'Sunrise' },
		{ value: 'sunset', label: 'Sunset' },
		{ value: 'daylight_duration', label: 'Daylight Duration' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' }
	],
	[
		{ value: 'precipitation_sum', label: 'Precipitation Sum' },
		{ value: 'rain_sum', label: 'Rain Sum' },
		{ value: 'snowfall_sum', label: 'Snowfall Sum' },
		{ value: 'precipitation_hours', label: 'Precipitation Hours' },
		{ value: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
		{ value: 'wind_gusts_10m_max', label: 'Maximum Wind Gusts (10 m)' },
		{ value: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' },
		{ value: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' }
	]
];

export const additionalDaily = [
	[
		{ value: 'temperature_2m_mean', label: 'Mean Temperature (2 m)' },
		{ value: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ value: 'apparent_temperature_mean', label: 'Mean Apparent Temperature (2 m)' },
		{ value: 'cape_mean', label: 'Mean CAPE' },
		{ value: 'cape_max', label: 'Maximum CAPE' },
		{ value: 'cape_min', label: 'Minimum CAPE' },
		{ value: 'cloud_cover_mean', label: 'Mean Cloud cover' },
		{ value: 'cloud_cover_max', label: 'Maximum Cloud cover' },
		{ value: 'cloud_cover_min', label: 'Minimum Cloud cover' },
		{ value: 'dew_point_2m_mean', label: 'Mean Dewpoint (2 m)' },
		{ value: 'dew_point_2m_max', label: 'Maximum Dewpoint (2 m)' },
		{ value: 'dew_point_2m_min', label: 'Minimum Dewpoint (2 m)' }
	],
	[
		{ value: 'et0_fao_evapotranspiration_sum', label: 'Reference Evapotranspiration Sum (ET₀)' },
		{ value: 'growing_degree_days_base_0_limit_50', label: 'Growing Degree Days Base 0 Limit 50 ' },
		{ value: 'leaf_wetness_probability_mean', label: 'Mean Leaf Wetness Probability' },
		{ value: 'precipitation_probability_mean', label: 'Mean Precipitation Probability' },
		{ value: 'precipitation_probability_min', label: 'Minimum Precipitation Probability' },
		{ value: 'relative_humidity_2m_mean', label: 'Mean Relative Humidity (2 m)' },
		{ value: 'relative_humidity_2m_max', label: 'Maximum Relative Humidity (2 m)' },
		{ value: 'relative_humidity_2m_min', label: 'Minimum Relative Humidity (2 m)' },
		{ value: 'snowfall_water_equivalent_sum', label: 'Snowfall Water Equivalent Sum' },
		{ value: 'pressure_msl_mean', label: 'Mean Sealevel Pressure' },
		{ value: 'pressure_msl_max', label: 'Maximum Sealevel Pressure' },
		{ value: 'pressure_msl_min', label: 'Minimum Sealevel Pressure' },
		{ value: 'vapor_pressure_deficit_max', label: 'Maximum Vapour Pressure Deficit' }
	],
	[
		{ value: 'surface_pressure_mean', label: 'Mean Surface Pressure' },
		{ value: 'surface_pressure_max', label: 'Maximum Surface Pressure' },
		{ value: 'surface_pressure_min', label: 'Minimum Surface Pressure' },
		{ value: 'updraft_max', label: 'Maximum Updraft' },
		{ value: 'visibility_mean', label: 'Mean Visibility' },
		{ value: 'visibility_min', label: 'Minimum Visibility' },
		{ value: 'visibility_max', label: 'Maximum Visibility' },
		{ value: 'winddirection_10m_dominant', label: 'Dominant Wind Direction (10m)' },
		{ value: 'wind_gusts_10m_mean', label: 'Mean Wind Gusts (10 m)' },
		{ value: 'wind_speed_10m_mean', label: 'Mean Wind Speed (10 m)' },
		{ value: 'wind_gusts_10m_min', label: 'Minimum Wind Gusts (10 m)' },
		{ value: 'wind_speed_10m_min', label: 'Minimum Wind Speed (10 m)' }
	],
	[
		{ value: 'wet_bulb_temperature_2m_mean', label: 'Mean Wet Bulb Temperature (2 m)' },
		{ value: 'wet_bulb_temperature_2m_max', label: 'Maximum Wet Bulb Temperature (2 m)' },
		{ value: 'wet_bulb_temperature_2m_min', label: 'Minimum Wet Bulb Temperature (2 m)' },
		{ value: 'soil_moisture_0_to_100cm_mean', label: 'Mean Soil Moisture (0-100 cm)' },
		{ value: 'soil_moisture_0_to_10cm_mean', label: 'Mean Soil Moisture (0-10 cm)' },
		{ value: 'soil_moisture_0_to_7cm_mean', label: 'Mean Soil Moisture (0-7 cm)' },
		{ value: 'soil_moisture_28_to_100cm_mean', label: 'Mean Soil Moisture (28-100 cm)' },
		{ value: 'soil_moisture_7_to_28cm_mean', label: 'Mean Soil Moisture (7-28 cm)' },
		{ value: 'soil_temperature_0_to_100cm_mean', label: 'Mean Soil Temperature (0-100 cm)' },
		{ value: 'soil_temperature_0_to_7cm_mean', label: 'Mean Soil Temperature (0-7 cm)' },
		{ value: 'soil_temperature_28_to_100cm_mean', label: 'Mean Soil Temperature (28-100 cm)' },
		{ value: 'soil_temperature_7_to_28cm_mean', label: 'Mean Soil Temperature (7-28 cm)' }
	]
];

if (dev) {
	daily.push([
		{ value: 'soil_temperature_0_to_100cm_mean', label: 'Mean Soil Temperature (0-100 cm)' },
		{ value: 'soil_moisture_0_to_100cm_mean', label: 'Mean Soil Moisture (0-100 cm)' },
		{ value: 'soil_moisture_index_0_to_100cm_mean', label: 'Mean Soil Moisture Index (0-100 cm)' },
		{ value: 'growing_degree_days_base_0_limit_50', label: 'Growing Degree Days Base 0 Limit 50' },
		{ value: 'leaf_wetness_probability_mean', label: 'Mean Leaf Wetness Probability' },
		{ value: 'vapour_pressure_deficit_max', label: 'Vapour Pressure Deficit Max' }
	]);
}

export const additionalVariables = [
	[
		{ value: 'boundary_layer_height', label: 'Boundary Layer Height PBL' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' },
		{
			value: 'total_column_integrated_water_vapour',
			label: 'Total Column Integrated Water Vapour'
		}
	],
	[
		{ value: 'is_day', label: 'Is Day or Night' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' },
		{ value: 'albedo', label: 'Albedo (only CERRA)' },
		{ value: 'snow_depth_water_equivalent', label: 'Snow Depth Water Equivalent (only CERRA)' }
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

export const ensembleSpreadVariables = [
	[
		{ value: 'temperature_2m_spread', label: 'Temperature (2 m)' },
		{ value: 'dew_point_2m_spread', label: 'Dewpoint (2 m)' },
		{ value: 'precipitation_spread', label: 'Precipitation (rain + snow)' },
		{ value: 'snowfall_spread', label: 'Snowfall' },
		{ value: 'shortwave_radiation_spread', label: 'Shortwave Solar Radiation GHI' },
		{ value: 'direct_radiation_spread', label: 'Direct Solar Radiation' },
		{ value: 'pressure_msl_spread', label: 'Sealevel Pressure' },
		{ value: 'cloud_cover_low_spread', label: 'Cloud cover Low' },
		{ value: 'cloud_cover_mid_spread', label: 'Cloud cover Mid' },
		{ value: 'cloud_cover_high_spread', label: 'Cloud cover High' }
	],
	[
		{ value: 'wind_speed_10m_spread', label: 'Wind Speed (10 m)' },
		{ value: 'wind_speed_100m_spread', label: 'Wind Speed (100 m)' },
		{ value: 'wind_direction_10m_spread', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_100m_spread', label: 'Wind Direction (100 m)' },
		{ value: 'wind_gusts_10m_spread', label: 'Wind Gusts (10 m)' },
		{ value: 'soil_temperature_0_to_7cm_spread', label: 'Soil Temperature (0-7 cm)' },
		{ value: 'soil_temperature_7_to_28cm_spread', label: 'Soil Temperature (7-28 cm)' },
		{ value: 'soil_temperature_28_to_100cm_spread', label: 'Soil Temperature (28-100 cm)' },
		{ value: 'soil_temperature_100_to_255cm_spread', label: 'Soil Temperature (100-255 cm)' },
		{ value: 'soil_moisture_0_to_7cm_spread', label: 'Soil Moisture (0-7 cm)' },
		{ value: 'soil_moisture_7_to_28cm_spread', label: 'Soil Moisture (7-28 cm)' },
		{ value: 'soil_moisture_28_to_100cm_spread', label: 'Soil Moisture (28-100 cm)' },
		{ value: 'soil_moisture_100_to_255cm_spread', label: 'Soil Moisture (100-255 cm)' }
	]
];

export const models = [
	[
		{ value: 'best_match', label: 'Best match', caption: 'ECMWF IFS & ERA5' },
		{ value: 'ecmwf_ifs', label: 'ECMWF IFS', caption: '9 km, Global, 2017 onwards' },
		{
			value: 'ecmwf_ifs_analysis_long_window',
			label: 'ECMWF IFS Analysis Long-Window',
			caption: '9 km, 6-Hourly Measurements'
		}
		//{ value: 'ecmwf_ifs_analysis', label: 'ECMWF IFS Analysis', caption: '9 km, 6-Hourly Measurements' },
		//{ value: 'ecmwf_ifs_long_window', label: 'ECMWF IFS Long-Window', caption: '9 km, 1-Hourly' }
	],
	[
		{ value: 'era5_seamless', label: 'ERA5-Seamless', caption: 'ERA5 & ERA5-Land combined' },
		{ value: 'era5', label: 'ERA5', caption: '25 km, Global' },
		{ value: 'era5_land', label: 'ERA5-Land', caption: '10 km, Global' },
		{ value: 'era5_ensemble', label: 'ERA5-Ensemble', caption: '0.5° ~55km, Global' },
		{ value: 'cerra', label: 'CERRA', caption: '5 km, Europe, 1985 to June 2021' }
	]
];

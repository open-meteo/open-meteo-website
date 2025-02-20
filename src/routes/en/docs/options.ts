export const defaultParameters = {
	current: [],
	minutely_15: [],
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
	temporal_resolution: '',
	forecast_days: '7',
	forecast_hours: '',
	forecast_minutely_15: '',
	start_date: '',
	end_date: '',
	tilt: 0,
	azimuth: 0,
	time_mode: 'forecast_days',
	cell_selection: '',
	models: []
};

export const pressureVariables = [
	{ name: 'temperature', label: 'Temperature' },
	{ name: 'relative_humidity', label: 'Relative Humidity' },
	{ name: 'cloud_cover', label: 'Cloud cover' },
	{ name: 'wind_speed', label: 'Wind Speed' },
	{ name: 'wind_direction', label: 'Wind Direction' },
	{ name: 'geopotential_height', label: 'Geopotential Height' }
];

export const levels = [
	30, 50, 70, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900, 925, 950, 975, 1000
].reverse();

export const hourly = [
	[
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' },
		{ name: 'precipitation_probability', label: 'Precipitation Probability' },
		{ name: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ name: 'rain', label: 'Rain' },
		{ name: 'showers', label: 'Showers' },
		{ name: 'snowfall', label: 'Snowfall' },
		{ name: 'snow_depth', label: 'Snow Depth' }
	],
	[
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'pressure_msl', label: 'Sealevel Pressure' },
		{ name: 'surface_pressure', label: 'Surface Pressure' },
		{ name: 'cloud_cover', label: 'Cloud cover Total' },
		{ name: 'cloud_cover_low', label: 'Cloud cover Low' },
		{ name: 'cloud_cover_mid', label: 'Cloud cover Mid' },
		{ name: 'cloud_cover_high', label: 'Cloud cover High' },
		{ name: 'visibility', label: 'Visibility' },
		{ name: 'evapotranspiration', label: 'Evapotranspiration' },
		{ name: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ name: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
		{ name: 'wind_speed_120m', label: 'Wind Speed (120 m)' },
		{ name: 'wind_speed_180m', label: 'Wind Speed (180 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ name: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
		{ name: 'wind_direction_120m', label: 'Wind Direction (120 m)' },
		{ name: 'wind_direction_180m', label: 'Wind Direction (180 m)' },
		{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ name: 'temperature_80m', label: 'Temperature (80 m)' },
		{ name: 'temperature_120m', label: 'Temperature (120 m)' },
		{ name: 'temperature_180m', label: 'Temperature (180 m)' }
	],
	[
		{ name: 'soil_temperature_0cm', label: 'Soil Temperature (0 cm)' },
		{ name: 'soil_temperature_6cm', label: 'Soil Temperature (6 cm)' },
		{ name: 'soil_temperature_18cm', label: 'Soil Temperature (18 cm)' },
		{ name: 'soil_temperature_54cm', label: 'Soil Temperature (54 cm)' },
		{ name: 'soil_moisture_0_to_1cm', label: 'Soil Moisture (0-1 cm)' },
		{ name: 'soil_moisture_1_to_3cm', label: 'Soil Moisture (1-3 cm)' },
		{ name: 'soil_moisture_3_to_9cm', label: 'Soil Moisture (3-9 cm)' },
		{ name: 'soil_moisture_9_to_27cm', label: 'Soil Moisture (9-27 cm)' },
		{ name: 'soil_moisture_27_to_81cm', label: 'Soil Moisture (27-81 cm)' }
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

export const minutely_15 = [
	[
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ name: 'apparent_temperature', label: 'Apparent Temperature' },
		{ name: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ name: 'rain', label: 'Rain' },
		{ name: 'snowfall', label: 'Snowfall' },
		{ name: 'snowfall_height', label: 'Snowfall Height' },
		{ name: 'freezing_level_height', label: 'Freezing Level Height' },
		{ name: 'sunshine_duration', label: 'Sunshine Duration' }
	],
	[
		{ name: 'weather_code', label: 'Weather code' },
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ name: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
		{ name: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ name: 'visibility', label: 'Visibility' },
		{ name: 'cape', label: 'CAPE' },
		{ name: 'lightning_potential', label: 'Lightning Potential Index LPI' },
		{ name: 'is_day', label: 'Is Day or Night' }
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
		{ name: 'uv_index', label: 'UV Index' },
		{ name: 'uv_index_clear_sky', label: 'UV Index Clear Sky' },
		{ name: 'is_day', label: 'Is Day or Night' },
		{ name: 'sunshine_duration', label: 'Sunshine Duration' },
		{ name: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' },
		{
			name: 'total_column_integrated_water_vapour',
			label: 'Total Column Integrated Water Vapour'
		}
	],
	[
		{ name: 'cape', label: 'CAPE' },
		{ name: 'lifted_index', label: 'Lifted Index' },
		{ name: 'convective_inhibition', label: 'Convective Inhibition' },
		{ name: 'freezing_level_height', label: 'Freezing Level Height' },
		{ name: 'boundary_layer_height', label: 'Boundary Layer Height PBL' }
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
		{ name: 'best_match', label: 'Best match' },
		{ name: 'ecmwf_ifs04', label: 'ECMWF IFS 0.4°' },
		{ name: 'ecmwf_ifs025', label: 'ECMWF IFS 0.25°' },
		{ name: 'ecmwf_aifs025', label: 'ECMWF AIFS 0.25°' },
		{ name: 'ecmwf_aifs025_single', label: 'ECMWF AIFS 0.25° Single' },
		{ name: 'cma_grapes_global', label: 'CMA GRAPES Global' },
		{ name: 'bom_access_global', label: 'BOM ACCESS Global' }
	],
	[
		{ name: 'gfs_seamless', label: 'NCEP GFS Seamless' },
		{ name: 'gfs_global', label: 'NCEP GFS Global 0.11°/0.25°' },
		{ name: 'gfs_hrrr', label: 'NCEP HRRR U.S. Conus' },
		{ name: 'ncep_nbm_conus', label: 'NCEP NBM U.S. Conus' },
		{ name: 'gfs_graphcast025', label: 'GFS GraphCast' }
	],
	[
		{ name: 'jma_seamless', label: 'JMA Seamless' },
		{ name: 'jma_msm', label: 'JMA MSM' },
		{ name: 'jma_gsm', label: 'JMA GSM' }
	],
	[
		{ name: 'icon_seamless', label: 'DWD ICON Seamless' },
		{ name: 'icon_global', label: 'DWD ICON Global' },
		{ name: 'icon_eu', label: 'DWD ICON EU' },
		{ name: 'icon_d2', label: 'DWD ICON D2' }
	],
	[
		{ name: 'gem_seamless', label: 'GEM Seamless' },
		{ name: 'gem_global', label: 'GEM Global' },
		{ name: 'gem_regional', label: 'GEM Regional' },
		{ name: 'gem_hrdps_continental', label: 'GEM HRDPS Continental' }
	],
	[
		{ name: 'meteofrance_seamless', label: 'Météo-France Seamless' },
		{ name: 'meteofrance_arpege_world', label: 'Météo-France ARPEGE World' },
		{ name: 'meteofrance_arpege_europe', label: 'Météo-France ARPEGE Europe' },
		{ name: 'meteofrance_arome_france', label: 'Météo-France AROME France' },
		{ name: 'meteofrance_arome_france_hd', label: 'Météo-France AROME France HD' }
	],
	[
		{ name: 'arpae_cosmo_seamless', label: 'ARPAE Seamless' },
		{ name: 'arpae_cosmo_2i', label: 'ARPAE COSMO 2I' },
		{ name: 'arpae_cosmo_5m', label: 'ARPAE COSMO 5M' }
	],
	[
		{ name: 'metno_seamless', label: 'MET Norway Nordic Seamless (with ECMWF)' },
		{ name: 'metno_nordic', label: 'MET Norway Nordic' }
	],
	[
		{ name: 'knmi_seamless', label: 'KNMI Seamless (with ECMWF)' },
		{ name: 'knmi_harmonie_arome_europe', label: 'KNMI Harmonie Arome Europe' },
		{ name: 'knmi_harmonie_arome_netherlands', label: 'KNMI Harmonie Arome Netherlands' },
		{ name: 'dmi_seamless', label: 'DMI Seamless (with ECMWF)' },
		{ name: 'dmi_harmonie_arome_europe', label: 'DMI Harmonie Arome Europe' }
	],
	[
		{ name: 'ukmo_seamless', label: 'UK Met Office Seamless' },
		{ name: 'ukmo_global_deterministic_10km', label: 'UK Met Office Global 10km' },
		{ name: 'ukmo_uk_deterministic_2km', label: 'UK Met Office UK 2km' }
	]
];

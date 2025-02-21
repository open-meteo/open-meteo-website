export const defaultParameters = {
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
	time_mode: 'time_interval',
	temporal_resolution: '',
	tilt: 0,
	azimuth: 0,
	models: [],
	cell_selection: ''
};

export const pressureVariables = [
	{ value: 'temperature', label: 'Temperature' },
	{ value: 'relative_humidity', label: 'Relative Humidity' },
	{ value: 'cloud_cover', label: 'Cloud cover' },
	{ value: 'wind_speed', label: 'Wind Speed' },
	{ value: 'wind_direction', label: 'Wind Direction' },
	{ value: 'geopotential_height', label: 'Geopotential Height' }
];

export const levels = [
	30, 50, 70, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900, 925, 950, 975, 1000
].reverse();

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'precipitation_probability', label: 'Precipitation Probability' },
		{ value: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'showers', label: 'Showers' },
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'snow_depth', label: 'Snow Depth' }
	],
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'pressure_msl', label: 'Sealevel Pressure' },
		{ value: 'surface_pressure', label: 'Surface Pressure' },
		{ value: 'cloud_cover', label: 'Cloud cover Total' },
		{ value: 'cloud_cover_low', label: 'Cloud cover Low' },
		{ value: 'cloud_cover_mid', label: 'Cloud cover Mid' },
		{ value: 'cloud_cover_high', label: 'Cloud cover High' },
		{ value: 'visibility', label: 'Visibility' },
		{ value: 'evapotranspiration', label: 'Evapotranspiration' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
		{ value: 'wind_speed_120m', label: 'Wind Speed (120 m)' },
		{ value: 'wind_speed_180m', label: 'Wind Speed (180 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
		{ value: 'wind_direction_120m', label: 'Wind Direction (120 m)' },
		{ value: 'wind_direction_180m', label: 'Wind Direction (180 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ value: 'temperature_80m', label: 'Temperature (80 m)' },
		{ value: 'temperature_120m', label: 'Temperature (120 m)' },
		{ value: 'temperature_180m', label: 'Temperature (180 m)' }
	],
	[
		{ value: 'soil_temperature_0cm', label: 'Soil Temperature (0 cm)' },
		{ value: 'soil_temperature_6cm', label: 'Soil Temperature (6 cm)' },
		{ value: 'soil_temperature_18cm', label: 'Soil Temperature (18 cm)' },
		{ value: 'soil_temperature_54cm', label: 'Soil Temperature (54 cm)' },
		{ value: 'soil_moisture_0_to_1cm', label: 'Soil Moisture (0-1 cm)' },
		{ value: 'soil_moisture_1_to_3cm', label: 'Soil Moisture (1-3 cm)' },
		{ value: 'soil_moisture_3_to_9cm', label: 'Soil Moisture (3-9 cm)' },
		{ value: 'soil_moisture_9_to_27cm', label: 'Soil Moisture (9-27 cm)' },
		{ value: 'soil_moisture_27_to_81cm', label: 'Soil Moisture (27-81 cm)' }
	]
];

export const minutely_15 = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'snowfall_height', label: 'Snowfall Height' },
		{ value: 'freezing_level_height', label: 'Freezing Level Height' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' }
	],
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ value: 'visibility', label: 'Visibility' },
		{ value: 'cape', label: 'CAPE' },
		{ value: 'lightning_potential', label: 'Lightning Potential Index LPI' },
		{ value: 'is_day', label: 'Is Day or Night' }
	]
];

export const daily = [
	[
		{ value: 'weather_code', label: 'Weather code' },
		{ value: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ value: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ value: 'apparent_temperature_max', label: 'Maximum Apparent Temperature (2 m)' },
		{ value: 'apparent_temperature_min', label: 'Minimum Apparent Temperature (2 m)' },
		{ value: 'sunrise', label: 'Sunrise' },
		{ value: 'sunset', label: 'Sunset' },
		{ value: 'daylight_duration', label: 'Daylight Duration' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' },
		{ value: 'uv_index_max', label: 'UV Index' },
		{ value: 'uv_index_clear_sky_max', label: 'UV Index Clear Sky' }
	],
	[
		{ value: 'precipitation_sum', label: 'Precipitation Sum' },
		{ value: 'rain_sum', label: 'Rain Sum' },
		{ value: 'showers_sum', label: 'Showers Sum' },
		{ value: 'snowfall_sum', label: 'Snowfall Sum' },
		{ value: 'precipitation_hours', label: 'Precipitation Hours' },
		{ value: 'precipitation_probability_max', label: 'Precipitation Probability Max' },
		{ value: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
		{ value: 'wind_gusts_10m_max', label: 'Maximum Wind Gusts (10 m)' },
		{ value: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' },
		{ value: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' }
	]
];

export const additionalVariables = [
	[
		{ value: 'uv_index', label: 'UV Index' },
		{ value: 'uv_index_clear_sky', label: 'UV Index Clear Sky' },
		{ value: 'is_day', label: 'Is Day or Night' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' },
		{ value: 'wet_bulb_temperature_2m', label: 'Wet Bulb Temperature (2 m)' },
		{
			value: 'total_column_integrated_water_vapour',
			label: 'Total Column Integrated Water Vapour'
		}
	],
	[
		{ value: 'cape', label: 'CAPE' },
		{ value: 'lifted_index', label: 'Lifted Index' },
		{ value: 'convective_inhibition', label: 'Convective Inhibition' },
		{ value: 'freezing_level_height', label: 'Freezing Level Height' },
		{ value: 'boundary_layer_height', label: 'Boundary Layer Height PBL' },
		{ value: 'hail', label: 'Hail (only Met Office UK 2km)' }
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
		{ value: 'best_match', label: 'Best match' },
		{ value: 'ecmwf_ifs04', label: 'ECMWF IFS 0.4°' },
		{ value: 'ecmwf_ifs025', label: 'ECMWF IFS 0.25°' },
		{ value: 'ecmwf_aifs025', label: 'ECMWF AIFS 0.25°' },
		{ value: 'ecmwf_aifs025_single', label: 'ECMWF AIFS 0.25° Single' },
		{ value: 'cma_grapes_global', label: 'CMA GRAPES Global' },
		{ value: 'bom_access_global', label: 'BOM ACCESS Global' }
	],
	[
		{ value: 'gfs_seamless', label: 'NCEP GFS Seamless' },
		{ value: 'gfs_global', label: 'NCEP GFS Global 0.11°/0.25°' },
		{ value: 'gfs_hrrr', label: 'NCEP HRRR U.S. Conus' },
		{ value: 'ncep_nbm_conus', label: 'NCEP NBM U.S. Conus' },
		{ value: 'gfs_graphcast025', label: 'GFS GraphCast' }
	],
	[
		{ value: 'jma_seamless', label: 'JMA Seamless' },
		{ value: 'jma_msm', label: 'JMA MSM' },
		{ value: 'jma_gsm', label: 'JMA GSM' }
	],
	[
		{ value: 'icon_seamless', label: 'DWD ICON Seamless' },
		{ value: 'icon_global', label: 'DWD ICON Global' },
		{ value: 'icon_eu', label: 'DWD ICON EU' },
		{ value: 'icon_d2', label: 'DWD ICON D2' }
	],
	[
		{ value: 'gem_seamless', label: 'GEM Seamless' },
		{ value: 'gem_global', label: 'GEM Global' },
		{ value: 'gem_regional', label: 'GEM Regional' },
		{ value: 'gem_hrdps_continental', label: 'GEM HRDPS Continental' }
	],
	[
		{ value: 'meteofrance_seamless', label: 'Météo-France Seamless' },
		{ value: 'meteofrance_arpege_world', label: 'Météo-France ARPEGE World' },
		{ value: 'meteofrance_arpege_europe', label: 'Météo-France ARPEGE Europe' },
		{ value: 'meteofrance_arome_france', label: 'Météo-France AROME France' },
		{ value: 'meteofrance_arome_france_hd', label: 'Météo-France AROME France HD' }
	],
	[
		{ value: 'arpae_cosmo_seamless', label: 'ARPAE Seamless' },
		{ value: 'arpae_cosmo_2i', label: 'ARPAE COSMO 2I' },
		{ value: 'arpae_cosmo_5m', label: 'ARPAE COSMO 5M' }
	],
	[
		{ value: 'metno_seamless', label: 'MET Norway Nordic Seamless (with ECMWF)' },
		{ value: 'metno_nordic', label: 'MET Norway Nordic' }
	],
	[
		{ value: 'knmi_seamless', label: 'KNMI Seamless (with ECMWF)' },
		{ value: 'knmi_harmonie_arome_europe', label: 'KNMI Harmonie Arome Europe' },
		{ value: 'knmi_harmonie_arome_netherlands', label: 'KNMI Harmonie Arome Netherlands' },
		{ value: 'dmi_seamless', label: 'DMI Seamless (with ECMWF)' },
		{ value: 'dmi_harmonie_arome_europe', label: 'DMI Harmonie Arome Europe' }
	],
	[
		{ value: 'ukmo_seamless', label: 'UK Met Office Seamless' },
		{ value: 'ukmo_global_deterministic_10km', label: 'UK Met Office Global 10km' },
		{ value: 'ukmo_uk_deterministic_2km', label: 'UK Met Office UK 2km' }
	]
];

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
	past_days: '0',
	forecast_days: '7',

	end_date: undefined,
	start_date: undefined,

	past_hours: undefined,
	cell_selection: undefined,
	forecast_hours: undefined,
	past_minutely_15: undefined,
	temporal_resolution: undefined,
	forecast_minutely_15: undefined,

	tilt: '0',
	azimuth: '0',

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
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

export const minutely_15 = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature' },
		{ value: 'precipitation', label: 'Precipitation (rain + showers + snow)' }
	],
	[
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
		{ value: 'wind_direction_80m', label: 'Wind Direction (80 m)' }
	],
	[
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
		{ value: 'apparent_temperature_min', label: 'Minimum Apparent Temperature (2 m)' }
	],
	[
		{ value: 'sunrise', label: 'Sunrise' },
		{ value: 'sunset', label: 'Sunset' },
		{ value: 'daylight_duration', label: 'Daylight Duration' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' },
		{ value: 'uv_index_max', label: 'UV Index' },
		{ value: 'uv_index_clear_sky_max', label: 'UV Index Clear Sky' }
	],
	[
		{ value: 'rain_sum', label: 'Rain Sum' },
		{ value: 'showers_sum', label: 'Showers Sum' },
		{ value: 'snowfall_sum', label: 'Snowfall Sum' },
		{ value: 'precipitation_sum', label: 'Precipitation Sum' },
		{ value: 'precipitation_hours', label: 'Precipitation Hours' },
		{ value: 'precipitation_probability_max', label: 'Precipitation Probability Max' }
	],
	[
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
		{ value: 'pressure_msl_min', label: 'Minimum Sealevel Pressure' }
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
		{ value: 'vapour_pressure_deficit_max', label: 'Maximum Vapour Pressure Deficit' }
	]

	// available, but duplicate of correct syntax:
	//{ value: 'weathercode', label: 'XXX' },
	// { value: 'cloudcover_max', label: 'Maximum Cloud cover' },
	// { value: 'cloudcover_mean', label: 'Mean Cloud cover' },
	// { value: 'cloudcover_min', label: 'Minimum Cloud cover' },
	// { value: 'dewpoint_2m_max', label: 'Maximum Dewpoint (2 m)' },
	// { value: 'dewpoint_2m_mean', label: 'Mean Dewpoint (2 m)' },
	// { value: 'dewpoint_2m_min', label: 'Minimum Dewpoint (2 m)' },
	// { value: 'windgusts_10m_max', label: 'Maximum Wind Gusts (10 m)' },
	// { value: 'windgusts_10m_mean', label: 'Mean Wind Gusts (10 m)' },
	// { value: 'windgusts_10m_min', label: 'Minimum Wind Gusts (10 m)' },
	// { value: 'windspeed_10m_max', label: 'Maximum Wind Speed (10 m)' },
	// { value: 'windspeed_10m_mean', label: 'Mean Wind Speed (10 m)' },
	// { value: 'windspeed_10m_min', label: 'Minimum Wind Speed (10 m)' },
	// { value: 'vapor_pressure_deficit_max', label: 'Maximum Vapor Pressure Deficit' },

	// soil parameters, not available on all models
	// 	{ value: 'soil_moisture_0_to_100cm_mean', label: 'Mean Soil Moisture (0-100 cm)' },
	// { value: 'soil_moisture_0_to_10cm_mean', label: 'Mean Soil Moisture (0-10 cm)' },
	// { value: 'soil_moisture_0_to_7cm_mean', label: 'Mean Soil Moisture (0-7 cm)' },
	// { value: 'soil_moisture_28_to_100cm_mean', label: 'Mean Soil Moisture (28-100 cm)' },
	// { value: 'soil_moisture_7_to_28cm_mean', label: 'Mean Soil Moisture (7-28 cm)' },
	// { value: 'soil_moisture_index_0_to_100cm_mean', label: 'Mean Soil Moisture Index (0-100 cm)' },
	// { value: 'soil_moisture_index_0_to_7cm_mean', label: 'Mean Soil Moisture Index (0-7 cm)' },
	// { value: 'soil_moisture_index_100_to_255cm_mean', label: 'Mean Soil Moisture Index (100-255 cm)' },
	// { value: 'soil_moisture_index_28_to_100cm_mean', label: 'Mean Soil Moisture Index (28-100 cm)' },
	// { value: 'soil_moisture_index_7_to_28cm_mean', label: 'Mean Soil Moisture Index (7-28 cm)' },
	// { value: 'soil_temperature_0_to_100cm_mean', label: 'Mean Soil Temperature (0-100 cm)' },
	// { value: 'soil_temperature_0_to_7cm_mean', label: 'Mean Soil Temperature (0-7 cm)' },
	// { value: 'soil_temperature_28_to_100cm_mean', label: 'Mean Soil Temperature (28-100 cm)' },
	// { value: 'soil_temperature_7_to_28cm_mean', label: 'Mean Soil Temperature (7-28 cm)' },
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
		{ value: 'boundary_layer_height', label: 'Boundary Layer Height PBL' }
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

export const models = [
	[
		{ value: 'best_match', label: 'Best match' },
		{ value: 'ecmwf_ifs025', label: 'ECMWF IFS 0.25°' },
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
		{ value: 'kma_seamless', label: 'KMA Seamless' },
		{ value: 'kma_ldps', label: 'KMA LDPS' },
		{ value: 'kma_gdps', label: 'KMA GDPS' }
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

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '3', label: '3 days' },
	{ value: '7', label: '7 days (default)' },
	{ value: '14', label: '14 days' },
	{ value: '16', label: '16 days' }
];

export const pastDaysOptions = [
	{ value: '0', label: '0 days (default)' },
	{ value: '1', label: '1 day' },
	{ value: '2', label: '2 days' },
	{ value: '3', label: '3 days' },
	{ value: '5', label: '5 days' },
	{ value: '7', label: '1 week' },
	{ value: '14', label: '2 weeks' },
	{ value: '31', label: '1 month' },
	{ value: '61', label: '2 months' },
	{ value: '92', label: '3 months' }
];

// Additional variable options
export const forecastHoursOptions = [
	{ value: '', label: '- (default)' },
	{ value: '1', label: '1 hour' },
	{ value: '6', label: '6 hours' },
	{ value: '12', label: '12 hours' },
	{ value: '24', label: '24 hours' }
];

export const pastHoursOptions = [
	{ value: '', label: '- (default)' },
	{ value: '1', label: '1 hour' },
	{ value: '6', label: '6 hours' },
	{ value: '12', label: '12 hours' },
	{ value: '24', label: '24 hours' }
];

export const temporalResolutionOptions = [
	{ value: '', label: '1 Hourly' },
	{ value: 'hourly_3', label: '3 Hourly' },
	{ value: 'hourly_6', label: '6 Hourly' },
	{ value: 'native', label: 'Native Model Resolution' }
];

export const gridCellSelectionOptions = [
	{ value: '', label: 'Terrain Optimized, Prefers Land' },
	{ value: 'sea', label: 'Prefer Sea' },
	{ value: 'nearest', label: 'Nearest' }
];

export const forecastMinutely15Options = [
	{ value: '', label: '- (default)' },
	{ value: `${1 * 4}`, label: '1 hour' },
	{ value: `${6 * 4}`, label: '6 hours' },
	{ value: `${12 * 4}`, label: '12 hours' },
	{ value: `${24 * 4}`, label: '24 hours' }
];

export const pastMinutely15Options = [
	{ value: '', label: '- (default)' },
	{ value: `${1 * 4}`, label: '1 hour' },
	{ value: `${6 * 4}`, label: '6 hours' },
	{ value: `${12 * 4}`, label: '12 hours' },
	{ value: `${24 * 4}`, label: '24 hours' }
];

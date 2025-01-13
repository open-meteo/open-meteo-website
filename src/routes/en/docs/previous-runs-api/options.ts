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
	time_mode: 'forecast_days',
	past_days: '0',
	past_hours: '',
	past_minutely_15: '',
	forecast_days: '7',
	forecast_hours: '',
	forecast_minutely_15: '',
	temporal_resolution: '',
	start_date: '',
	end_date: '',
	tilt: 0,
	azimuth: 0,
	models: [],
	cell_selection: ''
};

export const previousDay = [
	{ name: 'temperature_2m', label: 'Temperature (2 m)' },
	{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
	{ name: 'dew_point_2m', label: 'Dewpoint (2 m)' },
	{ name: 'apparent_temperature', label: 'Apparent Temperature' },
	{ name: 'precipitation', label: 'Precipitation (rain + showers + snow)' },
	{ name: 'rain', label: 'Rain' },
	{ name: 'showers', label: 'Showers' },
	{ name: 'snowfall', label: 'Snowfall' },
	{ name: 'weather_code', label: 'Weather code' },
	{ name: 'pressure_msl', label: 'Sealevel Pressure' },
	{ name: 'surface_pressure', label: 'Surface Pressure' },
	{ name: 'cloud_cover', label: 'Cloud cover Total' },
	{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
	{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' }
];

export const solarVariables = [
	{ name: 'shortwave_radiation', label: 'Shortwave Solar Radiation GHI' },
	{ name: 'direct_radiation', label: 'Direct Solar Radiation' },
	{ name: 'diffuse_radiation', label: 'Diffuse Solar Radiation DHI' },
	{ name: 'direct_normal_irradiance', label: 'Direct Normal Irradiance DNI' },
	{ name: 'global_tilted_irradiance', label: 'Global Tilted Radiation GTI' },

	{ name: 'shortwave_radiation_instant', label: 'Shortwave Solar Radiation GHI (Instant)' },
	{ name: 'direct_radiation_instant', label: 'Direct Solar Radiation (Instant)' },
	{ name: 'diffuse_radiation_instant', label: 'Diffuse Solar Radiation DHI (Instant)' },
	{ name: 'direct_normal_irradiance_instant', label: 'Direct Normal Irradiance DNI (Instant)' },
	{ name: 'global_tilted_irradiance_instant', label: 'Global Tilted Radiation GTI' },
	{ name: 'terrestrial_radiation_instant', label: 'Terrestrial Solar Radiation (Instant)' }
];

export const windVariables = [
	{ name: 'wind_speed_80m', label: 'Wind Speed (80 m)' },
	{ name: 'wind_speed_120m', label: 'Wind Speed (120 m)' },
	{ name: 'wind_speed_180m', label: 'Wind Speed (180 m)' },
	{ name: 'wind_direction_80m', label: 'Wind Direction (80 m)' },
	{ name: 'wind_direction_120m', label: 'Wind Direction (120 m)' },
	{ name: 'wind_direction_180m', label: 'Wind Direction (180 m)' }
];

export const models = [
	[
		{ name: 'best_match', label: 'Best match' },
		{ name: 'ecmwf_ifs04', label: 'ECMWF IFS 0.4°' },
		{ name: 'ecmwf_ifs025', label: 'ECMWF IFS 0.25°' },
		{ name: 'ecmwf_aifs025', label: 'ECMWF AIFS 0.25°' },
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

import {
	bom_access_global_ensemble,
	ecmwf_aifs025_variables,
	ecmwf_ifs025_variables,
	gfs025_variables,
	gfs05_variables,
	icon_d2_variables,
	icon_eu_variables,
	icon_global_variables,
	meteoswiss_variables,
	ukmo_2km_variables,
	ukmo_variables
} from '../ensemble-options';

export const gem_global_variables = [
	'temperature_2m',
	'surface_pressure',
	'snow_depth',
	'relative_humidity_2m',
	'dew_point_2m',
	'wind_speed_10m',
	'wind_direction_10m',
	'precipitation',
	'snowfall',
	'snowfall_water_equivalent',
	'cape',
	'cloud_cover',
	'apparent_temperature',
	'weather_code',
	'pressure_msl',
	'et0_fao_evapotranspiration',
	'vapour_pressure_deficit',
	'cape',
	'rain',
	'wet_bulb_temperature_2m',
	'shortwave_radiation',
	'sunshine_duration',
	'temperature_500hPa',
	'temperature_850hPa',
	'geopotential_height_500hPa',
	'geopotential_height_850hPa',
	'is_day'
];

export const availableVariables = {
	dwd_icon_eps_ensemble_mean_seamless: icon_d2_variables,
	dwd_icon_eps_ensemble_mean: icon_global_variables,
	dwd_icon_eu_eps_ensemble_mean: icon_eu_variables,
	dwd_icon_d2_eps_ensemble_mean: icon_d2_variables,
	ncep_gefs_ensemble_mean_seamless: gfs05_variables,
	ncep_gefs025_ensemble_mean: gfs025_variables,
	ncep_gefs05_ensemble_mean: gfs05_variables,
	ncep_hgefs025_ensemble_mean: gfs025_variables,
	ecmwf_ifs025_ensemble_mean: ecmwf_ifs025_variables,
	ecmwf_aifs025_ensemble_mean: ecmwf_aifs025_variables,
	ukmo_global_ensemble_mean_20km: ukmo_variables,
	ukmo_uk_ensemble_mean_2km: ukmo_2km_variables,
	cmc_gem_geps_ensemble_mean: gem_global_variables,
	bom_access_global_ensemble_mean: bom_access_global_ensemble,
	meteoswiss_icon_ch1_ensemble_mean: meteoswiss_variables,
	meteoswiss_icon_ch2_ensemble_mean: meteoswiss_variables
};

export const models = [
	[
		{ value: 'dwd_icon_eps_ensemble_mean_seamless', label: 'DWD ICON EPS Seamless Mean' },
		{ value: 'dwd_icon_eps_ensemble_mean', label: 'DWD ICON EPS Global Mean' },
		{ value: 'dwd_icon_eu_eps_ensemble_mean', label: 'DWD ICON EPS EU Mean' },
		{ value: 'dwd_icon_d2_eps_ensemble_mean', label: 'DWD ICON EPS D2 Mean' }
	],
	[
		{ value: 'ncep_gefs_ensemble_mean_seamless', label: 'GFS Ensemble Seamless Mean' },
		{ value: 'ncep_gefs025_ensemble_mean', label: 'GFS Ensemble 0.25° Mean' },
		{ value: 'ncep_gefs05_ensemble_mean', label: 'GFS Ensemble 0.5° Mean' },
		{ value: 'ncep_hgefs025_ensemble_mean', label: 'HGEFS 0.25° Mean' }
	],
	[
		{ value: 'ecmwf_ifs025_ensemble_mean', label: 'ECMWF IFS 0.25° Ensemble Mean' },
		{ value: 'ecmwf_aifs025_ensemble_mean', label: 'ECMWF AIFS 0.25° Ensemble Mean' },
		{ value: 'cmc_gem_geps_ensemble_mean', label: 'GEM Global Ensemble Mean' },
		{ value: 'bom_access_global_ensemble_mean', label: 'BOM ACCESS Global Mean' }
	],
	[
		{ value: 'ukmo_global_ensemble_mean_20km', label: 'UK MetOffice Global 20km Mean' },
		{ value: 'ukmo_uk_ensemble_mean_2km', label: 'UK MetOffice UK 2km Mean' }
	],
	[
		{ value: 'meteoswiss_icon_ch1_ensemble_mean', label: 'MeteoSwiss ICON CH1 Mean' },
		{ value: 'meteoswiss_icon_ch2_ensemble_mean', label: 'MeteoSwiss ICON CH2 Mean' }
	]
];

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '3', label: '3 days' },
	{ value: '7', label: '7 days (default)' },
	{ value: '14', label: '14 days' },
	{ value: '16', label: '16 days' },
	{ value: '30', label: '30 days' },
	{ value: '35', label: '35 days' }
];

export const noSpreadVariables = ['is_day', 'weather_code'];

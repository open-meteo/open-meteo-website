import {
	aigfs025_variables,
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

export const cmc_gem_global_variables = [
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

export const availableVariables: Record<string, string[]> = {
	// TODO: revert to dwd_icon_*_eps keys once backend prefix aliases are deployed
	icon_seamless_eps: icon_d2_variables,
	icon_global_eps: icon_global_variables,
	icon_eu_eps: icon_eu_variables,
	icon_d2_eps: icon_d2_variables,
	ncep_gefs_seamless: gfs05_variables,
	ncep_gefs025: gfs025_variables,
	ncep_gefs05: gfs05_variables,
	ncep_aigefs025: aigfs025_variables,
	ecmwf_ifs025_ensemble: ecmwf_ifs025_variables,
	ecmwf_aifs025_ensemble: ecmwf_aifs025_variables,
	ukmo_global_ensemble_20km: ukmo_variables,
	ukmo_uk_ensemble_2km: ukmo_2km_variables,
	// TODO: revert to cmc_gem_geps key once backend prefix aliases are deployed
	gem_global_ensemble: cmc_gem_global_variables,
	bom_access_global_ensemble: bom_access_global_ensemble,
	meteoswiss_icon_ch1_ensemble: meteoswiss_variables,
	meteoswiss_icon_ch2_ensemble: meteoswiss_variables
};

export const models = [
	[
		// TODO: revert to dwd_icon_*_eps values once backend prefix aliases are deployed
		{ value: 'icon_seamless_eps', label: 'DWD ICON EPS Seamless' },
		{ value: 'icon_global_eps', label: 'DWD ICON EPS Global' },
		{ value: 'icon_eu_eps', label: 'DWD ICON EPS EU' },
		{ value: 'icon_d2_eps', label: 'DWD ICON EPS D2' }
	],
	[
		{ value: 'ncep_gefs_seamless', label: 'GFS Ensemble Seamless' },
		{ value: 'ncep_gefs025', label: 'GFS Ensemble 0.25°' },
		{ value: 'ncep_gefs05', label: 'GFS Ensemble 0.5°' },
		{ value: 'ncep_aigefs025', label: 'AIGEFS 0.25°' }
	],
	[
		{ value: 'ecmwf_ifs025_ensemble', label: 'ECMWF IFS 0.25° Ensemble' },
		{ value: 'ecmwf_aifs025_ensemble', label: 'ECMWF AIFS 0.25° Ensemble' },
		// TODO: revert to 'cmc_gem_geps' once backend prefix aliases are deployed
		{ value: 'gem_global_ensemble', label: 'GEM Global Ensemble' },
		{ value: 'bom_access_global_ensemble', label: 'BOM ACCESS Global' }
	],
	[
		{ value: 'ukmo_global_ensemble_20km', label: 'UK MetOffice Global 20km' },
		{ value: 'ukmo_uk_ensemble_2km', label: 'UK MetOffice UK 2km' }
	],
	[
		{ value: 'meteoswiss_icon_ch1_ensemble', label: 'MeteoSwiss ICON CH1' },
		{ value: 'meteoswiss_icon_ch2_ensemble', label: 'MeteoSwiss ICON CH2' }
	]
];

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '3', label: '3 days' },
	{ value: '7', label: '7 days (default)' },
	{ value: '14', label: '14 days' },
	{ value: '16', label: '16 days' },
	{ value: '30', label: '30 days' },
	{ value: '36', label: '36 days' }
];

export const pastDaysOptions = [
	{ value: '0', label: '0 days (default)' },
	{ value: '1', label: '1 day' },
	{ value: '2', label: '2 days' },
	{ value: '3', label: '3 days' }
];

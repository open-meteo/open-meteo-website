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

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		// { value: 'dew_point_2m', label: 'Dewpoint (2 m)' },
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
	]
];

export interface Domain {
	value: string;
	label: string;
	grid: {
		nx: number;
		ny: number;
		lonMin: number;
		latMin: number;
		dx: number;
		dy: number;
	};
}

export const domains = [
	// { value: 'bom_access_global', label: 'BOM Access Global' },
	// { value: 'bom_access_global_ensemble', label: 'BOM Access Global Ensemble' },
	// { value: 'cams_europe', label: 'CAMS Europe' },
	// { value: 'cams_global', label: 'CAMS Global' },
	// { value: 'cams_global_greenhouse_gases', label: '' },
	//{ value: 'cma_grapes_global', label: 'CMA Grapes Global)' },
	//{ value: 'dmi_harmonie_arome_europe', label: '' },
	//{ value: 'dwd_ewam', label: '' },
	{
		value: 'dwd_icon',
		label: 'DWD ICON',
		grid: { nx: 2879, ny: 1441, latMin: -90, lonMin: -180, dx: 0.125, dy: 0.125, zoom: 1 }
	},
	{
		value: 'dwd_icon_eu',
		label: 'DWD ICON EU',
		grid: { nx: 1377, ny: 657, latMin: 29.5, lonMin: -23.5, dx: 0.0625, dy: 0.0625, zoom: 2.2 }
	},
	{
		value: 'dwd_icon_d2',
		label: ' DWD ICON D2',
		grid: { nx: 1214, ny: 745, latMin: 43.18, lonMin: -3.94, dx: 0.02, dy: 0.02, zoom: 3.75 }
	},

	// { value: 'dwd_icon_d2_eps', label: 'DWD ICON D2 EPS' },
	// { value: 'dwd_icon_eps', label: 'DWD ICON EPS' },
	// { value: 'dwd_icon_eu_eps', label: 'DWD ICON EU EPS' },
	// { value: 'ecmwf_aifs025_single', label: '' },
	// { value: 'ecmwf_ifs025', label: '' },
	// { value: 'ecmwf_ifs025_ensemble', label: '' },
	// { value: 'ecmwf_wam025', label: '' },
	// { value: 'italia_meteo_arpae_icon_2i', label: '' },
	// { value: 'jma_gsm', label: '' },
	// { value: 'jma_msm', label: '' },
	// { value: 'knmi_harmonie_arome_europe', label: 'KNMI Harmonie AROME EU' },
	// { value: 'knmi_harmonie_arome_netherlands', label: 'KNMI Harmonie AROME NL' },
	// { value: 'meteofrance_arome_france0025', label: 'MF AROME' },
	// { value: 'meteofrance_arome_france0025_15min', label: 'MF AROME 15min' },
	// { value: 'meteofrance_arome_france_hd', label: 'MF AROME HD' },
	// { value: 'meteofrance_arome_france_hd_15min', label: 'MF AROME HD 15min' },
	{
		value: 'meteofrance_arpege_europe',
		label: 'MF ARPEGE EU',
		grid: { nx: 741, ny: 521, latMin: 20, lonMin: -32, dx: 0.1, dy: 0.1, zoom: 2 }
	}
	// { value: 'meteofrance_arpege_europe_probabilities', label: 'MF ARPEGE EU Prob' },
	// { value: 'meteofrance_arpege_world025', label: 'MF ARPEGE World' },
	// { value: 'meteofrance_currents', label: '' },
	// { value: 'meteofrance_sea_surface_temperature', label: '' },
	// { value: 'meteofrance_wave', label: '' },
	// { value: 'metno_nordic_pp', label: '' },
	// { value: 'ncep_gefs025', label: '' },
	// { value: 'ncep_gefs05', label: '' },
	// { value: 'ncep_gfs013', label: '' },
	// { value: 'ncep_gfs025', label: '' },
	// { value: 'ncep_gfs_graphcast025', label: '' },
	// { value: 'ncep_hrrr_conus', label: '' },
	// { value: 'ncep_nbm_conus', label: '' },
	// { value: 'ukmo_global_deterministic_10km', label: '' },
	// { value: 'ukmo_uk_deterministic_2km', label: '' }
];

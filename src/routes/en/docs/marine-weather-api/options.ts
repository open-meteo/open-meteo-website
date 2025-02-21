export const defaultParameters = {
	current: [],
	hourly: [],
	daily: [],
	location_mode: 'location_search',
	csv_coordinates: '',
	length_unit: 'metric',
	wind_speed_unit: 'kmh',
	timeformat: 'iso8601',
	timezone: 'UTC',
	past_days: '0',
	past_hours: '',
	forecast_days: '7',
	forecast_hours: '',
	temporal_resolution: '',
	start_date: '',
	end_date: '',
	time_mode: 'forecast_days',
	models: []
};

export const hourly = [
	[
		{ value: 'wave_height', label: 'Wave Height' },
		{ value: 'wave_direction', label: 'Wave Direction' },
		{ value: 'wave_period', label: 'Wave Period' }
	],
	[
		{ value: 'wind_wave_height', label: 'Wind Wave Height' },
		{ value: 'wind_wave_direction', label: 'Wind Wave Direction' },
		{ value: 'wind_wave_period', label: 'Wind Wave Period' },
		{ value: 'wind_wave_peak_period', label: 'Wind Wave Peak Period' }
	],
	[
		{ value: 'swell_wave_height', label: 'Swell Wave Height' },
		{ value: 'swell_wave_direction', label: 'Swell Wave Direction' },
		{ value: 'swell_wave_period', label: 'Swell Wave Period' },
		{ value: 'swell_wave_peak_period', label: 'Swell Wave Peak Period' }
	],
	[
		{ value: 'ocean_current_velocity', label: 'Ocean Current Velocity' },
		{ value: 'ocean_current_direction', label: 'Ocean Current Direction' },
		{
			value: 'sea_level_height_msl',
			label: 'Sea Level Height including tides (above global mean sea level)'
		},
		{ value: 'sea_surface_temperature', label: 'Sea Surface Temperature SST' }
	]
];

export const minutely_15 = [
	[
		{ value: 'ocean_current_velocity', label: 'Ocean Current Velocity' },
		{ value: 'ocean_current_direction', label: 'Ocean Current Direction' }
	],
	[
		{
			value: 'sea_level_height_msl',
			label: 'Sea Level Height including tides (above global mean sea level)'
		}
	]
];

export const daily = [
	[
		{ value: 'wave_height_max', label: 'Wave Height Max' },
		{ value: 'wave_direction_dominant', label: 'Wave Direction Dominant' },
		{ value: 'wave_period_max', label: 'Wave Period Max' }
	],
	[
		{ value: 'wind_wave_height_max', label: 'Wind Wave Height Max' },
		{ value: 'wind_wave_direction_dominant', label: 'Wind Wave Direction Dominant' },
		{ value: 'wind_wave_period_max', label: 'Wind Wave Period Max' },
		{ value: 'wind_wave_peak_period_max', label: 'Wind Wave Peak Period Max' }
	],
	[
		{ value: 'swell_wave_height_max', label: 'Swell Wave Height Max' },
		{ value: 'swell_wave_direction_dominant', label: 'Swell Wave Direction Dominant' },
		{ value: 'swell_wave_period_max', label: 'Swell Wave Period Max' },
		{ value: 'swell_wave_peak_period_max', label: 'Swell Wave Peak Period Max' }
	]
];

export const additionalVariables = [
	[
		{ value: 'wave_peak_period', label: 'Wave Peak Period (ERA5 only)' },
		{ value: 'invert_barometer_height', label: 'Inverted Barometer Height' }
	],
	[]
];

export const models = [
	[{ value: 'best_match', label: 'Best match', caption: 'MeteoFrance Wave & Currents' }],
	[
		{ value: 'meteofrance_wave', label: 'MeteoFrance Wave', caption: '0.083°' },
		{ value: 'meteofrance_currents', label: 'MeteoFrance Ocean Currents', caption: '0.083°' },
		{ value: 'ewam', label: 'DWD EWAM', caption: '0.05° only Europe' },
		{ value: 'gwam', label: 'DWD GWAM', caption: '0.25°' },
		{ value: 'ecmwf_wam025', label: 'ECMWF WAM', caption: '0.25°, global' },
		//{ value: 'ecmwf_wam025_ensemble', label: 'ECMWF WAM Ensemble', caption: '0.25°, global, 51 members' },
		{ value: 'ncep_gfswave025', label: 'GFS Wave 0.25°', caption: '0.25°, global' },
		{ value: 'ncep_gfswave016', label: 'GFS Wave 0.16°', caption: '0.16°, mid-latitudes' },
		//{ value: 'ncep_gefswave025', label: 'GFS Wave Ensemble', caption: '0.25°, global, 31 members' },
		{ value: 'era5_ocean', label: 'ERA5-Ocean', caption: '0.5°, data from 1940 onwards' }
	]
];

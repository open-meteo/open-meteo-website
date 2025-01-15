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
		{ name: 'wave_height', label: 'Wave Height' },
		{ name: 'wave_direction', label: 'Wave Direction' },
		{ name: 'wave_period', label: 'Wave Period' }
	],
	[
		{ name: 'wind_wave_height', label: 'Wind Wave Height' },
		{ name: 'wind_wave_direction', label: 'Wind Wave Direction' },
		{ name: 'wind_wave_period', label: 'Wind Wave Period' },
		{ name: 'wind_wave_peak_period', label: 'Wind Wave Peak Period' }
	],
	[
		{ name: 'swell_wave_height', label: 'Swell Wave Height' },
		{ name: 'swell_wave_direction', label: 'Swell Wave Direction' },
		{ name: 'swell_wave_period', label: 'Swell Wave Period' },
		{ name: 'swell_wave_peak_period', label: 'Swell Wave Peak Period' }
	],
	[
		{ name: 'ocean_current_velocity', label: 'Ocean Current Velocity' },
		{ name: 'ocean_current_direction', label: 'Ocean Current Direction' }
	]
];

export const daily = [
	[
		{ name: 'wave_height_max', label: 'Wave Height Max' },
		{ name: 'wave_direction_dominant', label: 'Wave Direction Dominant' },
		{ name: 'wave_period_max', label: 'Wave Period Max' }
	],
	[
		{ name: 'wind_wave_height_max', label: 'Wind Wave Height Max' },
		{ name: 'wind_wave_direction_dominant', label: 'Wind Wave Direction Dominant' },
		{ name: 'wind_wave_period_max', label: 'Wind Wave Period Max' },
		{ name: 'wind_wave_peak_period_max', label: 'Wind Wave Peak Period Max' }
	],
	[
		{ name: 'swell_wave_height_max', label: 'Swell Wave Height Max' },
		{ name: 'swell_wave_direction_dominant', label: 'Swell Wave Direction Dominant' },
		{ name: 'swell_wave_period_max', label: 'Swell Wave Period Max' },
		{ name: 'swell_wave_peak_period_max', label: 'Swell Wave Peak Period Max' }
	]
];

export const additionalVariables = [
	[{ name: 'wave_peak_period', label: 'Wave Peak Period (ERA5 only)' }],
	[]
];

export const models = [
	[{ name: 'best_match', label: 'Best match', caption: 'MeteoFrance Wave & Currents' }],
	[
		{ name: 'meteofrance_wave', label: 'MeteoFrance Wave', caption: '0.083°' },
		{ name: 'meteofrance_currents', label: 'MeteoFrance Ocean Currents', caption: '0.083°' },
		{ name: 'ewam', label: 'DWD EWAM', caption: '0.05° only Europe' },
		{ name: 'gwam', label: 'DWD GWAM', caption: '0.25°' },
		{ name: 'ecmwf_wam025', label: 'ECMWF WAM', caption: '0.25°, global' },
		//{ name: 'ecmwf_wam025_ensemble', label: 'ECMWF WAM Ensemble', caption: '0.25°, global, 51 members' },
		{ name: 'ncep_gfswave025', label: 'GFS Wave 0.25°', caption: '0.25°, global' },
		{ name: 'ncep_gfswave016', label: 'GFS Wave 0.16°', caption: '0.16°, mid-latitudes' },
		//{ name: 'ncep_gefswave025', label: 'GFS Wave Ensemble', caption: '0.25°, global, 31 members' },
		{ name: 'era5_ocean', label: 'ERA5-Ocean', caption: '0.5°, data from 1940 onwards' }
	]
];

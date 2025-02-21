export const defaultParameters = {
	hourly: ['shortwave_radiation'],
	daily: [],
	location_mode: 'location_search',
	csv_coordinates: '',
	temperature_unit: 'celsius',
	wind_speed_unit: 'kmh',
	precipitation_unit: 'mm',
	timeformat: 'iso8601',
	timezone: 'UTC',
	past_days: '5',
	past_hours: '',
	past_minutely_15: '',
	forecast_days: '1',
	forecast_hours: '',
	forecast_minutely_15: '',
	temporal_resolution: '',
	start_date: '',
	end_date: '',
	tilt: 0,
	azimuth: 0,
	time_mode: 'forecast_days',
	models: [],
	cell_selection: ''
};

export const hourly = [
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

export const daily = [
	[
		{ value: 'sunrise', label: 'Sunrise' },
		{ value: 'sunset', label: 'Sunset' },
		{ value: 'daylight_duration', label: 'Daylight Duration' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' }
	],
	[{ value: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' }]
];

export const additionalVariables = [
	[{ value: 'is_day', label: 'Is Day or Night' }],
	[{ value: 'sunshine_duration', label: 'Sunshine Duration' }]
];

export const models = [
	[
		{ value: 'eumetsat_sarah3', label: 'eumetsat_sarah3' },
		{ value: 'jma_jaxa_himawari', label: 'jma_jaxa_himawari' },
		{ value: 'eumetsat_lsa_saf_msg', label: 'eumetsat_lsa_saf_msg' },
		{ value: 'eumetsat_lsa_saf_iodc', label: 'eumetsat_lsa_saf_iodc' }
	]
];

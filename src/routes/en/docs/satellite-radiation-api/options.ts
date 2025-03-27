export const defaultParameters = {
	daily: [],
	hourly: [],
	models: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: undefined,

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: '1',

	start_date: undefined,
	end_date: undefined,

	tilt: '0',
	azimuth: '0',

	past_hours: undefined,
	cell_selection: undefined,
	forecast_hours: undefined,
	past_minutely_15: undefined,
	temporal_resolution: undefined,
	forecast_minutely_15: undefined,

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
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
		{ value: 'sunset', label: 'Sunset' }
	],
	[
		{ value: 'daylight_duration', label: 'Daylight Duration' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' },
		{ value: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' }
	]
];

export const additionalVariables = [
	[{ value: 'is_day', label: 'Is Day or Night' }],
	[{ value: 'sunshine_duration', label: 'Sunshine Duration' }]
];

export const models = [
	[
		{ value: 'satellite_radiation_seamless', label: 'Automatic Selection' },
		{
			value: 'eumetsat_lsa_saf_msg',
			label: 'EUMETSAT MSG (Europe, Africa, South America, 15-minutely, since 2025, 2 hours delay)'
		},
		{
			value: 'eumetsat_lsa_saf_iodc',
			label: 'EUMETSAT IODC (Europe, Africa, India, 15-minutely, since 2025, 2 hours delay)'
		},
		{
			value: 'eumetsat_sarah3',
			label: 'EUMETSAT Sarah3 (Europe, Africa, 30-minutely, since 1983, 1 day delay)'
		},
		{
			value: 'jma_jaxa_himawari',
			label:
				'JMA JAXA Himawari (India, Asia, Australia, New Zealand, 10-minutely, since 2023, 20 minutes delay)'
		}
	]
];

export const forecastDaysOptions = [{ value: '1', label: '1 day (default)' }];

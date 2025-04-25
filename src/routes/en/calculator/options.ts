export const defaultParameters = {
	daily: [],
	hourly: [],
	models: ['best_match'],
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
	forecast_hours: undefined,
	past_minutely_15: undefined,
	forecast_minutely_15: undefined,

	tilt: '0',
	azimuth: '0',

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
};

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '3', label: '3 days' },
	{ value: '7', label: '7 days (default)' },
	{ value: '14', label: '14 days' },
	{ value: '31', label: '1 month' },
	{ value: '61', label: '2 months' },
	{ value: '92', label: '3 months' },
	{ value: '183', label: '6 months' },
	{ value: '365', label: '1 year' },
	{ value: '1095', label: '3 years' },
	{ value: '1825', label: '5 years' },
	{ value: '3650', label: '10 years' },
	{ value: '9125', label: '25 years' },
	{ value: '18250', label: '50 years' }
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
	{ value: '92', label: '3 months' },
	{ value: '183', label: '6 months' },
	{ value: '365', label: '1 year' },
	{ value: '1095', label: '3 years' },
	{ value: '1825', label: '5 years' },
	{ value: '3650', label: '10 years' },
	{ value: '9125', label: '25 years' },
	{ value: '18250', label: '50 years' }
];

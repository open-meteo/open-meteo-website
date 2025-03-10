export const defaultParameters = {
	daily: [],
	models: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: undefined,

	timeformat: 'iso8601',

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: '92',

	start_date: undefined,
	end_date: undefined,

	ensemble: false
};

export const daily = [
	[
		{ value: 'river_discharge', label: 'River Discharge' },
		{ value: 'river_discharge_mean', label: 'River Discharge Mean' },
		{ value: 'river_discharge_median', label: 'River Discharge Median' },
		{ value: 'river_discharge_max', label: 'River Discharge Maximum' },
		{ value: 'river_discharge_min', label: 'River Discharge Minimum' },
		{ value: 'river_discharge_p25', label: 'River Discharge 25<sup>th</sup> Percentile' },
		{ value: 'river_discharge_p75', label: 'River Discharge 75<sup>th</sup> Percentile' }
	]
];

export const models = [
	[
		{ value: 'seamless_v4', label: 'GloFAS v4 Seamless' },
		{ value: 'forecast_v4', label: 'GloFAS v4 Forecast' },
		{ value: 'consolidated_v4', label: 'GloFAS v4 Consolidated' }
	],
	[
		{ value: 'seamless_v3', label: 'GloFAS v3 Seamless' },
		{ value: 'forecast_v3', label: 'GloFAS v3 Forecast' },
		{ value: 'consolidated_v3', label: 'GloFAS v3 Consolidated' }
	]
];

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '7', label: '7 days' },
	{ value: '14', label: '2 weeks' },
	{ value: '31', label: '1 month' },
	{ value: '92', label: '3 months (default)' },
	{ value: '183', label: '6 months' }
];

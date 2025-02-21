export const defaultParameters = {
	daily: [],
	location_mode: 'location_search',
	csv_coordinates: '',
	timeformat: 'iso8601',
	past_days: '0',
	forecast_days: '92',
	start_date: '',
	end_date: '',
	time_mode: 'forecast_days',
	models: [],
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

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
		{ name: 'river_discharge', label: 'River Discharge' },
		{ name: 'river_discharge_mean', label: 'River Discharge Mean' },
		{ name: 'river_discharge_median', label: 'River Discharge Median' },
		{ name: 'river_discharge_max', label: 'River Discharge Maximum' },
		{ name: 'river_discharge_min', label: 'River Discharge Minimum' },
		{ name: 'river_discharge_p25', label: 'River Discharge 25<sup>th</sup> Percentile' },
		{ name: 'river_discharge_p75', label: 'River Discharge 75<sup>th</sup> Percentile' }
	]
];

export const models = [
	[
		{ name: 'seamless_v4', label: 'GloFAS v4 Seamless' },
		{ name: 'forecast_v4', label: 'GloFAS v4 Forecast' },
		{ name: 'consolidated_v4', label: 'GloFAS v4 Consolidated' }
	],
	[
		{ name: 'seamless_v3', label: 'GloFAS v3 Seamless' },
		{ name: 'forecast_v3', label: 'GloFAS v3 Forecast' },
		{ name: 'consolidated_v3', label: 'GloFAS v3 Consolidated' }
	]
];

export const INT_64_VARIABLES = ['sunrise', 'sunset', 'moonrise', 'moonset'];

// Days without a moonrise or moonset return Int64.max instead of a timestamp
export const NULLABLE_INT_64_VARIABLES = ['moonrise', 'moonset'];

export const MISSING_INT_64 = '9223372036854775807';

export const SECTIONS = [
	'current',
	'minutely_15',
	'hourly',
	'three_hourly',
	'six_hourly',
	'daily',
	'weekly',
	'monthly'
];

// The variable group is lazy: a greedy match would swallow depth ranges,
// parsing `soil_moisture_0_to_7cm` as variable `soil_moisture_0_to` + depth `7cm`.
export const VARIABLE_REGEX =
	/(?<variable>[a-z_0-9]+?)_(((?<altitude>[0-9]+)m)|((?<pressure>[0-9]+)hPa)|((?<depth_from>[0-9]+)_to_(?<depth_to>[0-9]+)cm)|((?<depth>[0-9]+)cm))_?(?<aggregation>max|min|mean|p[0-9]{2}|dominant|anomaly)?/;

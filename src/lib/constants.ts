export const INT_64_VARIABLES = ['sunrise', 'sunset'];

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

export const VARIABLE_REGEX =
	/(?<variable>[a-z_0-9]+)_(((?<altitude>[0-9]+)m)|((?<pressure>[0-9]+)hPa)|((?<depth>[0-9]+)cm)|((?<depth_from>[0-9]+)_to_(?<depth_to>[0-9]+)cm))_?(?<aggregation>max|min|mean|p[0-9]{2}|dominant|anomaly)?/;

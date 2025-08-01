export interface Parameters {
	[index: string];

	latitude?: Array<number>;
	longitude?: Array<number>;

	daily?: Array<string>;
	hourly?: Array<string>;
	models?: Array<string>;
	current?: Array<string>;
	six_hourly?: Array<string>;
	minutely_15?: Array<string>;

	timezone?: string;
	location_mode?: 'location_search' | 'csv_coordinates' | 'bounding_box';
	csv_coordinates?: string;
	bounding_box?: string;

	time_mode?: string;
	past_days?: string;
	forecast_days?: string;

	end_date?: string;
	start_date?: string;

	past_hours?: string;
	forecast_hours?: string;
	cell_selection?: string;
	past_minutely_15?: string;
	temporal_resolution?: string;
	forecast_minutely_15?: string;

	tilt?: string;
	azimuth?: string;

	timeformat?: string;
	length_unit?: string;
	wind_speed_unit?: string;
	temperature_unit?: string;
	precipitation_unit?: string;

	name?: string;
	count?: string;
	format?: string;
	language?: string;

	countryCode?: string;
}

export interface APIKeyPreferences {
	use: string;
	apikey: string;
	self_host_server: string;
}

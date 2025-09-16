export type LocationMode = 'location_search' | 'csv_coordinates' | 'bounding_box';

export interface Parameters {
	[index: string];

	latitude?: number[];
	longitude?: number[];

	daily?: string[];
	hourly?: string[];
	models?: string[];
	current?: string[];
	six_hourly?: string[];
	minutely_15?: string[];

	timezone?: string;
	location_mode?: LocationMode;
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

export interface CheckboxOption {
	value: string;
	label: string;
}

export interface CheckboxOptions extends Array<Array<CheckboxOption>> {}

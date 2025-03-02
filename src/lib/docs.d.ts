export interface Parameters {
	latitude?: Array<number>;
	longitude?: Array<number>;

	daily?: Array<string>;
	hourly?: Array<string>;
	models?: Array<string>;
	current?: Array<string>;
	minutely_15?: Array<string>;

	timezone?: string;
	location_mode?: string;
	csv_coordinates?: string;

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
	wind_speed_unit?: string;
	temperature_unit?: string;
	precipitation_unit?: string;
}

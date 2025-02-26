export interface Parameters {
	latitude?: Array<number>;
	longitude?: Array<number>;

	current?: Array<string>;
	minutely_15?: Array<string>;
	hourly?: Array<string>;
	daily?: Array<string>;
	location_mode?: string;
	csv_coordinates?: string;
	temperature_unit?: string;
	wind_speed_unit?: string;
	precipitation_unit?: string;
	timeformat?: string;
	timezone?: string;
	past_days?: number;
	past_hours?: string;
	past_minutely_15?: string;
	temporal_resolution?: string;
	forecast_days?: number;
	forecast_hours?: string;
	forecast_minutely_15?: string;
	start_date?: string;
	end_date?: string;
	tilt?: number;
	azimuth?: number;
	time_mode?: string;
	cell_selection?: string;
	models?: Array<string>;
}

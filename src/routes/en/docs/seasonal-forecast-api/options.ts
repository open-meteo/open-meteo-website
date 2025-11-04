export const defaultParameters = {
	daily: [],
	hourly: [],
	weekly: [],
	models: [],
	monthly: [],

	temporal_resolution: 'hourly_6',

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: '',

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: '183',

	start_date: '',
	end_date: '',

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
};

/*
EC46 only:
	case wind_u_component_100m
	case wind_v_component_100m
	case wind_u_component_200m
	case wind_v_component_200m
	case direct_radiation
	case temperature_2m_max
	case temperature_2m_min
	case soil_temperature_7_to_28cm
	case soil_temperature_28_to_100cm
	case soil_temperature_100_to_255cm
	case soil_moisture_0_to_7cm
	case soil_moisture_7_to_28cm
	case soil_moisture_28_to_100cm
	case soil_moisture_100_to_255cm
	case showers
	case wind_gusts_10m
	case sunshine_duration

	EC46 are marked below with an asterisk
*/

export const hourly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'temperature_2m_max', label: 'Temperature 6h Maximum (2 m) *' },
		{ value: 'temperature_2m_min', label: 'Temperature 6h Minimum (2 m) *' },
		{ value: 'dew_point_2m', label: 'Dew Point (2 m)' },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' },
		{ value: 'apparent_temperature', label: 'Apparent Temperature (2 m)' },
		{ value: 'et0_fao_evapotranspiration', label: 'Reference Evapotranspiration (ET₀)' },
		{ value: 'vapour_pressure_deficit', label: 'Vapour Pressure Deficit' }
	],
	[
		{ value: 'weather_code', label: 'Weather Code' },
		{ value: 'precipitation', label: 'Total Precipitation' },
		{ value: 'showers', label: 'Showers *' },
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'rain', label: 'Rain' },
		{ value: 'pressure_msl', label: 'Sea Level Pressure' },
		{ value: 'cloud_cover', label: 'Total Cloud Cover' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration *' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ value: 'wind_speed_200m', label: 'Wind Speed (200 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_100m', label: 'Wind Direction (100 m)' },
		{ value: 'wind_direction_200m', label: 'Wind Direction (200 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m) *' },
		{ value: 'sea_surface_temperature', label: 'Sea Surface Temperature' }
	],
	[
		{ value: 'soil_temperature_0_to_7cm', label: 'Soil Temperature (0-7 cm)' },
		{ value: 'soil_temperature_7_to_28cm', label: 'Soil Temperature (7-28 cm) *' },
		{ value: 'soil_temperature_28_to_100cm', label: 'Soil Temperature (28-100 cm) *' },
		{ value: 'soil_temperature_100_to_255cm', label: 'Soil Temperature (100-255 cm) *' },
		{ value: 'soil_moisture_0_to_7cm', label: 'Soil Moisture (0-7 cm) *' },
		{ value: 'soil_moisture_7_to_28cm', label: 'Soil Moisture (7-28 cm) *' },
		{ value: 'soil_moisture_28_to_100cm', label: 'Soil Moisture (28-100 cm) *' },
		{ value: 'soil_moisture_100_to_255cm', label: 'Soil Moisture (100-255 cm) *' }
	]
];

const minMaxMean = [
	{ value: '_min', label: 'Min' },
	{ value: '_mean', label: 'Mean' },
	{ value: '_max', label: 'Max' }
];
const sum = [{ value: '_sum', label: 'Sum' }];
const mean = [{ value: '_mean', label: 'Mean' }];
// const soilMean = [{ value: "_0_to_7cm_mean", label: "0-7 cm" }, { value: "_7_to_28cm_mean", label: "7-28 cm" }, { value: "_28_to_100cm_mean", label: "28-100 cm" }, { value: "_100_to_255cm_mean", label: "100-255 cm" }]
const aggregationDominant = [{ value: '_dominant', label: 'Dominant' }];
const sunriseSet = [
	{ value: 'sunrise', label: 'Sunrise' },
	{ value: 'sunset', label: 'Sunset' }
];

export const daily = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)', aggregations: minMaxMean },
		{ value: 'apparent_temperature', label: 'Apparent Temperature', aggregations: minMaxMean },
		{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)', aggregations: minMaxMean },
		{ value: 'dew_point_2m', label: 'Dew Point (2 m)', aggregations: minMaxMean },
		{ value: 'precipitation', label: 'Precipitation', aggregations: sum },
		{ value: 'rain', label: 'Rain Sum', aggregations: sum },
		{ value: 'showers', label: 'Showers *', aggregations: sum },
		{ value: 'snowfall', label: 'Snowfall', aggregations: sum },
		{ value: 'snowfall_water_equivalent', label: 'Snowfall Water Equivalent', aggregations: sum },
		{ value: 'pressure_msl', label: 'Sealevel Pressure', aggregations: minMaxMean },
		{ value: 'surface_pressure', label: 'Surface Pressure', aggregations: minMaxMean },
		{
			value: 'sea_surface_temperature',
			label: 'Sea Surface Temperature',
			aggregations: minMaxMean
		},
		{ value: 'cloud_cover', label: 'Cloud Cover', aggregations: minMaxMean },
		{
			value: 'et0_fao_evapotranspiration',
			label: 'Reference Evapotranspiration (ET₀)',
			aggregations: sum
		},
		{ value: 'shortwave_radiation', label: 'Shortwave Radiation', aggregations: sum },
		{ value: '', label: 'Sun', aggregations: sunriseSet },
		{
			value: '',
			label: 'Weather code',
			aggregations: [{ value: 'weather_code', label: 'Weather code' }]
		}
	],
	[
		{
			value: 'wet_bulb_temperature_2m',
			label: 'Wet Bulb Temperature (2 m)',
			aggregations: minMaxMean
		},
		{
			value: 'vapour_pressure_deficit_max',
			label: 'Vapour Pressure Deficit',
			aggregations: minMaxMean
		},
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)', aggregations: minMaxMean },
		{ value: 'wind_speed_100m', label: 'Wind Speed (100 m) *', aggregations: minMaxMean },
		{ value: 'wind_speed_200m', label: 'Wind Speed (200 m) *', aggregations: minMaxMean },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m) *', aggregations: minMaxMean },
		{
			value: 'wind_direction_10m',
			label: 'Wind Direction (10 m)',
			aggregations: aggregationDominant
		},
		{
			value: 'wind_direction_100m',
			label: 'Wind Direction (100 m) *',
			aggregations: aggregationDominant
		},
		{
			value: 'wind_direction_200m',
			label: 'Wind Direction (200 m) *',
			aggregations: aggregationDominant
		},
		{ value: 'soil_temperature_0_to_7cm', label: 'Soil Temperature (0-7 cm)', aggregations: mean },
		{
			value: 'soil_temperature_7_to_28cm',
			label: 'Soil Temperature (7-28 cm)',
			aggregations: mean
		},
		{
			value: 'soil_temperature_28_to_100cm',
			label: 'Soil Temperature (28-100 cm)',
			aggregations: mean
		},
		{
			value: 'soil_temperature_100_to_255cm',
			label: 'Soil Temperature (100-255 cm)',
			aggregations: mean
		},
		{ value: 'soil_moisture_0_to_7cm', label: 'Soil Moisture (0-7 cm)', aggregations: mean },
		{ value: 'soil_moisture_7_to_28cm', label: 'Soil Moisture (7-28 cm)', aggregations: mean },
		{ value: 'soil_moisture_28_to_100cm', label: 'Soil Moisture (28-100 cm)', aggregations: mean },
		{
			value: 'soil_moisture_100_to_255cm',
			label: 'Soil Moisture (100-255 cm)',
			aggregations: mean
		}
	]
];

export const solarVariables = [
	[
		{ value: 'shortwave_radiation', label: 'Shortwave Solar Radiation GHI' },
		{ value: 'direct_radiation', label: 'Direct Solar Radiation' },
		{ value: 'diffuse_radiation', label: 'Diffuse Solar Radiation DHI' },
		{ value: 'direct_normal_irradiance', label: 'Direct Normal Irradiance DNI' },
		{ value: 'global_tilted_irradiance', label: 'Global Tilted Radiation GTI' },
		{ value: 'terrestrial_radiation', label: 'Terrestrial Solar Radiation' }
	],
	[
		{ value: 'shortwave_radiation_instant', label: 'Shortwave Solar Radiation GHI (Instant)' },
		{ value: 'direct_radiation_instant', label: 'Direct Solar Radiation (Instant)' },
		{ value: 'diffuse_radiation_instant', label: 'Diffuse Solar Radiation DHI (Instant)' },
		{ value: 'direct_normal_irradiance_instant', label: 'Direct Normal Irradiance DNI (Instant)' },
		{ value: 'global_tilted_irradiance_instant', label: 'Global Tilted Radiation GTI (Instant)' },
		{ value: 'terrestrial_radiation_instant', label: 'Terrestrial Solar Radiation (Instant)' }
	]
];

export const weekly = [
	[
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'temperature_max6h_2m', label: 'Temperature (2 m) Max 6h' },
		{ value: 'temperature_min6h_2m', label: 'Temperature (2 m) Min 6h' },
		{ value: 'dew_point_2m', label: 'Dew Point (2 m)' },
		{ value: 'soil_temperature_0_to_7cm', label: 'Soil Temperature (0-7 cm)' },
		{ value: 'precipitation', label: 'Precipitation' },
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'snow_depth', label: 'Snow Depth' }
	],
	[
		{ value: 'pressure_msl', label: 'Pressure Mean Sea Level' },
		{ value: 'sea_surface_temperature', label: 'Sea Surface Temperature' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' },
		{ value: 'cloud_cover', label: 'Cloud Cover' },
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_speed_100m', label: 'Wind Speed (100 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' },
		{ value: 'wind_direction_100m', label: 'Wind Direction (100 m)' }
	]
];

export const additionalWeekly = [
	[
		{ value: 'snow_density', label: 'Snow Density' },
		{ value: 'snow_depth_water_equivalent', label: 'Snow Depth Water Equivalent' }
	],
	[
		{ value: 'snowfall_water_equivalent', label: 'Snowfall Water Equivalent' },
		{
			value: 'total_column_integrated_water_vapour',
			label: 'Total Column Integrated Water Vapour'
		}
	]
];

export const weeklySpecial = [
	[
		{ value: 'temperature_2m_efi', label: 'Temperature (2 m) Extreme Forecast Index' },
		{ value: 'temperature_2m_sot10', label: 'Temperature (2 m) Shift of Tails 10' },
		{ value: 'temperature_2m_sot90', label: 'Temperature (2 m) Shift of Tails 90' },
		{ value: 'temperature_2m_anomaly_gt0', label: 'Temperature (2 m) Anomaly Greater than 0K' },
		{ value: 'temperature_2m_anomaly_gt1', label: 'Temperature (2 m) Anomaly Greater than 1K' },
		{ value: 'temperature_2m_anomaly_gt2', label: 'Temperature (2 m) Anomaly Greater than 2K' },
		{
			value: 'temperature_2m_anomaly_ltm1',
			label: 'Temperature (2 m) Anomaly Lower than -1K'
		},
		{
			value: 'temperature_2m_anomaly_ltm2',
			label: 'Temperature (2 m) Anomaly Lower than -2K'
		}
	],
	[
		{ value: 'precipitation_efi', label: 'Precipitation Extreme Forecast Index' },
		{ value: 'precipitation_sot90', label: 'Precipitation Shift of Tails 90' },
		{ value: 'precipitation_anomaly_gt0', label: 'Precipitation Anomaly Greater than 0mm' },
		{ value: 'precipitation_anomaly_gt10', label: 'Precipitation Anomaly Greater than 10mm' },
		{ value: 'precipitation_anomaly_gt20', label: 'Precipitation Anomaly Greater than 20mm' },
		{ value: 'pressure_msl_anomaly_gt0', label: 'Pressure Mean Sea Level Greater than 0Pa' },
		{
			value: 'surface_temperature_anomaly_gt0',
			label: 'Surface Temperature Anomaly Greater than 0K'
		}
	]
];

export const monthly = [
	[
		{ value: 'temperature_2m', label: ' Temperature (2 m)' },
		{ value: 'temperature_max24h_2m', label: 'Temperature (2 m) Max 24h' },
		{ value: 'temperature_min24h_2m', label: 'Temperature (2 m) Min 24h' },
		{ value: 'dew_point_2m', label: 'Dew Point (2 m)' },
		{ value: 'precipitation', label: 'Precipitation' },
		{ value: 'showers', label: 'Showers' },
		{ value: 'snowfall', label: 'Snowfall' },
		{ value: 'snow_depth', label: 'Snow Depth' },
		{ value: 'cloud_cover', label: 'Cloud Cover' },
		{ value: 'cloud_cover_low', label: 'Cloud Cover Low' },
		{ value: 'sunshine_duration', label: 'Sunshine Duration' },
		{ value: 'shortwave_radiation', label: 'Shortwave Radiation' }
	],
	[
		{ value: 'pressure_msl', label: 'Sealevel Pressure' },
		{ value: 'sea_surface_temperature', label: 'Sea Surface Temperature' },
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_gusts_10m', label: 'Wind Gusts (10 m)' },
		{ value: 'soil_temperature_0_to_7cm', label: 'Soil Temperature (0-7 cm)' },
		{ value: 'soil_temperature_7_to_28cm', label: 'Soil Temperature (7-28 cm)' },
		{ value: 'soil_temperature_28_to_100cm', label: 'Soil Temperature (28-100 cm)' },
		{ value: 'soil_temperature_100_to_255cm', label: 'Soil Temperature (100-255 cm)' },
		{ value: 'soil_moisture_0_to_7cm', label: 'Soil Moisture (0-7 cm)' },
		{ value: 'soil_moisture_7_to_28cm', label: 'Soil Moisture (7-28 cm)' },
		{ value: 'soil_moisture_28_to_100cm', label: 'Soil Moisture (28-100 cm)' },
		{ value: 'soil_moisture_100_to_255cm', label: 'Soil Moisture (100-255 cm)' }
	]
];

export const additionalMonthly = [
	[
		{ value: 'runoff', label: 'Runoff' },
		{ value: 'evapotranspiration', label: 'Evapotranspiration' },
		{ value: 'snow_density', label: 'Snow Density' },
		{ value: 'snow_depth_water_equivalent', label: 'Snow Depth (Water Equivalent)' },
		{
			value: 'total_column_integrated_water_vapour',
			label: 'Total Column Integrated Water Vapour'
		},
		{ value: 'sea_ice_cover', label: 'Sea Ice Cover' }
	],
	[
		{ value: 'longwave_radiation', label: 'Longwave Radiation' },
		{ value: 'snowfall_water_equivalent', label: 'Snowfall Water Equivalent' },
		{ value: 'albedo', label: 'Albedo' },
		{ value: 'latent_heat_flux', label: 'Latent Heat Flux' },
		{ value: 'sensible_heat_flux', label: 'Sensible Heat Flux' }
	]
];

export const models = [
	[
		{ value: 'ecmwf_seasonal_seamless', label: 'ECMWF Seasonal Seamless (EC46 + SEAS5)' },
		{ value: 'ecmwf_seas5', label: 'ECMWF SEAS5' },
		{ value: 'ecmwf_ec46', label: 'ECMWF EC46' }
	]
];

export const temporalResolutionOptions = [
	{ value: '', label: '1 Hourly' },
	{ value: 'hourly_3', label: '3 Hourly' },
	{ value: 'hourly_6', label: '6 Hourly (default)' },
	{ value: 'hourly_12', label: '12 Hourly' },
	{ value: 'native', label: 'Native Model Resolution' }
];

export const forecastDaysOptions = [
	{ value: '7', label: '7 days' },
	{ value: '45', label: '45 days' },
	{ value: '92', label: '3 months' },
	{ value: '183', label: '6 months (default)' },
	{ value: '214', label: '7 months' }
];

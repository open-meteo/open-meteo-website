import { dev } from '$app/environment';

export const defaultParameters = {
	location_mode: 'location_search',
	csv_coordinates: '',
	temperature_unit: 'celsius',
	wind_speed_unit: 'kmh',
	precipitation_unit: 'mm',
	timeformat: 'iso8601',
	timezone: 'UTC',
	disable_bias_correction: false
};

export const daily = [
	[
		{ name: 'temperature_2m_mean', label: 'Mean Temperature (2 m)' },
		{ name: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ name: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ name: 'wind_speed_10m_mean', label: 'Mean Wind Speed (10 m)' },
		{ name: 'wind_speed_10m_max', label: 'Max Wind Speed (10 m)' },
		{ name: 'cloud_cover_mean', label: 'Mean Cloud Cover' },
		{ name: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' }
	],
	[
		{ name: 'relative_humidity_2m_mean', label: 'Mean Relative Humidity (2 m)' },
		{ name: 'relative_humidity_2m_max', label: 'Maximum Relative Humidity (2 m)' },
		{ name: 'relative_humidity_2m_min', label: 'Minimum Relative Humidity (2 m)' },
		{ name: 'dew_point_2m_mean', label: 'Mean Dewpoint (2 m)' },
		{ name: 'dew_point_2m_min', label: 'Minimum Dewpoint (2 m)' },
		{ name: 'dew_point_2m_max', label: 'Maximum Dewpoint (2 m)' }
	],
	[
		{ name: 'precipitation_sum', label: 'Precipitation Sum' },
		{ name: 'rain_sum', label: 'Rain Sum' },
		{ name: 'snowfall_sum', label: 'Snowfall Sum' },
		{ name: 'pressure_msl_mean', label: 'Sealevel Pressure' },
		{ name: 'soil_moisture_0_to_10cm_mean', label: 'Mean Soil Moisture (0-10 cm)' },
		{ name: 'et0_fao_evapotranspiration_sum', label: 'Reference Evapotranspiration (ET₀)' }
	]
];

if (dev) {
	daily.push([
		{ name: 'vapour_pressure_deficit_max', label: 'Vapour Pressure Deficit' },
		{ name: 'soil_moisture_0_to_100cm_mean', label: 'Mean Soil Moisture (0-100 cm)' },
		{ name: 'soil_moisture_7_to_28cm_mean', label: 'Mean Soil Moisture (7-28 cm)' },
		{ name: 'soil_moisture_28_to_100cm_mean', label: 'Mean Soil Moisture (28-100 cm)' },
		{ name: 'soil_moisture_index_0_to_100cm_mean', label: 'Mean Soil Moisture Index (0-100 cm)' },
		{ name: 'soil_moisture_index_0_to_10cm_mean', label: 'Mean Soil Moisture Index (0-10 cm)' },
		{ name: 'soil_moisture_index_7_to_28cm_mean', label: 'Mean Soil Moisture Index (7-28 cm)' },
		{
			name: 'soil_moisture_index_28_to_100cm_mean',
			label: 'Mean Soil Moisture Index (28-100 cm)'
		},
		{ name: 'soil_temperature_0_to_100cm_mean', label: 'Mean Soil Temperature (0-100 cm)' },
		{ name: 'soil_temperature_7_to_28cm_mean', label: 'Mean Soil Temperature (7-28 cm)' },
		{ name: 'soil_temperature_28_to_100cm_mean', label: 'Mean Soil Temperature (28-100 cm)' },
		{ name: 'growing_degree_days_base_0_limit_50', label: 'GDD 0-50°C' },
		{ name: 'daylight_duration', label: 'Daylight Duration' }
	]);
}

export const models = [
	[
		{ name: 'CMCC_CM2_VHR4', label: 'CMCC_CM2_VHR4', caption: '30 km' },
		{ name: 'FGOALS_f3_H', label: 'FGOALS_f3_H', caption: '28 km' },
		{ name: 'HiRAM_SIT_HR', label: 'HiRAM_SIT_HR', caption: '25 km' },
		{ name: 'MRI_AGCM3_2_S', label: 'MRI_AGCM3_2_S', caption: '20 km' },
		{ name: 'EC_Earth3P_HR', label: 'EC_Earth3P_HR', caption: '29 km' },
		{ name: 'MPI_ESM1_2_XR', label: 'MPI_ESM1_2_XR', caption: '51 km' },
		{ name: 'NICAM16_8S', label: 'NICAM16_8S', caption: '31 km' }
	]
];

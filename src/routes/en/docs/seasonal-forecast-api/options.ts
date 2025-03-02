export const defaultParameters = {
	daily: [],
	six_hourly: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: '',

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: 92,

	start_date: '',
	end_date: '',

	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
};

export const six_hourly = [
	[
		{ value: 'pressure_msl', label: 'Sealevel Pressure' },
		{ value: 'temperature_2m', label: 'Temperature (2 m)' },
		{ value: 'temperature_2m_max', label: 'Temperature (2 m) 6h max' },
		{ value: 'temperature_2m_min', label: 'Temperature (2 m) 6h min' },
		{ value: 'shortwave_radiation', label: 'Shortwave Solar Radiation' },
		{ value: 'cloud_cover', label: 'Total Cloud Cover' },
		{ value: 'precipitation', label: 'Total Precipitation' },
		{ value: 'showers', label: 'Showers' }
	],
	[
		{ value: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ value: 'wind_direction_10m', label: 'Wind Direction (10 m)' }
	],
	[{ value: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' }],
	[
		{ value: 'soil_temperature_0_to_10cm', label: 'Soil Temperature (0-10 cm)' },
		{ value: 'soil_moisture_0_to_10cm', label: 'Soil Moisture (0-10 cm)' },
		{ value: 'soil_moisture_10_to_40cm', label: 'Soil Moisture (10-40 cm)' },
		{ value: 'soil_moisture_40_to_100cm', label: 'Soil Moisture (40-100 cm)' },
		{ value: 'soil_moisture_100_to_200cm', label: 'Soil Moisture (100-200 cm)' }
	]
];

export const daily = [
	[
		{ value: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ value: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ value: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' }
	],
	[
		{ value: 'precipitation_sum', label: 'Precipitation Sum' },
		{ value: 'rain_sum', label: 'Rain Sum' },
		{ value: 'precipitation_hours', label: 'Precipitation Hours' },
		{ value: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
		{ value: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' }
	]
];

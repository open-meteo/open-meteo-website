export const defaultParameters = {
	six_hourly: [],
	daily: [],
	location_mode: 'location_search',
	csv_coordinates: '',
	temperature_unit: 'celsius',
	wind_speed_unit: 'kmh',
	precipitation_unit: 'mm',
	timeformat: 'iso8601',
	timezone: 'UTC',
	past_days: '0',
	forecast_days: '92',
	start_date: '',
	end_date: '',
	time_mode: 'forecast_days'
	//models: []
};

export const six_hourly = [
	[
		{ name: 'pressure_msl', label: 'Sealevel Pressure' },
		{ name: 'temperature_2m', label: 'Temperature (2 m)' },
		{ name: 'temperature_2m_max', label: 'Temperature (2 m) 6h max' },
		{ name: 'temperature_2m_min', label: 'Temperature (2 m) 6h min' },
		{ name: 'shortwave_radiation', label: 'Shortwave Solar Radiation' },
		{ name: 'cloud_cover', label: 'Total Cloud Cover' },
		{ name: 'precipitation', label: 'Total Precipitation' },
		{ name: 'showers', label: 'Showers' }
	],
	[
		{ name: 'wind_speed_10m', label: 'Wind Speed (10 m)' },
		{ name: 'wind_direction_10m', label: 'Wind Direction (10 m)' }
	],
	[{ name: 'relative_humidity_2m', label: 'Relative Humidity (2 m)' }],
	[
		{ name: 'soil_temperature_0_to_10cm', label: 'Soil Temperature (0-10 cm)' },
		{ name: 'soil_moisture_0_to_10cm', label: 'Soil Moisture (0-10 cm)' },
		{ name: 'soil_moisture_10_to_40cm', label: 'Soil Moisture (10-40 cm)' },
		{ name: 'soil_moisture_40_to_100cm', label: 'Soil Moisture (40-100 cm)' },
		{ name: 'soil_moisture_100_to_200cm', label: 'Soil Moisture (100-200 cm)' }
	]
];

export const daily = [
	[
		{ name: 'temperature_2m_max', label: 'Maximum Temperature (2 m)' },
		{ name: 'temperature_2m_min', label: 'Minimum Temperature (2 m)' },
		{ name: 'shortwave_radiation_sum', label: 'Shortwave Radiation Sum' }
	],
	[
		{ name: 'precipitation_sum', label: 'Precipitation Sum' },
		{ name: 'rain_sum', label: 'Rain Sum' },
		{ name: 'precipitation_hours', label: 'Precipitation Hours' },
		{ name: 'wind_speed_10m_max', label: 'Maximum Wind Speed (10 m)' },
		{ name: 'wind_direction_10m_dominant', label: 'Dominant Wind Direction (10 m)' }
	]
];

export const defaultParameters = {
	current: [],
	hourly: [],
	location_mode: 'location_search',
	csv_coordinates: '',
	timeformat: 'iso8601',
	timezone: 'UTC',
	past_days: '0',
	past_hours: '',
	forecast_days: '5',
	forecast_hours: '',
	temporal_resolution: '',
	start_date: '',
	end_date: '',
	time_mode: 'forecast_days',
	domains: 'auto',
	cell_selection: ''
};

export const hourly = [
	[
		{ name: 'pm10', label: 'Particulate Matter PM<sub>10</sub>' },
		{ name: 'pm2_5', label: 'Particulate Matter PM<sub>2.5</sub>' },
		{ name: 'carbon_monoxide', label: 'Carbon Monoxide CO' },
		{ name: 'carbon_dioxide', label: 'Carbon Dioxide CO<sub>2</sub>' },
		{ name: 'nitrogen_dioxide', label: 'Nitrogen Dioxide NO<sub>2</sub>' },
		{ name: 'sulphur_dioxide', label: 'Sulphur Dioxide SO<sub>2</sub>' },
		{ name: 'ozone', label: 'Ozone O<sub>3</sub>' }
	],
	[
		{ name: 'aerosol_optical_depth', label: 'Aerosol Optical Depth' },
		{ name: 'dust', label: 'Dust' },
		{ name: 'uv_index', label: 'UV Index' },
		{ name: 'uv_index_clear_sky', label: 'UV Index Clear Sky' },
		{ name: 'ammonia', label: 'Ammonia NH<sub>3</sub> <small class="text-muted">(*)</small>' },
		{ name: 'methane', label: 'Methane CH<sub>4</sub>' }
	],
	[
		{ name: 'alder_pollen', label: 'Alder Pollen <small class="text-muted">(*)</small>' },
		{ name: 'birch_pollen', label: 'Birch Pollen <small class="text-muted">(*)</small>' },
		{ name: 'grass_pollen', label: 'Grass Pollen <small class="text-muted">(*)</small>' },
		{ name: 'mugwort_pollen', label: 'Mugwort Pollen <small class="text-muted">(*)</small>' },
		{ name: 'olive_pollen', label: 'Olive Pollen <small class="text-muted">(*)</small>' },
		{ name: 'ragweed_pollen', label: 'Ragweed Pollen <small class="text-muted">(*)</small>' }
	]
];

export const current = [
	[
		{ name: 'european_aqi', label: 'European AQI' },
		{ name: 'us_aqi', label: 'United States AQI' },
		{ name: 'pm10', label: 'Particulate Matter PM<sub>10</sub>' },
		{ name: 'pm2_5', label: 'Particulate Matter PM<sub>2.5</sub>' },
		{ name: 'carbon_monoxide', label: 'Carbon Monoxide CO' },
		{ name: 'nitrogen_dioxide', label: 'Nitrogen Dioxide NO<sub>2</sub>' },
		{ name: 'sulphur_dioxide', label: 'Sulphur Dioxide SO<sub>2</sub>' },
		{ name: 'ozone', label: 'Ozone O<sub>3</sub>' }
	],
	[
		{ name: 'aerosol_optical_depth', label: 'Aerosol Optical Depth' },
		{ name: 'dust', label: 'Dust' },
		{ name: 'uv_index', label: 'UV Index' },
		{ name: 'uv_index_clear_sky', label: 'UV Index Clear Sky' },
		{ name: 'ammonia', label: 'Ammonia NH<sub>3</sub> <small class="text-muted">(*)</small>' }
	],
	[
		{ name: 'alder_pollen', label: 'Alder Pollen <small class="text-muted">(*)</small>' },
		{ name: 'birch_pollen', label: 'Birch Pollen <small class="text-muted">(*)</small>' },
		{ name: 'grass_pollen', label: 'Grass Pollen <small class="text-muted">(*)</small>' },
		{ name: 'mugwort_pollen', label: 'Mugwort Pollen <small class="text-muted">(*)</small>' },
		{ name: 'olive_pollen', label: 'Olive Pollen <small class="text-muted">(*)</small>' },
		{ name: 'ragweed_pollen', label: 'Ragweed Pollen <small class="text-muted">(*)</small>' }
	]
];

export const aqi_european = [
	[
		{ name: 'european_aqi', label: 'European AQI' },
		{ name: 'european_aqi_pm2_5', label: 'European AQI PM<sub>2.5</sub>' },
		{ name: 'european_aqi_pm10', label: 'European AQI PM<sub>10</sub>' },
		{ name: 'european_aqi_nitrogen_dioxide', label: 'European AQI NO<sub>2</sub>' },
		{ name: 'european_aqi_ozone', label: 'European AQI O<sub>3</sub>' },
		{ name: 'european_aqi_sulphur_dioxide', label: 'European AQI SO<sub>2</sub>' }
	]
];

export const aqi_united_states = [
	[
		{ name: 'us_aqi', label: 'United States AQI' },
		{ name: 'us_aqi_pm2_5', label: 'United States AQI PM<sub>2.5</sub>' },
		{ name: 'us_aqi_pm10', label: 'United States AQI PM<sub>10</sub>' },
		{ name: 'us_aqi_nitrogen_dioxide', label: 'United States AQI NO<sub>2</sub>' },
		{ name: 'us_aqi_carbon_monoxide', label: 'United States AQI CO' },
		{ name: 'us_aqi_ozone', label: 'United States AQI O<sub>3</sub>' },
		{ name: 'us_aqi_sulphur_dioxide', label: 'United States AQI SO<sub>2</sub>' }
	]
];

export const additionalVariables = [
	[
		{ name: 'formaldehyde', label: 'Formaldehyde CH₂O' },
		{ name: 'glyoxal', label: 'Glyoxal C₂H₂O₂' },
		{
			name: 'non_methane_volatile_organic_compounds',
			label: 'Non Methane Volatile Organic Compounds <small class="text-muted">(*)</small>'
		},
		{
			name: 'pm10_wildfires',
			label: 'PM<sub>10</sub> caused by wildfires <small class="text-muted">(*)</small>'
		},
		{ name: 'peroxyacyl_nitrates', label: 'Peroxyacyl Nitrates PAN' },
		{
			name: 'secondary_inorganic_aerosol',
			label: 'Secondary Inorganic Aerosol <small class="text-muted">(*)</small>'
		}
	],
	[
		{
			name: 'residential_elementary_carbon',
			label: 'Residential Rlementary Carbon <small class="text-muted">(*)</small>'
		},
		{
			name: 'total_elementary_carbon',
			label: 'Total Elementary Carbon <small class="text-muted">(*)</small>'
		},
		{
			name: 'pm2_5_total_organic_matter',
			label: 'PM<sub>2.5</sub> Total Organic Matter <small class="text-muted">(*)</small>'
		},
		{ name: 'sea_salt_aerosol', label: 'Sea Salt Aerosol' },
		{ name: 'nitrogen_monoxide', label: 'Nitrogen Monoxide NO' }
	]
];

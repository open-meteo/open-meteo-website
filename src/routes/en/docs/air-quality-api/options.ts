export const defaultParameters = {
	hourly: [],
	current: [],

	timezone: 'UTC',
	location_mode: 'location_search',
	csv_coordinates: undefined,

	time_mode: 'forecast_days',
	past_days: '0',
	forecast_days: '5',

	end_date: undefined,
	start_date: undefined,

	domains: 'auto',

	timeformat: 'iso8601',
	past_hours: undefined,
	cell_selection: undefined,
	forecast_hours: undefined,
	temporal_resolution: undefined
};

export const hourly = [
	[
		{ value: 'pm10', label: 'Particulate Matter PM<sub>10</sub>' },
		{ value: 'pm2_5', label: 'Particulate Matter PM<sub>2.5</sub>' },
		{ value: 'carbon_monoxide', label: 'Carbon Monoxide CO' },
		{ value: 'carbon_dioxide', label: 'Carbon Dioxide CO<sub>2</sub>' },
		{ value: 'nitrogen_dioxide', label: 'Nitrogen Dioxide NO<sub>2</sub>' },
		{ value: 'sulphur_dioxide', label: 'Sulphur Dioxide SO<sub>2</sub>' },
		{ value: 'ozone', label: 'Ozone O<sub>3</sub>' }
	],
	[
		{ value: 'aerosol_optical_depth', label: 'Aerosol Optical Depth' },
		{ value: 'dust', label: 'Dust' },
		{ value: 'uv_index', label: 'UV Index' },
		{ value: 'uv_index_clear_sky', label: 'UV Index Clear Sky' },
		{
			value: 'ammonia',
			label: 'Ammonia NH<sub>3</sub> <small class="text-muted-foreground">(*)</small>'
		},
		{ value: 'methane', label: 'Methane CH<sub>4</sub>' }
	],
	[
		{
			value: 'alder_pollen',
			label: 'Alder Pollen <small class="text-muted-foreground">(*)</small>'
		},
		{
			value: 'birch_pollen',
			label: 'Birch Pollen <small class="text-muted-foreground">(*)</small>'
		},
		{
			value: 'grass_pollen',
			label: 'Grass Pollen <small class="text-muted-foreground">(*)</small>'
		},
		{
			value: 'mugwort_pollen',
			label: 'Mugwort Pollen <small class="text-muted-foreground">(*)</small>'
		},
		{
			value: 'olive_pollen',
			label: 'Olive Pollen <small class="text-muted-foreground">(*)</small>'
		},
		{
			value: 'ragweed_pollen',
			label: 'Ragweed Pollen <small class="text-muted-foreground">(*)</small>'
		}
	]
];

export const current = [
	[
		{ value: 'european_aqi', label: 'European AQI' },
		{ value: 'us_aqi', label: 'United States AQI' },
		{ value: 'pm10', label: 'Particulate Matter PM<sub>10</sub>' },
		{ value: 'pm2_5', label: 'Particulate Matter PM<sub>2.5</sub>' },
		{ value: 'carbon_monoxide', label: 'Carbon Monoxide CO' },
		{ value: 'nitrogen_dioxide', label: 'Nitrogen Dioxide NO<sub>2</sub>' },
		{ value: 'sulphur_dioxide', label: 'Sulphur Dioxide SO<sub>2</sub>' },
		{ value: 'ozone', label: 'Ozone O<sub>3</sub>' }
	],
	[
		{ value: 'aerosol_optical_depth', label: 'Aerosol Optical Depth' },
		{ value: 'dust', label: 'Dust' },
		{ value: 'uv_index', label: 'UV Index' },
		{ value: 'uv_index_clear_sky', label: 'UV Index Clear Sky' },
		{
			value: 'ammonia',
			label: 'Ammonia NH<sub>3</sub> <small class="text-muted-foreground">(*)</small>'
		}
	],
	[
		{
			value: 'alder_pollen',
			label: 'Alder Pollen <small class="text-muted-foreground">(*)</small>'
		},
		{
			value: 'birch_pollen',
			label: 'Birch Pollen <small class="text-muted-foreground">(*)</small>'
		},
		{
			value: 'grass_pollen',
			label: 'Grass Pollen <small class="text-muted-foreground">(*)</small>'
		},
		{
			value: 'mugwort_pollen',
			label: 'Mugwort Pollen <small class="text-muted-foreground">(*)</small>'
		},
		{
			value: 'olive_pollen',
			label: 'Olive Pollen <small class="text-muted-foreground">(*)</small>'
		},
		{
			value: 'ragweed_pollen',
			label: 'Ragweed Pollen <small class="text-muted-foreground">(*)</small>'
		}
	]
];

export const aqi_european = [
	[
		{ value: 'european_aqi', label: 'European AQI' },
		{ value: 'european_aqi_pm2_5', label: 'European AQI PM<sub>2.5</sub>' },
		{ value: 'european_aqi_pm10', label: 'European AQI PM<sub>10</sub>' },
		{ value: 'european_aqi_nitrogen_dioxide', label: 'European AQI NO<sub>2</sub>' },
		{ value: 'european_aqi_ozone', label: 'European AQI O<sub>3</sub>' },
		{ value: 'european_aqi_sulphur_dioxide', label: 'European AQI SO<sub>2</sub>' }
	]
];

export const aqi_united_states = [
	[
		{ value: 'us_aqi', label: 'United States AQI' },
		{ value: 'us_aqi_pm2_5', label: 'United States AQI PM<sub>2.5</sub>' },
		{ value: 'us_aqi_pm10', label: 'United States AQI PM<sub>10</sub>' },
		{ value: 'us_aqi_nitrogen_dioxide', label: 'United States AQI NO<sub>2</sub>' },
		{ value: 'us_aqi_carbon_monoxide', label: 'United States AQI CO' },
		{ value: 'us_aqi_ozone', label: 'United States AQI O<sub>3</sub>' },
		{ value: 'us_aqi_sulphur_dioxide', label: 'United States AQI SO<sub>2</sub>' }
	]
];

export const additionalVariables = [
	[
		{ value: 'formaldehyde', label: 'Formaldehyde CH₂O' },
		{ value: 'glyoxal', label: 'Glyoxal C₂H₂O₂' },
		{
			value: 'non_methane_volatile_organic_compounds',
			label:
				'Non Methane Volatile Organic Compounds <small class="text-muted-foreground">(*)</small>'
		},
		{
			value: 'pm10_wildfires',
			label: 'PM<sub>10</sub> caused by wildfires <small class="text-muted-foreground">(*)</small>'
		},
		{ value: 'peroxyacyl_nitrates', label: 'Peroxyacyl Nitrates PAN' },
		{
			value: 'secondary_inorganic_aerosol',
			label: 'Secondary Inorganic Aerosol <small class="text-muted-foreground">(*)</small>'
		}
	],
	[
		{
			value: 'residential_elementary_carbon',
			label: 'Residential Elementary Carbon <small class="text-muted-foreground">(*)</small>'
		},
		{
			value: 'total_elementary_carbon',
			label: 'Total Elementary Carbon <small class="text-muted-foreground">(*)</small>'
		},
		{
			value: 'pm2_5_total_organic_matter',
			label:
				'PM<sub>2.5</sub> Total Organic Matter <small class="text-muted-foreground">(*)</small>'
		},
		{ value: 'sea_salt_aerosol', label: 'Sea Salt Aerosol' },
		{ value: 'nitrogen_monoxide', label: 'Nitrogen Monoxide NO' }
	]
];

export const forecastDaysOptions = [
	{ value: '1', label: '1 day' },
	{ value: '3', label: '3 days' },
	{ value: '5', label: '5 days (default)' },
	{ value: '7', label: '7 days' }
];

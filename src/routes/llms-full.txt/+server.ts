import type { RequestHandler } from './$types';

export const prerender = true;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const SITE = 'https://open-meteo.com';

const COMMON_GEO_PARAMS = `
| Parameter | Type | Required | Description |
|---|---|---|---|
| \`latitude\` | float | Yes | WGS84 latitude of the location. Multiple values comma-separated, e.g. \`52.52,48.85\`. |
| \`longitude\` | float | Yes | WGS84 longitude of the location. Multiple values comma-separated, e.g. \`13.41,2.35\`. |
| \`elevation\` | float | No | Manually set elevation (metres) for statistical downscaling. Use \`nan\` to disable. |
`.trim();

const COMMON_TIME_PARAMS = `
| Parameter | Type | Default | Description |
|---|---|---|---|
| \`forecast_days\` | int | 7 | Number of forecast days (1–16). |
| \`past_days\` | int | 0 | Also return this many previous days (0–92). |
| \`start_date\` / \`end_date\` | string (yyyy-mm-dd) | — | Fixed date range; overrides \`forecast_days\`/\`past_days\`. |
| \`past_hours\` / \`forecast_hours\` | int | — | Limit hourly output to N hours before/after now. |
`.trim();

const COMMON_FORMAT_PARAMS = `
| Parameter | Type | Default | Description |
|---|---|---|---|
| \`timezone\` | string | \`"GMT"\` | IANA timezone, e.g. \`"Europe/Berlin"\`. Use \`"auto"\` for the local timezone of the location. Required when \`daily\` is used. |
| \`temperature_unit\` | \`celsius\` \| \`fahrenheit\` | \`celsius\` | — |
| \`wind_speed_unit\` | \`kmh\` \| \`ms\` \| \`mph\` \| \`kn\` | \`kmh\` | — |
| \`precipitation_unit\` | \`mm\` \| \`inch\` | \`mm\` | — |
| \`timeformat\` | \`iso8601\` \| \`unixtime\` | \`iso8601\` | — |
| \`format\` | \`json\` \| \`csv\` \| \`xlsx\` \| \`flatbuffers\` | \`json\` | — |
| \`cell_selection\` | \`land\` \| \`sea\` \| \`nearest\` | \`land\` | Grid-cell selection strategy. |
`.trim();

const COMMON_JSON_ENVELOPE = `
\`\`\`json
{
  "latitude": 52.52,
  "longitude": 13.41,
  "generationtime_ms": 0.12,
  "utc_offset_seconds": 0,
  "timezone": "GMT",
  "timezone_abbreviation": "GMT",
  "elevation": 38.0,
  "hourly_units": { "time": "iso8601", "temperature_2m": "°C" },
  "hourly": { "time": ["2024-01-01T00:00", "..."], "temperature_2m": [5.2, "..."] },
  "daily_units": { "time": "iso8601", "temperature_2m_max": "°C" },
  "daily": { "time": ["2024-01-01", "..."], "temperature_2m_max": [8.3, "..."] },
  "current_units": { "time": "iso8601", "temperature_2m": "°C" },
  "current": { "time": "2024-01-01T12:00", "interval": 900, "temperature_2m": 6.1 }
}
\`\`\`
`.trim();

// ---------------------------------------------------------------------------
// API sections
// ---------------------------------------------------------------------------

const FORECAST = `
## Weather Forecast API

**Endpoint:** \`GET https://api.open-meteo.com/v1/forecast\`

7–16 day global weather forecast that automatically combines the best-available NWP models for any location on Earth. Supports hourly, daily, current, and 15-minutely resolutions. All data is updated multiple times per day.

### Required Parameters

${COMMON_GEO_PARAMS}

### Time Parameters

${COMMON_TIME_PARAMS}

### Formatting Parameters

${COMMON_FORMAT_PARAMS}

### Variable Selection Parameters

| Parameter | Description |
|---|---|
| \`hourly\` | Comma-separated list of hourly variables to return. |
| \`daily\` | Comma-separated list of daily aggregation variables. Requires \`timezone\`. |
| \`current\` | Comma-separated list of current-conditions variables (15-minute granularity). |
| \`minutely_15\` | Comma-separated list of 15-minutely variables. |
| \`models\` | Override the automatic model selection. See model list below. |

### Hourly Variables (\`&hourly=\`)

\`temperature_2m\`, \`relative_humidity_2m\`, \`dew_point_2m\`, \`apparent_temperature\`,
\`precipitation_probability\`, \`precipitation\`, \`rain\`, \`showers\`, \`snowfall\`, \`snow_depth\`,
\`weather_code\`, \`pressure_msl\`, \`surface_pressure\`,
\`cloud_cover\`, \`cloud_cover_low\`, \`cloud_cover_mid\`, \`cloud_cover_high\`,
\`visibility\`, \`evapotranspiration\`, \`et0_fao_evapotranspiration\`, \`vapour_pressure_deficit\`,
\`wind_speed_10m\`, \`wind_speed_80m\`, \`wind_speed_120m\`, \`wind_speed_180m\`,
\`wind_direction_10m\`, \`wind_direction_80m\`, \`wind_direction_120m\`, \`wind_direction_180m\`,
\`wind_gusts_10m\`,
\`temperature_80m\`, \`temperature_120m\`, \`temperature_180m\`,
\`soil_temperature_0cm\`, \`soil_temperature_6cm\`, \`soil_temperature_18cm\`, \`soil_temperature_54cm\`,
\`soil_moisture_0_to_1cm\`, \`soil_moisture_1_to_3cm\`, \`soil_moisture_3_to_9cm\`,
\`soil_moisture_9_to_27cm\`, \`soil_moisture_27_to_81cm\`,
\`shortwave_radiation\`, \`direct_radiation\`, \`diffuse_radiation\`,
\`direct_normal_irradiance\`, \`global_tilted_irradiance\`,
\`shortwave_radiation_instant\`, \`direct_radiation_instant\`, \`diffuse_radiation_instant\`,
\`direct_normal_irradiance_instant\`, \`global_tilted_irradiance_instant\`,
\`terrestrial_radiation\`, \`terrestrial_radiation_instant\`,
\`cape\`, \`lifted_index\`, \`convective_inhibition\`, \`freezing_level_height\`,
\`boundary_layer_height\`, \`total_column_integrated_water_vapour\`,
\`uv_index\`, \`uv_index_clear_sky\`, \`is_day\`, \`sunshine_duration\`,
\`wet_bulb_temperature_2m\`, \`lightning_potential\`, \`leaf_wetness_probability_mean\`

Pressure-level variables (append level in hPa, e.g. \`temperature_500hPa\`):
\`temperature\`, \`relative_humidity\`, \`cloud_cover\`, \`wind_speed\`, \`wind_direction\`, \`geopotential_height\`
Available levels: 30, 50, 70, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900, 925, 950, 975, 1000 hPa.

### Daily Variables (\`&daily=\`)

\`weather_code\`, \`temperature_2m_max\`, \`temperature_2m_min\`, \`temperature_2m_mean\`,
\`apparent_temperature_max\`, \`apparent_temperature_min\`, \`apparent_temperature_mean\`,
\`sunrise\`, \`sunset\`, \`daylight_duration\`, \`sunshine_duration\`,
\`uv_index_max\`, \`uv_index_clear_sky_max\`,
\`precipitation_sum\`, \`rain_sum\`, \`showers_sum\`, \`snowfall_sum\`,
\`precipitation_hours\`, \`precipitation_probability_max\`,
\`precipitation_probability_mean\`, \`precipitation_probability_min\`,
\`wind_speed_10m_max\`, \`wind_gusts_10m_max\`, \`wind_direction_10m_dominant\`,
\`shortwave_radiation_sum\`, \`et0_fao_evapotranspiration\`

### Current Variables (\`&current=\`)

\`temperature_2m\`, \`relative_humidity_2m\`, \`apparent_temperature\`,
\`is_day\`, \`precipitation\`, \`rain\`, \`showers\`, \`snowfall\`,
\`weather_code\`, \`cloud_cover\`, \`pressure_msl\`, \`surface_pressure\`,
\`wind_speed_10m\`, \`wind_direction_10m\`, \`wind_gusts_10m\`

### JSON Response

${COMMON_JSON_ENVELOPE}

### WMO Weather Codes (\`weather_code\`)

| Code | Condition |
|---|---|
| 0 | Clear sky |
| 1, 2, 3 | Mainly clear, partly cloudy, overcast |
| 45, 48 | Fog, depositing rime fog |
| 51, 53, 55 | Drizzle: light, moderate, dense |
| 61, 63, 65 | Rain: slight, moderate, heavy |
| 71, 73, 75 | Snow: slight, moderate, heavy |
| 80, 81, 82 | Rain showers: slight, moderate, violent |
| 85, 86 | Snow showers: slight, heavy |
| 95 | Thunderstorm |
| 96, 99 | Thunderstorm with hail |
`.trim();

const HISTORICAL = `
## Historical Weather API

**Endpoint:** \`GET https://archive-api.open-meteo.com/v1/archive\`

ERA5 and ERA5-Land reanalysis data from 1940 to 5–7 days before today. Same variable names as the Forecast API; \`start_date\` and \`end_date\` are required.

### Required Parameters

${COMMON_GEO_PARAMS}

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`start_date\` | string (yyyy-mm-dd) | Yes | Start of the time range. Earliest: \`1940-01-01\`. |
| \`end_date\` | string (yyyy-mm-dd) | Yes | End of the time range (inclusive). |

### Formatting Parameters

${COMMON_FORMAT_PARAMS}

### Available Variables

Same hourly and daily variable names as the Weather Forecast API. Pressure-level variables are also available.

Additional ERA5-only hourly variables: \`soil_temperature_7_to_28cm\`, \`soil_temperature_28_to_100cm\`, \`soil_temperature_100_to_255cm\`, \`soil_moisture_7_to_28cm\`, \`soil_moisture_28_to_100cm\`, \`soil_moisture_100_to_255cm\`
`.trim();

const HISTORICAL_FORECAST = `
## Historical Forecast API

**Endpoint:** \`GET https://historical-forecast-api.open-meteo.com/v1/forecast\`

Archive of actual NWP model runs — what the model forecast at that time, not a reanalysis. Useful for model evaluation and hindcasting. Requires \`start_date\` and \`end_date\`. ECMWF IFS available from March 2024; all other models from September 2025.

### Parameters

Same as the Weather Forecast API, with required \`start_date\` and \`end_date\` instead of \`forecast_days\`. A \`models\` parameter selects the NWP model archive to use.
`.trim();

const CLIMATE = `
## Climate API

**Endpoint:** \`GET https://climate-api.open-meteo.com/v1/climate\`

CMIP6-downscaled daily projections at ~10 km resolution, 1950–2050. Requires \`start_date\` and \`end_date\`.

### Required Parameters

${COMMON_GEO_PARAMS}

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`start_date\` | string (yyyy-mm-dd) | Yes | Earliest: \`1950-01-01\`. |
| \`end_date\` | string (yyyy-mm-dd) | Yes | Latest: \`2050-12-31\`. |
| \`models\` | string array | Yes | One or more CMIP6 model names (see docs for full list), e.g. \`CMCC_CM2_VHR4\`, \`EC_Earth3P_HR\`, \`MPI_ESM1_2_XR\`, \`NICAM16_8S\`, \`MRI_AGCM3_2_S\`. |
| \`daily\` | string array | Yes | Variables to return (see below). |

### Daily Variables (\`&daily=\`)

\`temperature_2m_mean\`, \`temperature_2m_max\`, \`temperature_2m_min\`,
\`wind_speed_10m_mean\`, \`wind_speed_10m_max\`,
\`cloud_cover_mean\`, \`shortwave_radiation_sum\`,
\`relative_humidity_2m_mean\`, \`relative_humidity_2m_max\`, \`relative_humidity_2m_min\`,
\`dew_point_2m_mean\`, \`dew_point_2m_min\`, \`dew_point_2m_max\`,
\`precipitation_sum\`, \`rain_sum\`, \`snowfall_sum\`,
\`pressure_msl_mean\`,
\`soil_moisture_0_to_10cm_mean\`, \`et0_fao_evapotranspiration_sum\`,
\`vapour_pressure_deficit_max\`
`.trim();

const ENSEMBLE = `
## Ensemble API

**Endpoint:** \`GET https://ensemble-api.open-meteo.com/v1/ensemble\`

Probabilistic forecasts from up to 50 ensemble members. The \`models\` parameter selects the ensemble system; each member is returned as a separate time-series column named \`variable_member<N>\` (e.g. \`temperature_2m_member01\`).

### Key Models

\`icon_seamless\`, \`icon_global\`, \`icon_eu\`, \`icon_d2\`,
\`ecmwf_ifs04\`, \`ecmwf_ifs025\`, \`gfs_seamless\`, \`gfs025\`, \`gfs05\`,
\`gem_global\`, \`bom_access_global_ensemble\`

### Hourly Variables (\`&hourly=\`)

\`temperature_2m\`, \`relative_humidity_2m\`, \`dew_point_2m\`, \`apparent_temperature\`,
\`precipitation\`, \`rain\`, \`snowfall\`, \`snow_depth\`, \`weather_code\`,
\`pressure_msl\`, \`surface_pressure\`,
\`cloud_cover\`, \`cloud_cover_low\`, \`cloud_cover_mid\`, \`cloud_cover_high\`,
\`wind_speed_10m\`, \`wind_speed_80m\`, \`wind_speed_120m\`,
\`wind_direction_10m\`, \`wind_direction_80m\`, \`wind_direction_120m\`,
\`wind_gusts_10m\`,
\`shortwave_radiation\`, \`direct_radiation\`, \`diffuse_radiation\`,
\`direct_normal_irradiance\`, \`cape\`, \`lifted_index\`,
\`temperature_850hPa\`, \`geopotential_height_500hPa\`

### Daily Variables (\`&daily=\`)

\`weather_code\`, \`temperature_2m_max\`, \`temperature_2m_min\`,
\`precipitation_sum\`, \`rain_sum\`, \`snowfall_sum\`,
\`wind_speed_10m_max\`, \`wind_gusts_10m_max\`, \`wind_direction_10m_dominant\`,
\`shortwave_radiation_sum\`, \`et0_fao_evapotranspiration\`
`.trim();

const ENSEMBLE_MEAN = `
## Ensemble Mean API

**Endpoint:** \`GET https://ensemble-api.open-meteo.com/v1/ensemble_mean\`

Pre-computed ensemble statistics (mean, standard deviation, percentiles) for each variable, saving clients from having to download all 50 members.

### Variable Suffixes

Instead of \`_member<N>\`, each variable is returned with the following suffixes:

| Suffix | Description |
|---|---|
| \`_mean\` | Ensemble mean |
| \`_std\` | Standard deviation |
| \`_p10\`, \`_p25\`, \`_p75\`, \`_p90\` | 10th, 25th, 75th, 90th percentiles |

Otherwise accepts the same parameters and variable names as the Ensemble API.
`.trim();

const AIR_QUALITY = `
## Air Quality API

**Endpoint:** \`GET https://air-quality-api.open-meteo.com/v1/air-quality\`

Gases, particulate matter, pollen, and air quality indices. Powered by Copernicus CAMS (European Centre for Medium-Range Weather Forecasts).

### Required Parameters

${COMMON_GEO_PARAMS}

### Time Parameters

${COMMON_TIME_PARAMS}

### Formatting Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| \`timezone\` | string | \`"GMT"\` | IANA timezone. |
| \`timeformat\` | \`iso8601\` \| \`unixtime\` | \`iso8601\` | — |
| \`domains\` | string | \`auto\` | Force a specific domain: \`cams_europe\` or \`cams_global\`. |

### Hourly Variables (\`&hourly=\`)

**Pollutants:** \`pm10\`, \`pm2_5\`, \`carbon_monoxide\`, \`carbon_dioxide\`, \`nitrogen_dioxide\`,
\`sulphur_dioxide\`, \`ozone\`, \`nitrogen_monoxide\`, \`methane\`, \`ammonia\` (Europe only),
\`formaldehyde\`, \`glyoxal\`, \`non_methane_volatile_organic_compounds\`,
\`peroxyacyl_nitrates\`, \`secondary_inorganic_aerosol\`

**Aerosols:** \`aerosol_optical_depth\`, \`dust\`, \`pm10_wildfires\`,
\`residential_elementary_carbon\`, \`total_elementary_carbon\`,
\`pm2_5_total_organic_matter\`, \`sea_salt_aerosol\`

**Pollen (Europe only):** \`alder_pollen\`, \`birch_pollen\`, \`grass_pollen\`,
\`mugwort_pollen\`, \`olive_pollen\`, \`ragweed_pollen\`

**Radiation & Other:** \`uv_index\`, \`uv_index_clear_sky\`

**AQI Indices:** \`european_aqi\`, \`us_aqi\`,
\`european_aqi_pm2_5\`, \`european_aqi_pm10\`, \`european_aqi_nitrogen_dioxide\`,
\`european_aqi_ozone\`, \`european_aqi_sulphur_dioxide\`,
\`us_aqi_pm2_5\`, \`us_aqi_pm10\`, \`us_aqi_nitrogen_dioxide\`,
\`us_aqi_carbon_monoxide\`, \`us_aqi_ozone\`, \`us_aqi_sulphur_dioxide\`
`.trim();

const MARINE = `
## Marine Weather API

**Endpoint:** \`GET https://marine-api.open-meteo.com/v1/marine\`

Ocean wave forecasts from global and regional wave models (ERA5-Ocean, GWAM, EWAM, ECMWF WAM, GFS Wave, Météo-France Wave and Currents).

### Required Parameters

${COMMON_GEO_PARAMS}

### Time Parameters

${COMMON_TIME_PARAMS}

### Variable Selection

| Parameter | Description |
|---|---|
| \`hourly\` | Hourly wave variables. |
| \`daily\` | Daily aggregation variables. |
| \`current\` | Current conditions. |
| \`models\` | Override model: \`best_match\`, \`ecmwf_wam025\`, \`gwam\`, \`ewam\`, \`meteofrance_wave\`, \`meteofrance_currents\`, \`ncep_gfswave025\`, \`era5_ocean\` |

### Hourly Variables (\`&hourly=\`)

**Composite waves:** \`wave_height\`, \`wave_direction\`, \`wave_period\`, \`wave_peak_period\`

**Wind waves:** \`wind_wave_height\`, \`wind_wave_direction\`, \`wind_wave_period\`, \`wind_wave_peak_period\`

**Swell:** \`swell_wave_height\`, \`swell_wave_direction\`, \`swell_wave_period\`, \`swell_wave_peak_period\`,
\`secondary_swell_wave_height\`, \`secondary_swell_wave_period\`, \`secondary_swell_wave_direction\`,
\`tertiary_swell_wave_height\`, \`tertiary_swell_wave_period\`, \`tertiary_swell_wave_direction\`

**Ocean:** \`sea_surface_temperature\`, \`sea_level_height_msl\`, \`invert_barometer_height\`,
\`ocean_current_velocity\`, \`ocean_current_direction\`

### Daily Variables (\`&daily=\`)

\`wave_height_max\`, \`wave_direction_dominant\`, \`wave_period_max\`,
\`wind_wave_height_max\`, \`wind_wave_direction_dominant\`, \`wind_wave_period_max\`, \`wind_wave_peak_period_max\`,
\`swell_wave_height_max\`, \`swell_wave_direction_dominant\`, \`swell_wave_period_max\`, \`swell_wave_peak_period_max\`
`.trim();

const FLOOD = `
## Flood API

**Endpoint:** \`GET https://flood-api.open-meteo.com/v1/flood\`

GloFAS ensemble river-discharge forecasts for rivers worldwide (up to 92 days ahead).

### Required Parameters

${COMMON_GEO_PARAMS}

### Time Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| \`forecast_days\` | int | 92 | 1–92. |
| \`past_days\` | int | 0 | 0–183. |
| \`start_date\` / \`end_date\` | string (yyyy-mm-dd) | — | — |

### Variable Selection

| Parameter | Description |
|---|---|
| \`daily\` | Daily variables (see below). |
| \`models\` | \`seamless_v4\` (default), \`forecast_v4\`, \`consolidated_v4\`, \`seamless_v3\`, \`forecast_v3\`, \`consolidated_v3\` |

### Daily Variables (\`&daily=\`)

\`river_discharge\` — Ensemble mean river discharge (m³/s)

Additional ensemble statistics: \`river_discharge_mean\`, \`river_discharge_median\`,
\`river_discharge_max\`, \`river_discharge_min\`, \`river_discharge_p25\`, \`river_discharge_p75\`
`.trim();

const SEASONAL = `
## Seasonal Forecast API

**Endpoint:** \`GET https://seasonal-api.open-meteo.com/v1/forecast\`

Multi-model seasonal outlooks up to 9 months ahead from the Copernicus Climate Change Service (C3S). Resolution is coarser than medium-range forecasts (~50–100 km). Ensemble members are returned per variable.

### Hourly Variables (\`&hourly=\`)

\`temperature_2m\`, \`temperature_2m_max\`, \`temperature_2m_min\`,
\`dew_point_2m\`, \`relative_humidity_2m\`, \`apparent_temperature\`,
\`et0_fao_evapotranspiration\`, \`vapour_pressure_deficit\`, \`pressure_msl\`,
\`weather_code\`, \`precipitation\`, \`rain\`, \`showers\`, \`snowfall\`,
\`cloud_cover\`, \`sunshine_duration\`,
\`wind_speed_10m\`, \`wind_direction_10m\`, \`wind_gusts_10m\`,
\`wave_height\`, \`wave_direction\`, \`wave_period\`, \`wave_peak_period\`
`.trim();

const SATELLITE_RADIATION = `
## Satellite Radiation API

**Endpoint:** \`GET https://api.open-meteo.com/v1/radiation\`

High-resolution solar radiation from SARAH-3 (CM SAF / EUMETSAT), which uses Meteosat satellite observations for Europe and Africa (1983–present) and is blended with ERA5 globally.

### Hourly Variables (\`&hourly=\`)

\`shortwave_radiation\`, \`direct_radiation\`, \`diffuse_radiation\`,
\`direct_normal_irradiance\`, \`global_tilted_irradiance\`,
\`shortwave_radiation_instant\`, \`direct_radiation_instant\`, \`diffuse_radiation_instant\`,
\`direct_normal_irradiance_instant\`, \`global_tilted_irradiance_instant\`,
\`terrestrial_radiation\`, \`terrestrial_radiation_instant\`

Parameters \`tilt\` (0–90°) and \`azimuth\` (-180 to 180°) set the panel orientation for \`global_tilted_irradiance\`.
`.trim();

const GEOCODING = `
## Geocoding API

**Endpoint:** \`GET https://geocoding-api.open-meteo.com/v1/search\`

Search for cities and resolve to coordinates. Does not accept \`latitude\`/\`longitude\`.

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`name\` | string | Yes | City name, postal code, or administrative region. |
| \`count\` | int | No (default 10) | Number of results (1–100). |
| \`language\` | string | No (default "en") | ISO 639-1 language code for localised names. |
| \`format\` | \`json\` \| \`protobuf\` | No | Response format. |

### JSON Response

\`\`\`json
{
  "results": [
    {
      "id": 2950159,
      "name": "Berlin",
      "latitude": 52.52437,
      "longitude": 13.41053,
      "elevation": 74.0,
      "feature_code": "PPLC",
      "country_code": "DE",
      "admin1_id": 2950157,
      "timezone": "Europe/Berlin",
      "population": 3426354,
      "country": "Germany",
      "admin1": "Land Berlin"
    }
  ]
}
\`\`\`
`.trim();

const ELEVATION = `
## Elevation API

**Endpoint:** \`GET https://api.open-meteo.com/v1/elevation\`

Digital elevation model lookup (SRTM90, 90 m resolution). Accepts comma-separated coordinate lists for batch queries.

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`latitude\` | float or list | Yes | One or more WGS84 latitudes. |
| \`longitude\` | float or list | Yes | One or more WGS84 longitudes. |

### JSON Response

\`\`\`json
{ "elevation": [38.0, 221.0] }
\`\`\`
`.trim();

const PREVIOUS_RUNS = `
## Previous Runs API

**Endpoint:** \`GET https://previous-runs-api.open-meteo.com/v1/forecast\`

Retrieve archived NWP model runs indexed by their initialisation date. Useful for producing a continuous time-series of analyses (one value per run) rather than the full forecast horizon.

### Additional Parameters

| Parameter | Type | Description |
|---|---|---|
| \`models\` | string array | Select the NWP model(s) to archive. |
| \`start_date\` / \`end_date\` | string (yyyy-mm-dd) | Date range of model run initialisations to include. |

Variable selection and response format are the same as the Weather Forecast API.
`.trim();

const SINGLE_RUNS = `
## Single Runs API

**Endpoint:** \`GET https://single-runs-api.open-meteo.com/v1/forecast\`

Returns the full forecast horizon of a single model run identified by a \`forecast_day\` offset (0 = latest run, 1 = yesterday's run, etc.). ECMWF IFS available from March 2024; all other models from September 2025.

### Additional Parameters

| Parameter | Type | Description |
|---|---|---|
| \`models\` | string array | Select the NWP model. |
| \`forecast_day\` | int (0–7) | Which initialisation to use; 0 is the latest run. |

Variable selection and response format are the same as the Weather Forecast API.
`.trim();

const NATIONAL_MODELS = `
## National Weather Model APIs

These endpoints expose individual NWP model runs directly. All accept the same parameters as the Weather Forecast API (\`latitude\`, \`longitude\`, \`hourly\`, \`daily\`, \`current\`, \`models\`, \`forecast_days\`, formatting params, etc.).

| Endpoint | Model | Provider | Notes |
|---|---|---|---|
| \`GET https://api.open-meteo.com/v1/gfs\` | GFS (25 km global), HRRR (3 km CONUS) | NOAA / NCEP, USA | Model options: \`gfs_seamless\`, \`gfs_global\`, \`gfs_hrrr\`, \`gfs_graphcast025\` |
| \`GET https://api.open-meteo.com/v1/dwd-icon\` | ICON Global (13 km), ICON-EU (7 km), ICON-D2 (2 km) | DWD, Germany | Model options: \`icon_seamless\`, \`icon_global\`, \`icon_eu\`, \`icon_d2\` |
| \`GET https://api.open-meteo.com/v1/ecmwf\` | IFS (9 km), AIFS (25 km) | ECMWF | Model options: \`ecmwf_ifs025\`, \`ecmwf_aifs025\` |
| \`GET https://api.open-meteo.com/v1/gem\` | GEM (25 km), HRDPS (2.5 km) | ECCC, Canada | Model options: \`gem_seamless\`, \`gem_global\`, \`gem_regional\`, \`gem_hrdps_continental\` |
| \`GET https://api.open-meteo.com/v1/bom\` | ACCESS-G (25 km) | BOM, Australia | — |
| \`GET https://api.open-meteo.com/v1/meteofrance\` | ARPEGE (11 km global), AROME (1.3 km France) | Météo-France | Model options: \`meteofrance_seamless\`, \`meteofrance_arpege_world\`, \`meteofrance_arome_france\` |
| \`GET https://api.open-meteo.com/v1/forecast?models=meteoswiss_icon_seamless\` | ICON-CH1-EPS / ICON-CH2-EPS (1–2 km) | MeteoSwiss | — |
| \`GET https://api.open-meteo.com/v1/metno\` | MEPS (2.5 km), Arctic (8 km) | MET Norway | Model options: \`metno_seamless\`, \`metno_nordic\` |
| \`GET https://api.open-meteo.com/v1/ukmo\` | Global (10 km), UKV (2 km) | UK Met Office | Model options: \`ukmo_seamless\`, \`ukmo_global_deterministic_10km\`, \`ukmo_uk_deterministic_2km\` |
| \`GET https://api.open-meteo.com/v1/knmi\` | Harmonie AROME (5.5 km) | KNMI, Netherlands | Model options: \`knmi_seamless\`, \`knmi_harmonie_arome_europe\`, \`knmi_harmonie_arome_netherlands\` |
| \`GET https://api.open-meteo.com/v1/dmi\` | Harmonie DINI (2 km) | DMI, Denmark | — |
| \`GET https://api.open-meteo.com/v1/jma\` | GSM (55 km), MSM (5 km) | JMA, Japan | Model options: \`jma_seamless\`, \`jma_gsm\`, \`jma_msm\` |
| \`GET https://api.open-meteo.com/v1/kma\` | GDAPS-KIM (12 km), LDPS (1.5 km) | KMA, South Korea | Model options: \`kma_seamless\`, \`kma_gdps\`, \`kma_ldps\` |
| \`GET https://api.open-meteo.com/v1/cma\` | GFS GRAPES (15 km) | CMA, China | — |
| \`GET https://api.open-meteo.com/v1/geosphere_arome_austria\` | AROME-Austria (2.5 km), INCA (1 km) | GeoSphere Austria | — |
| \`GET https://api.open-meteo.com/v1/arpae\` | ICON-2i (2.2 km) | ItaliaMeteo ARPAE, Italy | — |
`.trim();

// ---------------------------------------------------------------------------
// Full document
// ---------------------------------------------------------------------------

function buildDocument(): string {
	const sections = [
		`# Open-Meteo Full API Reference`,
		``,
		`> Open-Meteo is a free, open-source weather API. No API key required.`,
		`> Data from national weather services worldwide. Free for non-commercial use; commercial plans available.`,
		`> All endpoints return JSON. Coordinates use WGS84 decimal degrees.`,
		``,
		`- OpenAPI spec: ${SITE}/docs/openapi.yml`,
		`- Summary index: ${SITE}/llms.txt`,
		`- Website: ${SITE}`,
		``,
		`---`,
		``,
		FORECAST,
		``,
		`---`,
		``,
		HISTORICAL,
		``,
		`---`,
		``,
		HISTORICAL_FORECAST,
		``,
		`---`,
		``,
		CLIMATE,
		``,
		`---`,
		``,
		ENSEMBLE,
		``,
		`---`,
		``,
		ENSEMBLE_MEAN,
		``,
		`---`,
		``,
		AIR_QUALITY,
		``,
		`---`,
		``,
		MARINE,
		``,
		`---`,
		``,
		FLOOD,
		``,
		`---`,
		``,
		SEASONAL,
		``,
		`---`,
		``,
		SATELLITE_RADIATION,
		``,
		`---`,
		``,
		GEOCODING,
		``,
		`---`,
		``,
		ELEVATION,
		``,
		`---`,
		``,
		PREVIOUS_RUNS,
		``,
		`---`,
		``,
		SINGLE_RUNS,
		``,
		`---`,
		``,
		NATIONAL_MODELS
	];

	return sections.join('\n');
}

export const GET: RequestHandler = () => {
	const body = buildDocument();

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400'
		}
	});
};

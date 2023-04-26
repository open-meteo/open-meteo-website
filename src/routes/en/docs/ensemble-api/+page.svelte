<script lang="ts">
import PressureLevels from "../PressureLevels.svelte";
import PressureLevelsHelpTable from "../PressureLevelsHelpTable.svelte"
import { onMount } from 'svelte';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker3.css';

onMount(async () => {
    const datepicker = await import("bootstrap-datepicker");
    const weather = await import("$lib/weather");
    const Dropdown = await import('bootstrap/js/dist/dropdown');
    const Collapse = await import('bootstrap/js/dist/collapse');
    const Tab = await import('bootstrap/js/dist/tab');
    weather.init(Dropdown.default)
});

const pressureVariables = [
    {name: "temperature", label: "Temperature"},
    {name: "relativehumidity", label: "Relative Humidity"},
    {name: "cloudcover", label: "Cloudcover"},
    {name: "windspeed", label: "Wind Speed"},
    {name: "winddirection", label: "Wind Direction"},
    {name: "geopotential_height", label: "Geopotential Height"}
]
const levels = [30, 50, 70, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900, 925, 950, 975, 1000].reverse()

</script>

<svelte:head>
    <title>Docs | Open-Meteo.com</title> 
    <link rel="canonical" href="https://open-meteo.com/en/docs" />
</svelte:head>


<!--<div class="mb-5" style="border-bottom: 1px solid #ddd">
  <div class="container px-4 py-1">
    <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a class="link-secondary" href="/">Home</a></li>
        <li class="breadcrumb-item"><a class="link-secondary" href="/en/docs">Weather APIs</a></li>
        <li class="breadcrumb-item active" aria-current="page">Weather Forecast API</li>
      </ol>
    </nav>
  </div>
</div>-->

<div class="alert alert-danger" role="alert">
  Work in progress!
</div>

  <form id="api_form" method="get" action="https://ensemble-api.open-meteo.com/v1/ensemble">
    <div class="row">
      <h2>Select Coordinates or City</h2>
      <div class="col-md-3">
        <div class="form-floating">
          <input type="number" step="0.0001" class="form-control" name="latitude" id="latitude" value="52.52">
          <label for="latitude">Latitude</label>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-floating">
          <input type="number" step="0.0001" class="form-control" name="longitude" id="longitude" value="13.41">
          <label for="longitude">Longitude</label>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group mb-3">
          <div class="form-floating dropdown">
            <input type="text" class="form-control" id="select_city" autocomplete="off" spellcheck="false" aria-label="Select city" data-bs-toggle="dropdown"/>
            <ul id="select_city_results" class="dropdown-menu" aria-labelledby="select_city">
              <li><span class="dropdown-item">Start typing to search for locations</span></li>
            </ul>
            <label for="select_city">Select city</label>
          </div>
          <button class="btn btn-outline-secondary" type="button" id="detect_gps">Detect GPS Position</button>
        </div>
      </div>
    </div>
    <div class="row py-3 px-0">
      <h2>Hourly Weather Variables</h2>
      <div class="col-md-3">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="temperature_2m" id="temperature_2m" name="hourly"
            checked>
          <label class="form-check-label" for="temperature_2m">
            Temperature (2 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="relativehumidity_2m" id="relativehumidity_2m"
            name="hourly">
          <label class="form-check-label" for="relativehumidity_2m">
            Relative Humidity (2 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="dewpoint_2m" id="dewpoint_2m" name="hourly">
          <label class="form-check-label" for="dewpoint_2m">
            Dewpoint (2 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="apparent_temperature" id="apparent_temperature"
            name="hourly">
          <label class="form-check-label" for="apparent_temperature">
            Apparent Temperature
          </label>
        </div>
        <!--<div class="form-check">
          <input class="form-check-input" type="checkbox" value="precipitation_probability" id="precipitation_probability" name="hourly">
          <label class="form-check-label" for="precipitation_probability">
            Precipitation Probability
          </label>
        </div>-->
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="precipitation" id="precipitation" name="hourly">
          <label class="form-check-label" for="precipitation">
            Precipitation (rain + showers + snow)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="rain" id="rain" name="hourly">
          <label class="form-check-label" for="rain">
            Rain
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="showers" id="showers" name="hourly">
          <label class="form-check-label" for="showers">
            Showers
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="snowfall" id="snowfall" name="hourly">
          <label class="form-check-label" for="snowfall">
            Snowfall
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="snow_depth" id="snow_depth" name="hourly">
          <label class="form-check-label" for="snow_depth">
            Snow Depth
          </label>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="weathercode" id="weathercode" name="hourly">
          <label class="form-check-label" for="weathercode">
            Weathercode
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="pressure_msl" id="pressure_msl" name="hourly">
          <label class="form-check-label" for="pressure_msl">
            Sealevel Pressure
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="surface_pressure" id="surface_pressure" name="hourly">
          <label class="form-check-label" for="surface_pressure">
            Surface Pressure
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="cloudcover" id="cloudcover" name="hourly">
          <label class="form-check-label" for="cloudcover">
            Cloudcover Total
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="cloudcover_low" id="cloudcover_low" name="hourly">
          <label class="form-check-label" for="cloudcover_low">
            Cloudcover Low
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="cloudcover_mid" id="cloudcover_mid" name="hourly">
          <label class="form-check-label" for="cloudcover_mid">
            Cloudcover Mid
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="cloudcover_high" id="cloudcover_high" name="hourly">
          <label class="form-check-label" for="cloudcover_high">
            Cloudcover High
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="visibility" id="visibility" name="hourly">
          <label class="form-check-label" for="visibility">
            Visibility
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="evapotranspiration" id="evapotranspiration"
            name="hourly">
          <label class="form-check-label" for="evapotranspiration">
            Evapotranspiration
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="et0_fao_evapotranspiration"
            id="et0_fao_evapotranspiration" name="hourly">
          <label class="form-check-label" for="et0_fao_evapotranspiration">
            Reference Evapotranspiration (ET₀)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="vapor_pressure_deficit" id="vapor_pressure_deficit"
            name="hourly">
          <label class="form-check-label" for="vapor_pressure_deficit">
            Vapor Pressure Deficit
          </label>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="windspeed_10m" id="windspeed_10m" name="hourly">
          <label class="form-check-label" for="windspeed_10m">
            Wind Speed (10 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="windspeed_80m" id="windspeed_80m" name="hourly">
          <label class="form-check-label" for="windspeed_80m">
            Wind Speed (80 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="windspeed_120m" id="windspeed_120m" name="hourly">
          <label class="form-check-label" for="windspeed_120m">
            Wind Speed (120 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="windspeed_180m" id="windspeed_180m" name="hourly">
          <label class="form-check-label" for="windspeed_180m">
            Wind Speed (180 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="winddirection_10m" id="winddirection_10m"
            name="hourly">
          <label class="form-check-label" for="winddirection_10m">
            Wind Direction (10 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="winddirection_80m" id="winddirection_80m"
            name="hourly">
          <label class="form-check-label" for="winddirection_80m">
            Wind Direction (80 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="winddirection_120m" id="winddirection_120m"
            name="hourly">
          <label class="form-check-label" for="winddirection_120m">
            Wind Direction (120 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="winddirection_180m" id="winddirection_180m"
            name="hourly">
          <label class="form-check-label" for="winddirection_180m">
            Wind Direction (180 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="windgusts_10m" id="windgusts_10m" name="hourly">
          <label class="form-check-label" for="windgusts_10m">
            Wind Gusts (10 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="temperature_80m" id="temperature_80m" name="hourly">
          <label class="form-check-label" for="temperature_80m">
            Temperature (80 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="temperature_120m" id="temperature_120m" name="hourly">
          <label class="form-check-label" for="temperature_120m">
            Temperature (120 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="temperature_180m" id="temperature_180m" name="hourly">
          <label class="form-check-label" for="temperature_180m">
            Temperature (180 m)
          </label>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="soil_temperature_0cm" id="soil_temperature_0cm"
            name="hourly">
          <label class="form-check-label" for="soil_temperature_0cm">
            Soil Temperature (0 cm)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="soil_temperature_6cm" id="soil_temperature_6cm"
            name="hourly">
          <label class="form-check-label" for="soil_temperature_6cm">
            Soil Temperature (6 cm)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="soil_temperature_18cm" id="soil_temperature_18cm"
            name="hourly">
          <label class="form-check-label" for="soil_temperature_18cm">
            Soil Temperature (18 cm)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="soil_temperature_54cm" id="soil_temperature_54cm"
            name="hourly">
          <label class="form-check-label" for="soil_temperature_54cm">
            Soil Temperature (54 cm)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="soil_moisture_0_1cm" id="soil_moisture_0_1cm"
            name="hourly">
          <label class="form-check-label" for="soil_moisture_0_1cm">
            Soil Moisture (0-1 cm)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="soil_moisture_1_3cm" id="soil_moisture_1_3cm"
            name="hourly">
          <label class="form-check-label" for="soil_moisture_1_3cm">
            Soil Moisture (1-3 cm)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="soil_moisture_3_9cm" id="soil_moisture_3_9cm"
            name="hourly">
          <label class="form-check-label" for="soil_moisture_3_9cm">
            Soil Moisture (3-9 cm)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="soil_moisture_9_27cm" id="soil_moisture_9_27cm"
            name="hourly">
          <label class="form-check-label" for="soil_moisture_9_27cm">
            Soil Moisture (9-27 cm)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="soil_moisture_27_81cm" id="soil_moisture_27_81cm"
            name="hourly">
          <label class="form-check-label" for="soil_moisture_27_81cm">
            Soil Moisture (27-81 cm)
          </label>
        </div>
      </div>
    </div>

    <div class="row py-3 px-0">
      <div class="accordion" id="accordionVariables">
      <div class="accordion-item">
          <h2 class="accordion-header" id="heading-additional-variables">
            <button class="accordion-button collapsed py-2" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapse-additional-variables" aria-expanded="false" aria-controls="collapse-additional-variables">
              Additional Variables&nbsp;<span class="badge rounded-pill bg-secondary checkboxcounter"
                data-count-checkboxes-of="#collapse-additional-variables">0/x</span>
            </button>
          </h2>
          <div id="collapse-additional-variables" class="accordion-collapse collapse"
            aria-labelledby="heading-additional-variables" data-bs-parent="#accordionVariables">
            <div class="accordion-body row">
              <div class="col-md-6">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="uv_index" id="uv_index"
                    name="hourly">
                  <label class="form-check-label" for="uv_index">
                    UV Index
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="uv_index_clear_sky" id="uv_index_clear_sky"
                    name="hourly">
                  <label class="form-check-label" for="uv_index_clear_sky">
                    UV Index Clear Sky
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="is_day" id="is_day"
                    name="hourly">
                  <label class="form-check-label" for="is_day">
                    Is Day or Night
                  </label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="cape" id="cape"
                    name="hourly">
                  <label class="form-check-label" for="cape">
                    CAPE
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="freezinglevel_height" id="freezinglevel_height"
                    name="hourly">
                  <label class="form-check-label" for="freezinglevel_height">
                    Freezinglevel Height
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading-solar-variables">
            <button class="accordion-button collapsed py-2" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapse-solar-variables" aria-expanded="false" aria-controls="collapse-solar-variables">
              Solar Radiation Variables&nbsp;<span class="badge rounded-pill bg-secondary checkboxcounter"
                data-count-checkboxes-of="#collapse-solar-variables">0/x</span>
            </button>
          </h2>
          <div id="collapse-solar-variables" class="accordion-collapse collapse"
            aria-labelledby="heading-solar-variables" data-bs-parent="#accordionVariables">
            <div class="accordion-body row">
              <div class="col-md-6">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="shortwave_radiation" id="shortwave_radiation"
                    name="hourly">
                  <label class="form-check-label" for="shortwave_radiation">
                    Shortwave Solar Radiation
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="direct_radiation" id="direct_radiation"
                    name="hourly">
                  <label class="form-check-label" for="direct_radiation">
                    Direct Solar Radiation
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="diffuse_radiation" id="diffuse_radiation"
                    name="hourly">
                  <label class="form-check-label" for="diffuse_radiation">
                    Diffuse Solar Radiation
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="direct_normal_irradiance"
                    id="direct_normal_irradiance" name="hourly">
                  <label class="form-check-label" for="direct_normal_irradiance">
                    Direct Normal Irradiance DNI
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="terrestrial_radiation"
                    id="terrestrial_radiation" name="hourly">
                  <label class="form-check-label" for="terrestrial_radiation">
                    Terrestrial Solar Radiation
                  </label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="shortwave_radiation_instant"
                    id="shortwave_radiation_instant" name="hourly">
                  <label class="form-check-label" for="shortwave_radiation_instant">
                    Shortwave Solar Radiation (Instant)
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="direct_radiation_instant"
                    id="direct_radiation_instant" name="hourly">
                  <label class="form-check-label" for="direct_radiation_instant">
                    Direct Solar Radiation (Instant)
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="diffuse_radiation_instant"
                    id="diffuse_radiation_instant" name="hourly">
                  <label class="form-check-label" for="diffuse_radiation_instant">
                    Diffuse Solar Radiation (Instant)
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="direct_normal_irradiance_instant"
                    id="direct_normal_irradiance_instant" name="hourly">
                  <label class="form-check-label" for="direct_normal_irradiance_instant">
                    Direct Normal Irradiance DNI (Instant)
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="terrestrial_radiation_instant"
                    id="terrestrial_radiation_instant" name="hourly">
                  <label class="form-check-label" for="terrestrial_radiation_instant">
                    Terrestrial Solar Radiation (Instant)
                  </label>
                </div>
              </div>
              <div class="col-md-12">
                <small class="text-muted">Note: Solar radiation is averaged over the past hour. Use
                  <mark>instant</mark> for radiation at the indicated time.</small>
              </div>
            </div>
          </div>
        </div>
        <PressureLevels pressureVariables={pressureVariables} levels={levels}/>
        
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading-models">
            <button class="accordion-button collapsed py-2" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapse-models" aria-expanded="false" aria-controls="collapse-models">
              Weather models&nbsp;<span class="badge rounded-pill bg-secondary checkboxcounter"
                data-count-checkboxes-of="#collapse-models">0/x</span>&nbsp;<span
                class="badge bg-primary">New</span>
            </button>
          </h2>
          <div id="collapse-models" class="accordion-collapse collapse"
            aria-labelledby="heading-models" data-bs-parent="#accordionVariables">
            <div class="accordion-body row">
              <div class="col-md-3">
                <!--<div class="form-check">
                  <input class="form-check-input" type="checkbox" value="best_match" id="best_match"
                    name="models">
                  <label class="form-check-label" for="best_match">
                    Best match
                  </label>
                </div>-->
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="ecmwf_ifs04"
                    id="ecmwf_ifs04" name="models">
                  <label class="form-check-label" for="ecmwf_ifs04">
                    ECMWF IFS
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="gfs_seamless"
                    id="gfs_seamless" name="models">
                  <label class="form-check-label" for="gfs_seamless">
                    GFS Ensemble Seamless
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="gfs025"
                    id="gfs025" name="models">
                  <label class="form-check-label" for="gfs025">
                    GFS Ensemble 0.25
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="gfs05"
                    id="gfs05" name="models">
                  <label class="form-check-label" for="gfs05">
                    GFS Ensemble 0.5
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="gem_global"
                    id="gem_global" name="models">
                  <label class="form-check-label" for="gem_global">
                    GEM Global Ensemble
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="icon_seamless" id="icon_seamless"
                    name="models">
                  <label class="form-check-label" for="icon_seamless">
                    DWD Icon Seamless
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="icon_global" id="icon_global"
                    name="models">
                  <label class="form-check-label" for="icon_global">
                    DWD Icon Global
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="icon_eu" id="icon_eu"
                    name="models">
                  <label class="form-check-label" for="icon_eu">
                    DWD Icon EU
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="icon_d2"
                    id="icon_d2" name="models">
                  <label class="form-check-label" for="icon_d2">
                    DWD Icon D2
                  </label>
                </div>
              </div>
              <!--<div class="col-md-12">
                <small class="text-muted">Note: The default <mark>Best Match</mark> provides the best forecast for any given location worldwide. <mark>Seamless</mark> combines all models from a given provider into a seamless prediction.</small>
              </div>-->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--<div class="row py-3 px-0">
      <h2>Daily Weather Variables <small class="text-muted">(*)</small></h2>
      <div class="col-md-6">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="weathercode" id="weathercode_daily" name="daily">
          <label class="form-check-label" for="weathercode_daily">
            Weathercode
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="temperature_2m_max" id="temperature_2m_max"
            name="daily">
          <label class="form-check-label" for="temperature_2m_max">
            Maximum Temperature (2 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="temperature_2m_min" id="temperature_2m_min"
            name="daily">
          <label class="form-check-label" for="temperature_2m_min">
            Minimum Temperature (2 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="apparent_temperature_max" id="apparent_temperature_max"
            name="daily">
          <label class="form-check-label" for="apparent_temperature_max">
            Maximum Apparent Temperature (2 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="apparent_temperature_min" id="apparent_temperature_min"
            name="daily">
          <label class="form-check-label" for="apparent_temperature_min">
            Minimum Apparent Temperature (2 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="sunrise" id="sunrise" name="daily">
          <label class="form-check-label" for="sunrise">
            Sunrise
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="sunset" id="sunset" name="daily">
          <label class="form-check-label" for="sunset">
            Sunset
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="uv_index_max" id="uv_index_max" name="daily">
          <label class="form-check-label" for="uv_index_max">
            UV Index
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="uv_index_clear_sky_max" id="uv_index_clear_sky_max" name="daily">
          <label class="form-check-label" for="uv_index_clear_sky_max">
            UV Index Clear Sky
          </label>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="precipitation_sum" id="precipitation_sum" name="daily">
          <label class="form-check-label" for="precipitation_sum">
            Precipitation Sum
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="rain_sum" id="rain_sum" name="daily">
          <label class="form-check-label" for="rain_sum">
            Rain Sum
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="showers_sum" id="showers_sum" name="daily">
          <label class="form-check-label" for="showers_sum">
            Showers Sum
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="snowfall_sum" id="snowfall_sum" name="daily">
          <label class="form-check-label" for="snowfall_sum">
            Snowfall Sum
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="precipitation_hours" id="precipitation_hours"
            name="daily">
          <label class="form-check-label" for="precipitation_hours">
            Precipitation Hours
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="precipitation_probability_max" id="precipitation_probability_max" name="daily">
          <label class="form-check-label" for="precipitation_probability_max">
            Precipitation Probability Max
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="windspeed_10m_max" id="windspeed_10m_max" name="daily">
          <label class="form-check-label" for="windspeed_10m_max">
            Maximum Wind Speed (10 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="windgusts_10m_max" id="windgusts_10m_max" name="daily">
          <label class="form-check-label" for="windgusts_10m_max">
            Maximum Wind Gusts (10 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="winddirection_10m_dominant"
            id="winddirection_10m_dominant" name="daily">
          <label class="form-check-label" for="winddirection_10m_dominant">
            Dominant Wind Direction (10 m)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="shortwave_radiation_sum" id="shortwave_radiation_sum"
            name="daily">
          <label class="form-check-label" for="shortwave_radiation_sum">
            Shortwave Radiation Sum
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="et0_fao_evapotranspiration"
            id="et0_fao_evapotranspiration_daily" name="daily">
          <label class="form-check-label" for="et0_fao_evapotranspiration_daily">
            Reference Evapotranspiration (ET₀)
          </label>
        </div>
      </div>
      <small class="text-muted">* Parameter <mark>timezone</mark> is mandatory</small>
    </div>-->

    <div class="row py-3 px-0">
      <h2>Settings</h2>
      <!--<div class="col-12 pb-3">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="current_weather" name="current_weather" value="true">
          <label class="form-check-label" for="current_weather">Current weather with temperature, windspeed and
            weather code</label>
        </div>
      </div>-->
      <div class="col-3">
        <div class="form-floating mb-3">
          <select class="form-select" name="temperature_unit" id="temperature_unit" aria-label="Temperature Unit"
            data-default="celsius">
            <option selected value="celsius">Celsius °C</option>
            <option value="fahrenheit">Fahrenheit °F</option>
          </select>
          <label for="temperature_unit">Temperature Unit</label>
        </div>
      </div>
      <div class="col-3">
        <div class="form-floating mb-3">
          <select class="form-select" name="windspeed_unit" id="windspeed_unit" aria-label="Windspeed Unit"
            data-default="kmh">
            <option selected value="kmh">Km/h</option>
            <option value="ms">m/s</option>
            <option value="mph">Mph</option>
            <option value="kn">Knots</option>
          </select>
          <label for="windspeed_unit">Wind Speed Unit</label>
        </div>
      </div>
      <div class="col-3">
        <div class="form-floating mb-3">
          <select class="form-select" name="precipitation_unit" id="precipitation_unit" aria-label="Precipitation Unit"
            data-default="mm">
            <option selected value="mm">Millimeter</option>
            <option value="inch">Inch</option>
          </select>
          <label for="precipitation_unit">Precipitation Unit</label>
        </div>
      </div>
      <div class="col-3">
        <div class="form-floating mb-3">
          <select class="form-select" name="timeformat" id="timeformat" aria-label="Timeformat" data-default="iso8601">
            <option selected value="iso8601">ISO 8601 (e.g. 2022-12-31)</option>
            <option value="unixtime">Unix timestamp</option>
          </select>
          <label for="timeformat">Timeformat</label>
        </div>
      </div>
      <div class="col-3">
        <div class="form-floating mb-3">
          <select class="form-select" name="past_days" id="past_days" aria-label="Past days" data-default="0">
            <option selected value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="7">1 week</option>
            <option value="14">2 weeks</option>
            <option value="31">1 month</option>
            <option value="61">2 months</option>
            <option value="92">3 months</option>
          </select>
          <label for="past_days">Past days</label>
        </div>
      </div>
      <div class="col-3">
        <div class="form-floating mb-3">
          <select class="form-select" name="forecast_days" id="forecast_days" aria-label="Forecast days"
            data-default="7">
            <option value="1">1 day</option>
            <option value="3">3 days</option>
            <option selected value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="16">16 days</option>
            <option value="30">30 days</option>
            <option value="35">35 days</option>
          </select>
          <label for="forecast_days">Forecast days</label>
        </div>
      </div>
      <div class="col-3">
        <div class="form-floating">
          <input type="text" class="form-control" data-provide="datepicker" data-date-format="yyyy-mm-dd"
            data-date-start-date="2022-06-08" value="" data-default="" name="start_date" id="start_date"><span
            class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>
          <label for="start_date">Start date</label>
        </div>
      </div>
      <div class="col-3">
        <div class="form-floating">
          <input type="text" class="form-control" data-provide="datepicker" data-date-format="yyyy-mm-dd"
            data-date-start-date="2022-06-08" value="" data-default="" name="end_date" id="end_date"><span
            class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>
          <label for="end_date">End date</label>
        </div>
      </div>
      <div class="col-3">
        <div class="form-floating mb-3">
          <select class="form-select" name="timezone" id="timezone" aria-label="Timezone" data-default="GMT">
            <option value="America/Anchorage">America/Anchorage</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
            <option value="America/Denver">America/Denver</option>
            <option value="America/Chicago">America/Chicago</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Sao_Paulo">America/Sao_Paulo</option>
            <option selected value="GMT">GMT+0</option>
            <option value="auto">Automatically detect time zone</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Europe/Berlin">Europe/Berlin</option>
            <option value="Europe/Moscow">Europe/Moscow</option>
            <option value="Africa/Cairo">Africa/Cairo</option>
            <option value="Asia/Bangkok">Asia/Bangkok</option>
            <option value="Asia/Singapore">Asia/Singapore</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
            <option value="Australia/Sydney">Australia/Sydney</option>
            <option value="Pacific/Auckland">Pacific/Auckland</option>
          </select>
          <label for="timezone">Timezone</label>
        </div>
      </div>
      <div class="col-12 pb-3 debug-hidden">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="localhost" name="localhost" value="true">
          <label class="form-check-label" for="localhost">Use localhost server</label>
        </div>
      </div>
    </div>

    <div class="col-12">
      <button type="submit" class="btn btn-primary">Preview Chart</button>
      <button type="submit" class="btn btn-outline-primary" name="format" value="xlsx">Download XLSX</button>
      <button type="submit" class="btn btn-outline-primary" name="format" value="csv">Download CSV</button>
    </div>
  </form>



  <div class="col-12 my-4">
    <div id="container" style="height: 400px; width: 100%"></div>
  </div>

  <div class="col-12">
    <label for="api_url" class="form-label">API URL (<a id="api_url_link" target="_blank" href="#">Open in new
        tab</a>)</label>
    <input type="text" class="form-control" id="api_url" readonly>
    <div id="emailHelp" class="form-text">You can copy this API URL into your application</div>
  </div>

  <div class="col-12 py-5">
    <h2 id="data-sources">Data Source</h2>
    <!--<p>Open-Meteo weather forecast APIs use weather models from multiple national weather providers. For each location worldwide, the best models will be combined to provide the best possible forecast.</p>
    <p>Weather models cover different geographic areas at different resolutions and provide different weather variables. Depending on the model, data have been interpolated to hourly values or not all weather variables are available. With the drop down <mark>Weather models</mark> (just below the hourly variables), you can select and compare individual weather models.</p>-->
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">National Weather Service</th>
            <th scope="col">Weather Model</th>
            <th scope="col">Region</th>
            <th scope="col">Resolution</th>
            <th scope="col">Members</th>
            <th scope="col">Forecast Length</th>
            <th scope="col">Update frequency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" rowspan="3">Deutscher Wetterdienst (DWD)</th>
            <td>ICON-D2-EPS</td>
            <td>Central Europe</td>
            <td>2 km, hourly</td>
            <td>20</td>
            <td>2 days</td>
            <td>Every 3 hours</td>
          </tr>
          <tr>
            <td>ICON-EU-EPS</td>
            <td>Europe</td>
            <td>13 km, hourly</td>
            <td>40</td>
            <td>5 days</td>
            <td>Every 6 hours</td>
          </tr>
          <tr>
            <td>ICON-EPS</td>
            <td>Global</td>
            <td>26 km, hourly</td>
            <td>40</td>
            <td>7.5 days</td>
            <td>Every 12 hours</td>
          </tr>
          <tr>
            <th scope="row" rowspan="2">NOAA</th>
            <td>GFS Ensemble 0.25°</td>
            <td>Global</td>
            <td>25 km, 3-hourly</td>
            <td>31</td>
            <td>10 days</td>
            <td>Every 6 hours</td>
          </tr>
          <tr>
            <td>GFS Ensemble 0.5°</td>
            <td>Global</td>
            <td>50 km, 3-hourly</td>
            <td>31</td>
            <td>35 days</td>
            <td>Every 6 hours</td>
          </tr>
          <tr>
            <th scope="row">ECMWF</th>
            <td>IFS</td>
            <td>Global</td>
            <td>44 km, 3-hourly</td>
            <td>51</td>
            <td>10 days</td>
            <td>Every 6 hours</td>
          </tr>
          <tr>
            <th scope="row">Canadian Weather Service</th>
            <td>GEM</td>
            <td>Global</td>
            <td>2.5 km, 3-hourly</td>
            <td>21</td>
            <td>16 days (32 days every thursday)</td>
            <td>Every 12 hours</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
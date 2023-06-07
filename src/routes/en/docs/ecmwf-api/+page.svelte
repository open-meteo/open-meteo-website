<script lang="ts">
import PressureLevels from "../PressureLevels.svelte";

import { onMount } from 'svelte';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker3.css';
	import LicenseSelector from "../LicenseSelector.svelte";

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
    {name: "relative_humidity", label: "Relative Humidity"}, // NOTE underscore here!
    {name: "specific_humidity", label: "Specific Humidity"},
    {name: "cloudcover", label: "Cloudcover"},
    {name: "windspeed", label: "Wind Speed"},
    {name: "winddirection", label: "Wind Direction"},
    {name: "geopotential_height", label: "Geopotential Height"},
    {name: "atmosphere_relative_vorticity", label: "Relative Vorticity"},
    {name: "divergence_of_wind", label: "Divergence of Wind"}
]
const levels = [50, 200, 250, 300, 500, 700, 850, 925, 1000].reverse()

</script>

<svelte:head>
    <title>ECMWF Forecast API | Open-Meteo.com</title> 
    <link rel="canonical" href="https://open-meteo.com/en/docs/ecmwf-api" />
</svelte:head>

<div class="alert alert-primary" role="alert">
  The API utilizes open-data ECMWF weather forecasts from the IFS weather model, which has a resolution of 9 km. However, the open-data access is restricted to a resolution of 40 km and 3-hourly values, although the model still boasts excellent accuracy for large scale weather patterns. For more detailed local forecasts, we recommend utilizing the <a href="/en/docs">generic weather forecast API</a>, which combines weather models up to 1 km resolution seamlessly.
</div>

  <form id="api_form" method="get" action="https://api.open-meteo.com/v1/ecmwf">
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
      <h2>3-Hourly Weather Variables</h2>
      <div class="col-md-3">

        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="temperature_2m" id="temperature_2m" name="hourly"
            checked>
          <label class="form-check-label" for="temperature_2m">
            Temperature (2 m)
          </label>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="pressure_msl" id="pressure_msl" name="hourly">
          <label class="form-check-label" for="pressure_msl">
            Sealevel Pressure
          </label>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="surface_air_pressure" id="surface_air_pressure"
            name="hourly">
          <label class="form-check-label" for="surface_air_pressure">
            Surface Air Pressure
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
          <input class="form-check-input" type="checkbox" value="precipitation" id="precipitation" name="hourly">
          <label class="form-check-label" for="precipitation">
            Precipitation (rain + showers + snow)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="snowfall" id="snowfall" name="hourly">
          <label class="form-check-label" for="snowfall">
            Snowfall
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="runoff" id="runoff" name="hourly">
          <label class="form-check-label" for="runoff">
            Surface water runoff
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="total_column_integrated_water_vapour"
            id="total_column_integrated_water_vapour" name="hourly">
          <label class="form-check-label" for="total_column_integrated_water_vapour">
            Total Column Integrated Water Vapour
          </label>
        </div>

      </div>

      <div class="col-md-3">
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
          <input class="form-check-input" type="checkbox" value="windspeed_10m" id="windspeed_10m" name="hourly">
          <label class="form-check-label" for="windspeed_10m">
            Wind Speed (10 m)
          </label>
        </div>
        
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="winddirection_10m" id="winddirection_10m"
            name="hourly">
          <label class="form-check-label" for="winddirection_10m">
            Wind Direction (10 m)
          </label>
        </div>

      </div>
      <div class="col-md-3">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="skin_temperature" id="skin_temperature" name="hourly">
          <label class="form-check-label" for="skin_temperature">
            Skin Temperature
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="soil_temperature_0_to_7cm"
            id="soil_temperature_0_to_7cm" name="hourly">
          <label class="form-check-label" for="soil_temperature_0_to_7cm">
            Soil Temperature (0-7 cm)
          </label>
        </div>
      </div>
    </div>

    <div class="row py-3 px-0">
      <div class="accordion" id="accordionVariables">
        <PressureLevels pressureVariables={pressureVariables} levels={levels}/>
      </div>
    </div>


    <div class="row py-3 px-0">
      <h2>Settings</h2>
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
      <div class="col-12 pb-3 debug-hidden">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="localhost" name="localhost" value="true">
          <label class="form-check-label" for="localhost">Use localhost server</label>
        </div>
      </div>
    </div>
    
    <LicenseSelector></LicenseSelector>
    <div class="col-12 my-4">
      <h2>Preview and API URL</h2>
      <div id="container" style="height: 400px; width: 100%"></div>
    </div>
    <div class="col-12">
      <button type="submit" class="btn btn-primary">Preview Chart</button>
      <button type="submit" class="btn btn-outline-primary" name="format" value="xlsx">Download XLSX</button>
      <button type="submit" class="btn btn-outline-primary" name="format" value="csv">Download CSV</button>
    </div>
  
    <div class="col-12 my-4">
      <label for="api_url" class="form-label">API URL</label> <small class="text-muted">(<a id="api_url_link" target="_blank" href="#">Open in new
          tab</a> or copy this URL into your application)</small>
      <input type="text" class="form-control" id="api_url" readonly>
    </div>
  </form>



  <div class="col-12 py-5">
    <h2 id="data-sources">Data Source</h2>
    <p>This API uses <a href="https://www.ecmwf.int/en/forecasts/datasets/open-data">open-data ECMWF Integrated Forecast System IFS</a>. ECMWF IFS models run every 6 hours at 9 km resolution, but only 0.4° grid spacing (~44 km) is available as open data with a limited number of weather variables at 3-hourly intervals. As soon as ECWMF includes additional data, they will be made available in this API.</p>
    <p>For hourly and high-resolution data (up to 1 km) try our <a href="/en/docs">forecast API</a> which combines multiple models.</p>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Weather Model</th>
            <th scope="col">Region</th>
            <th scope="col">Spatial Resolution</th>
            <th scope="col">Temporal Resolution</th>
            <th scope="col">Forecast Length</th>
            <th scope="col">Update frequency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"><a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" target="_blank">IFS</a></th>
            <td>Global</td>
            <td>0.4° (~44 km)</td>
            <td>3-Hourly</td>
            <td>10 days</td>
            <td>Every 6 hours</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 id="api-documentation" class="mt-5">API Documentation</h2>
    <p>The API endpoint <mark>/v1/ecmwf</mark> accepts a geographical coordinate, a list of weather variables and
      responds with a JSON 3-hourly weather forecast for 10 days. Time always starts at 0:00 today.
      All URL parameters are listed below:</p>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Parameter</th>
            <th scope="col">Format</th>
            <th scope="col">Required</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">latitude, longitude</th>
            <td>Floating point</td>
            <td>Yes</td>
            <td></td>
            <td>Geographical WGS84 coordinate of the location</td>
          </tr>
          <tr>
            <th scope="row">elevation</th>
            <td>Floating point</td>
            <td>No</td>
            <td></td>
            <td>The elevation used for statistical downscaling. Per default, a <a href="https://openmeteo.substack.com/p/improving-weather-forecasts-with" title="Elevation based grid-cell selection explained">90 meter digital elevation model is used</a>. You can manually set the elevation to correctly match mountain peaks. 
              If <mark>&elevation=nan</mark> is specified, downscaling will be disabled and the API uses the average grid-cell height.</td>
          </tr>
          <tr>
            <th scope="row">hourly</th>
            <td>String array</td>
            <td>No</td>
            <td></td>
            <td>A list of weather variables which should be returned. Values can be comma separated, or multiple
              <mark>&hourly=</mark> parameter in the URL can be used.
            </td>
          </tr>
          <tr>
            <th scope="row">temperature_unit</th>
            <td>String</td>
            <td>No</td>
            <td><mark>celsius</mark></td>
            <td>If <mark>fahrenheit</mark> is set, all temperature values are converted to Fahrenheit.</td>
          </tr>
          <tr>
            <th scope="row">windspeed_unit</th>
            <td>String</td>
            <td>No</td>
            <td><mark>kmh</mark></td>
            <td>Other wind speed speed units: <mark>ms</mark>, <mark>mph</mark> and <mark>kn</mark></td>
          </tr>
          <tr>
            <th scope="row">precipitation_unit</th>
            <td>String</td>
            <td>No</td>
            <td><mark>mm</mark></td>
            <td>Other precipitation amount units: <mark>inch</mark></td>
          </tr>
          <tr>
            <th scope="row">timeformat</th>
            <td>String</td>
            <td>No</td>
            <td><mark>iso8601</mark></td>
            <td>If format <mark>unixtime</mark> is selected, all time values are returned in UNIX epoch time in seconds.
              Please note that all time is then in GMT+0! For daily values with unix timestamp, please apply
              <mark>utc_offset_seconds</mark> again to get the correct date.
            </td>
          </tr>
          <tr>
            <th scope="row">past_days</th>
            <td>Integer (0-2)</td>
            <td>No</td>
            <td><mark>0</mark></td>
            <td>If <mark>past_days</mark> is set, yesterday or the day before yesterday data are also returned.</td>
          </tr>
          <tr>
            <th scope="row">start_date<br />end_date</th>
            <td>String (yyyy-mm-dd)</td>
            <td>No</td>
            <td></td>
            <td>The time interval to get weather data. A day must be specified as an ISO8601 date (e.g.
              <mark>2022-06-30</mark>).
            </td>
          </tr>
          <tr>
            <th scope="row">cell_selection</th>
            <td>String</td>
            <td>No</td>
            <td><mark>land</mark></td>
            <td>Set a preference how grid-cells are selected. The default <mark>land</mark> finds a suitable grid-cell on land with <a href="https://openmeteo.substack.com/p/improving-weather-forecasts-with" title="Elevation based grid-cell selection explained">similar elevation to the requested coordinates using a 90-meter digital elevation model</a>. 
              <mark>sea</mark> prefers grid-cells on sea. <mark>nearest</mark> selects the nearest possible grid-cell.
            </td>
        </tbody>
      </table>
    </div>
    <p>Additional optional URL parameters will be added. For API stability, no required parameters will be added in the
      future!</p>


    <h3 class="mt-5">Hourly Parameter Definition</h3>
    <p>The parameter <mark>&hourly=</mark> accepts the following values. Most weather variables are given as an
      instantaneous value for the indicated hour. Some variables like precipitation are calculated from the preceding
      hour as and average or sum.</p>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Variable</th>
            <th scope="col">Valid time</th>
            <th scope="col">Unit</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">precipitation</th>
            <td>Preceding hour sum</td>
            <td>mm (inch)</td>
            <td>Total precipitation (rain, showers, snow) sum of the preceding hour</td>
          </tr>
          <tr>
            <th scope="row">snowfall</th>
            <td>Preceding hour sum</td>
            <td>cm (inch)</td>
            <td>Snowfall amount of the preceding hour in centimeters. For the water equivalent in millimeter, divide by
              7. E.g. 7 cm snow = 10 mm precipitation water equivalent. Snowfall amount is not provided by ECMWF directly, instead it is approximated based on total precipitation and temperature</td>
          </tr>
          <tr>
            <th scope="row">runoff</th>
            <td>Preceding hour sum</td>
            <td>mm (inch)</td>
            <td>Execess rain that is not absorbed by the soil</td>
          </tr>
          <tr>
            <th scope="row">weathercode</th>
            <td>Instant</td>
            <td>WMO code</td>
            <td>Weather condition as a numeric code. Follow WMO weather interpretation codes. See table below for
              details. Weather code is calculated from cloud cover analysis, precipitation and snowfall. 
              As ECMWF IFS has barely no information about atmospheric stability, estimation about thunderstorms is not possible.</td>
          </tr>
          <tr>
            <th scope="row">cloudcover</th>
            <td>Instant</td>
            <td>%</td>
            <td>Total cloud cover as an area fraction. Calculated as a weighted function from low, mid and high level clouds.</td>
          </tr>
          <tr>
            <th scope="row">cloudcover_low</th>
            <td>Instant</td>
            <td>%</td>
            <td>Low level clouds and fog up to 3 km altitude. In case of ECMWF IFS it is based on relative humidity on pressure levels 1000, 925 and 850 hPa.</td>
          </tr>
          <tr>
            <th scope="row">cloudcover_mid</th>
            <td>Instant</td>
            <td>%</td>
            <td>Mid level clouds from 3 to 8 km altitude.  In case of ECMWF IFS it is based on relative humidity on pressure levels 700 and 500 hPa.</td>
          </tr>
          <tr>
            <th scope="row">cloudcover_high</th>
            <td>Instant</td>
            <td>%</td>
            <td>High level clouds from 8 km altitude. In case of ECMWF IFS it is based on relative humidity on pressure levels 300, 250 and 200 hPa.</td>
          </tr>
          <tr>
            <th scope="row">pressure_msl<br>surface_air_pressure</th>
            <td>Instant</td>
            <td>hPa</td>
            <td>Atmospheric air pressure reduced to sea level (Mean sea level) and actual pressure at surface level</td>
          </tr>
          <tr>
            <th scope="row">skin_temperature</th>
            <td>Instant</td>
            <td>°C (°F)</td>
            <td>Temperature of the the surface. Depending on the type of surface (e.g. concrete) this temperature can be
              significantly higher then the 2 meter air temperature</td>
          </tr>
          <tr>
            <th scope="row">soil_temperature_0_7cm</th>
            <td>Instant</td>
            <td>°C (°F)</td>
            <td>Average temperature of the first soil level 0-7 cm below ground.</td>
          </tr>
          <tr>
            <th scope="row">total_column_integrated_water_vapour</th>
            <td>Instant</td>
            <td>kg/m²</td>
            <td>Total amount of water in the atmosphere.</td>
          </tr>
          <tr>
            <th scope="row">temperature_2m<br>temperature_1000hPa, ...</th>
            <td>Instant</td>
            <td>°C (°F)</td>
            <td>Air temperature 2 meter above ground. Additional temperature in the atmopshere are given on different
              pressure levels. </td>
          </tr>
          <tr>
            <th scope="row">geopotential_height_1000hPa</th>
            <td>Instant</td>
            <td>meter</td>
            <td>Geopotential height on different atmospheric pressure levels</td>
          </tr>
          <tr>
            <th scope="row">windspeed_10m<br />windspeed_1000hPa, ...</th>
            <td>Instant</td>
            <td>km/h (mph, m/s, knots)</td>
            <td>Wind speed at 10 meters above ground. Wind speed on 10 meters is the standard level. Additional wind
              speeds are given on atmospheric pressure levels.</td>
          </tr>
          <tr>
            <th scope="row">winddirection_10m<br>winddirection_1000hPa, ...</th>
            <td>Instant</td>
            <td>°</td>
            <td>Wind direction at 10 meters above ground and different pressure levels.</td>
          </tr>
          <tr>
            <th scope="row">relative_humidity_1000hPa, ...</th>
            <td>Instant</td>
            <td>%</td>
            <td>Relative humidity at atmospheric pressure levels. Unfortunately, 2 meter relative humidity is unavailable.</td>
          </tr>
          <tr>
            <th scope="row">cloudcover_1000hPa, ...</th>
            <td>Instant</td>
            <td>%</td>
            <td>Cloud cover at the specified pressure level. Cloud cover is approximated based on relative humidity
              using <a
                href="https://www.ecmwf.int/sites/default/files/elibrary/2005/16958-parametrization-cloud-cover.pdf"
                target="_blank">Sundqvist et al. (1989)</a></td>
          </tr>
          <tr>
            <th scope="row">specific_humidity_1000hPa, ...</th>
            <td>Instant</td>
            <td>g/kg</td>
            <td>Specific humidity at different atmospheric pressure levels</td>
          </tr>
          <tr>
            <th scope="row">atmosphere_relative_vorticity_1000hPa, ...</th>
            <td>Instant</td>
            <td>s⁻¹</td>
            <td>Relative vorticity at different atmospheric pressure levels</td>
          </tr>
          <tr>
            <th scope="row">divergence_of_wind, ...</th>
            <td>Instant</td>
            <td>s⁻¹</td>
            <td>Differgence of wind at different atmospheric pressure levels</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="mt-5">JSON Return Object</h3>
    <p>On success a JSON object will be returned.</p>
    <pre>
      <code>
{`
  "latitude": 52.52,
  "longitude": 13.419,
  "generationtime_ms": 2.2119,
  "timezone": "Europe/Berlin",
  "timezone_abbreviation": "CEST",
  "hourly": {
    "time": ["2022-07-01T00:00", "2022-07-01T01:00", "2022-07-01T02:00", ...],
    "temperature_2m": [13, 12.7, 12.7, 12.5, 12.5, 12.8, 13, 12.9, 13.3, ...]
  },
  "hourly_units": {
    "temperature_2m": "°C"
  },
`}
      </code>
    </pre>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Parameter</th>
            <th scope="col">Format</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">latitude, longitude</th>
            <td>Floating point</td>
            <td>WGS84 of the center of the weather grid-cell which was used to generate this forecast. This coordinate might be a few kilometers away from the requested coordinate.</td>
          </tr>
          <tr>
            <th scope="row">generationtime_ms</th>
            <td>Floating point</td>
            <td>Generation time of the weather forecast in milliseconds. This is mainly used for performance monitoring
              and improvements.</td>
          </tr>
          <tr>
            <th scope="row">utc_offset_seconds</th>
            <td>Integer</td>
            <td>Applied timezone offset from the <mark>&timezone=</mark> parameter.</td>
          </tr>
          <tr>
            <th scope="row">timezone<br />timezone_abbreviation</th>
            <td>String</td>
            <td>Timezone identifier (e.g. <mark>Europe/Berlin</mark>) and abbreviation (e.g. <mark>CEST</mark>)</td>
          </tr>
          <tr>
            <th scope="row">hourly</th>
            <td>Object</td>
            <td>For each selected weather variable, data will be returned as a floating point array. Additionally a
              <mark>time</mark> array will be returned with ISO8601 timestamps.
            </td>
          </tr>
          <tr>
            <th scope="row">hourly_units</th>
            <td>Object</td>
            <td>For each selected weather variable, the unit will be listed here.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3 class="mt-5">Errors</h3>
    <p>In case an error occurs, for example a URL parameter is not correctly specified, a JSON error object is returned
      with a HTTP 400 status code.</p>
    <pre>
      <code>
{`
  "error": true,
  "reason": "Cannot initialize WeatherVariable from invalid String value tempeture_2m for key hourly"
`}
      </code>
    </pre>
  </div>

  <div class="col-12 py-5">
    <h2 id="weathervariables">Weather variable documentation</h2>
  </div>

  <div class="col-6">
    <h3>WMO Weather interpretation codes (WW)</h3>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">0</th>
            <td>Clear sky</td>
          </tr>
          <tr>
            <th scope="row">1, 2, 3</th>
            <td>Mainly clear, partly cloudy, and overcast</td>
          </tr>
          <tr>
            <th scope="row">45, 48</th>
            <td>Fog and depositing rime fog</td>
          </tr>
          <tr>
            <th scope="row">51, 53, 55</th>
            <td>Drizzle: Light, moderate, and dense intensity</td>
          </tr>
          <tr>
            <th scope="row">56, 57</th>
            <td>Freezing Drizzle: Light and dense intensity</td>
          </tr>
          <tr>
            <th scope="row">61, 63, 65</th>
            <td>Rain: Slight, moderate and heavy intensity</td>
          </tr>
          <tr>
            <th scope="row">66, 67</th>
            <td>Freezing Rain: Light and heavy intensity</td>
          </tr>
          <tr>
            <th scope="row">71, 73, 75</th>
            <td>Snow fall: Slight, moderate, and heavy intensity</td>
          </tr>
          <tr>
            <th scope="row">77 *</th>
            <td>Snow grains</td>
          </tr>
          <tr>
            <th scope="row">80, 81, 82 *</th>
            <td>Rain showers: Slight, moderate, and violent</td>
          </tr>
          <tr>
            <th scope="row">85, 86 *</th>
            <td>Snow showers slight and heavy</td>
          </tr>
          <tr>
            <th scope="row">95 *</th>
            <td>Thunderstorm: Slight or moderate</td>
          </tr>
          <tr>
            <th scope="row">96, 99 *</th>
            <td>Thunderstorm with slight and heavy hail</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>(*) Showers and thunderstorm forecast not available with ECMWF IFS</p>


  <p>This service is based on data and products of the European Centre for Medium-Range Weather Forecasts (ECMWF). Source
  www.ecmwf.int. ECMWF does not accept any liability whatsoever for any error or omission in the data, their
  availability, or for any loss or damage arising from their use.</p>

</div>
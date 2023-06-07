<svelte:head>
    <title>Elevation API | Open-Meteo.com</title> 
    <link rel="canonical" href="https://open-meteo.com/en/docs/elevation-api" />
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
	import LicenseSelector from '../LicenseSelector.svelte';
  import { api_key_preferences } from "$lib/stores"

  let params = {
    latitude: 52.52, 
    longitude: 13.41
  }
  
  let base = "https://api.open-meteo.com/v1/elevation?"
  $: switch ($api_key_preferences.use) {
    case "commercial":
      base = `https://customer-api.open-meteo.com/v1/elevation?apikey=${$api_key_preferences.apikey}&`
      break
    case "self_hosted":
      base = `${$api_key_preferences.self_host_server}/v1/elevation?`
      break
    default:
      base = "https://api.open-meteo.com/v1/elevation?"
  }
 
  let response = `{"elevation":[38.0]}`
  $: url = `${base}latitude=${params.latitude}&longitude=${params.longitude}`

  async function submitForm() {
      response = await (await fetch(url)).text();
  }

  function getPosition() {
      if (!('geolocation' in navigator)) {
        alert("GPS not available");
        return;
      }
      navigator.geolocation.getCurrentPosition((position) => {
          params.latitude = Number(position.coords.latitude.toFixed(2))
          params.longitude = Number(position.coords.longitude.toFixed(2))
          submitForm()
      }, (error) => {
        alert("An error occurred: " + error.message);
      });
  }

  function selectCity(e: Event) {
      let selected = e.target!.options[e.target!.selectedIndex!];
      params.latitude = selected.dataset.latitude
      params.longitude = selected.dataset.longitude
  }

  onMount(async () => {
  await submitForm()
});
</script>


  <div class="alert alert-primary" role="alert">
    Get more information on how weather forecasts are improved with elevation models in our <a
      href="https://openmeteo.substack.com/p/87a094f1-325d-497a-8a9d-4d16b794fd15" target="_blank">blog article</a>.
  </div>

  <form id="elevation_form" method="get" target="container" action="https://api.open-meteo.com/v1/elevation">
    <div class="row">
      <h2>Select Coordinates or City</h2>
      <div class="col-md-3">
        <div class="form-floating">
          <input type="number" step="0.0001" class="form-control" name="latitude" id="latitude" bind:value={params.latitude}>
          <label for="latitude">Latitude</label>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-floating">
          <input type="number" step="0.0001" class="form-control" name="longitude" id="longitude" bind:value={params.longitude}>
          <label for="longitude">Longitude</label>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group form-floating mb-3">
          <select class="form-select" id="select_city" aria-label="Select city" on:change|preventDefault={selectCity}>
            <optgroup label="Europe">
              <option data-latitude="52.5235" data-longitude="13.4115" selected data-asl="34" value={{longitude: 13.4115, latitude: 52.5235}}>Berlin</option>
              <option data-latitude="48.8567" data-longitude="2.3510" data-asl="34">Paris</option>
              <option data-latitude="51.5002" data-longitude="-0.1262" data-asl="14">London</option>
              <option data-latitude="40.4167" data-longitude="-3.7033" data-asl="588">Madrid</option>
              <option data-latitude="48.2092" data-longitude="16.3728" data-asl="170">Vienna</option>
              <option data-latitude="50.8371" data-longitude="4.3676" data-asl="577">Brussels</option>
              <option data-latitude="55.7558" data-longitude="37.6176" data-asl="125">Moscow</option>
              <option data-latitude="42.7105" data-longitude="23.3238" data-asl="591">Sofia</option>
              <option data-latitude="55.6763" data-longitude="12.5681" data-asl="0">Copenhagen</option>
              <option data-latitude="37.9792" data-longitude="23.7166" data-asl="153">Athens</option>
              <option data-latitude="47.4984" data-longitude="19.0408" data-asl="102">Budapest</option>
              <option data-latitude="64.1353" data-longitude="-21.8952" data-asl="15">Reykjavik</option>
              <option data-latitude="53.3441" data-longitude="-6.2675" data-asl="8">Dublin</option>
              <option data-latitude="41.8955" data-longitude="12.4823" data-asl="14">Rome</option>
              <option data-latitude="52.3738" data-longitude="4.8910" data-asl="-1">Amsterdam</option>
              <option data-latitude="59.9138" data-longitude="10.7387" data-asl="12">Oslo</option>
              <option data-latitude="52.2297" data-longitude="21.0122" data-asl="93">Warsaw</option>
              <option data-latitude="38.7072" data-longitude="-9.1355" data-asl="15">Lisbon</option>
              <option data-latitude="46.9480" data-longitude="7.4481" data-asl="513">Bern</option>
              <option data-latitude="50.4422" data-longitude="30.5367" data-asl="168">Kiev</option>
              <option data-latitude="59.3328" data-longitude="18.0645" data-asl="15">Stockholm</option>
            </optgroup>
            <optgroup label="America">
              <option data-latitude="38.8921" data-longitude="-77.0241" data-asl="2">Washington</option>
              <option data-latitude="40.71" data-longitude="-74.01" data-asl="10">New York</option>
              <option data-latitude="38.5737" data-longitude="-121.4871" data-asl="4">Sacramento</option>
              <option data-latitude="34.05" data-longitude="-118.24" data-asl="89">Los Angeles</option>
              <option data-latitude="41.85" data-longitude="-87.65" data-asl="179">Chicago</option>
              <option data-latitude="29.76" data-longitude="-95.36" data-asl="12">Houston</option>
              <option data-latitude="33.45" data-longitude="-112.07" data-asl="331">Phoenix</option>
              <option data-latitude="39.95" data-longitude="-75.16" data-asl="12">Philadelphia</option>
              <option data-latitude="49.25" data-longitude="-123.12" data-asl="70">Vancouver</option>
              <option data-latitude="45.4235" data-longitude="-75.6979" data-asl="74">Ottawa</option>
              <option data-latitude="-34.6118" data-longitude="-58.4173" data-asl="10">Buenos Aires</option>
              <option data-latitude="-15.7801" data-longitude="-47.9292" data-asl="1079">Brasilia</option>
              <option data-latitude="-33.4691" data-longitude="-70.6420" data-asl="521">Santiago</option>
              <option data-latitude="4.6473" data-longitude="-74.0962" data-asl="2619">Bogota</option>
              <option data-latitude="19.4271" data-longitude="-99.1276" data-asl="2216">Ciudad de Mexico</option>
              <option data-latitude="-25.3005" data-longitude="-57.6362" data-asl="54">Asuncion</option>
              <option data-latitude="-12.0931" data-longitude="-77.0465" data-asl="107">Lima</option>
              <option data-latitude="-34.8941" data-longitude="-56.0675" data-asl="43">Montevideo</option>
            </optgroup>
            <optgroup label="Asia">
              <option data-latitude="34.5155" data-longitude="69.1952" data-asl="1807">Kabul</option>
              <option data-latitude="23.7106" data-longitude="90.3978" data-asl="3">Dhaka</option>
              <option data-latitude="39.9056" data-longitude="116.3958" data-asl="63">Peking</option>
              <option data-latitude="41.7010" data-longitude="44.7930" data-asl="451">Tiflis</option>
              <option data-latitude="28.6353" data-longitude="77.2250" data-asl="201">New Delhi</option>
              <option data-latitude="-6.1862" data-longitude="106.8063" data-asl="3">Jakarta</option>
              <option data-latitude="35.7061" data-longitude="51.4358" data-asl="1138">Teheran</option>
              <option data-latitude="33.3157" data-longitude="44.3922" data-asl="40">Baghdad</option>
              <option data-latitude="31.7857" data-longitude="35.2007" data-asl="580">Jerusalem</option>
              <option data-latitude="35.6785" data-longitude="139.6823" data-asl="17">Tokyo</option>
              <option data-latitude="3.1502" data-longitude="101.7077" data-asl="60">Kuala Lumpur</option>
              <option data-latitude="47.9138" data-longitude="106.9220" data-asl="1284">Ulan Bator</option>
              <option data-latitude="27.7058" data-longitude="85.3157" data-asl="1298">Kathmandu</option>
              <option data-latitude="1.2894" data-longitude="103.8500" data-asl="0">Singapore</option>
              <option data-latitude="37.5139" data-longitude="126.9828" data-asl="33">Seoul</option>
              <option data-latitude="39.9439" data-longitude="32.8560" data-asl="938">Ankara</option>
              <option data-latitude="24.4764" data-longitude="54.3705" data-asl="13">Abu Dhabi</option>
            </optgroup>
            <optgroup label="Africa">
              <option data-latitude="36.7755" data-longitude="3.0597" data-asl="0">Algiers</option>
              <option data-latitude="-8.8159" data-longitude="13.2306" data-asl="6">Luanda</option>
              <option data-latitude="30.0571" data-longitude="31.2272" data-asl="22">Cairo</option>
              <option data-latitude="-1.2762" data-longitude="36.7965" data-asl="1728">Nairobi</option>
              <option data-latitude="32.8830" data-longitude="13.1897" data-asl="6">Tripoli</option>
              <option data-latitude="-22.5749" data-longitude="17.0805" data-asl="1721">Windhoek</option>
              <option data-latitude="-25.7463" data-longitude="28.1876" data-asl="1271">Pretoria</option>
            </optgroup>
            <optgroup label="Oceanic">
              <option data-latitude="-35.2820" data-longitude="149.1286" data-asl="605">Canberra</option>
              <option data-latitude="-41.2865" data-longitude="174.7762" data-asl="20">Wellington</option>
            </optgroup>
          </select>
          <label for="select_city">Select city</label>
          <button class="btn btn-outline-secondary" type="button" id="detect_gps" on:click|preventDefault={getPosition}>Detect GPS Position</button>
        </div>
      </div>
    </div>

    <LicenseSelector></LicenseSelector>

    <div class="col-12 mb-3">
      <button type="submit" class="btn btn-primary" on:click|preventDefault={submitForm}>Preview</button>
    </div>
  </form>

  <div class="col-12 mb-3">
    <div class="form-control" style="height: 50px; width: 100%;">{response}</div>
  </div>

  <div class="col-12">
    <label for="api_url" class="form-label">API URL (<a id="api_url_link" target="_blank" href="{url}">Open in new
        tab</a>)</label>
    <input type="text" class="form-control" id="api_url" readonly value="{url}">
    <div id="emailHelp" class="form-text">You can copy this API URL into your application</div>
  </div>

  <div class="col-12 py-5">
    <h2 id="api-documentation">API Documentation</h2>
    <p>The API endpoint <mark>/v1/elevation</mark> accepts one or multiple geographical coordinate and returns the
      terrain elevation for those points.</p>
    <p>Data is based on the <a href="https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model">Copernicus DEM 2021 release GLO-90</a> with 90 meters resolution. The GLO-90 dataset is
      available worldwide with a free license.</p>
    <p>All URL parameters are listed below:</p>
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
            <th scope="row">latitude<br />longitude</th>
            <td>Floating point array</td>
            <td>Yes</td>
            <td></td>
            <td>
              Geographical WGS84 coordinates of the location.
              Multiple coordinates can be coma <mark>,</mark> separated.
              Up to 100 coordinates can be requested at once.
              Example for <a href="https://api.open-meteo.com/v1/elevation?latitude=52.52,48.85&longitude=13.41,2.35"
                target="_blank">multiple coordinates</a>.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>Additional optional URL parameters will be added. For API stability, no required parameters will be added in the
      future!</p>

    <h3 class="mt-5">JSON Return Object</h3>
    <p>On success a JSON object is returned with just one attribute <mark>elevation</mark>. It is always an array, even
      if only one coordinate is requested.</p>
    <pre>
      <code>
{`
  "elevation": [38.0]
`}
      </code>
    </pre>

    <h3 class="mt-5">Errors</h3>
    <p>In case an error occurs, for example a URL parameter is not correctly specified, a JSON error object is returned
      with a HTTP 400 status code.</p>
    <pre>
      <code>
{`
  "error":true,
  "reason":"Latitude must be in range of -90 to 90°. Given: 522.52."
`}
      </code>
    </pre>
  </div>

  <h2 id="citation">Citation & Acknowledgement</h2>
  <pre>
ESA - EUsers, who, in their research, use the Copernicus DEM, are requested to use the following DOI when citing the data source in their publications: 

https://doi.org/10.5270/ESA-c5d3d65
  </pre>
  <p>All users of Open-Meteo data must provide a clear attribution to the Copernicus program as well as a reference to
    Open-Meteo.</p>



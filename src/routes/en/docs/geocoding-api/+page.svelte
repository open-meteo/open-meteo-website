<script lang="ts">
  let searching = false
  let timeout
  let form
  let results = {"results":[
    {"id":2950159,"name":"Berlin","latitude":52.52437,"longitude":13.41053,"elevation":74.0,"feature_code":"PPLC","country_code":"DE","admin1_id":2950157,"admin3_id":6547383,"admin4_id":6547539,"timezone":"Europe/Berlin","population":3426354,"postcodes":["10967","13347"],"country_id":2921044,"country":"Germany","admin1":"Land Berlin","admin3":"Berlin, Stadt","admin4":"Berlin"},
    {"id":5083330,"name":"Berlin","latitude":44.46867,"longitude":-71.18508,"elevation":311.0,"feature_code":"PPL","country_code":"US","admin1_id":5090174,"admin2_id":5084973,"admin3_id":5083340,"timezone":"America/New_York","population":9367,"postcodes":["03570"],"country_id":6252001,"country":"United States","admin1":"New Hampshire","admin2":"Coos","admin3":"City of Berlin"},
    {"id":4500771,"name":"Berlin","latitude":39.79123,"longitude":-74.92905,"elevation":50.0,"feature_code":"PPL","country_code":"US","admin1_id":5101760,"admin2_id":4501019,"admin3_id":4500776,"timezone":"America/New_York","population":7590,"postcodes":["08009"],"country_id":6252001,"country":"United States","admin1":"New Jersey","admin2":"Camden","admin3":"Borough of Berlin"},
    {"id":5245497,"name":"Berlin","latitude":43.96804,"longitude":-88.94345,"elevation":246.0,"feature_code":"PPL","country_code":"US","admin1_id":5279468,"admin2_id":5255015,"admin3_id":5245510,"timezone":"America/Chicago","population":5420,"postcodes":["54923"],"country_id":6252001,"country":"United States","admin1":"Wisconsin","admin2":"Green Lake","admin3":"City of Berlin"},
    {"id":4348460,"name":"Berlin","latitude":38.32262,"longitude":-75.21769,"elevation":11.0,"feature_code":"PPL","country_code":"US","admin1_id":4361885,"admin2_id":4374180,"timezone":"America/New_York","population":4529,"postcodes":["21811"],"country_id":6252001,"country":"United States","admin1":"Maryland","admin2":"Worcester"},
    {"id":4930431,"name":"Berlin","latitude":42.3812,"longitude":-71.63701,"elevation":100.0,"feature_code":"PPL","country_code":"US","admin1_id":6254926,"admin2_id":4956199,"admin3_id":4930436,"timezone":"America/New_York","population":2422,"postcodes":["01503"],"country_id":6252001,"country":"United States","admin1":"Massachusetts","admin2":"Worcester","admin3":"Town of Berlin"},
    {"id":4556518,"name":"Berlin","latitude":39.92064,"longitude":-78.9578,"elevation":710.0,"feature_code":"PPL","country_code":"US","admin1_id":6254927,"admin2_id":5212857,"admin3_id":4556520,"timezone":"America/New_York","population":2019,"postcodes":["15530"],"country_id":6252001,"country":"United States","admin1":"Pennsylvania","admin2":"Somerset","admin3":"Borough of Berlin"},
    {"id":4557666,"name":"East Berlin","latitude":39.9376,"longitude":-76.97859,"elevation":131.0,"feature_code":"PPL","country_code":"US","admin1_id":6254927,"admin2_id":4556228,"admin3_id":4557667,"timezone":"America/New_York","population":1534,"postcodes":["17316"],"country_id":6252001,"country":"United States","admin1":"Pennsylvania","admin2":"Adams","admin3":"Borough of East Berlin"},
    {"id":5147132,"name":"Berlin","latitude":40.56117,"longitude":-81.7943,"elevation":391.0,"feature_code":"PPL","country_code":"US","admin1_id":5165418,"admin2_id":5157783,"admin3_id":5147154,"timezone":"America/New_York","population":898,"postcodes":["44610"],"country_id":6252001,"country":"United States","admin1":"Ohio","admin2":"Holmes","admin3":"Berlin Township"},
    {"id":1510159,"name":"Berlin","latitude":54.00603,"longitude":61.19308,"elevation":228.0,"feature_code":"PPL","country_code":"RU","admin1_id":1508290,"admin2_id":1489213,"timezone":"Asia/Yekaterinburg","population":613,"postcodes":["457130"],"country_id":2017370,"country":"Russia","admin1":"Chelyabinsk","admin2":"Troitskiy Rayon"}
  ], "generationtime_ms":1.0390282}

  let apiUrl = "https://geocoding-api.open-meteo.com/v1/search?name=Berlin&language=en&count=10&format=json"

  // Called on form submit
  async function submit() {
    searching = true
    if (timeout) {
      clearTimeout(timeout)
    }
    const action = form.action
    const formData = new FormData(form)
    const data = new URLSearchParams()
    for (let field of formData) {
      const [key, value] = field
      data.append(key, value)
    }
    apiUrl = `${action}?${data}`

    results = await fetch(`${apiUrl}&format=json`).then((res) => {
      if (!res.ok) {
        handleError()
        return {}
      }
      return res.json()
    }).catch((e) => handleError())
    searching = false
  }

  // Schedule a form submit in 300 ms
  async function debounceSubmit() {
    searching = true
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(submit, 300)
  }
  
  function handleError() {
    alert('Something went wrong.')
    results = {}
    searching = false
  }
</script>

<svelte:head>
    <title>Geocoding API | Open-Meteo.com</title> 
    <link rel="canonical" href="https://open-meteo.com/en/docs/geocoding-api" />
</svelte:head>


<div class="container px-4 py-0" id="featured-3">
  <form id="geocoding_form" method="get" action="https://geocoding-api.open-meteo.com/v1/search" bind:this={form} on:submit|preventDefault={submit}>
    <div class="row py-3 px-0">
      <h2>Search for cities or postal code</h2>
      <div class="col-md-3">
        <div class="form-floating position-relative">
          <input type="text" class="form-control" name="name" id="name" value="Berlin" on:input={debounceSubmit}>
          <label for="name">Name</label>
          {#if searching}
          <div class="position-absolute top-0 end-0 py-4 px-2">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          {/if}
        </div>
      </div>
      <div class="col-3">
        <div class="form-floating mb-3">
          <select class="form-select" name="language" id="language" aria-label="Language" data-default="en" on:change={submit}>
            <option selected value="en">English</option>
            <option value="de">German</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russion</option>
            <option value="tr">Turkish</option>
            <option value="hi">Hindi</option>
          </select>
          <label for="language">Language</label>
        </div>
      </div>
      <div class="col-3">
        <div class="form-floating mb-3">
          <select class="form-select" name="count" id="count" aria-label="Number of results" data-default="10" on:change={submit}>
            <option value="1">1</option>
            <option selected value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <label for="count">Number of results</label>
        </div>
      </div>
      <div class="col-3">
        <div class="form-floating mb-3">
          <select class="form-select" name="format" id="format" aria-label="Format" data-default="json">
            <option value="json" selected>json</option>
            <option value="protobuf">protobuf</option>
          </select>
          <label for="format">Format</label>
        </div>
      </div>
    </div>
  </form>

  <div class="col-12 table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Elevation</th>
          <th>Population</th>
          <th>Admin1</th>
          <th>Admin2</th>
          <th>Admin3</th>
          <th>Admin4</th>
          <th>Feature code</th>
        </tr>
      </thead>
      <tbody>
        {#if (results.results || []).length == 0 }
          <tr>
            <td colspan=11><strong>No locations found</strong></td>
          </tr>
        {:else}
          {#each results.results as location}
            <tr>
              <td class="p-1"><img height="32" src="/images/country-flags/{(location.country_code||"united_nations").toLowerCase()}.svg" title="{location.country||""}" alt="{location.country||""}"></td>
              <td>{location.name}</td>
              <td>{location.latitude}</td>
              <td>{location.longitude}</td>
              <td>{location.elevation||""}</td>
              <td>{location.population||""}</td>
              <td>{location.admin1||""}</td>
              <td>{location.admin2||""}</td>
              <td>{location.admin3||""}</td>
              <td>{location.admin4||""}</td>
              <td>{location.feature_code||""}</td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>

  <div class="col-12">
    <label for="api_url" class="form-label">API URL (<a id="api_url_link" target="_blank" href="{apiUrl}">Open in new
        tab</a>)</label>
    <input type="text" class="form-control" id="api_url" value="{apiUrl}" readonly>
    <div id="emailHelp" class="form-text">You can copy this API URL into your application</div>
  </div>

  <div class="col-12 py-5">
    <h2 id="api-documentation">API Documentation</h2>
    <p>The API endpoint <mark>https://geocoding-api.open-meteo.com/v1/search</mark> accepts a search term and returns a
      list of matching locations. URL parameters are listed below:</p>
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
            <th scope="row">name</th>
            <td>String</td>
            <td>Yes</td>
            <td></td>
            <td>String to search for. An empty string or only 1 character will return an empty result. 2 characters will
              only match exact matching locations. 3 and more characters will perform fuzzy matching. The search string
              can be a location name or a postal code.</td>
          </tr>
          <tr>
            <th scope="row">count</th>
            <td>Integer</td>
            <td>No</td>
            <td><mark>10</mark></td>
            <td>The number of search results to return. Up to 100 results can be retrieved.</td>
          </tr>
          <tr>
            <th scope="row">format</th>
            <td>String</td>
            <td>No</td>
            <td><mark>json</mark></td>
            <td>By default, results are returned as JSON. Alternatively, <mark>protobuf</mark> is supported for more
              efficient encoding and transfer. The .proto file to decode the protobuf message is available in the <a href="https://github.com/open-meteo/geocoding-api/blob/main/Sources/App/api.proto" target="_blank">geocoding GitHub repository</a>.</td>
          </tr>
          <tr>
            <th scope="row">language</th>
            <td>String</td>
            <td>No</td>
            <td><mark>en</mark></td>
            <td>Return translated results, if available, otherwise return english or the native location name.
              Lower-cased.</td>
          </tr>
          <!--<tr>
              <th scope="row">country_codes</th>
              <td>String array</td>
              <td>No</td>
              <td></td>
              <td>Optionally a comma-separated list of country codes, filters all search results to those countries. Country code must be upper-cased. E.g. <mark>&country_codes=DE,AT,CH</mark> to limit search to Germany, Austria and Switzerland.</td>
            </tr>-->
        </tbody>
      </table>
    </div>
    <p>Additional optional URL parameters will be added. For API stability, no required parameters will be added in the
      future!</p>

    <h3 class="mt-5">JSON Return Object</h3>
    <p>On success a JSON object will be returned. Empty fields are not returned. E.g. <mark>admin4</mark> will be
      missing if no fourth administrative level is available.</p>
    <pre>
      <code>
{`
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
      "admin2_id": 0,
      "admin3_id": 6547383,
      "admin4_id": 6547539,
      "timezone": "Europe/Berlin",
      "population": 3426354,
      "postcodes": [
        "10967",
        "13347"
      ],
      "country_id": 2921044,
      "country": "Deutschland",
      "admin1": "Berlin",
      "admin2": "",
      "admin3": "Berlin, Stadt",
      "admin4": "Berlin"
    },
    {
      ...
    }]
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
            <th scope="row">id</th>
            <td>Integer</td>
            <td>Unique ID for this location</td>
          </tr>
          <tr>
            <th scope="row">name</th>
            <td>String</td>
            <td>Location name. Localized following the <mark>&language=</mark> parameter, if possible</td>
          </tr>
          <tr>
            <th scope="row">latitude, longitude</th>
            <td>Floating point</td>
            <td>Geographical WGS84 coordinates of this location</td>
          </tr>
          <tr>
            <th scope="row">elevation</th>
            <td>Floating point</td>
            <td>Elevation above mean sea level of this location</td>
          </tr>
          <tr>
            <th scope="row">timezone</th>
            <td>String</td>
            <td>Time zone using <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
                target="_blank">time zone database</a> definitions</td>
          </tr>
          <tr>
            <th scope="row">feature_code</th>
            <td>String</td>
            <td>Type of this location. Following the <a href="https://www.geonames.org/export/codes.html"
                target="_new">GeoNames feature_code definition</a></td>
          </tr>
          <tr>
            <th scope="row">country_code</th>
            <td>String</td>
            <td>2-Character FIPS <a href="https://en.wikipedia.org/wiki/List_of_FIPS_country_codes"
                target="_new">country code</a>. E.g. <mark>DE</mark> for Germany</td>
          </tr>
          <tr>
            <th scope="row">country</th>
            <td>String</td>
            <td>Country name. Localized following the <mark>&language=</mark> parameter, if possible</td>
          </tr>
          <tr>
            <th scope="row">country_id</th>
            <td>Integer</td>
            <td>Unique ID for this country</td>
          </tr>
          <tr>
            <th scope="row">population</th>
            <td>Integer</td>
            <td>Number of inhabitants</td>
          </tr>
          <tr>
            <th scope="row">postcodes</th>
            <td>String array</td>
            <td>List of postcodes for this location</td>
          </tr>
          <tr>
            <th scope="row">admin1, admin2, admin3, admin4</th>
            <td>String</td>
            <td>Name of hierarchical administrative areas this location resides in. Admin1 is the first administrative
              level. Admin2 the second administrative level. Localized following the <mark>&language=</mark> parameter,
              if possible</td>
          </tr>
          <tr>
            <th scope="row">admin1_id, admin2_id, admin3_id, admin4_id</th>
            <td>Integer</td>
            <td>Unique IDs for the administrative areas</td>
          </tr>
        </tbody>
      </table>
    </div>

    *Note: All IDs can be can be resolved via the API endpoint <a
      href="https://geocoding-api.open-meteo.com/v1/get?id=2950159"
      target="_new">https://geocoding-api.open-meteo.com/v1/get?id=2950159</a>

    <h3 class="mt-5">Errors</h3>
    <p>In case an error occurs, for example a URL parameter is not correctly specified, a JSON error object is returned
      with a HTTP 400 status code.</p>
    <pre>
      <code>
{`
  "error": true,
  "reason": "Parameter count must be between 1 and 100."
`}
      </code>
    </pre>
  </div>


  <div class="col-6">
    <h3>Attribution</h3>
    <ul>
      <li>Location data based on <a href="https://www.geonames.org" target="_new">GeoNames</a></li>
      <li>Country flags from <a href="https://github.com/HatScripts/circle-flags"
          target="_new">HatScripts/circle-flags</a></li>
    </ul>
  </div>

</div>

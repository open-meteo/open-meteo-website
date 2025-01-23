<script lang="ts">
	import { onMount } from 'svelte';

	import { i18n } from '$lib/i18n';

	import { urlHashStore } from '$lib/utils/url-hash-store';
	import { api_key_preferences } from '$lib/stores/settings';
	import type { GeoLocation } from '$lib/stores/settings';

	import LicenseSelector from '$lib/components/license/license-selector.svelte';
	import LocationSearch from '$lib/components/location/location-search.svelte';

	import Plus from 'lucide-svelte/icons/plus';
	import Trash from 'lucide-svelte/icons/trash-2';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41]
	});

	function locationCallback(event: CustomEvent<GeoLocation>, index: number) {
		const latitude = Number(event.detail.latitude.toFixed(4));
		const longitude = Number(event.detail.longitude.toFixed(4));
		$params.latitude = $params.latitude.toSpliced(index, 1, latitude);
		$params.longitude = $params.longitude.toSpliced(index, 1, longitude);
	}

	function addLocation() {
		$params.latitude = [...$params.latitude, NaN];
		$params.longitude = [...$params.longitude, NaN];
	}

	function removeLocation(index: number) {
		$params.latitude = $params.latitude.toSpliced(index, 1);
		$params.longitude = $params.longitude.toSpliced(index, 1);
	}

	let base = $state('https://api.open-meteo.com/v1/elevation?');

	$effect(() => {
		switch ($api_key_preferences.use) {
			case 'commercial':
				base = `https://customer-api.open-meteo.com/v1/elevation?apikey=${$api_key_preferences.apikey}&`;
				break;
			case 'self_hosted':
				base = `${$api_key_preferences.self_host_server}/v1/elevation?`;
				break;
			default:
				base = 'https://api.open-meteo.com/v1/elevation?';
		}
	});

	let response = $state(`{"elevation":[38.0]}`);
	let url = $derived(`${base}latitude=${$params.latitude}&longitude=${$params.longitude}`);

	async function submitForm() {
		response = await (await fetch(url)).text();
	}

	onMount(async () => {
		await submitForm();
	});
</script>

<svelte:head>
	<title>Elevation API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/elevation-api" />
	<meta
		name="description"
		content="Get detailed elevation information for any set of coordinates using our digital elevation model. With impressive resolution up to 90 meters, gain valuable insights into terrain and elevation variations for different geographic points. Enhance your understanding and analysis of topography with our reliable elevation data."
	/>
</svelte:head>

<div class="alert alert-primary" role="alert">
	Get more information on how weather forecasts are improved with elevation models in our <a
		href="https://openmeteo.substack.com/p/87a094f1-325d-497a-8a9d-4d16b794fd15"
		target="_blank">blog article</a
	>.
</div>

<form
	id="elevation_form"
	method="get"
	target="container"
	action="https://api.open-meteo.com/v1/elevation"
>
	<div class="row">
		<h2>Select Coordinates or City</h2>
		{#each $params.latitude as _, index}
			<div class=" ">
				<div class="  mb-3">
					<input
						type="number"
						class="form-control"
						name="latitude"
						id="latitude"
						step="0.000001"
						min="-90"
						max="90"
						bind:value={$params.latitude[index]}
					/>
					<label for="latitude">Latitude</label>
				</div>
			</div>
			<div class=" ">
				<div class="  mb-3">
					<input
						type="number"
						class="form-control"
						name="longitude"
						id="longitude"
						step="0.000001"
						min="-180"
						max="180"
						bind:value={$params.longitude[index]}
					/>
					<label for="longitude">Longitude</label>
				</div>
			</div>
			<div class="col-md-5">
				<LocationSearch on:location={(event) => locationCallback(event, index)} />
			</div>
			{#if index == 0}
				<div class="col-md-1">
					<button
						type="button"
						class="btn btn-outline-secondary w-100 p-3"
						onclick={addLocation}
						title="Add coordinates"><Plus /></button
					>
				</div>
			{:else}
				<div class="col-md-1">
					<button
						type="button"
						class="btn btn-outline-secondary w-100 p-3"
						onclick={() => removeLocation(index)}
						title="Delete coordinates"><Trash /></button
					>
				</div>
			{/if}
		{/each}
	</div>

	<LicenseSelector />

	<div class="col-12 mb-3">
		<button
			type="submit"
			class="btn btn-primary"
			onclick={(e) => {
				e.preventDefault();
				submitForm();
			}}>Preview</button
		>
	</div>
</form>

<div class="col-12 mb-3">
	<div class="form-control" style="height: 50px; width: 100%;">{response}</div>
</div>

<div class="col-12">
	<label for="api_url" class="form-label"
		>API URL (<a id="api_url_link" target="_blank" href={url}>Open in new tab</a>)</label
	>
	<input type="text" class="form-control" id="api_url" readonly value={url} />
	<div id="emailHelp" class="form-text">You can copy this API URL into your application</div>
</div>

<div class="col-12 py-5">
	<h2 id="api-documentation">API Documentation</h2>
	<p>
		The API endpoint <mark>/v1/elevation</mark> accepts one or multiple geographical coordinate and returns
		the terrain elevation for those points.
	</p>
	<p>
		Data is based on the <a
			href="https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model"
			>Copernicus DEM 2021 release GLO-90</a
		> with 90 meters resolution. The GLO-90 dataset is available worldwide with a free license.
	</p>
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
						Geographical WGS84 coordinates of the location. Multiple coordinates can be comma <mark
							>,</mark
						>
						separated. Up to 100 coordinates can be requested at once. Example for
						<a
							href="https://api.open-meteo.com/v1/elevation?latitude=52.52,48.85&longitude=13.41,2.35"
							target="_blank">multiple coordinates</a
						>.
					</td>
				</tr>
				<tr>
					<th scope="row">apikey</th>
					<td>String</td>
					<td>No</td>
					<td></td>
					<td
						>Only required to commercial use to access reserved API resources for customers. The
						server URL requires the prefix <mark>customer-</mark>. See
						<a href={'/en/pricing'} title="Pricing information to use the weather API commercially"
							>pricing</a
						> for more information.</td
					>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		Additional optional URL parameters will be added. For API stability, no required parameters will
		be added in the future!
	</p>

	<h3 class="mt-5">JSON Return Object</h3>
	<p>
		On success a JSON object is returned with just one attribute <mark>elevation</mark>. It is
		always an array, even if only one coordinate is requested.
	</p>
	<pre>
      <code>
{`
  "elevation": [38.0]
`}
      </code>
    </pre>

	<h3 class="mt-5">Errors</h3>
	<p>
		In case an error occurs, for example a URL parameter is not correctly specified, a JSON error
		object is returned with a HTTP 400 status code.
	</p>
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
<p>
	All users of Open-Meteo data must provide a clear attribution to the Copernicus program as well as
	a reference to Open-Meteo.
</p>

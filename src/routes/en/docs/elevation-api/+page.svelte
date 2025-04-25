<script lang="ts">
	import { onMount } from 'svelte';

	import { fade, slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';
	import { api_key_preferences } from '$lib/stores/settings';
	import type { GeoLocation } from '$lib/stores/settings';

	import LicenseSelector from '$lib/components/license/license-selector.svelte';
	import LocationSearch from '$lib/components/location/location-search.svelte';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	import * as Select from '$lib/components/ui/select/index';

	import * as Alert from '$lib/components/ui/alert';

	import ElevationError from '$lib/components/code/docs/elevation-error.svx';
	import ElevationObject from '$lib/components/code/docs/elevation-object.svx';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41]
	});

	function locationCallback(event: CustomEvent<GeoLocation>, index: number) {
		const latitude = Number(event.detail.latitude.toFixed(4));
		const longitude = Number(event.detail.longitude.toFixed(4));
		$params.latitude = $params.latitude.toSpliced(index, 1, latitude);
		$params.longitude = $params.longitude.toSpliced(index, 1, longitude);
		submitForm();
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

<Alert.Root class="border-border mb-4">
	<Alert.Description>
		Get more information on how weather forecasts are improved with elevation models in our <a
			class="text-link underline"
			href="https://openmeteo.substack.com/p/87a094f1-325d-497a-8a9d-4d16b794fd15"
			target="_blank">blog article</a
		>.
	</Alert.Description>
</Alert.Root>

<form
	id="elevation_form"
	method="get"
	target="container"
	action="https://api.open-meteo.com/v1/elevation"
	onchange={() => submitForm()}
>
	<div>
		<h2 id="elevation_search" class="text-2xl md:text-3xl">Select Coordinates or City</h2>
		<div class="mt-3">
			{#each $params.latitude as _, index}
				<div
					transition:slide
					class="grid gap-3 duration-300 sm:grid-cols-2 md:gap-6 md:gap-y-3 xl:grid-cols-4 {index <
					$params.latitude.length - 1
						? 'pb-6'
						: ''}"
				>
					<div
						class="relative flex flex-col gap-2 duration-200 {$params.latitude[index] < -90 ||
						$params.latitude[index] > 90
							? 'pb-6'
							: ''}"
					>
						<!-- class:is-invalid={params.latitude[index] < -90 || params.latitude[index] > 90}-->
						<Input
							type="number"
							class="h-12 pt-6"
							name="latitude"
							id="latitude"
							step="0.000001"
							min="-90"
							max="90"
							bind:value={$params.latitude[index]}
						/>
						<Label
							class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
							for="latitude">Latitude</Label
						>
						{#if $params.latitude[index] < -90 || $params.latitude[index] > 90}
							<div class="absolute left-3 top-14 text-sm duration-300" transition:slide>
								Latitude must be between -90 and 90
							</div>
						{/if}
					</div>
					<div
						class="relative flex flex-col gap-2 duration-200 {$params.longitude[index] < -180 ||
						$params.longitude[index] > 180
							? 'pb-6'
							: ''}"
					>
						<!-- class:is-invalid={params.longitude[index] < -180 || params.longitude[index] > 180}-->
						<Input
							type="number"
							class="h-12 pt-6"
							name="longitude"
							id="longitude"
							step="0.000001"
							min="-180"
							max="180"
							bind:value={$params.longitude[index]}
						/>
						<Label
							class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
							for="longitude">Longitude</Label
						>
						{#if $params.longitude[index] < -180 || $params.longitude[index] > 180}
							<div class="absolute left-3 top-14 text-sm" transition:slide>
								Longitude must be between -180 and 180
							</div>
						{/if}
					</div>

					<div class="flex gap-3 md:gap-6">
						<div class="md:w-2/3">
							<LocationSearch
								on:location={(event) => locationCallback(event, index)}
								label="Search"
							/>
						</div>

						<div class="md:w-1/3">
							{#if index == 0}
								<Button
									variant="outline"
									class="h-12 w-full px-5 pr-6"
									onclick={addLocation}
									title="Add coordinates"
									><svg
										class="lucide lucide-plus"
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M5 12h14" />
										<path d="M12 5v14" />
									</svg></Button
								>
							{:else}
								<Button
									variant="outline"
									class="h-12 w-full px-5 pr-6"
									onclick={() => removeLocation(index)}
									title="Delete coordinates"
									><svg
										class="lucide lucide-trash-2"
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M3 6h18" />
										<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
										<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
										<line x1="10" x2="10" y1="11" y2="17" />
										<line x1="14" x2="14" y1="11" y2="17" />
									</svg></Button
								>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6">
		<LicenseSelector />
	</div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<h2 id="results" class="mb-6 text-2xl md:text-3xl">Preview and API URL</h2>

	<div class="border-border mb-3 w-full rounded-md border px-2 py-3">{response}</div>

	<div>
		API URL
		<small class="text-muted-foreground"
			>(<a
				id="api_url_link"
				target="_blank"
				class="text-link underline underline-offset-2"
				href={url}>Open in new tab</a
			>)</small
		>
	</div>
	<Input
		class="mt-2"
		type="text"
		id="api_url"
		readonly
		aria-label="Copy to clipboard"
		value={url}
	/>
	<div class="text-muted-foreground mt-1">You can copy this API URL into your application</div>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2>
	<div class="mt-2 md:mt-4">
		<p>
			The API endpoint <mark>/v1/elevation</mark> accepts one or multiple geographical coordinate and
			returns the terrain elevation for those points.
		</p>
		<p>
			Data is based on the <a
				href="https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model"
				>Copernicus DEM 2021 release GLO-90</a
			> with 90 meters resolution. The GLO-90 dataset is available worldwide with a free license.
		</p>
		<p>All URL parameters are listed below:</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1140px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
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
							<a
								href={'/en/pricing'}
								title="Pricing information to use the weather API commercially">pricing</a
							> for more information.</td
						>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<p class="text-muted-foreground">
		Additional optional URL parameters will be added. For API stability, no required parameters will
		be added in the future!
	</p>
</div>

<!-- API DOCS - JSON -->
<div class="mt-6 md:mt-12">
	<h3 id="json_return_object" class="text-xl md:text-2xl">JSON Return Object</h3>
	<div class="mt-2 md:mt-4">
		<p>
			On success a JSON object is returned with just one attribute <mark>elevation</mark>. It is
			always an array, even if only one coordinate is requested.
		</p>
		<div
			class="mt-2 md:mt-4 bg-[#FAFAFA] rounded-lg dark:bg-[#212121] overflow-auto -mx-6 md:ml-0 lg:mx-0"
		>
			<ElevationObject />
		</div>
	</div>
</div>

<!-- API DOCS - ERRORS -->
<div class="mt-6 md:mt-12">
	<h3 id="errors" class="text-xl md:text-2xl">Errors</h3>
	<div class="mt-2 md:mt-4">
		<p>
			In case an error occurs, for example a URL parameter is not correctly specified, a JSON error
			object is returned with a HTTP 400 status code.
		</p>
		<div
			class="mt-2 md:mt-4 bg-[#FAFAFA] rounded-lg dark:bg-[#212121] overflow-auto -mx-6 md:ml-0 lg:mx-0"
		>
			<ElevationError />
		</div>
	</div>
</div>

<!-- CITATION -->
<div class="mt-6 md:mt-12">
	<h2 id="citation" class="text-xl md:text-2xl">Citation & Acknowledgement</h2>
	<div
		class="mt-2 md:mt-4 bg-[#FAFAFA] rounded-lg dark:bg-[#212121] overflow-auto -mx-6 md:ml-0 lg:mx-0"
	>
		<pre class="overflow-auto rounded-lg p-6">
ESA - EUsers, who, in their research, use the Copernicus DEM, are requested to use the following DOI when citing the data source in their publications:

https://doi.org/10.5270/ESA-c5d3d65
		</pre>
	</div>
	<p class="mt-3">
		All users of Open-Meteo data must provide a clear attribution to the Copernicus program as well
		as a reference to Open-Meteo.
	</p>
</div>

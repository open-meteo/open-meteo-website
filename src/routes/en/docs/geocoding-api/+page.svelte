<script lang="ts">
	import { onDestroy } from 'svelte';

	import { fade } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';
	import { api_key_preferences } from '$lib/stores/settings';

	import LicenseSelector from '$lib/components/license/license-selector.svelte';

	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select/index';

	import GeocodingError from '$lib/components/code/docs/geocoding-error.svx';
	import GeocodingObject from '$lib/components/code/docs/geocoding-object.svx';

	import { countOptions, formatOptions, countryCodes, languageOptions } from './options';

	const params = urlHashStore({
		name: 'Berlin',
		count: '10',
		language: 'en',
		format: 'json',
		countryCode: ''
	});

	//const params = { name: 'Berlin', count: '10', language: 'en', format: 'json' };
	let action = $state('https://geocoding-api.open-meteo.com/v1/search?');
	$effect(() => {
		switch ($api_key_preferences.use) {
			case 'commercial':
				action = `https://customer-geocoding-api.open-meteo.com/v1/search?apikey=${$api_key_preferences.apikey}&`;
				break;
			case 'self_hosted':
				action = `${$api_key_preferences.self_host_server}/v1/search?`;
				break;
			default:
				action = 'https://geocoding-api.open-meteo.com/v1/search?';
		}
	});

	//const paramsDefault = { ...params };
	let apiUrl = $state('');
	$effect(() => {
		let urlParams = JSON.parse(JSON.stringify($params));
		if (!urlParams.countryCode) {
			delete urlParams.countryCode;
		}
		apiUrl = `${action}${new URLSearchParams(urlParams)}`;
	});

	let debounceTimeout: number | undefined = undefined;

	onDestroy(() => {
		clearInterval(debounceTimeout);
	});

	// Fetch is automatically called after `params` changes due to reactive assignment
	let results = $derived(
		(async () => {
			let urlParams = JSON.parse(JSON.stringify($params));
			if (!urlParams.countryCode) {
				delete urlParams.countryCode;
			}

			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}
			await new Promise((resolve) => {
				debounceTimeout = setTimeout(resolve, 300);
			});

			// Always set format=json to fetch data
			const fetchUrl = `${action}${new URLSearchParams({ ...urlParams, format: 'json' })}`;
			const result = await fetch(fetchUrl);

			if (!result.ok) {
				throw new Error(await result.text());
			}

			return await result.json();
		})()
	);

	const count = $derived(countOptions.find((co) => co.value == $params.count));

	const format = $derived(formatOptions.find((fo) => fo.value == $params.format));

	const language = $derived(languageOptions.find((lo) => lo.value == $params.language));

	const countryCode = $derived(countryCodes.find((cc) => cc.value == $params.countryCode));
</script>

<svelte:head>
	<title>Geocoding API | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/geocoding-api" />
</svelte:head>

<form
	id="geocoding_form"
	method="get"
	action="https://geocoding-api.open-meteo.com/v1/search"
	onsubmit={(e) => {
		e.preventDefault();
	}}
>
	<h2 id="geocoding_search" class="text-2xl md:text-3xl">Search for cities or postal code</h2>
	<div class="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 md:mt-4 lg:grid-cols-5">
		<div class="relative">
			<Input type="text" class="h-12 pt-6" name="name" id="name" bind:value={$params.name} />
			<Label
				class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
				for="name">Name</Label
			>
		</div>

		<div class="relative">
			<Select.Root name="forecast_days" type="single" bind:value={$params.language}>
				<Select.Trigger aria-label="Language" class="h-12 cursor-pointer pt-6 [&_svg]:mb-3"
					>{language?.label}</Select.Trigger
				>
				<Select.Content preventScroll={false} class="border-border">
					{#each languageOptions as lo}
						<Select.Item class="cursor-pointer" value={lo.value}>{lo.label}</Select.Item>
					{/each}
				</Select.Content>
				<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
					>Language</Label
				>
			</Select.Root>
		</div>

		<div class="relative">
			<Select.Root name="forecast_days" type="single" bind:value={$params.count}>
				<Select.Trigger aria-label="Language" class="h-12 cursor-pointer pt-6 [&_svg]:mb-3"
					>{count?.label}</Select.Trigger
				>
				<Select.Content preventScroll={false} class="border-border">
					{#each countOptions as co}
						<Select.Item class="cursor-pointer" value={co.value}>{co.label}</Select.Item>
					{/each}
				</Select.Content>
				<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
					>Number of Results</Label
				>
			</Select.Root>
		</div>

		<div class="relative">
			<Select.Root name="format" type="single" bind:value={$params.format}>
				<Select.Trigger aria-label="Language" class="h-12 cursor-pointer pt-6 [&_svg]:mb-3"
					>{format?.label}</Select.Trigger
				>
				<Select.Content preventScroll={false} class="border-border">
					{#each formatOptions as fo}
						<Select.Item class="cursor-pointer" value={fo.value}>{fo.label}</Select.Item>
					{/each}
				</Select.Content>
				<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
					>Format</Label
				>
			</Select.Root>
		</div>

		<div class="relative">
			<Select.Root name="format" type="single" bind:value={$params.countryCode}>
				<Select.Trigger aria-label="Language" class="h-12 cursor-pointer pt-6 [&_svg]:mb-3"
					>{countryCode?.label}</Select.Trigger
				>
				<Select.Content preventScroll={false} class="border-border">
					{#each countryCodes as cc}
						<Select.Item class="cursor-pointer" value={cc.value}>{cc.label}</Select.Item>
					{/each}
				</Select.Content>
				<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
					>Country Code</Label
				>
			</Select.Root>
		</div>
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6">
		<LicenseSelector />
	</div>
</form>

<!-- RESULT -->
<div class="mt-6 md:mt-12">
	<h2 id="results" class="mb-2 text-2xl md:text-3xl">Preview and API URL</h2>

	<div class="relative min-h-[580px]">
		{#await results}
			<div
				class="bg-accent/25 border border-border rounded-lg absolute top-0 z-30 flex h-full w-full items-center justify-center"
				in:fade={{ duration: 200, delay: 300 }}
				out:fade={{ duration: 100 }}
			>
				<svg
					class="lucide lucide-loader-circle animate-spin"
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M21 12a9 9 0 1 1-6.219-8.56" />
				</svg>
				<span class="hidden">Loading...</span>
			</div>
		{:then results}
			<div transition:fade={{ duration: 200 }} class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
				<table
					class="w-full mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1140px] caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
				>
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
						{#if results.results && results.results.length > 0}
							{#each results.results as location}
								<tr>
									<td class="min-w-[40px] p-1"
										><img
											height="32"
											width="32"
											src="/images/country-flags/{(
												location.country_code || 'united_nations'
											).toLowerCase()}.svg"
											title={location.country || ''}
											alt={location.country || ''}
										/></td
									>
									<td>{location.name}</td>
									<td>{location.latitude}</td>
									<td>{location.longitude}</td>
									<td>{location.elevation || ''}</td>
									<td>{location.population || ''}</td>
									<td>{location.admin1 || ''}</td>
									<td>{location.admin2 || ''}</td>
									<td>{location.admin3 || ''}</td>
									<td>{location.admin4 || ''}</td>
									<td>{location.feature_code || ''}</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
				{#if (results.results || []).length == 0}
					<div class="flex justify-center items-center mt-3 text-center">
						<strong>No locations found</strong>
					</div>
				{/if}
			</div>
		{:catch error}
			<div class="alert alert-danger" role="alert">
				{error.message}
			</div>
		{/await}
	</div>

	<div>
		API URL
		<small class="text-muted-foreground"
			>(<a
				id="api_url_link"
				target="_blank"
				class="text-link underline underline-offset-2"
				href={apiUrl}>Open in new tab</a
			>)</small
		>
	</div>
	<Input
		class="mt-2"
		type="text"
		id="api_url"
		readonly
		aria-label="Copy to clipboard"
		value={apiUrl}
	/>
	<div class="text-muted-foreground mt-1">You can copy this API URL into your application</div>
</div>

<!-- API DOCS -->
<div class="mt-6 md:mt-12">
	<h2 id="api_documentation" class="text-2xl md:text-3xl">API Documentation</h2>
	<div class="mt-2 md:mt-4">
		<p>
			The API endpoint <mark>https://geocoding-api.open-meteo.com/v1/search</mark> accepts a search term
			and returns a list of matching locations. URL parameters are listed below:
		</p>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[940px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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
						<th scope="row">name</th>
						<td>String</td>
						<td>Yes</td>
						<td></td>
						<td
							>String to search for. An empty string or only 1 character will return an empty
							result. 2 characters will only match exact matching locations. 3 and more characters
							will perform fuzzy matching. The search string can be a location name or a postal
							code.</td
						>
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
						<td
							>By default, results are returned as JSON. Alternatively, <mark>protobuf</mark> is
							supported for more efficient encoding and transfer. The .proto file to decode the
							protobuf message is available in the
							<a
								href="https://github.com/open-meteo/geocoding-api/blob/main/Sources/App/api.proto"
								target="_blank">geocoding GitHub repository</a
							>.</td
						>
					</tr>
					<tr>
						<th scope="row">language</th>
						<td>String</td>
						<td>No</td>
						<td><mark>en</mark></td>
						<td
							>Return translated results, if available, otherwise return english or the native
							location name. Lower-cased.</td
						>
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
					<tr>
						<th scope="row">countryCode</th>
						<td>String</td>
						<td>No</td>
						<td></td>
						<td
							><mark>ISO-3166-1 alpha2</mark>
							<a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2" target="_blank"
								>country code</a
							>, which the results will be filtered for.</td
						></tr
					>
				</tbody>
			</table>
		</div>
	</div>
	<p class="text-muted-foreground mt-2">
		Additional optional URL parameters will be added. For API stability, no required parameters will
		be added in the future!
	</p>
</div>

<!-- API DOCS - JSON -->
<div class="mt-6 md:mt-12">
	<h3 id="json_return_object" class="text-xl md:text-2xl">JSON Return Object</h3>
	<div class="mt-2 md:mt-4">
		<p>
			On success a JSON object will be returned. Empty fields are not returned. E.g. <mark
				>admin4</mark
			> will be missing if no fourth administrative level is available.
		</p>
		<div
			class="code-numbered overflow-auto bg-[#FAFAFA] rounded-lg dark:bg-[#212121] -mx-6 md:ml-0 lg:mx-0 mt-2 md:mt-4"
		>
			<GeocodingObject />
		</div>
		<div class="overflow-auto -mx-6 md:ml-0 lg:mx-0">
			<table
				class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[940px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
			>
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
						<td
							>Location name. Localized following the <mark>&language=</mark> parameter, if possible</td
						>
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
						<td
							>Time zone using <a
								href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
								target="_blank">time zone database</a
							> definitions</td
						>
					</tr>
					<tr>
						<th scope="row">feature_code</th>
						<td>String</td>
						<td
							>Type of this location. Following the <a
								href="https://www.geonames.org/export/codes.html"
								target="_new">GeoNames feature_code definition</a
							></td
						>
					</tr>
					<tr>
						<th scope="row">country_code</th>
						<td>String</td>
						<td
							>2-Character <mark>ISO-3166-1 alpha2</mark>
							<a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2" target="_blank"
								>country code</a
							>. E.g. <mark>DE</mark> for Germany</td
						>
					</tr>
					<tr>
						<th scope="row">country</th>
						<td>String</td>
						<td
							>Country name. Localized following the <mark>&language=</mark> parameter, if possible</td
						>
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
						<td
							>Name of hierarchical administrative areas this location resides in. Admin1 is the
							first administrative level. Admin2 the second administrative level. Localized
							following the <mark>&language=</mark> parameter, if possible</td
						>
					</tr>
					<tr>
						<th scope="row">admin1_id, admin2_id, admin3_id, admin4_id</th>
						<td>Integer</td>
						<td>Unique IDs for the administrative areas</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="text-muted-foreground mt-2">
			*Note: All IDs can be can be resolved via the API endpoint
			<a
				class="text-link underline"
				href="https://geocoding-api.open-meteo.com/v1/get?id=2950159"
				target="_new">https://geocoding-api.open-meteo.com/v1/get?id=2950159</a
			>
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
			<GeocodingError />
		</div>
	</div>
</div>

<!-- ATTRIBUTION -->
<div class="mt-6 md:mt-12">
	<h3 id="attribution" class="text-xl md:text-2xl">Attribution</h3>
	<div class="mt-2 md:mt-4">
		<ul class="ml-6 list-disc">
			<li>
				Location data based on <a
					class="text-link underline"
					href="https://www.geonames.org"
					target="_new">GeoNames</a
				>
			</li>
			<li>
				Country flags from <a
					class="text-link underline"
					href="https://github.com/HatScripts/circle-flags"
					target="_new">HatScripts/circle-flags</a
				>
			</li>
		</ul>
	</div>
</div>

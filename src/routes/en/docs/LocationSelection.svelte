<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import type { GeoLocation } from '$lib/stores';

	import LocationSearch from './LocationSearch.svelte';

	import GeoAltFill from 'svelte-bootstrap-icons/lib/GeoAltFill.svelte';
	import List from 'svelte-bootstrap-icons/lib/List.svelte';
	import PlusLg from 'svelte-bootstrap-icons/lib/PlusLg.svelte';
	import Trash from 'svelte-bootstrap-icons/lib/Trash.svelte';

	interface Props {
		latitude: number[];
		longitude: number[];
		timezone?: string;
		location_mode?: string;
		csv_coordinates?: string;
	}

	let {
		latitude = $bindable(),
		longitude = $bindable(),
		timezone = $bindable('UTC'),
		location_mode = $bindable('location_search'),
		csv_coordinates = $bindable('')
	}: Props = $props();

	function locationCallback(event: CustomEvent<GeoLocation>, index: number) {
		const lat = Number(event.detail.latitude.toFixed(4));
		const lon = Number(event.detail.longitude.toFixed(4));
		latitude = latitude.toSpliced(index, 1, lat);
		longitude = longitude.toSpliced(index, 1, lon);
	}
	function addLocation() {
		latitude = [...latitude, NaN];
		longitude = [...longitude, NaN];
	}
	function removeLocation(index: number) {
		latitude = latitude.toSpliced(index, 1);
		longitude = longitude.toSpliced(index, 1);
	}
</script>

<h2>Location and Time</h2>
<div>
	<ul class="nav nav-underline" id="pills-tab" role="tablist">
		<li class="nav-item" role="presentation" style="width: 70px;">
			<span class="nav-link disabled" aria-disabled="true">Location:</span>
		</li>
		<li class="nav-item" role="presentation">
			<button
				class="nav-link"
				class:active={location_mode == 'location_search'}
				id="pills-location_search-tab"
				type="button"
				role="tab"
				aria-controls="pills-location_search"
				aria-selected="true"
				onclick={() => (location_mode = 'location_search')}><GeoAltFill /> Coordinates</button
			>
		</li>
		<li class="nav-item" role="presentation">
			<button
				class="nav-link"
				class:active={location_mode == 'csv_coordinates'}
				id="pills-csv_coordinates-tab"
				type="button"
				role="tab"
				aria-controls="pills-csv_coordinates"
				onclick={() => (location_mode = 'csv_coordinates')}
				aria-selected="true"><List /> List</button
			>
		</li>
	</ul>
</div>
<div class="tab-content py-3" id="pills-tabContent">
	{#if location_mode == 'location_search'}
		<div
			class="tab-pane active"
			in:fade
			id="pills-location_search"
			role="tabpanel"
			aria-labelledby="pills-location_search-tab"
			tabindex="0"
		>
			{#each latitude as _, index}
				<div class="row">
					<div class="col-md-3">
						<div class="form-floating mb-3">
							<input
								type="number"
								class="form-control"
								class:is-invalid={latitude[index] < -90 || latitude[index] > 90}
								name="latitude"
								id="latitude"
								step="0.000001"
								min="-90"
								max="90"
								bind:value={latitude[index]}
							/>
							<label for="latitude">Latitude</label>
							{#if latitude[index] < -90 || latitude[index] > 90}
								<div class="invalid-tooltip" transition:slide>
									Latitude must be between -90 and 90
								</div>
							{/if}
						</div>
					</div>
					<div class="col-md-3">
						<div class="form-floating mb-3">
							<input
								type="number"
								class="form-control"
								class:is-invalid={longitude[index] < -180 || longitude[index] > 180}
								name="longitude"
								id="longitude"
								step="0.000001"
								min="-180"
								max="180"
								bind:value={longitude[index]}
							/>
							<label for="longitude">Longitude</label>
							{#if longitude[index] < -180 || longitude[index] > 180}
								<div class="invalid-tooltip" transition:slide>
									Longitude must be between -180 and 180
								</div>
							{/if}
						</div>
					</div>
					<div class="col-md-3">
						<div class="form-floating mb-3">
							<select
								class="form-select"
								name="timezone"
								id="timezone"
								aria-label="Timezone"
								bind:value={timezone}
							>
								<option value="America/Anchorage">America/Anchorage</option>
								<option value="America/Los_Angeles">America/Los_Angeles</option>
								<option value="America/Denver">America/Denver</option>
								<option value="America/Chicago">America/Chicago</option>
								<option value="America/New_York">America/New_York</option>
								<option value="America/Sao_Paulo">America/Sao_Paulo</option>
								<option value="UTC" selected>Not set (GMT+0)</option>
								<option value="GMT">GMT+0</option>
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
					<div class="col-md-2 mb-3">
						<LocationSearch
							on:location={(event) => locationCallback(event, index)}
							label="Search"
						/>
					</div>
					{#if index == 0}
						<div class="col-md-1 mb-3">
							<button
								type="button"
								class="btn btn-outline-secondary w-100 p-3"
								onclick={addLocation}
								title="Add coordinates"><PlusLg /></button
							>
						</div>
					{:else}
						<div class="col-md-1 mb-3">
							<button
								type="button"
								class="btn btn-outline-secondary w-100 p-3"
								onclick={() => removeLocation(index)}
								title="Delete coordinates"><Trash /></button
							>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
	{#if location_mode == 'csv_coordinates'}
		<div
			class="tab-pane active"
			in:fade
			id="pills-csv_coordinates"
			role="tabpanel"
			aria-labelledby="pills-csv_coordinates-tab"
			tabindex="0"
		>
			<div class="row">
				<div class="col-md-6 mb-3">
					<textarea class="form-control" id="csv_coordinates" bind:value={csv_coordinates} rows="5"
					></textarea>
				</div>
				<div class="col-md-6 mb-3">
					<p>
						You can provide multiple coordinates. One per line and separated by commas. For each
						location, you can also set a time period if needed. Format: latitude, longitude,
						elevation, timezone, start_date, end_date. Only latitude and longitude are required.
						Examples:
					</p>
					<pre>52.52,13.41
51.5085,-0.1257,,auto
52.52,13.41,,Europe/Berlin,2021-01-01,2021-01-31</pre>
				</div>
			</div>
		</div>
	{/if}
</div>

<script lang="ts">
	/**
	 * TODO:
	 * - weather form integration
	 * - use arrow keys + enter to select results
	 */
	import { onDestroy, onMount } from 'svelte';
	import { Trash } from 'svelte-bootstrap-icons';
	import { Star } from 'svelte-bootstrap-icons';
	import { Cursor } from 'svelte-bootstrap-icons';
	import { Map } from 'svelte-bootstrap-icons';
	import { Search } from 'svelte-bootstrap-icons';
	import { activeLocation, favorites, last_visited, type Location } from '$lib/stores';

	interface ResultSet {
		results: Location[] | undefined;
	}

	let debounceTimeout: number | undefined;
	let searchQuery = '';

	let searchInputElement: HTMLElement | undefined;
	let searchModalElement: HTMLElement | undefined;
	let searchModal: any;
	onMount(async () => {
		const Modal = await import('bootstrap/js/dist/modal');
		searchModal = new Modal.default(searchModalElement, {});
		searchModalElement?.addEventListener('shown.bs.modal', searchModalShown);
		//searchModal.show();
	});

	function searchModalShown(event: Event) {
		searchInputElement?.focus();
	}

	function startLocationDetection() {
		results = locationDetection();
	}

	async function locationDetection(): Promise<ResultSet> {
		let position: GeolocationPosition = await new Promise((resolve, reject) =>
			navigator.geolocation.getCurrentPosition(resolve, reject, {})
		);
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;
		const location: Location = {
			id: 100000000 + Math.floor(latitude * 100 + longitude + 1000),
			name: `GPS ${latitude.toFixed(2)}°E ${longitude.toFixed(2)}°N`,
			latitude: latitude,
			longitude: longitude,
			elevation: position.coords.altitude ?? NaN,
			feature_code: '',
			country_code: '',
			admin1_id: undefined,
			admin3_id: undefined,
			admin4_id: undefined,
			timezone: '',
			population: undefined,
			postcodes: undefined,
			country_id: 0,
			country: '',
			admin1: undefined,
			admin3: undefined,
			admin4: undefined
		};
		return { results: [location] };
	}

	onDestroy(() => {
		clearInterval(debounceTimeout);
		searchModalElement?.removeEventListener('shown.bs.modal', searchModalShown);
	});

	function deleteRecent(location: Location) {
		$last_visited = $last_visited.filter((item) => item.id != location.id);
	}

	function deleteFavorite(location: Location) {
		$favorites = $favorites.filter((item) => item.id != location.id);
	}

	// Save a new favorite location. Remove it from recent locations.
	function saveFavorite(location: Location) {
		$favorites = [location, ...$favorites];
		deleteRecent(location);
	}

	// Save as recent location, unless it is a favorite
	function saveRecent(location: Location) {
		if ($favorites.find((item) => item.id == location.id)) {
			// Reorder favorites
			let temp = $favorites.filter((item) => item.id != location.id);
			temp.unshift(location);
			$favorites = temp;
			return;
		}
		let temp = $last_visited.filter((item) => item.id != location.id);
		temp.unshift(location);
		if (temp.length > 10) {
			temp.pop();
		}
		$last_visited = temp;
	}

	function selectLocation(location: Location) {
		saveRecent(location);
		searchQuery = '';
		$activeLocation = location;
		searchModal?.hide();
	}

	// Fetch is automatically called after `searchQuery` changes due to reactive assignment
	$: results = (async () => {
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		if (searchQuery.length < 2) {
			return { results: [] };
		}
		await new Promise((resolve) => {
			debounceTimeout = setTimeout(resolve, 300);
		});

		// Always set format=json to fetch data
		const url = 'https://geocoding-api.open-meteo.com/v1/search';
		const fetchUrl = `${url}?${new URLSearchParams({ name: searchQuery })}`;
		const result = await fetch(fetchUrl);

		if (!result.ok) {
			throw new Error(await result.text());
		}

		return (await result.json()) as ResultSet;
	})();
</script>

<button
	type="button"
	class="btn btn-outline-secondary w-100"
	data-bs-toggle="modal"
	data-bs-target="#locationSearchModal"><Search /> Search Location ...</button
>

<div
	class="modal"
	id="locationSearchModal"
	tabindex="-1"
	aria-labelledby="locationSearchModalLabel"
	aria-hidden="true"
	bind:this={searchModalElement}
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header no-border">
				<label for="location_search" id="locationSearchModalLabel"
					><span class="lead">Search Locations</span></label
				>
				<button
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
					title="Close"
				/>
			</div>
			<div class="modal-body">
				<div class="input-group">
					<input
						type="search"
						class="form-control"
						id="location_search"
						autocomplete="off"
						spellcheck="false"
						aria-label="Search Location"
						bind:value={searchQuery}
						bind:this={searchInputElement}
					/>
					<button
						tabindex="-1"
						class="btn btn-outline-secondary"
						type="button"
						title="Detect Location via GPS"
						on:click|stopPropagation={startLocationDetection}><Cursor /></button
					>
				</div>
				{#await results}
					<div class="d-flex justify-content-center mt-4">
						<div class="spinner-border" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					</div>
				{:then results}
					{#if results.results && results.results.length == 0}
						{#if searchQuery.length < 2}
							{#if $last_visited.length == 0 && $favorites.length == 0}
								<div class="list-group mt-4">
									<li class="list-group-item"><span>Start typing to search for locations</span></li>
								</div>
							{/if}
							{#if $favorites.length > 0}
								<h6 class="lead mt-4">Favorites</h6>
								<div class="list-group">
									{#each $favorites as location}
										<button
											class="list-group-item list-group-item-action position-relative"
											type="button"
											on:click={() => selectLocation(location)}
										>
											<img
												height="24"
												src="/images/country-flags/{location.country_code.toLowerCase()}.svg"
												title={location.country}
												alt={location.country_code}
											/>
											{location.name}<br />
											<small class="text-muted"
												>{location.admin1 || ''} ({location.latitude.toFixed(2)}°E {location.longitude.toFixed(
													2
												)}°N {location.elevation.toFixed(0)}m asl)</small
											>
											<div class="position-absolute top-0 end-0 p-2">
												<button
													class="btn btn-outline-secondary btn-sm border-0"
													on:click|stopPropagation={() => deleteFavorite(location)}
													tabindex="-1"
													title="Delete"><Trash /></button
												>
												<a
													class="btn btn-outline-secondary btn-sm border-0"
													href="https://www.openstreetmap.org/#map=13/{location.latitude}/{location.longitude}"
													target="_blank"
													tabindex="-1"
													title="Show on map"
													on:click|stopPropagation
												>
													<Map />
												</a>
											</div>
										</button>
									{/each}
								</div>
							{/if}
							{#if $last_visited.length > 0}
								<h6 class="lead mt-4">Recent Locations</h6>
								<div class="list-group">
									{#each $last_visited as location}
										<button
											class="list-group-item list-group-item-action position-relative"
											type="button"
											on:click={() => selectLocation(location)}
										>
											<img
												height="24"
												src="/images/country-flags/{location.country_code.toLowerCase()}.svg"
												title={location.country}
												alt={location.country_code}
											/>
											{location.name}<br />
											<small class="text-muted"
												>{location.admin1 || ''} ({location.latitude.toFixed(2)}°E {location.longitude.toFixed(
													2
												)}°N {location.elevation.toFixed(0)}m asl)</small
											>
											<div class="position-absolute top-0 end-0 p-2">
												<button
													class="btn btn-outline-secondary btn-sm border-0"
													type="button"
													on:click|stopPropagation={() => saveFavorite(location)}
													tabindex="-1"
													title="Save"><Star /></button
												>
												<button
													class="btn btn-outline-secondary btn-sm border-0"
													type="button"
													on:click|stopPropagation={() => deleteRecent(location)}
													tabindex="-1"
													title="Delete"><Trash /></button
												>
												<a
													class="btn btn-outline-secondary btn-sm border-0"
													type="button"
													href="https://www.openstreetmap.org/#map=13/{location.latitude}/{location.longitude}"
													target="_blank"
													tabindex="-1"
													title="Show on map"
													on:click|stopPropagation
												>
													<Map />
												</a>
											</div>
										</button>
									{/each}
								</div>
							{/if}
						{:else}
							<div class="list-group mt-4">
								<li class="list-group-item"><span>No locations found</span></li>
							</div>
						{/if}
					{:else}
						<div class="list-group mt-4">
							{#each results.results || [] as location}
								<button
									class="list-group-item list-group-item-action position-relative"
									type="button"
									on:click={() => selectLocation(location)}
								>
									<img
										height="24"
										src="/images/country-flags/{location.country_code.toLowerCase()}.svg"
										title={location.country}
										alt={location.country_code}
									/>
									{location.name}<br />
									<small class="text-muted"
										>{location.admin1 || ''} ({location.latitude.toFixed(2)}°E {location.longitude.toFixed(
											2
										)}°N {location.elevation.toFixed(0)}m asl)</small
									>
									<div class="position-absolute top-0 end-0 p-2">
										<a
											class="btn btn-outline-secondary btn-sm border-0"
											href="https://www.openstreetmap.org/#map=13/{location.latitude}/{location.longitude}"
											target="_blank"
											tabindex="-1"
											title="Show on map"
											on:click|stopPropagation
										>
											<Map />
										</a>
									</div>
								</button>
							{/each}
						</div>
					{/if}
				{:catch error}
					<div class="mt-4">
						<div class="alert alert-danger" role="alert">{error.message}</div>
					</div>
				{/await}
			</div>
			<!--<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary">Save changes</button>
			</div>-->
		</div>
	</div>
</div>

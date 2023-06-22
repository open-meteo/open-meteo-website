<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { persisted } from 'svelte-local-storage-store';
	import { writable } from 'svelte/store';
	import { Trash } from 'svelte-bootstrap-icons';
	import { Star } from 'svelte-bootstrap-icons';
	import { Cursor } from 'svelte-bootstrap-icons';
	import { Map } from 'svelte-bootstrap-icons';

	const last_visited = persisted('last_visited_locations', []);
	const favorites = persisted('favorites', []);
	export const activeLocation = writable(
		$last_visited.length > 0
			? $last_visited[0]
			: {
					id: 2950159,
					name: 'Berlin',
					latitude: 52.52437,
					longitude: 13.41053,
					elevation: 74,
					feature_code: 'PPLC',
					country_code: 'DE',
					admin1_id: 2950157,
					admin3_id: 6547383,
					admin4_id: 6547539,
					timezone: 'Europe/Berlin',
					population: 3426354,
					postcodes: ['10967', '13347'],
					country_id: 2921044,
					country: 'Germany',
					admin1: 'Land Berlin',
					admin3: 'Berlin, Stadt',
					admin4: 'Berlin'
			  }
	);

	let name = '';
	let action = 'https://geocoding-api.open-meteo.com/v1/search?';
	let debounceTimeout: number | undefined;

	onMount(async () => {
		const Dropdown = await import('bootstrap/js/dist/dropdown');
	});

	onDestroy(() => {
		clearInterval(debounceTimeout);
	});

	function deleteRecent(location: any) {
		$last_visited = $last_visited.filter((item) => item != location);
	}

	function deleteFavorite(location: any) {
		$favorites = $favorites.filter((item) => item != location);
	}

	function saveFavourite(location: any) {
		let temp = $favorites.filter((item) => item != location);
		temp.unshift(location);
		$favorites = temp;
		deleteRecent(location);
	}

	function selectLocation(location: any) {
		if (!$favorites.includes(location)) {
			let temp = $last_visited.filter((item) => item != location);
			temp.unshift(location);
			if (temp.length > 10) {
				temp.pop();
			}
			$last_visited = temp;
		}
		name = '';
		$activeLocation = location;
	}

	// Fetch is automatically called after `params` changes due to reactive assignment
	$: results = (async () => {
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		if (name.length < 2) {
			return [];
		}
		await new Promise((resolve) => {
			debounceTimeout = setTimeout(resolve, 300);
		});

		// Always set format=json to fetch data
		const fetchUrl = `${action}${new URLSearchParams({ name: name, format: 'json' })}`;
		const result = await fetch(fetchUrl);

		if (!result.ok) {
			throw new Error(await result.text());
		}

		return await result.json();
	})();
</script>

{JSON.stringify($activeLocation)}

<div class="input-group mb-3">
	<div class="form-floating dropdown">
		<input
			type="text"
			class="form-control"
			id="location_search"
			autocomplete="off"
			spellcheck="false"
			aria-label="Search Location"
			data-bs-toggle="dropdown"
			bind:value={name}
		/>

		<ul class="dropdown-menu" aria-labelledby="location_search">
			{#if name.length < 2}
				{#if $last_visited.length == 0 && $favorites.length == 0}
					<li><h6 class="dropdown-header">Start typing to search for locations</h6></li>
				{/if}
				{#if $last_visited.length > 0}
					<li><h6 class="dropdown-header">Recent Locations</h6></li>
					{#each $last_visited as location}
						<li>
							<div class="btn-group d-flex" role="group">
								<button class="dropdown-item" on:click={() => selectLocation(location)}>
									<img
										height="24"
										src="/images/country-flags/{location.country_code.toLowerCase()}.svg"
										title={location.country}
										alt={location.country_code}
									/>
									{location.name}
									<small class="text-muted"
										>{location.admin1 || ''} ({location.latitude.toFixed(2)}°E {location.longitude.toFixed(
											2
										)}°N {location.elevation}m asl)</small
									>
								</button>
								<button
									class="btn dropdown-item w-auto"
									on:click|stopPropagation={() => saveFavourite(location)}
									title="Save"><Star /></button
								>
								<button
									class="btn dropdown-item w-auto"
									on:click|stopPropagation={() => deleteRecent(location)}
									title="Delete"><Trash /></button
								>
								<a
									class="btn dropdown-item w-auto"
									href="https://www.openstreetmap.org/#map=13/{location.latitude}/{location.longitude}"
									target="_blank"
									title="Show on map"
								>
									<Map />
								</a>
							</div>
						</li>
					{/each}
					{#if $favorites.length > 0}
						<li><h6 class="dropdown-header">Favorites</h6></li>
						{#each $favorites as location}
							<li>
								<div class="btn-group d-flex" role="group">
									<button class="btn dropdown-item" on:click={() => selectLocation(location)}>
										<img
											height="24"
											src="/images/country-flags/{location.country_code.toLowerCase()}.svg"
											title={location.country}
											alt={location.country_code}
										/>
										{location.name}
										<small class="text-muted"
											>{location.admin1 || ''} ({location.latitude.toFixed(2)}°E {location.longitude.toFixed(
												2
											)}°N {location.elevation}m asl)</small
										>
									</button>
									<button
										class="btn dropdown-item w-auto"
										on:click|stopPropagation={() => deleteFavorite(location)}
										title="Delete"><Trash /></button
									>
									<a
										class="btn dropdown-item w-auto"
										href="https://www.openstreetmap.org/#map=13/{location.latitude}/{location.longitude}"
										target="_blank"
										title="Show on map"
									>
										<Map />
									</a>
								</div>
							</li>
						{/each}
					{/if}
				{/if}
			{:else}
				{#await results}
					<li>
						<span class="dropdown-item">
							<div class="spinner-border spinner-border-sm" role="status">
								<span class="visually-hidden">Loading...</span>
							</div>
							Loading...</span
						>
					</li>
				{:then results}
					{#if (results.results || []).length == 0}
						<li><span class="dropdown-item">No locations found</span></li>
					{:else}
						{#each results.results as location}
							<li>
								<div class="btn-group d-flex" role="group">
									<button class="dropdown-item" on:click={() => selectLocation(location)}>
										<img
											height="24"
											src="/images/country-flags/{location.country_code.toLowerCase()}.svg"
											title={location.country}
											alt={location.country_code}
										/>
										{location.name}
										<small class="text-muted"
											>{location.admin1 || ''} ({location.latitude.toFixed(2)}°E {location.longitude.toFixed(
												2
											)}°N {location.elevation}m asl)</small
										>
									</button>
                                    <a
                                    class="btn dropdown-item w-auto"
                                    href="https://www.openstreetmap.org/#map=13/{location.latitude}/{location.longitude}"
                                    target="_blank"
                                    title="Show on map"
                                >
                                    <Map />
                                </a>
								</div>
							</li>
						{/each}
					{/if}
				{:catch error}
					<li>
						<span class="dropdown-item"
							><div class="alert alert-danger" role="alert">{error.message}</div></span
						>
					</li>
				{/await}
			{/if}
		</ul>
		<label for="location_search">Search Location</label>
	</div>
	<button class="btn btn-outline-secondary" type="button" title="GPS location"><Cursor /></button>
</div>

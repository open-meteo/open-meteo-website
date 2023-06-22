<script lang="ts">
	//export let requires_professional_plan = false;
	import { onDestroy, onMount } from 'svelte';

	let name = '';
	let action = 'https://geocoding-api.open-meteo.com/v1/search?';
	let debounceTimeout: number | undefined;

	onMount(async () => {
		const Dropdown = await import('bootstrap/js/dist/dropdown');
	});

	onDestroy(() => {
		clearInterval(debounceTimeout);
	});

	function selectLocation(location: any) {
		alert(location);
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

<div class="input-group mb-3">
	<div class="form-floating dropdown">
		<input
			type="text"
			class="form-control"
			id="location_search"
			autocomplete="off"
			spellcheck="false"
			aria-label="Select city"
			data-bs-toggle="dropdown"
			bind:value={name}
		/>

		<ul class="dropdown-menu" aria-labelledby="location_search">
			{#if name.length < 2}
				<li><span class="dropdown-item">Start typing to search for locations</span></li>
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
		<label for="location_search">Select city</label>
	</div>
	<button class="btn btn-outline-secondary" type="button">Detect GPS Position</button>
</div>

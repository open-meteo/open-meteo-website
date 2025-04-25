<script lang="ts">
	import { onDestroy, createEventDispatcher } from 'svelte';

	import { favorites, last_visited, type GeoLocation } from '$lib/stores/settings';

	import { Alert } from '$lib/components/ui/alert';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	import * as Dialog from '$lib/components/ui/dialog';

	export let label: string = 'Search Locations...';

	interface ResultSet {
		results: GeoLocation[] | undefined;
	}

	const dispatch = createEventDispatcher();
	let debounceTimeout: number | undefined;
	let searchQuery = '';

	onDestroy(() => {
		clearInterval(debounceTimeout);
	});

	let scrollY: number | undefined;

	const closeModal = () => {
		dialogOpen = false;
		if (scrollY) {
			window.scrollTo({ top: scrollY, behavior: 'instant' });
		}
	};

	const deleteRecent = (location: GeoLocation) => {
		$last_visited = $last_visited.filter((item) => item.id != location.id);
	};

	const deleteFavorite = (location: GeoLocation) => {
		$favorites = $favorites.filter((item) => item.id != location.id);
	};

	// Save a new favorite location. Remove it from recent locations.
	const saveFavorite = (location: GeoLocation) => {
		$favorites = [location, ...$favorites];
		deleteRecent(location);
		searchQuery = '';
	};

	// Save as recent location, unless it is a favorite
	const saveRecent = (location: GeoLocation) => {
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
	};

	const selectLocation = (location: GeoLocation) => {
		saveRecent(location);
		searchQuery = '';
		closeModal();
		dispatch('location', location);
	};

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

		if (searchQuery.toLowerCase() == 'gps') {
			let position: GeolocationPosition = await new Promise((resolve, reject) =>
				navigator.geolocation.getCurrentPosition(resolve, reject, {})
			);
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;
			return {
				results: [
					{
						id: 100000000 + Math.floor(latitude * 100 + longitude + 1000),
						name: `GPS ${latitude.toFixed(2)}°N ${longitude.toFixed(2)}°E`,
						latitude: latitude,
						longitude: longitude,
						elevation: position.coords.altitude ?? NaN,
						feature_code: '',
						country_code: undefined,
						admin1_id: undefined,
						admin3_id: undefined,
						admin4_id: undefined,
						timezone: '',
						population: undefined,
						postcodes: undefined,
						country_id: undefined,
						country: undefined,
						admin1: undefined,
						admin3: undefined,
						admin4: undefined
					}
				]
			};
		}

		// Always set format=json to fetch data
		const url = 'https://geocoding-api.open-meteo.com/v1/search';
		const fetchUrl = `${url}?${new URLSearchParams({ name: searchQuery })}`;
		const result = await fetch(fetchUrl);

		if (!result.ok) {
			throw new Error(await result.text());
		}

		return (await result.json()) as ResultSet;
	})();

	let dialogOpen = false;
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger
		onclick={(e) => {
			e.preventDefault();
			dialogOpen = !dialogOpen;
		}}
		class="hover:bg-accent w-full border-border flex h-12 cursor-pointer items-center justify-center rounded-md border px-5 pr-6 duration-200"
		><svg
			class="lucide lucide-search mr-[5px]"
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
		{label}</Dialog.Trigger
	>
	<Dialog.Portal>
		<Dialog.Overlay class="bg-black/5" />

		<Dialog.Content
			preventScroll={true}
			class="border-border top-[10%] flex min-h-[400px] translate-y-0 flex-col sm:max-w-[600px]"
		>
			<Dialog.Header>
				<Dialog.Title>Search Locations</Dialog.Title>
			</Dialog.Header>
			<div>
				<div class="flex gap-3">
					<Input
						type="search"
						id="location_search"
						autocomplete="off"
						spellcheck="false"
						aria-label="Search Location"
						bind:value={searchQuery}
					/>
					<Button
						variant="outline"
						class=""
						title="Detect Location via GPS"
						onclick={() => (searchQuery = 'GPS')}
						><svg
							class="lucide lucide-mouse-pointer-2"
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
							/>
						</svg></Button
					>
				</div>
				{#await results}
					<div class="mt-4 flex h-full items-center justify-center">
						<Alert.Root class="border-border my-auto w-[unset]">
							<Alert.Description>Loading...</Alert.Description>
						</Alert.Root>
					</div>
				{:then results}
					{#if results.results && results.results.length === 0}
						{#if searchQuery.length < 2}
							{#if $last_visited.length === 0 && $favorites.length === 0}
								<Alert.Root class="border-border mt-4 my-auto w-[unset]">
									<Alert.Description>Start typing to search for locations</Alert.Description>
								</Alert.Root>
							{/if}
							{#if $favorites.length > 0}
								<h6 class="text-muted-foreground mb-4 mt-4 text-xl">Favorites</h6>
								<div class="border-border rounded-lg border">
									{#each $favorites as location, i}
										<Button
											variant="outline"
											class="not-last:border-b flex h-[unset] gap-0 rounded-none w-full justify-between pl-3 pr-1 md:pr-2 py-2 {i ===
											0
												? 'rounded-t-md'
												: ''} {i === $favorites.length - 1 ? 'rounded-b-md' : ''}"
											onclick={() => selectLocation(location)}
										>
											<div class="pointer-events-none flex flex-col gap-1 truncate">
												<div class="flex items-center gap-2 text-lg truncate">
													<img
														height="24"
														width="24"
														src="/images/country-flags/{(
															location.country_code || 'united_nations'
														).toLowerCase()}.svg"
														title={location.country}
														alt={location.country_code}
													/>
													{location.name}
												</div>

												<div class="text-muted-foreground text-left text-sm truncate">
													{location.admin1 || ''} ({location.latitude.toFixed(2)}°N
													{location.longitude.toFixed(2)}°E{#if location.elevation}
														{+' ' + location.elevation.toFixed(0)}m asl{/if})
												</div>
											</div>

											<div class="-mr-1 flex justify-self-end">
												<Button
													variant="ghost"
													class="px-2 md:px-3 duration-200 hover:brightness-[140%]"
													onclick={(e) => {
														e.stopPropagation();
														deleteFavorite(location);
													}}
													title="Delete"
													><svg
														class="lucide lucide-trash-2"
														xmlns="http://www.w3.org/2000/svg"
														width="20"
														height="20"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="1.2"
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
												<Button
													variant="ghost"
													class="px-2 md:px-3 duration-200 hover:brightness-[140%]"
													href="https://www.openstreetmap.org/#map=13/{location.latitude}/{location.longitude}"
													target="_blank"
													title="Show on map"
													onclick={(e) => {
														e.stopPropagation();
													}}
												>
													<svg
														class="lucide lucide-map"
														xmlns="http://www.w3.org/2000/svg"
														width="20"
														height="20"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="1.2"
														stroke-linecap="round"
														stroke-linejoin="round"
													>
														<path
															d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"
														/>
														<path d="M15 5.764v15" />
														<path d="M9 3.236v15" />
													</svg>
												</Button>
											</div>
										</Button>
									{/each}
								</div>
							{/if}
							{#if $last_visited.length > 0}
								<h6 class="text-muted-foreground mb-4 mt-4 text-xl">Recent Locations</h6>
								<div class="border-border rounded-lg border">
									{#each $last_visited as location, i}
										<Button
											variant="outline"
											class="not-last:border-b flex h-[unset] w-full gap-0 justify-between rounded-none pl-3 pr-1 md:pr-2 py-2 {i ===
											0
												? 'rounded-t-md'
												: ''} {i === $last_visited.length - 1 ? 'rounded-b-md' : ''}"
											onclick={() => selectLocation(location)}
										>
											<div class="pointer-events-none flex flex-col gap-1 truncate">
												<div class="flex items-center gap-2 text-lg truncate">
													<img
														height="24"
														width="24"
														src="/images/country-flags/{(
															location.country_code || 'united_nations'
														).toLowerCase()}.svg"
														title={location.country}
														alt={location.country_code}
													/>
													{location.name}
												</div>

												<div class="text-muted-foreground text-left text-sm truncate">
													{location.admin1 || ''} ({location.latitude.toFixed(2)}°N {location.longitude.toFixed(
														2
													)}°E{#if location.elevation}
														{+' ' + location.elevation.toFixed(0)}m asl{/if})
												</div>
											</div>

											<div class="-mr-1 flex justify-self-end">
												<Button
													variant="ghost"
													class="px-2 md:px-3 duration-200 hover:brightness-[140%]"
													onclick={(e) => {
														e.stopPropagation();
														saveFavorite(location);
													}}
													title="Save"
													><svg
														class="lucide lucide-star"
														xmlns="http://www.w3.org/2000/svg"
														width="20"
														height="20"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="1.2"
														stroke-linecap="round"
														stroke-linejoin="round"
													>
														<path
															d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
														/>
													</svg>
												</Button>
												<Button
													variant="ghost"
													class="px-2 md:px-3 duration-200 hover:brightness-[140%]"
													onclick={(e) => {
														e.stopPropagation();
														deleteRecent(location);
													}}
													title="Delete"
													><svg
														class="lucide lucide-trash-2"
														xmlns="http://www.w3.org/2000/svg"
														width="20"
														height="20"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="1.2"
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
												<Button
													variant="ghost"
													class="px-2 md:px-3 duration-200 hover:brightness-[140%]"
													href="https://www.openstreetmap.org/#map=13/{location.latitude}/{location.longitude}"
													target="_blank"
													title="Show on map"
													onclick={(e) => {
														e.stopPropagation();
													}}
												>
													<svg
														class="lucide lucide-map"
														xmlns="http://www.w3.org/2000/svg"
														width="20"
														height="20"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="1.2"
														stroke-linecap="round"
														stroke-linejoin="round"
													>
														<path
															d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"
														/>
														<path d="M15 5.764v15" />
														<path d="M9 3.236v15" />
													</svg>
												</Button>
											</div>
										</Button>
									{/each}
								</div>
							{/if}
						{:else}
							<Alert.Root class="border-border !mt-4 my-auto w-[unset]">
								<Alert.Description>No locations found</Alert.Description>
							</Alert.Root>
						{/if}
					{:else if !results.results}
						<Alert.Root class="border-border !mt-4 my-auto w-[unset]">
							<Alert.Description>No locations found</Alert.Description>
						</Alert.Root>
					{:else}
						<div class="list-group mt-4">
							<div class="border-border rounded-lg border">
								{#each results.results || [] as location, i}
									<Button
										variant="outline"
										class="not-last:border-b flex h-[unset] w-full justify-between gap-0 rounded-none pl-3 pr-1 md:pr-2 py-2 {i ===
										0
											? 'rounded-t-md'
											: ''} {results.results && i === results.results.length - 1
											? 'rounded-b-md'
											: ''}"
										onclick={() => selectLocation(location)}
									>
										<div class="pointer-events-none flex flex-col gap-1 truncate">
											<div class="flex items-center gap-2 text-lg truncate">
												<img
													height="24"
													width="24"
													src="/images/country-flags/{(
														location.country_code || 'united_nations'
													).toLowerCase()}.svg"
													title={location.country}
													alt={location.country_code}
												/>
												{location.name}
											</div>

											<div class="text-muted-foreground text-left text-sm truncate">
												{location.admin1 || ''} ({location.latitude.toFixed(2)}°N {location.longitude.toFixed(
													2
												)}°E{#if location.elevation}
													{+' ' + location.elevation.toFixed(0)}m asl{/if})
											</div>
										</div>
										<div class="-mr-1 flex justify-self-end">
											<Button
												variant="ghost"
												class="px-2 md:px-3 duration-200 hover:brightness-[140%]"
												onclick={(e) => {
													e.stopPropagation();
													saveFavorite(location);
												}}
												title="Save"
												><svg
													class="lucide lucide-star"
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="1.2"
													stroke-linecap="round"
													stroke-linejoin="round"
												>
													<path
														d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
													/>
												</svg>
											</Button>
											<Button
												variant="ghost"
												class="px-2 md:px-3 duration-200 hover:brightness-[140%]"
												href="https://www.openstreetmap.org/#map=13/{location.latitude}/{location.longitude}"
												target="_blank"
												title="Show on map"
												onclick={(e) => {
													e.stopPropagation();
												}}
											>
												<svg
													class="lucide lucide-map"
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="1.2"
													stroke-linecap="round"
													stroke-linejoin="round"
												>
													<path
														d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"
													/>
													<path d="M15 5.764v15" />
													<path d="M9 3.236v15" />
												</svg>
											</Button>
										</div>
									</Button>
								{/each}
							</div>
						</div>
					{/if}
				{:catch error}
					<Alert.Root variant="destructive" class="my-auto mt-4 w-[unset]">
						<Alert.Description>{error.message}</Alert.Description>
					</Alert.Root>
				{/await}
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

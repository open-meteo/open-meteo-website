<script lang="ts">
	import { onDestroy, createEventDispatcher } from 'svelte';

	import { favorites, last_visited, type GeoLocation } from '$lib/stores/settings';

	import Button from '../ui/button/button.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import Map from 'lucide-svelte/icons/map';
	import Star from 'lucide-svelte/icons/star';
	import Trash from 'lucide-svelte/icons/trash-2';
	import Input from '../ui/input/input.svelte';
	import Cursor from 'lucide-svelte/icons/mouse-pointer-2';
	import Search from 'lucide-svelte/icons/search';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

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

	function closeModal() {
		dialogOpen = false;
		if (scrollY) {
			// @ts-ignore
			window.scrollTo({ top: scrollY, behavior: 'instant' });
		}
	}

	function deleteRecent(location: GeoLocation) {
		$last_visited = $last_visited.filter((item) => item.id != location.id);
	}

	function deleteFavorite(location: GeoLocation) {
		$favorites = $favorites.filter((item) => item.id != location.id);
	}

	// Save a new favorite location. Remove it from recent locations.
	function saveFavorite(location: GeoLocation) {
		$favorites = [location, ...$favorites];
		deleteRecent(location);
		searchQuery = '';
	}

	// Save as recent location, unless it is a favorite
	function saveRecent(location: GeoLocation) {
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

	function selectLocation(location: GeoLocation) {
		saveRecent(location);
		searchQuery = '';
		closeModal();
		dispatch('location', location);
	}

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

<Dialog.Root bind:open={dialogOpen} preventScroll={false}>
	<Dialog.Trigger
		class="hover:bg-accent flex h-12 cursor-pointer items-center justify-center rounded-md border px-5 pr-6 duration-200"
		><Search size={20} class="mr-1" /> {label}</Dialog.Trigger
	>
	<Dialog.Content class="top-[10%] flex min-h-[400px] translate-y-0 flex-col sm:max-w-[600px]">
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
					class="cursor-pointer"
					title="Detect Location via GPS"
					onclick={() => (searchQuery = 'GPS')}
					><Cursor class="pointer-events-none" size={20} strokeWidth={1.2} /></Button
				>
			</div>
			{#await results}
				<div class="mt-4 flex h-full items-center justify-center">
					<Alert.Root class="my-auto w-[unset]" variant="informative">
						<Alert.Description>Loading...</Alert.Description>
					</Alert.Root>
				</div>
			{:then results}
				{#if results.results && results.results.length == 0}
					{#if searchQuery.length < 2}
						{#if $last_visited.length == 0 && $favorites.length == 0}
							<Alert.Root class="my-auto w-[unset]" variant="informative">
								<Alert.Description>Start typing to search for locations</Alert.Description>
							</Alert.Root>
						{/if}
						{#if $favorites.length > 0}
							<h6 class="text-muted-foreground mb-4 mt-4 text-xl">Favorites</h6>
							<div class="rounded-lg border">
								{#each $favorites as location}
									<Button
										variant="outline"
										class="not-last:border-b flex h-[unset] w-full cursor-pointer justify-between rounded-none px-3 py-2"
										onclick={() => selectLocation(location)}
									>
										<div class="pointer-events-none flex flex-col gap-1">
											<div class="flex items-center gap-2 text-lg">
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

											<div class="text-muted-foreground text-left text-sm">
												{location.admin1 || ''} ({location.latitude.toFixed(2)}°N
												{location.longitude.toFixed(2)}°E{#if location.elevation}
													{+' ' + location.elevation.toFixed(0)}m asl{/if})
											</div>
										</div>

										<div class="-mr-1 flex justify-self-end">
											<Button
												class="px-3"
												variant="ghost"
												onclick={() => deleteFavorite(location)}
												title="Delete"><Trash size={20} strokeWidth={1.2} /></Button
											>
											<Button
												class="px-3"
												variant="ghost"
												href="https://www.openstreetmap.org/#map=13/{location.latitude}/{location.longitude}"
												target="_blank"
												title="Show on map"
											>
												<Map size={20} strokeWidth={1.2} />
											</Button>
										</div>
									</Button>
								{/each}
							</div>
						{/if}
						{#if $last_visited.length > 0}
							<h6 class="text-muted-foreground mb-4 mt-4 text-xl">Recent Locations</h6>
							<div class="rounded-lg border">
								{#each $last_visited as location}
									<Button
										variant="outline"
										class="not-last:border-b flex h-[unset] w-full cursor-pointer justify-between rounded-none px-3 py-2"
										onclick={() => selectLocation(location)}
									>
										<div class="pointer-events-none flex flex-col gap-1">
											<div class="flex items-center gap-2 text-lg">
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

											<div class="text-muted-foreground text-left text-sm">
												{location.admin1 || ''} ({location.latitude.toFixed(2)}°N {location.longitude.toFixed(
													2
												)}°E{#if location.elevation}
													{+' ' + location.elevation.toFixed(0)}m asl{/if})
											</div>
										</div>

										<div class="-mr-1 flex justify-self-end">
											<Button
												variant="ghost"
												class="cursor-pointer px-3 duration-200 hover:brightness-[120%]"
												onclick={(e) => saveFavorite(location)}
												title="Save"><Star size={20} strokeWidth={1.2} /></Button
											>
											<Button
												variant="ghost"
												class="cursor-pointer px-3 duration-200 hover:brightness-[120%]"
												onclick={() => deleteRecent(location)}
												title="Delete"><Trash size={20} strokeWidth={1.2} /></Button
											>
											<Button
												variant="ghost"
												class="cursor-pointer px-3 duration-200 hover:brightness-[120%]"
												href="https://www.openstreetmap.org/#map=13/{location.latitude}/{location.longitude}"
												target="_blank"
												title="Show on map"
											>
												<Map size={20} strokeWidth={1.2} />
											</Button>
										</div>
									</Button>
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
						<div class="rounded-lg border">
							{#each results.results || [] as location}
								<Button
									variant="outline"
									class="not-last:border-b flex h-[unset] w-full cursor-pointer cursor-pointer justify-between rounded-none px-3 py-2"
									onclick={() => selectLocation(location)}
								>
									<div class="pointer-events-none flex flex-col gap-1">
										<div class="flex items-center gap-2 text-lg">
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

										<div class="text-muted-foreground text-left text-sm">
											{location.admin1 || ''} ({location.latitude.toFixed(2)}°N {location.longitude.toFixed(
												2
											)}°E{#if location.elevation}
												{+' ' + location.elevation.toFixed(0)}m asl{/if})
										</div>
									</div>
									<div class="-mr-1 flex justify-self-end">
										<Button
											variant="ghost"
											class="cursor-pointer px-3 duration-200 hover:brightness-[120%]"
											onclick={() => saveFavorite(location)}
											title="Save"><Star size={20} strokeWidth={1.2} /></Button
										>
										<Button
											variant="ghost"
											class="cursor-pointer px-3 duration-200 hover:brightness-[120%]"
											href="https://www.openstreetmap.org/#map=13/{location.latitude}/{location.longitude}"
											target="_blank"
											title="Show on map"
										>
											<Map size={20} strokeWidth={1.2} />
										</Button>
									</div>
								</Button>
							{/each}
						</div>
					</div>
				{/if}
			{:catch error}
				<div class="mt-4">
					<div class="alert alert-danger" role="alert">{error.message}</div>
				</div>
			{/await}
		</div>
	</Dialog.Content>
</Dialog.Root>

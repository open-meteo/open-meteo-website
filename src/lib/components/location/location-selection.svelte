<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select/index';

	import LocationSearch from '$lib/components/location/location-search.svelte';

	import { type Parameters } from '$lib/docs';

	import type { GeoLocation } from '$lib/stores/settings';

	interface Props {
		params: Parameters;
	}

	let { params = $bindable() }: Props = $props();

	const locationCallback = (event: CustomEvent<GeoLocation>, index: number) => {
		if (params.latitude && params.longitude) {
			params.latitude[index] = Number(event.detail.latitude.toFixed(4));
			params.longitude[index] = Number(event.detail.longitude.toFixed(4));
		}
		params.latitude = params.latitude;
		params.longitude = params.longitude;
	};

	const addLocation = () => {
		if (params.latitude && params.longitude) {
			params.latitude.push(NaN);
			params.longitude.push(NaN);
		}
		params.latitude = params.latitude;
		params.longitude = params.longitude;
	};

	const removeLocation = (index: number) => {
		if (params.latitude && params.longitude) {
			params.latitude = params.latitude.toSpliced(index, 1);
			params.longitude = params.longitude.toSpliced(index, 1);
		}
		params.latitude = params.latitude;
		params.longitude = params.longitude;
	};

	const timeZoneOptions = [
		{ value: 'UTC', label: 'Not set (GMT+0)' },
		{ value: 'auto', label: 'Automatically detect time zone' },
		{ value: 'GMT', label: 'GMT+0' },
		{ value: 'America/Anchorage', label: 'America/Anchorage' },
		{ value: 'America/Los_Angeles', label: 'America/Los Angeles' },
		{ value: 'America/Denver', label: 'America/Denver' },
		{ value: 'America/Chicago', label: 'America/Chicago' },
		{ value: 'America/New_York', label: 'America/New York' },
		{ value: 'America/Sao_Paulo', label: 'America/Sao Paulo' },
		{ value: 'Europe/London', label: 'Europe/London' },
		{ value: 'Europe/Berlin', label: 'Europe/Berlin' },
		{ value: 'Europe/Moscow', label: 'Europe/Moscow' },
		{ value: 'Africa/Cairo', label: 'Africa/Cairo' },
		{ value: 'Asia/Bangkok', label: 'Asia/Bangkok' },
		{ value: 'Asia/Singapore', label: 'Asia/Singapore' },
		{ value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
		{ value: 'Australia/Sydney', label: 'Australia/Sydney' },
		{ value: 'Pacific/Auckland', label: 'Pacific/Auckland' }
	];

	let timeZone = $derived(timeZoneOptions.find((tzo) => String(tzo.value) == params.timezone));

	let boundingBoxSouth = $state(-90);
	let boundingBoxWest = $state(-180);
	let boundingBoxNorth = $state(90);
	let boundingBoxEast = $state(180);

	onMount(() => {
		if (params.bounding_box) {
			boundingBoxSouth = Number(params.bounding_box.split(',')[0]);
			boundingBoxWest = Number(params.bounding_box.split(',')[1]);
			boundingBoxNorth = Number(params.bounding_box.split(',')[2]);
			boundingBoxEast = Number(params.bounding_box.split(',')[3]);
		}
	});

	const setBoundingBox = () => {
		params.bounding_box = `${boundingBoxSouth},${boundingBoxWest},${boundingBoxNorth},${boundingBoxEast}`;
	};

	let locationMode: Parameters['location_mode'] = $state('location_search');

	onMount(() => {
		locationMode = params.location_mode;
	});

	let csvExample = $state('lat_lon');

	const csvExampleOptions = [
		{ value: 'lat_lon', label: 'Setting multiple latitudes & longitudes' },
		{ value: 'elevation', label: 'Setting an elevation to 2500m' },
		{ value: 'timezone', label: 'Setting a timezone' },
		{ value: 'time_period', label: 'Setting a time period between 2025-01 and 2025-02' },
		{ value: 'all_above', label: 'Setting all of the above' }
	];

	let csvExampleSet = $derived(csvExampleOptions.find((ceo) => ceo.value === csvExample));

	const seamlessModelPresent = $derived.by(() => {
		if (params.models) {
			if (params.models.constructor === Array) {
				for (const model of params.models) {
					if (model.endsWith('_seamless')) {
						return true;
					}
				}
			} else if (typeof params.models === 'string') {
				if (params.models.endsWith('_seamless')) {
					return true;
				}
			}
		} else {
			return false;
		}
	});
</script>

<a href="#location_and_time"
	><h2 id="location_and_time" class="text-2xl md:text-3xl">Location and Time</h2></a
>
<div class="mt-3 -mr-6 flex items-center gap-2 overflow-auto md:mr-0">
	<div class="text-muted-foreground">Location:</div>

	<div class="border-border flex rounded-md border">
		<Button
			variant="ghost"
			class="items-center gap-1 rounded-e-none !opacity-100 duration-300 {locationMode ===
			'location_search'
				? 'bg-accent cursor-not-allowed'
				: ''}"
			disabled={locationMode === 'location_search'}
			onclick={() => {
				locationMode = 'location_search';
				params.location_mode = locationMode;
			}}
		>
			<svg
				class="lucide lucide-locate mr-[1px]"
				xmlns="http://www.w3.org/2000/svg"
				width="19"
				height="19"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="2" x2="5" y1="12" y2="12" />
				<line x1="19" x2="22" y1="12" y2="12" />
				<line x1="12" x2="12" y1="2" y2="5" />
				<line x1="12" x2="12" y1="19" y2="22" />
				<circle cx="12" cy="12" r="7" />
			</svg>Coordinates
		</Button>
		<Button
			variant="ghost"
			class="items-center gap-1 rounded-none !opacity-100 duration-300 {locationMode ===
			'csv_coordinates'
				? 'bg-accent cursor-not-allowed'
				: ''}"
			disabled={locationMode === 'csv_coordinates'}
			onclick={() => {
				locationMode = 'csv_coordinates';
				params.location_mode = locationMode;
			}}
		>
			<svg
				class="lucide lucide-list mr-[1px]"
				xmlns="http://www.w3.org/2000/svg"
				width="19"
				height="19"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M3 12h.01" />
				<path d="M3 18h.01" />
				<path d="M3 6h.01" />
				<path d="M8 12h13" />
				<path d="M8 18h13" />
				<path d="M8 6h13" />
			</svg>List
		</Button>
		<Button
			variant="ghost"
			class="items-center gap-1 rounded-s-none !opacity-100 duration-300 {locationMode ===
			'bounding_box'
				? 'bg-accent cursor-not-allowed'
				: ''}"
			disabled={locationMode === 'bounding_box'}
			onclick={() => {
				locationMode = 'bounding_box';
				params.location_mode = locationMode;
				setBoundingBox();
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-square-dashed-icon lucide-square-dashed mr-[1px]"
				><path d="M5 3a2 2 0 0 0-2 2" /><path d="M19 3a2 2 0 0 1 2 2" /><path
					d="M21 19a2 2 0 0 1-2 2"
				/><path d="M5 21a2 2 0 0 1-2-2" /><path d="M9 3h1" /><path d="M9 21h1" /><path
					d="M14 3h1"
				/><path d="M14 21h1" /><path d="M3 9v1" /><path d="M21 9v1" /><path d="M3 14v1" /><path
					d="M21 14v1"
				/></svg
			>Bounding box
		</Button>
	</div>
</div>

<div class="mt-3 md:mt-4">
	{#if params.location_mode == 'location_search'}
		<div class="flex flex-col" in:fade>
			{#if params.latitude && params.longitude}
				{#each params.latitude as _, index (index)}
					<div
						transition:slide
						class="grid gap-3 duration-300 sm:grid-cols-2 md:gap-6 md:gap-y-3 xl:grid-cols-4 {index <
						params.latitude.length - 1
							? 'pb-6'
							: ''}"
					>
						<div
							class="relative flex flex-col gap-2 duration-200 {params.latitude[index] < -90 ||
							params.latitude[index] > 90
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
								bind:value={params.latitude[index]}
							/>
							<Label
								class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
								for="latitude">Latitude</Label
							>
							{#if params.latitude[index] < -90 || params.latitude[index] > 90}
								<div class="absolute top-14 left-3 text-sm duration-300" transition:slide>
									Latitude must be between -90 and 90
								</div>
							{/if}
						</div>
						<div
							class="relative flex flex-col gap-2 duration-200 {params.longitude[index] < -180 ||
							params.longitude[index] > 180 ||
							(params.longitude[index] > 33 && params.longitude[index] <= 180)
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
								bind:value={params.longitude[index]}
							/>
							<Label
								class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
								for="longitude">Longitude</Label
							>
							{#if params.longitude[index] < -180 || params.longitude[index] > 180}
								<div class="absolute top-14 left-3 text-sm" transition:slide>
									Longitude must be between -180 and 180
								</div>
							{/if}
							{#if params.longitude[index] > 33 && params.longitude[index] <= 180 && params.latitude[index] >= 25}
								<div class="absolute top-14 left-3 text-sm" transition:slide>
									Hint: Use negative longitudes for North America
								</div>
							{/if}
							{#if params.longitude[index] > 33 && params.longitude[index] <= 180 && params.latitude[index] < 25}
								<div class="absolute top-14 left-3 text-sm" transition:slide>
									Hint: Use negative longitudes for South America
								</div>
							{/if}
						</div>
						<div class="relative flex items-center">
							<Select.Root name="timezone" type="single" bind:value={params.timezone}>
								<Select.Trigger
									aria-label="timezone selection"
									class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{timeZone?.label}</Select.Trigger
								>
								<Select.Content preventScroll={false} class="border-border">
									{#each timeZoneOptions as { value, label } (value)}
										<Select.Item {value}>{label}</Select.Item>
									{/each}
								</Select.Content>
								<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
									>Timezone</Label
								>
							</Select.Root>
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
										class="h-12 w-full gap-1 px-5 pr-6"
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
											width="24"
											height="24"
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
			{/if}
		</div>
	{/if}
	{#if params.location_mode == 'csv_coordinates'}
		<div in:fade>
			<div class="flex flex-col gap-3 md:flex-row md:gap-6">
				<div class="md:w-1/2">
					<textarea
						class="border-border w-full rounded-md border p-4 md:mb-4"
						bind:value={params.csv_coordinates}
						rows="13"
					></textarea>
				</div>
				<div class="md:w-1/2">
					<p>
						When using location list mode, you can specify multiple locations in one field. Each
						location should be listed on a new line, with its latitude and longitude separated by a
						comma. You can also optionally include elevation, timezone, and time period for each
						location. However, latitude and longitude are the only required parameters. Format used:
					</p>
					<pre
						class="my-2 overflow-auto rounded-lg md:my-4">latitude,longitude,elevation,timezone,start_date,end_date</pre>
					<div class="relative">
						<Select.Root name="forecast_days" type="single" bind:value={csvExample}>
							<Select.Trigger
								aria-label="Forecast days input"
								class="h-12 cursor-pointer rounded-b-none pt-6 [&_svg]:mb-3"
								>{csvExampleSet.label}</Select.Trigger
							>
							<Select.Content preventScroll={false} class="border-border">
								{#each csvExampleOptions as { value, label } (value)}
									<Select.Item class="cursor-pointer" {value}>{label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
								>Code examples</Label
							>
						</Select.Root>
					</div>
					{#if csvExample === 'lat_lon'}
						<pre class="border-border overflow-auto rounded-b-lg border border-t-0">52.52,13.41
50.12,8.68
53.55,9.99
</pre>{:else if csvExample === 'elevation'}
						<pre class="border-border overflow-auto rounded-b-lg border border-t-0">
52.52,13.41,2500
50.12,8.68,2500
53.55,9.99,2500</pre>
					{:else if csvExample === 'timezone'}
						<pre class="border-border overflow-auto rounded-b-lg border border-t-0">
52.52,13.41,,Europe/Berlin
50.12,8.68,,Europe/Berlin
53.55,9.99,,Europe/Berlin</pre>
					{:else if csvExample === 'time_period'}
						<pre class="border-border overflow-auto rounded-b-lg border border-t-0">
52.52,13.41,,,2025-01-01,2025-01-31
50.12,8.68,,,2025-01-01,2025-01-31
53.55,9.99,,,2025-01-01,2025-01-31</pre>
					{:else if csvExample === 'all_above'}
						<pre class="border-border overflow-auto rounded-b-lg border border-t-0">
52.52,13.41,2500,Europe/Berlin,2025-01-01,2025-01-31
50.12,8.68,2500,Europe/Berlin,2025-01-01,2025-01-31
53.55,9.99,2500,Europe/Berlin,2025-01-01,2025-01-31</pre>
					{/if}
				</div>
			</div>
		</div>
	{/if}
	{#if params.location_mode == 'bounding_box'}
		<div class="flex flex-col gap-3 md:flex-row md:gap-6">
			<div class="flex flex-col gap-3 md:w-1/2">
				<div class="flex md:justify-center">
					<div class="relative flex w-full flex-col gap-2 duration-200 md:w-1/2">
						<Input
							type="number"
							class="h-12 pt-6"
							name="bounding box latitude north"
							id="bb_latitude_north"
							step="0.00001"
							min="-90"
							max="90"
							bind:value={boundingBoxNorth}
							oninput={setBoundingBox}
						/>
						<Label
							class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
							for="bb_latitude_north">Latitude North</Label
						>
					</div>
				</div>

				<div class="flex flex-col gap-3 md:my-3 md:flex-row md:gap-6">
					<div class="relative flex flex-col gap-2 duration-200 md:w-1/2">
						<Input
							type="number"
							class="h-12 pt-6"
							name="longitude"
							id="bb_longitude_west"
							step="0.000001"
							min="-180"
							max="180"
							bind:value={boundingBoxWest}
							oninput={setBoundingBox}
						/>
						<Label
							class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
							for="bb_longitude_west">Longitude West</Label
						>
					</div>
					<div class="relative flex flex-col gap-2 duration-200 md:w-1/2">
						<Input
							type="number"
							class="h-12 pt-6"
							name="longitude"
							id="bb_longitude_east"
							step="0.000001"
							min="-180"
							max="180"
							bind:value={boundingBoxEast}
							oninput={setBoundingBox}
						/>
						<Label
							class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
							for="bb_longitude_east">Longitude East</Label
						>
					</div>
				</div>
				<div class="flex justify-center">
					<div class="relative flex w-full flex-col gap-2 duration-200 md:w-1/2">
						<Input
							type="number"
							class="h-12 pt-6"
							name="bounding box latitude south"
							id="bb_latitude_south"
							step="0.000001"
							min="-90"
							max="90"
							bind:value={boundingBoxSouth}
							oninput={setBoundingBox}
						/>
						<Label
							class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
							for="bb_latitude_south">Latitude South</Label
						>
					</div>
				</div>
			</div>
			<div class="md:w-1/2">
				<p>
					Using bounding box will select grid cells within a specified area, excluding the top and
					right boundaries. For example, a latitude range of 40°...&#60;45° will not include any
					grid points on the 45° line. This exclusion is necessary to allow for combining data from
					multiple API calls when processing larger areas. For instance, a subsequent API call could
					request data from 45°...&#60;50° latitude. Format used:
				</p>
				<pre class="my-2 overflow-auto rounded-lg">&bounding_box=47,-85,47.5,-84.5</pre>
				<p>using (latitude1, longitude1, latitude2, longitude2) or (south, west, north, east).</p>
			</div>
		</div>
		<Alert.Root variant="info" class="mt-2 md:mt-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-info-icon lucide-info"
				><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
			>
			<Alert.Description>
				<p>The results are limited to a maximum of 1000 locations</p>
				<p>
					The bounding box selection method is not recommended for building maps. Several projects
					are already leveraging Open-Meteo data for building maps; you can find an example <a
						href="https://github.com/open-meteo/mapbox-layer">here</a
					>.
				</p>
			</Alert.Description>
		</Alert.Root>
		{#if seamlessModelPresent}
			<div transition:slide>
				<Alert.Root variant="warning" class="mt-2 md:mt-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-triangle-alert-icon lucide-triangle-alert"
						><path
							d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
						/><path d="M12 9v4" /><path d="M12 17h.01" /></svg
					>
					<Alert.Title>
						Bounding box location selection mode does not work with seamless models
					</Alert.Title>
				</Alert.Root>
			</div>
		{/if}
	{/if}
</div>

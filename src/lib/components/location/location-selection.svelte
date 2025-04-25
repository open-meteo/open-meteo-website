<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	import * as Select from '$lib/components/ui/select/index';

	import { type Parameters } from '$lib/docs';

	import type { GeoLocation } from '$lib/stores/settings';

	import LocationSearch from '$lib/components/location/location-search.svelte';

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
</script>

<h2 id="location_and_time" class="text-2xl md:text-3xl">Location and Time</h2>
<div class="mt-3 flex items-center gap-2">
	<div class="text-muted-foreground">Location:</div>

	<div class="border-border flex rounded-md border">
		<Button
			variant="ghost"
			class="rounded-e-none !opacity-100 gap-1 duration-300 {params.location_mode ===
			'location_search'
				? 'bg-accent cursor-not-allowed'
				: ''}"
			disabled={params.location_mode === 'location_search'}
			onclick={() => {
				params.location_mode = 'location_search';
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
			class="rounded-s-none !opacity-100 gap-1 duration-300  {params.location_mode ===
			'csv_coordinates'
				? 'bg-accent'
				: ''}"
			onclick={() => {
				params.location_mode = 'csv_coordinates';
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
	</div>
</div>

<div class="mt-3 md:mt-4">
	{#if params.location_mode == 'location_search'}
		<div class="flex flex-col" in:fade>
			{#each params.latitude as _, index}
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
							class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
							for="latitude">Latitude</Label
						>
						{#if params.latitude[index] < -90 || params.latitude[index] > 90}
							<div class="absolute left-3 top-14 text-sm duration-300" transition:slide>
								Latitude must be between -90 and 90
							</div>
						{/if}
					</div>
					<div
						class="relative flex flex-col gap-2 duration-200 {params.longitude[index] < -180 ||
						params.longitude[index] > 180
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
							class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
							for="longitude">Longitude</Label
						>
						{#if params.longitude[index] < -180 || params.longitude[index] > 180}
							<div class="absolute left-3 top-14 text-sm" transition:slide>
								Longitude must be between -180 and 180
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
								{#each timeZoneOptions as timezone}
									<Select.Item value={timezone.value}>{timezone.label}</Select.Item>
								{/each}
							</Select.Content>
							<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
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
									class="h-12 w-full px-5 pr-6 gap-1"
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
		</div>
	{/if}
	{#if params.location_mode == 'csv_coordinates'}
		<div in:fade>
			<div class="flex flex-col gap-6 md:flex-row">
				<div class="md:w-1/2">
					<textarea
						class="border-border w-full rounded-md border p-4"
						bind:value={params.csv_coordinates}
						rows="5"
					></textarea>
				</div>
				<div class="md:w-1/2">
					<p>
						You can provide multiple coordinates. One per line and separated by commas. For each
						location, you can also set a time period if needed. Format: latitude, longitude,
						elevation, timezone, start_date, end_date. Only latitude and longitude are required.
						Examples:
					</p>
					<pre class="mt-2 overflow-auto rounded-lg md:mt-4">52.52,13.41
51.5085,-0.1257,,auto
52.52,13.41,,Europe/Berlin,2021-01-01,2021-01-31</pre>
				</div>
			</div>
		</div>
	{/if}
</div>

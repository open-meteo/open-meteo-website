<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import * as Select from '$lib/components/ui/select/index';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

	import { type Parameters } from '$lib/components/parameters';

	import type { GeoLocation } from '$lib/stores/settings';

	import LocationSearch from '$lib/components/location/location-search.svelte';

	import Locate from 'lucide-svelte/icons/locate';
	import List from 'lucide-svelte/icons/list';
	import Plus from 'lucide-svelte/icons/plus';
	import Trash from 'lucide-svelte/icons/trash-2';

	interface Props {
		params: Parameters;
	}

	let { params = $bindable() }: Props = $props();

	function locationCallback(event: CustomEvent<GeoLocation>, index: number) {
		params.latitude[index] = Number(event.detail.latitude.toFixed(4));
		params.longitude[index] = Number(event.detail.longitude.toFixed(4));
	}
	function addLocation() {
		params.latitude.push(NaN);
		params.longitude.push(NaN);
	}
	function removeLocation(index: number) {
		params.latitude = params.latitude.toSpliced(index, 1);
		params.longitude = params.longitude.toSpliced(index, 1);
	}

	let locationTabSelected = $derived(params.location_mode);

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

<h2 class="text-2xl md:text-3xl">Location and Time</h2>

<ToggleGroup.Root type="single" value={locationTabSelected} class="mt-3 justify-start gap-0 ">
	<div class="text-muted-foreground">Location:</div>
	<div class="border-border ml-2 flex rounded-lg border">
		<ToggleGroup.Item
			value="location_search"
			class="min-h-12 cursor-pointer rounded-e-none !opacity-100 lg:min-h-[unset] "
			disabled={params.location_mode === 'location_search'}
			onclick={() => {
				params.location_mode = 'location_search';
			}}
		>
			<Locate size={20} class="mr-1" />Coordinates
		</ToggleGroup.Item>
		<ToggleGroup.Item
			value="csv_coordinates"
			class="min-h-12 cursor-pointer rounded-md rounded-s-none !opacity-100 duration-300 lg:min-h-[unset] "
			disabled={params.location_mode === 'csv_coordinates'}
			onclick={() => {
				params.location_mode = 'csv_coordinates';
			}}
		>
			<List size={20} class="mr-1" />List
		</ToggleGroup.Item>
	</div>
</ToggleGroup.Root>

<div class="mt-3 md:mt-4">
	{#if params.location_mode == 'location_search'}
		<div class="flex flex-col" in:fade>
			{#each params.latitude as _, index}
				<div
					transition:slide
					class="grid gap-3 overflow-auto pb-9 sm:grid-cols-2 md:gap-6 xl:grid-cols-4"
				>
					<div class="relative flex flex-col gap-2">
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
							<div class="absolute top-14 text-sm" transition:slide>
								Latitude must be between -90 and 90
							</div>
						{/if}
					</div>
					<div class="relative flex flex-col gap-2">
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
							<div class="absolute top-14 text-sm" transition:slide>
								Longitude must be between -180 and 180
							</div>
						{/if}
					</div>
					<div class="relative flex items-center gap-2">
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
						<LocationSearch
							on:location={(event) => locationCallback(event, index)}
							label="Search"
						/>
						{#if index == 0}
							<Button
								variant="outline"
								class="h-12 cursor-pointer px-5 pr-6"
								onclick={addLocation}
								title="Add coordinates"><Plus size={22} /></Button
							>
						{:else}
							<Button
								variant="outline"
								class="h-12 cursor-pointer px-5  pr-6"
								onclick={() => removeLocation(index)}
								title="Delete coordinates"><Trash size={20} /></Button
							>
						{/if}
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
					<pre class="mt-2 rounded-lg md:mt-4">52.52,13.41
51.5085,-0.1257,,auto
52.52,13.41,,Europe/Berlin,2021-01-01,2021-01-31</pre>
				</div>
			</div>
		</div>
	{/if}
</div>

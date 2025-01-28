<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { writable } from 'svelte/store';

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

	let locationTabSelected = writable(params.location_mode);
	locationTabSelected.subscribe((newTab) => {
		params.location_mode = newTab;
	});
</script>

<h2 class="text-2xl md:text-3xl">Location and Time</h2>

<ToggleGroup.Root type="single" bind:value={$locationTabSelected} class="mt-3 justify-start gap-0 ">
	<div class="text-muted-foreground">Location:</div>
	<div class="ml-2 flex rounded-lg border">
		<ToggleGroup.Item
			value="location_search"
			class="min-h-12 rounded-e-none !opacity-100 lg:min-h-[unset] "
			disabled={params.location_mode === 'location_search'}
		>
			<Locate size={20} class="mr-1" />Coordinates
		</ToggleGroup.Item>
		<ToggleGroup.Item
			value="csv_coordinates"
			class="min-h-12 rounded-md rounded-s-none !opacity-100 duration-300 lg:min-h-[unset] "
			disabled={params.location_mode === 'csv_coordinates'}
		>
			<List size={20} class="mr-1" />List
		</ToggleGroup.Item>
	</div>
</ToggleGroup.Root>

<div class="mt-4">
	{#if params.location_mode == 'location_search'}
		<div class="flex flex-col gap-9" in:fade>
			{#each params.latitude as _, index}
				<div class="flex flex-col gap-6 md:flex-row md:items-center">
					<div class="relative flex flex-col gap-2 md:w-1/4">
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
							class="text-muted-foreground text-xxs absolute left-2 top-2 z-10 px-1"
							for="latitude">Latitude</Label
						>
						{#if params.latitude[index] < -90 || params.latitude[index] > 90}
							<div class="absolute top-14 text-sm" transition:slide>
								Latitude must be between -90 and 90
							</div>
						{/if}
					</div>
					<div class="relative flex flex-col gap-2 md:w-1/4">
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
							class="text-muted-foreground text-xxs absolute left-2 top-2 z-10 px-1"
							for="longitude">Longitude</Label
						>
						{#if params.longitude[index] < -180 || params.longitude[index] > 180}
							<div class="absolute top-14 text-sm" transition:slide>
								Longitude must be between -180 and 180
							</div>
						{/if}
					</div>
					<div class="relative flex items-center gap-2 md:w-1/4">
						<!-- TODO: BIND-->
						<Select.Root name="timezone" selected={{ value: 'UTC', label: 'Not set (GMT+0)' }}>
							<Select.Trigger class="h-12 pt-6">
								<Select.Value />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="America/Anchorage">America/Anchorage</Select.Item>
								<Select.Item value="America/Los_Angeles">America/Los_Angeles</Select.Item>
								<Select.Item value="America/Denver">America/Denver</Select.Item>
								<Select.Item value="America/Chicago">America/Chicago</Select.Item>
								<Select.Item value="America/New_York">America/New_York</Select.Item>
								<Select.Item value="America/Sao_Paulo">America/Sao_Paulo</Select.Item>
								<Select.Item value="UTC">Not set (GMT+0)</Select.Item>
								<Select.Item value="GMT">GMT+0</Select.Item>
								<Select.Item value="auto">Automatically detect time zone</Select.Item>
								<Select.Item value="Europe/London">Europe/London</Select.Item>
								<Select.Item value="Europe/Berlin">Europe/Berlin</Select.Item>
								<Select.Item value="Europe/Moscow">Europe/Moscow</Select.Item>
								<Select.Item value="Africa/Cairo">Africa/Cairo</Select.Item>
								<Select.Item value="Asia/Bangkok">Asia/Bangkok</Select.Item>
								<Select.Item value="Asia/Singapore">Asia/Singapore</Select.Item>
								<Select.Item value="Asia/Tokyo">Asia/Tokyo</Select.Item>
								<Select.Item value="Australia/Sydney">Australia/Sydney</Select.Item>
								<Select.Item value="Pacific/Auckland">Pacific/Auckland</Select.Item>
							</Select.Content>
							<Label class="text-muted-foreground text-xxs absolute left-2 top-2 z-10 px-1"
								>Timezone</Label
							>
						</Select.Root>
					</div>

					<div class="flex gap-6 md:w-1/4">
						<LocationSearch
							on:location={(event) => locationCallback(event, index)}
							label="Search"
						/>
						{#if index == 0}
							<Button
								variant="outline"
								class="h-12 px-5 pr-6"
								onclick={addLocation}
								title="Add coordinates"><Plus size={22} /></Button
							>
						{:else}
							<Button
								variant="outline"
								class="h-12 px-5 pr-6"
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
					<textarea class="w-full rounded-md border" bind:value={params.csv_coordinates} rows="5"
					></textarea>
				</div>
				<div class="md:w-1/2">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import { slide } from 'svelte/transition';

	import { OmFileReader, OmDataType, MemoryHttpBackend } from '@openmeteo/file-reader';

	import mlp from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	const { Map, Marker, AttributionControl } = mlp;

	import * as turf from '@turf/turf';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select/index';

	import { hourly, domains, type Domain, defaultParameters } from './options';
	import { pad } from '$lib/utils/meteo';

	let map;
	let mapContainer: HTMLElement;

	let markers = $state([]);

	const params = urlHashStore({
		...defaultParameters,
		hourly: ['temperature_2m'],
		domain: 'dwd_icon_d2',
		time: '2025_05_27_0900Z'
	});

	let backend = $state<MemoryHttpBackend | null>(null);
	let reader = $state<OmFileReader | null>(null);
	let errorMessage = $state<string>('');

	let domain = $derived<Domain | undefined>(domains.find((d) => d.value === $params.domain));
	let variable = $derived(hourly.flat().find((h) => h.value === $params.hourly[0]));

	let now = new Date();
	let timeSelected = $state<Date>(now);
	$effect(() => {
		let date = new Date();
		let timeSplit = $params.time.split('_');
		date.setUTCFullYear(timeSplit[0]);
		date.setUTCMonth(timeSplit[1] - 1);
		date.setUTCDate(timeSplit[2]);
		date.setUTCHours(timeSplit[3][0] + timeSplit[3][1]);
		date.setUTCMinutes(0);
		date.setUTCSeconds(0);

		timeSelected = date;
	});

	const selectedBounds = $derived([
		[domain.grid.lonMin, domain.grid.latMin],
		[
			domain.grid.lonMin + domain.grid.dx * domain.grid.nx,
			domain.grid.latMin + domain.grid.dy * domain.grid.ny
		]
	]);
	const selectedCenter = $derived([
		selectedBounds[0][0] + (selectedBounds[1][0] - selectedBounds[0][0]) / 2,
		selectedBounds[0][1] + (selectedBounds[1][1] - selectedBounds[0][1]) / 2
	]);

	const arraySize = $derived(domain.grid.nx * domain.grid.ny);

	onMount(async () => {
		const initialState = { lng: selectedCenter[0], lat: selectedCenter[1], zoom: domain.grid.zoom };

		map = new Map({
			container: mapContainer,
			style: `https://maptiler.servert.nl/styles/basic-world/style.json`,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom,
			attributionControl: false
		});

		map.on('load', () => {
			map.addControl(
				new AttributionControl({
					compact: true,
					customAttribution: '<a href="https://open-meteo.com">© Open-Meteo</a>'
				})
			);
		});

		loadOmFile();
	});

	const createDomainBB = () => {
		if (map.getLayer('domain-areas')) {
			map.removeLayer('domain-areas');
		}

		if (map.getSource('domain-area')) {
			map.removeSource('domain-area');
		}

		var bboxIconD2 = turf.bboxPolygon([
			selectedBounds[0][0],
			selectedBounds[0][1],
			selectedBounds[1][0],
			selectedBounds[1][1]
		]);

		map.addSource('domain-area', {
			type: 'geojson',
			data: bboxIconD2
		});
		map.addLayer({
			id: 'domain-areas',
			type: 'fill',
			source: 'domain-area',
			paint: {
				'fill-color': 'orange',
				'fill-opacity': 0.15
			}
		});
	};

	const loadOmFile = async () => {
		if (backend) {
			backend = null;
		}
		if (reader) {
			reader = null;
		}
		for (let marker of markers) {
			marker.remove();
		}
		markers = [];

		let url = `https://openmeteo.s3.amazonaws.com/data_spatial/${domain.value}/${timeSelected.getUTCFullYear()}/${pad(timeSelected.getUTCMonth() + 1)}/${pad(timeSelected.getUTCDate())}/${pad(Math.ceil(timeSelected.getUTCHours() / 3.0) * 3)}00Z/${variable.value}.om`;

		// Create a reader with a file backend
		backend = new MemoryHttpBackend({
			url: url,
			maxFileSize: 500 * 1024 * 1024 // 500 MB
		});
		reader = await OmFileReader.create(backend).catch(({ message }) => {
			if (message.includes('404')) {
				errorMessage = 'File not found';
			}
			return;
		});

		const dimensions = reader.getDimensions();

		// Create ranges for each dimension
		const ranges: Range[] = dimensions.map((dim, i) => {
			return { start: 0, end: dim };
		});
		const data = await reader.read(OmDataType.FloatArray, ranges);

		const coordinates = [];
		for (let [i, _] of new Array(dimensions[0]).entries()) {
			for (let [j, _] of new Array(dimensions[1]).entries()) {
				coordinates.push({
					lng: domain.grid.lonMin + domain.grid.dx * j,
					lat: domain.grid.latMin + domain.grid.dy * i
				});
			}
		}

		for (let [index, coordinate] of coordinates.entries()) {
			if (index % Math.round(arraySize / 1200) === 0) {
				const el = document.createElement('div');
				el.className = 'marker';
				el.style.width = `${14}px`;
				el.style.height = `${14}px`;
				el.innerHTML = `<span class="text-black font-xs">${data[index].toFixed(0)}</span>`;

				if (!isNaN(data[index])) {
					let marker = new Marker({ element: el })
						.setLngLat({ lng: coordinate.lng, lat: coordinate.lat })
						.addTo(map);
					markers.push(marker);
				}
			}
		}

		createDomainBB();
	};

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});

	const setTimeToUrl = () => {
		$params.time = `${timeSelected.getUTCFullYear()}_${pad(timeSelected.getUTCMonth() + 1)}_${pad(timeSelected.getUTCDate())}_${pad(Math.ceil(timeSelected.getUTCHours() / 3.0) * 3)}00Z`;
		setTimeout(() => {
			window.location.reload();
		}, 150);
	};
</script>

<div class="map-wrap">
	<div class="map" bind:this={mapContainer}></div>
</div>

{#if errorMessage}
	<div in:slide class="mt-3 md:mt-6">
		<Alert.Root class="border-border my-auto w-[unset] md:!pl-8">
			<Alert.Description>
				<div class="flex items-center flex-col md:flex-row justify-center gap-2">
					<div class="text-muted-foreground flex items-center">
						{errorMessage}
					</div>
				</div>
			</Alert.Description>
		</Alert.Root>
	</div>
{/if}

<div class="mt-3 md:mt-6">
	<div><h3 class="text-xl md:text-2xl">Variable selection</h3></div>
	<div class="mt-3 relative">
		<Select.Root
			name="Weather variable"
			type="single"
			onValueChange={(e) => {
				$params.hourly = [e];
				// due to memory issue use window reload now, will be replaced by effect
				setTimeout(() => {
					window.location.reload();
				}, 150);
				// loadOmFile()
			}}
		>
			<Select.Trigger
				aria-label="Weather variable selection"
				class="h-12 cursor-pointer pt-6 [&_svg]:mb-3"
				>{hourly.flat().find((h) => $params.hourly[0] === h.value).label}</Select.Trigger
			>
			<Select.Content preventScroll={false} class="border-border">
				{#each hourly.flat() as h}
					<Select.Item value={h.value}>{h.label}</Select.Item>
				{/each}
			</Select.Content>
			<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
				>Weather Variable</Label
			>
		</Select.Root>
	</div>
</div>

<div class="mt-3 md:mt-6">
	<div><h3 class="text-xl md:text-2xl">Model selection</h3></div>
	<div class="mt-3 relative">
		<Select.Root
			name="Domain"
			type="single"
			onValueChange={(e) => {
				$params.domain = e;
				// due to memory issue use window reload now, will be replaced by effect
				setTimeout(() => {
					window.location.reload();
				}, 150);
				// loadOmFile()
			}}
		>
			<Select.Trigger aria-label="Domain selection" class="h-12 cursor-pointer pt-6 [&_svg]:mb-3"
				>{domain.label}</Select.Trigger
			>
			<Select.Content preventScroll={false} class="border-border">
				{#each domains as d}
					<Select.Item value={d.value}>{d.label}</Select.Item>
				{/each}
			</Select.Content>
			<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
				>Domain</Label
			>
		</Select.Root>
	</div>
</div>

<div class="mt-3 md:mt-6">
	<div><h3 class="text-xl md:text-2xl">Time selection</h3></div>
	<div class="flex gap-3 my-3 items-center">
		<Button
			variant="outline"
			class="px-3"
			onclick={() => {
				timeSelected.setUTCHours(timeSelected.getUTCHours() - 3);
				setTimeToUrl();
			}}
			><svg
				class="lucide lucide-chevron-left"
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
				<path d="m15 18-6-6 6-6" />
			</svg></Button
		>
		<div>
			{`${pad(Math.ceil(timeSelected.getUTCHours() / 3.0) * 3)}:00Z`}
		</div>

		<Button
			variant="outline"
			class="px-3"
			onclick={() => {
				timeSelected.setUTCHours(timeSelected.getUTCHours() + 3);
				setTimeToUrl();
			}}
			><svg
				class="lucide lucide-chevron-right"
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
				<path d="m9 18 6-6-6-6" />
			</svg>
		</Button>
	</div>
	<div class="relative">
		<Input
			id="date_string"
			type="text"
			class="h-12 cursor-pointer pt-6 {$params.tilt < 0 || $params.tilt > 90 ? 'text-red' : ''}"
			value={`${timeSelected.getUTCFullYear()}_${pad(timeSelected.getUTCMonth() + 1)}_${pad(timeSelected.getUTCDate())}_${pad(Math.ceil(timeSelected.getUTCHours() / 3.0) * 3)}00Z`}
			onchange={(e) => {
				$params.time = e.target.value;
				setTimeout(() => {
					window.location.reload();
				}, 150);
			}}
		/>
		<Label
			class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
			for="date_string">Date string</Label
		>
	</div>
</div>

<style>
	.map-wrap {
		position: relative;
		width: 100%;
		height: 50vh; /* calculate height of the screen minus the heading */
	}

	.map {
		position: absolute;
		width: 100%;
		min-height: 100%;
	}
</style>

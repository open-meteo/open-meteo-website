<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import { fade, slide } from 'svelte/transition';

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

	import { hourly, defaultParameters } from '../../docs/options';

	let map;
	let mapContainer: HTMLElement;

	let markers = $state([]);

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['temperature_2m']
	});

	let backend = $state<MemoryHttpBackend | null>(null);
	let reader = $state<OmFileReader | null>(null);
	let errorMessage = $state<string>('');

	let variable = $derived<string>($params.hourly[0]);

	let timeUTC = $state();

	const iconD2Bounds = [
		[-3.94, 43.18],
		[-3.94 + 0.02 * 1215, 43.18 + 0.02 * 746]
	];
	const iconD2Center = [
		iconD2Bounds[0][0] + (iconD2Bounds[1][0] - iconD2Bounds[0][0]) / 2,
		iconD2Bounds[0][1] + (iconD2Bounds[1][1] - iconD2Bounds[0][1]) / 2
	];

	const iconEUBounds = [
		[29.5, -23.5],
		[29.5 + 0.0625 * 1377, -23.5 + 0.0625 * 746]
	];
	const iconGlobalBounds = [
		[-90, -180],
		[-90 + 0.125 * 2879, -180 + 0.125 * 1441]
	];

	onMount(async () => {
		const initialState = { lng: iconD2Center[0], lat: iconD2Center[1], zoom: 3.75 };

		map = new Map({
			container: mapContainer,
			style: `https://maptiler.servert.nl/styles/basic-world/style.json`,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom,
			attributionControl: false
		});

		var bboxIconD2 = turf.bboxPolygon([
			iconD2Bounds[0][0],
			iconD2Bounds[0][1],
			iconD2Bounds[1][0],
			iconD2Bounds[1][1]
		]);

		map.on('load', () => {
			map.addSource('domain-areas', {
				type: 'geojson',
				data: bboxIconD2
			});
			map.addLayer({
				id: 'domain-areas',
				type: 'fill',
				source: 'domain-areas',
				paint: {
					'fill-color': 'orange',
					'fill-opacity': 0.2
				}
			});

			map.addControl(
				new AttributionControl({
					compact: true,
					customAttribution: 'Open-Meteo'
				})
			);
		});

		loadOmFile();
	});

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

		// Create a reader with a file backend
		backend = new MemoryHttpBackend({
			url: `https://openmeteo.s3.amazonaws.com/data_spatial/dwd_icon_d2/2025/05/22/1200Z/${variable}.om`,
			maxFileSize: 500 * 1024 * 1024 // 2 GB
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
				coordinates.push([43.18 + i * 0.02, -3.94 + j * 0.02]);
			}
		}

		for (let [index, coordinate] of coordinates.entries()) {
			if (index % 1000 === 0) {
				const el = document.createElement('div');
				el.className = 'marker';
				el.style.width = `${14}px`;
				el.style.height = `${14}px`;
				el.innerHTML = `<span class="text-black">${data[index].toFixed(0)}</span>`;

				if (!isNaN(data[index])) {
					let marker = new Marker({ element: el })
						.setLngLat({ lat: coordinate[0], lng: coordinate[1] })
						.addTo(map);
					markers.push(marker);
				}
			}
		}
	};

	$effect(() => {
		//loadOmFile();
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
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
	<!-- <div><h3 class="text-xl md:text-2xl">Variable selection</h3></div> -->
	<div class="relative">
		<Select.Root
			name="timezone"
			type="single"
			onValueChange={(e) => {
				$params.hourly = [e];
				loadOmFile();
			}}
		>
			<Select.Trigger aria-label="timezone selection" class="h-12 cursor-pointer pt-6 [&_svg]:mb-3"
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
	<div><h3 class="text-xl md:text-2xl">Time selection</h3></div>
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

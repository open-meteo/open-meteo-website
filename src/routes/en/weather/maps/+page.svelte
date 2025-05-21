<script lang="ts">
	import { OmFileReader, OmDataType, MemoryHttpBackend } from '@openmeteo/file-reader';

	import { onMount, onDestroy } from 'svelte';
	import mlp from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';

	const { Map } = mlp;

	let map;
	let mapContainer: HTMLElement;

	onMount(async () => {
		const initialState = { lng: 13.41, lat: 52.52, zoom: 3 };

		map = new Map({
			container: mapContainer,
			style: `https://maptiler.servert.nl/styles/basic-world/style.json`,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom
		});

		// Create a reader with a file backend
		const backend = new MemoryHttpBackend({
			url: '/chunk_3996.om',
			maxFileSize: 500 * 1024 * 1024, // 500 MB
			//debug: true,
			onProgress: (loaded, total) => {
				const percent = Math.round((loaded / total) * 100);
				console.log(`Downloaded: ${loaded} / ${total} bytes (${percent}%)`);
			}
		});
		const reader = await OmFileReader.create(backend);
		const dimensions = await reader.getDimensions();
		console.log(reader, dimensions);

		// Create ranges for each dimension
		const ranges: Range[] = dimensions.map((dim, i) => {
			if (i === 2) {
				// Time dimension - select only current timestamp
				return {
					start: 0,
					end: 1
				};
			} else {
				// Other dimensions - select all
				return { start: 0, end: dim };
			}
		});

		// Read data for the specified dimensions
		const data = await reader.read(OmDataType.FloatArray, ranges);
		console.log(data);
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

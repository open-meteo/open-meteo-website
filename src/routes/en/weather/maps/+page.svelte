<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import { OmFileReader, OmDataType, MemoryHttpBackend } from '@openmeteo/file-reader';

	import mlp from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';

	const { Map, Marker } = mlp;

	let map;
	let mapContainer: HTMLElement;

	onMount(async () => {
		const initialState = { lng: 13.41, lat: 52.52, zoom: 4 };

		map = new Map({
			container: mapContainer,
			style: `https://maptiler.servert.nl/styles/basic-world/style.json`,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom
		});

		// Create a reader with a file backend
		const backend = new MemoryHttpBackend({
			url: 'https://openmeteo.s3.amazonaws.com/data_spatial/dwd_icon_d2/2025/05/22/1200Z/temperature_2m.om',
			maxFileSize: 500 * 1024 * 1024 // 500 MB
			// debug: true,
			// onProgress: (loaded, total) => {
			// 	const percent = Math.round((loaded / total) * 100);
			// 	console.log(`Downloaded: ${loaded} / ${total} bytes (${percent}%)`);
			// }
		});
		const reader = await OmFileReader.create(backend);
		const dimensions = reader.getDimensions();

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
		const data = await reader.read(OmDataType.FloatArray, ranges);

		const coordinates = [];
		//coordinates[coordinates.length - 1] = [45.405453, 349.8256];

		for (let [i, _] of new Array(dimensions[0]).entries()) {
			for (let [j, _] of new Array(dimensions[1]).entries()) {
				coordinates.push([43.18 + i * 0.02, -3.94 + j * 0.02]);
			}
		}

		const markers = [];
		for (let [index, coordinate] of coordinates.entries()) {
			if (index % 1000 === 0) {
				const el = document.createElement('div');
				el.className = 'marker';
				el.style.width = `${40}px`;
				el.style.height = `${40}px`;
				el.innerHTML = `<span class="text-black">${data[index].toFixed(0)}</span>`;

				if (!isNaN(data[index])) {
					let marker = new Marker({ element: el })
						.setLngLat({ lat: coordinate[0], lng: coordinate[1] })
						.addTo(map);
				}
			}
		}

		// Read data for the specified dimensions
		console.log(reader, dimensions, coordinates);
		console.log(data);
		console.log(coordinates[0], coordinates[coordinates.length - 1]);
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

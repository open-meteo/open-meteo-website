<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import { OmFileReader, OmDataType, MemoryHttpBackend } from '@openmeteo/file-reader';

	import mlp from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	const { Map, Marker } = mlp;

	import * as turf from '@turf/turf';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { defaultParameters } from '../../docs/options';

	let map;
	let mapContainer: HTMLElement;

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['temperature_2m']
	});

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
			zoom: initialState.zoom
		});

		// Create a reader with a file backend
		const backend = new MemoryHttpBackend({
			url: 'https://openmeteo.s3.amazonaws.com/data_spatial/dwd_icon_d2/2025/05/22/1200Z/temperature_2m.om',
			maxFileSize: 500 * 1024 * 1024 // 2 GB
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
			// if (i === 2) {
			// 	// Time dimension - select only current timestamp
			// 	return {
			// 		start: 0,
			// 		end: 1
			// 	};
			// } else {
			// Other dimensions - select all
			return { start: 0, end: dim };
			//}
		});
		const data = await reader.read(OmDataType.FloatArray, ranges);

		const coordinates = [];
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
				el.style.width = `${14}px`;
				el.style.height = `${14}px`;
				el.innerHTML = `<span class="text-black">${data[index].toFixed(0)}</span>`;

				if (!isNaN(data[index])) {
					new Marker({ element: el })
						.setLngLat({ lat: coordinate[0], lng: coordinate[1] })
						.addTo(map);
				}
			}
		}

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
		});

		console.log(iconD2Bounds);
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

<div class="mt-3 md:mt-6">
	<div>Time selection</div>
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

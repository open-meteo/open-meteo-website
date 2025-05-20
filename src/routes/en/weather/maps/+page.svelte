<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import mlp from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';

	const { Map } = mlp;

	let map;
	let mapContainer: HTMLElement;

	onMount(() => {
		const initialState = { lng: 13.41, lat: 52.52, zoom: 9 };

		map = new Map({
			container: mapContainer,
			style: `https://maptiler.servert.nl/styles/basic-world/style.json`,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom
		});
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

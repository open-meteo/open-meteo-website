<!-- @migration-task Error while migrating Svelte code: `<tr>` cannot be a child of `<table>`. `<table>` only allows these children: `<caption>`, `<colgroup>`, `<tbody>`, `<thead>`, `<tfoot>`, `<style>`, `<script>`, `<template>`. The browser will 'repair' the HTML (by moving, removing, or inserting elements) which breaks Svelte's assumptions about the structure of your components.
https://svelte.dev/e/node_invalid_placement -->
<script lang="ts">
	import { altitudeAboveSeaLevelMeters } from '$lib/meteo';
    export let levels: number[]
</script>

<div class="table-responsive">
	<table class="table">
		<tr>
			<th>Level (hPa)</th>
            {#each levels as level}
            <td>{level}</td>
            {/each}
		</tr>
		<tr>
			<th>Altitude</th>
            {#each levels as level}
            <td>{altitudeAboveSeaLevelMeters(level)}</td>
            {/each}
		</tr>
	</table>
</div>

<script lang="ts">
	import { altitudeAboveSeaLevelMeters } from '$lib/utils/meteo';
	export let levels: number[];
</script>

<div class="table-responsive">
	<table class="table">
		<tbody>
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
		</tbody>
	</table>
</div>

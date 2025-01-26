<script lang="ts">
	import { altitudeAboveSeaLevelMeters } from '$lib/utils/meteo';
	export let levels: number[];
</script>

<div class="table-responsive">
	<table
		class="mt-6 w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_tr]:border-b"
	>
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

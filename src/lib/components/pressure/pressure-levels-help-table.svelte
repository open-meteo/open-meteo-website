<script lang="ts">
	import { altitudeAboveSeaLevelMeters } from '$lib/utils/meteo';

	interface Props {
		levels: number[];
	}

	let { levels }: Props = $props();
</script>

<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
	<!--
	44 levels: GFS,
	30 levels: GEM, CMA
	19 levels: Weather forecast, DWD,
	11 levels: JMA,
	-->
	<table
		class="docs-table w-full {levels.length > 40
			? 'min-w-700'
			: levels.length > 25
				? 'min-w-500'
				: levels.length > 15
					? 'min-w-300'
					: 'min-w-200'}"
	>
		<tbody>
			<tr>
				<th>Level (hPa)</th>
				{#each levels as level (level)}
					<td>{level}</td>
				{/each}
			</tr>
			<tr>
				<th>Altitude</th>
				{#each levels as level (level)}
					<td>{altitudeAboveSeaLevelMeters(level)}</td>
				{/each}
			</tr>
		</tbody>
	</table>
</div>

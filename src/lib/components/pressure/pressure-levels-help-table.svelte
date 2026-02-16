<script lang="ts">
	import { altitudeAboveSeaLevelMeters } from '$lib/utils/meteo';

	interface Props {
		levels: number[];
	}

	let { levels }: Props = $props();
</script>

<div class="-mx-6 overflow-auto md:ml-0 lg:mx-0">
	<!--
	min-w-[2700px] 44 levels: GFS,
	min-w-[1900px] 30 levels: GEM, CMA
	min-w-[1250px] 19 levels: Weather forecast, DWD,
	min-w-[780px] 11 levels: JMA,
	-->
	<table
		class="mx-6 mt-2 caption-bottom md:ml-0 lg:mx-0 min-w-[{levels.length > 40
			? '2700px'
			: levels.length > 25
				? '1900px'
				: levels.length > 15
					? '1250px'
					: '780px'}] w-full text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
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

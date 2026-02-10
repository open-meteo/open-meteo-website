<script lang="ts">
	import { altitudeAboveSeaLevelMeters } from '$lib/utils/meteo';

	import Button from '$lib/components/ui/button/button.svelte';

	let {
		pressureVariables = [
			{ name: 'temperature', label: 'Temperature' },
			{ name: 'relative_humidity', label: 'Relative Humidity' },
			{ name: 'cloud_cover', label: 'Cloud cover' },
			{ name: 'wind_speed', label: 'Wind Speed' },
			{ name: 'wind_direction', label: 'Wind Direction' },
			{ name: 'geopotential_height', label: 'Geopotential Height' }
		],
		levels = [
			30, 50, 70, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900, 925, 950, 975, 1000
		].reverse()
	} = $props();

	let selectedOptions: string[] = $state([]);

	function sliceIntoChunks<T>(arr: Array<T>, chunkSize: number): Array<Array<T>> {
		const res = [];
		for (let i = 0; i < arr.length; i += chunkSize) {
			const chunk = arr.slice(i, i + chunkSize);
			res.push(chunk);
		}
		return res;
	}
</script>

<div class="accordion-item">
	<h2 class="accordion-header" id="heading-pressure-levels">
		<Button>
			Pressure Levels{#if selectedOptions.length > 0}&nbsp;<span
					class="badge rounded-pill bg-secondary"
					>{selectedOptions.length}/{pressureVariables.length * levels.length}</span
				>{/if}
		</Button>
	</h2>
	<div id="collapse-pressure-levels">
		<div class="accordion-body">
			<div class="   ">
				<div class="nav flex-column me-3">
					{#each pressureVariables as variable, i (i)}
						<Button>{variable.label}</Button>
					{/each}
				</div>
				<div>
					{#each pressureVariables as variable, i (i)}
						<div
							class:active={i === 0}
							class:show={i === 0}
							id="v-pills-{variable.name}"
							aria-labelledby="v-pills-{variable.name}-tab"
						>
							<div>
								{#each sliceIntoChunks(levels, levels.length / 3 + 1) as chunk, j (j)}
									<div>
										{#each chunk as level, k (k)}
											<div>
												<input
													type="checkbox"
													value="{variable.name}_{level}hPa"
													id="{variable.name}_{level}hPa"
													name="hourly"
													bind:group={selectedOptions}
												/>
												<label for="{variable.name}_{level}hPa">
													{level} hPa
													<small class="text-muted-foreground"
														>({altitudeAboveSeaLevelMeters(level)})</small
													>
												</label>
											</div>
										{/each}
									</div>
								{/each}
							</div>
						</div>
					{/each}
					<div class="mt-3">
						<small class="text-muted-foreground"
							>Note: Altitudes are approximate and in meters <strong> above sea level</strong> (not
							above ground). Use <mark>geopotential_height</mark> to get precise altitudes above sea level.</small
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

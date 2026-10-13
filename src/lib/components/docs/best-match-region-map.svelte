<script lang="ts">
	import { BEST_MATCH_FOOTPRINTS } from '#lib/assets/best-match-footprints.js';
	import { WORLD_LAND } from '#lib/assets/world-land.js';

	import {
		type BestMatchRegion,
		GLOBAL_MODELS,
		type LatLonBox,
		MAX_HOURS,
		MODELS,
		type ModelId,
		REGIONS,
		type View,
		activeModel
	} from './best-match-regions.js';

	const id = $props.id();

	// Mercator in degree-like units: x is the longitude, y grows southwards so
	// SVG's downward axis needs no flip, and latitude boxes stay rectangles.
	const mercatorY = (lat: number) => {
		const clamped = Math.max(-85, Math.min(85, lat));
		return -(180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (clamped * Math.PI) / 360));
	};
	const point = ([lon, lat]: [number, number]) => `${lon.toFixed(2)},${mercatorY(lat).toFixed(2)}`;
	const ringPath = (ring: [number, number][]) => `M${ring.map(point).join('L')}Z`;

	const LAND_PATH = WORLD_LAND.map(ringPath).join('');
	const FOOTPRINT_PATHS = Object.fromEntries(
		Object.entries(BEST_MATCH_FOOTPRINTS).map(([domain, ring]) => [domain, ringPath(ring)])
	);

	/** [west, south, east, north], framed like the static region maps of the maps project. */
	const VIEWS: Record<View, [number, number, number, number]> = {
		europe: [-30, 28, 64, 75],
		world: [-145, -55, 155, 78]
	};
	const frame = (view: View) => {
		const [west, south, east, north] = VIEWS[view];
		return {
			x: west,
			y: mercatorY(north),
			width: east - west,
			height: mercatorY(south) - mercatorY(north)
		};
	};
	// text and leaders scale with the map; sized for the ~600 px each map gets in the docs grid
	const unit = (view: View) => frame(view).width / 600;

	const boxRect = (box: LatLonBox) => ({
		x: box.lonMin,
		y: mercatorY(box.latMax),
		width: box.lonMax - box.lonMin,
		height: mercatorY(box.latMin) - mercatorY(box.latMax)
	});
	const rectPath = ({ x, y, width, height }: ReturnType<typeof boxRect>) =>
		`M${x},${y}h${width}v${height}h${-width}Z`;

	/** A region's area: its footprint (the box clips it below), or the box itself minus the cutout. */
	const regionPath = (region: BestMatchRegion) => {
		if (region.footprint) {
			return FOOTPRINT_PATHS[region.footprint];
		}
		return rectPath(boxRect(region.box!)) + (region.cutout ? ringPath(region.cutout) : '');
	};
	const clipped = (region: BestMatchRegion) => Boolean(region.footprint && region.box);

	// lowest priority first, so the API's first match ends up on top
	const PAINT_ORDER = REGIONS.map((region, index) => ({ region, index })).reverse();

	let hours = $state(0);
	const active = $derived(REGIONS.map((region) => activeModel(region.models, hours)));
	const globalModel = $derived(activeModel(GLOBAL_MODELS, hours));
	// fixed order, so a model keeps its place in the legend as others come and go
	const legend = $derived(
		(Object.keys(MODELS) as ModelId[]).filter(
			(model) => model === globalModel || active.includes(model)
		)
	);
	const timeLabel = $derived(
		`+${hours} h (day ${Math.floor(hours / 24)}, ${String(hours % 24).padStart(2, '0')}:00)`
	);
</script>

{#snippet map(view: View)}
	{@const box = frame(view)}
	<svg
		viewBox="{box.x} {box.y.toFixed(2)} {box.width} {box.height.toFixed(2)}"
		class="border-border w-full rounded-lg border"
		role="img"
		aria-label="Best match regions {view === 'europe' ? 'over Europe' : 'worldwide'} at {timeLabel}"
	>
		<defs>
			{#each REGIONS as region, index (region.name)}
				{#if clipped(region)}
					<clipPath id="{id}-{view}-{index}"><rect {...boxRect(region.box!)} /></clipPath>
				{/if}
			{/each}
		</defs>
		<rect {...box} class="region" style="--fill: var(--model-{globalModel})">
			<title>Everywhere else: {MODELS[globalModel].label}</title>
		</rect>
		{#each PAINT_ORDER as { region, index } (region.name)}
			<path
				d={regionPath(region)}
				fill-rule="evenodd"
				clip-path={clipped(region) ? `url(#${id}-${view}-${index})` : undefined}
				class="region"
				style="--fill: var(--model-{active[index]})"
			>
				<title>
					{region.name}: {MODELS[active[index]].label} until +{MODELS[active[index]].hours} h
				</title>
			</path>
		{/each}
		<path d={LAND_PATH} class="land" vector-effect="non-scaling-stroke" />
		{#each REGIONS as region, index (region.name)}
			{@const label = region.labels[view]}
			{#if label && active[index] !== globalModel}
				{@const [x, y] = [label.at[0], mercatorY(label.at[1])]}
				{#if label.leader}
					<line
						x1={x}
						y1={y}
						x2={label.leader[0]}
						y2={mercatorY(label.leader[1])}
						class="leader"
						vector-effect="non-scaling-stroke"
					/>
				{/if}
				<text
					{x}
					{y}
					text-anchor={label.anchor ?? 'middle'}
					dominant-baseline="middle"
					font-size={unit(view) * 13}
					stroke-width={unit(view) * 3}
					class="label"
				>
					{MODELS[active[index]].label}
				</text>
			{/if}
		{/each}
	</svg>
{/snippet}

<div class="best-match-map mt-3 flex flex-col gap-3 md:mt-6">
	<p>
		Drag the slider through the forecast period: as each model's horizon ends, the next model in a
		region's chain takes over, until only the global models remain.
	</p>
	<label class="flex flex-wrap items-center gap-3 text-sm">
		<span class="text-muted-foreground">Forecast hour</span>
		<input
			type="range"
			min="0"
			max={MAX_HOURS}
			step="1"
			bind:value={hours}
			aria-valuetext={timeLabel}
			class="accent-primary min-w-48 grow"
		/>
		<span class="tabular-nums">{timeLabel}</span>
	</label>
	<div class="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-2">
		{@render map('europe')}
		{@render map('world')}
	</div>
	<ul class="flex flex-wrap gap-x-4 gap-y-1 text-sm">
		{#each legend as model (model)}
			<li class="flex items-center gap-1.5">
				<span class="swatch size-3 rounded-sm" style="--fill: var(--model-{model})"></span>
				{MODELS[model].label}{model === globalModel ? ' (everywhere else)' : ''}
				<span class="text-muted-foreground">to +{MODELS[model].hours} h</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	/* One colour per model (the regional palette of the maps project's region
	   screenshots plus the later fallbacks), stepped for each theme. IFS HRES is
	   the neutral baseline: a region whose chain has reached it visibly
	   dissolves into "everywhere else". */
	.best-match-map {
		--model-knmi_harmonie: #1fc4b5;
		--model-metno_nordic: #d3964c;
		--model-ukmo_ukv: #951057;
		--model-icon_d2: #2f7eb6;
		--model-arome_hd: #5f7127;
		--model-dmi_harmonie: #9a58f5;
		--model-hrrr: #d192fb;
		--model-jma_msm: #512cc7;
		--model-icon_eu: #b06372;
		--model-gfs: #137738;
		--model-ukmo_global: #769cef;
		--model-arpege_europe: #a21f8f;
		--model-icon: #c8ad3f;
		--model-ifs_hres: #aab3c0;
	}
	:global(.dark) .best-match-map {
		--model-knmi_harmonie: #00998c;
		--model-metno_nordic: #be7904;
		--model-ukmo_ukv: #9a3b65;
		--model-icon_d2: #06669e;
		--model-arome_hd: #586a13;
		--model-dmi_harmonie: #7d14dd;
		--model-hrrr: #c153ff;
		--model-jma_msm: #8988cc;
		--model-icon_eu: #f24c79;
		--model-gfs: #2c721a;
		--model-ukmo_global: #366298;
		--model-arpege_europe: #953972;
		--model-icon: #b48c2b;
		--model-ifs_hres: #4b5566;
	}
	.region,
	.swatch {
		fill: color-mix(in oklab, var(--fill) 50%, var(--background));
		background: color-mix(in oklab, var(--fill) 50%, var(--background));
	}
	.land {
		fill: var(--foreground);
		fill-opacity: 0.08;
		stroke: var(--foreground);
		stroke-opacity: 0.45;
		stroke-width: 0.7px;
	}
	.leader {
		stroke: var(--foreground);
		stroke-width: 1px;
	}
	.label {
		fill: var(--foreground);
		font-weight: 600;
		paint-order: stroke;
		stroke: var(--background);
		stroke-linejoin: round;
	}
</style>

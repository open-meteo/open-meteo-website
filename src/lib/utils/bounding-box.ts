import { DOMAIN_GRIDS, type DomainGrid } from '#lib/assets/domain-grids.js';

export interface BoundingBox {
	south: number;
	west: number;
	north: number;
	east: number;
}

export interface GridCells {
	label: string;
	columns: number;
	rows: number;
}

type Spacing = Pick<DomainGrid, 'unit' | 'dx' | 'dy'>;

/** Grid cells per side of the default box: the 2 × 2 block of grid points around a coordinate. */
export const DEFAULT_CELLS = 2;

/** Spacing assumed when none of the selected models has a known grid. */
const FALLBACK_SPACING: Spacing = { unit: 'degrees', dx: 0.25, dy: 0.25 };

const DEGREES_PER_KM = 360 / (2 * Math.PI * 6371);

/**
 * API model values whose data domain is listed under another name in
 * weather-map-layer. Whole families (native ICON grids, ensemble means) are
 * resolved by suffix in `domainGrid`; this covers the one-off renames.
 */
const MODEL_DOMAINS: Record<string, string> = {
	dwd_icon_global: 'dwd_icon',
	dwd_icon_global_eps: 'dwd_icon_eps',
	ncep_gfs_global: 'ncep_gfs013',
	ncep_aigefs025: 'ncep_gefs025',
	cmc_gem_gdps: 'cmc_gem_gdps_15km',
	cmc_gem_rdps: 'cmc_gem_rdps_10km',
	gem_global_ensemble: 'cmc_gem_geps',
	meteofrance_arpege_world: 'meteofrance_arpege_world025',
	meteofrance_arome_france: 'meteofrance_arome_france0025',
	meteofrance_arome_france_15min: 'meteofrance_arome_france0025_15min',
	metno_nordic: 'metno_nordic_pp',
	ewam: 'dwd_ewam',
	gwam: 'dwd_gwam',
	ecmwf_seas5: 'ecmwf_seas5_monthly',
	ecmwf_ec46: 'ecmwf_ec46_weekly',
	ukmo_global_ensemble_mean_20km: 'ukmo_global_ensemble_20km',
	ukmo_uk_ensemble_mean_2km: 'ukmo_uk_ensemble_2km'
};

/**
 * Grids of models that weather-map-layer does not serve. KMA LDPS is the only
 * one fine enough that the fallback spacing would exceed the API's 1000
 * locations per request.
 */
const EXTRA_GRIDS: Record<string, DomainGrid> = {
	kma_ldps: { label: 'KMA LDPS', unit: 'km', dx: 1.5, dy: 1.5 }
};

/** Grid of an API model value, if known. Seamless models have no single grid. */
export const domainGrid = (model: string): DomainGrid | undefined => {
	// native ICON grids and ensemble means share the grid of their parent model
	const base = model.replace(/_native$/, '').replace(/_ensemble_mean$/, '_ensemble');
	const parent = base.replace(/_ensemble$/, '');
	for (const name of [model, base, MODEL_DOMAINS[base], parent, MODEL_DOMAINS[parent]]) {
		if (name !== undefined && name in DOMAIN_GRIDS) {
			return DOMAIN_GRIDS[name];
		}
		if (name !== undefined && name in EXTRA_GRIDS) {
			return EXTRA_GRIDS[name];
		}
	}
	return undefined;
};

/** Spacing in degrees of longitude and latitude at the given latitude. */
const spacingDegrees = (spacing: Spacing, latitude: number) => {
	if (spacing.unit === 'degrees') {
		return { lon: spacing.dx, lat: spacing.dy };
	}
	const cosine = Math.max(Math.cos((latitude * Math.PI) / 180), 0.01);
	return { lon: (spacing.dx * DEGREES_PER_KM) / cosine, lat: spacing.dy * DEGREES_PER_KM };
};

const round = (value: number) => Math.round(value * 1e6) / 1e6;

/**
 * Box of `cells` × `cells` grid cells centred on a coordinate. The API rounds
 * both edges to the nearest grid index, so a box exactly two spacings wide
 * always holds the two columns bracketing the coordinate, however the grid is
 * aligned. With several models the coarsest sets the size, so every model
 * returns at least the block and finer models return more.
 */
export const boundingBoxAround = (
	latitude: number,
	longitude: number,
	models: string[],
	cells = DEFAULT_CELLS
): BoundingBox | undefined => {
	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
		return undefined;
	}
	const grids = models.map(domainGrid).filter((grid) => grid !== undefined);
	const spacings = (grids.length ? grids : [FALLBACK_SPACING]).map((grid) =>
		spacingDegrees(grid, latitude)
	);
	const lon = (Math.max(...spacings.map((spacing) => spacing.lon)) * cells) / 2;
	const lat = (Math.max(...spacings.map((spacing) => spacing.lat)) * cells) / 2;
	return {
		south: round(Math.max(latitude - lat, -90)),
		west: round(Math.max(longitude - lon, -180)),
		north: round(Math.min(latitude + lat, 90)),
		east: round(Math.min(longitude + lon, 180))
	};
};

/** Grid cells a box selects per model with a known grid, as the API counts them. */
export const estimateGridCells = (box: BoundingBox, models: string[]): GridCells[] => {
	if (!Object.values(box).every(Number.isFinite)) {
		return [];
	}
	const latitude = (box.south + box.north) / 2;
	return models.flatMap((model) => {
		const grid = domainGrid(model);
		if (!grid) {
			return [];
		}
		const spacing = spacingDegrees(grid, latitude);
		return [
			{
				label: grid.label,
				columns: Math.max(Math.round((box.east - box.west) / spacing.lon), 0),
				rows: Math.max(Math.round((box.north - box.south) / spacing.lat), 0)
			}
		];
	});
};

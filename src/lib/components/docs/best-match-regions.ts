/**
 * The Forecast API's `best_match` routing: which models serve which area, in
 * the API's evaluation order, and how long each model's forecast reaches.
 *
 * Mirrors `MultiDomains.best_match` in open-meteo's ForecastapiController.swift
 * (the first region containing a coordinate wins; within a region the finest
 * model with data at a timestep wins, so the chain below is the order in which
 * models take over as the previous one's horizon ends) and the forecast lengths
 * of the model tables in these docs. Update both together.
 */

export interface BestMatchModel {
	label: string;
	/** Forecast horizon in hours after the model run. */
	hours: number;
}

export const MODELS = {
	knmi_harmonie: { label: 'KNMI HARMONIE', hours: 60 },
	metno_nordic: { label: 'MET Nordic', hours: 60 },
	ukmo_ukv: { label: 'UKMO UKV', hours: 48 },
	ukmo_global: { label: 'UKMO Global', hours: 168 },
	icon_d2: { label: 'ICON D2', hours: 48 },
	icon_eu: { label: 'ICON EU', hours: 120 },
	icon: { label: 'ICON', hours: 180 },
	arome_hd: { label: 'AROME France HD', hours: 48 },
	arpege_europe: { label: 'ARPEGE Europe', hours: 96 },
	dmi_harmonie: { label: 'DMI HARMONIE', hours: 60 },
	hrrr: { label: 'HRRR', hours: 48 },
	jma_msm: { label: 'JMA MSM', hours: 96 },
	ifs_hres: { label: 'ECMWF IFS HRES', hours: 360 },
	gfs: { label: 'GFS', hours: 384 }
} satisfies Record<string, BestMatchModel>;

export type ModelId = keyof typeof MODELS;

export interface LatLonBox {
	latMin: number;
	latMax: number;
	lonMin: number;
	lonMax: number;
}

export type View = 'europe' | 'world';

export interface RegionLabel {
	/** [longitude, latitude] where the label sits. */
	at: [number, number];
	/** Leader line from the label into the region, for regions too small to hold it. */
	leader?: [number, number];
	anchor?: 'start' | 'middle' | 'end';
}

export interface BestMatchRegion {
	name: string;
	/** Models in the order they take over as the forecast horizon of the previous one ends. */
	models: ModelId[];
	/** Grid whose footprint bounds the region (see best-match-footprints.ts); a plain box otherwise. */
	footprint?: string;
	/** Lat/lon check the API applies before using the regional model. */
	box?: LatLonBox;
	/** Area carved out of the box: the English Channel triangle that keeps northern France out of the UK region. */
	cutout?: [number, number][];
	labels: Partial<Record<View, RegionLabel>>;
}

/** Regions in the API's evaluation order; the first one containing a coordinate wins. */
export const REGIONS: BestMatchRegion[] = [
	{
		name: 'Netherlands & Belgium',
		models: ['knmi_harmonie', 'ifs_hres'],
		footprint: 'knmi_harmonie_arome_netherlands',
		box: { latMin: 49.35, latMax: 53.79, lonMin: 2.19, lonMax: 7.66 },
		labels: { europe: { at: [9.9, 56.9], anchor: 'start', leader: [7.3, 53.7] } }
	},
	{
		name: 'Scandinavia',
		models: ['metno_nordic', 'ifs_hres'],
		footprint: 'metno_nordic_pp',
		box: { latMin: 54.9, latMax: 90, lonMin: -180, lonMax: 180 },
		labels: { europe: { at: [17.5, 66.5] } }
	},
	{
		name: 'United Kingdom & Ireland',
		models: ['ukmo_ukv', 'ukmo_global', 'ifs_hres'],
		box: { latMin: 49.9, latMax: 61, lonMin: -11, lonMax: 1.8 },
		cutout: [
			[-0.2, 49.9],
			[1.8, 49.9],
			[1.8, 51.1]
		],
		labels: { europe: { at: [-4.6, 57.2] } }
	},
	{
		name: 'Central Europe',
		models: ['icon_d2', 'icon_eu', 'icon', 'ifs_hres'],
		footprint: 'dwd_icon_d2',
		labels: { europe: { at: [14.4, 50.6] } }
	},
	{
		name: 'France & Western Europe',
		models: ['arome_hd', 'arpege_europe', 'ifs_hres'],
		footprint: 'meteofrance_arome_france0025',
		box: { latMin: 42.1, latMax: 51.32, lonMin: -6.18, lonMax: 8.35 },
		labels: { europe: { at: [0.4, 44.2] } }
	},
	{
		name: 'Northern Europe & Iceland',
		models: ['dmi_harmonie', 'ifs_hres'],
		footprint: 'dmi_harmonie_arome_europe',
		box: { latMin: 44, latMax: 66, lonMin: -180, lonMax: 180 },
		labels: { europe: { at: [-19.5, 64.8] } }
	},
	{
		name: 'North America',
		models: ['hrrr', 'gfs'],
		footprint: 'ncep_hrrr_conus',
		labels: { world: { at: [-100, 39] } }
	},
	{
		name: 'Japan',
		models: ['jma_msm', 'ifs_hres'],
		footprint: 'jma_msm',
		box: { latMin: 27.4, latMax: 42.65, lonMin: 125, lonMax: 145 },
		labels: { world: { at: [138, 19.5], leader: [136.5, 27.5] } }
	},
	{
		name: 'Remaining Europe',
		models: ['icon_eu', 'icon', 'ifs_hres'],
		footprint: 'dwd_icon_eu',
		labels: { europe: { at: [44, 38] }, world: { at: [42, 35] } }
	}
];

/** Models serving every location no region claims. */
export const GLOBAL_MODELS: ModelId[] = ['ifs_hres', 'gfs'];

/** Last forecast hour the map covers: the IFS horizon, after which only GFS remains. */
export const MAX_HOURS = MODELS.ifs_hres.hours;

/** Model in charge at a forecast hour: the first in the chain whose horizon reaches it. */
export const activeModel = (models: ModelId[], hours: number): ModelId =>
	models.find((id) => MODELS[id].hours >= hours) ?? models[models.length - 1];

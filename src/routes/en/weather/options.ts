export const defaultParameters = {
	timeformat: 'iso8601',
	wind_speed_unit: 'kmh',
	temperature_unit: 'celsius',
	precipitation_unit: 'mm'
};

export const models = [
	{ value: 'best_match', label: 'Best match' },
	{ value: 'gfs_seamless', label: 'NCEP GFS Seamless' },
	{ value: 'jma_seamless', label: 'JMA Seamless' },
	{ value: 'kma_seamless', label: 'KMA Seamless' },
	{ value: 'icon_seamless', label: 'DWD ICON Seamless' },
	{ value: 'gem_seamless', label: 'GEM Seamless' },
	{ value: 'meteofrance_seamless', label: 'Météo-France Seamless' },
	{ value: 'arpae_cosmo_seamless', label: 'ARPAE Seamless' },
	{ value: 'metno_seamless', label: 'MET Norway Seamless (with ECMWF)' },
	{ value: 'knmi_seamless', label: 'KNMI Seamless (with ECMWF)' },
	{ value: 'dmi_seamless', label: 'DMI Seamless (with ECMWF)' },
	{ value: 'ukmo_seamless', label: 'UK Met Office Seamless' }
];

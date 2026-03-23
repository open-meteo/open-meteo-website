import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'DMI Forecast API',
		heroDescription: 'Weather forecasts from the Danish Meteorological Institute',
		heroImage: 'iceland_glacier_lake.webp'
	};
}) satisfies LayoutLoad;

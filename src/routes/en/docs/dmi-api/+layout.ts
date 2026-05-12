import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'DMI Forecast API',
		heroDescription: 'Weather forecasts from the Danish Meteorological Institute',
		heroImage: '/images/backgrounds/iceland_glacier_lake.webp',
		heroImagePosition: 'center 70%'
	};
}) satisfies LayoutLoad;

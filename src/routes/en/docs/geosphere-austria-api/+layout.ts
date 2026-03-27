import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'GeoSphere Austria API',
		heroDescription: 'Weather forecasts from the GeoSphere Austria API',
		heroImage: 'pizol.jpg',
		heroImagePosition: 'center 65%'
	};
}) satisfies LayoutLoad;

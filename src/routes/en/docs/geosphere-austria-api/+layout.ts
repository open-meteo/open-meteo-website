import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'GeoSphere Austria API',
		heroDescription: 'Weather forecasts from the GeoSphere Austria API',
		heroImage: '/images/backgrounds/convective_clouds.webp'
	};
}) satisfies LayoutLoad;

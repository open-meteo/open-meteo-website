import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Model Updates and Data Availability',
		heroDescription: 'Overview of Model Timings and Data Availability via Open-Meteo API',
		heroImage: '/images/backgrounds/mountain_road.webp'
	};
}) satisfies LayoutLoad;

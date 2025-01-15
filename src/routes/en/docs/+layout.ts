import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'Weather Forecast API',
		subtitle: 'Seamless integration of high-resolution weather models with up 16 days forecast',
		hero: '/images/partly_cloudy.webp'
	};
}) satisfies LayoutLoad;

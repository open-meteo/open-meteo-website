import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'DWD ICON API',
		subtitle: 'Open data weather forecasts from the German weather service DWD',
		hero: '/images/cloudy2.webp'
	};
}) satisfies LayoutLoad;

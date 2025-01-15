import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'Previous Model Runs API',
		subtitle: 'Weather Forecasts from Previous Days to Compare Run-To-Run Performance',
		hero: '/images/clouds.webp'
	};
}) satisfies LayoutLoad;

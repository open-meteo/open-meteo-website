import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Previous Model Runs API',
		heroDescription: 'Weather Forecasts from Previous Days to Compare Run-To-Run Performance',
		heroImage: '/images/backgrounds/clouds.webp'
	};
}) satisfies LayoutLoad;

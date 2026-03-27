import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'MET Norway API',
		heroDescription: 'Hourly updates & 1 km forecasts for Scandinavia',
		heroImage: '/images/backgrounds/klausenpass.webp'
	};
}) satisfies LayoutLoad;

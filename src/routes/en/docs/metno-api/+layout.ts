import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'MET Norway API',
		heroDescription: 'Hourly updates & 1 km forecasts for Scandinavia',
		heroImage: '/images/klausenpass.webp'
	};
}) satisfies LayoutLoad;

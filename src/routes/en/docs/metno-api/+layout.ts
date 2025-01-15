import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'MET Norway API',
		subtitle: 'Hourly updates & 1 km forecasts for Scandinavia',
		hero: '/images/klausenpass.webp'
	};
}) satisfies LayoutLoad;

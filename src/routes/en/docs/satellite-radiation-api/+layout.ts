import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'Satellite Radiation API',
		subtitle: 'Real-time Solar Irradiance From Multiple Satellites',
		hero: '/images/cirrus.webp'
	};
}) satisfies LayoutLoad;

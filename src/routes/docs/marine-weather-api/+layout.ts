import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'Marine Weather API',
		subtitle: 'Hourly wave forecasts at 5 km resolution',
		hero: '/images/beach.webp'
	};
}) satisfies LayoutLoad;

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Geosphere Austria API',
		heroDescription: 'Weather forecasts from the Geosphere Austria API',
		heroImage: '/images/backgrounds/todo.webp'
	};
}) satisfies LayoutLoad;

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'ItaliaMeteo ARPAE ICON-2i',
		heroDescription: 'Open data weather forecasts from the Italian weather service ItaliaMeteo',
		heroImage: '/images/cloudy2.webp'
	};
}) satisfies LayoutLoad;

import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'JMA API',
		heroDescription: '5-km high resolution forecasts for Japan, Korea, parts of China and Russia',
		heroImage: '/images/cloudy_cirrus.webp'
	};
}) satisfies LayoutLoad;

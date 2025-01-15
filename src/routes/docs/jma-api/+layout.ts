import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		title: 'JMA API',
		subtitle: '5-km high resolution forecasts for Japan, Korea, parts of China and Russia',
		hero: '/images/cloudy_cirrus.webp'
	};
}) satisfies LayoutLoad;

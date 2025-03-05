import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	return {
		heroTitle: 'Weather Forecast API',
		heroDescription:
			'Seamless integration of high-resolution weather models with up 16 days forecast',
		heroImage: '/images/partly_cloudy.webp',
		heroHeight: 400,
		heroPrimaryButtonPath: null,
		heroPrimaryButtonText: null,
		heroSecondaryButtonPath: null,
		heroSecondaryButtonText: null
	};
};

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	return {
		heroTitle: 'Satellite Radiation API',
		heroDescription: 'Real-time Solar Irradiance From Multiple Satellites',
		heroImage: '/images/cirrus',
		heroHeight: 400,
		heroPrimaryButtonPath: null,
		heroPrimaryButtonText: null,
		heroSecondaryButtonPath: null,
		heroSecondaryButtonText: null
	};
};

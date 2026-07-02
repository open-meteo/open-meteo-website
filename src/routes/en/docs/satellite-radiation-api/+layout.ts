import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Satellite Radiation API',
		heroDescription: 'Real-time Solar Irradiance From Multiple Satellites',
		heroImage: '/images/backgrounds/cirrus.webp',
		heroHeight: 400,
		heroPrimaryButtonPath: null,
		heroPrimaryButtonText: null,
		heroSecondaryButtonPath: null,
		heroSecondaryButtonText: null
	};
}) satisfies LayoutLoad;

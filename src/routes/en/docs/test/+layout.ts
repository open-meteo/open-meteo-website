import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	return {
		heroTitle: 'Test page',
		heroDescription: 'test test',
		heroImage: '/images/partly_cloudy.webp',
		heroHeight: 400,
		heroPrimaryButtonPath: null,
		heroPrimaryButtonText: null,
		heroSecondaryButtonPath: null,
		heroSecondaryButtonText: null
	};
};

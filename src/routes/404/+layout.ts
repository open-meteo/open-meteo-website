import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	const { pathname } = event.url;

	return {
		pathname,
		heroImage: '/images/backgrounds/features_background.webp',
		heroHeight: 600,
		heroTitle: '404: Page Not Found',
		heroDescription: 'Sorry, the page you are looking for does not exist.',
		heroPrimaryButtonPath: null,
		heroPrimaryButtonText: null,
		heroSecondaryButtonPath: null,
		heroSecondaryButtonText: null
	};
};

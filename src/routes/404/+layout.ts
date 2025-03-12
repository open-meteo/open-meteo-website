import type { LayoutLoad } from './$types';

import Logo from '$lib/assets/icons/rain.svg?raw&inline';

export const load: LayoutLoad = async (event) => {
	const { pathname } = event.url;

	return {
		pathname,
		Logo,
		heroImage: '/images/features_background.webp',
		heroHeight: 600,
		heroTitle: '404: Page Not Found',
		heroDescription: 'Sorry, the page you are looking for does not exist.',
		heroPrimaryButtonPath: null,
		heroPrimaryButtonText: null,
		heroSecondaryButtonPath: null,
		heroSecondaryButtonText: null
	};
};

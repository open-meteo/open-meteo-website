export const prerender = true;
export const trailingSlash = 'never';
//export const ssr = true;

import type { LayoutLoad } from './$types';

import { i18n } from '$lib/i18n';

import * as m from '$lib/paraglide/messages.js';

export const load: LayoutLoad = async (event) => {
	const { pathname } = event.url;

	return {
		pathname,
		heroImage: '/images/convective_clouds.webp',
		heroHeight: 600,
		heroTitle: m.home_hero_title(),
		heroDescription: m.home_hero_description(),
		heroPrimaryButtonPath: '/en/features',
		heroPrimaryButtonText: m.features(),
		heroSecondaryButtonPath: '/en/docs',
		heroSecondaryButtonText: m.try_api()
	};
};

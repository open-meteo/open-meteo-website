import type { LayoutLoad } from './$types';

import { i18n } from '$lib/i18n';

import * as m from '$lib/paraglide/messages.js';

export const load = (() => {
	return {
		heroImage: '/images/features_background.webp',
		heroHeight: 500,
		heroTitle: m.features(),
		heroDescription: m.features_description(),
		heroPrimaryButtonPath: '#available-apis',
		heroPrimaryButtonText: m.available_apis(),
		heroSecondaryButtonPath: '/en/pricing',
		heroSecondaryButtonText: m.pricing()
	};
}) satisfies LayoutLoad;

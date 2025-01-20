import type { LayoutLoad } from './$types';

import { i18n } from '$lib/i18n';

import * as m from '$lib/paraglide/messages.js';

export const load = (() => {
	return {
		heroImage: '/images/snowy.webp',
		heroHeight: 500,
		heroTitle: m.pricing(),
		heroDescription: m.pricing_description(),
		heroPrimaryButtonPath: '#plans',
		heroPrimaryButtonText: m.plans(),
		heroSecondaryButtonPath: i18n.route('/docs'),
		heroSecondaryButtonText: m.docs()
	};
}) satisfies LayoutLoad;

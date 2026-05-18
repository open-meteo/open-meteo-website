import type { LayoutLoad } from './$types';

export const load = (() => {
	return {
		heroTitle: 'Model Runs S3',
		heroDescription:
			'Leverage OM data directly from S3 storage, enabling efficient access and integration for your applications',
		heroImage: '/images/backgrounds/klausenpass.webp' // fixme: new background image
	};
}) satisfies LayoutLoad;

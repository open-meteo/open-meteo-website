import Sun from '$lib/assets/icons/sun.svelte';

import Hero from './hero.svelte';

describe('Hero', () => {
	it('should load hero', () => {
		cy.mount(Hero, {
			props: {
				Logo: Sun,
				heroImage: '/images/convective_clouds.webp',
				heroHeight: 600,
				heroTitle: 'Free Weather API',
				heroDescription:
					'Open-Meteo is an open-source weather API and offers free access for non-commercial use. No API key required. Start using it now!',
				heroPrimaryButtonPath: '/en/features',
				heroPrimaryButtonText: 'Features',
				heroSecondaryButtonPath: '/en/docs',
				heroSecondaryButtonText: 'Try the API here'
			}
		});
	});
});

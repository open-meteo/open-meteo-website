import LicenseSelector from './license-selector.svelte';

describe('LicenseSelector', () => {
	it('should switch licenses', () => {
		cy.mount(LicenseSelector);
	});
});

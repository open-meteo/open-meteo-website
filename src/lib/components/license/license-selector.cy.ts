import LicenseSelector from './license-selector.svelte';

describe('LicenseSelector', () => {
	it('should switch licenses', () => {
		cy.mount(LicenseSelector);
		cy.get('#commercial').click({ force: true });
		cy.wait(200);
		cy.get('#apikey').clear().type('uwhefiuwbhef').invoke('val').should('contain', 'uwhefiuwbhef');
	});
});

import LicenceSelector from './licence-selector.svelte';

describe('LicenceSelector', () => {
	it('should switch licences', () => {
		cy.mount(LicenceSelector);
		cy.get('#commercial').click({ force: true });
		cy.wait(200);
		cy.get('#apikey').clear().type('uwhefiuwbhef').invoke('val').should('contain', 'uwhefiuwbhef');
	});
});

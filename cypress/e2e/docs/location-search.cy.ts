describe('template spec', () => {
	it('passes', () => {
		cy.visit('http://localhost:4173/en/docs');

		cy.get('#location_search').click();
		cy.wait(500);
		cy.get('#location_search_input').clear().type('Paris');
		cy.wait(500);
		cy.get('#location_search_results:nth-child(2)').click();
		cy.url().should('include', 'latitude=48.8534');
		cy.url().should('include', 'latitude=2.3488');
	});
});

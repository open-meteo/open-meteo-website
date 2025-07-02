describe('template spec', () => {
	it('should change lat & lon when clicked on searched result', () => {
		cy.visit('/en/docs');
		cy.wait(500);

		cy.get('#location_search').click();
		cy.wait(200);
		cy.get('#location_search_input').clear().type('Paris');
		cy.wait(200);
		cy.get('#location_search_results > .location-search-result').first().click();
		cy.url().should('include', 'latitude=48.8534');
		cy.url().should('include', 'longitude=2.3488');

		// check last visited
		cy.get('#location_search').click();
		cy.wait(200);
		cy.get('#location_search_last_visited').children().should('have.length', 1);

		// check adding favorite
		cy.get('#location_search_input').clear().type('Paris');
		cy.wait(200);
		cy.get('#location_search_results > .location-search-result')
			.first()
			.within(() => {
				cy.get('button:first-of-type').click();
			});
		cy.get('#location_search_favorites').children().should('have.length', 1);

		// check removing favorite
		cy.get('#location_search_favorites > .location-search-favorite')
			.first()
			.within(() => {
				cy.get('button:first-of-type').click();
			});
	});
});

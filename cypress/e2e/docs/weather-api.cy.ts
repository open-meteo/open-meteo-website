describe('template spec', () => {
	it('should reflect new url data after altering some variables by clicking form elements', () => {
		cy.visit('/en/docs');
		cy.wait(500);

		cy.get('#latitude').clear().type(55.2);
		cy.url().should('include', 'latitude=55.2');

		cy.get('[aria-label="timezone selection"]').click();
		cy.get('[data-label="Europe/Berlin"]').click();
		cy.url().should('include', 'timezone=Europe%2FBerlin');

		cy.get('#rain_hourly').click();
		cy.get('#showers_hourly').click();
		cy.get('#snowfall_hourly').click();
		cy.url().should('include', 'hourly=temperature_2m,rain,showers,snowfal');
	});
});

describe('BOM API', () => {
	beforeEach(() => {
		cy.visit(`bom-api`);
		cy.wait(500);
	});
	it('should add hourly variables to the url', () => {
		cy.testHourly(['bom_access_global']);
	});
});

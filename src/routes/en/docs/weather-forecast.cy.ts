describe('Weather API', () => {
	beforeEach(() => {
		cy.visit('/');
		cy.wait(500);
	});
	it('should add hourly variables to the url', () => {
		cy.testHourly();
	});
});

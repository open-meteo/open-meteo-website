describe('DWD API', () => {
	beforeEach(() => {
		cy.visit(`dwd-api`);
		cy.wait(500);
	});
	it('should add hourly variables to the url', () => {
		cy.testHourly(['icon_seamless']);
	});
});

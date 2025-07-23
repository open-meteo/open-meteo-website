describe('ItaliaMeteo API', () => {
	beforeEach(() => {
		cy.visit(`italia-meteo-arpae-api`);
		cy.wait(500);
	});
	it('should add hourly variables to the url', () => {
		cy.testHourly(['italia_meteo_arpae_icon_2i'], { lat: '45.4643', lon: '9.1895' });
	});
});

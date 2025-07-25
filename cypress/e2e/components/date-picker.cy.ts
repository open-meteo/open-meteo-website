const begin_date = new Date();
begin_date.setMonth(begin_date.getMonth() - 3);

const last_date = new Date();
last_date.setDate(last_date.getDate() + 16);

const startDate = new Date();
startDate.setUTCDate(startDate.getUTCDate() - 7);
const start_date = startDate.toISOString().split('T')[0];

const endDate = new Date();
endDate.setUTCDate(endDate.getUTCDate() + 7);
if (endDate.getTime() > last_date.getTime()) {
	endDate.setUTCDate(last_date.getUTCDate());
}
let end_date = endDate.toISOString().split('T')[0];

describe('DatePicker', () => {
	it('should open date picker with correct values', () => {
		const startDateInput = () => cy.get('#start_date_input');
		const endDateInput = () => cy.get('#end_date_input');

		cy.visit('?time_mode=time_interval');
		cy.wait(1000);

		startDateInput().click().invoke('val').should('contain', start_date);
		endDateInput().invoke('val').should('contain', end_date);

		endDate.setUTCDate(endDate.getUTCDate() + 7);
		end_date = endDate.toISOString().split('T')[0];

		endDateInput().clear().type(end_date);
		cy.url().should('include', `end_date=${end_date}`);

		// Check January has 31 days, and February 28
		startDateInput().clear().type('2025-01-01');
		cy.get('#start_date_days').children().should('have.length', 31);
		startDateInput().clear().type('2025-02-01');
		cy.get('#start_date_days').children().should('have.length', 28);
	});
});

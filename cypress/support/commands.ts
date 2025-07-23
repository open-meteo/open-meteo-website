/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
	namespace Cypress {
		interface Chainable {
			testHourly(
				models?: string[],
				location?: { lat: string; lon: string },
				hourly?: string[],
				url?: string
			): Chainable<void>;
		}
	}
}

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

Cypress.Commands.add(
	'testHourly',
	(
		models = undefined,
		location = { lat: '50.1155', lon: '8.6842' },
		hourly = ['temperature_2m', 'rain', 'showers', 'snowfall'],
		url = 'https://api.open-meteo.com/v1/forecast'
	) => {
		cy.get('#latitude').clear().type(location.lat);
		cy.url().should('include', `latitude=${location.lat}`);
		cy.get('#longitude').clear().type(location.lon);
		cy.url().should('include', `longitude=${location.lon}`);

		cy.get('[aria-label="timezone selection"]').click();
		cy.get('[data-label="Europe/Berlin"]').click();
		cy.url().should('include', 'timezone=Europe%2FBerlin');

		for (const h of hourly) {
			if (h !== 'temperature_2m') {
				cy.get('#' + h + '_hourly').click();
			}
		}
		cy.url().should('include', 'hourly=' + hourly.join(','));

		cy.get('#api_url')
			.invoke('val')
			.should(
				'contain',
				`${url}?latitude=${location.lat}&longitude=${location.lon}&hourly=${hourly.join(',')}${models ? '&models=' + models.join(',') : ''}&timezone=Europe%2FBerlin`
			);
	}
);

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

export {};

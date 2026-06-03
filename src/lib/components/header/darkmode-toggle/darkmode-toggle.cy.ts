import { ModeWatcher } from 'mode-watcher';

import DarkmodeToggle from './darkmode-toggle.svelte';

describe('DarkmodeToggle', () => {
	it('should switch modes', () => {
		cy.mount(ModeWatcher).then(() => {
			cy.mount(DarkmodeToggle);
			cy.get('[aria-label="Toggle theme"]').click();
		});
	});
});

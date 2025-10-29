import { ModeWatcher, mode, setMode } from 'mode-watcher';

import DarkmodeToggle from './darkmode-toggle.svelte';

describe('DarkmodeToggle', () => {
	it('should switch modes', () => {
		cy.mount(ModeWatcher).then(() => {
			cy.mount(DarkmodeToggle);
			cy.get('#darkmode_toggle').click();
		});
	});
});

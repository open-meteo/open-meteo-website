import DarkmodeToggle from './darkmode-toggle.svelte';
import { ModeWatcher, setMode, mode } from 'mode-watcher';

describe('DarkmodeToggle', () => {
	it('should switch modes', () => {
		cy.mount(ModeWatcher).then(() => {
			cy.mount(DarkmodeToggle);
			cy.get('#darkmode_toggle').click();
		});
	});
});

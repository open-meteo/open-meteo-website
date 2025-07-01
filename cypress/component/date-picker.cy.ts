import DatePicker from '../../src/lib/components/date/date-picker.svelte';

describe('date-picker.cy.ts', () => {
	it('mounts', () => {
		cy.mount(DatePicker);
	});
});

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import '@poppanator/sveltekit-svg/dist/svg';

declare module '*.svx';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

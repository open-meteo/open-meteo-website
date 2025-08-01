import { defineConfig } from 'cypress';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

import path from 'path';

export default defineConfig({
	component: {
		setupNodeEvents(on, config) {
			return Object.assign({}, config);
		},
		devServer: {
			framework: 'svelte',
			bundler: 'vite',
			viteConfig: () => {
				return {
					resolve: {
						alias: {
							$lib: path.resolve('./src/lib')
						}
					},
					plugins: [tailwindcss(), svelte()]
				};
			}
		},
		specPattern: 'src/**/*.{cy,unit}.{js,jsx,ts,tsx}'
	},
	// env: {
	// 	browserPermissions: {
	// 		geolocation: 'allow'
	// 	}
	// },
	e2e: {
		baseUrl: 'http://localhost:4173/en/docs/',
		video: true,
		videoCompression: 32,
		specPattern: [
			'cypress/e2e/**/*.{cy,unit}.{js,jsx,ts,tsx}',
			'src/routes/en/docs/**/*.{cy,unit}.{js,jsx,ts,tsx}'
		]
	}
});

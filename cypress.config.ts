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
	e2e: {
		baseUrl: 'http://localhost:5173',
		supportFile: false,
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		video: true,
		videoCompression: 32
		//videoUploadOnPasses: true
	}
});

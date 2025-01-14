import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Make sure highcharts and highstock are bundled separately
function manualChunks(id) {
	//return `${id}`.replace('/','_');
	if (id.includes('stock.js')) {
		return 'highstock';
	}
	if (id.includes('highcharts')) {
		return 'highcharts';
	}
	/*if (id.includes('node_modules')) {
		return 'vendor';
	}*/
}

export default defineConfig({
	plugins: [sveltekit()],

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;'
			}
		}
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: manualChunks
			}
		}
	},
	optimizeDeps: {
		exclude: ['highcharts']
	}
});

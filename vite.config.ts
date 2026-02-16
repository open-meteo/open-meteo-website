import svg from '@poppanator/sveltekit-svg';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { type UserConfig, defineConfig } from 'vite';

function replaceChunkNames() {
	return {
		name: 'replace-chunk-names-plugin',
		apply: 'build' as const,
		config(config: UserConfig) {
			const output = config.build?.rollupOptions?.output;
			if (output && !Array.isArray(output) && typeof output.chunkFileNames === 'string') {
				output.chunkFileNames = output.chunkFileNames.replace('[hash]', `[name].[hash].chunk`);
			}
			return config;
		}
	};
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		enhancedImages(),
		sveltekit(),
		svg(),
		replaceChunkNames(),
		visualizer({
			filename: 'build-stats.json',
			template: 'raw-data'
		})
	]
});

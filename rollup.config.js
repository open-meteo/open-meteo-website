import { fileURLToPath } from 'node:url';

export default {
	output: {
		manualChunks: (id) => {
			if (id.endsWith('.svg?component')) {
				console.log(id);
				return 'icons';
			}
		}
	},
	external: [
		// '/src/lib/assets/icons/snow.svg?component',
		// '/src/lib/assets/icons/cog.svg?component',
		// '/src/lib/assets/icons/sun.svg?component',
		// '/src/lib/assets/icons/rain.svg?component',
	]
};

// mdsvex publishes type definitions (dist/main.es.d.ts) but its package.json
// exports map has no "types" entries, so TypeScript cannot resolve them
declare module 'mdsvex' {
	import type { PreprocessorGroup } from 'svelte/compiler';

	export interface MdsvexOptions {
		extensions?: string[];
		highlight?:
			| {
					highlighter?: (code: string, lang?: string) => string | Promise<string>;
					alias?: Record<string, string>;
			  }
			| false;
		[key: string]: unknown;
	}

	export function mdsvex(options?: MdsvexOptions): PreprocessorGroup;
	export function escapeSvelte(str: string): string;
}

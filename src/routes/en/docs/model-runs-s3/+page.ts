import type { PageLoad } from './$types';

const BASE = 'https://openmeteo.s3.amazonaws.com';

const listPrefixes = async (fetch: typeof globalThis.fetch, prefix: string): Promise<string[]> => {
	const encoded = prefix.replaceAll('/', '%2F');
	const res = await fetch(`${BASE}/?list-type=2&delimiter=%2F&prefix=${encoded}`);
	const xml = await res.text();
	return [...xml.matchAll(/<Prefix>([^<]+)<\/Prefix>/g)]
		.map((m) => m[1])
		.filter((p) => p !== prefix);
};

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Level 1: all model names under data_run/
		const modelPrefixes = await listPrefixes(fetch, 'data_run/');
		const models = modelPrefixes.map((p) => p.slice('data_run/'.length, -1));

		return { models };
	} catch (error) {
		console.error('Error fetching models:', error);
		return { models: [] };
	}
};

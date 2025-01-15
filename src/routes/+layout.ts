import type { LayoutLoad } from './$types';

export const prerender = true;
export const trailingSlash = 'never';
//export const ssr = true;

export const load: LayoutLoad = async (event) => {
	const { pathname } = event.url;

	return {
		pathname
	};
};

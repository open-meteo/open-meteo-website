import type { Parameters } from '$lib/docs';
import { camelCase, titleCase } from '$lib/utils';

import { INT_64_VARIABLES } from '$lib/constants';

export const javaCodeExample = (
	params: Parameters,
	multipleLocationsOrModels: boolean,
	numberOfLocations: number | string,
	numberOfModels: number,
	server: string,
	sdk_type: string,
	previewUrl: string
) => {
	const t = multipleLocationsOrModels;

	let c = `<div><pre class="java" style="background-color:var(--code-preview-background);color:var(--code-preview-foreground)" tabindex="0"><code><span class="line"></span><span class="line"><span style="color:var(--code-preview-token-keyword-special);font-style:italic;">import</span><span style="color:var(--code-preview-token-constant)"> OpenMeteoSdk</span></span>
<span class="line"></span>`;
	c += `
${t ? '<span class="line"><span style="color:var(--code-preview-token-punctuation-mark)">}</span></span>' : ''}</code></pre></div>`;
	return c;
};

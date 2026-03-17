// Short helper functions for generating syntax-highlighted HTML spans.
// Each function wraps text in a <span> with the corresponding CSS variable color.

// Keywords
export const kw = (t: string) =>
	`<span style="color:var(--code-preview-token-keyword)">${t}</span>`;
export const kwi = (t: string) =>
	`<span style="color:var(--code-preview-token-keyword);font-style:italic">${t}</span>`;
export const kwsp = (t: string) =>
	`<span style="color:var(--code-preview-token-keyword-special)">${t}</span>`;
export const kwspi = (t: string) =>
	`<span style="color:var(--code-preview-token-keyword-special);font-style:italic">${t}</span>`;

// Identifiers and literals
export const vr = (t: string) =>
	`<span style="color:var(--code-preview-token-variable)">${t}</span>`;
export const fn = (t: string) =>
	`<span style="color:var(--code-preview-token-function)">${t}</span>`;
export const num = (t: string) =>
	`<span style="color:var(--code-preview-token-constant)">${t}</span>`;
export const str = (t: string) =>
	`<span style="color:var(--code-preview-token-string-expression)">${t}</span>`;
export const strk = (t: string) =>
	`<span style="color:var(--code-preview-token-string-key)">${t}</span>`;
export const acc = (t: string) =>
	`<span style="color:var(--code-preview-token-accent)">${t}</span>`;

// Punctuation and structure
export const pm = (t: string) =>
	`<span style="color:var(--code-preview-token-punctuation-mark)">${t}</span>`;
export const p = (t: string) =>
	`<span style="color:var(--code-preview-token-punctuation)">${t}</span>`;
export const br = (t: string) =>
	`<span style="color:var(--code-preview-token-bracket)">${t}</span>`;

// Comments, foreground, parameters
export const cmt = (t: string) =>
	`<span style="color:var(--code-preview-token-comment);font-style:italic">${t}</span>`;
export const fg = (t: string) => `<span style="color:var(--code-preview-foreground)">${t}</span>`;
export const fgi = (t: string) =>
	`<span style="color:var(--code-preview-foreground);font-style:italic">${t}</span>`;
export const par = (t: string) =>
	`<span style="color:var(--code-preview-token-parameter);font-style:italic">${t}</span>`;
export const it = (t: string) => `<span style="font-style:italic">${t}</span>`;

// Line structure
export const line = (content: string, indent = false) =>
	`${indent ? '\t' : ''}<span class="line">${content}</span>`;

export const empty = (indent = false) => line('', indent);

// Compound tokens
export const quotedStr = (t: string) => pm('"') + str(t) + pm('"');

export const stringArrayTokens = (items: string[]) =>
	br(`[${pm('"')}`) +
	items.map((v) => str(v)).join(`${pm('"')}${pm(`, ${pm('"')}`)}`) +
	pm('"') +
	br(']');

export const numericArrayTokens = (items: (string | number)[]) =>
	br('[') + items.join(pm(', ')) + br(']');

// Shared logic
export const normalizeAggregation = (agg: string) => {
	if (agg === 'max') return 'maximum';
	if (agg === 'min') return 'minimum';
	return agg;
};

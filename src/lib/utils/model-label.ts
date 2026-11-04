// A discontinued model keeps its selector entry so stored URLs and old
// requests still resolve, with a "(Discontinued <date>)" suffix in its label.
// Selectors render that suffix muted next to the model name.
const DISCONTINUED = /^(.*?)\s*(\(Discontinued[^)]*\))$/;

export const splitDiscontinued = (label: string): { name: string; note?: string } => {
	const match = DISCONTINUED.exec(label);
	return match ? { name: match[1], note: match[2] } : { name: label };
};

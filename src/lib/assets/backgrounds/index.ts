import type { Picture } from 'vite-imagetools';

const images: Record<string, { default: Picture }> = import.meta.glob(
	['./*.webp', './*.jpg', './originals/*.jpg', './originals/*.webp'],
	{
		query: { enhanced: true, imgSizes: '100vw' },
		eager: true
	}
);

const imageMap = new Map<string, Picture>();
for (const [path, mod] of Object.entries(images)) {
	// path is like "./convective_clouds.webp" or "./originals/forstberg.jpg"
	// Strip leading "./" to get the key
	const key = path.slice(2);
	imageMap.set(key, mod.default);
}

export function getHeroImage(name: string): Picture | undefined {
	return imageMap.get(name);
}

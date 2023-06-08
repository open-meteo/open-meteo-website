import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Geocoding API",
    subtitle: "Search locations globally in any language",
    hero: "/images/beach_sunset.webp"
  };
}) satisfies PageLoad;
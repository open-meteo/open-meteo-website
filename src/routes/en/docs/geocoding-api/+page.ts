import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Geocoding API",
    subtitle: "Search locations in any language globally",
    hero: "/images/beach_sunset.webp"
  };
}) satisfies PageLoad;
import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Air Quality API",
    subtitle: "Pollutants and pollen forecast in 11 km resolution",
    hero: "/images/kuala_lumpur.webp"
  };
}) satisfies PageLoad;
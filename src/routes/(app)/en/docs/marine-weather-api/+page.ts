import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Marine Weather API",
    subtitle: "Hourly wave forecasts at 5 km resolution",
    hero: "/images/beach.webp"
  };
}) satisfies PageLoad;
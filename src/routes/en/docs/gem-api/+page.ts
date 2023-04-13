import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "GEM API",
    subtitle: "2.5 km high resolution forecasts for North America",
    hero: "/images/coastal.webp"
  };
}) satisfies PageLoad;
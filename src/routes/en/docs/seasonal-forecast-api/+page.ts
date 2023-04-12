import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Seasonal Forecast API",
    subtitle: "Up to 9 month forecasts from different ensembles",
    hero: "/images/rocky_coast.webp"
  };
}) satisfies PageLoad;
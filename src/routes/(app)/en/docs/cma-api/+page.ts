import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "CMA Forecast API",
    subtitle: "Weather forecasts from the Chinese Meteorological Administration",
    hero: "/images/lake_cirrus.webp"
  };
}) satisfies PageLoad;
import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "BOM Forecast API",
    subtitle: "Weather forecasts from the Australian Bureau of Meteorology",
    hero: "/images/fog_mountain.webp"
  };
}) satisfies PageLoad;
import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "DMI Forecast API",
    subtitle: "Weather forecasts from the Danish Meteorological Institute",
    hero: "/images/iceland_glacier_lake.webp"
  };
}) satisfies PageLoad;
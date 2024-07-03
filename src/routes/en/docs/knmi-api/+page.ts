import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "KNMI Forecast API",
    subtitle: "Weather forecasts from the Royal Netherlands Meteorological Institute",
    hero: "/images/lake_cirrus.webp"
  };
}) satisfies PageLoad;
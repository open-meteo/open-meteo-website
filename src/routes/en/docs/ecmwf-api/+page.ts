import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "ECMWF Weather Forecast API",
    subtitle: "Global High Frequency Forecasts at 0.4° resolution",
    hero: "/images/mountains.webp"
  };
}) satisfies PageLoad;
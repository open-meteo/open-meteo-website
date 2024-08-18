import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "GFS & HRRR Forecast API",
    subtitle: "Global GFS model combined with hourly HRRR updates at 3-km resolution",
    hero: "/images/sunset.webp"
  };
}) satisfies PageLoad;
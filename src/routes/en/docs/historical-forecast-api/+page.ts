import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Historical Forecast API",
    subtitle: "Archived high resolution weather forecasts",
    hero: "/images/sunset.webp"
  };
}) satisfies PageLoad;
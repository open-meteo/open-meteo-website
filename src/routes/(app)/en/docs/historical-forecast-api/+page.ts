import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Historical Forecast API",
    subtitle: "Archived High-Resolution Weather Forecasts",
    hero: "/images/andermatt.webp"
  };
}) satisfies PageLoad;
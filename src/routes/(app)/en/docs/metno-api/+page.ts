import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "MET Norway API",
    subtitle: "Hourly updates & 1 km forecasts for Scandinavia",
    hero: "/images/klausenpass.webp"
  };
}) satisfies PageLoad;
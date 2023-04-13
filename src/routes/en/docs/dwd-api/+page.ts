import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "DWD ICON API",
    subtitle: "Open data weather forecasts from the German weather service DWD",
    hero: "/images/cloudy2.webp"
  };
}) satisfies PageLoad;
import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Model Updates and Data Availability",
    subtitle: "Overview of Model Timings and Data Availability via Open-Meteo API",
    hero: "/images/mountain_road.webp"
  };
}) satisfies PageLoad;
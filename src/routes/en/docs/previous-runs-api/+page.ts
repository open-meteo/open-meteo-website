import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Previous Model Runs API",
    subtitle: "Weather Forecasts from Previous Days to Compare Run-To-Run Performance",
    hero: "/images/clouds.webp"
  };
}) satisfies PageLoad;
import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Weather Forecast API",
    subtitle: "Best predictions from high resolution models",
    hero: "/images/partly_cloudy.webp"
  };
}) satisfies PageLoad;
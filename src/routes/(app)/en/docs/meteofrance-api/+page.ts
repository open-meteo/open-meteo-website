import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Météo-France API",
    subtitle: "Global ARPEGE model combined with high resolution AROME model",
    hero: "/images/overcast_sunset.webp"
  };
}) satisfies PageLoad;
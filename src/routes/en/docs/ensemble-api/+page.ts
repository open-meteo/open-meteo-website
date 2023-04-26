import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Ensemble API",
    subtitle: "",
    hero: "/images/partly_cloudy.webp"
  };
}) satisfies PageLoad;
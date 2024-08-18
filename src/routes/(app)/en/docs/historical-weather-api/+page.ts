import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Historical Weather API",
    subtitle: "Discover how weather has shaped our world from 1940 until now",
    hero: "/images/mountains2.1.webp"
  };
}) satisfies PageLoad;
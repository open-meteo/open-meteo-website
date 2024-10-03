import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Model Updates Overview",
    subtitle: "Last Model Updates",
    hero: "/images/mountain_road.webp"
  };
}) satisfies PageLoad;
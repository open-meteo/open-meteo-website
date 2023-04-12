import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Elevation API",
    subtitle: "90 meter resolution digital elevation model",
    hero: "/images/mountains3.webp"
  };
}) satisfies PageLoad;
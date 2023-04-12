import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Climate API",
    subtitle: "Explore Climate Change on a Local Level with High-Resolution Climate Data",
    hero: "/images/stoos.webp"
  };
}) satisfies PageLoad;
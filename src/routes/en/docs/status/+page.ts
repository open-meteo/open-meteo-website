import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "API Status",
    subtitle: "Last Model Updates",
    hero: "/images/scotland.webp"
  };
}) satisfies PageLoad;
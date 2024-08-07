import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "UK Met Office API",
    subtitle: "Weather forecasts from the United Kingdom's national weather and climate service UKMO",
    hero: "/images/scotland.webp"
  };
}) satisfies PageLoad;
import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "JMA API",
    subtitle: "5-km high resolution forecasts for Japan, Korea, parts of China and Russia",
    hero: "/images/cloudy_cirrus.webp"
  };
}) satisfies PageLoad;
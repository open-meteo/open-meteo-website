import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Ensemble API",
    subtitle: "Perturbed forecasts for probabilistic weather prediction",
    hero: "/images/rocky_coast.webp"
  };
}) satisfies PageLoad;
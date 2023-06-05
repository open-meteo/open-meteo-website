import type { PageLoad } from './$types';
 
export const load = (({ params }) => {
  return {
    title: "Ensemble API",
    subtitle: "Hundreds Of Weather Forecasts, Every time, Everywhere, All at Once",
    hero: "/images/rocky_coast.webp"
  };
}) satisfies PageLoad;
// wastelogic.js
// Step 1: Predict Waste Composition using a weighted scoring model
// Base composition figures are approximate, based on typical Indian
// municipal solid waste (MSW) studies. Tune these as you get real data.

// --- Base composition by area type (percentages, sum to 100) ---
export const BASE_COMPOSITION = {
  Residential:   { organic: 55, recyclable: 25, inert: 20 },
  Commercial:    { organic: 35, recyclable: 45, inert: 20 },
  Institutional: { organic: 50, recyclable: 30, inert: 20 },
  Market:        { organic: 70, recyclable: 15, inert: 15 },
};

// --- Density adjustment (percentage-point shifts) ---
const DENSITY_ADJUSTMENT = {
  Low:    { organic: -3, recyclable: +4, inert: -1 },
  Medium: { organic: 0,  recyclable: 0,  inert: 0 },
  High:   { organic: +3, recyclable: -4, inert: +1 },
};

// --- Season adjustment (percentage-point shifts) ---
const SEASON_ADJUSTMENT = {
  Summer:  { organic: -2, recyclable: +4, inert: -2 },
  Monsoon: { organic: +5, recyclable: -3, inert: +3 },
  Winter:  { organic: 0,  recyclable: 0,  inert: 0 },
};

/**
 * Predicts waste composition (%) for a given area type, density, and season.
 * @param {"Residential"|"Commercial"|"Institutional"|"Market"} areaType
 * @param {"Low"|"Medium"|"High"} density
 * @param {"Summer"|"Monsoon"|"Winter"} season
 * @returns {{ organic: number, recyclable: number, inert: number }}
 */
export function predictWasteComposition(areaType, density, season) {
  const base = BASE_COMPOSITION[areaType];
  const dAdj = DENSITY_ADJUSTMENT[density];
  const sAdj = SEASON_ADJUSTMENT[season];

  if (!base || !dAdj || !sAdj) {
    throw new Error(
      `Invalid input: areaType="${areaType}", density="${density}", season="${season}"`
    );
  }

  let organic = base.organic + dAdj.organic + sAdj.organic;
  let recyclable = base.recyclable + dAdj.recyclable + sAdj.recyclable;
  let inert = base.inert + dAdj.inert + sAdj.inert;

  organic = Math.max(organic, 0);
  recyclable = Math.max(recyclable, 0);
  inert = Math.max(inert, 0);

  const total = organic + recyclable + inert;
  const normalize = (val) => Math.round((val / total) * 1000) / 10;

  return {
    organic: normalize(organic),
    recyclable: normalize(recyclable),
    inert: normalize(inert),
  };
}

// Quick manual test (remove once wired into the UI):
// console.log(predictWasteComposition("Market", "High", "Monsoon"));
// console.log(predictWasteComposition("Residential", "Medium", "Winter"));
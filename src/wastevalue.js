// Step 3: Waste-to-Wealth Calculation
// Estimates recoverable value from the predicted composition + chosen
// processing route. Conversion factors below are reasonable working
// estimates — tune them if your research gives more precise figures.

// --- Conversion factors (tune as needed) ---
const COMPOST_YIELD_RATIO = 0.3;        // kg compost per kg organic waste (~30%)
const BIOGAS_YIELD_M3_PER_KG = 0.08;    // m3 biogas per kg organic waste (biomethanation)
const COMPOST_PRICE_PER_KG = 6;         // ₹ per kg of compost sold
const BIOGAS_VALUE_PER_M3 = 40;         // ₹ equivalent value per m3 (vs LPG/fuel cost)
const RECYCLABLE_PRICE_PER_KG = 8;      // ₹ per kg, blended average across materials

/**
 * @param {number} totalWasteKg - total waste generated (kg) for the period
 * @param {{ organic: number, recyclable: number, inert: number }} composition - percentages from Step 1
 * @param {"composting"|"biomethanation"} organicRoute - which organic pathway to cost out
 * @returns {{
 *   compostKg: number,
 *   biogasM3: number,
 *   recyclingRevenue: number,
 *   landfillReducedKg: number,
 *   totalRecoverableValue: number
 * }}
 */
export function calculateWasteToWealth(totalWasteKg, composition, organicRoute = "composting") {
  const organicKg = (composition.organic / 100) * totalWasteKg;
  const recyclableKg = (composition.recyclable / 100) * totalWasteKg;
  const inertKg = (composition.inert / 100) * totalWasteKg;

  let compostKg = 0;
  let biogasM3 = 0;
  let organicValue = 0;

  if (organicRoute === "biomethanation") {
    biogasM3 = Math.round(organicKg * BIOGAS_YIELD_M3_PER_KG * 10) / 10;
    organicValue = biogasM3 * BIOGAS_VALUE_PER_M3;
  } else {
    compostKg = Math.round(organicKg * COMPOST_YIELD_RATIO * 10) / 10;
    organicValue = compostKg * COMPOST_PRICE_PER_KG;
  }

  const recyclingRevenue = Math.round(recyclableKg * RECYCLABLE_PRICE_PER_KG);
  const landfillReducedKg = Math.round(organicKg + recyclableKg);
  const totalRecoverableValue = Math.round(organicValue + recyclingRevenue);

  return {
    compostKg,
    biogasM3,
    recyclingRevenue,
    landfillReducedKg,
    totalRecoverableValue,
  };
}

// Quick manual test (remove once wired into the UI):
// import { predictWasteComposition } from "./wastelogic.js";
// const comp = predictWasteComposition("Market", "High", "Monsoon");
// console.log(calculateWasteToWealth(1000, comp, "composting"));
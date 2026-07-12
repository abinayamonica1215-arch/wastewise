// Step 2: Recommend the Best Processing Method
// Takes the output of predictWasteComposition() and decides the most
// suitable processing pathway — instead of assuming perfect segregation.

/**
 * @typedef {{ organic: number, recyclable: number, inert: number }} Composition
 */

/**
 * Recommends a processing pathway for a given waste composition.
 * @param {Composition} composition - output from predictWasteComposition()
 * @returns {{
 *   pathway: string,
 *   reason: string,
 *   routing: { organic: string, recyclable: string, inert: string }
 * }}
 */
export function recommendProcessing(composition) {
  const { organic, recyclable, inert } = composition;

  // High organic (Market, Hostel/Institutional canteens, etc.)
  if (organic >= 60) {
    return {
      pathway: "Composting / Biomethanation Plant",
      reason: `Organic content is high (${organic}%), making direct composting or biomethanation the most efficient route.`,
      routing: {
        organic: "Sent directly to composting/biomethanation plant.",
        recyclable: `Remaining recyclables (${recyclable}%) recovered before dispatch.`,
        inert: `Inert waste (${inert}%) sent to landfill.`,
      },
    };
  }

  // High recyclable (Commercial areas, offices)
  if (recyclable >= 40) {
    return {
      pathway: "Material Recovery Facility (MRF)",
      reason: `Recyclable content is high (${recyclable}%), so routing to an MRF for worker/conveyor-based separation maximizes recovery.`,
      routing: {
        organic: `Organic fraction (${organic}%) diverted to composting/biogas after separation.`,
        recyclable: "Separated at MRF via workers and conveyor systems.",
        inert: `Inert waste (${inert}%) sent to landfill.`,
      },
    };
  }

  // Mixed waste (typically Residential) — default/fallback case
  return {
    pathway: "MRF with Split Routing",
    reason: "Composition is mixed, so waste is first routed to an MRF where each fraction is separated and sent onward.",
    routing: {
      organic: `Organic fraction (${organic}%) recovered at MRF, sent for composting/biogas.`,
      recyclable: `Recyclable fraction (${recyclable}%) recovered at MRF via workers/conveyor systems.`,
      inert: `Only inert waste (${inert}%) proceeds to landfill.`,
    },
  };
}

// Quick manual test (remove once wired into the UI):
// import { predictWasteComposition } from "./wastelogic.js";
// const comp = predictWasteComposition("Market", "High", "Monsoon");
// console.log(comp, recommendProcessing(comp));
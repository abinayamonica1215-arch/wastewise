
// Generates a realistic "actual" 9-category segregation breakdown based on
// the predicted composition (organic / recyclable / inert) from wastelogic.js.
// This does NOT modify wastelogic.js - it only consumes its output.

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function jitter(value, pct = 0.08) {
  const delta = value * pct * (Math.random() * 2 - 1);
  return clamp(value + delta, 0, 100);
}

export function generateActualSegregation(composition, totalWasteKg) {
  const total = Number(totalWasteKg) || 0;

  const organicPct = jitter(composition.organic);
  const recyclablePct = jitter(composition.recyclable);
  const inertPct = clamp(100 - organicPct - recyclablePct, 0, 100);

  // How the "recyclable" bucket typically splits across sub-categories
  const shares = {
    plastic: 0.32,
    paper: 0.24,
    metal: 0.1,
    glass: 0.12,
    textile: 0.14,
    eWaste: 0.08,
  };

  const raw = {
    organic: organicPct * 0.94,
    plastic: recyclablePct * shares.plastic,
    paper: recyclablePct * shares.paper,
    metal: recyclablePct * shares.metal,
    glass: recyclablePct * shares.glass,
    textile: recyclablePct * shares.textile,
    eWaste: recyclablePct * shares.eWaste,
    inert: inertPct * 0.85,
    landfill: organicPct * 0.06 + inertPct * 0.15,
  };

  const sum = Object.values(raw).reduce((a, b) => a + b, 0);
  const scale = sum > 0 ? 100 / sum : 0;

  const result = {};
  Object.entries(raw).forEach(([key, pct]) => {
    const normalizedPct = pct * scale;
    result[key] = {
      percent: Number(normalizedPct.toFixed(1)),
      kg: Number(((normalizedPct / 100) * total).toFixed(1)),
    };
  });

  return result;
}
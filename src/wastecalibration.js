// Step 4: Continuous Improvement
// Lets a user/municipality enter real waste audit data for an area type.
// The app nudges BASE_COMPOSITION toward that real data (weighted average)
// and persists the updated weights in localStorage, so future predictions
// for that area type get more accurate over time.

import { BASE_COMPOSITION } from "./wastelogic.js";

const STORAGE_KEY = "wastewise_calibrated_weights";
const LEARNING_RATE = 0.25; // how much each new audit nudges the model (0-1)

/**
 * Recalibrates BASE_COMPOSITION for one area type using a real audit result.
 * @param {"Residential"|"Commercial"|"Institutional"|"Market"} areaType
 * @param {{ organic: number, recyclable: number, inert: number }} actualComposition
 *   - real measured percentages from an audit, should sum to ~100
 */
export function recalibrate(areaType, actualComposition) {
  const current = BASE_COMPOSITION[areaType];
  if (!current) {
    throw new Error(`Unknown area type: ${areaType}`);
  }

  current.organic = round1(
    current.organic * (1 - LEARNING_RATE) + actualComposition.organic * LEARNING_RATE
  );
  current.recyclable = round1(
    current.recyclable * (1 - LEARNING_RATE) + actualComposition.recyclable * LEARNING_RATE
  );
  current.inert = round1(
    current.inert * (1 - LEARNING_RATE) + actualComposition.inert * LEARNING_RATE
  );

  saveCalibration();
  return { ...current };
}

function saveCalibration() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(BASE_COMPOSITION));
  } catch (err) {
    console.warn("Could not save calibration data:", err);
  }
}

/**
 * Loads previously saved calibrated weights (if any) and applies them
 * to BASE_COMPOSITION. Call this once when the app starts (e.g. in App.jsx).
 */
export function loadCalibration() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    for (const areaType of Object.keys(parsed)) {
      if (BASE_COMPOSITION[areaType]) {
        Object.assign(BASE_COMPOSITION[areaType], parsed[areaType]);
      }
    }
  } catch (err) {
    console.warn("Could not load calibration data:", err);
  }
}

/** Resets all calibration back to the original hardcoded weights (optional utility). */
export function resetCalibration() {
  localStorage.removeItem(STORAGE_KEY);
}

function round1(val) {
  return Math.round(val * 10) / 10;
}
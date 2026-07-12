// Adds sample "Processing Charges" and "Rating" fields to facility objects
// returned by nearbyFacilities.js, without needing to modify that file.

export function enrichFacility(facility) {
  const rating = Number((3.6 + Math.random() * 1.3).toFixed(1));
  const processingChargePerKg = Math.round(2 + Math.random() * 6);
  return { ...facility, rating, processingChargePerKg };
}

export function enrichFacilities(facilities) {
  return facilities.map(enrichFacility);
}
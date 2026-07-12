// nearbyFacilities.js
export const FACILITIES = [
  {
    name: "MY GREEN BIN – Greenrich Grow India Pvt Ltd",
    type: "composting",
    address: "Ayanambakkam, Chennai, Tamil Nadu 600095",
    phone: "+91 95000 90619",
    lat: 13.0791696,
    lon: 80.1516821,
  },
  {
    name: "SACS Vanya Vermicompost",
    type: "composting",
    address: "Mahalingapuram, Nungambakkam, Chennai, Tamil Nadu 600034",
    phone: "+91 98409 88845",
    lat: 13.0576399,
    lon: 80.2354772,
  },
  {
    name: "SS Vermicompost Sales Centre",
    type: "composting",
    address: "West Tambaram, Chennai, Tamil Nadu 600045",
    phone: "+91 98405 92676",
    lat: 12.9177756,
    lon: 80.1033684,
  },
  {
    name: "Sree E-Waste Recycling (Velachery)",
    type: "recyclable",
    address: "Velachery Main Rd, Chennai, Tamil Nadu 600042",
    phone: "+91 78455 61376",
    lat: 12.9832069,
    lon: 80.2221864,
  },
  {
    name: "Sree E-Waste Recycling (Perungudi)",
    type: "recyclable",
    address: "Kandhanchavadi, Perungudi, Chennai, Tamil Nadu 600096",
    phone: "+91 78455 61376",
    lat: 12.9579432,
    lon: 80.2439778,
  },
  {
    name: "Earth Sense Recycle Pvt. Ltd.",
    type: "recyclable",
    address: "Thiruvanmiyur, Chennai, Tamil Nadu 600041",
    phone: "+91 1800 419 0161",
    lat: 12.9883174,
    lon: 80.2538656,
  },
  {
    name: "Naza Tech E-Waste Solutions",
    type: "recyclable",
    address: "Pallikaranai, Chennai, Tamil Nadu 600100",
    phone: "+91 74186 86716",
    lat: 12.9272385,
    lon: 80.2148883,
  },
];

function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function directionsUrl(lat, lon) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
}

export function findNearbyFacilities(userLat, userLon, facilityType, limit = 3) {
  return FACILITIES.filter((f) => f.type === facilityType)
    .map((f) => ({ ...f, distanceKm: Math.round(distanceKm(userLat, userLon, f.lat, f.lon) * 10) / 10 }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
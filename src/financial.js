// Calculates compost, biogas, electricity, revenue, cost, profit, landfill
// reduction and CO2 impact from the actual segregation report.
// Sample rates below are realistic placeholders (INR) since no live
// pricing/API is available.

const COMPOST_YIELD = 0.25; // kg compost per kg organic input
const COMPOST_PRICE_PER_KG = 10; // INR

const BIOGAS_YIELD_M3_PER_KG = 0.1; // m3 biogas per kg organic input
const ELECTRICITY_PER_M3 = 1.5; // kWh generated per m3 biogas
const ELECTRICITY_PRICE_PER_KWH = 7; // INR

const ORGANIC_TO_COMPOST_SHARE = 0.6;
const ORGANIC_TO_BIOGAS_SHARE = 0.4;

const RECYCLING_RATES = {
  plastic: 15,
  paper: 8,
  metal: 35,
  glass: 4,
  textile: 6,
  eWaste: 40,
}; // INR per kg

const CO2_FACTORS = {
  plastic: 1.5,
  paper: 0.9,
  metal: 2.0,
  glass: 0.3,
  textile: 1.2,
  eWaste: 1.8,
  organicCompost: 0.5,
  organicBiogas: 0.4,
}; // kg CO2e avoided per kg processed

const PROCESSING_COST_PER_KG = 1.5; // INR, flat operational cost on total waste

export function calculateFinancials(segregation, totalWasteKg) {
  const total = Number(totalWasteKg) || 0;
  const organicKg = segregation.organic.kg;

  const compostInputKg = organicKg * ORGANIC_TO_COMPOST_SHARE;
  const biogasInputKg = organicKg * ORGANIC_TO_BIOGAS_SHARE;

  const compostProducedKg = Number((compostInputKg * COMPOST_YIELD).toFixed(1));
  const compostRevenue = Number((compostProducedKg * COMPOST_PRICE_PER_KG).toFixed(0));

  const biogasM3 = Number((biogasInputKg * BIOGAS_YIELD_M3_PER_KG).toFixed(1));
  const electricityKwh = Number((biogasM3 * ELECTRICITY_PER_M3).toFixed(1));
  const electricityRevenue = Number((electricityKwh * ELECTRICITY_PRICE_PER_KWH).toFixed(0));

  let recyclingRevenue = 0;
  Object.keys(RECYCLING_RATES).forEach((key) => {
    recyclingRevenue += (segregation[key]?.kg || 0) * RECYCLING_RATES[key];
  });
  recyclingRevenue = Number(recyclingRevenue.toFixed(0));

  const processingCost = Number((total * PROCESSING_COST_PER_KG).toFixed(0));

  const netProfit = Number(
    (compostRevenue + electricityRevenue + recyclingRevenue - processingCost).toFixed(0)
  );

  const landfillKg = segregation.landfill.kg;
  const landfillReductionPct =
    total > 0 ? Number((((total - landfillKg) / total) * 100).toFixed(1)) : 0;

  let co2Reduced = 0;
  Object.keys(RECYCLING_RATES).forEach((key) => {
    co2Reduced += (segregation[key]?.kg || 0) * CO2_FACTORS[key];
  });
  co2Reduced += compostInputKg * CO2_FACTORS.organicCompost;
  co2Reduced += biogasInputKg * CO2_FACTORS.organicBiogas;
  co2Reduced = Number(co2Reduced.toFixed(1));

  return {
    compostProducedKg,
    compostRevenue,
    biogasM3,
    electricityKwh,
    electricityRevenue,
    recyclingRevenue,
    processingCost,
    netProfit,
    landfillReductionPct,
    co2ReducedKg: co2Reduced,
  };
}
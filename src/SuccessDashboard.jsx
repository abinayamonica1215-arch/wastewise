function SuccessDashboard({ financials, onViewHistory, onStartOver }) {
  return (
    <div className="page dashboard">
      <h2>🎉 Waste processed successfully!</h2>
      <p className="dashboard-message">
        Congratulations! You earned ₹{financials.netProfit} and reduced landfill waste by{" "}
        {financials.landfillReductionPct}%.
      </p>
      <ul className="big-list">
        <li>
          Compost Produced: {financials.compostProducedKg} kg (₹{financials.compostRevenue})
        </li>
        <li>Biogas Generated: {financials.biogasM3} m³</li>
        <li>
          Electricity Generated: {financials.electricityKwh} kWh (₹
          {financials.electricityRevenue})
        </li>
        <li>Recycling Revenue: ₹{financials.recyclingRevenue}</li>
        <li>Processing Cost: ₹{financials.processingCost}</li>
        <li className="highlight">Net Profit: ₹{financials.netProfit}</li>
        <li>Landfill Reduction: {financials.landfillReductionPct}%</li>
        <li>CO₂ Emissions Reduced: {financials.co2ReducedKg} kg</li>
      </ul>
      <div className="page-nav">
        <button onClick={onViewHistory}>View History & Analytics</button>
        <button onClick={onStartOver}>Start New Analysis</button>
      </div>
    </div>
  );
}

export default SuccessDashboard;
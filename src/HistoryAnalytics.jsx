function BarChart({ title, data, unit, color }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="chart-block">
      <h4>{title}</h4>
      <div className="bar-chart">
        {data.map((d) => (
          <div className="bar-row" key={d.label}>
            <span className="bar-label">{d.label}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${(d.value / max) * 100}%`, background: color }}
              />
            </div>
            <span className="bar-value">
              {d.value}
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryAnalytics({ history, onStartOver }) {
  if (history.length === 0) {
    return (
      <div className="page">
        <h2>History & Analytics</h2>
        <p>No processed waste records yet.</p>
        <div className="page-nav">
          <button onClick={onStartOver}>Start New Analysis</button>
        </div>
      </div>
    );
  }

  const recent = history.slice(0, 8).reverse();
  const label = (i) => `#${recent.length - i}`;

  const wasteData = recent.map((h, i) => ({ label: label(i), value: h.totalWasteKg }));
  const revenueData = recent.map((h, i) => ({ label: label(i), value: h.financials.netProfit }));
  const recyclingData = recent.map((h, i) => ({
    label: label(i),
    value: h.financials.recyclingRevenue,
  }));
  const compostData = recent.map((h, i) => ({
    label: label(i),
    value: h.financials.compostProducedKg,
  }));
  const landfillData = recent.map((h, i) => ({
    label: label(i),
    value: h.financials.landfillReductionPct,
  }));
  const co2Data = recent.map((h, i) => ({ label: label(i), value: h.financials.co2ReducedKg }));

  const totals = history.reduce(
    (acc, h) => {
      acc.waste += h.totalWasteKg;
      acc.profit += h.financials.netProfit;
      acc.co2 += h.financials.co2ReducedKg;
      return acc;
    },
    { waste: 0, profit: 0, co2: 0 }
  );

  return (
    <div className="page">
      <h2>History & Analytics</h2>
      <ul className="big-list">
        <li>Total Batches Processed: {history.length}</li>
        <li>Total Waste Processed: {totals.waste.toFixed(0)} kg</li>
        <li>Total Net Profit: ₹{totals.profit.toFixed(0)}</li>
        <li>Total CO₂ Reduced: {totals.co2.toFixed(1)} kg</li>
      </ul>

      <BarChart title="Waste Generated (kg)" data={wasteData} unit=" kg" color="#2e7d32" />
      <BarChart title="Net Profit (₹)" data={revenueData} unit="" color="#1b5e20" />
      <BarChart title="Recycling Revenue (₹)" data={recyclingData} unit="" color="#4a7d4a" />
      <BarChart title="Compost Produced (kg)" data={compostData} unit=" kg" color="#6b8e23" />
      <BarChart title="Landfill Reduction (%)" data={landfillData} unit="%" color="#33691e" />
      <BarChart title="CO₂ Reduced (kg)" data={co2Data} unit=" kg" color="#2e7d32" />

      <div className="history-list">
        <h3>Recent Batches</h3>
        {history.slice(0, 10).map((h) => (
          <div className="facility-card" key={h.id}>
            <p>
              <strong>{new Date(h.date).toLocaleString()}</strong>
            </p>
            <p>Center: {h.facility?.name || "N/A"}</p>
            <p>Waste: {h.totalWasteKg} kg</p>
            <p>Net Profit: ₹{h.financials.netProfit}</p>
            <p>Landfill Reduction: {h.financials.landfillReductionPct}%</p>
          </div>
        ))}
      </div>

      <div className="page-nav">
        <button onClick={onStartOver}>Start New Analysis</button>
      </div>
    </div>
  );
}

export default HistoryAnalytics;
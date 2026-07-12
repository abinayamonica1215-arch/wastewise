const LABELS = {
  organic: "Organic",
  plastic: "Plastic",
  paper: "Paper",
  metal: "Metal",
  glass: "Glass",
  textile: "Textile",
  eWaste: "E-Waste",
  inert: "Inert",
  landfill: "Landfill",
};

function SegregationReport({ segregation, onContinue, onBack }) {
  return (
    <div className="page">
      <h2>Actual Segregation Report</h2>
      <p>Based on the physical audit at the processing center:</p>
      <ul className="big-list">
        {Object.entries(LABELS).map(([key, label]) => (
          <li key={key}>
            {label}: <strong>{segregation[key].percent}%</strong> ({segregation[key].kg} kg)
          </li>
        ))}
      </ul>
      <div className="page-nav">
        <button onClick={onBack}>Back</button>
        <button onClick={onContinue}>Next: Calculate Earnings →</button>
      </div>
    </div>
  );
}

export default SegregationReport;
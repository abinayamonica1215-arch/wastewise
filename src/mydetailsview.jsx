import "./interactive.css";

export default function MyDetailsView({ details, onBack }) {
  return (
    <div className="page">
      <h2>My Details</h2>

      {details ? (
        <div className="ww-kg-panel" style={{ gridTemplateColumns: "1fr" }}>
          {Object.entries(details).map(([key, value]) => (
            <div className="ww-card-hover" key={key} style={{ padding: "0.85rem 1rem", textAlign: "left" }}>
              <span style={{ fontWeight: 600, textTransform: "capitalize" }}>
                {key.replace(/([A-Z])/g, " $1")}:
              </span>{" "}
              {String(value)}
            </div>
          ))}
        </div>
      ) : (
        <p>No profile details on file for this account.</p>
      )}

      <div className="page-nav">
        <button className="ww-btn-gradient ww-btn-gradient--ghost" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
}
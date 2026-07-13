import { useState } from "react";
import "./interactive.css";

export default function AuditStep({
  facility,
  composition,
  totalWasteKg,
  onSubmitAudit,
  onContinue,
  onBack,
}) {
  const [showForm, setShowForm] = useState(false);
  const [auditOrganic, setAuditOrganic] = useState("");
  const [auditRecyclable, setAuditRecyclable] = useState("");
  const [auditInert, setAuditInert] = useState("");

  const total = Number(totalWasteKg) || 0;
  const kg = {
    organic: Math.round((total * (composition?.organic || 0)) / 100),
    recyclable: Math.round((total * (composition?.recyclable || 0)) / 100),
    inert: Math.round((total * (composition?.inert || 0)) / 100),
  };

  function handleSubmit() {
    onSubmitAudit({
      organic: Number(auditOrganic),
      recyclable: Number(auditRecyclable),
      inert: Number(auditInert),
    });
    setAuditOrganic("");
    setAuditRecyclable("");
    setAuditInert("");
    setShowForm(false);
  }

  return (
    <div className="page ww-audit-page">
      <h2>Waste Audit</h2>
      {facility && (
        <p>
          Comparing against the split expected at <strong>{facility.name}</strong>.
        </p>
      )}

      <h3 className="ww-font-heading">Predicted Split at This MRF (kg)</h3>
      <div className="ww-kg-panel">
        <div className="ww-card-hover ww-kg-tile ww-kg-tile--organic">
          Organic
          <strong>{kg.organic} kg</strong>
        </div>
        <div className="ww-card-hover ww-kg-tile ww-kg-tile--recyclable">
          Recyclable
          <strong>{kg.recyclable} kg</strong>
        </div>
        <div className="ww-card-hover ww-kg-tile ww-kg-tile--inert">
          Inert
          <strong>{kg.inert} kg</strong>
        </div>
      </div>

      <button
        type="button"
        className="ww-btn-gradient ww-btn-gradient--ghost"
        onClick={() => setShowForm((v) => !v)}
      >
        {showForm ? "Cancel Audit Entry" : "Enter Real Audit Data to Compare"}
      </button>

      {showForm && (
        <div className="ww-audit-form" style={{ marginTop: "1rem" }}>
          <h3 className="ww-font-heading">Enter Actual Composition (%)</h3>
          <input
            type="number"
            placeholder="Organic %"
            value={auditOrganic}
            onChange={(e) => setAuditOrganic(e.target.value)}
          />
          <input
            type="number"
            placeholder="Recyclable %"
            value={auditRecyclable}
            onChange={(e) => setAuditRecyclable(e.target.value)}
          />
          <input
            type="number"
            placeholder="Inert %"
            value={auditInert}
            onChange={(e) => setAuditInert(e.target.value)}
          />
          <div className="ww-page-nav" style={{ marginTop: "0.75rem" }}>
            <button type="button" className="ww-btn-gradient ww-btn-gradient--accent" onClick={handleSubmit}>
              Submit & Recalibrate
            </button>
          </div>
        </div>
      )}

      <div className="page-nav" style={{ marginTop: "1.5rem" }}>
        <button className="ww-btn-gradient ww-btn-gradient--ghost" onClick={onBack}>
          Back
        </button>
        <button className="ww-btn-gradient ww-glow" onClick={onContinue}>
          Continue to Delivery →
        </button>
      </div>
    </div>
  );
}
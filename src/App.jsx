import { useState, useEffect } from "react";
import { predictWasteComposition } from "./wastelogic.js";
import { recommendProcessing } from "./wasteRecommend.js";
import { calculateWasteToWealth } from "./wasteValue.js";
import { recalibrate, loadCalibration } from "./wasteCalibration.js";
import { detectSeason } from "./weatherSeason.js";
import { findNearbyFacilities, directionsUrl } from "./nearbyFacilities.js";
import "./App.css";

// --- New feature imports (all new files, existing files above are untouched) ---
import { getSession, logout as clearSession } from "./auth.js";
import Login from "./login.jsx";
import Register from "./register.jsx";
import IndustryDetailsForm from "./industrydetailform.jsx";
import { enrichFacilities } from "./facilityEnrichment.js";
import NearbyCenters from "./nearbycenters.jsx";
import DeliveryConfirmation from "./DeliveryConfirmation.jsx";
import { generateActualSegregation } from "./segregation.js";
import SegregationReport from "./SegregationReport.jsx";
import { calculateFinancials } from "./financial.js";
import SuccessDashboard from "./SuccessDashboard.jsx";
import HistoryAnalytics from "./HistoryAnalytics.jsx";
import { saveHistoryEntry, getHistory } from "./historyStore.js";

// Original steps - kept exactly as before. New steps are handled separately
// via dedicated state so none of this original logic is modified.
const STEPS = ["form", "composition", "facility", "routing", "wealth", "nearby"];

function App() {
  // --- New: auth + gating state ---
  const [currentUser, setCurrentUser] = useState(() => getSession());
  const [authView, setAuthView] = useState("login"); // "login" | "register"
  const [industryDetails, setIndustryDetails] = useState(null);
  const [detailsCollected, setDetailsCollected] = useState(false);

  // --- New: post-analysis flow state ---
  const [phase, setPhase] = useState("analysis"); // "analysis" | "selectCenter" | "delivered" | "segregation" | "success" | "history"
  const [enrichedNearby, setEnrichedNearby] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [actualSegregation, setActualSegregation] = useState(null);
  const [financials, setFinancials] = useState(null);
  const [history, setHistory] = useState(() => getHistory());

  // --- Original state, untouched ---
  const [step, setStep] = useState("form");

  const [areaType, setAreaType] = useState("Residential");
  const [density, setDensity] = useState("Medium");
  const [season, setSeason] = useState("Summer");
  const [totalWasteKg, setTotalWasteKg] = useState(1000);

  const [result, setResult] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [primaryFacility, setPrimaryFacility] = useState(null);

  const [showAudit, setShowAudit] = useState(false);
  const [auditOrganic, setAuditOrganic] = useState("");
  const [auditRecyclable, setAuditRecyclable] = useState("");
  const [auditInert, setAuditInert] = useState("");

  useEffect(() => {
    detectSeason().then((s) => setSeason(s));
  }, []);

  useEffect(() => {
    loadCalibration();
  }, []);

  // --- Original function, untouched ---
  function handlePredict() {
    const composition = predictWasteComposition(areaType, density, season);
    const recommendation = recommendProcessing(composition);
    const organicRoute = recommendation.pathway.includes("Biomethanation")
      ? "biomethanation"
      : "composting";
    const wealth = calculateWasteToWealth(Number(totalWasteKg), composition, organicRoute);

    setResult({ composition, recommendation, wealth });

    const facilityType =
      recommendation.pathway.includes("Composting") ||
      recommendation.pathway.includes("Biomethanation")
        ? "composting"
        : "recyclable";

    const useLocation = (lat, lon) => {
      const matches = findNearbyFacilities(lat, lon, facilityType);
      setNearby(matches);
      setPrimaryFacility(matches[0] || null);
      // New: enrich the same matches with charges/rating for the center-selection step
      setEnrichedNearby(
        enrichFacilities(matches).map((f) => ({ ...f, directions: directionsUrl(f.lat, f.lon) }))
      );
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => useLocation(pos.coords.latitude, pos.coords.longitude),
        () => useLocation(13.0827, 80.2707)
      );
    } else {
      useLocation(13.0827, 80.2707);
    }

    setStep("composition");
  }

  // --- Original function, untouched ---
  function handleAuditSubmit() {
    const actual = {
      organic: Number(auditOrganic),
      recyclable: Number(auditRecyclable),
      inert: Number(auditInert),
    };
    recalibrate(areaType, actual);
    setAuditOrganic("");
    setAuditRecyclable("");
    setAuditInert("");
    setShowAudit(false);
    handlePredict();
  }

  // --- Original functions, untouched ---
  function goNext() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }
  function goBack() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }
  function startOver() {
    setStep("form");
    setResult(null);
    // New: also reset the post-analysis flow so a fresh run starts clean
    setPhase("analysis");
    setSelectedCenter(null);
    setActualSegregation(null);
    setFinancials(null);
  }

  // --- New handlers ---
  function handleLoginSuccess(user) {
    setCurrentUser(user);
  }
  function handleRegisterSuccess(user) {
    setCurrentUser(user);
  }
  function handleLogout() {
    clearSession();
    setCurrentUser(null);
    setDetailsCollected(false);
    setIndustryDetails(null);
    startOver();
    setAuthView("login");
  }
  function handleIndustryDetailsSubmit(details) {
    setIndustryDetails(details);
    setDetailsCollected(true);
  }

  function handleSelectCenter(facility) {
    setSelectedCenter(facility);
    setPhase("delivered");
  }

  function handleMarkDelivered() {
    const segregation = generateActualSegregation(result.composition, totalWasteKg);
    setActualSegregation(segregation);
    setPhase("segregation");
  }

  function handleSegregationContinue() {
    const calculated = calculateFinancials(actualSegregation, totalWasteKg);
    setFinancials(calculated);

    const updatedHistory = saveHistoryEntry({
      industryDetails,
      areaType,
      density,
      season,
      totalWasteKg: Number(totalWasteKg),
      facility: selectedCenter,
      segregation: actualSegregation,
      financials: calculated,
    });
    setHistory(updatedHistory);
    setPhase("success");
  }

  function handleStartOverFull() {
    startOver();
  }

  // --- Gating: Login / Register ---
  if (!currentUser) {
    return (
      <div className="app">
        <h1>WasteWise</h1>
        <p className="subtitle">Smart Waste-to-Wealth Prediction System</p>
        {authView === "login" ? (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onGoToRegister={() => setAuthView("register")}
          />
        ) : (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onGoToLogin={() => setAuthView("login")}
          />
        )}
      </div>
    );
  }

  // --- Gating: Industry/Institution details (skipped for Municipality/Admin) ---
  if (currentUser.role === "Industry/Institution" && !detailsCollected) {
    return (
      <div className="app">
        <h1>WasteWise</h1>
        <p className="subtitle">Smart Waste-to-Wealth Prediction System</p>
        <IndustryDetailsForm onSubmit={handleIndustryDetailsSubmit} />
      </div>
    );
  }

  // --- Municipality/Admin: goes straight to history/analytics dashboard ---
  if (currentUser.role === "Municipality/Admin") {
    return (
      <div className="app">
        <h1>WasteWise</h1>
        <p className="subtitle">Municipality / Admin Dashboard</p>
        <div className="page-nav">
          <button onClick={handleLogout}>Logout</button>
        </div>
        <HistoryAnalytics history={history} onStartOver={handleLogout} />
      </div>
    );
  }

  // --- New post-analysis phases (rendered after the original "nearby" step) ---
  if (phase === "selectCenter") {
    return (
      <div className="app">
        <h1>WasteWise</h1>
        <p className="subtitle">Smart Waste-to-Wealth Prediction System</p>
        <NearbyCenters
          facilities={enrichedNearby}
          onSelect={handleSelectCenter}
          onBack={() => setPhase("analysis")}
        />
      </div>
    );
  }

  if (phase === "delivered") {
    return (
      <div className="app">
        <h1>WasteWise</h1>
        <p className="subtitle">Smart Waste-to-Wealth Prediction System</p>
        <DeliveryConfirmation
          facility={selectedCenter}
          onMarkDelivered={handleMarkDelivered}
          onBack={() => setPhase("selectCenter")}
        />
      </div>
    );
  }

  if (phase === "segregation" && actualSegregation) {
    return (
      <div className="app">
        <h1>WasteWise</h1>
        <p className="subtitle">Smart Waste-to-Wealth Prediction System</p>
        <SegregationReport
          segregation={actualSegregation}
          onContinue={handleSegregationContinue}
          onBack={() => setPhase("delivered")}
        />
      </div>
    );
  }

  if (phase === "success" && financials) {
    return (
      <div className="app">
        <h1>WasteWise</h1>
        <p className="subtitle">Smart Waste-to-Wealth Prediction System</p>
        <SuccessDashboard
          financials={financials}
          onViewHistory={() => setPhase("history")}
          onStartOver={handleStartOverFull}
        />
      </div>
    );
  }

  if (phase === "history") {
    return (
      <div className="app">
        <h1>WasteWise</h1>
        <p className="subtitle">Smart Waste-to-Wealth Prediction System</p>
        <HistoryAnalytics history={history} onStartOver={handleStartOverFull} />
      </div>
    );
  }

  // --- Original render tree, completely untouched below ---
  return (
    <div className="app">
      <h1>WasteWise</h1>
      <p className="subtitle">Smart Waste-to-Wealth Prediction System</p>

      {step === "form" && (
        <div className="form">
          <label>
            Area Type
            <select value={areaType} onChange={(e) => setAreaType(e.target.value)}>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Institutional</option>
              <option>Market</option>
            </select>
          </label>

          <label>
            Density
            <select value={density} onChange={(e) => setDensity(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>

          <label>
            Season
            <select value={season} onChange={(e) => setSeason(e.target.value)}>
              <option>Summer</option>
              <option>Monsoon</option>
              <option>Winter</option>
            </select>
          </label>

          <label>
            Total Waste (kg)
            <input
              type="number"
              value={totalWasteKg}
              onChange={(e) => setTotalWasteKg(e.target.value)}
              min="0"
            />
          </label>

          <button onClick={handlePredict}>Predict</button>
        </div>
      )}

      {step === "composition" && result && (
        <div className="page">
          <h2>Predicted Waste Composition</h2>
          <ul className="big-list">
            <li>Organic: <strong>{result.composition.organic}%</strong></li>
            <li>Recyclable: <strong>{result.composition.recyclable}%</strong></li>
            <li>Inert: <strong>{result.composition.inert}%</strong></li>
          </ul>
          <div className="page-nav">
            <button onClick={goBack}>Back</button>
            <button onClick={goNext}>Next: Send to Facility →</button>
          </div>
        </div>
      )}

      {step === "facility" && result && (
        <div className="page">
          <h2>Recommended Pathway</h2>
          <p><strong>{result.recommendation.pathway}</strong></p>
          <p>{result.recommendation.reason}</p>

          {primaryFacility ? (
            <div className="facility-card">
              <h3>{primaryFacility.name}</h3>
              <p>📍 {primaryFacility.address}</p>
              <p>📞 {primaryFacility.phone}</p>
              <p>{primaryFacility.distanceKm} km away</p>
              <a
              
                className="map-link"
                href={directionsUrl(primaryFacility.lat, primaryFacility.lon)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Road Map / Directions →
              </a>
            </div>
          ) : (
            <p>No facility match found nearby.</p>
          )}

          <div className="page-nav">
            <button onClick={goBack}>Back</button>
            <button onClick={goNext}>Next: How Waste is Split →</button>
          </div>
        </div>
      )}

      {step === "routing" && result && (
        <div className="page">
          <h2>How Your Waste Gets Separated</h2>
          <ul className="big-list">
            <li>Organic: {result.recommendation.routing.organic}</li>
            <li>Recyclable: {result.recommendation.routing.recyclable}</li>
            <li>Inert: {result.recommendation.routing.inert}</li>
          </ul>
          <div className="page-nav">
            <button onClick={goBack}>Back</button>
            <button onClick={goNext}>Next: Money You'll Earn →</button>
          </div>
        </div>
      )}

      {step === "wealth" && result && (
        <div className="page">
          <h2>Waste-to-Wealth Estimate</h2>
          <ul className="big-list">
            {result.wealth.compostKg > 0 && <li>Compost produced: {result.wealth.compostKg} kg</li>}
            {result.wealth.biogasM3 > 0 && <li>Biogas generated: {result.wealth.biogasM3} m³</li>}
            <li>Recycling revenue: ₹{result.wealth.recyclingRevenue}</li>
            <li>Landfill waste reduced: {result.wealth.landfillReducedKg} kg</li>
            <li className="highlight">Total recoverable value: ₹{result.wealth.totalRecoverableValue}</li>
          </ul>
          <div className="page-nav">
            <button onClick={goBack}>Back</button>
            <button onClick={goNext}>Next: Where to Sell / Earn →</button>
          </div>
        </div>
      )}

      {step === "nearby" && (
        <div className="page">
          <h2>Places You Can Earn From This Waste</h2>
          {nearby.length > 0 ? (
            <div className="facility-list">
              {nearby.map((f) => (
                <div className="facility-card" key={f.name}>
                  <h3>{f.name}</h3>
                  <p>📍 {f.address}</p>
                  <p>📞 {f.phone}</p>
                  <p>{f.distanceKm} km away</p>
                  <a
                    className="map-link"
                    href={directionsUrl(f.lat, f.lon)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Road Map / Directions →
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p>No nearby facilities found.</p>
          )}

          <button onClick={() => setShowAudit(!showAudit)}>
            {showAudit ? "Cancel" : "Enter real audit data"}
          </button>

          {showAudit && (
            <div className="audit-form">
              <h3>Enter Actual Composition (%)</h3>
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
              <button onClick={handleAuditSubmit}>Submit & Recalibrate</button>
            </div>
          )}

          {/* New: proceed into the processing-center selection flow */}
          <div className="page-nav">
            <button onClick={() => setPhase("selectCenter")}>
              Proceed to Select Processing Center →
            </button>
          </div>

          <div className="page-nav">
            <button onClick={goBack}>Back</button>
            <button onClick={startOver}>Start Over</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
function NearbyCenters({ facilities, onSelect, onBack }) {
  return (
    <div className="page">
      <h2>Choose a Processing Center</h2>
      {facilities.length === 0 && <p>No nearby facilities found.</p>}
      <div className="facility-list">
        {facilities.map((f) => (
          <div className="facility-card" key={f.name}>
            <h3>{f.name}</h3>
            <p>📍 {f.address}</p>
            <p>📞 {f.phone}</p>
            <p>💰 Processing Charge: ₹{f.processingChargePerKg}/kg</p>
            <p>⭐ Rating: {f.rating} / 5</p>
            <p>{f.distanceKm} km away</p>
            <a
              className="map-link"
              href={f.directions}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Road Map / Directions →
            </a>
            <div className="page-nav">
              <button onClick={() => onSelect(f)}>Select This Center</button>
            </div>
          </div>
        ))}
      </div>
      <div className="page-nav">
        <button onClick={onBack}>Back</button>
      </div>
    </div>
  );
}

export default NearbyCenters;
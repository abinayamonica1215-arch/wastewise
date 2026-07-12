function DeliveryConfirmation({ facility, onMarkDelivered, onBack }) {
  return (
    <div className="page">
      <h2>Confirm Delivery</h2>
      {facility ? (
        <div className="facility-card">
          <h3>{facility.name}</h3>
          <p>📍 {facility.address}</p>
          <p>📞 {facility.phone}</p>
          <p>💰 Processing Charge: ₹{facility.processingChargePerKg}/kg</p>
          <p>⭐ Rating: {facility.rating} / 5</p>
        </div>
      ) : (
        <p>No processing center selected.</p>
      )}
      <p>
        Once your waste has physically reached the center, mark it as delivered to generate
        the actual segregation report.
      </p>
      <div className="page-nav">
        <button onClick={onBack}>Back</button>
        <button onClick={onMarkDelivered}>Mark as Delivered</button>
      </div>
    </div>
  );
}

export default DeliveryConfirmation;